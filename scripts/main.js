import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { SplitText } from "gsap/SplitText";
import Lenis from "lenis";

let lenis;

window.addEventListener("DOMContentLoaded", () => {
    const menu = document.querySelector(".content-overlay");
    const squareContainer = document.querySelector("#square-container");
    const toggleBtn = document.querySelector(".toggle");
    const shortlogo = document.querySelector(".center-nav");
    const icon = document.querySelector(".intern-logo svg path");
    gsap.registerPlugin(ScrollTrigger, SplitText);
    const header = document.querySelector(".header-sticky h2");
    const textElement1 = document.querySelector(".sticky-text-1 .text-container h2");
    const textElement2 = document.querySelector(".sticky-text-2 .text-container h2");
    const textElement3 = document.querySelector(".sticky-text-3 .text-container h2");
    const textContainer3 = document.querySelector(".sticky-text-3 .text-container");
    const outroTextBgColor = getComputedStyle(document.documentElement).getPropertyValue("--secondary-accent").trim();
    const targetScales = [];

    const lenis = new Lenis();
    lenis.on('scroll', ScrollTrigger.update);
    gsap.ticker.add((time) => {
        lenis.raf(time * 1000);
    });
    gsap.ticker.lagSmoothing(0);

    const squareSize = 100;
    let squares = [];
    let overlayVisible = false;
    
    let headerSplit = null;

    gsap.set(menu, { autoAlpha: 0, zIndex: -1 });

    if (textContainer3) {
        textContainer3.style.backgroundColor = outroTextBgColor;
    }

    if (header) {
        headerSplit = SplitText.create(header, {
            type: "words",
            wordClass: "spotlight-word"
        });
        gsap.set(headerSplit.words, { opacity: 0 });
    }

    function updateContainerSize() {
        const cols = Math.ceil(window.innerWidth / squareSize);
        const rows = Math.ceil(window.innerHeight / squareSize);

        squareContainer.style.width = `${cols * squareSize}px`;
        squareContainer.style.height = `${rows * squareSize}px`;

        return cols * rows;
    }

    function createSquares(count, opacity = 0) {
        squareContainer.innerHTML = "";
        squares = [];

        for (let i = 0; i < count; i++) {
            const sq = document.createElement("div");
            sq.classList.add("square");
            gsap.set(sq, { opacity });
            squareContainer.appendChild(sq);
            squares.push(sq);
        }
    }

    function animateSquares() {
        gsap.fromTo(
            squares,
            { opacity: 0 },
            {
                opacity: 1,
                duration: 0.0005,
                stagger: { each: 0.004, from: "random" }
            }
        );

        gsap.to(squares, {
            opacity: 0,
            delay: 1.75,
            duration: 0.0005,
            stagger: { each: 0.004 }
        });
    }

    function toggleMenu() {
        gsap.to(shortlogo, {
            autoAlpha: overlayVisible ? 1 : 0,
            delay: 1.5,
            duration: 0.2
        });

        gsap.to(icon, {
            fill: overlayVisible ? "#FF4B33" : "#D9D9D9",
            delay: 1.5,
            duration: 0.2
        });

        gsap.to(toggleBtn, {
            background: overlayVisible ? "#FF4B33" : "#D9D9D9",
            delay: 1.5,
            duration: 0.2
        });

        const count = updateContainerSize();
        createSquares(count);
        animateSquares();

        gsap.to(menu, {
            autoAlpha: overlayVisible ? 0 : 1,
            delay: 1.75,
            duration: 0.2
        });

        gsap.to(menu, {
            zIndex: overlayVisible ? -1 : 999,
            delay: overlayVisible ? 1.75 : 0
        });

        overlayVisible = !overlayVisible;
    }

    function calculateDynamicScale() {
        for (let i = 1; i <= 3; i++) {
            const section = document.querySelector(`.sticky-text-${i}`);
            const text = document.querySelector(`.sticky-text-${i} .text-container h2`);

            if (!section || !text) continue;

            const sectionHeight = section.offsetHeight;
            const textHeight = text.offsetHeight;
            targetScales[i - 1] = sectionHeight / textHeight;
        }
    }

    calculateDynamicScale();

    toggleBtn.addEventListener("click", toggleMenu);

    window.addEventListener("resize", () => {
        if (overlayVisible) {
            createSquares(updateContainerSize());
        }
    });

    window.addEventListener("resize", calculateDynamicScale);

    function setScaleY(element, scale) {
        element.style.transform = `scaleY(${scale})`;
    }

    ScrollTrigger.create({
       trigger: ".sticky-text-1",
       start: "top bottom",
       end: "top top",
       scrub: 1,
       onUpdate: (self) => {
            const currentScale = targetScales[0] * self.progress;
            setScaleY(textElement1, currentScale);
       }
    });

    ScrollTrigger.create({
       trigger: ".sticky-text-1",
       start: "top top",
       end: `+=${window.innerHeight * 1}px`,
       pin: true,
       pinSpacing: false,
       scrub: 1,
       onUpdate: (self) => {
            const currentScale = targetScales[0] * (1 - self.progress);
            setScaleY(textElement1, currentScale);
       }
    });

    ScrollTrigger.create({
       trigger: ".sticky-text-2",
       start: "top bottom",
       end: "top top",
       scrub: 1,
       onUpdate: (self) => {
            const currentScale = targetScales[1] * self.progress;
            setScaleY(textElement2, currentScale);
       }
    });

    ScrollTrigger.create({
       trigger: ".sticky-text-2",
       start: "top top",
       end: `+=${window.innerHeight * 1}px`,
       pin: true,
       pinSpacing: false,
       scrub: 1,
       onUpdate: (self) => {
            const currentScale = targetScales[1] * (1 - self.progress);
            setScaleY(textElement2, currentScale);
       }
    });

    ScrollTrigger.create({
       trigger: ".sticky-text-3",
       start: "top bottom",
       end: "top top",
       scrub: 1,
       onUpdate: (self) => {
            const currentScale = targetScales[2] * self.progress;
            setScaleY(textElement3, currentScale);
       }
    });

    ScrollTrigger.create({
        trigger: ".sticky-text-3",
        start: "top top",
        end: `+=${window.innerHeight * 4}px`,
        pin: true,
        pinSpacing: true,
        scrub: 1,
        onUpdate: (self) => {
            const progress = self.progress;


            if(progress === 0) {
                textContainer3.style.backgroundColor = outroTextBgColor;
                textContainer3.style.opacity = 1;

            }

            if (progress <= 0.75) {
                const scaleProgress = progress / 0.75;
                const currentScale = 1 + 9 * scaleProgress;
                textContainer3.style.transform = `scale3d(${currentScale}, ${currentScale}, 1)`;
            } else {
                textContainer3.style.transform = `scale3d(10, 10, 1)`;
            }

            if(progress < 0.25) {
                textContainer3.style.backgroundColor = outroTextBgColor;
                textContainer3.style.opacity = 1;
            } else if (progress >= 0.25 && progress <= 0.5) {
                const fadeProgress = (progress - 0.25) / 0.25;
                const bgOpacity = Math.max(0, Math.min(1, 1 - fadeProgress));
                textContainer3.style.backgroundColor = outroTextBgColor.replace("1)", `${bgOpacity})`);
            } else if (progress > 0.5) {
                textContainer3.style.backgroundColor = outroTextBgColor.replace("1)", "0)");
            }

            if (progress >= 0.5 && progress <= 0.75) {
                const textProgress = (progress - 0.5) / 0.25;
                const textOpacity = 1 - textProgress;
                textContainer3.style.opacity = textOpacity;
            } else if (progress > 0.75) {
                textContainer3.style.opacity = 0
            }

            if (progress >= 0.5 && progress <= 0.75) {
                const textProgress = (progress - 0.5) / 0.25;
                const textOpacity = 1 - textProgress;
                textContainer3.style.opacity = textOpacity;
            } else if (progress > 0.75) {
                textContainer3.style.opacity = 0;
            }

            if (headerSplit && headerSplit.words && headerSplit.words.length > 0) {
                if (progress >= 0.75 && progress <= 0.95) {
                    const textProgress = (progress - 0.75) / 0.2;
                    const totalWords = headerSplit.words.length;

                    headerSplit.words.forEach((word, index) => {
                        const wordPosition = index / (totalWords - 1);
                        const opacity = textProgress >= wordPosition ? 1 : 0;
                        gsap.set(word, { opacity });
                    });
                } else if (progress < 0.75) {
                    gsap.set(headerSplit.words, { opacity: 0 });
                } else if (progress > 0.95) {
                    gsap.set(headerSplit.words, { opacity: 1 });
                }
            }
        }
    });
});