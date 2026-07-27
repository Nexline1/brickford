// Brickford — Figure library
// Hand-drawn SVG for the ideas that carry the most weight. Every figure is
// parametric, theme-aware (it borrows the CSS custom properties, so all six
// themes work), sized by viewBox so it stays legible at 320px, and stroked so
// the important line can be drawn on rather than appearing.
//
// Registry: DAR.FIG[id](opts) -> svg string.  Adding a figure means adding one
// function here and referencing its id from a concept.
(function () {
  window.DAR = window.DAR || {};

  // ---- primitives -----------------------------------------------------------
  const A = "var(--accent)", A2 = "var(--accent-2)", INK = "var(--ink)",
        DIM = "var(--ink-3)", LINE = "var(--line)", BAD = "var(--bad)", GOOD = "var(--good)";

  function svg(w, h, body, aria) {
    return '<svg class="fig" viewBox="0 0 ' + w + " " + h + '" role="img" aria-label="' +
      String(aria || "").replace(/"/g, "&quot;") + '">' + body + "</svg>";
  }
  // Faint reference grid — gives the eye a sense of scale without shouting.
  function grid(x0, y0, w, h, step) {
    let s = "";
    for (let x = x0; x <= x0 + w + 0.01; x += step)
      s += '<line x1="' + x.toFixed(1) + '" y1="' + y0 + '" x2="' + x.toFixed(1) + '" y2="' + (y0 + h) + '" stroke="' + LINE + '" stroke-width="0.7"/>';
    for (let y = y0; y <= y0 + h + 0.01; y += step)
      s += '<line x1="' + x0 + '" y1="' + y.toFixed(1) + '" x2="' + (x0 + w) + '" y2="' + y.toFixed(1) + '" stroke="' + LINE + '" stroke-width="0.7"/>';
    return s;
  }
  // Arrowheads are drawn as polygons rather than markers so figures never
  // collide over a shared marker id.
  function arrow(x1, y1, x2, y2, color, width, cls) {
    const a = Math.atan2(y2 - y1, x2 - x1), L = 7.5, W = 3.6;
    const bx = x2 - L * Math.cos(a), by = y2 - L * Math.sin(a);
    const p = [
      [x2, y2],
      [bx - W * Math.sin(a), by + W * Math.cos(a)],
      [bx + W * Math.sin(a), by - W * Math.cos(a)],
    ].map(q => q[0].toFixed(1) + "," + q[1].toFixed(1)).join(" ");
    return '<line x1="' + x1.toFixed(1) + '" y1="' + y1.toFixed(1) + '" x2="' + bx.toFixed(1) + '" y2="' + by.toFixed(1) +
      '" stroke="' + color + '" stroke-width="' + (width || 2) + '" stroke-linecap="round"' + (cls ? ' class="' + cls + '"' : "") + "/>" +
      '<polygon points="' + p + '" fill="' + color + '"/>';
  }
  function label(x, y, t, color, anchor, size) {
    return '<text x="' + x + '" y="' + y + '" fill="' + (color || DIM) + '" text-anchor="' + (anchor || "middle") +
      '" class="fig-t" style="font-size:' + (size || 11) + 'px;">' + t + "</text>";
  }
  function dot(x, y, color, r) {
    return '<circle cx="' + x + '" cy="' + y + '" r="' + (r || 3.2) + '" fill="' + (color || A) + '"/>';
  }
  // A small pair of axes with the origin at (ox,oy) and `u` pixels per unit.
  function axes(ox, oy, left, right, up, down) {
    return '<line x1="' + (ox - left) + '" y1="' + oy + '" x2="' + (ox + right) + '" y2="' + oy + '" stroke="' + DIM + '" stroke-width="1"/>' +
      '<line x1="' + ox + '" y1="' + (oy - up) + '" x2="' + ox + '" y2="' + (oy + down) + '" stroke="' + DIM + '" stroke-width="1"/>';
  }
  // Panel caption used by the multi-step figures.
  function cap(x, y, t) { return label(x, y, t, DIM, "middle", 10); }

  const F = {};

  // 1 — a vector is a displacement, and addition is "walk one, then the other"
  F.figVectorAdd = function () {
    const ox = 46, oy = 128, u = 26;
    const U = [2, 1], V = [1, 2];
    const px = v => ox + v[0] * u, py = v => oy - v[1] * u;
    const S = [U[0] + V[0], U[1] + V[1]];
    return svg(320, 160,
      grid(ox - 26, oy - 104, 234, 130, u) + axes(ox, oy, 26, 208, 104, 26) +
      '<line x1="' + px(U) + '" y1="' + py(U) + '" x2="' + px(S) + '" y2="' + py(S) + '" stroke="' + DIM + '" stroke-width="1.3" stroke-dasharray="4 3"/>' +
      '<line x1="' + px(V) + '" y1="' + py(V) + '" x2="' + px(S) + '" y2="' + py(S) + '" stroke="' + DIM + '" stroke-width="1.3" stroke-dasharray="4 3"/>' +
      arrow(ox, oy, px(U), py(U), A, 2.2) + arrow(ox, oy, px(V), py(V), A2, 2.2) +
      arrow(ox, oy, px(S), py(S), INK, 2.6, "fig-draw") +
      label(px(U) + 12, py(U) + 14, "u", A, "middle", 12) +
      label(px(V) - 12, py(V) + 4, "v", A2, "middle", 12) +
      label(px(S) + 16, py(S) - 4, "u+v", INK, "middle", 12),
      "Two vectors from the origin and their sum, closing a parallelogram");
  };

  // 2 — span: what you can reach
  F.figSpan = function () {
    const oy = 130, u = 24;
    const panel = (ox, vecs, shade, title) => {
      let s = grid(ox - 20, oy - 96, 128, 116, u) + axes(ox, oy, 20, 108, 96, 20);
      s += shade;
      vecs.forEach((v, i) => s += arrow(ox, oy, ox + v[0] * u, oy - v[1] * u, i ? A2 : A, 2.2));
      return s + cap(ox + 44, 152, title);
    };
    const lineShade = '<line x1="' + (150 - 20) + '" y1="' + (oy + 10) + '" x2="' + (150 + 100) + '" y2="' + (oy - 55 * 1 - 0) + '" stroke="' + A + '" stroke-width="9" opacity="0.16" stroke-linecap="round"/>';
    return svg(320, 162,
      // one vector spans a line
      panel(28, [[3, 2]],
        '<line x1="8" y1="' + (oy + 12) + '" x2="122" y2="' + (oy - 66) + '" stroke="' + A + '" stroke-width="10" opacity="0.15" stroke-linecap="round"/>',
        "one vector → a line") +
      // two independent vectors span the plane
      panel(190, [[2.6, 0.7], [0.8, 2.6]],
        '<rect x="172" y="' + (oy - 92) + '" width="120" height="106" fill="' + A + '" opacity="0.12" rx="3"/>',
        "two → the whole plane"),
      "One vector spans a line; two independent vectors span the plane");
  };

  // 3 — dependence: a third vector that adds no new direction
  F.figIndependence = function () {
    const ox = 60, oy = 126, u = 28;
    const a = [2, 0.6], b = [0.7, 2.2], c = [a[0] + b[0], a[1] + b[1]];
    const P = v => [ox + v[0] * u, oy - v[1] * u];
    const [cx, cy] = P(c);
    return svg(320, 158,
      grid(ox - 30, oy - 100, 240, 126, u) + axes(ox, oy, 30, 210, 100, 26) +
      '<line x1="' + P(a)[0] + '" y1="' + P(a)[1] + '" x2="' + cx + '" y2="' + cy + '" stroke="' + DIM + '" stroke-width="1.2" stroke-dasharray="4 3"/>' +
      '<line x1="' + P(b)[0] + '" y1="' + P(b)[1] + '" x2="' + cx + '" y2="' + cy + '" stroke="' + DIM + '" stroke-width="1.2" stroke-dasharray="4 3"/>' +
      arrow(ox, oy, P(a)[0], P(a)[1], A, 2.2) + arrow(ox, oy, P(b)[0], P(b)[1], A2, 2.2) +
      arrow(ox, oy, cx, cy, BAD, 2.4, "fig-draw") +
      label(P(a)[0] + 10, P(a)[1] + 15, "a", A, "middle", 12) +
      label(P(b)[0] - 12, P(b)[1] + 2, "b", A2, "middle", 12) +
      label(cx + 30, cy - 2, "c = a + b", BAD, "middle", 11) +
      label(cx + 34, cy + 13, "no new direction", DIM, "middle", 10),
      "A third vector equal to the sum of the first two contributes no new direction");
  };

  // 4 — the same point, two bases
  F.figBasis = function () {
    const oy = 122, u = 26;
    const pt = [2, 2];
    const panel = (ox, e1, e2, coords, title) => {
      const P = v => [ox + (v[0] * e1[0] + v[1] * e2[0]) * u, oy - (v[0] * e1[1] + v[1] * e2[1]) * u];
      const [px, py] = [ox + pt[0] * u, oy - pt[1] * u];
      return grid(ox - 18, oy - 92, 122, 110, u) + axes(ox, oy, 18, 104, 92, 18) +
        arrow(ox, oy, ox + e1[0] * u, oy - e1[1] * u, A, 2.2) +
        arrow(ox, oy, ox + e2[0] * u, oy - e2[1] * u, A2, 2.2) +
        dot(px, py, INK, 3.6) + label(px + 4, py - 8, coords, INK, "start", 11) + cap(ox + 42, 150, title);
    };
    return svg(320, 160,
      panel(30, [1, 0], [0, 1], "(2, 2)", "standard basis") +
      panel(192, [1, 0.5], [-0.5, 1], "(1.2, 1.6)", "another basis"),
      "One point has different coordinates depending on the basis you measure it in");
  };

  // 5 — a matrix moves space; its columns say where the basis lands
  F.figGridTransform = function () {
    const oy = 124, u = 30;
    const M = [[1, 1], [0.35, 1.6]]; // columns are where e1, e2 land
    const before = ox =>
      grid(ox, oy - 90, 90, 90, u) +
      '<rect x="' + ox + '" y="' + (oy - u) + '" width="' + u + '" height="' + u + '" fill="' + A + '" opacity="0.16"/>' +
      arrow(ox, oy, ox + u, oy, A, 2.2) + arrow(ox, oy, ox, oy - u, A2, 2.2) +
      cap(ox + 45, 150, "before");
    const after = ox => {
      const e1 = [ox + M[0][0] * u, oy - M[1][0] * u], e2 = [ox + M[0][1] * u, oy - M[1][1] * u];
      const sum = [ox + (M[0][0] + M[0][1]) * u, oy - (M[1][0] + M[1][1]) * u];
      return grid(ox - 10, oy - 90, 100, 90, u) +
        '<polygon points="' + ox + "," + oy + " " + e1[0].toFixed(1) + "," + e1[1].toFixed(1) + " " +
        sum[0].toFixed(1) + "," + sum[1].toFixed(1) + " " + e2[0].toFixed(1) + "," + e2[1].toFixed(1) +
        '" fill="' + A + '" opacity="0.16"/>' +
        arrow(ox, oy, e1[0], e1[1], A, 2.4, "fig-draw") + arrow(ox, oy, e2[0], e2[1], A2, 2.4, "fig-draw") +
        cap(ox + 45, 150, "after");
    };
    return svg(320, 162,
      before(24) +
      label(150, oy - 26, "A =", DIM, "middle", 11) +
      label(152, oy - 8, "[1 1; .35 1.6]", INK, "middle", 10) +
      arrow(126, oy + 6, 178, oy + 6, DIM, 1.6) +
      after(214),
      "The unit square and basis vectors before and after a linear map");
  };

  // 6 — composition: do one map, then the next
  F.figCompose = function () {
    const oy = 112, u = 20;
    const box = (ox, pts, t) =>
      '<polygon points="' + pts.map(p => (ox + p[0] * u).toFixed(1) + "," + (oy - p[1] * u).toFixed(1)).join(" ") +
      '" fill="' + A + '" opacity="0.18" stroke="' + A + '" stroke-width="1.4"/>' + cap(ox + 22, 142, t);
    const sq = [[0, 0], [1, 0], [1, 1], [0, 1]];
    const shear = sq.map(p => [p[0] + 0.8 * p[1], p[1]]);
    const rot = shear.map(p => [p[0] * 0.72 - p[1] * 0.69, p[0] * 0.69 + p[1] * 0.72]);
    return svg(320, 152,
      box(22, sq, "start") + arrow(84, oy - 12, 112, oy - 12, DIM, 1.6) + label(98, oy - 20, "shear", DIM, "middle", 9) +
      box(124, shear, "then shear") + arrow(210, oy - 12, 238, oy - 12, DIM, 1.6) + label(224, oy - 20, "rotate", DIM, "middle", 9) +
      box(250, rot, "then rotate"),
      "Applying one linear map after another composes them into a single map");
  };

  // 7 — determinant as the area factor
  F.figDeterminant = function () {
    const oy = 126, u = 30;
    const panel = (ox, cols, txt, t) => {
      const p = [[0, 0], cols[0], [cols[0][0] + cols[1][0], cols[0][1] + cols[1][1]], cols[1]];
      return grid(ox - 8, oy - 92, 108, 100, u) + axes(ox, oy, 8, 100, 92, 8) +
        '<polygon points="' + p.map(q => (ox + q[0] * u).toFixed(1) + "," + (oy - q[1] * u).toFixed(1)).join(" ") +
        '" fill="' + A + '" opacity="0.2" stroke="' + A + '" stroke-width="1.6"/>' +
        label(ox + 46, oy - 34, txt, INK, "middle", 12) + cap(ox + 44, 150, t);
    };
    return svg(320, 160,
      panel(26, [[1, 0], [0, 1]], "area 1", "unit square") +
      panel(190, [[2, 0.4], [0.5, 1.6]], "area 2.8", "det A = 2.8"),
      "The determinant is the factor by which a map scales area");
  };

  // 8 — rank and nullity split the input
  F.figRankNullity = function () {
    const bx = 24, by = 30, bw = 108, bh = 96;
    const cx = 208, cy = 46, cw = 84, ch = 64;
    return svg(320, 158,
      '<rect x="' + bx + '" y="' + by + '" width="' + bw + '" height="' + bh + '" rx="4" fill="none" stroke="' + LINE + '" stroke-width="1.4"/>' +
      '<rect x="' + bx + '" y="' + (by + bh - 34) + '" width="' + bw + '" height="34" rx="0" fill="' + BAD + '" opacity="0.14"/>' +
      '<rect x="' + bx + '" y="' + by + '" width="' + bw + '" height="' + (bh - 34) + '" fill="' + A + '" opacity="0.14"/>' +
      label(bx + bw / 2, by + 34, "sent somewhere", INK, "middle", 10) +
      label(bx + bw / 2, by + 48, "new", DIM, "middle", 10) +
      label(bx + bw / 2, by + bh - 13, "sent to zero", BAD, "middle", 10) +
      label(bx + bw / 2, by - 8, "input space (n)", DIM, "middle", 10) +
      arrow(bx + bw + 8, by + 40, cx - 8, cy + 20, DIM, 1.6) + label(170, by + 26, "A", DIM, "middle", 11) +
      '<rect x="' + cx + '" y="' + cy + '" width="' + cw + '" height="' + ch + '" rx="4" fill="' + A + '" opacity="0.14" stroke="' + A + '" stroke-width="1.4"/>' +
      label(cx + cw / 2, cy + 30, "column space", INK, "middle", 10) +
      label(cx + cw / 2, cy + 44, "dim = rank", A, "middle", 10) +
      label(cx + cw / 2, cy - 8, "output space (m)", DIM, "middle", 10) +
      label(160, 148, "rank + nullity = n", INK, "middle", 12),
      "The input space splits into what is crushed to zero and what survives as the column space");
  };

  // 9 — an eigenvector keeps its direction
  F.figEigen = function () {
    const ox = 78, oy = 122, u = 26;
    const P = v => [ox + v[0] * u, oy - v[1] * u];
    const eig = [2.4, 1.2], eigOut = [eig[0] * 1.6, eig[1] * 1.6];
    const oth = [-1.4, 1.9], othOut = [oth[0] * 0.4 + oth[1] * 1.1, oth[0] * 1.2 + oth[1] * 0.6];
    return svg(320, 158,
      grid(ox - 60, oy - 98, 250, 124, u) + axes(ox, oy, 60, 190, 98, 26) +
      '<line x1="' + (ox - 52) + '" y1="' + (oy + 26) + '" x2="' + (ox + 168) + '" y2="' + (oy - 84) + '" stroke="' + A + '" stroke-width="8" opacity="0.13" stroke-linecap="round"/>' +
      arrow(ox, oy, P(eig)[0], P(eig)[1], DIM, 1.8) +
      arrow(ox, oy, P(eigOut)[0], P(eigOut)[1], A, 2.6, "fig-draw") +
      arrow(ox, oy, P(oth)[0], P(oth)[1], DIM, 1.8) +
      arrow(ox, oy, P(othOut)[0], P(othOut)[1], BAD, 2.4) +
      label(P(eigOut)[0] - 4, P(eigOut)[1] - 8, "Av = λv", A, "middle", 11) +
      label(P(eig)[0] + 6, P(eig)[1] + 14, "v", DIM, "middle", 11) +
      label(P(othOut)[0] - 2, P(othOut)[1] - 8, "turned", BAD, "middle", 10) +
      label(160, 150, "one direction only stretches — that is the eigenvector", DIM, "middle", 10),
      "An eigenvector stays on its own line and is only scaled; other vectors get turned");
  };

  // 10 — projection and the error that must be perpendicular
  F.figProjection = function () {
    const ox = 40, oy = 130, u = 1;
    const dir = [1, -0.42];
    const b = [200, 34];
    // foot of the perpendicular from b onto the line through the origin
    const t = ((b[0] - ox) * dir[0] + (b[1] - oy) * dir[1]) / (dir[0] * dir[0] + dir[1] * dir[1]);
    const p = [ox + t * dir[0], oy + t * dir[1]];
    return svg(320, 162,
      '<line x1="' + ox + '" y1="' + oy + '" x2="' + (ox + 250 * dir[0]) + '" y2="' + (oy + 250 * dir[1]) + '" stroke="' + A + '" stroke-width="8" opacity="0.13" stroke-linecap="round"/>' +
      '<line x1="' + ox + '" y1="' + oy + '" x2="' + (ox + 250 * dir[0]) + '" y2="' + (oy + 250 * dir[1]) + '" stroke="' + A + '" stroke-width="1.4"/>' +
      arrow(ox, oy, b[0], b[1], INK, 2.2) +
      arrow(ox, oy, p[0], p[1], A, 2.6, "fig-draw") +
      '<line x1="' + p[0].toFixed(1) + '" y1="' + p[1].toFixed(1) + '" x2="' + b[0] + '" y2="' + b[1] + '" stroke="' + BAD + '" stroke-width="1.8" stroke-dasharray="4 3"/>' +
      // the right-angle tick
      '<path d="M' + (p[0] - 7 * dir[0]).toFixed(1) + " " + (p[1] - 7 * dir[1]).toFixed(1) +
      " l" + (7 * -dir[1]).toFixed(1) + " " + (7 * dir[0]).toFixed(1) +
      " l" + (7 * dir[0]).toFixed(1) + " " + (7 * dir[1]).toFixed(1) + '" fill="none" stroke="' + DIM + '" stroke-width="1"/>' +
      label(b[0] + 10, b[1] + 2, "b", INK, "start", 12) +
      label(p[0] + 6, p[1] + 18, "p = projection", A, "middle", 11) +
      label((p[0] + b[0]) / 2 + 30, (p[1] + b[1]) / 2, "error e ⟂ line", BAD, "middle", 10) +
      label(160, 154, "the closest point makes the error perpendicular", DIM, "middle", 10),
      "Projection drops a perpendicular to find the closest point in a subspace");
  };

  // 11 — a symmetric matrix stretches along perpendicular axes
  F.figSpectral = function () {
    const cx = 160, cy = 82, rx = 96, ry = 40, ang = -22;
    const rad = ang * Math.PI / 180;
    const ax = [cx + rx * Math.cos(rad), cy + rx * Math.sin(rad)];
    const bx2 = [cx - ry * Math.sin(rad), cy + ry * Math.cos(rad)];
    return svg(320, 158,
      '<circle cx="' + cx + '" cy="' + cy + '" r="' + ry + '" fill="none" stroke="' + LINE + '" stroke-width="1.4" stroke-dasharray="4 3"/>' +
      '<ellipse cx="' + cx + '" cy="' + cy + '" rx="' + rx + '" ry="' + ry + '" transform="rotate(' + ang + " " + cx + " " + cy + ')" fill="' + A + '" opacity="0.14" stroke="' + A + '" stroke-width="1.8"/>' +
      arrow(cx, cy, ax[0], ax[1], A, 2.4, "fig-draw") +
      arrow(cx, cy, bx2[0], bx2[1], A2, 2.4, "fig-draw") +
      label(ax[0] - 16, ax[1] - 10, "λ₁", A, "middle", 12) +
      label(bx2[0] - 16, bx2[1] + 6, "λ₂", A2, "middle", 12) +
      label(160, 144, "perpendicular axes, real stretches", DIM, "middle", 10),
      "A symmetric matrix stretches space along perpendicular axes by real amounts");
  };

  // 12 — every matrix is rotate, stretch, rotate
  F.figSVD = function () {
    const oy = 84, r = 26;
    const step = (ox, shape, t) => shape + cap(ox, 140, t);
    const circle = ox => '<circle cx="' + ox + '" cy="' + oy + '" r="' + r + '" fill="' + A + '" opacity="0.16" stroke="' + A + '" stroke-width="1.5"/>';
    const ell = (ox, rx, ry, a) => '<ellipse cx="' + ox + '" cy="' + oy + '" rx="' + rx + '" ry="' + ry +
      '" transform="rotate(' + a + " " + ox + " " + oy + ')" fill="' + A + '" opacity="0.16" stroke="' + A + '" stroke-width="1.5"/>';
    return svg(320, 152,
      step(40, circle(40) + arrow(40, oy, 40 + r, oy, A, 1.8) + arrow(40, oy, 40, oy - r, A2, 1.8), "unit circle") +
      arrow(74, oy, 92, oy, DIM, 1.5) + label(83, oy - 12, "Vᵀ", DIM, "middle", 9) +
      step(122, circle(122) + arrow(122, oy, 122 + r * 0.8, oy - r * 0.6, A, 1.8) + arrow(122, oy, 122 + r * 0.6, oy + r * 0.8, A2, 1.8), "rotate") +
      arrow(156, oy, 174, oy, DIM, 1.5) + label(165, oy - 12, "Σ", DIM, "middle", 9) +
      step(206, ell(206, 40, 18, 0) + arrow(206, oy, 246, oy, A, 1.8) + arrow(206, oy, 206, oy - 18, A2, 1.8), "stretch") +
      arrow(252, oy, 268, oy, DIM, 1.5) + label(260, oy - 12, "U", DIM, "middle", 9) +
      step(292, ell(292, 26, 12, -30), "rotate"),
      "The singular value decomposition factors any matrix into a rotation, a stretch along axes, and another rotation");
  };

  DAR.FIG = F;
})();
