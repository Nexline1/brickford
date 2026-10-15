# Brickford loop: config

training_mode: on          # pause before DISCOVER output, BUILD and SHIP; wait for "go"
pr_tool: github-mcp        # cloud sessions: GitHub MCP create_pull_request. On the PC: gh
                           # (PC setup: `winget install GitHub.cli` then `gh auth login`)
base_branch: main          # PRs target main. The loop never pushes to main and never merges.

## Stack
A static, zero-dependency vanilla-JS single-page app. `platform/index.html` loads
`platform/js/*.js` and `platform/data/*.js` (content as `window.DAR` globals). It is
hosted on GitHub Pages from `main`. There is no package.json, bundler or framework.

## Commands
| Kind | Command |
|---|---|
| install | none (zero deps). Playwright 1.56.1 is global: `require("/opt/node22/lib/node_modules/playwright")`, Chromium at `/opt/pw-browsers` |
| dev server | `python3 platform/server.py`, then http://localhost:8137/platform/ (the harnesses use `file://<repo>/platform/index.html`) |
| build | none: static files |
| typecheck | `for f in platform/js/*.js platform/data/*.js tools/*.js; do node --check "$f" \|\| exit 1; done` |
| lint | none |
| unit / content | `node tools/verify-content.js` · `node tools/verify-sync-loop.js` |
| e2e / visual | `node tools/verify-shell.js` · `node tools/verify-contrast.js` |
| added by T-000 | `node tools/verify-logic.js` · `node tools/verify-flows.js` · `node tools/verify-clip.js` |
| added by T-005 | `node tools/verify-design.js` |

CHECK = typecheck, then every command in the unit and e2e rows, then T-000's rows once
T-000 is merged, then T-005's row (verify-design). All must exit 0. Run long gates in the
background and wait for them to finish (foreground `sleep` is blocked in cloud sessions).

## PROTECTED (never touch without a spec naming the path AND owner approval)
- `progress/brickford-state.json` (synced study progress, written to `main` by the app)
- browser localStorage `darhikmah_v1` (progress state). Test only in fresh browser contexts.
- browser localStorage `brickford_gh_token`: a SECRET. Never read, print or log it.
- `platform/data/curriculum.js` (START_DATE, courses, units, lessons: the 3-year plan)
- `platform/data/` (every other file: question banks, summaries, concepts, workshop, storytelling)
- `progress-log.md`, `coding-diagnostic.md`, `earning-offers.md`, `phase-1-curriculum.md`
- `docs/storytelling/` (bank, practice, rejections) · `data/storytelling/`
- `docs/CONTENT-STANDARD.md`
- `.env` and any secrets file: never read or print
- No migration that drops or rewrites stored data (the `S` shape in `app.js` load/save and `streakFrom` merge rules)

## Caps
- max proposals per run: 3 (never set your own proposals to ready)
- max build/review rounds per item: 3, then blocked
- same failure twice in a row: blocked
- 2 blocked items in a row: end the run
- max PRs opened per run: 3
- lessons.md: at most 60 lines, at most 2 new lessons per item
