// main.js — shared utilities

/**
 * Load an HTML component (e.g. navbar, footer) into a target element.
 * @param {string} selector - CSS selector of the mount element
 * @param {string} path     - Path to the HTML partial
 */
async function loadComponent(selector, path) {
  const el = document.querySelector(selector);
  if (!el) return;
  try {
    const res = await fetch(path);
    if (res.ok) el.innerHTML = await res.text();
  } catch (err) {
    console.error(`Failed to load component ${path}:`, err);
  }
}
