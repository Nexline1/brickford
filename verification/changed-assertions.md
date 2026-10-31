# T-063 changed assertions

None changed, loosened, skipped or deleted. Added only:
- tools/verify-logic.js: 3 new checks (rest day: past days equal the Friday's; rest day schedules nothing; before start day 1 is the fixed plan).
- tools/verify-design.js: 2 new checks (day view tick / half ring / empty ring, dark and light at 390px) + no-page-errors x2.

Pinned clocks: no existing fixture sits on a rest day whose expectation depended on the bug (all pass unchanged).
Clip baseline untouched (see check-clip.txt).
