'use strict';

/* ══════════════════════════════════════════
   PORTFOLIO — Script.js
   WebGL fluid shader · GSAP · Lenis
══════════════════════════════════════════ */

document.addEventListener('DOMContentLoaded', () => {

  /* ══════════════════════════════
     1. LENIS SMOOTH SCROLL
  ══════════════════════════════ */
  const lenis = new Lenis({
    duration: 1.4,
    easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
    smoothWheel: true,
    smoothTouch: false,
  });

  gsap.ticker.add((time) => { lenis.raf(time * 1000); });
  gsap.ticker.lagSmoothing(0);
  gsap.registerPlugin(ScrollTrigger);
  lenis.on('scroll', ScrollTrigger.update);


  /* ══════════════════════════════
     2. WEBGL FLUID SHADER HERO
  ══════════════════════════════ */
  const canvas = document.getElementById('heroCanvas');

  if (canvas) {
    const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');

    if (gl) {
      // ─ Vertex Shader ─
      const vsSource = `
        attribute vec2 a_pos;
        void main() { gl_Position = vec4(a_pos, 0.0, 1.0); }
      `;

      // ─ Fragment Shader — organic fluid + golden light orbs ─
      const fsSource = `
        precision highp float;
        uniform float u_time;
        uniform vec2  u_res;
        uniform vec2  u_mouse;

        // Hash & noise helpers
        vec2 hash2(vec2 p) {
          p = vec2(dot(p, vec2(127.1, 311.7)), dot(p, vec2(269.5, 183.3)));
          return -1.0 + 2.0 * fract(sin(p) * 43758.5453123);
        }

        float noise(vec2 p) {
          vec2 i = floor(p);
          vec2 f = fract(p);
          vec2 u = f * f * (3.0 - 2.0 * f);
          return mix(
            mix(dot(hash2(i + vec2(0,0)), f - vec2(0,0)),
                dot(hash2(i + vec2(1,0)), f - vec2(1,0)), u.x),
            mix(dot(hash2(i + vec2(0,1)), f - vec2(0,1)),
                dot(hash2(i + vec2(1,1)), f - vec2(1,1)), u.x), u.y);
        }

        float fbm(vec2 p) {
          float v = 0.0, a = 0.5;
          mat2 r = mat2(cos(0.5), sin(0.5), -sin(0.5), cos(0.5));
          for (int i = 0; i < 5; i++) {
            v += a * noise(p);
            p = r * p * 2.0 + vec2(0.1 * float(i));
            a *= 0.5;
          }
          return v;
        }

        void main() {
          vec2 uv = gl_FragCoord.xy / u_res;
          vec2 st = uv * 2.0 - 1.0;
          st.x *= u_res.x / u_res.y;

          float t = u_time * 0.18;
          vec2 mouse = u_mouse * 2.0 - 1.0;
          mouse.x *= u_res.x / u_res.y;

          // Fluid distortion layers
          vec2 q = vec2(fbm(st + vec2(0.0, 0.0) + t * 0.3),
                        fbm(st + vec2(5.2, 1.3) + t * 0.25));

          vec2 r = vec2(fbm(st + 3.0 * q + vec2(1.7, 9.2) + t * 0.2),
                        fbm(st + 3.0 * q + vec2(8.3, 2.8) + t * 0.15));

          // Mouse influence — swirl around cursor
          vec2 mDiff = st - mouse;
          float mDist = length(mDiff);
          float mInfluence = smoothstep(1.2, 0.0, mDist) * 0.35;
          r += mDiff * mInfluence;

          float f = fbm(st + 3.5 * r);

          // Warm desert palette: bone → amber → rose → espresso
          vec3 colA = vec3(0.929, 0.894, 0.835);  // #ECE4D5 bone
          vec3 colB = vec3(1.000, 0.686, 0.216);  // #FFAF37 amber
          vec3 colC = vec3(0.337, 0.243, 0.231);  // #563E3B espresso
          vec3 colD = vec3(0.820, 0.600, 0.380);  // warm rose-gold

          float blend1 = clamp(f * f * 4.0, 0.0, 1.0);
          float blend2 = clamp(f * 2.0 - 0.5, 0.0, 1.0);
          float blend3 = clamp(r.y * 1.5, 0.0, 1.0);

          vec3 col = mix(colA, colD, blend1);
          col = mix(col, colB, blend2 * 0.7);
          col = mix(col, colC, blend3 * 0.3);

          // Golden glow orb — bottom-right
          vec2 orbCenter = vec2(0.65 * (u_res.x / u_res.y), -0.3);
          float orbDist = length(st - orbCenter);
          float orb = exp(-orbDist * orbDist * 1.8);
          orb += exp(-orbDist * orbDist * 0.5) * 0.3;
          col += vec3(1.0, 0.72, 0.18) * orb * 0.9;

          // Secondary smaller orb — left side
          vec2 orb2Center = vec2(-0.9, 0.4 + sin(t * 0.4) * 0.1);
          float orb2Dist = length(st - orb2Center);
          float orb2 = exp(-orb2Dist * orb2Dist * 4.5) * 0.4;
          col += vec3(0.95, 0.65, 0.25) * orb2;

          // Vignette
          float vig = 1.0 - length(uv - 0.5) * 1.1;
          col *= clamp(vig, 0.3, 1.0);

          // Subtle grain texture
          float grain = (fract(sin(dot(gl_FragCoord.xy, vec2(12.9898, 78.233))) * 43758.5453) - 0.5) * 0.018;
          col += grain;

          gl_FragColor = vec4(clamp(col, 0.0, 1.0), 1.0);
        }
      `;

      function compileShader(src, type) {
        const sh = gl.createShader(type);
        gl.shaderSource(sh, src);
        gl.compileShader(sh);
        if (!gl.getShaderParameter(sh, gl.COMPILE_STATUS)) {
          console.warn('Shader error:', gl.getShaderInfoLog(sh));
          return null;
        }
        return sh;
      }

      const vs = compileShader(vsSource, gl.VERTEX_SHADER);
      const fs = compileShader(fsSource, gl.FRAGMENT_SHADER);

      if (vs && fs) {
        const prog = gl.createProgram();
        gl.attachShader(prog, vs);
        gl.attachShader(prog, fs);
        gl.linkProgram(prog);
        gl.useProgram(prog);

        // Full-screen quad
        const buf = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, buf);
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([
          -1,-1,  1,-1,  -1,1,  -1,1,  1,-1,  1,1
        ]), gl.STATIC_DRAW);

        const aPos = gl.getAttribLocation(prog, 'a_pos');
        gl.enableVertexAttribArray(aPos);
        gl.vertexAttribPointer(aPos, 2, gl.FLOAT, false, 0, 0);

        const uTime  = gl.getUniformLocation(prog, 'u_time');
        const uRes   = gl.getUniformLocation(prog, 'u_res');
        const uMouse = gl.getUniformLocation(prog, 'u_mouse');

        // Mouse tracking
        let mx = 0.5, my = 0.5, tmx = 0.5, tmy = 0.5;
        document.addEventListener('mousemove', (e) => {
          tmx = e.clientX / window.innerWidth;
          tmy = 1.0 - e.clientY / window.innerHeight;
        });

        function resizeCanvas() {
          canvas.width  = canvas.offsetWidth  * Math.min(window.devicePixelRatio, 1.5);
          canvas.height = canvas.offsetHeight * Math.min(window.devicePixelRatio, 1.5);
          gl.viewport(0, 0, canvas.width, canvas.height);
        }
        resizeCanvas();
        window.addEventListener('resize', resizeCanvas);

        let startTime = performance.now();

        function renderGL() {
          // Smooth mouse lerp
          mx += (tmx - mx) * 0.04;
          my += (tmy - my) * 0.04;

          const elapsed = (performance.now() - startTime) / 1000;
          gl.uniform1f(uTime,  elapsed);
          gl.uniform2f(uRes,   canvas.width, canvas.height);
          gl.uniform2f(uMouse, mx, my);
          gl.drawArrays(gl.TRIANGLES, 0, 6);
          requestAnimationFrame(renderGL);
        }
        renderGL();
      }
    }
  }


  /* ══════════════════════════════
     3. CUSTOM CURSOR
  ══════════════════════════════ */
  const cursorEl   = document.getElementById('cursor');
  const cursorDot  = cursorEl?.querySelector('.cursor-dot');
  const cursorRing = cursorEl?.querySelector('.cursor-ring');

  let mouseX = 0, mouseY = 0, ringX = 0, ringY = 0;

  document.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
    if (cursorDot) {
      cursorDot.style.left = `${mouseX}px`;
      cursorDot.style.top  = `${mouseY}px`;
    }
  });

  (function animateCursor() {
    ringX += (mouseX - ringX) * 0.10;
    ringY += (mouseY - ringY) * 0.10;
    if (cursorRing) {
      cursorRing.style.left = `${ringX}px`;
      cursorRing.style.top  = `${ringY}px`;
    }
    requestAnimationFrame(animateCursor);
  })();

  document.querySelectorAll('a, button, .work-item-inner, .btn, .magnetic, .magnetic-work').forEach((el) => {
    el.addEventListener('mouseenter', () => cursorEl?.classList.add('is-hovered'));
    el.addEventListener('mouseleave', () => cursorEl?.classList.remove('is-hovered'));
  });


  /* ══════════════════════════════
     4. MAGNETIC BUTTON EFFECT
  ══════════════════════════════ */
  document.querySelectorAll('.magnetic, .btn-purchase').forEach((btn) => {
    btn.addEventListener('mousemove', (e) => {
      const rect = btn.getBoundingClientRect();
      const dx = (e.clientX - rect.left - rect.width  / 2) * 0.30;
      const dy = (e.clientY - rect.top  - rect.height / 2) * 0.30;
      gsap.to(btn, { x: dx, y: dy, duration: 0.4, ease: 'power2.out' });
    });
    btn.addEventListener('mouseleave', () => {
      gsap.to(btn, { x: 0, y: 0, duration: 0.6, ease: 'elastic.out(1, 0.4)' });
    });
  });


  /* ══════════════════════════════
     5. NAV SCROLL STATE
  ══════════════════════════════ */
  const nav = document.getElementById('nav');
  lenis.on('scroll', ({ scroll }) => {
    nav?.classList.toggle('is-scrolled', scroll > 60);
  });

  const sectionObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        document.querySelectorAll('.nav-item[data-section]').forEach((item) => {
          item.classList.toggle('is-active', item.dataset.section === entry.target.id);
        });
      }
    });
  }, { threshold: 0.3 });
  document.querySelectorAll('section[id], footer[id]').forEach((s) => sectionObserver.observe(s));


  /* ══════════════════════════════
     6. HERO ENTRANCE ANIMATION
        Cinematic stagger reveal
  ══════════════════════════════ */
  // Force initial hidden state for hero elements
  gsap.set('.hero-title .line', { yPercent: 105, opacity: 0 });
  gsap.set('.hero-eyebrow',     { opacity: 0, y: 20 });
  gsap.set('.hero-sub',         { opacity: 0, y: 30 });
  gsap.set('.hero-cta',         { opacity: 0, y: 25 });
  gsap.set('.hero-scroll-hint', { opacity: 0 });

  const heroTl = gsap.timeline({ delay: 0.3 });

  heroTl
    .to('.hero-eyebrow', {
      opacity: 1, y: 0,
      duration: 1.0, ease: 'power3.out',
    })
    .to('.hero-title .line', {
      yPercent: 0, opacity: 1,
      duration: 1.2,
      stagger: 0.12,
      ease: 'power4.out',
    }, '-=0.6')
    .to('.hero-sub', {
      opacity: 1, y: 0,
      duration: 1.0, ease: 'power3.out',
    }, '-=0.7')
    .to('.hero-cta', {
      opacity: 1, y: 0,
      duration: 0.9, ease: 'power3.out',
    }, '-=0.7')
    .to('.hero-scroll-hint', {
      opacity: 1,
      duration: 0.8, ease: 'power2.out',
    }, '-=0.3');


  /* ══════════════════════════════
     7. SCROLL-TRIGGERED REVEALS
  ══════════════════════════════ */

  // Clip-reveal for section titles
  gsap.utils.toArray('.reveal-clip').forEach((el) => {
    gsap.fromTo(el,
      { clipPath: 'inset(0 0 100% 0)', opacity: 0 },
      {
        clipPath: 'inset(0 0 0% 0)', opacity: 1,
        duration: 1.2, ease: 'power4.out',
        scrollTrigger: { trigger: el, start: 'top 88%', toggleActions: 'play none none none' }
      }
    );
  });

  // Line fade-up reveals
  gsap.utils.toArray(
    '.section .reveal-line, .services-strip .reveal-line, .footer-section .reveal-line'
  ).forEach((el, i) => {
    gsap.fromTo(el,
      { opacity: 0, y: 32 },
      {
        opacity: 1, y: 0,
        duration: 0.9, ease: 'power3.out',
        scrollTrigger: { trigger: el, start: 'top 90%', toggleActions: 'play none none none' }
      }
    );
  });

  // Work items
  gsap.utils.toArray('.work-item').forEach((item) => {
    gsap.fromTo(item,
      { opacity: 0, y: 50 },
      {
        opacity: 1, y: 0,
        duration: 1.0, ease: 'power3.out',
        scrollTrigger: { trigger: item, start: 'top 88%' }
      }
    );
    const divider = item.querySelector('.work-divider');
    if (divider) {
      gsap.fromTo(divider,
        { scaleX: 0 },
        {
          scaleX: 1, duration: 1.4, ease: 'power4.out',
          scrollTrigger: { trigger: item, start: 'top 88%' }
        }
      );
    }
  });

  // About image parallax
  const aboutImg = document.querySelector('.about-img');
  if (aboutImg) {
    gsap.to(aboutImg, {
      yPercent: -10, ease: 'none',
      scrollTrigger: { trigger: '.about-section', start: 'top bottom', end: 'bottom top', scrub: 1.8 }
    });
  }

  // Stats count-up
  gsap.utils.toArray('.stat').forEach((stat, i) => {
    gsap.fromTo(stat,
      { opacity: 0, y: 24 },
      {
        opacity: 1, y: 0,
        duration: 0.8, delay: i * 0.12, ease: 'power3.out',
        scrollTrigger: { trigger: stat, start: 'top 90%' }
      }
    );
  });

  // Services stagger
  gsap.utils.toArray('.service-item').forEach((item, i) => {
    gsap.fromTo(item,
      { opacity: 0, y: 36 },
      {
        opacity: 1, y: 0,
        duration: 0.9, delay: i * 0.18, ease: 'power3.out',
        scrollTrigger: { trigger: '.services-strip', start: 'top 80%' }
      }
    );
  });

  // Footer title
  gsap.fromTo('.footer-title',
    { clipPath: 'inset(0 0 100% 0)', opacity: 0 },
    {
      clipPath: 'inset(0 0 0% 0)', opacity: 1,
      duration: 1.3, ease: 'power4.out',
      scrollTrigger: { trigger: '.footer-section', start: 'top 85%' }
    }
  );


  /* ══════════════════════════════
     8. HERO PARALLAX ON SCROLL
        Text lifts away as you scroll
  ══════════════════════════════ */
  gsap.to('.hero-inner', {
    yPercent: -18, opacity: 0.0,
    ease: 'none',
    scrollTrigger: {
      trigger: '.hero',
      start: 'top top',
      end: 'bottom top',
      scrub: 1.2,
    }
  });

  gsap.to('.hero-canvas', {
    scale: 1.06, opacity: 0.7,
    ease: 'none',
    scrollTrigger: {
      trigger: '.hero',
      start: 'top top',
      end: 'bottom top',
      scrub: 2,
    }
  });


  /* ══════════════════════════════
     9. FLOATING WORK PREVIEW
  ══════════════════════════════ */
  const floatingImg = document.createElement('div');
  floatingImg.className = 'floating-preview';
  document.body.appendChild(floatingImg);

  const floatingInner = document.createElement('div');
  floatingInner.className = 'floating-preview-inner';
  floatingImg.appendChild(floatingInner);

  document.querySelectorAll('.work-item-inner').forEach((item) => {
    const img = item.querySelector('.work-img');
    const bg  = img ? img.style.backgroundImage : '';

    item.addEventListener('mouseenter', () => {
      floatingInner.style.backgroundImage = bg;
      gsap.to(floatingImg, { opacity: 1, scale: 1, rotate: -2, duration: 0.4, ease: 'power3.out' });
    });
    item.addEventListener('mousemove', (e) => {
      gsap.to(floatingImg, {
        x: e.clientX + 28,
        y: e.clientY - 100,
        duration: 0.55,
        ease: 'power3.out',
      });
    });
    item.addEventListener('mouseleave', () => {
      gsap.to(floatingImg, { opacity: 0, scale: 0.88, rotate: -4, duration: 0.35, ease: 'power2.in' });
    });
  });


  /* ══════════════════════════════
     10. SMOOTH SCROLL LINKS
  ══════════════════════════════ */
  document.querySelectorAll('a[href^="#"]').forEach((link) => {
    link.addEventListener('click', (e) => {
      const target = document.querySelector(link.getAttribute('href'));
      if (target) {
        e.preventDefault();
        lenis.scrollTo(target, {
          duration: 1.8,
          easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
        });
      }
    });
  });


  /* ══════════════════════════════
     11. ORB MOUSE PARALLAX
  ══════════════════════════════ */
  const heroOrb = document.querySelector('.hero-orb');
  document.addEventListener('mousemove', (e) => {
    if (!heroOrb) return;
    const nx = (e.clientX / window.innerWidth  - 0.5) * 40;
    const ny = (e.clientY / window.innerHeight - 0.5) * 28;
    gsap.to(heroOrb, { x: nx, y: ny, duration: 2.2, ease: 'power2.out' });
  });


  /* ══════════════════════════════
     12. MARQUEE PAUSE ON HOVER
  ══════════════════════════════ */
  const marquee = document.querySelector('.marquee-track');
  if (marquee) {
    marquee.parentElement.addEventListener('mouseenter', () => {
      gsap.to(marquee, { animationPlayState: 'paused' });
      marquee.style.animationPlayState = 'paused';
    });
    marquee.parentElement.addEventListener('mouseleave', () => {
      marquee.style.animationPlayState = 'running';
    });
  }

});
