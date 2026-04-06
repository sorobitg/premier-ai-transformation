/**
 * main.js – shared utilities loaded on every page
 */

// Mark the current nav link as active based on the current URL path
(function highlightActiveNav() {
  const links = document.querySelectorAll(".nav__links a");
  const path = window.location.pathname;

  links.forEach(function (link) {
    const href = link.getAttribute("href");
    if (!href) return;

    // Normalise: strip leading ".." segments so relative paths compare correctly
    const url = new URL(link.href, window.location.href);
    if (url.pathname === path) {
      link.classList.add("active");
    }
  });
})();
