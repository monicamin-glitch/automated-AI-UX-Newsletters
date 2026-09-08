import assert from 'node:assert/strict';
import { spawn } from 'node:child_process';
import { existsSync, mkdtempSync, readFileSync, rmSync } from 'node:fs';
import { createServer } from 'node:http';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import test from 'node:test';

const html = readFileSync(new URL('../index.html', import.meta.url), 'utf8');
const chromePath = process.env.CHROME_PATH || '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome';
const browserTestRequested = process.env.RUN_BROWSER_TESTS === '1';

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
  ], { stdio: ['ignore', 'ignore', 'pipe'] });
  let launchError;
  let launchExit;
  let launchStderr = '';
  browserProcess.once('error', error => { launchError = error; });
  browserProcess.once('exit', (code, signal) => { launchExit = { code, signal }; });
  browserProcess.stderr.on('data', chunk => {
    launchStderr = (launchStderr + String(chunk)).slice(-2_000);
  });
  let socket;

  try {
    const portFile = join(profileDirectory, 'DevToolsActivePort');
    const port = await waitFor(() => {
      if (launchError) throw new Error(`Unable to launch Chrome at ${chromePath}: ${launchError.message}`);
      if (launchExit) {
        const outcome = launchExit.signal ? `signal ${launchExit.signal}` : `exit code ${launchExit.code}`;
        const details = launchStderr.trim() ? `: ${launchStderr.trim()}` : '';
        throw new Error(`Chrome at ${chromePath} exited before DevTools started (${outcome})${details}`);
      }
      return existsSync(portFile) && Number(readFileSync(portFile, 'utf8').split('\n')[0]);
    });
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

async function settleLayout(browser) {
  await browser.evaluate('new Promise(resolve => requestAnimationFrame(() => resolve(true)))');
}

async function measureLearningLayout(browser, width, height) {
  await browser.setViewport(width, height);
  await settleLayout(browser);
  return browser.evaluate(`(() => {
    const rect = element => { const box = element.getBoundingClientRect(); return { left: box.left, top: box.top, right: box.right, bottom: box.bottom, width: box.width, height: box.height }; };
    const contains = (outer, inner) => inner.left >= outer.left - 0.5 && inner.right <= outer.right + 0.5 && inner.top >= outer.top - 0.5 && inner.bottom <= outer.bottom + 0.5;
    const intersects = (first, second) => { const a = first.getBoundingClientRect(); const b = second.getBoundingClientRect(); return a.left < b.right && a.right > b.left && a.top < b.bottom && a.bottom > b.top; };
    const rail = document.querySelector('.learning-month-label');
    const agenda = document.querySelector('.learning-list');
    const lists = [...document.querySelectorAll('.learning-list')].map(list => {
      const listBox = list.getBoundingClientRect();
      const rows = [...list.querySelectorAll('.learning-row')].map(row => {
        const rowBox = row.getBoundingClientRect();
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
          fieldsInsideAgenda: fields.filter(([, field]) => !contains(listBox, field.getBoundingClientRect())).map(([name]) => name),
          fieldsInsideRow: fields.filter(([, field]) => !contains(rowBox, field.getBoundingClientRect())).map(([name]) => name),
          overlaps,
          presenterInsideTopic: !presenter || (presenterBox.width > 0 && presenterBox.height > 0 && contains(topicBox, presenterBox))
        };
      });
      return {
        contentContained: list.scrollWidth <= list.clientWidth,
        rows
      };
    });
    return {
      width: ${width},
      rail: rect(rail),
      agenda: rect(agenda),
      railBeforeAgenda: rail.getBoundingClientRect().right < agenda.getBoundingClientRect().left,
      labelAboveAgenda: rail.getBoundingClientRect().bottom <= agenda.getBoundingClientRect().top,
      lists
    };
  })()`);
}

test('browser gates Learning Plan layout, navigation, and keyboard contracts', {
  skip: !browserTestRequested,
  timeout: 30_000
}, async t => {
  assert.ok(existsSync(chromePath), `RUN_BROWSER_TESTS=1 requires a Chrome executable at ${chromePath}; set CHROME_PATH to a valid executable`);
  const server = await startServer();
  let browser;
  try {
    browser = await openChrome(server.origin);

    await t.test('contains every agenda field at 1440px and 900px', async t => {
      for (const [width, expectedPlacement] of [[1440, 'rail'], [900, 'stacked']]) {
        await t.test(`${width}px`, async () => {
          const layout = await measureLearningLayout(browser, width, 1000);
          const violations = layout.lists.flatMap((list, listIndex) => [
            ...(!list.contentContained ? [`list ${listIndex} scroll content`] : []),
            ...list.rows.flatMap((row, rowIndex) => [
              ...row.fieldsInsideAgenda.map(field => `list ${listIndex} row ${rowIndex} ${field} outside agenda`),
              ...row.fieldsInsideRow.map(field => `list ${listIndex} row ${rowIndex} ${field} outside row`),
              ...row.overlaps.map(pair => `list ${listIndex} row ${rowIndex} ${pair} overlap`),
              ...(!row.presenterInsideTopic ? [`list ${listIndex} row ${rowIndex} presenter outside topic`] : [])
            ])
          ]);
          assert.deepEqual(violations, [], `${width}px must keep every field fully inside its agenda/list`);
          assert.equal(expectedPlacement === 'rail' ? layout.railBeforeAgenda : layout.labelAboveAgenda, true, `${width}px must use the ${expectedPlacement} month layout`);
        });
      }
    });

    await t.test('preserves the 390px mobile flow', async () => {
      await browser.setViewport(390, 844);
      await settleLayout(browser);
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
    });

    await t.test('focuses and activates Learning Plan through keyboard navigation', async () => {
      const startingPage = await browser.evaluate(`(() => {
        document.querySelector('.nav-tab[data-page="latest"]').click();
        window.__learningPlanKeyboardMarker = 'preserved';
        document.activeElement?.blur();
        return document.querySelector('.page.active')?.id;
      })()`);
      assert.equal(startingPage, 'page-latest');
      const navStops = [];
      for (let index = 0; index < 4; index += 1) {
        await browser.send('Input.dispatchKeyEvent', { type: 'keyDown', key: 'Tab', code: 'Tab', windowsVirtualKeyCode: 9 });
        await browser.send('Input.dispatchKeyEvent', { type: 'keyUp', key: 'Tab', code: 'Tab', windowsVirtualKeyCode: 9 });
        navStops.push(await browser.evaluate('document.activeElement?.dataset.page || null'));
      }
      assert.deepEqual(navStops, ['latest', 'all', 'resources', 'learning'], 'Tab must reach Learning Plan after the other three navigation links');
      await browser.send('Input.dispatchKeyEvent', { type: 'keyDown', key: 'Enter', code: 'Enter', windowsVirtualKeyCode: 13 });
      await browser.send('Input.dispatchKeyEvent', { type: 'keyUp', key: 'Enter', code: 'Enter', windowsVirtualKeyCode: 13 });
      await settleLayout(browser);
      assert.deepEqual(await browser.evaluate(`({
        page: document.querySelector('.page.active')?.id,
        tab: document.querySelector('.nav-tab.active')?.dataset.page,
        focused: document.activeElement?.dataset.page,
        marker: window.__learningPlanKeyboardMarker
      })`), {
        page: 'page-learning',
        tab: 'learning',
        focused: 'learning',
        marker: 'preserved'
      }, 'Enter on the Learning Plan link must enhance in place and activate matching page/tab state');
    });

    await t.test('tabs through active actions with an opaque high-contrast focus outline', async () => {
      await browser.evaluate(`(() => {
        document.querySelector('.nav-tab[data-page="learning"]').click();
        document.querySelector('.nav-tabs').inert = true;
        document.body.tabIndex = -1;
        document.body.focus();
        document.body.removeAttribute('tabindex');
      })()`);
      const actionStops = [];
      for (let index = 0; index < 5; index += 1) {
      await browser.send('Input.dispatchKeyEvent', { type: 'keyDown', key: 'Tab', code: 'Tab', windowsVirtualKeyCode: 9 });
      await browser.send('Input.dispatchKeyEvent', { type: 'keyUp', key: 'Tab', code: 'Tab', windowsVirtualKeyCode: 9 });
        actionStops.push(await browser.evaluate(`(() => {
          const active = document.activeElement;
          const style = getComputedStyle(active);
          return {
            actionIndex: [...document.querySelectorAll('.learning-action')].indexOf(active),
            disabled: !!active.disabled,
            outlineStyle: style.outlineStyle,
            outlineWidth: style.outlineWidth,
            outlineOffset: style.outlineOffset,
            outlineColor: style.outlineColor
          };
        })()`));
      }
      await browser.evaluate(`document.querySelector('.nav-tabs').inert = false`);
      assert.deepEqual(actionStops.map(stop => stop.actionIndex), [0, 1, 2, 3, 4], 'Tab must reach exactly the five active actions in order');
      assert.deepEqual(actionStops.map(stop => stop.disabled), Array.from({ length: 5 }, () => false), 'disabled actions must be skipped');
      assert.deepEqual(actionStops.map(stop => [stop.outlineStyle, stop.outlineWidth, stop.outlineOffset, stop.outlineColor]), Array.from({ length: 5 }, () => ['solid', '3px', '2px', 'rgb(29, 78, 216)']), 'each active action must use the opaque primary-dark focus outline with at least 3:1 contrast against white');
      assert.equal(await browser.evaluate(`document.querySelectorAll('.learning-action-disabled[disabled]').length`), 6, 'six disabled actions must remain unavailable');
    });

    assert.deepEqual(browser.runtimeErrors(), [], 'browser runtime must remain error-free');
  } finally {
    await browser?.close();
    await server.close();
  }
});
