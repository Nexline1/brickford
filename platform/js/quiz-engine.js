// Brickford — Quiz Engine
// Mounts an auto-graded sitting: draws N random questions from a bank,
// MCQ + numeric answers, instant feedback with explanations, final seal.
(function () {
  window.DAR = window.DAR || {};

  function esc(s) {
    return String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
  }
  function shuffle(arr) {
    const a = arr.slice();
    for (let i = a.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [a[i], a[j]] = [a[j], a[i]];
    }
    return a;
  }
  function math(el) {
    if (window.renderMathInElement) {
      try {
        renderMathInElement(el, {
          delimiters: [
            { left: "$$", right: "$$", display: true },
            { left: "$", right: "$", display: false },
          ],
          throwOnError: false,
        });
      } catch (e) { /* keep raw text */ }
    }
  }

  // ---- mastery mode (T-043) ----
  // Every question, not a draw. A miss shows why, turns its segment red and
  // comes back at the end with its options shuffled again (into an order it
  // was not just shown in, so the slot cannot be remembered). The sitting ends
  // when every question has been answered right once. The first-try score is
  // what is kept. Nothing here writes: onFinish hands the result to the caller,
  // once, and leaving keeps nothing.
  function mastery(container, bank, opts) {
    const qsrc = bank.questions;
    const n = qsrc.length;
    const keys = ["A", "B", "C", "D", "E"];
    const lastPerm = {};
    const present = bi => {
      const q = qsrc[bi];
      if (!q.opts) return q;
      const prev = lastPerm[bi];
      let p = shuffle(q.opts.map((_, i) => i));
      for (let guard = 0; prev && q.opts.length > 1 && p.join() === prev.join() && guard < 50; guard++)
        p = shuffle(q.opts.map((_, i) => i));
      lastPerm[bi] = p;
      return Object.assign({}, q, { opts: p.map(i => q.opts[i]), a: p.indexOf(q.a), perm: p });
    };
    const order = shuffle(qsrc.map((_, i) => i));
    const queue = order.map((bi, pos) => ({ bi, pos, again: false }));
    const seg = order.map(() => "");
    const missed = [];
    let firstTry = 0, attempts = 0, cur = null, q = null, answered = false, over = false;
    const clock = s => Math.floor(s / 60) + ":" + String(Math.floor(s % 60)).padStart(2, "0");

    function card() {
      // data-q / data-o: the bank index of the question and of each option as
      // presented, so a harness can tell a reshuffle from the same order.
      return '<div class="card q-card lq-card" data-q="' + cur.bi + '">' +
        '<div class="lq-head"><span class="lq-title">' + esc(opts.label || "Lecture quiz") + "</span>" +
        '<span class="lq-note">' + esc(opts.sub || "From this lecture only") + "</span>" +
        '<span class="lq-n">Question ' + (cur.pos + 1) + " of " + n + (cur.again ? " \u00b7 again" : "") + "</span></div>" +
        '<div class="q-progress lq-segs">' + seg.map((s, i) =>
          '<i class="' + (i === cur.pos && !answered ? "now" : s) + '"></i>').join("") + "</div>" +
        '<div class="q-text">' + q.q + "</div>" +
        (q.opts
          ? q.opts.map((o, i) => '<button class="opt" data-i="' + i + '" data-o="' + q.perm[i] + '"><span class="key">' + keys[i] + '.</span><span>' + o + "</span></button>").join("")
          : '<div class="lq-num"><input type="text" id="numAns" inputmode="decimal" placeholder="Your answer (a number)" aria-label="Your numeric answer" autocomplete="off">' +
            '<button class="btn ghost" id="numGo">Submit</button></div>') +
        '<div id="qFeedback"></div>' +
        '<div class="lq-foot"><span class="lq-note">Misses come back, reshuffled, until you get them. Your first-try score is kept.</span>' +
        '<button class="btn" id="nextBtn" style="visibility:hidden;">Next question</button></div></div>';
    }
    function grade(given) {
      if (q.opts) return given === q.a;
      const tol = q.tol != null ? q.tol : 1e-6;
      const v = parseFloat(String(given).replace(",", "."));
      return isFinite(v) && Math.abs(v - q.num) <= tol;
    }
    function answer(given, btn) {
      if (answered) return;
      answered = true;
      attempts++;
      const ok = grade(given);
      if (ok) {
        if (!cur.again) firstTry++;
        if (seg[cur.pos] !== "miss") seg[cur.pos] = "ok";
      } else {
        seg[cur.pos] = "miss";
        if (missed.indexOf(cur.bi) < 0) missed.push(cur.bi);
        queue.push({ bi: cur.bi, pos: cur.pos, again: true });
      }
      const segs = container.querySelectorAll(".lq-segs i");
      segs.forEach((el, i) => { el.className = seg[i]; });
      if (q.opts) {
        container.querySelectorAll(".opt").forEach((b, i) => {
          b.disabled = true;
          if (i === q.a) b.classList.add("correct");
          else if (b === btn && !ok) b.classList.add("wrong");
          else b.classList.add("dim");
        });
        if (btn) btn.classList.add("sel");
      }
      const at = !ok && q.at != null && opts.onRewatch ? +q.at : null;
      const fb = container.querySelector("#qFeedback");
      fb.innerHTML = '<div class="expl lq-why"><strong>' + (ok ? "Correct." : "Not quite.") + "</strong> " + (q.expl || "") +
        (ok ? "" : " <strong>This one comes back at the end.</strong>") +
        (at != null ? ' <button class="btn ghost lq-rewatch-at" data-at="' + at + '">Rewatch from ' + clock(at) + "</button>" : "") +
        "</div>";
      math(fb);
      const rw = fb.querySelector("[data-at]");
      if (rw) rw.onclick = () => opts.onRewatch(at);
      const next = container.querySelector("#nextBtn");
      next.textContent = queue.length ? "Next question" : "Finish";
      next.style.visibility = "visible";
    }
    function step() {
      if (over) return;
      if (!queue.length) {
        over = true;
        opts.onFinish && opts.onFinish({ total: n, firstTry, attempts, missed: missed.slice() });
        return;
      }
      cur = queue.shift();
      q = present(cur.bi);
      answered = false;
      container.innerHTML = card();
      math(container);
      if (q.opts) container.querySelectorAll(".opt").forEach(b => { b.onclick = () => answer(+b.dataset.i, b); });
      else {
        const go = () => { const v = container.querySelector("#numAns").value.trim(); if (v !== "") answer(v, null); };
        container.querySelector("#numGo").onclick = go;
        container.querySelector("#numAns").addEventListener("keydown", e => { if (e.key === "Enter") go(); });
      }
      container.querySelector("#nextBtn").onclick = () => { if (answered) step(); };
    }
    step();
  }

  DAR.Quiz = {
    /**
     * mount(container, bank, opts)
     * opts.onFinish(result {score,total,pct}) — called once at the seal screen.
     * opts.onExit() — called when the scholar leaves.
     */
    mount(container, bank, opts) {
      // T-043: a lecture's own quiz, which gates the next lecture. A separate
      // path, so every other caller (Exams, banks, concept probes, the summary
      // check) runs exactly the code it always has.
      if (opts && opts.mastery) return mastery(container, bank, opts);
      const n = Math.min(bank.perSitting || 15, bank.questions.length);
      // Draw by index so results can report which BANK questions were missed.
      const order = shuffle(bank.questions.map((_, i) => i)).slice(0, n);
      // The options are shuffled too, on every sitting. The banks were written
      // with the answer nearly always in the same slot (option B in the
      // summaries, option A in two banks), and a reader learns the slot, not
      // the material. The bank is never touched: each sitting presents a copy
      // whose answer index follows its option through the permutation.
      const present = q => {
        if (!q.opts) return q;
        const p = shuffle(q.opts.map((_, i) => i));
        return Object.assign({}, q, { opts: p.map(i => q.opts[i]), a: p.indexOf(q.a) });
      };
      const qs = order.map(i => present(bank.questions[i]));
      let idx = 0, score = 0, answered = false, finished = false;
      const results = [];

      function progressHTML() {
        return '<div class="q-progress">' + qs.map((_, i) =>
          '<i class="' + (i < idx ? "done" : i === idx ? "now" : "") + '"></i>').join("") + "</div>";
      }

      function questionHTML(q) {
        let body;
        if (q.opts) {
          const keys = ["A", "B", "C", "D", "E"];
          body = q.opts.map((o, i) =>
            '<button class="opt" data-i="' + i + '"><span class="key">' + keys[i] + '.</span><span>' + o + "</span></button>"
          ).join("");
        } else {
          body =
            '<div style="display:flex; gap:10px; max-width:340px;">' +
            '<input type="text" id="numAns" inputmode="decimal" placeholder="Your answer (a number)" aria-label="Your numeric answer" autocomplete="off">' +
            '<button class="btn" id="numGo">Submit</button></div>';
        }
        return (
          '<div class="card q-card view-enter">' + progressHTML() +
          '<div class="pill gold">' + esc(bank.course) + " · Question " + (idx + 1) + " of " + n + "</div>" +
          '<div class="q-text">' + q.q + "</div>" + body +
          '<div id="qFeedback"></div>' +
          '<div style="margin-top:18px; display:flex; justify-content:space-between; align-items:center;">' +
          '<button class="btn ghost" id="quitBtn">Leave examination</button>' +
          '<button class="btn" id="nextBtn" style="visibility:hidden;">' + (idx === n - 1 ? "Finish" : "Next question") + "</button>" +
          "</div></div>"
        );
      }

      function sealHTML() {
        const pct = Math.round((score / n) * 100);
        const verdict =
          pct >= 85 ? "Mastered — the material is yours." :
          pct >= 70 ? "Proficient — review the misses, then move on." :
          pct >= 50 ? "Developing — the foundation holds, but it has cracks. Revisit the lectures for what you missed." :
          "Below threshold — return to the course, then sit again. No shame — only truth.";
        const missed = results.filter(r => !r.ok);
        return (
          '<div class="card q-card view-enter" style="text-align:center;">' +
          '<div class="score-seal"><div class="pct">' + pct + '%</div><div class="of">' + score + " / " + n + "</div></div>" +
          '<h2>' + esc(bank.title) + "</h2>" +
          '<p style="color:var(--ink-2); font-size:var(--fs-small); max-width:46ch; margin:10px auto 0;">' + verdict + "</p>" +
          '<div style="display:flex; gap:10px; justify-content:center; margin-top:22px;">' +
          '<button class="btn" id="againBtn">Sit again (new draw)</button>' +
          '<button class="btn ghost" id="doneBtn">Back to Exam Hall</button></div>' +
          (missed.length
            ? '<div style="text-align:left; margin-top:26px;"><h3 style="margin-bottom:8px;">To review</h3>' +
              missed.map(r => '<div class="expl" style="margin-bottom:8px;"><div>' + r.q.q + "</div><div style='margin-top:4px; color:var(--ink-3);'>" + (r.q.expl || "") + "</div></div>").join("") +
              "</div>"
            : "") +
          "</div>"
        );
      }

      function grade(q, given) {
        if (q.opts) return given === q.a;
        const tol = q.tol != null ? q.tol : 1e-6;
        const v = parseFloat(String(given).replace(",", "."));
        return isFinite(v) && Math.abs(v - q.num) <= tol;
      }

      function showFeedback(q, ok, givenIdx) {
        const fb = container.querySelector("#qFeedback");
        if (q.opts) {
          container.querySelectorAll(".opt").forEach((b, i) => {
            b.disabled = true;
            if (i === q.a) b.classList.add("correct");
            else if (i === givenIdx && !ok) b.classList.add("wrong");
          });
        }
        fb.innerHTML =
          '<div class="expl"><strong style="color:' + (ok ? "var(--good)" : "var(--bad)") + ';">' +
          (ok ? "Correct." : q.opts ? "Not quite." : "Not quite — the answer is " + q.num + ".") +
          "</strong> " + (q.expl || "") + "</div>";
        math(fb);
        container.querySelector("#nextBtn").style.visibility = "visible";
      }

      function render() {
        if (finished) {
          container.innerHTML = sealHTML();
          math(container);
          container.querySelector("#againBtn").onclick = () => DAR.Quiz.mount(container, bank, opts);
          container.querySelector("#doneBtn").onclick = () => opts.onExit && opts.onExit();
          return;
        }
        answered = false;
        const q = qs[idx];
        container.innerHTML = questionHTML(q);
        math(container);

        if (q.opts) {
          container.querySelectorAll(".opt").forEach(btn => {
            btn.onclick = () => {
              if (answered) return;
              answered = true;
              const i = +btn.dataset.i;
              const ok = grade(q, i);
              if (ok) score++;
              results.push({ q, ok, bi: order[idx] });
              btn.classList.add("sel");
              showFeedback(q, ok, i);
            };
          });
        } else {
          const go = () => {
            if (answered) return;
            const val = container.querySelector("#numAns").value.trim();
            if (val === "") return;
            answered = true;
            const ok = grade(q, val);
            if (ok) score++;
            results.push({ q, ok, bi: order[idx] });
            showFeedback(q, ok, null);
          };
          container.querySelector("#numGo").onclick = go;
          container.querySelector("#numAns").addEventListener("keydown", e => { if (e.key === "Enter") go(); });
          container.querySelector("#numAns").focus();
        }

        container.querySelector("#nextBtn").onclick = () => {
          if (!answered) return;
          idx++;
          if (idx >= n) {
            finished = true;
            const pct = Math.round((score / n) * 100);
            opts.onFinish && opts.onFinish({
              score, total: n, pct,
              missed: results.filter(r => !r.ok).map(r => r.bi),
              correct: results.filter(r => r.ok).map(r => r.bi),
            });
          }
          render();
          window.scrollTo({ top: 0 });
        };
        container.querySelector("#quitBtn").onclick = () => opts.onExit && opts.onExit();
      }

      render();
    },
  };
})();
