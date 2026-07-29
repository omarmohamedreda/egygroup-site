(function () {
  "use strict";
  var STORAGE_KEY = "egyLang";
  var root = document.documentElement;

  function applyLang(lang) {
    document.querySelectorAll("[data-en]").forEach(function (el) {
      var text = lang === "ar" ? el.getAttribute("data-ar") : el.getAttribute("data-en");
      if (text !== null) el.textContent = text;
    });

    // Translate placeholder text (e.g. textarea/input placeholders)
    document.querySelectorAll("[data-en-placeholder]").forEach(function (el) {
      var text = lang === "ar" ? el.getAttribute("data-ar-placeholder") : el.getAttribute("data-en-placeholder");
      if (text !== null) el.setAttribute("placeholder", text);
    });

    // Translate aria-label / accessible text on elements like SVGs
    document.querySelectorAll("[data-en-aria]").forEach(function (el) {
      var text = lang === "ar" ? el.getAttribute("data-ar-aria") : el.getAttribute("data-en-aria");
      if (text !== null) el.setAttribute("aria-label", text);
    });

    root.setAttribute("lang", lang);
    root.setAttribute("dir", lang === "ar" ? "rtl" : "ltr");

    var btn = document.getElementById("lang-toggle");
    if (btn) btn.textContent = lang === "ar" ? "English" : "العربية";

    localStorage.setItem(STORAGE_KEY, lang);
  }

  document.addEventListener("DOMContentLoaded", function () {
    var savedLang = localStorage.getItem(STORAGE_KEY) || "en";
    applyLang(savedLang);

    var btn = document.getElementById("lang-toggle");
    if (btn) {
      btn.addEventListener("click", function () {
        var current = root.getAttribute("lang") === "ar" ? "ar" : "en";
        applyLang(current === "ar" ? "en" : "ar");
      });
    }
  });
})();