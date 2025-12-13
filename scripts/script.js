window.addEventListener('DOMContentLoaded', () => {
    const menu = document.querySelector('.content-overlay');
    const squareContainer = document.querySelector('#square-container');
    const toggleBtn = document.querySelector('.toggle');
    const shortlogo = document.querySelector('.center-nav');
    const icon = document.querySelector('.intern-logo svg path');
    const squareSize = 100;

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
            delay: overlayVisible ? 1.5 : 0,
            duration: 0.2
        })

        gsap.to(icon, {
            delay: overlayVisible ? 1.5 : 0,
            duration: 0.2,
            fill: overlayVisible ? "#FF4B33" : "#F5F5F5",
            hover: {
                
            }
        })

        gsap.to(toggleBtn, {
            delay: overlayVisible ? 1.5 : 0,
            duration: 0.2,
            background: overlayVisible ? "#FF4B33" : "#F5F5F5",
            hover: {
                
            }
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
            zIndex: overlayVisible ? -1 : 1,
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