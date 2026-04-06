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

  const response = await fetch("https://script.google.com/macros/s/AKfycbygg_vEwhhtxyyp_Bq491Qo1UWIXoqmt-a_oRroCVizhzE6lcOjMQqLZ3e6XoQGXKUzMQ/exec", {
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
