// Brickford — interactive figures.
//
// A static picture of a determinant tells you a determinant is an area. Dragging
// a basis vector until the area passes through zero and the number flips sign
// tells you what a determinant *is*. That is the whole argument for this file:
// these are the ideas where the intuition lives in the derivative — what happens
// to the output when you move the input — and no still image carries a
// derivative.
//
// Registry: DAR.LAB[id] = { title, ask, mount(el) }
//   mount() takes a container and wires it up. It returns nothing; the element
//   owns its own state.
//
// Rules every figure here obeys, because they are the ones that bite:
//   - Colour comes from CSS custom properties only, so all seven themes work and
//     nothing needs a second palette.
//   - Pointer events, not mouse events, so a finger works. touch-action: none on
//     the handles or the page scrolls instead of the vector moving.
//   - Keyboard operable: focus a handle, arrow keys nudge it. A figure you can
//     only use with a pointing device is a figure some people cannot use.
//   - The readout is recomputed from the geometry on every frame. It is never a
//     stored string, so it cannot drift out of agreement with the picture.
(function () {
  window.DAR = window.DAR || {};

  const SVGNS = "http://www.w3.org/2000/svg";
  const el = (name, attrs) => {
    const n = document.createElementNS(SVGNS, name);
    for (const k in attrs) n.setAttribute(k, attrs[k]);
    return n;
  };
  const fmt = (v, d) => {
    const s = (Math.abs(v) < 5e-3 ? 0 : v).toFixed(d === undefined ? 2 : d);
    return s === "-0.00" ? "0.00" : s;
  };

  // A square view box with the origin in the middle and `u` pixels per unit.
  // Everything below works in maths coordinates and converts at the edges, so
  // the y-flip is in exactly one place instead of smeared through the drawing.
  function frame(host, opts) {
    const size = 300, u = opts.unit || 34, ox = size / 2, oy = size / 2;
    const svg = el("svg", {
      class: "lab-svg", viewBox: "0 0 " + size + " " + size,
      role: "application", "aria-label": opts.aria || "interactive figure",
    });
    const X = mx => ox + mx * u, Y = my => oy - my * u;
    const toMath = (px, py) => [(px - ox) / u, (oy - py) / u];

    // Grid and axes, drawn once.
    const g = el("g", { class: "lab-grid" });
    const n = Math.floor(size / 2 / u);
    for (let i = -n; i <= n; i++) {
      g.appendChild(el("line", { x1: X(i), y1: 0, x2: X(i), y2: size }));
      g.appendChild(el("line", { x1: 0, y1: Y(i), x2: size, y2: Y(i) }));
    }
    svg.appendChild(g);
    const ax = el("g", { class: "lab-axes" });
    ax.appendChild(el("line", { x1: 0, y1: oy, x2: size, y2: oy }));
    ax.appendChild(el("line", { x1: ox, y1: 0, x2: ox, y2: size }));
    svg.appendChild(ax);

    host.appendChild(svg);
    return { svg, size, u, ox, oy, X, Y, toMath };
  }

  // An arrow from the origin (or from `from`) that can be dragged by its tip.
  function vector(F, cls, label) {
    const g = el("g", { class: "lab-vec " + cls });
    const line = el("line", { class: "lv-line" });
    const head = el("polygon", { class: "lv-head" });
    // The hit area is deliberately far larger than the dot: a 3px target is not
    // draggable with a thumb.
    const hit = el("circle", { class: "lv-hit", r: 18, tabindex: "0", role: "slider",
      "aria-label": label || "vector" });
    const knob = el("circle", { class: "lv-knob", r: 5.5 });
    g.appendChild(line); g.appendChild(head); g.appendChild(knob); g.appendChild(hit);
    F.svg.appendChild(g);
    return { g, line, head, hit, knob };
  }

  function drawVec(F, V, from, to) {
    const x1 = F.X(from[0]), y1 = F.Y(from[1]), x2 = F.X(to[0]), y2 = F.Y(to[1]);
    const a = Math.atan2(y2 - y1, x2 - x1), L = 10, W = 4.6;
    const bx = x2 - L * Math.cos(a), by = y2 - L * Math.sin(a);
    // A zero-length vector has no direction, so skip the head rather than draw a
    // NaN polygon.
    const deg = Math.hypot(x2 - x1, y2 - y1) < 1;
    V.line.setAttribute("x1", x1); V.line.setAttribute("y1", y1);
    V.line.setAttribute("x2", deg ? x1 : bx); V.line.setAttribute("y2", deg ? y1 : by);
    V.head.setAttribute("points", deg ? "" : [
      [x2, y2],
      [bx - W * Math.sin(a), by + W * Math.cos(a)],
      [bx + W * Math.sin(a), by - W * Math.cos(a)],
    ].map(p => p[0].toFixed(1) + "," + p[1].toFixed(1)).join(" "));
    V.knob.setAttribute("cx", x2); V.knob.setAttribute("cy", y2);
    V.hit.setAttribute("cx", x2); V.hit.setAttribute("cy", y2);
  }

  // Pointer + keyboard dragging for a handle, in maths coordinates.
  // Values snap to a 0.25 grid so the readout lands on numbers a person can
  // check by hand, and so "is the determinant exactly zero?" is reachable.
  function draggable(F, handle, get, set, redraw) {
    const SNAP = 0.25, LIM = (F.size / 2 - 12) / F.u;
    const clamp = v => Math.max(-LIM, Math.min(LIM, v));
    const snap = v => Math.round(v / SNAP) * SNAP;
    const apply = (mx, my) => { set([clamp(snap(mx)), clamp(snap(my))]); redraw(); };

    handle.addEventListener("pointerdown", e => {
      handle.setPointerCapture(e.pointerId);
      handle.classList.add("dragging");
      e.preventDefault();
    });
    handle.addEventListener("pointermove", e => {
      if (!handle.hasPointerCapture(e.pointerId)) return;
      const r = F.svg.getBoundingClientRect();
      // The viewBox is 300 wide however many CSS pixels the element is, so scale.
      const px = (e.clientX - r.left) * (F.size / r.width);
      const py = (e.clientY - r.top) * (F.size / r.height);
      apply.apply(null, F.toMath(px, py));
      e.preventDefault();
    });
    const end = e => { handle.classList.remove("dragging"); try { handle.releasePointerCapture(e.pointerId); } catch (x) {} };
    handle.addEventListener("pointerup", end);
    handle.addEventListener("pointercancel", end);

    handle.addEventListener("keydown", e => {
      const K = { ArrowLeft: [-1, 0], ArrowRight: [1, 0], ArrowUp: [0, 1], ArrowDown: [0, -1] }[e.key];
      if (!K) return;
      const step = e.shiftKey ? 1 : SNAP;
      const v = get();
      set([clamp(v[0] + K[0] * step), clamp(v[1] + K[1] * step)]);
      redraw();
      e.preventDefault();
    });
  }

  function readout(host) {
    const box = document.createElement("div");
    box.className = "lab-read";
    host.appendChild(box);
    return box;
  }
  function hintLine(host, text) {
    const p = document.createElement("p");
    p.className = "lab-hint";
    p.textContent = text;
    host.appendChild(p);
  }

  const unit = v => { const n = Math.hypot(v[0], v[1]); return n < 1e-9 ? [0, 0] : [v[0] / n, v[1] / n]; };
  // Exactly how far a ray from the origin travels before it meets the frame edge,
  // in maths units. The first version used a fixed ±40 units, which at 30px per
  // unit is ±1200 — four times the viewBox — and painted clear across the page.
  // The half-diagonal was closer but still overshot on the axes. This solves for
  // the edge, so a guide line stops precisely at the border and the figure has no
  // geometry outside itself at all.
  function edgeReach(F, dir) {
    const u = unit(dir);
    if (!u[0] && !u[1]) return 0;
    const cand = [];
    if (Math.abs(u[0]) > 1e-9) cand.push(((u[0] > 0 ? F.size - F.ox : -F.ox) / (u[0] * F.u)));
    // Screen y runs opposite to maths y, hence the sign flip here.
    if (Math.abs(u[1]) > 1e-9) cand.push(((u[1] > 0 ? -F.oy : F.size - F.oy) / (-u[1] * F.u)));
    return Math.min.apply(null, cand.map(Math.abs));
  }

  const L = {};

  // ---------------------------------------------------------------------------
  // 1 — the determinant is a signed area, and zero means collapse
  // ---------------------------------------------------------------------------
  L["det2"] = {
    title: "Drag the columns. Watch the area.",
    ask: "Make the determinant zero. What happened to the two vectors?",
    mount(host) {
      const F = frame(host, { aria: "Two draggable column vectors and the parallelogram they span" });
      let a = [2, 0.5], b = [-0.5, 2];

      const cell = el("polygon", { class: "lab-fill" });
      F.svg.insertBefore(cell, F.svg.querySelector(".lab-vec") || null);
      F.svg.appendChild(cell);
      const va = vector(F, "v-a", "first column, arrow keys to move");
      const vb = vector(F, "v-b", "second column, arrow keys to move");
      const out = readout(host);

      const redraw = () => {
        const det = a[0] * b[1] - a[1] * b[0];
        cell.setAttribute("points", [[0, 0], a, [a[0] + b[0], a[1] + b[1]], b]
          .map(p => F.X(p[0]).toFixed(1) + "," + F.Y(p[1]).toFixed(1)).join(" "));
        // Orientation is the thing people miss: the sign is not decoration.
        cell.classList.toggle("flipped", det < -1e-9);
        cell.classList.toggle("collapsed", Math.abs(det) < 1e-9);
        drawVec(F, va, [0, 0], a);
        drawVec(F, vb, [0, 0], b);
        [[va, a], [vb, b]].forEach(([V, v]) => {
          V.hit.setAttribute("aria-valuetext", fmt(v[0], 2) + ", " + fmt(v[1], 2));
        });
        out.innerHTML =
          '<span class="lr-item">a = <b>(' + fmt(a[0]) + ", " + fmt(a[1]) + ')</b></span>' +
          '<span class="lr-item">b = <b>(' + fmt(b[0]) + ", " + fmt(b[1]) + ')</b></span>' +
          '<span class="lr-item lr-lead">det = <b>' + fmt(det) + "</b></span>" +
          '<span class="lr-verdict ' + (Math.abs(det) < 1e-9 ? "bad" : det < 0 ? "flip" : "ok") + '">' +
          (Math.abs(det) < 1e-9 ? "collapsed — the two directions are the same line"
            : det < 0 ? "orientation flipped" : "area × " + fmt(Math.abs(det))) + "</span>";
      };
      draggable(F, va.hit, () => a, v => { a = v; }, redraw);
      draggable(F, vb.hit, () => b, v => { b = v; }, redraw);
      redraw();
      hintLine(host, "Drag either arrowhead, or focus one and use the arrow keys.");
    },
  };

  // ---------------------------------------------------------------------------
  // 2 — projection is the closest point, and the error is perpendicular
  // ---------------------------------------------------------------------------
  L["proj"] = {
    title: "Drag v. The dashed line is the error.",
    ask: "Where does the error vanish, and why is it always at right angles?",
    mount(host) {
      const F = frame(host, { aria: "A vector projected onto a draggable line" });
      let v = [1.5, 2.25], d = [2.5, 0.75];

      const span = el("line", { class: "lab-span" });
      F.svg.appendChild(span);
      const resid = el("line", { class: "lab-resid" });
      F.svg.appendChild(resid);
      const sq = el("rect", { class: "lab-right", width: 9, height: 9 });
      F.svg.appendChild(sq);
      const vd = vector(F, "v-b", "the line's direction, arrow keys to move");
      const vv = vector(F, "v-a", "the vector being projected, arrow keys to move");
      const vp = vector(F, "v-p", "the projection");
      vp.hit.setAttribute("tabindex", "-1");
      vp.hit.setAttribute("aria-hidden", "true");
      const out = readout(host);

      const redraw = () => {
        const dd = d[0] * d[0] + d[1] * d[1];
        const t = dd < 1e-12 ? 0 : (v[0] * d[0] + v[1] * d[1]) / dd;
        const p = [d[0] * t, d[1] * t];
        const e = [v[0] - p[0], v[1] - p[1]];
        const ud = unit(d), R = edgeReach(F, d);
        span.setAttribute("x1", F.X(-ud[0] * R)); span.setAttribute("y1", F.Y(-ud[1] * R));
        span.setAttribute("x2", F.X(ud[0] * R)); span.setAttribute("y2", F.Y(ud[1] * R));
        resid.setAttribute("x1", F.X(p[0])); resid.setAttribute("y1", F.Y(p[1]));
        resid.setAttribute("x2", F.X(v[0])); resid.setAttribute("y2", F.Y(v[1]));
        sq.setAttribute("x", F.X(p[0]) - 4.5); sq.setAttribute("y", F.Y(p[1]) - 4.5);
        sq.style.opacity = Math.hypot(e[0], e[1]) > 0.3 ? 1 : 0;
        drawVec(F, vv, [0, 0], v);
        drawVec(F, vd, [0, 0], d);
        drawVec(F, vp, [0, 0], p);
        vv.hit.setAttribute("aria-valuetext", fmt(v[0]) + ", " + fmt(v[1]));
        vd.hit.setAttribute("aria-valuetext", fmt(d[0]) + ", " + fmt(d[1]));
        const dotEP = e[0] * p[0] + e[1] * p[1];
        out.innerHTML =
          '<span class="lr-item">v = <b>(' + fmt(v[0]) + ", " + fmt(v[1]) + ')</b></span>' +
          '<span class="lr-item lr-lead">proj = <b>(' + fmt(p[0]) + ", " + fmt(p[1]) + ')</b></span>' +
          '<span class="lr-item">‖error‖ = <b>' + fmt(Math.hypot(e[0], e[1])) + "</b></span>" +
          '<span class="lr-verdict ok">error · proj = ' + fmt(dotEP, 2) + " — always zero</span>";
      };
      draggable(F, vv.hit, () => v, x => { v = x; }, redraw);
      draggable(F, vd.hit, () => d, x => { d = x; }, redraw);
      redraw();
      hintLine(host, "The dot product of the error with the projection stays zero however you drag. That is what “closest” means.");
    },
  };

  // ---------------------------------------------------------------------------
  // 3 — an eigenvector is a direction the matrix does not turn
  // ---------------------------------------------------------------------------
  L["eigen"] = {
    title: "Drag v until Av points the same way.",
    ask: "Two directions survive here. Find them, and read off their eigenvalues.",
    mount(host) {
      const F = frame(host, { unit: 30, aria: "A vector and its image under a matrix, draggable" });
      // Eigenvalues 3 and 1, eigenvectors (1,1) and (1,-1) — findable by hand,
      // so the reward for searching is a number you can verify.
      const M = [[2, 1], [1, 2]];
      let v = [2, 0.5];

      const ray = el("line", { class: "lab-span" });
      F.svg.appendChild(ray);
      const vAv = vector(F, "v-b", "the image A v");
      vAv.hit.setAttribute("tabindex", "-1");
      vAv.hit.setAttribute("aria-hidden", "true");
      const vv = vector(F, "v-a", "the input vector, arrow keys to move");
      const out = readout(host);

      const redraw = () => {
        const Av = [M[0][0] * v[0] + M[0][1] * v[1], M[1][0] * v[0] + M[1][1] * v[1]];
        const nv = Math.hypot(v[0], v[1]), nAv = Math.hypot(Av[0], Av[1]);
        // The angle between v and Av is the whole game: zero means eigenvector.
        const cos = nv < 1e-9 || nAv < 1e-9 ? 1 : (v[0] * Av[0] + v[1] * Av[1]) / (nv * nAv);
        const ang = Math.acos(Math.max(-1, Math.min(1, cos))) * 180 / Math.PI;
        const aligned = ang < 1.5 || ang > 178.5;
        const uv = unit(v), R = edgeReach(F, v);
        ray.setAttribute("x1", F.X(-uv[0] * R)); ray.setAttribute("y1", F.Y(-uv[1] * R));
        ray.setAttribute("x2", F.X(uv[0] * R)); ray.setAttribute("y2", F.Y(uv[1] * R));
        ray.classList.toggle("hot", aligned);
        drawVec(F, vAv, [0, 0], Av);
        drawVec(F, vv, [0, 0], v);
        vv.hit.setAttribute("aria-valuetext", fmt(v[0]) + ", " + fmt(v[1]));
        F.svg.classList.toggle("locked-on", aligned);
        const lam = nv < 1e-9 ? 0 : (cos < 0 ? -1 : 1) * nAv / nv;
        out.innerHTML =
          '<span class="lr-item">v = <b>(' + fmt(v[0]) + ", " + fmt(v[1]) + ')</b></span>' +
          '<span class="lr-item">Av = <b>(' + fmt(Av[0]) + ", " + fmt(Av[1]) + ')</b></span>' +
          '<span class="lr-item lr-lead">angle = <b>' + fmt(ang, 1) + "°</b></span>" +
          '<span class="lr-verdict ' + (aligned ? "hit" : "") + '">' +
          (aligned ? "eigenvector — λ = " + fmt(lam) : "turned, so not an eigenvector") + "</span>";
      };
      draggable(F, vv.hit, () => v, x => { v = x; }, redraw);
      redraw();
      hintLine(host, "A = [[2,1],[1,2]]. Only two directions come back unturned; every other one gets rotated.");
    },
  };

  DAR.LAB = L;
})();
