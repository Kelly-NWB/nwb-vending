(function () {
  var KEY = "nwb-theme";
  var root = document.documentElement;
  var depth = parseInt(root.getAttribute("data-sandbox-depth") || "0", 10);

  function up(n) {
    if (n <= 0) return "";
    return Array(n + 1).join("../");
  }

  function apply(theme) {
    var on = theme === "usa250";
    if (on) {
      root.setAttribute("data-theme", "usa250");
    } else {
      root.removeAttribute("data-theme");
    }
    localStorage.setItem(KEY, on ? "usa250" : "cave");
    syncButtons(on ? "usa250" : "cave");
  }

  function syncButtons(active) {
    document.querySelectorAll(".nwb-theme-btn").forEach(function (btn) {
      var target = btn.getAttribute("data-theme-target");
      var isOn = target === active;
      btn.classList.toggle("is-active", isOn);
      btn.setAttribute("aria-pressed", isOn ? "true" : "false");
    });
  }

  function makeSwitch(extraClass) {
    var wrap = document.createElement("div");
    wrap.className = "nwb-theme-switch" + (extraClass ? " " + extraClass : "");

    var label = document.createElement("span");
    label.className = "nwb-theme-label";
    label.textContent = "Version of this site:";

    var group = document.createElement("div");
    group.className = "nwb-theme-toggle";
    group.setAttribute("role", "group");
    group.setAttribute("aria-label", "Version of this site");

    var normie = document.createElement("button");
    normie.type = "button";
    normie.className = "nwb-theme-btn";
    normie.setAttribute("data-theme-target", "cave");
    normie.textContent = "Normie";

    var usa = document.createElement("button");
    usa.type = "button";
    usa.className = "nwb-theme-btn";
    usa.setAttribute("data-theme-target", "usa250");
    usa.textContent = "USA";

    normie.addEventListener("click", function () { apply("cave"); });
    usa.addEventListener("click", function () { apply("usa250"); });

    group.appendChild(normie);
    group.appendChild(usa);
    wrap.appendChild(label);
    wrap.appendChild(group);
    return wrap;
  }

  var bar = document.createElement("div");
  bar.className = "nwb-sandbox-bar";
  bar.innerHTML =
    '<span class="nwb-sandbox-tag">Sandbox · not published</span>' +
    '<span class="nwb-sandbox-season">USA 250 · July 4</span>' +
    '<a href="' + up(depth + 1) + 'index.html">All seasons</a>' +
    '<a href="' + up(depth + 3) + 'index.html">Live site</a>';

  bar.appendChild(makeSwitch("nwb-theme-switch--bar"));
  document.body.insertBefore(bar, document.body.firstChild);

  var saved = localStorage.getItem(KEY);
  apply(saved === "usa250" ? "usa250" : "cave");
})();