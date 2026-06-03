# THE WARNING — Technical Specification

## Dependencies

| Package | Version | Purpose |
|---------|---------|---------|
| react | ^19.0 | UI framework |
| react-dom | ^19.0 | DOM renderer |
| vite | ^6.0 | Build tool |
| @vitejs/plugin-react | ^4.0 | Vite React integration |
| tailwindcss | ^4.0 | Utility-first CSS |
| gsap | ^3.12 | Core animation engine + ScrollTrigger + SplitText plugins |
| lenis | ^1.1 | Smooth scroll with inertia |
| lucide-react | ^0.460 | Icon library (close, menu, arrows, mail, etc.) |
| @fontsource/bebas-neue | ^5.0 | Self-hosted display font |
| @fontsource/inter | ^5.0 | Self-hosted body font |

---

## Component Inventory

### Layout (shared across page)

| Component | Source | Notes |
|-----------|--------|-------|
| Navigation | Custom | Fixed bar, blur backdrop, scroll-based visibility toggle, fullscreen mobile overlay |
| CustomCursor | Custom | rAF loop, lerp follow, hover expansion. Disabled on touch devices. |
| BackgroundParticles | Custom | Canvas 2D, 60 particles, fixed layer behind all content |
| SectionTitle | Custom | Reusable: label + title + accent line. SplitText blur-reveal + line draw. |
| Footer | Custom | Three-column layout, newsletter input, social links |

### Sections

| Component | Source | Key Complexity |
|-----------|--------|----------------|
| HeroSection | Custom | Video bg, load timeline, parallax scrub, strobe overlay |
| BandSection | Custom | 3D flip card entrance (perspective), per-card hover border lines |
| DiscographySection | Custom | Momentum drag carousel with snap, elastic boundaries |
| TourSection | Custom | Grid rows with sibling dim on hover, pulsing buttons |
| GallerySection | Custom | CSS columns masonry, lightbox with FLIP open/close |

### Reusable

| Component | Source | Used By |
|-----------|--------|---------|
| Button | Custom | All sections — 3 variants (primary, outline, ticket) via prop |
| AlbumCard | Custom | DiscographySection — artwork, metadata, play overlay, streaming links |
| TourDateRow | Custom | TourSection — grid row with hover state and accent line |
| Lightbox | Custom | GallerySection — fullscreen image viewer with keyboard/touch nav |

---

## Animation Implementation

| Animation | Library | Approach | Complexity |
|-----------|---------|----------|------------|
| Hero load sequence | GSAP timeline | Single timeline with 6 staggered steps (logo letters → headline → subtitle → CTA → scroll indicator). SplitText for per-letter blur reveal. | 🔒 High |
| Hero parallax scroll | GSAP ScrollTrigger (scrub) | 3 concurrent scrub tweens: video scale 1→1.15, content translateY at 1.5x speed + fade, overlay opacity increase. | Medium |
| Concert strobe effect | CSS keyframes | Pseudo-element with timed opacity flashes over 10s cycle. Pure CSS, no JS. | Low |
| Section title blur reveal | GSAP + SplitText | SplitText splits into chars. Each char: blur(12px)→0, opacity 0→1, stagger 0.04s. Accent line scaleX draw after. | Medium |
| Cinematic section wipes | GSAP ScrollTrigger | Horizontal magenta band + optional white flash triggered at section boundaries. One-shot, not scrub. | Medium |
| Band card 3D flip entrance | GSAP ScrollTrigger | Cards start at rotateY(45deg) + x offset, animate to neutral. Container has perspective: 1000px. Stagger 0.2s. | 🔒 High |
| Card hover border lines | CSS transitions | 4 absolutely-positioned pseudo-elements, each scaleX/Y 0→1 from respective edge on parent :hover. | Medium |
| Discography carousel drag | Custom + GSAP | Pointer events track deltaX, velocity-based momentum with friction decay. GSAP tweens for snap-to-card and arrow navigation. snap/boundary logic is imperative, not declarative. | 🔒 High |
| Gallery shatter entrance | GSAP ScrollTrigger | Random-order stagger. Each image: brightness(2) blur(20px) scale(0.8) → neutral. | Medium |
| Lightbox FLIP | GSAP | On open: measure thumbnail rect, animate from rect to fullscreen center. On close: reverse. Background fade synced. | 🔒 High |
| Background particles | Canvas 2D (vanilla) | rAF loop. 60 particles with sine-wave drift. No library — raw Canvas API for performance. | Medium |
| Custom cursor | rAF + CSS | rAF loop with lerp(0.15) for position. CSS transitions for hover state expansion/color change. | Medium |
| Ticket button pulse | CSS keyframes | Infinite box-shadow oscillation. Pure CSS. | Low |
| Nav show/hide | GSAP | Opacity tween on scroll position threshold (past 100vh). | Low |
| Footer entrance | GSAP ScrollTrigger | Group fade + staggered social icon bounce. | Low |
| Gallery image hover | CSS transitions | Scale + overlay fade + centered icon scale-in. | Low |
| Tour row hover | CSS transitions | Background fade, accent line scaleY, sibling opacity dim. | Low |
| Discography album hover | CSS transitions | Artwork scale, glow shadow, play overlay back.out, streaming links slide-up. | Low |
| Mobile menu overlay | GSAP | Fullscreen fade-in, link stagger. | Low |
| Scroll indicator | CSS keyframes | Circle translateY loop + fade-out on first scroll. | Low |
| LED grid pulse | CSS keyframes | Grid line opacity oscillation. | Low |

---

## State & Logic

### Discography Carousel — Imperative Drag Engine

The carousel requires custom pointer-event handling rather than a scroll-based or library-driven approach:

- **Pointer tracking**: `onPointerDown` records startX and current translateX. `onPointerMove` calculates delta and applies directly to transform. `onPointerUp` computes release velocity.
- **Momentum**: Decay loop (rAF) multiplies velocity by 0.95 each frame until threshold. During decay, boundary checks apply elastic resistance (progressive tension past edges).
- **Snap**: On momentum end, GSAP tween snaps nearest card to center position. Snap target computed from current offset + card width + gap.
- **Active card**: Derived from snap target index — edge cards get opacity 0.6 via inline style or CSS class toggle.

This is the most complex interaction in the project. The drag, momentum, snap, and boundary logic must be encapsulated in a single hook or module.

### Lightbox — Image Preloading + FLIP Coordination

Opening the lightbox requires two coordinated operations:
1. **FLIP**: Measure the clicked thumbnail's `getBoundingClientRect()`, set the lightbox image to that exact position/size, then GSAP animate to centered fullscreen. Must wait for image to be loaded before measuring if not already cached.
2. **Preload**: The lightbox component should preload adjacent images (prev/next) after open animation completes to ensure instant navigation.

### Hero Video — Load Orchestration

The hero load timeline must not begin until the background video is sufficiently buffered. Use the `<video>` element's `canplaythrough` event as the gate. The GSAP timeline starts at that point, ensuring the video is already playing when text begins revealing.

---

## Other Key Decisions

**No React carousel library** — The discography section requires momentum drag with elastic overscroll, physics-based deceleration, and per-card snap. No existing library provides this exact behavior without fighting the API. Custom pointer-event handling is simpler and more controllable.

**No Three.js / R3F** — The design's visual effects (particles, glows, strobe) are all achievable with Canvas 2D and CSS. Three.js would add significant bundle weight (~150KB) with no benefit. The cyberpunk aesthetic is delivered through color, typography, and video — not 3D.

**No shadcn/ui** — The design is fully custom with no standard UI patterns (no forms, dialogs, tables). Every component has bespoke styling (sharp edges, neon colors, industrial aesthetic). Adding shadcn would require overriding every default.

**Self-hosted fonts** — Using @fontsource packages instead of Google Fonts CDN for reliability and to avoid external network requests. Bebas Neue is the single display face; Inter is the body face.

**Video handling** — Hero video is a `<video>` element with `autoPlay muted loop playsInline`. Provide a static poster frame (first frame as JPEG) for instant visual before video loads. Video should be compressed to < 5MB for the 5s loop.
