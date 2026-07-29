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

  DAR.Quiz = {
    /**
     * mount(container, bank, opts)
     * opts.onFinish(result {score,total,pct}) — called once at the seal screen.
     * opts.onExit() — called when the scholar leaves.
     */
    mount(container, bank, opts) {
      const n = Math.min(bank.perSitting || 15, bank.questions.length);
      // Draw by index so results can report which BANK questions were missed.
      const order = shuffle(bank.questions.map((_, i) => i)).slice(0, n);
      const qs = order.map(i => bank.questions[i]);
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
