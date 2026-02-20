import collection from "./collection.js";

window.addEventListener("DOMContentLoaded", () => {
  const container = document.querySelector(".container");
  const navToggle = document.querySelector(".nav-toggle");
  const menuOverlay = document.querySelector(".menu-overlay");
  const menuContent = document.querySelector(".menu-content");
  const menuImage = document.querySelector(".menu-img");
  const menuLinksWrapper = document.querySelector(".menu-links-wrapper");
  const linkHighlighter = document.querySelector(".link-highlighter");

  let currentX = 0;
  let targetX = 0;
  const lerpFactor = 0.05;

  let currentHighlighterX = 0;
  let targetHighlighterX = 0;
  let currentHighlighterWidth = 0;
  let targetHighlighterWidth = 0;

  let isMenuOpen = false;
  let isMenuAnimating = false;

  // ── Menu link split text ──────────────────────────────────────────
  const menuLinks = document.querySelectorAll(".menu-link a");
  menuLinks.forEach((link) => {
    const spans = link.querySelectorAll("span");
    spans.forEach((span, spanIndex) => {
      const split = new SplitText(span, { type: "chars" });
      split.chars.forEach((c) => c.classList.add("char"));
      if (spanIndex === 1) gsap.set(split.chars, { y: "110%" });
    });
  });

  gsap.set(menuContent, { y: "50%", opacity: 0.25 });
  gsap.set(menuImage, { scale: 0.5, opacity: 0.25 });
  gsap.set(menuLinks, { y: "150%" });
  gsap.set(linkHighlighter, { y: "450%" });

  const defaultLinkText = document.querySelector(
    ".menu-link:first-child a span",
  );
  if (defaultLinkText) {
    const linkWidth = defaultLinkText.offsetWidth;
    linkHighlighter.style.width = linkWidth + "px";
    currentHighlighterWidth = linkWidth;
    targetHighlighterWidth = linkWidth;

    const defaultLinkTextElement = document.querySelector(
      ".menu-link:first-child",
    );
    const linkRect = defaultLinkTextElement.getBoundingClientRect();
    const menuWrapperRect = menuLinksWrapper.getBoundingClientRect();
    const initialX = linkRect.left - menuWrapperRect.left;
    currentHighlighterX = initialX;
    targetHighlighterX = initialX;
  }

  // ── Toggle menu ───────────────────────────────────────────────────
  function toggleMenu() {
    if (isMenuAnimating) return;
    isMenuAnimating = true;

    if (!isMenuOpen) {
      menuOverride = true;
      checkNavPosition();

      gsap.to(container, { opacity: 0.5, duration: 1.25, ease: "expo.out" });
      gsap.to(menuOverlay, {
        clipPath: "polygon(0% 100%, 100% 100%, 100% 0%, 0% 0%)",
        duration: 1.25,
        ease: "expo.out",
        onComplete: () => {
          gsap.set(".menu-link", { overflow: "visible" });
          isMenuOpen = true;
          isMenuAnimating = false;
        },
      });
      gsap.to(menuContent, {
        y: "0%",
        opacity: 1,
        duration: 1.5,
        ease: "expo.out",
      });
      gsap.to(menuImage, {
        scale: 1,
        opacity: 1,
        duration: 1.5,
        ease: "expo.out",
      });
      gsap.to(menuLinks, {
        y: "0%",
        duration: 1.25,
        stagger: 0.1,
        delay: 0.25,
        ease: "expo.out",
      });
      gsap.to(linkHighlighter, {
        y: "0%",
        duration: 1,
        delay: 1,
        ease: "power2.out",
      });
    } else {
      gsap.to(container, { opacity: 1, duration: 1.25, ease: "expo.out" });
      gsap.to(menuLinks, { y: "-200%", duration: 1.25, ease: "expo.out" });
      gsap.to(menuContent, {
        y: "-100%",
        opacity: 0.25,
        duration: 1.25,
        ease: "expo.out",
      });
      gsap.to(menuImage, {
        y: "-100%",
        opacity: 0.5,
        duration: 1.25,
        ease: "expo.out",
      });
      gsap.to(menuOverlay, {
        clipPath: "polygon(0% 0%, 100% 0%, 100% 0%, 0% 0%)",
        duration: 1.25,
        ease: "expo.out",
        onComplete: () => {
          gsap.set(menuOverlay, {
            clipPath: "polygon(0% 100%, 100% 100%, 100% 100%, 0% 100%)",
          });
          gsap.set(menuLinks, { y: "150%" });
          gsap.set(linkHighlighter, { y: "350%" });
          gsap.set(menuContent, { y: "50%", opacity: 0.25 });
          gsap.set(menuImage, { y: "0%", scale: 0.5, opacity: 0.25 });
          gsap.set(".menu-link", { overflow: "hidden" });
          gsap.set(menuLinksWrapper, { x: 0 });
          currentX = 0;
          targetX = 0;
          menuOverride = false;
          checkNavPosition();
          isMenuOpen = false;
          isMenuAnimating = false;
        },
      });
    }
  }

  if (navToggle) navToggle.addEventListener("click", toggleMenu);

  // ── Menu link hover animations ────────────────────────────────────
  const menuLinksContainers = document.querySelectorAll(".menu-link");
  menuLinksContainers.forEach((link) => {
    link.addEventListener("mouseenter", () => {
      if (window.innerWidth < 979) return;
      const linkCopy = link.querySelectorAll("a span");
      gsap.to(linkCopy[0].querySelectorAll(".char"), {
        y: "-110%",
        duration: 0.75,
        ease: "expo.inOut",
        stagger: 0.05,
      });
      gsap.to(linkCopy[1].querySelectorAll(".char"), {
        y: "0%",
        duration: 0.75,
        ease: "expo.inOut",
        stagger: 0.05,
      });

      const linkRect = link.getBoundingClientRect();
      const menuWrapperRect = menuLinksWrapper.getBoundingClientRect();
      targetHighlighterX = linkRect.left - menuWrapperRect.left;
      const linkCopyElement = link.querySelector("a span");
      targetHighlighterWidth = linkCopyElement
        ? linkCopyElement.offsetWidth
        : link.offsetWidth;
    });

    link.addEventListener("mouseleave", () => {
      if (window.innerWidth < 979) return;
      const linkCopy = link.querySelectorAll("a span");
      gsap.to(linkCopy[1].querySelectorAll(".char"), {
        y: "110%",
        duration: 0.75,
        ease: "expo.inOut",
        stagger: 0.05,
      });
      gsap.to(linkCopy[0].querySelectorAll(".char"), {
        y: "0%",
        duration: 0.75,
        ease: "expo.inOut",
        stagger: 0.05,
      });
    });
  });

  if (menuOverlay) {
    menuOverlay.addEventListener("mousemove", (e) => {
      if (window.innerWidth < 979) return;
      const mouseX = e.clientX;
      const viewportWidth = window.innerWidth;
      const menuLinksWrapperWidth = menuLinksWrapper.offsetWidth;
      const maxMoveRight = viewportWidth - menuLinksWrapperWidth;
      const sensitivityRange = viewportWidth * 0.5;
      const startX = viewportWidth - sensitivityRange;
      const endX = startX + sensitivityRange;
      let mousePercentage;
      if (mouseX <= startX) mousePercentage = 0;
      else if (mouseX >= endX) mousePercentage = 1;
      else mousePercentage = (mouseX - startX) / sensitivityRange;
      targetX = mousePercentage * maxMoveRight;
    });
  }

  if (menuLinksWrapper) {
    menuLinksWrapper.addEventListener("mouseleave", () => {
      const defaultLink = document.querySelector(".menu-link:first-child");
      const defaultLinkSpan = defaultLink.querySelector("a span");
      const linkRect = defaultLink.getBoundingClientRect();
      const menuWrapperRect = menuLinksWrapper.getBoundingClientRect();
      targetHighlighterX = linkRect.left - menuWrapperRect.left;
      targetHighlighterWidth = defaultLinkSpan.offsetWidth;
    });
  }

  // ── Animation loop ────────────────────────────────────────────────
  function animate() {
    currentX += (targetX - currentX) * lerpFactor;
    currentHighlighterX +=
      (targetHighlighterX - currentHighlighterX) * lerpFactor;
    currentHighlighterWidth +=
      (targetHighlighterWidth - currentHighlighterWidth) * lerpFactor;

    gsap.set(menuLinksWrapper, { x: currentX });
    gsap.set(linkHighlighter, {
      x: currentHighlighterX,
      width: currentHighlighterWidth,
    });

    requestAnimationFrame(animate);
  }

  animate();

  // ── Lenis smooth scroll ───────────────────────────────────────────
  const lenis = new Lenis();
  lenis.on("scroll", ScrollTrigger.update);
  gsap.ticker.add((time) => lenis.raf(time * 1000));
  gsap.ticker.lagSmoothing(0);

  // Session storage — skip loader on return visits
  const hasSeenLoaderThisSession =
    sessionStorage.getItem("hasSeenLoader") === "true";
  if (hasSeenLoaderThisSession) {
    lenis.start();
    document.documentElement.style.overflow = "";
    const nav = document.querySelector("nav");
    if (nav) gsap.set(nav, { opacity: 1, pointerEvents: "all" });
    window.dispatchEvent(new CustomEvent("preloaderComplete"));
  }

  // ── Physics ───────────────────────────────────────────────────────
  const animatePhysicsOnScroll = true;

  const physicsConfig = {
    gravity: { x: 0, y: 1 },
    restitution: 0.5,
    friction: 0.15,
    frictionAir: 0.02,
    density: 0.002,
    wallThickness: 200,
  };

  let engine,
    bodies = [],
    topWall = null;

  function clamp(val, min, max) {
    return Math.max(min, Math.min(max, val));
  }

  function measureAllObjects(physicsContainer) {
    const objects = Array.from(physicsContainer.querySelectorAll(".object"));
    const wrapper = document.createElement("div");
    wrapper.style.cssText = `
            position: fixed;
            top: -9999px;
            left: -9999px;
            visibility: hidden;
            pointer-events: none;
            display: flex;
            flex-wrap: wrap;
            width: ${window.innerWidth}px;
        `;
    const clones = objects.map((obj) => {
      const clone = obj.cloneNode(true);
      clone.style.position = "relative";
      clone.style.visibility = "hidden";
      clone.style.fontSize = window.getComputedStyle(obj).fontSize;
      clone.style.padding = window.getComputedStyle(obj).padding;
      clone.style.borderRadius = window.getComputedStyle(obj).borderRadius;
      clone.style.border = window.getComputedStyle(obj).border;
      clone.style.whiteSpace = "nowrap";
      wrapper.appendChild(clone);
      return clone;
    });
    document.body.appendChild(wrapper);
    wrapper.offsetHeight;
    const dimensions = clones.map((clone, i) => ({
      element: objects[i],
      width: clone.offsetWidth,
      height: clone.offsetHeight,
    }));
    document.body.removeChild(wrapper);
    return dimensions;
  }

  function initPhysics(physicsContainer, dimensions) {
    if (engine) return;

    dimensions.forEach(({ element }) => {
      element.classList.add("physics-ready");
      element.style.visibility = "hidden";
    });

    const containerWidth = physicsContainer.offsetWidth;
    const containerHeight = physicsContainer.offsetHeight;
    const wallThickness = physicsConfig.wallThickness;

    engine = Matter.Engine.create();
    engine.enableSleeping = false;
    engine.gravity = physicsConfig.gravity;
    engine.constraintIterations = 10;
    engine.positionIterations = 20;
    engine.velocityIterations = 16;
    engine.timing.timeScale = 1;

    const walls = [
      Matter.Bodies.rectangle(
        containerWidth / 2,
        containerHeight + wallThickness / 2,
        containerWidth + wallThickness * 2,
        wallThickness,
        { isStatic: true },
      ),
      Matter.Bodies.rectangle(
        -wallThickness / 2,
        containerHeight / 2,
        wallThickness,
        containerHeight + wallThickness * 2,
        { isStatic: true },
      ),
      Matter.Bodies.rectangle(
        containerWidth + wallThickness / 2,
        containerHeight / 2,
        wallThickness,
        containerHeight + wallThickness * 2,
        { isStatic: true },
      ),
    ];
    Matter.World.add(engine.world, walls);

    const cursorRadius = 40;
    const cursorBody = Matter.Bodies.circle(-200, -200, cursorRadius, {
      isStatic: true,
      restitution: 0.5,
      friction: 0,
      frictionAir: 0,
      frictionStatic: 0,
      collisionFilter: { category: 0x0002, mask: 0x0001 },
    });
    Matter.World.add(engine.world, cursorBody);

    physicsContainer.addEventListener("mousemove", (e) => {
      const rect = physicsContainer.getBoundingClientRect();
      Matter.Body.setPosition(cursorBody, {
        x: e.clientX - rect.left,
        y: e.clientY - rect.top,
      });
      Matter.Body.setVelocity(cursorBody, { x: 0, y: 0 });
    });

    physicsContainer.addEventListener("mouseleave", () => {
      Matter.Body.setPosition(cursorBody, { x: -200, y: -200 });
    });

    dimensions.forEach(({ element, width, height }, index) => {
      if (width === 0 || height === 0) return;
      const startX = Math.random() * (containerWidth - width) + width / 2;
      const startY = -200 - index * 120;
      const startRotation = (Math.random() - 0.5) * Math.PI;
      const body = Matter.Bodies.rectangle(startX, startY, width, height, {
        restitution: physicsConfig.restitution,
        friction: physicsConfig.friction,
        frictionAir: physicsConfig.frictionAir,
        density: physicsConfig.density,
        sleepThreshold: Infinity,
        collisionFilter: { category: 0x0001, mask: 0x0001 | 0x0002 },
      });
      Matter.Body.setAngle(body, startRotation);
      Matter.Body.setAngularVelocity(body, (Math.random() - 0.5) * 0.2);
      bodies.push({ body, element, width, height });
      Matter.World.add(engine.world, body);
    });

    setTimeout(() => {
      topWall = Matter.Bodies.rectangle(
        containerWidth / 2,
        -wallThickness / 2,
        containerWidth + wallThickness * 2,
        wallThickness,
        { isStatic: true },
      );
      Matter.World.add(engine.world, topWall);
    }, 3000);

    let lastTime = performance.now();
    let firstFrame = true;

    gsap.ticker.add(() => {
      const now = performance.now();
      const delta = now - lastTime;
      lastTime = now;
      Matter.Engine.update(engine, 1000 / 60, delta / (1000 / 60));
      bodies.forEach(({ body, element, width, height }) => {
        const x = clamp(body.position.x - width / 2, 0, containerWidth - width);
        const y = body.position.y - height / 2;
        element.style.left = x + "px";
        element.style.top = y + "px";
        element.style.transform = `rotate(${body.angle}rad)`;
      });
      if (firstFrame) {
        firstFrame = false;
        dimensions.forEach(({ element }) => {
          element.style.visibility = "visible";
          element.style.opacity = "1";
        });
      }
    });
  }

  Promise.all([
    document.fonts.ready,
    new Promise((resolve) => {
      if (document.readyState === "complete") resolve();
      else window.addEventListener("load", resolve);
    }),
  ]).then(() => {
    const physicsContainer = document.querySelector(".object-container");
    if (!physicsContainer) return;
    const dimensions = measureAllObjects(physicsContainer);
    if (animatePhysicsOnScroll) {
      const observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              observer.disconnect();
              initPhysics(physicsContainer, dimensions);
            }
          });
        },
        { threshold: 0.1 },
      );
      observer.observe(physicsContainer);
    } else {
      initPhysics(physicsContainer, dimensions);
    }
  });

  // ── Nav accent detection ──────────────────────────────────────────
  const nav = document.querySelector("nav");
  let menuOverride = false;

  function checkNavPosition() {
    if (!nav) return;
    if (menuOverride) {
      nav.classList.remove("on-accent");
      return;
    }
    const navCenter =
      nav.getBoundingClientRect().top + nav.getBoundingClientRect().height / 2;
    let isOverAccent = false;
    document.querySelectorAll('[id="accent-bg"]').forEach((element) => {
      const rect = element.getBoundingClientRect();
      if (navCenter >= rect.top && navCenter <= rect.bottom)
        isOverAccent = true;
    });
    nav.classList.toggle("on-accent", isOverAccent);
  }

  window.addEventListener("scroll", checkNavPosition);
  window.addEventListener("resize", checkNavPosition);
  checkNavPosition();

  // ── Scroll-based color theme transition ──────────────────────────────────────
  (function () {
    const identityCopy = document.querySelector(".identity-copy");
    if (!identityCopy) return;

    const bgAdiacentEls = [
      document.body,
      document.querySelector(".identity"),
      document.querySelector(".identity-copy"),
      document.querySelector(".footer"),
    ].filter(Boolean);
    const bgAdiacentInner = document.querySelectorAll(".identity-header");
    const objectEls = document.querySelectorAll(".object");
    const textGrayEls = document.querySelectorAll(".animate-text");
    const navEl = document.querySelector("nav");
    const footerH2 = document.querySelector(".footer-content h2");

    const rootStyle = getComputedStyle(document.documentElement);
    const colors = {
      adiacent: rootStyle.getPropertyValue("--adiacent").trim(),
      light: rootStyle.getPropertyValue("--light").trim(),
      gray: rootStyle.getPropertyValue("--gray").trim(),
      dark: rootStyle.getPropertyValue("--dark").trim(),
    };

    const navOriginalMixBlend = navEl
      ? getComputedStyle(navEl).mixBlendMode
      : null;

    function applyColors(t) {
      const bgColor = gsap.utils.interpolate(colors.adiacent, colors.light, t);
      const grayColor = gsap.utils.interpolate(colors.gray, colors.dark, t);
      const darkColor = gsap.utils.interpolate(colors.light, colors.dark, t);
      const objColor = gsap.utils.interpolate(colors.dark, colors.light, t);

      bgAdiacentEls.forEach((el) => {
        el.style.backgroundColor = bgColor;
      });
      bgAdiacentInner.forEach((el) => {
        el.style.backgroundColor = bgColor;
      });
      textGrayEls.forEach((el) => {
        el.style.color = grayColor;
      });

      if (navEl) {
        navEl.style.color = darkColor;
        navEl.style.mixBlendMode = t > 0 ? "normal" : navOriginalMixBlend;
      }

      if (footerH2) footerH2.style.color = darkColor;

      objectEls.forEach((el) => {
        el.style.backgroundColor = colors.adiacent;
        el.style.color = objColor;
      });
    }

    // ── Identity-header animation ──────────────────────────────────────

    ScrollTrigger.create({
      trigger: identityCopy,
      start: "top 65%",
      end: "top 55%",
      scrub: 1,
      onUpdate(self) {
        applyColors(self.progress);
      },
      onLeaveBack() {
        applyColors(0);
      },
    });
  })();

  const headers = document.querySelectorAll(".identity-header");
  gsap.set(headers[0], { x: "100%" });
  gsap.set(headers[1], { x: "-100%" });
  gsap.set(headers[2], { x: "100%" });

  ScrollTrigger.create({
    trigger: ".identity",
    start: "top bottom",
    end: "top top",
    onUpdate: (self) => {
      const headers = document.querySelectorAll(".identity-header");
      gsap.set(headers[0], { x: `${100 - self.progress * 100}%` });
      gsap.set(headers[1], { x: `${-100 + self.progress * 100}%` });
      gsap.set(headers[2], { x: `${100 - self.progress * 100}%` });
    },
  });

  // ── Circular gallery ──────────────────────────────────────

  const gallery = document.querySelector(".gallery");
  const galleryContainer = document.querySelector(".gallery-container");
  const titleContainer = document.querySelector(".title-container");

  const cards = [];
  const transformState = [];

  let currentTitle = null;
  let isPreviewActive = false;
  let isTransitioning = false;

  const galleryConfig = {
    imageCount: 20,
    radius: 275,
    sensivity: 500,
    effectFalloff: 250,
    cardMoveAmount: 50,
    lerpFactor: 0.15,
    isMobile: window.innerWidth < 979,
  };

  const parallaxState = {
    targetX: 0,
    targetY: 0,
    targetZ: 0,
    currentX: 0,
    currentY: 0,
    currentZ: 0,
  };

  for (let i = 0; i < galleryConfig.imageCount; i++) {
    const angle = (i / galleryConfig.imageCount) * Math.PI * 2;
    const x = Math.cos(angle) * galleryConfig.radius;
    const y = Math.sin(angle) * galleryConfig.radius;
    const cardIndex = i % 20;

    const card = document.createElement("div");
    card.className = "card";
    card.dataset.index = i;
    card.dataset.title = collection[cardIndex].title;

    const img = document.createElement("img");
    img.src = collection[cardIndex].img;
    card.appendChild(img);

    gsap.set(card, {
      x,
      y,
      rotation: (angle * 180) / Math.PI + 90,
      transformPerspective: 800,
      transformOrigin: "center center",
    });

    gallery.appendChild(card);
    cards.push(card);
    transformState.push({
      currentRotation: 0,
      targetRotation: 0,
      currentX: 0,
      targetX: 0,
      currentY: 0,
      targetY: 0,
      currentScale: 1,
      targetScale: 1,
      angle,
    });

    card.addEventListener("click", (e) => {
      if (!isPreviewActive && !isTransitioning) {
        togglePreview(parseInt(card.dataset.index));
        e.stopPropagation();
      }
    });
  }

  function togglePreview(index) {
    isPreviewActive = true;
    isTransitioning = true;

    const angle = transformState[index].angle;
    const targetPosition = (Math.PI * 3) / 2;
    let rotationRadians = targetPosition - angle;

    if (rotationRadians > Math.PI) rotationRadians -= Math.PI * 2;
    else if (rotationRadians < -Math.PI) rotationRadians += Math.PI * 2;

    transformState.forEach((state) => {
      state.currentRotation = state.targetRotation;
      state.currentScale = state.targetScale = 1;
      state.currentX = state.targetX = state.currentY = state.targetY = 0;
    });

    gsap.to(gallery, {
      onStart: () => {
        cards.forEach((card, i) => {
          gsap.to(card, {
            x: galleryConfig.radius * Math.cos(transformState[i].angle),
            y: galleryConfig.radius * Math.sin(transformState[i].angle),
            rotationY: 0,
            scale: 1,
            duration: 1.25,
            ease: "power4.out",
          });
        });
      },
      scale: 5,
      y: 1300,
      rotation: (rotationRadians * 180) / Math.PI + 360,
      duration: 2,
      ease: "power4.inOut",
      onComplete: () => (isTransitioning = false),
    });

    gsap.to(parallaxState, {
      currentX: 0,
      currentY: 0,
      currentZ: 0,
      duration: 0.5,
      ease: "power2.out",
      onUpdate: () => {
        gsap.set(galleryContainer, {
          rotateX: parallaxState.currentX,
          rotateY: parallaxState.currentY,
          rotateZ: parallaxState.currentZ,
          transformOrigin: "center center",
        });
      },
    });

    const titleText = cards[index].dataset.title;
    const p = document.createElement("p");
    p.textContent = titleText;
    titleContainer.appendChild(p);
    currentTitle = p;

    const splitText = new SplitText(p, {
      type: "words",
      wordsClass: "word",
    });
    const words = splitText.words;

    gsap.set(titleContainer, { opacity: 0 });
    gsap.to(titleContainer, {
      opacity: 1,
      duration: 0.5,
      delay: 1.25,
      ease: "power2.out",
    });
    gsap.set(words, { y: "125%" });
    gsap.to(words, {
      y: "0%",
      duration: 0.75,
      delay: 1.25,
      ease: "power4.out",
      stagger: 0.1,
    });
  }

  function resetGallery() {
    if (isTransitioning) return;

    isTransitioning = true;

    if (currentTitle) {
      const words = currentTitle.querySelectorAll(".word");
      gsap.to(titleContainer, {
        opacity: 0,
        duration: 0.4,
        delay: 0.5,
        ease: "power2.in",
      });
      gsap.to(words, {
        y: "-125%",
        duration: 0.75,
        delay: 0.5,
        ease: "power4.in",
        stagger: 0.1,
        onComplete: () => {
          currentTitle.remove();
          currentTitle = null;
        },
      });
    }

    const viewportWidth = window.innerWidth;
    let galleryScale = 1;

    if (viewportWidth < 768) {
      galleryScale = 0.6;
    } else if (viewportWidth < 979) {
      galleryScale = 0.8;
    }

    gsap.to(gallery, {
      scale: galleryScale,
      y: 0,
      x: 0,
      rotation: 0,
      duration: 2.5,
      ease: "power4.inOut",
      onComplete: () => {
        isPreviewActive = isTransitioning = false;
        Object.assign(parallaxState, {
          targetX: 0,
          targetY: 0,
          targetZ: 0,
          currentX: 0,
          currentY: 0,
          currentZ: 0,
        });
      },
    });
  }

  function handleResize() {
    const viewportWidth = window.innerWidth;
    galleryConfig.isMobile = viewportWidth < 979;

    let galleryScale = 1;

    if (viewportWidth < 768) {
      galleryScale = 0.6;
    } else if (viewportWidth < 979) {
      galleryScale = 0.8;
    }

    gsap.set(gallery, {
      scale: galleryScale,
    });

    if (!isPreviewActive) {
      parallaxState.targetX = 0;
      parallaxState.targetY = 0;
      parallaxState.targetZ = 0;
      parallaxState.currentX = 0;
      parallaxState.currentY = 0;
      parallaxState.currentZ = 0;

      transformState.forEach((state) => {
        state.targetRotation = 0;
        state.currentRotation = 0;
        state.targetScale = 1;
        state.currentScale = 1;
        state.targetX = 0;
        state.currentX = 0;
        state.targetY = 0;
        state.currentY = 0;
      });
    }
  }

  window.addEventListener("resize", handleResize);
  handleResize();

  document.addEventListener("click", () => {
    if (isPreviewActive && !isTransitioning) resetGallery();
  });

  document.addEventListener("mousemove", (e) => {
    if (isPreviewActive || isTransitioning || galleryConfig.isMobile) return;

    const centerX = window.innerWidth / 2;
    const centerY = window.innerHeight / 2;
    const percentX = (e.clientX - centerX) / centerX;
    const percentY = (e.clientY - centerY) / centerY;

    parallaxState.targetY = percentX * 15;
    parallaxState.targetX = -percentY * 15;
    parallaxState.targetZ = percentX * percentY * 5;

    cards.forEach((card, index) => {
      const rect = card.getBoundingClientRect();
      const dx = e.clientX - (rect.left + rect.width / 2);
      const dy = e.clientY - (rect.top + rect.height / 2);
      const distance = Math.sqrt(dx * dx + dy * dy);

      if (distance < galleryConfig.sensivity && !galleryConfig.isMobile) {
        const flipFactor = Math.max(
          0,
          1 - distance / galleryConfig.effectFalloff,
        );
        const angle = transformState[index].angle;
        const moveAmount = galleryConfig.cardMoveAmount * flipFactor;

        transformState[index].targetRotation = 180 * flipFactor;
        transformState[index].targetScale = 1 + 0.3 * flipFactor;
        transformState[index].targetX = Math.cos(angle) * moveAmount;
        transformState[index].targetY = Math.sin(angle) * moveAmount;
      } else {
        transformState[index].targetRotation = 0;
        transformState[index].targetScale = 1;
        transformState[index].targetX = 0;
        transformState[index].targetY = 0;
      }
    });
  });

  function animateGallery() {
    if (!isPreviewActive && !isTransitioning) {
      parallaxState.currentX +=
        (parallaxState.targetX - parallaxState.currentX) *
        galleryConfig.lerpFactor;
      parallaxState.currentY +=
        (parallaxState.targetY - parallaxState.currentY) *
        galleryConfig.lerpFactor;
      parallaxState.currentZ +=
        (parallaxState.targetZ - parallaxState.currentZ) *
        galleryConfig.lerpFactor;

      gsap.set(galleryContainer, {
        rotateX: parallaxState.currentX,
        rotateY: parallaxState.currentY,
        rotation: parallaxState.currentZ,
      });

      cards.forEach((card, index) => {
        const state = transformState[index];

        state.currentRotation +=
          (state.targetRotation - state.currentRotation) *
          galleryConfig.lerpFactor;
        state.currentScale +=
          (state.targetScale - state.currentScale) * galleryConfig.lerpFactor;
        state.currentX +=
          (state.targetX - state.currentX) * galleryConfig.lerpFactor;
        state.currentY +=
          (state.targetY - state.currentY) * galleryConfig.lerpFactor;

        const angle = state.angle;
        const x = galleryConfig.radius * Math.cos(angle);
        const y = galleryConfig.radius * Math.sin(angle);

        gsap.set(card, {
          x: x + state.currentX,
          y: y + state.currentY,
          rotationY: state.currentRotation,
          scale: state.currentScale,
          rotation: (angle * 180) / Math.PI + 90,
          transformPerspective: 1000,
        });
      });
    }
    requestAnimationFrame(animateGallery);
  }

  animateGallery();
});
