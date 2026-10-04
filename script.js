'use strict';

import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { TextPlugin } from 'gsap/TextPlugin';
import Lenis from 'lenis';
import { initJourneyResponsive } from './journey.js';
import { initWireTerrain } from './wire-terrain.js';

/* ══════════════════════════════════════════════════════
   PORTFOLIO — Script.js
   Full 3D scroll journey · GSAP ScrollTrigger · Lenis
   Palette: #FFFFFF · #ECE4D5 · #563E3B · #FFAF37
   Motion: cubic-bezier(0.19, 1, 0.22, 1) — "expo out"
══════════════════════════════════════════════════════ */

gsap.registerPlugin(ScrollTrigger, TextPlugin);

/* ─────────────────────────────────────────
   EASING CONSTANTS (from design.md)
───────────────────────────────────────── */
const EXPO   = 'cubic-bezier(0.19, 1, 0.22, 1)';
const EXPO_G = 'expo.out';     // GSAP equivalent
const SOFT   = 'power3.out';
const SCRUB  = 1.8;            // global scrub inertia

document.addEventListener('DOMContentLoaded', () => {

  /* ══════════════════════════════
     1. LENIS SMOOTH SCROLL
  ══════════════════════════════ */
  const lenis = new Lenis({
    duration: 1.6,
    easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
    smoothWheel: true,
    smoothTouch: false,
  });

  // Tie Lenis to GSAP ticker (prevents double-rAF)
  gsap.ticker.add((time) => { lenis.raf(time * 1000); });
  gsap.ticker.lagSmoothing(0);
  lenis.on('scroll', ScrollTrigger.update);

  /* ══════════════════════════════
     JOURNEY — 3D Brand Expedition
  ══════════════════════════════ */
  initJourneyResponsive();


  /* ══════════════════════════════
     2. WEBGL FLUID SHADER HERO
  ══════════════════════════════ */
  const canvas = document.getElementById('heroCanvas');
  if (canvas) {
    initWireTerrain(canvas);
  }




  /* ══════════════════════════════
     4. MAGNETIC BUTTON EFFECT
  ══════════════════════════════ */
  document.querySelectorAll('.magnetic, .btn-purchase').forEach(btn => {
    btn.addEventListener('mousemove', (e) => {
      const rect = btn.getBoundingClientRect();
      gsap.to(btn, {
        x: (e.clientX - rect.left - rect.width/2)  * 0.30,
        y: (e.clientY - rect.top  - rect.height/2) * 0.30,
        duration: 0.4, ease: 'power2.out'
      });
    });
    btn.addEventListener('mouseleave', () => {
      gsap.to(btn, { x:0, y:0, duration: 0.6, ease: 'elastic.out(1, 0.4)' });
    });
  });


  /* ══════════════════════════════
     5. NAV SCROLL STATE
  ══════════════════════════════ */
  const nav = document.getElementById('nav');
  lenis.on('scroll', ({ scroll }) => nav?.classList.toggle('is-scrolled', scroll > 60));

  new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        document.querySelectorAll('.nav-item[data-section]').forEach(item => {
          item.classList.toggle('is-active', item.dataset.section === entry.target.id);
        });
      }
    });
  }, { threshold: 0.3 }).observe && document.querySelectorAll('section[id], footer[id]').forEach(s => {
    new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          document.querySelectorAll('.nav-item[data-section]').forEach(item => {
            item.classList.toggle('is-active', item.dataset.section === entry.target.id);
          });
        }
      });
    }, { threshold: 0.3 }).observe(s);
  });


  /* ══════════════════════════════════════════════════
     6. HERO ENTRANCE — Cinematic stagger clip reveal
  ══════════════════════════════════════════════════ */
  gsap.set('.hero-title .line', { yPercent: 110, opacity: 0 });

  gsap.timeline({ delay: 0.2 })
    .to('.hero-title .line',   { yPercent:0, opacity:1, duration:1.3, ease:EXPO_G });


  /* ══════════════════════════════════════════════════════════════
     7. HERO → NEXT SECTION: 3D CINEMATIC SCROLL OUT
     Each title line exits at a different depth/speed (z-parallax)
  ══════════════════════════════════════════════════════════════ */

  // Set perspective on the hero so 3D transforms look real
  gsap.set('.hero-title', { transformPerspective: 900, transformStyle: 'preserve-3d' });
  gsap.set('.hero-inner',  { transformPerspective: 1200 });

  const heroLines = gsap.utils.toArray('.hero-title .line');

  if (heroLines[0]) {
    // "Crafting" — blasts away upward + tilts back
    gsap.to(heroLines[0], {
      yPercent: -60, rotateX: 22, z: -180, opacity: 0,
      ease: 'none',
      scrollTrigger: { trigger: '.hero', start: 'top top', end: 'bottom top', scrub: 1.0 }
    });
  }
  if (heroLines[1]) {
    // "Digital" — slower peel, slight scale down
    gsap.to(heroLines[1], {
      yPercent: -28, scale: 0.88, rotateX: 10, opacity: 0,
      ease: 'none',
      scrollTrigger: { trigger: '.hero', start: 'top top', end: 'bottom top', scrub: 1.4 }
    });
  }
  if (heroLines[2]) {
    // "Legacies." — stays longest, sinks forward
    gsap.to(heroLines[2], {
      yPercent: 8, rotateX: -12, z: 60, opacity: 0.15,
      ease: 'none',
      scrollTrigger: { trigger: '.hero', start: 'top top', end: 'bottom top', scrub: 1.9 }
    });
  }

  // Eyebrow / sub / cta lift off
  gsap.to('.hero-eyebrow, .hero-sub, .hero-cta', {
    yPercent: -22, opacity: 0,
    ease: 'none',
    scrollTrigger: { trigger: '.hero', start: 'top top', end: 'bottom top', scrub: 0.9 }
  });

  // Canvas zooms in + fades — tunnelling into the page
  gsap.to('.hero-canvas', {
    scale: 1.10, opacity: 0.4,
    ease: 'none',
    scrollTrigger: { trigger: '.hero', start: 'top top', end: 'bottom top', scrub: 2.6 }
  });

  // Orb floats up past camera
  gsap.to('.hero-orb', {
    y: -200, scale: 1.4, opacity: 0,
    ease: 'none',
    scrollTrigger: { trigger: '.hero', start: 'top top', end: 'bottom top', scrub: 2.2 }
  });


  /* ══════════════════════════════════════════════════════
     8. INTERACTIVE 3D MOUSE SWAY ON HERO TITLE
        gsap.quickTo = lowest-latency animation bridge
  ══════════════════════════════════════════════════════ */
  const heroTitle = document.querySelector('.hero-title');
  if (heroTitle) {
    const xRot  = gsap.quickTo(heroTitle, 'rotationY', { duration: 0.75, ease: SOFT });
    const yRot  = gsap.quickTo(heroTitle, 'rotationX', { duration: 0.75, ease: SOFT });
    const xShft = gsap.quickTo(heroTitle, 'x',         { duration: 0.75, ease: SOFT });
    const yShft = gsap.quickTo(heroTitle, 'y',         { duration: 0.75, ease: SOFT });

    document.addEventListener('mousemove', (e) => {
      if (lenis.scroll > window.innerHeight * 0.5) return; // only active in hero
      const nx = (e.clientX / window.innerWidth)  - 0.5;
      const ny = (e.clientY / window.innerHeight) - 0.5;
      xRot( nx *  14);
      yRot(-ny *  14);
      xShft(nx * -24);
      yShft(ny * -24);
    });
  }


  /* ══════════════════════════════════════════════════════════
     9. MARQUEE — velocity-aware speed + 3D entrance
  ══════════════════════════════════════════════════════════ */
  const marquee = document.querySelector('.marquee-track');
  if (marquee) {
    // 3D tilt on enter
    gsap.fromTo('.marquee-strip',
      { rotateX: 30, opacity: 0, y: 40 },
      {
        rotateX: 0, opacity: 1, y: 0,
        duration: 1.2, ease: EXPO_G,
        scrollTrigger: { trigger: '.marquee-strip', start: 'top 95%' }
      }
    );

    // Slow on hover
    marquee.parentElement.addEventListener('mouseenter', () => { marquee.style.animationPlayState = 'paused'; });
    marquee.parentElement.addEventListener('mouseleave', () => { marquee.style.animationPlayState = 'running'; });
  }


  /* ══════════════════════════════════════════════════════════
     10. WORK SECTION — 3D stagger cards rising from below
         Dividers draw in from left (transform origin)
  ══════════════════════════════════════════════════════════ */

  // Section label + title reveal
  gsap.fromTo('.work-section .section-label',
    { opacity:0, y:20 },
    { opacity:1, y:0, duration:0.9, ease: SOFT,
      scrollTrigger: { trigger: '.work-section .section-header', start: 'top 88%' } }
  );
  gsap.fromTo('.work-section .section-title',
    { clipPath:'inset(0 0 100% 0)', opacity:0 },
    { clipPath:'inset(0 0 0% 0)',   opacity:1, duration:1.3, ease: EXPO_G,
      scrollTrigger: { trigger: '.work-section .section-header', start: 'top 86%' } }
  );

  gsap.utils.toArray('.work-item').forEach((item, i) => {
    const inner = item.querySelector('.work-item-inner');
    const meta  = item.querySelector('.work-meta');
    const title = item.querySelector('.work-item-title');
    const img   = item.querySelector('.work-img-wrap');
    const divider = item.querySelector('.work-divider');

    // 3D rise with individual stagger delay
    gsap.fromTo(item,
      { opacity:0, y:70, rotateX:14, z:-60 },
      { opacity:1, y:0,  rotateX:0,  z:0,
        duration: 1.1, delay: i * 0.09, ease: EXPO_G,
        scrollTrigger: { trigger: item, start: 'top 88%' }
      }
    );

    // Divider draws in
    if (divider) {
      gsap.set(divider, { transformOrigin: 'left center' });
      gsap.fromTo(divider, { scaleX:0 }, {
        scaleX:1, duration:1.4, ease: EXPO_G,
        scrollTrigger: { trigger: item, start: 'top 88%' }
      });
    }

    // Image reveal on hover — subtle 3D tilt
    if (inner && img) {
      inner.addEventListener('mouseenter', () => {
        gsap.to(img, { rotateY:4, rotateX:-3, scale:1.03, duration:0.5, ease: SOFT });
      });
      inner.addEventListener('mouseleave', () => {
        gsap.to(img, { rotateY:0, rotateX:0,  scale:1.00, duration:0.7, ease: EXPO_G });
      });
    }
  });


  /* ══════════════════════════════════════════════════════════
     11. ABOUT SECTION — text slides in from left, image from right
         Profile image gets a scrubbed parallax + 3D tilt
  ══════════════════════════════════════════════════════════ */
  gsap.fromTo('.about-text-col',
    { x: -60, opacity: 0 },
    { x:   0, opacity: 1, duration: 1.2, ease: EXPO_G,
      scrollTrigger: { trigger: '.about-section', start: 'top 78%' } }
  );

  gsap.fromTo('.about-visual-col',
    { x: 60, opacity: 0 },
    { x:  0, opacity: 1, duration: 1.2, ease: EXPO_G,
      scrollTrigger: { trigger: '.about-section', start: 'top 78%' } }
  );

  // Section headings within about
  gsap.fromTo('.about-section .section-title',
    { clipPath:'inset(0 0 100% 0)', opacity:0 },
    { clipPath:'inset(0 0 0% 0)',   opacity:1, duration:1.2, ease: EXPO_G,
      scrollTrigger: { trigger: '.about-section .section-title', start: 'top 86%' } }
  );

  // Paragraphs reveal line by line
  gsap.utils.toArray('.about-p').forEach((p, i) => {
    gsap.fromTo(p,
      { opacity:0, y:24 },
      { opacity:1, y:0,  duration:0.9, delay: i*0.12, ease: SOFT,
        scrollTrigger: { trigger: p, start: 'top 91%' } }
    );
  });

  // Profile image — parallax scroll (moves up slower = depth)
  const aboutImg = document.querySelector('.about-img');
  if (aboutImg) {
    gsap.to(aboutImg, {
      yPercent: -12, ease: 'none',
      scrollTrigger: { trigger: '.about-section', start: 'top bottom', end: 'bottom top', scrub: SCRUB }
    });
  }

  // About image frame — subtle 3D tilt on scroll
  const aboutFrame = document.querySelector('.about-img-frame');
  if (aboutFrame) {
    gsap.set(aboutFrame, { transformPerspective: 800 });
    gsap.fromTo(aboutFrame,
      { rotateY: -10, rotateX: 6 },
      { rotateY:   0, rotateX: 0, duration: 1.3, ease: EXPO_G,
        scrollTrigger: { trigger: '.about-visual-col', start: 'top 80%' } }
    );
  }

  // Badge spins into view
  const badge = document.querySelector('.about-img-badge');
  if (badge) {
    gsap.fromTo(badge,
      { scale:0, rotation:-60, opacity:0 },
      { scale:1, rotation:0,   opacity:1, duration:1.0, ease: EXPO_G,
        scrollTrigger: { trigger: '.about-visual-col', start: 'top 75%' } }
    );
    // Continuous slow rotation
    gsap.to('.badge-svg', { rotation: 360, duration: 18, ease:'none', repeat:-1 });
  }

  // Stats — 3D flip up
  gsap.utils.toArray('.stat').forEach((stat, i) => {
    gsap.fromTo(stat,
      { opacity:0, y:30, rotateX:30 },
      { opacity:1, y:0,  rotateX:0,
        duration:0.9, delay: i*0.14, ease: EXPO_G,
        scrollTrigger: { trigger: '.about-stats', start: 'top 88%' }
      }
    );
  });


  /* ══════════════════════════════════════════════════════════
     12. SERVICES STRIP — 3D DEPTH REVEAL
         Panel tilts from 3D angle → flat
  ══════════════════════════════════════════════════════════ */
  gsap.set('.services-strip', { transformPerspective: 1000 });

  gsap.fromTo('.services-inner',
    { rotateX: 18, y: 60, opacity: 0 },
    { rotateX:  0, y:  0, opacity: 1, duration: 1.3, ease: EXPO_G,
      scrollTrigger: { trigger: '.services-strip', start: 'top 82%' } }
  );

  gsap.utils.toArray('.service-item').forEach((item, i) => {
    gsap.fromTo(item,
      { opacity:0, y:40, rotateY: i % 2 === 0 ? -12 : 12 },
      { opacity:1, y:0,  rotateY:0,
        duration:1.0, delay: i * 0.15, ease: EXPO_G,
        scrollTrigger: { trigger: '.services-strip', start: 'top 80%' }
      }
    );
  });


  /* ══════════════════════════════════════════════════════════
     13. FOOTER — Big title crash-lands from above
         3D perspective entry for the CTA zone
  ══════════════════════════════════════════════════════════ */
  gsap.set('.footer-section', { transformPerspective: 1200 });

  gsap.fromTo('.footer-section .section-label',
    { opacity:0, y:20 },
    { opacity:1, y:0, duration:0.9, ease: SOFT,
      scrollTrigger: { trigger: '.footer-section', start: 'top 88%' } }
  );

  // Title crashes in from top (perspective-driven)
  gsap.fromTo('.footer-title',
    { y:-80, rotateX: -30, opacity:0 },
    { y:  0, rotateX:   0, opacity:1,
      duration:1.4, ease: EXPO_G,
      scrollTrigger: { trigger: '.footer-section', start: 'top 80%' }
    }
  );

  // CTA button scales up from nothing
  gsap.fromTo('#btn-contact',
    { scale:0.6, opacity:0 },
    { scale:1.0, opacity:1, duration:1.0, ease: EXPO_G,
      scrollTrigger: { trigger: '#btn-contact', start: 'top 90%' }
    }
  );

  // Footer bottom links stagger in
  gsap.fromTo('.footer-col',
    { opacity:0, y:30 },
    { opacity:1, y:0, duration:0.85, stagger:0.1, ease: SOFT,
      scrollTrigger: { trigger: '.footer-bottom', start: 'top 90%' }
    }
  );


  /* ══════════════════════════════════════════════════════════
     14. SECTION TRANSITION OVERLAPPING DEPTH SCRUB
         Each section slightly scales and fades on exit
         creating a "stacked z-depth" effect
  ══════════════════════════════════════════════════════════ */
  gsap.utils.toArray('.section').forEach(section => {
    gsap.to(section, {
      scale: 0.94,
      opacity: 0.6,
      ease: 'none',
      scrollTrigger: {
        trigger: section,
        start: 'bottom 60%',
        end:   'bottom top',
        scrub: 1.2,
      }
    });
  });


  /* ══════════════════════════════════════════════════════════
     15. FLOATING WORK PREVIEW on hover
         Parked at x:-9999 at all times except when cursor
         is actively over a work item — prevents scroll bleed.
  ══════════════════════════════════════════════════════════ */
  const floatingImg = document.createElement('div');
  floatingImg.className = 'floating-preview';
  document.body.appendChild(floatingImg);

  const floatingInner = document.createElement('div');
  floatingInner.className = 'floating-preview-inner';
  floatingImg.appendChild(floatingInner);

  // Park far off-screen from the very start
  gsap.set(floatingImg, { x: -9999, y: -9999, opacity: 0, scale: 0.88, rotate: -4, force3D: true });

  let isHoveringWork = false;
  let isScrolling = false;
  let scrollTimeout = null;

  // Kill visibility immediately on any scroll
  lenis.on('scroll', () => {
    isScrolling = true;
    gsap.killTweensOf(floatingImg);
    gsap.set(floatingImg, { opacity: 0, x: -9999, y: -9999 });
    
    clearTimeout(scrollTimeout);
    scrollTimeout = setTimeout(() => { isScrolling = false; }, 150);
  });

  document.querySelectorAll('.work-item-inner').forEach(item => {
    const bg = item.querySelector('.work-img')?.style.backgroundImage || '';

    item.addEventListener('mouseenter', () => {
      isHoveringWork = true;
      if (isScrolling) return; // Prevent synthetic hover on scroll
      floatingInner.style.backgroundImage = bg;
      gsap.to(floatingImg, { opacity: 1, scale: 1, rotate: -2, duration: 0.4, ease: SOFT });
    });

    item.addEventListener('mousemove', (e) => {
      // If we entered during a scroll, it was suppressed. Reveal it now that they moved the mouse.
      if (gsap.getProperty(floatingImg, 'opacity') === 0 && !isScrolling) {
        floatingInner.style.backgroundImage = bg;
        gsap.to(floatingImg, { opacity: 1, scale: 1, rotate: -2, duration: 0.4, ease: SOFT });
      }
      gsap.to(floatingImg, { x: e.clientX + 28, y: e.clientY - 100, duration: 0.5, ease: SOFT });
    });

    item.addEventListener('mouseleave', () => {
      isHoveringWork = false;
      gsap.to(floatingImg, {
        opacity: 0, scale: 0.88, rotate: -4, duration: 0.3, ease: 'power2.in',
        onComplete: () => gsap.set(floatingImg, { x: -9999, y: -9999 }),
      });
    });
  });


  /* ══════════════════════════════════════════════════════════
     16. SMOOTH SCROLL LINKS
  ══════════════════════════════════════════════════════════ */
  document.querySelectorAll('a[href^="#"]').forEach(link => {
    link.addEventListener('click', (e) => {
      const target = document.querySelector(link.getAttribute('href'));
      if (target) {
        e.preventDefault();
        lenis.scrollTo(target, { duration: 1.8, easing: (t) => Math.min(1, 1.001 - Math.pow(2,-10*t)) });
      }
    });
  });


  /* ══════════════════════════════════════════════════════════
     17. ORB PARALLAX
  ══════════════════════════════════════════════════════════ */
  const heroOrb = document.querySelector('.hero-orb');
  document.addEventListener('mousemove', (e) => {
    if (!heroOrb) return;
    gsap.to(heroOrb, {
      x: (e.clientX/window.innerWidth  - 0.5) * 40,
      y: (e.clientY/window.innerHeight - 0.5) * 28,
      duration: 2.2, ease: 'power2.out'
    });
  });

});
