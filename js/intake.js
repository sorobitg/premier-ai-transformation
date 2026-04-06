// intake.js — application form submission & result display

// Replace this URL with your deployed Google Apps Script endpoint
const ENDPOINT = "YOUR_GOOGLE_SCRIPT_URL";

document.getElementById("form").addEventListener("submit", async function (e) {
  e.preventDefault();

  const submitBtn = e.target.querySelector("button[type=submit]");
  submitBtn.disabled = true;
  submitBtn.textContent = "Submitting…";

  const data = {
    name: document.getElementById("name").value.trim(),
    email: document.getElementById("email").value.trim(),
    revenue: parseInt(document.getElementById("revenue").value),
    urgency: parseInt(document.getElementById("urgency").value),
    ai: parseInt(document.getElementById("ai").value),
    budget: parseInt(document.getElementById("budget").value),
    challenge: document.getElementById("challenge").value.trim()
  };

  try {
    const response = await fetch(ENDPOINT, {
      method: "POST",
      body: JSON.stringify(data)
    });

    const result = await response.json();
    handleResult(result);
  } catch (err) {
    document.getElementById("result").innerHTML =
      '<p class="error-msg">Something went wrong. Please try again.</p>';
    console.error("Submission error:", err);
  } finally {
    submitBtn.disabled = false;
    submitBtn.textContent = "Submit Application";
  }
});

function handleResult(result) {
  let html = "";

  if (result.score >= 70) {
    html = `
      <div class="card" style="text-align:center;margin-top:16px;">
        <h3 style="color:#34d399;">You're a strong fit!</h3>
        <p style="color:#9ca3af;">Based on your answers, you qualify for our full AI Transformation program.</p>
        <a href="https://calendly.com/YOUR-LINK" class="btn" target="_blank" rel="noopener noreferrer">Book Your Strategy Call</a>
      </div>
    `;
  } else if (result.score >= 40) {
    html = `
      <div class="card" style="text-align:center;margin-top:16px;">
        <h3 style="color:#fbbf24;">Start with an AI Audit</h3>
        <p style="color:#9ca3af;">You're a great candidate for our AI Audit — the first step to understanding your biggest opportunities.</p>
        <a href="mailto:hello@premierai.com?subject=AI%20Audit%20Inquiry" class="btn btn-outline">Request AI Audit</a>
      </div>
    `;
  } else {
    html = `
      <div class="card" style="text-align:center;margin-top:16px;">
        <h3>You're on our waitlist</h3>
        <p style="color:#9ca3af;">You're not quite ready yet, but we'll reach out as soon as you qualify. Keep building!</p>
      </div>
    `;
  }

  document.getElementById("result").innerHTML = html;
}
