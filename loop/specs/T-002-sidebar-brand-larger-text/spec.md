# T-002: The sidebar brand fits at larger text sizes

## Problem
At a 24px root on 768–1440px widths, the sidebar crest's wordmark `div.name-en`
("BRICKFORD", 230px in a 206px column) spills past the sidebar edge on all 32 routes.
- Cause: `.crest .name-en` in `platform/css/style.css:484-488` is `1.3rem` with
  `letter-spacing: 0.14em`, so it scales with the root while the sidebar width doesn't.
- Evidence: `verify-clip` baseline entries tagged T-002.

## Learner outcome
The sidebar reads cleanly on a laptop with enlarged text. The brand no longer runs into
the page, and the navigation below it is not pushed around.

## Scope
CSS only: make the wordmark fit the sidebar column at any root size, for example by
clamping its size to the column or reducing the tracking at large roots. Bump the `?v=`
cache tokens.

## Out of scope
- the phone running head
- the tab bar (T-001)
- other clipping (T-003)
- PROTECTED paths

## Acceptance criteria
1. No `div.crest` or `div.name-en` finding remains at any width or root, and every T-002
   baseline line is deleted. No entry is added.
2. At a 16px root the crest looks unchanged. Evidence: before and after screenshots at
   1280px.
3. All gates are green. `verify-shell` confirms the sidebar is still visible and unstyled
   inline.
