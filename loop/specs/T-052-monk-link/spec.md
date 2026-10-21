# T-052: Monk Mode on the Brickford dashboard

Owner, 2026-10-23: "add it to brickford". "It" is the 90-day monk-mode dashboard (https://claude.ai/artifact/44WXCMiUaxiwt6jebgcS2Z, private to the owner).

## What
- The dashboard has a "Monk Mode · Day N of 90" group directly under the lead card, holding one row: "Open today's dashboard" (prayers, habits, tomorrow's plan). It opens the page in a new tab (`target=_blank rel=noopener`).
- N counts calendar days from 22 Oct 2026, Saturdays included. The group shows on days 1–90 (22 Oct 2026 – 19 Jan 2027) and nowhere else.
- The page itself is not embedded. It is a claude.ai page that reads the owner's calendar and Gmail through claude.ai, which this app can't do.

## Acceptance
1. `monkDay`: 21 Oct → none, 22 Oct → 1, 24 Oct (a Saturday) → 3, 19 Jan → 90, 20 Jan → none. Checked in verify-logic through the test hook.
2. On the in-window dates, the dashboard row's href is the page URL, it opens in a new tab and it is at least 44px. On the out-of-window dates there is no row. Checked in verify-logic.
3. Plant: an off-by-one `monkDay` makes verify-logic exit 1.
4. All gates pass. The `?v=` tokens are bumped.
