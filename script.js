document.getElementById("form").addEventListener("submit", async function(e) {
  e.preventDefault();

  const data = {
    name: document.getElementById("name").value,
    email: document.getElementById("email").value,
    revenue: parseInt(document.getElementById("revenue").value, 10),
    urgency: parseInt(document.getElementById("urgency").value, 10),
    ai: parseInt(document.getElementById("ai").value, 10),
    budget: parseInt(document.getElementById("budget").value, 10),
    challenge: document.getElementById("challenge").value
  };

  try {
    const response = await fetch("YOUR_SCRIPT_URL", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data)
    });

    if (!response.ok) {
      throw new Error("Server error: " + response.status);
    }

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
  } catch (err) {
    document.getElementById("result").innerHTML = "Something went wrong. Please try again.";
  }
});
