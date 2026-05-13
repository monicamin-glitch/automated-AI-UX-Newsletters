# Collaboration Guide

How you and your colleague (monicamin-glitch) work together on the automated-AI-UX-Newsletters project using GitHub.

---

## Your Setup (Already Done)

| Step | Status |
|------|--------|
| Repo cloned to `~/Claude Code Projects/automated-AI-UX-Newsletters/` | Done |
| `digest.md` copied to `~/.claude/skills/` | Done |
| Paths updated for your machine | Done |
| You can now run `/digest` in Claude Code | Ready |

---

## How the Collaboration Works

You and your colleague both work on the **same repository**. GitHub keeps everything in sync.

```
Your Mac                          GitHub                         Colleague's Mac
─────────                         ──────                         ───────────────
index.html  ──── git push ────►  Repository  ◄──── git push ──── index.html
            ◄─── git pull ────                ───── git pull ────►
digest.md   ──── git push ────►             ◄──── git push ──── digest.md
```

---

## Daily Workflow: The 3 Commands You Need

### Before you start working — always pull first

```bash
cd "/Users/zwang5/Claude Code Projects/automated-AI-UX-Newsletters"
git pull
```

This downloads any changes your colleague made since you last worked. **Always do this before editing.**

### After you make changes — push to share

```bash
cd "/Users/zwang5/Claude Code Projects/automated-AI-UX-Newsletters"
git add .
git commit -m "Brief description of what you changed"
git push
```

This uploads your changes so your colleague can see them.

### If you just want to see what changed

```bash
cd "/Users/zwang5/Claude Code Projects/automated-AI-UX-Newsletters"
git log --oneline -5
```

Shows the last 5 changes (by either of you).

---

## Avoiding Conflicts (Overwriting Each Other's Work)

### The Golden Rule

> **Always `git pull` before you start working.** This prevents most conflicts.

### What if you both edited the same file?

If your colleague pushed changes to `index.html` while you were also editing it, Git will tell you there's a **merge conflict**. Here's what to do:

1. Git will show you both versions of the conflicting lines
2. Choose which version to keep (or combine them)
3. Save, commit, and push

**In practice**, this rarely happens because:
- The `/digest` skill replaces the *content* of `index.html` each week (not the structure)
- Only one of you will typically run `/digest` on any given week

### Best Practice: Communicate

- Agree on who runs `/digest` each week (or alternate)
- If you're making structural changes to `index.html` or `digest.md`, let your colleague know
- Use commit messages that explain *what* you changed

---

## Common Scenarios

### Scenario 1: Your colleague ran /digest and you want to see the latest

```bash
cd "/Users/zwang5/Claude Code Projects/automated-AI-UX-Newsletters"
git pull
open index.html   # Opens in your browser
```

### Scenario 2: You want to run /digest this week

```bash
cd "/Users/zwang5/Claude Code Projects/automated-AI-UX-Newsletters"
git pull           # Get latest first
```
Then run `/digest` in Claude Code. It will automatically update `index.html` and push.

### Scenario 3: You want to improve the digest.md skill

1. Edit `digest.md` in the repo
2. Copy the updated version to your skills folder:
   ```bash
   cp "/Users/zwang5/Claude Code Projects/automated-AI-UX-Newsletters/digest.md" ~/.claude/skills/
   ```
3. Push so your colleague gets it too:
   ```bash
   cd "/Users/zwang5/Claude Code Projects/automated-AI-UX-Newsletters"
   git add digest.md
   git commit -m "Updated digest skill: [what you changed]"
   git push
   ```

### Scenario 4: Your colleague improved digest.md

```bash
cd "/Users/zwang5/Claude Code Projects/automated-AI-UX-Newsletters"
git pull
cp digest.md ~/.claude/skills/    # Update your local skill
```

---

## Quick Reference Card

| I want to... | Command |
|---|---|
| Get latest changes | `git pull` |
| See recent history | `git log --oneline -5` |
| Save & share my work | `git add . && git commit -m "message" && git push` |
| See what I changed | `git status` |
| See the diff | `git diff` |
| Open the website locally | `open index.html` |
| Update my local skill | `cp digest.md ~/.claude/skills/` |

---

## File Responsibilities

| File | What it does | Who edits it |
|------|-------------|-------------|
| `index.html` | The newsletter website | `/digest` command (automatically) |
| `digest.md` | The skill that powers `/digest` | Either of you (to improve sources, formatting, etc.) |
