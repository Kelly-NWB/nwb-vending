(function () {
  var KEY = "nwb-theme";

  function getStored() {
    try {
      return localStorage.getItem(KEY);
    } catch (e) {
      return null;
    }
  }

  function systemTheme() {
    return window.matchMedia && window.matchMedia("(prefers-color-scheme: light)").matches
      ? "light"
      : "dark";
  }

  function apply(theme) {
    var root = document.documentElement;
    root.setAttribute("data-theme", theme === "light" ? "light" : "dark");
    try {
      localStorage.setItem(KEY, theme === "light" ? "light" : "dark");
    } catch (e) {}
    var btn = document.getElementById("nwb-theme-toggle");
    if (btn) {
      var light = theme === "light";
      btn.setAttribute("aria-label", light ? "Switch to dark mode" : "Switch to half-light mode");
      btn.setAttribute("aria-pressed", light ? "true" : "false");
      btn.title = light ? "Back to dark mode" : "Half-light mode";
    }
  }

  apply(getStored() || "dark");

  function mount() {
    if (document.getElementById("nwb-theme-toggle")) return;

    var btn = document.createElement("button");
    btn.type = "button";
    btn.id = "nwb-theme-toggle";
    btn.className = "nwb-theme-toggle";
    btn.setAttribute("aria-pressed", "false");
    btn.innerHTML =
      '<span class="nwb-theme-toggle-icon" aria-hidden="true">☀</span>' +
      '<span class="nwb-theme-toggle-label">Half-light</span>';

    btn.addEventListener("click", function () {
      var next = document.documentElement.getAttribute("data-theme") === "light" ? "dark" : "light";
      apply(next);
      var label = btn.querySelector(".nwb-theme-toggle-label");
      if (label) label.textContent = next === "light" ? "Dark" : "Half-light";
    });

    var label = btn.querySelector(".nwb-theme-toggle-label");
    if (document.documentElement.getAttribute("data-theme") === "light") {
      btn.setAttribute("aria-pressed", "true");
      btn.setAttribute("aria-label", "Switch to dark mode");
      if (label) label.textContent = "Dark";
    } else {
      btn.setAttribute("aria-label", "Switch to half-light mode");
      if (label) label.textContent = "Half-light";
    }

    document.body.appendChild(btn);
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", mount);
  } else {
    mount();
  }
})();