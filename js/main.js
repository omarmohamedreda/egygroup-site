/* ==========================================================================
   Egy Group Company — main.js
   Handles: mobile nav toggle, sticky header shadow, active nav link,
   smooth-scroll for in-page anchors, contact form validation.
   ========================================================================== */
(function () {
  "use strict";

  /* ---- Mobile nav toggle ---- */
  var toggle = document.querySelector(".nav-toggle");
  var nav = document.getElementById("main-nav");

  if (toggle && nav) {
    toggle.addEventListener("click", function () {
      var isOpen = nav.classList.toggle("is-open");
      toggle.setAttribute("aria-expanded", String(isOpen));
    });

    // Close mobile nav when a link is clicked
    nav.addEventListener("click", function (e) {
      if (e.target.tagName === "A" && nav.classList.contains("is-open")) {
        nav.classList.remove("is-open");
        toggle.setAttribute("aria-expanded", "false");
      }
    });

    // Close on Escape
    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape" && nav.classList.contains("is-open")) {
        nav.classList.remove("is-open");
        toggle.setAttribute("aria-expanded", "false");
        toggle.focus();
      }
    });
  }

  /* ---- Sticky header shadow on scroll ---- */
  var header = document.querySelector(".site-header");
  if (header) {
    var onScroll = function () {
      header.classList.toggle("is-scrolled", window.scrollY > 8);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
  }

  /* ---- Mark current page link as active (aria-current) ---- */
  var navLinks = document.querySelectorAll(".main-nav a");
  var currentPath = window.location.pathname.split("/").pop() || "index.html";
  navLinks.forEach(function (link) {
    var linkPath = link.getAttribute("href").split("/").pop();
    if (linkPath === currentPath) {
      link.setAttribute("aria-current", "page");
    }
  });

  /* ---- Smooth scroll for in-page anchors (respects reduced motion) ---- */
  var prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  document.querySelectorAll('a[href^="#"]').forEach(function (anchor) {
    anchor.addEventListener("click", function (e) {
      var targetId = this.getAttribute("href");
      if (targetId.length < 2) return;
      var target = document.querySelector(targetId);
      if (!target) return;
      e.preventDefault();
      target.scrollIntoView({
        behavior: prefersReducedMotion ? "auto" : "smooth",
        block: "start"
      });
      target.setAttribute("tabindex", "-1");
      target.focus({ preventScroll: true });
    });
  });

  /* ---- Contact form validation ---- */
  var form = document.getElementById("contact-form");
  if (form) {
    var status = document.getElementById("form-status");

    var validators = {
      name: function (v) { return v.trim().length >= 2; },
      email: function (v) { return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v.trim()); },
      phone: function (v) { return v.trim() === "" || /^[+0-9()\-\s]{7,20}$/.test(v.trim()); },
      subject: function (v) { return v.trim().length > 0; },
      message: function (v) { return v.trim().length >= 10; },
      consent: function (v, el) { return el.checked; }
    };

    var errorMessages = {
      name: "Please enter your full name (min. 2 characters).",
      email: "Please enter a valid email address.",
      phone: "Please enter a valid phone number, or leave blank.",
      subject: "Please choose a subject.",
      message: "Please enter a message of at least 10 characters.",
      consent: "Please confirm you agree before submitting."
    };

    function setFieldError(field, hasError) {
      var wrapper = field.closest(".field");
      if (!wrapper) return;
      wrapper.classList.toggle("has-error", hasError);
      var errorEl = wrapper.querySelector(".field-error");
      if (errorEl && hasError) {
        errorEl.textContent = errorMessages[field.name] || "This field is invalid.";
      }
      field.setAttribute("aria-invalid", hasError ? "true" : "false");
    }

    function validateField(field) {
      var validator = validators[field.name];
      if (!validator) return true;
      var valid = field.type === "checkbox" ? validator(field.value, field) : validator(field.value);
      setFieldError(field, !valid);
      return valid;
    }

    // Live validation on blur
    Array.prototype.forEach.call(form.elements, function (field) {
      if (!field.name || !validators[field.name]) return;
      field.addEventListener("blur", function () { validateField(field); });
    });

    form.addEventListener("submit", function (e) {
      e.preventDefault();
      var isValid = true;

      Array.prototype.forEach.call(form.elements, function (field) {
        if (!field.name || !validators[field.name]) return;
        var fieldValid = validateField(field);
        if (!fieldValid) isValid = false;
      });

      if (!status) return;

      status.classList.remove("success", "error", "is-visible");

      if (!isValid) {
        status.textContent = "Please correct the highlighted fields and try again.";
        status.classList.add("error", "is-visible");
        var firstError = form.querySelector(".has-error input, .has-error select, .has-error textarea");
        if (firstError) firstError.focus();
        return;
      }

      // No backend wired up in this static demo — simulate a successful submit.
      status.textContent = "Thank you. Your message has been received — our team will reply within 1–2 business days.";
      status.classList.add("success", "is-visible");
      form.reset();
    });
  }
})();
