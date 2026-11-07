# T-053: changed assertions

Nothing was loosened, skipped, deleted or weakened. Every moved line is listed old -> new.

## Web

| File | Old | New | Why |
|---|---|---|---|
| `tools/verify-density.baseline.json` (line 109) | `sub\|320\|/sync\|Repository access: only Nexline1/brickford. Permissions: Contents → Re` | `sub\|320\|/sync\|Repository access: only Nexline1/brickford-private. Permissions: Conte` | The finding is keyed by the first 70 characters of the line's text, and the text names the repo, which changed. Same item, same route, same width, same kind (`sub`): a rename of one finding, not a new one. |
| `tools/verify-density.baseline.json` (line 125) | the same with `\|390\|` | the same with `\|390\|` | as above |

`tools/verify-sync-loop.js`: no existing assertion, threshold or stub was edited. The existing stubs answer the wildcard
`https://api.github.com/**` and never named the repo, so none needed moving. A new section ("Sync lives in the private repo")
is appended before `browser.close()`, the header comment gains a T-053 paragraph, and the PASS line gains a clause.
`platform/js/app.js` and `platform/index.html` (`?v=20261106a` -> `?v=20261107a`, 34 tokens) are the only other web files changed.

## Flutter

| File | Old | New | Why |
|---|---|---|---|
| `app/test/sync_test.dart` line 110 | `expect(gh.calls, ['GET /repos/Nexline1/brickford/contents/progress/brickford-state.json']);` | `expect(gh.calls, ['GET /repos/Nexline1/brickford-private/contents/progress/brickford-state.json']);` | the repo the pull goes to |
| `app/test/sync_test.dart` line 305 | `enterText(find.byKey(const ValueKey('sync-repo')), 'Nexline1/brickford');` | `enterText(find.byKey(const ValueKey('sync-repo')), 'Nexline1/brickford-private');` | the repo the Connect form is filled with (the default the field now shows) |

The in-test `FakeGitHub` became path-aware: it answers the file path and the repo path, and any other path is recorded in `stray`
and answered 404. That makes `expect(gh.stray, isEmpty)` (already in the first test) stricter, not looser. It also gained
`repoStatus` and `loseAccessOnPut` for the new tests. No existing test's expectations changed beyond the two lines above.
