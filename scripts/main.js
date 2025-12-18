// import * as THREE from 'three';
// import { vertexShader, fluidShader, displayShader } from './shaders.js';

// const config = {
//     brushSize: 25.0,
//     brushStrength: 0.5,
//     distortionAmount: 2.5,
//     fluidDecay: 0.98,
//     trailLength: 0.8,
//     stopDecay: 0.85,
//     color1: "#b8fff7",
//     color2: "#6e3466",
//     color3: "#0133ff",
//     color4: "#66d1fe",
//     colorIntensity: 1.0,
//     softness: 1.0,
// };

// function hexToRgb(hex) {
//     const r = parseInt(hex.slice(1, 3), 16) / 255;
//     const g = parseInt(hex.slice(3, 5), 16) / 255;
//     const b = parseInt(hex.slice(5, 7), 16) / 255;
//     return [r, g, b];
// }

// const camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1);
// const renderer = new THREE.WebGLRenderer({ antialias: true });

// const gradientCanvas = document.querySelector('.gradient-canvas');
//     renderer.setSize(window.innerWidth, window.innerHeight);
//     gradientCanvas.appendChild(renderer.domElement);

// const fluidTarget1 = new THREE.WebGLRenderTarget(window.innerWidth, window.innerHeight, 
//     {
//         minFilter: THREE.LinearFilter,
//         magFilter: THREE.LinearFilter,
//         format: THREE.RGBAFormat,
//         type: THREE.FloatType,
//     }
// );

// const fluidTarget2 = new THREE.WebGLRenderTarget(window.innerWidth, window.innerHeight, 
//     {
//         minFilter: THREE.LinearFilter,
//         magFilter: THREE.LinearFilter,
//         format: THREE.RGBAFormat,
//         type: THREE.FloatType,
//     }
// );

// let currentFluidTarget = fluidTarget1;
// let previousFluidTarget = fluidTarget2;
// let frameCount = 0;

// const fluidMaterial = new THREE.ShaderMaterial({
//     uniforms: {
//         iTime: { value: 0 },
//         iResolution: { value: new THREE.Vector2(window.innerWidth, window.innerHeight) },
//         iMouse: { value: new THREE.Vector4(0, 0, 0, 0) },
//         iFrame: { value: 0 },
//         iPreviousFrame: { value: null },
//         uBrushSize: { value: config.brushSize },
//         uBrushStrength: { value: config.brushStrength },
//         uFluidDecay: { value: config.fluidDecay },
//         uTrailLength: { value: config.trailLength },
//         uStopDecay: { value: config.stopDecay },
//     },
//     vertexShader: vertexShader,
//     fragmentShader: fluidShader,
// });

// const displayMaterial = new THREE.ShaderMaterial({
//     uniforms: {
//         iTime: { value: 0 },
//         iResolution: { value: new THREE.Vector2(window.innerWidth, window.innerHeight) },
//         iFluid: { value: null },
//         iDistortionAmount: { value: config.distortionAmount },
//         uColor1: { value: new THREE.Vector3(...hexToRgb(config.color1)) },
//         uColor2: { value: new THREE.Vector3(...hexToRgb(config.color2)) },
//         uColor3: { value: new THREE.Vector3(...hexToRgb(config.color3)) },
//         uColor4: { value: new THREE.Vector3(...hexToRgb(config.color4)) },
//         uColorIntensity: { value: config.colorIntensity },
//         uSoftness: { value: config.softness },
//     },
//     vertexShader: vertexShader,
//     fragmentShader: displayShader,
// });

// const geometry = new THREE.PlaneGeometry(2, 2);
// const fluidPlane = new THREE.Mesh(geometry, fluidMaterial);
// const displayPlane = new THREE.Mesh(geometry, displayMaterial);

// let mouseX = 0, mouseY = 0;
// let prevMouseX = 0, prevMouseY = 0;
// let lastMoveTime = 0;

// document.addEventListener('mousemove', (e) => {
//     const rect = gradientCanvas.getBoundingClientRect();
//     prevMouseX = mouseX;
//     prevMouseY = mouseY;
//     mouseX = e.clientX - rect.left;
//     mouseY = rect.height - (e.clientY - rect.top);
//     lastMoveTime = performance.now();
//     fluidMaterial.uniforms.iMouse.value.set(mouseX, mouseY, prevMouseX, prevMouseY);
// });

// document.addEventListener('mouseleave', () => {
//     fluidMaterial.uniforms.iMouse.value.set(0, 0, 0, 0);
// });

// function animate() {
//     requestAnimationFrame(animate);

//     const time = performance.now() * 0.001;
//     fluidMaterial.uniforms.iTime.value = time;
//     fluidMaterial.uniforms.iTime.value = time;
//     displayMaterial.uniforms.iTime.value = frameCount;

//     if (performance.now() - lastMoveTime > 100) {
//         fluidMaterial.uniforms.iMouse.value.set(0, 0, 0, 0);
//     }

//     fluidMaterial.uniforms.uBrushSize.value = config.brushSize;
//     fluidMaterial.uniforms.uBrushStrength.value = config.brushStrength;
//     fluidMaterial.uniforms.uFluidDecay.value = config.fluidDecay;
//     fluidMaterial.uniforms.uTrailLength.value = config.trailLength;
//     fluidMaterial.uniforms.uStopDecay.value = config.stopDecay;

//     displayMaterial.uniforms.iDistortionAmount.value = config.distortionAmount;
//     displayMaterial.uniforms.uColorIntensity.value = config.colorIntensity;
//     displayMaterial.uniforms.uSoftness.value = config.softness;
//     displayMaterial.uniforms.uColor1.value.set(...hexToRgb(config.color1));
//     displayMaterial.uniforms.uColor2.value.set(...hexToRgb(config.color2));
//     displayMaterial.uniforms.uColor3.value.set(...hexToRgb(config.color3));
//     displayMaterial.uniforms.uColor4.value.set(...hexToRgb(config.color4));

//     fluidMaterial.uniforms.iPreviousFrame.value = previousFluidTarget.texture;
//     renderer.setRenderTarget(currentFluidTarget);
//     renderer.render(fluidPlane, camera);

//     displayMaterial.uniforms.iFluid.value = currentFluidTarget.texture;
//     renderer.setRenderTarget(null);
//     renderer.render(displayPlane, camera);

//     const temp = currentFluidTarget;
//     currentFluidTarget = previousFluidTarget;
//     previousFluidTarget = temp;

//     frameCount++;
// }

// window.addEventListener('resize', () => {
//     const width = window.innerWidth;
//     const height = window.innerHeight;

//     renderer.setSize(width, height);
//     fluidMaterial.uniforms.iResolution.value.set(width, height);
//     displayMaterial.uniforms.iResolution.value.set(width, height);
    
//     fluidTarget1.setSize(width, height);
//     fluidTarget2.setSize(width, height);
//     frameCount = 0;
// });

// animate();

window.addEventListener('DOMContentLoaded', () => {
    const menu = document.querySelector('.content-overlay');
    const squareContainer = document.querySelector('#square-container');
    const toggleBtn = document.querySelector('.toggle');
    const shortlogo = document.querySelector('.center-nav');
    const icon = document.querySelector('.intern-logo svg path');
    const squareSize = 100;

    toggleBtn.addEventListener('click', () => {
        setTimeout(() => {
            toggleBtn.classList.toggle('active');
        }, 1500);
    });

    let squares = [];
    let overlayVisible = false;

    gsap.set(menu, { autoAlpha: 0, zIndex: -1 });

    function updateContainerSize() {
        const screenWidth = window.innerWidth;
        const screenHeight = window.innerHeight;

        const numCols = Math.ceil(screenWidth / squareSize);
        const numRows = Math.ceil(screenHeight / squareSize);
        const numSquares = numCols * numRows;

        squareContainer.style.width = `${numCols * squareSize}px`;
        squareContainer.style.height = `${numRows * squareSize}px`;

        return numSquares;
    }

    function createSquares(numSquares, initialOpacity = 0) {
        squareContainer.innerHTML = '';
        squares = [];
        for (let i = 0; i < numSquares; i++) {
            const square = document.createElement('div');
            square.classList.add('square');
            gsap.set(square, { opacity: initialOpacity });
            squareContainer.appendChild(square);
            squares.push(square);
        }
    }

    function animateSquares() {
        gsap.fromTo(squares, 
            { opacity: 0 }, 
            { 
                opacity: 1,
                delay: 0,
                duration: 0.0005,
                stagger: { each: 0.004, from: 'random' }
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
            duration: 0.2,
        })

        gsap.to(icon, {
            delay: 1.5,
            duration: 0.2,
            fill: overlayVisible ? "#FF4B33" : "#D9D9D9",
        })

        gsap.to(toggleBtn, {
            delay: 1.5,
            duration: 0.2,
            background: overlayVisible ? "#FF4B33" : "#D9D9D9",
        })
        
        const numSquares = updateContainerSize();
        createSquares(numSquares, 0);
        animateSquares();

        gsap.to(menu, {
            autoAlpha: overlayVisible ? 0 : 1,
            delay: 1.75,
            duration: 0.2
        });

        gsap.to(menu, {
            zIndex: overlayVisible ? -1 : 999,
            delay: overlayVisible ? 1.75 : 0,
            duration: 0.2
        });

        overlayVisible = !overlayVisible;
    }

    toggleBtn.addEventListener('click', toggleMenu);

    window.addEventListener('resize', () => {
        updateContainerSize();
        if (overlayVisible) {
            createSquares(updateContainerSize(), 0);
        }
    });
});
