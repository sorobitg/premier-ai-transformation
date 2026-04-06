document.getElementById("apply-btn").addEventListener("click", function(e) {
  e.preventDefault();
  document.getElementById("form").requestSubmit();
});

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

  const resultEl = document.getElementById("result");
  resultEl.innerHTML = message;
  resultEl.style.display = "block";
});
