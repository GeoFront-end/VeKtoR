//Shaders and definition
window.vertexShader = `
    precision mediump float;
    varying vec2 vUv;
    void main() {
        vUv = uv;
        gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
    }
`;

window.fragmentShader = `
precision mediump float;

uniform sampler2D uTexture;
uniform vec2 uResolution;
uniform vec2 uTextureSize;
uniform vec2 uMouse;
uniform float uParallaxStrength;
uniform float uDistortionMultiplier;
uniform float uGlassStrength;
uniform float ustripesFrequency;
uniform float uglassSmoothness;
uniform float uEdgePadding;

varying vec2 vUv;

// Scale UV to fit the texture fully inside resolution
vec2 getCoveredUV(vec2 uv, vec2 textureSize) {
    if (textureSize.x < 1.0 || textureSize.y < 1.0) return uv;

    vec2 scale = uResolution / textureSize;
    float s = max(scale.x, scale.y);

    vec2 scaledSize = textureSize * s;
    vec2 offset = (uResolution - scaledSize) * 0.5;

    return (uv * uResolution - offset) / scaledSize;
}

// Stripe-based displacement
float displacement(float x, float stripes, float strength) {
    return mod(x, 1.0 / max(stripes, 1.0)) * strength;
}

// Fractal-like glass distortion
float fractalGlass(float x) {
    float d = 0.0;
    for (int i = -5; i <= 5; i++) {
        d += displacement(x + float(i) * uglassSmoothness, ustripesFrequency, uGlassStrength);
    }
    return x + d / 11.0;
}

// Smooth edge factor (avoids hard edges)
float smoothEdge(float x, float padding) {
    return clamp(min(x / padding, (1.0 - x) / padding), 0.0, 1.0);
}

void main() {
    vec2 uv = vUv;

    // Distortion and edge factor
    float distortedX = fractalGlass(uv.x);
    float edgeFactor = smoothEdge(uv.x, uEdgePadding);
    uv.x = mix(uv.x, distortedX, edgeFactor);

    // Parallax offset based on mouse
    float parallax = -sign(0.5 - uMouse.x) * (abs(uMouse.x - 0.5)) * uParallaxStrength * (1.0 + abs(uv.x - vUv.x) * uDistortionMultiplier);
    uv += vec2(parallax * edgeFactor, 0.0);

    // Map UV to texture
    vec2 texUV = getCoveredUV(uv, uTextureSize);
    texUV = clamp(texUV, 0.0, 1.0);

    gl_FragColor = texture2D(uTexture, texUV);
}
`;


//Menu setup
window.addEventListener("DOMContentLoaded", () => {

    //Elements selection
    const container = document.querySelector(".container");
    const navToggle = document.querySelector(".nav-toggle");
    const menuOverlay = document.querySelector(".menu-overlay");
    const menuContent = document.querySelector(".menu-content");
    const menuImage = document.querySelector(".menu-img");
    const menuLinksWrapper = document.querySelector(".menu-links-wrapper");
    const linkHighlighter = document.querySelector(".link-highlighter");

    //Menu animation variables
    let currentX = 0;
    let targetX = 0;
    const lerpFactor = 0.05;

    let currentHighlighterX = 0;
    let targetHighlighterX = 0;
    let currentHighlighterWidth = 0;
    let targetHighlighterWidth = 0;

    let isMenuOpen = false;
    let isMenuAnimating = false;

    //Menu links text split
    const menuLinks = document.querySelectorAll(".menu-link a");
    menuLinks.forEach((link) => {
        const chars = link.querySelectorAll("span");
        chars.forEach((char, charIndex) => {
            const split = new SplitText(char, { type: "chars" });
            split.chars.forEach((charElement) => {
                charElement.classList.add("char");
            });
            if (charIndex === 1) {
                gsap.set(split.chars, { y: "110%" });
            }
        });
    });

    //Initial menu's overlay states
    gsap.set(menuContent, { y: "50%", opacity: 0.25 });
    gsap.set(menuImage, { scale: 0.5, opacity: 0.25 });
    gsap.set(menuLinks, { y: "150%" });
    gsap.set(linkHighlighter, { y: "450%" });

    //Highlighter position
    const defaultLinkText = document.querySelector(".menu-link:first-child a span");
    if (defaultLinkText) {
        const linkWidth = defaultLinkText.offsetWidth;
        linkHighlighter.style.width = linkWidth + "px";
        currentHighlighterWidth = linkWidth;
        targetHighlighterWidth = linkWidth;

        const defaultLinkTextElement = document.querySelector(".menu-link:first-child");
        const linkRect = defaultLinkTextElement.getBoundingClientRect();
        const menuWrapperRect = menuLinksWrapper.getBoundingClientRect();
        const initialX = linkRect.left - menuWrapperRect.left;
        currentHighlighterX = initialX;
        targetHighlighterX = initialX;
    }

    //Toggle menu function
    function toggleMenu() {
        if (isMenuAnimating) return;
        isMenuAnimating = true;

        if (!isMenuOpen) {
            gsap.to(container, {
                opacity: 0.5,
                duration: 1.25,
                ease: "expo.out",
            });

            //Open menu overlay
            gsap.to(menuOverlay, {
                clipPath: "polygon(0% 100%, 100% 100%, 100% 0%, 0% 0%)",
                duration: 1.25,
                ease: "expo.out",
                onComplete: () => {
                    gsap.set(".menu-link", { overflow: "visible"});
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
            gsap.to(container, {
                opacity: 1,
                duration: 1.25,
                ease: "expo.out",
            });

            gsap.to(menuLinks, {
                y: "-200%",
                duration: 1.25,
                ease: "expo.out",
            });

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

            //Close menu overlay
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

                    isMenuOpen = false;
                    isMenuAnimating = false;
                },
            });
        }
    }

    //Menu toggle event listener
    if (navToggle) {
        navToggle.addEventListener("click", toggleMenu);
    }

    //Menu link hover animations
    const menuLinksContainers = document.querySelectorAll(".menu-link");
    menuLinksContainers.forEach((link) => {
        link.addEventListener("mouseenter", () => {
            if (window.innerWidth < 979) return;

            const linkCopy = link.querySelectorAll("a span");
            const visibleCopy = linkCopy[0];
            const animatedCopy = linkCopy[1];

            const visibleChars = visibleCopy.querySelectorAll(".char");
            gsap.to(visibleChars, {
                y: "-110%",
                duration: 0.75,
                ease: "expo.inOut",
                stagger: 0.05,
            });

            const animatedChars = animatedCopy.querySelectorAll(".char");
            gsap.to(animatedChars, {
                y: "0%",
                duration: 0.75,
                ease: "expo.inOut",
                stagger: 0.05,
            });
        });

        link.addEventListener("mouseleave", () => {
            if (window.innerWidth < 979) return;

            const linkCopy = link.querySelectorAll("a span");
            const visibleCopy = linkCopy[0];
            const animatedCopy = linkCopy[1];

            const animatedChars = animatedCopy.querySelectorAll(".char");
            gsap.to(animatedChars, {
                y: "110%",
                duration: 0.75,
                ease: "expo.inOut",
                stagger: 0.05,
            });

            const visibleChars = visibleCopy.querySelectorAll(".char");
            gsap.to(visibleChars, {
                y: "0%",
                duration: 0.75,
                ease: "expo.inOut",
                stagger: 0.05,
            });
        });
    });

    //Menu overlay mouse movement
    if (menuOverlay) {
        menuOverlay.addEventListener("mousemove", (e) => {
            if (window.innerWidth < 979) return;

            const mouseX = e.clientX;
            const viewportWidth = window.innerWidth;
            const menuLinksWrapperWidth = menuLinksWrapper.offsetWidth;

            const maxMoveLeft = 0;
            const maxMoveRight = viewportWidth - menuLinksWrapperWidth;

            const sensitivityRange = viewportWidth * 0.5;
            const startX = (viewportWidth - sensitivityRange);
            const endX = startX + sensitivityRange;

            let mousePercentage;
            if (mouseX <= startX) {
                mousePercentage = 0;
            } else if (mouseX >= endX) {
                mousePercentage = 1;
            } else {
                mousePercentage = (mouseX - startX) / sensitivityRange;
            }

            targetX = maxMoveLeft + mousePercentage * (maxMoveRight - maxMoveLeft);
        });
    }

    //Link highlighter position
    menuLinksContainers.forEach((link) => {
        link.addEventListener("mouseenter", () => {
            if(window.innerWidth < 979) return;

            const linkRect = link.getBoundingClientRect();
            const menuWrapperRect = menuLinksWrapper.getBoundingClientRect();

            targetHighlighterX = linkRect.left - menuWrapperRect.left;

            const linkCopyElement = link.querySelector("a span");
            targetHighlighterWidth = linkCopyElement 
                ? linkCopyElement.offsetWidth 
                : link.offsetWidth;
        });
    });

    if (menuLinksWrapper) {
        menuLinksWrapper.addEventListener("mouseleave", () => {
            const defaultLinkText = document.querySelector(".menu-link:first-child");
            const defaultLinkTextSpan = defaultLinkText.querySelector("a span");

            const linkRect = defaultLinkText.getBoundingClientRect();
            const menuWrapperRect = menuLinksWrapper.getBoundingClientRect();

            targetHighlighterX = linkRect.left - menuWrapperRect.left;
            targetHighlighterWidth = defaultLinkTextSpan.offsetWidth;
        });
    }

    //Animation loop
    function animate() {
        currentX += (targetX - currentX) * lerpFactor;
        currentHighlighterX += (targetHighlighterX - currentHighlighterX) * lerpFactor;
        currentHighlighterWidth += (targetHighlighterWidth - currentHighlighterWidth) * lerpFactor;

        gsap.to(menuLinksWrapper, {
            x: currentX,
            duration: 0.3,
            ease: "power4.out",
        });

        gsap.to(linkHighlighter, {
            x: currentHighlighterX,
            width: currentHighlighterWidth,
            duration: 0.3,
            ease: "power4.out",
        });

        requestAnimationFrame(animate);
    }

    animate();
});

//Three.js WebGL Scene
const config = {
    lerpFactor: 0.035,
    parallaxStrength: 0.1,
    distortionMultiplier: 10,
    glassStrength: 2.0,
    glassSmoothness: 0.0001,
    stripesFrequency: 35.0,
    edgePadding: 0.1,
};

// RAM detection
const deviceRAM = navigator.deviceMemory || 8; // fallback to 8GB if unknown
const lowRAMFallback = deviceRAM < 6; // fallback image only if RAM < 6
const isWideScreen = window.innerWidth >= 979;

const hero = document.querySelector(".hero");
const imageElement = document.getElementById("glassTexture");

if (hero && imageElement) {

    // Low RAM fallback
    if (lowRAMFallback) {
        const img = document.createElement("img");
        img.src = imageElement.src;
        img.style.width = "100%";
        img.style.height = "auto";
        img.style.objectFit = "cover";
        hero.appendChild(img);
        console.warn("Shaders disabled: RAM < 6GB.");
    } else {
        // Initialize Three.js shader scene
        const scene = new THREE.Scene();
        const camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1);
        const renderer = new THREE.WebGLRenderer({ antialias: true });
        renderer.setSize(window.innerWidth, window.innerHeight);
        renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5));
        hero.appendChild(renderer.domElement);

        const mouse = { x: 0.5, y: 0.5 };
        const targetMouse = { x: 0.5, y: 0.5 };
        const lerp = (start, end, factor) => start + (end - start) * factor;

        const textureSize = { x: 1, y: 1 };
        const material = new THREE.ShaderMaterial({
            uniforms: {
                uTexture: { value: null },
                uResolution: { value: new THREE.Vector2(window.innerWidth, window.innerHeight) },
                uTextureSize: { value: new THREE.Vector2(textureSize.x, textureSize.y) },
                uMouse: { value: new THREE.Vector2(mouse.x, mouse.y) },
                uParallaxStrength: { value: config.parallaxStrength },
                uDistortionMultiplier: { value: config.distortionMultiplier },
                uGlassStrength: { value: config.glassStrength },
                uglassSmoothness: { value: config.glassSmoothness },
                ustripesFrequency: { value: config.stripesFrequency },
                uEdgePadding: { value: config.edgePadding },
            },
            vertexShader: window.vertexShader,
            fragmentShader: window.fragmentShader,
        });

        const geometry = new THREE.PlaneGeometry(2, 2);
        const mesh = new THREE.Mesh(geometry, material);
        scene.add(mesh);

        function loadImage() {
            if(!imageElement.complete) {
                imageElement.onload = loadImage;
                return;
            }

            const texture = new THREE.Texture(imageElement);
            texture.minFilter = THREE.LinearFilter;
            texture.magFilter = THREE.LinearFilter;
            texture.generateMipmaps = false;
            texture.needsUpdate = true;

            textureSize.x = imageElement.naturalWidth || imageElement.width;
            textureSize.y = imageElement.naturalHeight || imageElement.height;

            texture.needsUpdate = true;
            material.uniforms.uTexture.value = texture;
            material.uniforms.uTextureSize.value.set(textureSize.x, textureSize.y);
        }

        if (imageElement.complete) {
            loadImage();
        } else {
            imageElement.onload = loadImage;
        }

        // Mouse interaction only on wide screens
        window.addEventListener("mousemove", (e) => {
            if (!isWideScreen) return;
            targetMouse.x = e.clientX / window.innerWidth;
            targetMouse.y = 1.0 - e.clientY / window.innerHeight;
        });

        window.addEventListener("resize", () => {
            renderer.setSize(window.innerWidth, window.innerHeight);
            material.uniforms.uResolution.value.set(window.innerWidth, window.innerHeight);
        });

        function animateThree() {
            requestAnimationFrame(animateThree);

            // Lerp mouse only if wide screen
            if (isWideScreen) {
                mouse.x = lerp(mouse.x, targetMouse.x, config.lerpFactor);
                mouse.y = lerp(mouse.y, targetMouse.y, config.lerpFactor);
                material.uniforms.uMouse.value.set(mouse.x, mouse.y);
            }

            renderer.render(scene, camera);
        }

        animateThree();
    }
}
