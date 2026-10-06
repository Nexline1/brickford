# T-024: how existing devices switch to navy

You decided on 2026-10-06: "switch existing devices to navy automatically, then ship it".

**What happens.** Every device you have already used most likely has "light" stored. That is
not because you chose it: until this change the app wrote "light" on every device's first save.
The first time such a device opens this version, it opens in **Navy**, with a navy status bar
and no flash of the old Paper look on the way.

**It happens once per device.** Each device keeps its own marker, `themeNavyOnce`. Once a device
has switched, or once you pick any theme from the Theme menu, it is never switched again. So if
you want Paper back on a device, pick **Paper** in the Theme menu and it stays Paper.

**What does not change.**
- Any other theme you picked (Auto, Parchment, Forest, Midnight, Latte, Slate) stays as it is.
- Opening the app writes nothing and pushes nothing. The switch is saved with the next thing
  you save on that device, such as marking a lecture watched.
- Syncing never carries the marker or the theme between devices. Each device switches on its own.

**One edge.** Restoring a backup made before this change brings back the old "light" setting,
so that device switches to Navy again on its next load. Pick Paper once afterwards if you want
it.
