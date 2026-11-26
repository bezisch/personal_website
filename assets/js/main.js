(function () {
  "use strict";

  var body = document.body;
  var menuButton = document.querySelector(".menu-button");
  var menuPanel = document.getElementById("site-menu");
  var menuScrim = document.querySelector(".menu-scrim");
  var menuClose = menuPanel ? menuPanel.querySelector(".menu-close") : null;
  var lastFocus = null;

  function openMenu() {
    if (!menuPanel || !menuScrim || !menuButton) return;
    lastFocus = document.activeElement;
    menuPanel.classList.add("is-open");
    menuPanel.setAttribute("aria-hidden", "false");
    menuScrim.classList.add("is-open");
    menuButton.setAttribute("aria-expanded", "true");
    body.classList.add("menu-open");
    var firstLink = menuPanel.querySelector(".menu-panel__nav a");
    if (firstLink) {
      window.setTimeout(function () {
        firstLink.focus();
      }, 120);
    }
  }

  function closeMenu() {
    if (!menuPanel || !menuScrim || !menuButton) return;
    menuPanel.classList.remove("is-open");
    menuPanel.setAttribute("aria-hidden", "true");
    menuScrim.classList.remove("is-open");
    menuButton.setAttribute("aria-expanded", "false");
    body.classList.remove("menu-open");
    if (lastFocus && typeof lastFocus.focus === "function") {
      lastFocus.focus();
    }
  }

  if (menuButton && menuPanel && menuScrim) {
    menuButton.addEventListener("click", function () {
      if (menuPanel.classList.contains("is-open")) {
        closeMenu();
      } else {
        openMenu();
      }
    });

    if (menuClose) {
      menuClose.addEventListener("click", closeMenu);
    }

    menuScrim.addEventListener("click", closeMenu);

    menuPanel.querySelectorAll("a").forEach(function (link) {
      link.addEventListener("click", closeMenu);
    });

    document.addEventListener("keydown", function (event) {
      if (event.key === "Escape" && menuPanel.classList.contains("is-open")) {
        closeMenu();
      }
    });
  }

  document.querySelectorAll("[data-filter-group]").forEach(function (group) {
    var groupName = group.getAttribute("data-filter-group");
    var scope = document.querySelector('[data-filter-scope="' + groupName + '"]');
    if (!scope) return;

    var buttons = Array.prototype.slice.call(group.querySelectorAll("[data-filter]"));
    var items = Array.prototype.slice.call(scope.querySelectorAll("[data-types]"));

    buttons.forEach(function (button) {
      button.addEventListener("click", function () {
        var filter = button.getAttribute("data-filter");

        buttons.forEach(function (other) {
          var isActive = other === button;
          other.classList.toggle("is-active", isActive);
          if (isActive) {
            other.setAttribute("aria-current", "true");
          } else {
            other.removeAttribute("aria-current");
          }
        });

        items.forEach(function (item) {
          var types = (item.getAttribute("data-types") || "").split(/\s+/);
          item.hidden = filter !== "all" && types.indexOf(filter) === -1;
        });
      });
    });
  });

  document.querySelectorAll("[data-print]").forEach(function (link) {
    link.addEventListener("click", function (event) {
      event.preventDefault();
      window.print();
    });
  });

  var vizFrames = Array.prototype.slice.call(document.querySelectorAll(".viz-frame"));
  if (vizFrames.length) {
    var resizeViz = function (frame) {
      try {
        var doc = frame.contentDocument || (frame.contentWindow && frame.contentWindow.document);
        if (!doc) return;
        var height = Math.max(
          doc.documentElement ? doc.documentElement.scrollHeight : 0,
          doc.body ? doc.body.scrollHeight : 0
        );
        if (height > 0) {
          frame.style.height = height + "px";
        }
      } catch (error) {
        return;
      }
    };

    vizFrames.forEach(function (frame) {
      frame.addEventListener("load", function () {
        resizeViz(frame);
        window.setTimeout(function () {
          resizeViz(frame);
        }, 400);
        window.setTimeout(function () {
          resizeViz(frame);
        }, 1200);
      });
    });

    window.addEventListener("resize", function () {
      vizFrames.forEach(function (frame) {
        window.setTimeout(function () {
          resizeViz(frame);
        }, 200);
      });
    });
  }
})();
