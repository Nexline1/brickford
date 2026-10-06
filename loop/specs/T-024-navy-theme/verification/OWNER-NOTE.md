# T-024: why your phone may still open in Paper

Navy is the new default, but only for a device that has never stored a theme.

Until this change, the app's built-in settings said `theme: "light"`, and every device wrote
that into its saved progress the first time it saved anything, whether or not you ever opened
the Theme menu. So any device you have already used most likely has "light" stored.

The spec says a stored choice is never rewritten, so **those devices stay on Paper until you
pick Navy once** (Theme menu, second item, after Auto). After that they stay on Navy.

Nothing switches them for you. Changing a stored setting automatically would be a migration of
saved data. That is PROTECTED, so it would need its own spec and your approval.
