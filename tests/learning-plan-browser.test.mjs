import assert from 'node:assert/strict';
import { spawn } from 'node:child_process';
import { existsSync, mkdtempSync, readFileSync, rmSync } from 'node:fs';
import { createServer } from 'node:http';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import test from 'node:test';

const html = readFileSync(new URL('../index.html', import.meta.url), 'utf8');
const chromePath = process.env.CHROME_PATH || '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome';
const browserTestEnabled = process.env.RUN_BROWSER_TESTS === '1' && existsSync(chromePath);

const wait = milliseconds => new Promise(resolve => setTimeout(resolve, milliseconds));

async function waitFor(check, timeout = 10_000) {
  const started = Date.now();
  while (Date.now() - started < timeout) {
    const value = await check();
    if (value) return value;
    await wait(50);
  }
  throw new Error(`Timed out after ${timeout}ms`);
}

async function startServer() {
  const server = createServer((_request, response) => {
    response.writeHead(200, { 'content-type': 'text/html; charset=utf-8' });
    response.end(html);
  });
  await new Promise((resolve, reject) => {
    server.once('error', reject);
    server.listen(0, '127.0.0.1', resolve);
  });
  const { port } = server.address();
  return {
    origin: `http://127.0.0.1:${port}`,
    close: () => new Promise(resolve => server.close(resolve))
  };
}

async function openChrome(origin) {
  const profileDirectory = mkdtempSync(join(tmpdir(), 'learning-plan-browser-'));
  const browserProcess = spawn(chromePath, [
    '--headless=new',
    '--disable-background-networking',
    '--disable-default-apps',
    '--disable-extensions',
    '--disable-gpu',
    '--no-first-run',
    '--no-default-browser-check',
    '--remote-debugging-port=0',
    `--user-data-dir=${profileDirectory}`,
    'about:blank'
  ], { stdio: 'ignore' });
  let socket;

  try {
    const portFile = join(profileDirectory, 'DevToolsActivePort');
    const port = await waitFor(() => existsSync(portFile) && Number(readFileSync(portFile, 'utf8').split('\n')[0]));
    const target = await waitFor(async () => {
      try {
        const targets = await (await fetch(`http://127.0.0.1:${port}/json/list`)).json();
        return targets.find(candidate => candidate.type === 'page');
      } catch {
        return null;
      }
    });
    socket = new WebSocket(target.webSocketDebuggerUrl);
    await new Promise((resolve, reject) => {
      socket.addEventListener('open', resolve, { once: true });
      socket.addEventListener('error', reject, { once: true });
    });

    let commandId = 0;
    const pending = new Map();
    const runtimeErrors = [];
    socket.addEventListener('message', event => {
      const message = JSON.parse(String(event.data));
      if (message.method === 'Runtime.exceptionThrown') runtimeErrors.push(message.params.exceptionDetails.exception?.description || message.params.exceptionDetails.text);
      if (message.method === 'Runtime.consoleAPICalled' && message.params.type === 'error') runtimeErrors.push(message.params.args.map(argument => argument.value || argument.description || '').join(' '));
      if (!message.id || !pending.has(message.id)) return;
      const { resolve, reject } = pending.get(message.id);
      pending.delete(message.id);
      message.error ? reject(new Error(message.error.message)) : resolve(message.result);
    });
    const send = (method, params = {}) => new Promise((resolve, reject) => {
      const id = ++commandId;
      pending.set(id, { resolve, reject });
      socket.send(JSON.stringify({ id, method, params }));
    });
    const evaluate = async expression => {
      const result = await send('Runtime.evaluate', { expression, awaitPromise: true, returnByValue: true });
      if (result.exceptionDetails) throw new Error(result.exceptionDetails.exception?.description || result.exceptionDetails.text);
      return result.result.value;
    };
    const setViewport = (width, height) => send('Emulation.setDeviceMetricsOverride', {
      width, height, deviceScaleFactor: 1, mobile: false, screenWidth: width, screenHeight: height
    });

    await send('Page.enable');
    await send('Runtime.enable');
    await setViewport(1440, 1000);
    await send('Page.navigate', { url: `${origin}/index.html?page=learning` });
    await waitFor(async () => await evaluate('document.readyState') === 'complete');

    return {
      evaluate,
      send,
      setViewport,
      runtimeErrors: () => [...runtimeErrors],
      async close() {
        socket.close();
        browserProcess.kill('SIGTERM');
        await Promise.race([new Promise(resolve => browserProcess.once('exit', resolve)), wait(2_000)]);
        rmSync(profileDirectory, { recursive: true, force: true });
      }
    };
  } catch (error) {
    socket?.close();
    browserProcess.kill('SIGTERM');
    rmSync(profileDirectory, { recursive: true, force: true });
    throw error;
  }
}

test('browser gates Learning Plan desktop, mobile, navigation, and keyboard contracts', {
  skip: !browserTestEnabled,
  timeout: 30_000
}, async () => {
  const server = await startServer();
  let browser;
  try {
    browser = await openChrome(server.origin);

    const desktop = await browser.evaluate(`(() => {
      const rect = element => { const box = element.getBoundingClientRect(); return { left: box.left, top: box.top, right: box.right, bottom: box.bottom, width: box.width, height: box.height }; };
      const intersects = (first, second) => { const a = first.getBoundingClientRect(); const b = second.getBoundingClientRect(); return a.left < b.right && a.right > b.left && a.top < b.bottom && a.bottom > b.top; };
      const rail = document.querySelector('.learning-month-label');
      const agenda = document.querySelector('.learning-list');
      const rows = [...document.querySelectorAll('.learning-row')].map(row => {
        const topic = row.querySelector('.learning-topic-wrap');
        const presenter = row.querySelector('.learning-presenter');
        const fields = [
          ['date', row.querySelector('.learning-date')],
          ['topic', topic],
          ['duration', row.querySelector('.learning-duration')],
          ['type', row.querySelector('.learning-type-wrap')],
          ['action', row.querySelector('.learning-action, .learning-action-disabled')]
        ];
        const overlaps = fields.flatMap(([name, field], index) => fields.slice(index + 1)
          .filter(([, other]) => intersects(field, other))
          .map(([otherName]) => name + '/' + otherName));
        const topicBox = topic.getBoundingClientRect();
        const presenterBox = presenter?.getBoundingClientRect();
        return {
          overlaps,
          presenterInsideTopic: !presenter || (presenterBox.width > 0 && presenterBox.height > 0 && presenterBox.left >= topicBox.left && presenterBox.right <= topicBox.right && presenterBox.top >= topicBox.top && presenterBox.bottom <= topicBox.bottom)
        };
      });
      return { rail: rect(rail), agenda: rect(agenda), rows };
    })()`);
    assert.ok(desktop.rail.right < desktop.agenda.left, 'desktop month rail must remain before the agenda');
    const desktopRowsValid = desktop.rows.every(row => row.overlaps.length === 0 && row.presenterInsideTopic);
    assert.equal(desktopRowsValid, true, 'desktop field geometry must reject overlapping fields or presenter overflow');
    assert.deepEqual(desktop.rows.map(row => row.overlaps), Array.from({ length: 11 }, () => []), 'desktop date/topic/duration/type/action fields must never overlap');
    assert.deepEqual(desktop.rows.map(row => row.presenterInsideTopic), Array.from({ length: 11 }, () => true), 'desktop presenter metadata must remain visible inside its topic wrapper');

    await browser.setViewport(390, 844);
    const mobile = await browser.evaluate(`(() => {
      const intersects = (first, second) => { const a = first.getBoundingClientRect(); const b = second.getBoundingClientRect(); return a.left < b.right && a.right > b.left && a.top < b.bottom && a.bottom > b.top; };
      const geometry = element => {
        const box = element.getBoundingClientRect();
        return { left: box.left, top: box.top, right: box.right, bottom: box.bottom, visible: box.width > 0 && box.height > 0, inBounds: box.left >= 0 && box.right <= document.documentElement.clientWidth };
      };
      const label = document.querySelector('.learning-month-label').getBoundingClientRect();
      const agenda = document.querySelector('.learning-list').getBoundingClientRect();
      const actions = [...document.querySelectorAll('.learning-action, .learning-action-disabled')].map(action => {
        const box = action.getBoundingClientRect();
        return { visible: box.width > 0 && box.height > 0, inBounds: box.left >= 0 && box.right <= document.documentElement.clientWidth };
      });
      const rows = [...document.querySelectorAll('.learning-row')].map(row => {
        const date = row.querySelector('.learning-date');
        const topicColumn = row.querySelector('.learning-topic-wrap');
        const topic = row.querySelector('.learning-topic');
        const presenter = row.querySelector('.learning-presenter');
        const duration = row.querySelector('.learning-duration');
        const type = row.querySelector('.learning-type');
        const action = row.querySelector('.learning-action, .learning-action-disabled');
        const topicColumnBox = topicColumn.getBoundingClientRect();
        const presenterBox = presenter?.getBoundingClientRect();
        return {
          dateLeftOfTopic: date.getBoundingClientRect().right <= topicColumnBox.left,
          fieldsVisible: [date, topic, duration, type, action].every(field => { const value = geometry(field); return value.visible && value.inBounds; }),
          presenterInsideTopic: !presenter || (presenterBox.width > 0 && presenterBox.height > 0 && presenterBox.left >= topicColumnBox.left && presenterBox.right <= topicColumnBox.right && presenterBox.top >= topicColumnBox.top && presenterBox.bottom <= topicColumnBox.bottom),
          flowTopToBottom: topicColumnBox.bottom <= duration.getBoundingClientRect().top && duration.getBoundingClientRect().bottom <= type.getBoundingClientRect().top && type.getBoundingClientRect().bottom <= action.getBoundingClientRect().top,
          flowNonOverlapping: !intersects(topicColumn, duration) && !intersects(duration, type) && !intersects(type, action)
        };
      });
      return {
        scrollWidth: document.documentElement.scrollWidth,
        clientWidth: document.documentElement.clientWidth,
        labelAboveAgenda: label.bottom <= agenda.top,
        actionCount: actions.length,
        actions,
        rows
      };
    })()`);
    assert.equal(mobile.scrollWidth, mobile.clientWidth, '390px page must not overflow horizontally');
    assert.equal(mobile.labelAboveAgenda, true, '390px month label must sit above its agenda');
    assert.equal(mobile.actionCount, 11, '390px page must render all 11 Learning Plan actions');
    assert.deepEqual(mobile.actions, Array.from({ length: 11 }, () => ({ visible: true, inBounds: true })), '390px actions must be visible and in bounds');
    assert.equal(mobile.rows.length, 11, '390px page must retain all 11 Learning Plan rows');
    const mobileRowsValid = mobile.rows.every(row => row.dateLeftOfTopic && row.fieldsVisible && row.presenterInsideTopic && row.flowTopToBottom && row.flowNonOverlapping);
    assert.equal(mobileRowsValid, true, '390px row geometry must reject missing, overlapping, or misplaced fields');
    assert.deepEqual(mobile.rows.map(row => row.dateLeftOfTopic), Array.from({ length: 11 }, () => true), '390px dates must remain visibly left of the topic column');
    assert.deepEqual(mobile.rows.map(row => row.fieldsVisible), Array.from({ length: 11 }, () => true), '390px topic, duration, type, and action fields must remain visible and in bounds');
    assert.deepEqual(mobile.rows.map(row => row.presenterInsideTopic), Array.from({ length: 11 }, () => true), '390px presenter metadata must remain visible inside its topic wrapper');
    assert.deepEqual(mobile.rows.map(row => row.flowTopToBottom), Array.from({ length: 11 }, () => true), '390px topic, duration, type, and action fields must flow top to bottom');
    assert.deepEqual(mobile.rows.map(row => row.flowNonOverlapping), Array.from({ length: 11 }, () => true), '390px topic, duration, type, and action fields must not overlap');

    const navigation = await browser.evaluate(`(() => ['latest', 'all', 'resources', 'learning'].map(page => { const tab = document.querySelector('.nav-tab[data-page="' + page + '"]'); tab.click(); return { page: document.querySelector('.page.active')?.id, tab: document.querySelector('.nav-tab.active')?.dataset.page }; }))()`);
    assert.deepEqual(navigation, [
      { page: 'page-latest', tab: 'latest' },
      { page: 'page-all', tab: 'all' },
      { page: 'page-resources', tab: 'resources' },
      { page: 'page-learning', tab: 'learning' }
    ], 'each navigation tab must activate its matching page');

    assert.equal(await browser.evaluate(`(() => { document.body.focus(); return document.activeElement.tagName; })()`), 'BODY');
    const tabStops = [];
    for (let index = 0; index < 6; index += 1) {
      await browser.send('Input.dispatchKeyEvent', { type: 'keyDown', key: 'Tab', code: 'Tab', windowsVirtualKeyCode: 9 });
      await browser.send('Input.dispatchKeyEvent', { type: 'keyUp', key: 'Tab', code: 'Tab', windowsVirtualKeyCode: 9 });
      tabStops.push(await browser.evaluate(`(() => { const active = document.activeElement; const style = getComputedStyle(active); return { actionIndex: [...document.querySelectorAll('.learning-action')].indexOf(active), disabled: !!active.disabled, outlineStyle: style.outlineStyle, outlineWidth: style.outlineWidth }; })()`));
    }
    const actionStops = tabStops.filter(stop => stop.actionIndex >= 0);
    assert.deepEqual(actionStops.map(stop => stop.actionIndex), [0, 1, 2, 3, 4], 'Tab must reach exactly the five active actions in order');
    assert.deepEqual(tabStops.map(stop => stop.disabled), Array.from({ length: 6 }, () => false), 'disabled actions must be skipped');
    assert.deepEqual(actionStops.map(stop => [stop.outlineStyle, stop.outlineWidth]), Array.from({ length: 5 }, () => ['solid', '3px']), 'each active action must have a visible 3px solid focus outline');
    assert.equal(await browser.evaluate(`document.querySelectorAll('.learning-action-disabled[disabled]').length`), 6, 'six disabled actions must remain unavailable');
    assert.deepEqual(browser.runtimeErrors(), [], 'browser runtime must remain error-free');
  } finally {
    await browser?.close();
    await server.close();
  }
});
