document.getElementById("form").addEventListener("submit", async function(e) {
  e.preventDefault();

  const data = {
    name: document.getElementById("name").value,
    email: document.getElementById("email").value,
    revenue: parseInt(document.getElementById("revenue").value),
    urgency: parseInt(document.getElementById("urgency").value),
    ai: parseInt(document.getElementById("ai").value),
    budget: parseInt(document.getElementById("budget").value),
    challenge: document.getElementById("challenge").value
  };

  const response = await fetch("YOUR_SCRIPT_URL", {
    method: "POST",
    body: JSON.stringify(data)
  });

  const result = await response.json();

  let message = "";

  if (result.score >= 70) {
    message = "You're a strong fit. Book your call now.";
  } else if (result.score >= 40) {
    message = "Start with an AI Audit.";
  } else {
    message = "You're on our waitlist.";
  }

  document.getElementById("result").innerHTML = message;
});

const sheetAPI = "YOUR_SHEET_API";

async function loadLeads() {
  const res = await fetch(sheetAPI);
  const data = await res.json();

  const table = document.querySelector("#leadsTable tbody");
  table.innerHTML = "";

  data.forEach(lead => {
    let color = "";

    if (lead.score >= 70) color = "green";
    else if (lead.score >= 40) color = "orange";
    else color = "gray";

    const row = `
      <tr style="border-left: 5px solid ${color}">
        <td>${lead.name}</td>
        <td>${lead.email}</td>
        <td>${lead.score}</td>
        <td>${lead.status}</td>
      </tr>
    `;

    table.innerHTML += row;
  });
}

loadLeads();
