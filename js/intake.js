/**
 * intake.js – handles the AI-readiness intake / application form
 *
 * Scoring logic:
 *   ≥ 70  → Strong Fit  (book a call)
 *   40–69 → AI Audit recommended
 *   < 40  → Waitlist
 *
 * On submission the entry is persisted to localStorage so the
 * dashboard can display it without a backend.
 */

(function () {
  "use strict";

  /* ---- Range slider live-value display -------------------- */
  document.querySelectorAll("input[type=range]").forEach(function (slider) {
    const display = document.getElementById(slider.id + "-val");
    if (!display) return;
    display.textContent = slider.value;
    slider.addEventListener("input", function () {
      display.textContent = slider.value;
    });
  });

  /* ---- Form submission ------------------------------------ */
  const form = document.getElementById("intake-form");
  if (!form) return;

  form.addEventListener("submit", async function (e) {
    e.preventDefault();

    const submitBtn = form.querySelector("[type=submit]");
    submitBtn.disabled = true;
    submitBtn.textContent = "Submitting…";

    const data = {
      id:        Date.now(),
      submittedAt: new Date().toISOString(),
      name:      getValue("name"),
      email:     getValue("email"),
      company:   getValue("company"),
      revenue:   getInt("revenue"),
      urgency:   getInt("urgency"),
      ai:        getInt("ai"),
      budget:    getInt("budget"),
      challenge: getValue("challenge"),
    };

    // Calculate score locally (mirrors server-side logic)
    data.score = calculateScore(data);
    data.tier  = tierFromScore(data.score);

    try {
      const scriptUrl = form.dataset.scriptUrl;

      if (scriptUrl && scriptUrl !== "YOUR_SCRIPT_URL") {
        const response = await fetch(scriptUrl, {
          method: "POST",
          body: JSON.stringify(data),
        });
        const result = await response.json();
        data.score = result.score ?? data.score;
        data.tier  = tierFromScore(data.score);
      }
    } catch (_err) {
      // Fall back to local score if the endpoint is unavailable
    }

    saveSubmission(data);
    showResult(data.tier, data.score);

    submitBtn.disabled = false;
    submitBtn.textContent = "Submit Application";
  });

  /* ---- Helpers -------------------------------------------- */
  function getValue(id) {
    const el = document.getElementById(id);
    return el ? el.value.trim() : "";
  }

  function getInt(id) {
    return parseInt(getValue(id), 10) || 0;
  }

  function calculateScore(data) {
    // Simple weighted scoring: revenue 30%, urgency 25%, ai 25%, budget 20%
    const revenueScore  = Math.min(data.revenue / 10, 10) * 3;   // 0–30
    const urgencyScore  = (data.urgency / 10) * 25;               // 0–25
    const aiScore       = (data.ai / 10) * 25;                    // 0–25
    const budgetScore   = (data.budget / 10) * 20;                // 0–20
    return Math.round(revenueScore + urgencyScore + aiScore + budgetScore);
  }

  function tierFromScore(score) {
    if (score >= 70) return "fit";
    if (score >= 40) return "audit";
    return "wait";
  }

  function saveSubmission(data) {
    try {
      const existing = JSON.parse(localStorage.getItem("pai_submissions") || "[]");
      existing.unshift(data);
      localStorage.setItem("pai_submissions", JSON.stringify(existing));
    } catch (_e) {
      // localStorage unavailable – skip persistence
    }
  }

  function showResult(tier, score) {
    const box = document.getElementById("result-box");
    if (!box) return;

    const messages = {
      fit:   "🎉 You're a strong fit! <a href='https://calendly.com' target='_blank' rel='noopener'>Book your strategy call now →</a>",
      audit: "📊 We recommend starting with an <strong>AI Audit</strong>. Our team will be in touch shortly.",
      wait:  "📋 You've been added to our <strong>waitlist</strong>. We'll reach out when a spot opens.",
    };

    box.innerHTML = (messages[tier] || messages.wait) + ` <span style="opacity:.6;font-size:.8em">(Score: ${score})</span>`;
    box.className = "show " + tier;
    box.scrollIntoView({ behavior: "smooth", block: "nearest" });
  }
})();
