# T-024 "switch (c)" (the known flake, T-039), measured in isolation: only verify-design's switch (a)/(c) block,
# 12 runs per invocation, alternating trees, one invocation at a time. Trees extracted with git archive into a
# scratch directory: base = 45fdf55 (origin/main this branch was cut from), head = 3dcb96a (this branch, final bytes).
# The block's code is byte-identical in both trees (git diff 45fdf55 HEAD -- tools/verify-design.js does not touch it).
#
# base: 3 of 12, then 1 of 12  ->  4 of 24
# head: 1 of 12, then 1 of 12  ->  2 of 24
# The flake is present at the base commit at a comparable rate; this branch does not introduce it.
