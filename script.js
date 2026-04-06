document.getElementById("form").addEventListener("submit", function(e) {
  e.preventDefault();
  var msg = document.getElementById("form-success");
  if (!msg) {
    msg = document.createElement("p");
    msg.id = "form-success";
    msg.style.cssText = "color:#0d9488;margin-top:12px;font-size:1rem;";
    this.appendChild(msg);
  }
  msg.textContent = "Application submitted. We'll contact you shortly.";
  this.reset();
});
