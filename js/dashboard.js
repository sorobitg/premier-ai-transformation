// dashboard.js — loads and renders leads from Google Sheets API

// Replace this URL with your deployed Google Sheets API endpoint
const SHEET_API = "YOUR_GOOGLE_SHEET_API_URL";

async function loadLeads() {
  try {
    const res = await fetch(SHEET_API);
    const data = await res.json();

    const tbody = document.querySelector("#leadsTable tbody");
    const loadingMsg = document.getElementById("loading-msg");

    if (!data || data.length === 0) {
      if (loadingMsg) loadingMsg.textContent = "No leads found.";
      return;
    }

    if (loadingMsg) loadingMsg.style.display = "none";

    let total = 0, hot = 0, warm = 0, cold = 0;

    data.forEach(function (lead) {
      total++;
      const score = parseInt(lead.score) || 0;

      let badgeClass = "badge-gray";
      let statusLabel = lead.status || "Waitlist";

      if (score >= 70) {
        badgeClass = "badge-green";
        hot++;
      } else if (score >= 40) {
        badgeClass = "badge-yellow";
        warm++;
      } else {
        cold++;
      }

      const row = document.createElement("tr");
      row.innerHTML = `
        <td>${escapeHtml(lead.name || "")}</td>
        <td>${escapeHtml(lead.email || "")}</td>
        <td>${score}</td>
        <td><span class="badge ${badgeClass}">${escapeHtml(statusLabel)}</span></td>
      `;
      tbody.appendChild(row);
    });

    // Update summary stats
    setText("stat-total", total);
    setText("stat-hot", hot);
    setText("stat-warm", warm);
    setText("stat-cold", cold);

  } catch (err) {
    const loadingMsg = document.getElementById("loading-msg");
    if (loadingMsg) loadingMsg.textContent = "Failed to load leads.";
    console.error("Dashboard load error:", err);
  }
}

function setText(id, value) {
  const el = document.getElementById(id);
  if (el) el.textContent = value;
}

function escapeHtml(str) {
  return String(str)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

loadLeads();
