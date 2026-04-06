/**
 * dashboard.js – renders submitted leads stored in localStorage
 *
 * Data structure (written by intake.js):
 *   localStorage key: "pai_submissions"
 *   Value: JSON array of submission objects
 */

(function () {
  "use strict";

  const STORAGE_KEY = "pai_submissions";

  /* ---- Load & render on DOMContentLoaded ----------------- */
  document.addEventListener("DOMContentLoaded", function () {
    const submissions = loadSubmissions();
    renderStats(submissions);
    renderTable(submissions);
    initSearch(submissions);
    initClear();
  });

  /* ---- Data helpers --------------------------------------- */
  function loadSubmissions() {
    try {
      return JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]");
    } catch (_e) {
      return [];
    }
  }

  function clearSubmissions() {
    localStorage.removeItem(STORAGE_KEY);
  }

  /* ---- Stats --------------------------------------------- */
  function renderStats(submissions) {
    const total  = submissions.length;
    const fit    = submissions.filter(function (s) { return s.tier === "fit"; }).length;
    const audit  = submissions.filter(function (s) { return s.tier === "audit"; }).length;
    const wait   = submissions.filter(function (s) { return s.tier === "wait"; }).length;
    const avgScore = total
      ? Math.round(submissions.reduce(function (acc, s) { return acc + (s.score || 0); }, 0) / total)
      : 0;

    setText("stat-total",     total);
    setText("stat-fit",       fit);
    setText("stat-audit",     audit);
    setText("stat-wait",      wait);
    setText("stat-avg-score", total ? avgScore : "—");
  }

  function setText(id, value) {
    const el = document.getElementById(id);
    if (el) el.textContent = value;
  }

  /* ---- Table --------------------------------------------- */
  function renderTable(submissions, filter) {
    const tbody = document.getElementById("leads-tbody");
    if (!tbody) return;

    const rows = filter
      ? submissions.filter(function (s) {
          const q = filter.toLowerCase();
          return (
            (s.name    || "").toLowerCase().includes(q) ||
            (s.email   || "").toLowerCase().includes(q) ||
            (s.company || "").toLowerCase().includes(q)
          );
        })
      : submissions;

    if (rows.length === 0) {
      tbody.innerHTML =
        '<tr><td colspan="7"><div class="empty-state">' +
        '<div class="empty-state__icon">📭</div>' +
        '<div class="empty-state__title">No submissions yet</div>' +
        '<p>Applications submitted via the intake form will appear here.</p>' +
        '</div></td></tr>';
      return;
    }

    tbody.innerHTML = rows.map(function (s) {
      const date = s.submittedAt
        ? new Date(s.submittedAt).toLocaleDateString()
        : "—";

      const tierLabel = { fit: "Strong Fit", audit: "AI Audit", wait: "Waitlist" };
      const tierClass = { fit: "badge--fit", audit: "badge--audit", wait: "badge--wait" };

      return [
        "<tr>",
        "<td>" + escHtml(s.name    || "—") + "</td>",
        "<td>" + escHtml(s.email   || "—") + "</td>",
        "<td>" + escHtml(s.company || "—") + "</td>",
        "<td>" + (s.score !== undefined ? s.score : "—") + "</td>",
        '<td><span class="badge ' + (tierClass[s.tier] || "") + '">' +
          escHtml(tierLabel[s.tier] || s.tier || "—") + "</span></td>",
        "<td>" + (s.revenue !== undefined ? "$" + s.revenue + "M+" : "—") + "</td>",
        "<td>" + date + "</td>",
        "</tr>",
      ].join("");
    }).join("");
  }

  /* ---- Search -------------------------------------------- */
  function initSearch(submissions) {
    const input = document.getElementById("dash-search");
    if (!input) return;
    input.addEventListener("input", function () {
      renderTable(submissions, input.value);
    });
  }

  /* ---- Clear --------------------------------------------- */
  function initClear() {
    const btn = document.getElementById("btn-clear");
    if (!btn) return;
    btn.addEventListener("click", function () {
      if (!confirm("Clear all submissions from local storage?")) return;
      clearSubmissions();
      window.location.reload();
    });
  }

  /* ---- Security ------------------------------------------ */
  function escHtml(str) {
    return String(str)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#39;");
  }
})();
