(function () {
  "use strict";

  var STORAGE_KEY = "memoryJamSharedEntries";

  function onReady(fn) {
    if (document.readyState === "loading") {
      document.addEventListener("DOMContentLoaded", fn);
    } else {
      fn();
    }
  }

  function triggerPop(el) {
    if (!el || !el.classList) {
      return;
    }
    el.classList.remove("btn-animate-pop");
    void el.offsetWidth;
    el.classList.add("btn-animate-pop");
  }

  function bindButtonPop() {
    document.addEventListener(
      "click",
      function (e) {
        var t = e.target;
        if (t.closest && (t.closest("button") || t.closest(".btn"))) {
          triggerPop(t.closest("button") || t.closest(".btn"));
        }
      },
      true
    );
  }

  function fillStarfield() {
    var fields = document.querySelectorAll(".starfield");
    if (!fields.length) {
      return;
    }
    var count = Math.min(85, Math.floor((window.innerWidth * window.innerHeight) / 12000) + 45);
    fields.forEach(function (field) {
      if (field.dataset.stars === "1") {
        return;
      }
      field.dataset.stars = "1";
      field.innerHTML = "";
      for (var i = 0; i < count; i++) {
        var s = document.createElement("span");
        s.className = "star";
        s.style.left = Math.random() * 100 + "%";
        s.style.top = Math.random() * 100 + "%";
        s.style.animationDelay = Math.random() * 4 + "s";
        field.appendChild(s);
      }
    });
  }

  function initWhereNext() {
    var track = document.getElementById("where-next-track");
    var prev = document.getElementById("where-prev");
    var next = document.getElementById("where-next");
    var dotsHost = document.getElementById("where-dots");
    if (!track || !prev || !next || !dotsHost) {
      return;
    }
    var slides = track.querySelectorAll(".where-next__slide");
    var index = 0;

    function render() {
      track.style.transform = "translateX(" + -index * 100 + "%)";
      slides.forEach(function (sl, i) {
        sl.classList.toggle("is-active", i === index);
      });
      dotsHost.querySelectorAll(".where-next__dot").forEach(function (d, i) {
        d.classList.toggle("is-active", i === index);
      });
    }

    dotsHost.innerHTML = "";
    slides.forEach(function (_, i) {
      var b = document.createElement("button");
      b.type = "button";
      b.className = "where-next__dot" + (i === 0 ? " is-active" : "");
      b.setAttribute("aria-label", "Go to slide " + (i + 1));
      b.addEventListener("click", function () {
        index = i;
        render();
      });
      dotsHost.appendChild(b);
    });

    prev.addEventListener("click", function () {
      index = (index - 1 + slides.length) % slides.length;
      render();
    });
    next.addEventListener("click", function () {
      index = (index + 1) % slides.length;
      render();
    });
    render();
  }

  var SEED_PROFILES = [
    {
      name: "Alex Rivera",
      line: "Grandmother’s radio static between stations—like bees in a jar.",
      photo: "https://randomuser.me/api/portraits/women/65.jpg",
    },
    {
      name: "Jordan Kim",
      line: "Metal swing chains squeaking in July; knees sticking to the seat.",
      photo: "https://randomuser.me/api/portraits/men/32.jpg",
    },
    {
      name: "Sam Okonkwo",
      line: "Orange peel curled on a textbook, pencil shavings mixed with rain.",
      photo: "https://randomuser.me/api/portraits/men/76.jpg",
    },
    {
      name: "Riley Chen",
      line: "Someone whispering the answer during a fire drill, laughter in the stairwell.",
      photo: "https://randomuser.me/api/portraits/women/44.jpg",
    },
  ];

  function randomPortrait() {
    var n = 1 + Math.floor(Math.random() * 70);
    return "https://i.pravatar.cc/150?img=" + n;
  }

  function loadUserEntries() {
    try {
      var raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) {
        return [];
      }
      var parsed = JSON.parse(raw);
      return Array.isArray(parsed) ? parsed : [];
    } catch (e) {
      return [];
    }
  }

  function saveUserEntries(entries) {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(entries));
    } catch (e) {
      /* ignore quota */
    }
  }

  function renderSharedGrid() {
    var grid = document.getElementById("shared-grid");
    if (!grid) {
      return;
    }
    var user = loadUserEntries();
    var all = SEED_PROFILES.concat(user);
    grid.innerHTML = "";
    all.forEach(function (entry, idx) {
      var card = document.createElement("article");
      card.className = "shared-card";
      var img = entry.photo || randomPortrait();
      card.innerHTML =
        '<div class="shared-card__header">' +
        '<img class="shared-card__avatar" src="' +
        escapeAttrUrl(img) +
        '" alt="" width="56" height="56" loading="lazy" referrerpolicy="no-referrer">' +
        "<h3 class=\"shared-card__name\">" +
        escapeHtml(entry.name) +
        "</h3>" +
        "</div>" +
        '<p class="shared-card__line">' +
        escapeHtml(entry.line) +
        "</p>" +
        '<div class="shared-card__actions">' +
        '<button type="button" class="btn btn-link btn--tiny" data-heart="' +
        idx +
        '">Save spark</button>' +
        '<button type="button" class="btn btn-secondary btn--tiny" data-reply="' +
        idx +
        '">Reply idea</button>' +
        "</div>";
      grid.appendChild(card);
    });
  }

  function escapeHtml(s) {
    return String(s)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;");
  }

  function escapeAttrUrl(s) {
    return String(s).replace(/&/g, "&amp;").replace(/"/g, "&quot;");
  }

  function initSharedForm() {
    var form = document.getElementById("add-jar-form");
    if (!form) {
      return;
    }
    form.addEventListener("submit", function (e) {
      e.preventDefault();
      var fd = new FormData(form);
      var name = (fd.get("name") || "").toString().trim();
      var line = (fd.get("line") || "").toString().trim();
      var photo = (fd.get("photo") || "").toString().trim();
      if (!name || !line) {
        return;
      }
      if (photo && !/^https?:\/\//i.test(photo)) {
        window.alert("Photo link must start with http:// or https:// (or leave it blank).");
        return;
      }
      var list = loadUserEntries();
      list.push({
        name: name,
        line: line,
        photo: photo || "",
      });
      saveUserEntries(list);
      form.reset();
      renderSharedGrid();
    });
  }

  onReady(function () {
    bindButtonPop();
    fillStarfield();
    var resizeTimer;
    window.addEventListener("resize", function () {
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(function () {
        document.querySelectorAll(".starfield").forEach(function (el) {
          delete el.dataset.stars;
        });
        fillStarfield();
      }, 280);
    });
    initWhereNext();
    renderSharedGrid();
    initSharedForm();
  });
})();
