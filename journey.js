/**
 * journey.js — "The Brand Expedition"
 * ─────────────────────────────────────────────────────────────────
 * Scroll-driven 3D journey using GSAP ScrollTrigger + CSS perspective.
 * One master scrubbed timeline. Each section is a "stop" on the route.
 * The camera "flies forward" through z-depth layers.
 *
 * DEPENDENCIES (all already installed):
 *   gsap@3.15.0, ScrollTrigger, DrawSVGPlugin, MotionPathPlugin, SplitText
 *
 * FILES CREATED/CHANGED:
 *   journey.js   (this file — new)
 *   journey.css  (companion styles — new)
 *
 * ──────────────── CONFIG BLOCK ────────────────
 * Tweak these 4 values to adjust speed / feel:
 */
const CONFIG = {
  scrub:        1.4,    // ① Inertia of scrub (0 = instant, 3 = very laggy)
  scrollPerStop: 120,   // ② vh of scroll each "stop" occupies
  ease:         'none', // ③ Timeline ease (none = 1:1 with scroll, power1 = weighted)
  debug:        false,  // ④ true = show ScrollTrigger markers (dev only)
};
/* ─────────────────────────────────────────────────────────────────  */

import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { DrawSVGPlugin }  from 'gsap/DrawSVGPlugin';
import { MotionPathPlugin } from 'gsap/MotionPathPlugin';
import { SplitText }      from 'gsap/SplitText';

gsap.registerPlugin(ScrollTrigger, DrawSVGPlugin, MotionPathPlugin, SplitText);

/* ─────────────────────────────────────────────────────────────────
   JOURNEY STOPS
   Each stop maps to a section on the page and defines the
   "camera" z-position the viewer moves to.
───────────────────────────────────────────────────────────────── */
const STOPS = [
  { id: 'intro',   label: 'Sky',       cameraZ: 0    },
  { id: 'work',    label: 'Gallery',   cameraZ: -900 },
  { id: 'about',   label: 'Studio',    cameraZ: -1800 },
  { id: 'contact', label: 'Daylight',  cameraZ: -2600 },
];

/* ─────────────────────────────────────────────────────────────────
   INJECT JOURNEY OVERLAY DOM
   We create a fixed canvas-like overlay for the route SVG and
   the travelling marker, injected once and never touching existing
   page content.
───────────────────────────────────────────────────────────────── */
function injectJourneyDOM() {
  if (document.getElementById('journey-stage')) return;

  const stage = document.createElement('div');
  stage.id = 'journey-stage';
  stage.setAttribute('aria-hidden', 'true');
  stage.innerHTML = `
    <!-- Route SVG — right edge of viewport -->
    <svg id="journey-svg" viewBox="0 0 60 800" preserveAspectRatio="none"
         xmlns="http://www.w3.org/2000/svg">
      <!-- The curved path the marker travels along -->
      <path id="journey-path"
        d="M30,20 C30,20 10,200 30,250 C50,300 10,400 30,500 C50,600 30,750 30,780"
        fill="none"
        stroke="rgba(255,175,55,0.25)"
        stroke-width="1.5"
        stroke-dasharray="4 8"
      />
      <!-- Drawn version (colour, draws in with scroll) -->
      <path id="journey-path-drawn"
        d="M30,20 C30,20 10,200 30,250 C50,300 10,400 30,500 C50,600 30,750 30,780"
        fill="none"
        stroke="#FFAF37"
        stroke-width="2"
        stroke-linecap="round"
      />
      <!-- Stop dots -->
      ${STOPS.map((s, i) => {
        const y = 20 + i * 253;
        return `
          <circle class="journey-dot" data-stop="${s.id}"
            cx="30" cy="${y}" r="4"
            fill="#ECE4D5" stroke="#FFAF37" stroke-width="1.5"
          />
          <text class="journey-label" x="38" y="${y + 4}"
            fill="rgba(255,175,55,0.7)" font-size="7"
            font-family="DM Sans, sans-serif" letter-spacing="1">
            ${s.label}
          </text>
        `;
      }).join('')}
    </svg>

    <!-- Travelling marker — hero element that rides the path -->
    <div id="journey-marker" title="You are here">
      <div class="journey-marker-ring"></div>
      <div class="journey-marker-dot"></div>
    </div>

    <!-- Altitude / depth readout -->
    <div id="journey-altitude">
      <span id="journey-altitude-val">0</span>
      <span id="journey-altitude-unit">km</span>
    </div>
  `;
  document.body.appendChild(stage);
}

/* ─────────────────────────────────────────────────────────────────
   DEPTH LAYERS
   We add CSS classes to existing sections to give them z-depth
   start positions that the camera "flies past".
   We never move or restructure the existing DOM.
───────────────────────────────────────────────────────────────── */
function tagDepthLayers() {
  // Give the perspective container to <body>'s first child wrapper
  // We scope perspective to each section individually (safer for Lenis)
  STOPS.forEach((stop, i) => {
    const el = document.getElementById(stop.id);
    if (!el) return;
    el.dataset.journeyStop = i;
    el.dataset.journeyLabel = stop.label;
  });
}

/* ─────────────────────────────────────────────────────────────────
   SPLIT STOP HEADINGS
   SplitText wraps heading chars so we can stagger-reveal per stop.
───────────────────────────────────────────────────────────────── */
function splitStopHeadings() {
  const headings = {};
  STOPS.forEach(stop => {
    const section = document.getElementById(stop.id);
    if (!section) return;
    const h = section.querySelector('h1, h2, .footer-title');
    if (!h) return;
    // Don't re-split elements that have already been processed
    if (h.dataset.split) return;
    h.dataset.split = '1';
    headings[stop.id] = new SplitText(h, { type: 'lines,chars', linesClass: 'split-line' });
  });
  return headings;
}

/* ─────────────────────────────────────────────────────────────────
   MAIN INIT
───────────────────────────────────────────────────────────────── */
export function initJourney() {
  // Respect prefers-reduced-motion — plain layout, no scrubbed motion
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  injectJourneyDOM();
  tagDepthLayers();

  // Wait one tick for DOM to settle before splitting + triggering
  gsap.delayedCall(0.05, () => {
    const splitHeadings = splitStopHeadings();
    buildTimeline(splitHeadings);
    buildMarkerPath();
    buildAltitudeCounter();
    // Refresh after images/fonts load
    window.addEventListener('load', () => ScrollTrigger.refresh());
  });
}

/* ─────────────────────────────────────────────────────────────────
   MASTER TIMELINE
   One long scrubbed timeline, pinned to the page scroll.
   Each stop is ~CONFIG.scrollPerStop vh long.
───────────────────────────────────────────────────────────────── */
function buildTimeline(splitHeadings) {
  const totalStops = STOPS.length - 1; // segments between stops
  const totalScrollVH = totalStops * CONFIG.scrollPerStop;

  // ── ROUTE LINE draws in from 0% → 100% over the whole journey
  gsap.fromTo('#journey-path-drawn',
    { drawSVG: '0%' },
    {
      drawSVG: '100%',
      ease: CONFIG.ease,
      scrollTrigger: {
        trigger: '#intro',
        start: 'top top',
        end:   `+=${totalScrollVH}vh`,
        scrub: CONFIG.scrub,
        markers: CONFIG.debug,
        id: 'route-draw',
      },
    }
  );

  // ── PER-STOP ANIMATIONS
  // Each stop uses its own lightweight ScrollTrigger so content
  // animates when it's actually in view — not scrubbed to the master.
  STOPS.forEach((stop, i) => {
    const section = document.getElementById(stop.id);
    if (!section) return;

    const isFirst = i === 0;
    const isLast  = i === STOPS.length - 1;

    // ── 3D CAMERA ARRIVAL per section ──────────────────────────
    // Sections start scaled down + pushed back in z, fly forward
    // as they enter the viewport.
    if (!isFirst) {
      gsap.set(section, { 
        transformPerspective: 1100, 
        transformOrigin: '50% 50%' 
      });
      gsap.fromTo(section,
        { z: 200, scale: 0.92, rotationX: 6, opacity: 0 },
        {
          z: 0, scale: 1, rotationX: 0, opacity: 1,
          duration: 1.2,
          ease: 'expo.out',
          scrollTrigger: {
            trigger: section,
            start: 'top 85%',
            toggleActions: 'play none none reverse',
            markers: CONFIG.debug,
            id: `arrive-${stop.id}`,
          }
        }
      );
    }

    // ── SECTION EXIT — pushes back as user scrolls past ────────
    if (!isLast) {
      gsap.to(section, {
        z: -300, scale: 0.88, rotationX: -8, opacity: 0.5,
        ease: CONFIG.ease,
        scrollTrigger: {
          trigger: section,
          start: 'bottom 55%',
          end:   'bottom top',
          scrub: CONFIG.scrub * 0.8,
          markers: CONFIG.debug,
          id: `exit-${stop.id}`,
        }
      });
    }

    // ── PARALLAX DEPTH LAYERS within each section ──────────────
    // Elements at different depths move at different speeds,
    // reinforcing the 3D tunnel feel.
    const deepEl  = section.querySelectorAll('[data-depth="far"]');
    const midEl   = section.querySelectorAll('[data-depth="mid"]');
    const nearEl  = section.querySelectorAll('[data-depth="near"]');

    [
      { els: deepEl,  speed: 0.3,  z: -120 },
      { els: midEl,   speed: 0.55, z: -60  },
      { els: nearEl,  speed: 0.8,  z:  40  },
    ].forEach(({ els, speed, z }) => {
      if (!els.length) return;
      gsap.to(els, {
        yPercent: -(100 * (1 - speed)),
        z,
        ease: CONFIG.ease,
        scrollTrigger: {
          trigger: section,
          start: 'top bottom',
          end:   'bottom top',
          scrub: CONFIG.scrub,
        }
      });
    });

    // ── HEADING CHARACTER STAGGER REVEAL ──────────────────────
    const split = splitHeadings[stop.id];
    if (split?.chars) {
      gsap.set(split.chars, { yPercent: 110, opacity: 0, rotateX: 30 });
      gsap.to(split.chars, {
        yPercent: 0,
        opacity: 1,
        rotateX: 0,
        duration: 0.8,
        ease: 'expo.out',
        stagger: { amount: 0.5, from: 'start' },
        scrollTrigger: {
          trigger: section,
          start: 'top 75%',
          toggleActions: 'play none none reverse',
          markers: CONFIG.debug,
          id: `chars-${stop.id}`,
        }
      });
    }

    // ── STOP DOT — pulse when section is active ───────────────
    const dot = document.querySelector(`.journey-dot[data-stop="${stop.id}"]`);
    if (dot) {
      ScrollTrigger.create({
        trigger: section,
        start: 'top 60%',
        end:   'bottom 40%',
        onEnter:      () => dot.classList.add('is-active'),
        onLeave:      () => dot.classList.remove('is-active'),
        onEnterBack:  () => dot.classList.add('is-active'),
        onLeaveBack:  () => dot.classList.remove('is-active'),
      });
    }
  });

  // ── WORK CARDS — 3D stacked gallery parallax ───────────────
  // Each work item enters from a different z-depth with a slight
  // Y-rotation, simulating frames hanging in a 3D corridor.
  gsap.utils.toArray('.work-item').forEach((item, i) => {
    const dir = i % 2 === 0 ? 1 : -1;
    gsap.set(item, { transformPerspective: 900 });
    gsap.fromTo(item,
      { z: -400, rotationY: dir * 18, opacity: 0, scale: 0.85 },
      {
        z: 0, rotationY: 0, opacity: 1, scale: 1,
        duration: 1.1,
        ease: 'expo.out',
        scrollTrigger: {
          trigger: item,
          start: 'top 88%',
          toggleActions: 'play none none reverse',
          markers: CONFIG.debug,
          id: `card-${i}`,
        }
      }
    );
  });

  // ── ABOUT IMAGE — mural on a wall passing by ───────────────
  const aboutFrame = document.querySelector('.about-img-frame');
  if (aboutFrame) {
    gsap.set(aboutFrame, { transformPerspective: 800 });
    gsap.fromTo(aboutFrame,
      { z: -500, rotationY: 20, x: 80, opacity: 0 },
      {
        z: 0, rotationY: 0, x: 0, opacity: 1,
        duration: 1.4,
        ease: 'expo.out',
        scrollTrigger: {
          trigger: aboutFrame,
          start: 'top 80%',
          toggleActions: 'play none none reverse',
          markers: CONFIG.debug,
          id: 'about-mural',
        }
      }
    );
  }

  // ── SERVICES — pillars burst up from below ─────────────────
  gsap.utils.toArray('.service-item').forEach((item, i) => {
    gsap.set(item, { transformPerspective: 700 });
    gsap.fromTo(item,
      { z: -200, y: 120, rotationX: -25, opacity: 0 },
      {
        z: 0, y: 0, rotationX: 0, opacity: 1,
        duration: 1.0,
        ease: 'expo.out',
        delay: i * 0.12,
        scrollTrigger: {
          trigger: '.services-strip',
          start: 'top 78%',
          toggleActions: 'play none none reverse',
          markers: CONFIG.debug,
          id: `pillar-${i}`,
        }
      }
    );
  });

  // ── CONTACT / DESTINATION — "emerges into daylight" ────────
  // Whole footer section rises from z=-800 while a warm light
  // washes the background (CSS class toggle).
  const footer = document.querySelector('.footer-section');
  if (footer) {
    gsap.set(footer, { transformPerspective: 1200 });
    gsap.fromTo(footer,
      { z: -800, scale: 0.78, rotationX: 18, opacity: 0 },
      {
        z: 0, scale: 1, rotationX: 0, opacity: 1,
        duration: 1.6,
        ease: 'expo.out',
        scrollTrigger: {
          trigger: footer,
          start: 'top 90%',
          toggleActions: 'play none none none',
          markers: CONFIG.debug,
          id: 'destination',
          onEnter: () => footer.classList.add('is-destination'),
        }
      }
    );
  }
}

/* ─────────────────────────────────────────────────────────────────
   MARKER ALONG MOTION PATH
   The small "you are here" marker travels along #journey-path
   using MotionPathPlugin tied to scroll progress.
───────────────────────────────────────────────────────────────── */
function buildMarkerPath() {
  const marker = document.getElementById('journey-marker');
  const svg    = document.getElementById('journey-svg');
  const path   = document.getElementById('journey-path');
  if (!marker || !path) return;

  // Total scroll distance is the same as the route draw
  const totalStops = STOPS.length - 1;
  const totalScrollVH = totalStops * CONFIG.scrollPerStop;

  gsap.to(marker, {
    motionPath: {
      path: path,
      align: path,
      alignOrigin: [0.5, 0.5],
      autoRotate: false,
    },
    ease: CONFIG.ease,
    scrollTrigger: {
      trigger: '#intro',
      start: 'top top',
      end:   `+=${totalScrollVH}vh`,
      scrub: CONFIG.scrub,
      markers: CONFIG.debug,
      id: 'marker-path',
    }
  });
}

/* ─────────────────────────────────────────────────────────────────
   ALTITUDE COUNTER
   A live "depth" readout that counts from 0 → –2600 as you scroll,
   like an altimeter in a descending aircraft.
───────────────────────────────────────────────────────────────── */
function buildAltitudeCounter() {
  const valEl = document.getElementById('journey-altitude-val');
  if (!valEl) return;

  const totalStops = STOPS.length - 1;
  const totalScrollVH = totalStops * CONFIG.scrollPerStop;
  const maxDepth = Math.abs(STOPS[STOPS.length - 1].cameraZ);

  const proxy = { depth: 0 };

  gsap.to(proxy, {
    depth: maxDepth,
    ease: CONFIG.ease,
    onUpdate: () => {
      valEl.textContent = `-${Math.round(proxy.depth).toLocaleString()}`;
    },
    scrollTrigger: {
      trigger: '#intro',
      start: 'top top',
      end:   `+=${totalScrollVH}vh`,
      scrub: CONFIG.scrub,
      id: 'altitude',
    }
  });
}

/* ─────────────────────────────────────────────────────────────────
   RESPONSIVE — lighter on mobile (no z-depth, no route UI)
───────────────────────────────────────────────────────────────── */
export function initJourneyResponsive() {
  gsap.matchMedia().add(
    // Desktop: full journey
    '(min-width: 900px) and (prefers-reduced-motion: no-preference)',
    () => {
      initJourney();
      // Cleanup returned from the context function
      return () => {
        ScrollTrigger.getAll().filter(t => t.vars?.id?.includes('-')).forEach(t => t.kill());
        const stage = document.getElementById('journey-stage');
        stage?.remove();
      };
    }
  );

  gsap.matchMedia().add(
    // Mobile: just the section arrive animation, no path/marker
    '(max-width: 899px) and (prefers-reduced-motion: no-preference)',
    () => {
      document.querySelectorAll('.section, .footer-section').forEach(section => {
        gsap.fromTo(section,
          { opacity: 0, y: 40 },
          {
            opacity: 1, y: 0,
            duration: 0.9, ease: 'power3.out',
            scrollTrigger: { trigger: section, start: 'top 88%' }
          }
        );
      });
    }
  );
}
