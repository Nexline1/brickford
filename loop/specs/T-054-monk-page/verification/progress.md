# T-054 progress

- [x] Spec and reference committed unchanged (993c193).
- [x] Amendment 2026-10-23 (owner) recorded in spec.md; reference `planFor` updated (combined prayers, no Jumu'ah).
- [ ] app.js: constants, state, merge, payload, V.monk, wiring; sidebar link; dashboard row; CSS; ?v= bump
- [ ] verify-logic: prayer table, score, weekly sums, Sunday weeks, combine on/off
- [ ] verify-sync-loop: privacy (no monk in push, no push armed, pull keeps monk), flipped-constant merge
- [ ] verify-flows: one write per action at 390/1280, opening writes nothing, tomorrow's plan
- [ ] verify-design: #/monk 1440/390 x Dark/Light
- [ ] verify-shell / contrast / clip: route added, sidebar count
- [ ] Plants (a) write during render, (b) monk in push, (c) prayerTimes off-by-one: each exits 1
- [ ] All gates green; screenshots
