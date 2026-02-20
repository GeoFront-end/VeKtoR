# VeKtoR — Year 03

> A robotics team website built with raw energy, physics, and a lot of passion.

---

## Overview

VeKtoR is the digital home of Team VeKtoR — a student robotics team based in Chișinău, Moldova, active since 2023. The site is a multi-page experience built entirely with vanilla HTML, CSS, and JavaScript, leaning on GSAP, Matter.js, Three.js, and Lenis to bring it to life.

The design direction is **editorial brutalist** — heavy typography, sharp contrast, raw layouts, and interactions that feel physical.

---

## Pages

| Page | File | Description |
|---|---|---|
| Home | `index.html` | Loader, shader hero, about blurb, image pavilions, physics footer |
| About | `pages/about.html` | Hero, identity scroll, team gallery, physics footer |
| Sponsorship | `pages/sponsorship.html` | Tiers grid, multi-step application form |

---

## Structure

```
/
├── index.html
├── pages/
│   ├── about.html
│   └── sponsorship.html
├── scripts/
│   ├── main&index.js       # Home page logic + shared menu/physics
│   ├── about.js            # Gallery, color transitions, scroll effects
│   ├── sponsorship.js      # Multi-step form logic
│   └── collection.js       # Gallery image/title data
├── styles/
│   ├── main&index.css      # Global styles + home page
│   ├── about.css           # About page styles
│   └── sponsorship.css     # Sponsorship page styles
└── assets/
    ├── images/             # Team photos used in gallery + pavilions
    └── comercial/          # Logo, icons(not all used)
```

---

## Tech Stack

| Library | Version | Used for |
|---|---|---|
| [GSAP](https://gsap.com) | 3.14.1 | Animations, ScrollTrigger, SplitText |
| [Lenis](https://lenis.darkroom.engineering) | 1.3.17 | Smooth scroll |
| [Matter.js](https://brm.io/matter-js/) | 0.20.0 | Physics simulation in footer |
| [Three.js](https://threejs.org) | r128 | WebGL glass/parallax shader on hero |

All loaded via CDN — no build step required.

---

## Features

### Home
- **Loader animation** — three-panel split reveal with kinetic typography, skippable via `sessionStorage`
- **Shader hero** — optional WebGL glass distortion effect (requires ≥8GB RAM), with graceful fallback to static image
- **Pavilions** — three horizontal image strips with opposing scroll parallax via `ScrollTrigger`
- **Physics footer** — word tags fall and collide using Matter.js, mouse acts as a collision body

### About
- **Circular gallery** — 20 cards arranged in a ring, hover triggers 3D flip + scatter, click zooms in and rotates selected card to top
- **Scroll color transition** — background and text smoothly interpolate between dark and light themes as you scroll through sections
- **Identity headers** — three SVG rows that slide in from alternating directions on scroll
- **Gallery hint** — subtle label fades out on first click, returns when gallery resets

### Sponsorship
- **Tier cards** — Bronze, Silver, Gold with full-height fill animation on hover; clicking a card scrolls to form and pre-selects that tier
- **Multi-step form** — 3 steps with validation, animated transitions, and a success screen on submit

### Shared
- **Menu overlay** — clip-path reveal with staggered link entrances, mouse-driven horizontal drift, character-by-character hover swap
- **Custom cursor** — dot + lagging ring with `mix-blend-mode: difference`, expands on interactive elements (about page)
- **Nav accent detection** — nav automatically switches color when scrolling over light sections

---

## CSS Variables

Defined in `main&index.css`:

```css
:root {
    --main:    #FF4B33;   /* accent red-orange */
    --adiacent:#2222CC;   /* electric blue */
    --dark:    #101010;   /* near black */
    --light:   #F5F5F5;   /* off white */
    --gray:    #D9D9D9;   /* muted text */
}
```

---

## Fonts

| Font | Style | Source |
|---|---|---|
| Funnel Sans | Variable 100–900, italic | Google Fonts |
| UnifrakturMaguntia | Display/blackletter | Google Fonts |

---

## Browser Notes

- WebGL shader requires a device with ≥8GB RAM (auto-detected via `navigator.deviceMemory`)
- Smooth scroll, physics, and parallax all degrade gracefully on lower-end devices
- Custom cursor is hidden on touch/mobile (`pointer: coarse`)
- Loader is shown once per session — subsequent visits skip straight to content via `sessionStorage`

---

## Team

**Team VeKtoR** — Tekwill Junior Ambassadors  
Chișinău, Moldova · Active since 2023 · Year 03

---

## Links

**Github** - https://github.com/GeoFront-end/VeKtoR.git

**GitHub Pgaes** - https://geofront-end.github.io/VeKtoR/

*Built with intention. No frameworks. No shortcuts.*