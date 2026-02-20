// ── Sponsorship page JS ───────────────────────────────────────────

window.addEventListener("DOMContentLoaded", () => {
  // ── Lenis smooth scroll ─────────────────────────────────────────
  const lenis = new Lenis();
  lenis.on("scroll", ScrollTrigger.update);
  gsap.ticker.add((time) => lenis.raf(time * 1000));
  gsap.ticker.lagSmoothing(0);

  // ── Hero entrance ───────────────────────────────────────────────
  const tl = gsap.timeline({ defaults: { ease: "expo.out" } });

  tl.to(".sponsorship-hero__title .line span", {
    y: "0%",
    duration: 1.2,
    stagger: 0.1,
    delay: 0.2,
  })
    .to(".sponsorship-hero__eyebrow", { opacity: 1, duration: 0.8 }, "-=0.6")
    .to(".sponsorship-hero__sub", { opacity: 1, duration: 0.8 }, "-=0.5")
    .to(
      ".sponsorship-hero__scroll-hint",
      { opacity: 1, duration: 0.6 },
      "-=0.4",
    );

  // ── Tiers section scroll reveal ─────────────────────────────────
  ScrollTrigger.create({
    trigger: ".tiers-section",
    start: "top 80%",
    onEnter: () => {
      gsap.to(".tiers-section__label", {
        opacity: 1,
        duration: 0.6,
        ease: "power2.out",
      });
      gsap.to(".tiers-section__heading", {
        opacity: 1,
        y: 0,
        duration: 0.9,
        ease: "expo.out",
        delay: 0.1,
      });
      gsap.to(".tier-card", {
        opacity: 1,
        y: 0,
        duration: 0.7,
        stagger: 0.1,
        ease: "expo.out",
        delay: 0.2,
      });
    },
    once: true,
  });

  // ── Form section scroll reveal ──────────────────────────────────
  ScrollTrigger.create({
    trigger: ".form-section",
    start: "top 80%",
    onEnter: () => {
      gsap.to(".form-section__label", {
        opacity: 1,
        duration: 0.6,
        ease: "power2.out",
      });
      gsap.to(".form-section__heading", {
        opacity: 1,
        y: 0,
        duration: 0.9,
        ease: "expo.out",
        delay: 0.1,
      });
      gsap.to(".form-steps", {
        opacity: 1,
        duration: 0.6,
        ease: "power2.out",
        delay: 0.25,
      });
    },
    once: true,
  });

  // ── Tier card → scroll to form & pre-select tier ────────────────
  document.querySelectorAll(".tier-card").forEach((card) => {
    card.addEventListener("click", () => {
      const tier = card.dataset.tier;
      selectTier(tier);
      lenis.scrollTo(".form-section", { offset: -80, duration: 1.4 });
    });
  });

  // ── Multi-step form ─────────────────────────────────────────────
  let currentStep = 1;
  const totalSteps = 3;

  function updateStepIndicators(step) {
    document.querySelectorAll(".form-step-indicator").forEach((ind, i) => {
      ind.classList.remove("active", "done");
      if (i + 1 === step) ind.classList.add("active");
      if (i + 1 < step) ind.classList.add("done");
    });
  }

  function showPanel(step) {
    const panels = document.querySelectorAll(".form-panel");
    panels.forEach((p) => {
      p.classList.remove("active");
      p.style.opacity = 0;
    });
    const target = document.querySelector(`.form-panel[data-step="${step}"]`);
    if (!target) return;
    target.classList.add("active");
    gsap.to(target, { opacity: 1, y: 0, duration: 0.5, ease: "power2.out" });
    gsap.set(target, { y: 20 });
    gsap.to(target, { opacity: 1, y: 0, duration: 0.5, ease: "expo.out" });
  }

  function validateStep(step) {
    let valid = true;
    const panel = document.querySelector(`.form-panel[data-step="${step}"]`);
    if (!panel) return true;

    panel.querySelectorAll("[required]").forEach((input) => {
      const errorEl = input.parentElement.querySelector(".field__error");
      if (!input.value.trim()) {
        valid = false;
        input.classList.add("error");
        if (errorEl) {
          errorEl.classList.add("visible");
        }
      } else {
        input.classList.remove("error");
        if (errorEl) errorEl.classList.remove("visible");
      }
    });

    // Email validation on step 1
    if (step === 1) {
      const emailInput = panel.querySelector('input[type="email"]');
      if (emailInput && emailInput.value.trim()) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        const errorEl = emailInput.parentElement.querySelector(".field__error");
        if (!emailRegex.test(emailInput.value)) {
          valid = false;
          emailInput.classList.add("error");
          if (errorEl) {
            errorEl.textContent = "Please enter a valid email";
            errorEl.classList.add("visible");
          }
        }
      }
    }

    return valid;
  }

  function nextStep() {
    if (!validateStep(currentStep)) return;
    if (currentStep >= totalSteps) return;
    currentStep++;
    updateStepIndicators(currentStep);
    showPanel(currentStep);
    lenis.scrollTo(".form-section", { offset: -80, duration: 1 });
  }

  function prevStep() {
    if (currentStep <= 1) return;
    currentStep--;
    updateStepIndicators(currentStep);
    showPanel(currentStep);
  }

  document.querySelectorAll(".btn--next").forEach((btn) => {
    btn.addEventListener("click", nextStep);
  });

  document.querySelectorAll(".btn--prev").forEach((btn) => {
    btn.addEventListener("click", prevStep);
  });

  // Clear error on input
  document
    .querySelectorAll(".field__input, .field__select, .field__textarea")
    .forEach((input) => {
      input.addEventListener("input", () => {
        input.classList.remove("error");
        const errorEl = input.parentElement.querySelector(".field__error");
        if (errorEl) errorEl.classList.remove("visible");
      });
    });

  // ── Tier picker in form ─────────────────────────────────────────
  function selectTier(tierName) {
    document.querySelectorAll(".tier-option").forEach((opt) => {
      opt.classList.toggle("selected", opt.dataset.tier === tierName);
    });
    // Also update the hidden input
    const input = document.getElementById("selected-tier");
    if (input) input.value = tierName;
  }

  document.querySelectorAll(".tier-option").forEach((opt) => {
    opt.addEventListener("click", () => selectTier(opt.dataset.tier));
  });

  // Default select Bronze
  selectTier("bronze");

  // ── Form submit ─────────────────────────────────────────────────
  const submitBtn = document.querySelector(".btn--submit");
  if (submitBtn) {
    submitBtn.addEventListener("click", () => {
      if (!validateStep(currentStep)) return;

      // Show success
      gsap.to(".form-panels", {
        opacity: 0,
        y: -20,
        duration: 0.4,
        ease: "power2.in",
        onComplete: () => {
          document.querySelector(".form-panels").style.display = "none";
          document.querySelector(".form-steps").style.display = "none";

          const success = document.querySelector(".form-success");
          success.classList.add("visible");
          gsap.fromTo(
            success,
            { opacity: 0, y: 30 },
            { opacity: 1, y: 0, duration: 0.8, ease: "expo.out" },
          );
        },
      });
    });
  }

  // Init
  updateStepIndicators(1);
  showPanel(1);
});
