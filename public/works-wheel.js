/**
 * Works Wheel ported to Vanilla JS
 */

const clamp = (v, lo, hi) => Math.min(hi, Math.max(lo, v));
const lerp = (a, b, t) => a + (b - a) * t;
const rad = (deg) => (deg * Math.PI) / 180;

const CARD_H = 0.38;
const CARD_MAX_W = 0.34;
const CARD_RATIO = 1.45;
const STEP = 40;
const DRUM = 2.22;
const LENS = 2.7;
const RING_R = 1.14;
const BOW = 1.82;
const TITLE = 0.124;
const INDEX = 0.04;
const CULL = 1.6;

const WHEEL_UNITS = 900;
const DRAG_UNITS = 420;
const SETTLE = 140;
const EASE = 0.12;

const bowAt = (drumDeg, bow) => -bow * (1 - Math.cos(rad(drumDeg)));

function place(ringDeg, drumDeg, ringR, drumR, bow, m) {
  return (
    `translateX(${m * bowAt(drumDeg, bow)}px)` +
    ` rotateZ(${(1 - m) * ringDeg}deg) translateY(${-(1 - m) * ringR}px)` +
    ` rotateX(${m * drumDeg}deg) translateZ(${m * drumR}px)`
  );
}

class WorksWheel {
  constructor(container, items) {
    console.log('WorksWheel init', container);
    this.container = container;
    this.items = items;
    this.count = items.length;
    this.last = Math.max(this.count - 1, 0);

    this.turn = 0;
    this.target = 0;
    this.active = 0;
    
    this.stage = { w: 0, h: 0 };
    this.metrics = {};
    
    this.reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    
    this.buildDOM();
    this.setupEvents();
    
    const ro = new ResizeObserver(() => this.measure());
    ro.observe(this.stageEl);
    
    this.frame = requestAnimationFrame(() => this.draw());
  }

  buildDOM() {
    this.container.innerHTML = `
      <div class="ww-stage" tabindex="0">
        <div class="ww-wheel">
          ${this.items.map((item, i) => `
            <a class="ww-card" id="ww-card-${i}" href="${item.href || '#'}" target="_blank">
              <span class="ww-card-inner">
                <img src="${item.image}" alt="${item.title}" draggable="false" />
                <span class="ww-card-action">View Reel</span>
              </span>
            </a>
          `).join('')}
        </div>
      </div>
      <div class="ww-label">Deams.Co '26</div>
      <div class="ww-title"></div>
      <ol class="ww-index">
        ${this.items.map((item, i) => `
          <li><button type="button" data-idx="${i}">${item.title}</button></li>
        `).join('')}
      </ol>
    `;

    this.stageEl = this.container.querySelector('.ww-stage');
    this.wheelEl = this.container.querySelector('.ww-wheel');
    this.cards = Array.from(this.container.querySelectorAll('.ww-card'));
    this.labelEl = this.container.querySelector('.ww-label');
    this.titleEl = this.container.querySelector('.ww-title');
    this.indexBtns = Array.from(this.container.querySelectorAll('.ww-index button'));
  }

  measure() {
    this.stage.w = this.stageEl.clientWidth;
    this.stage.h = this.stageEl.clientHeight;
    console.log('WorksWheel measure:', this.stage.w, this.stage.h);
    
    const w = this.stage.w;
    const h = this.stage.h;
    
    const cardW = Math.min(h * CARD_H * CARD_RATIO, w * CARD_MAX_W);
    const cardH = cardW / CARD_RATIO;
    const drumR = cardH * DRUM;
    const ringR = cardH * RING_R;
    
    let ringScale = 1;
    if (this.count > 0 && cardW > 0) {
      ringScale = clamp(((2 * Math.PI * ringR) / this.count) * 0.82 / cardW, 0.16, 1);
    }
    
    this.metrics = {
      cardW,
      cardH,
      ringR,
      ringScale,
      drumR,
      bow: cardH * BOW,
      depth: cardH * LENS,
      title: cardH * TITLE,
      index: cardH * INDEX,
    };
    
    this.stageEl.style.perspective = `${this.metrics.depth}px`;
    this.labelEl.style.fontSize = `${this.metrics.title}px`;
    this.titleEl.style.fontSize = `${this.metrics.title}px`;
    this.container.querySelector('.ww-index').style.fontSize = `${this.metrics.index}px`;
    
    this.cards.forEach(card => {
      card.style.width = `${cardW}px`;
      card.style.height = `${cardH}px`;
      card.style.marginLeft = `${-cardW / 2}px`;
      card.style.marginTop = `${-cardH / 2}px`;
    });
  }

  to(next) {
    this.target = clamp(next, 0, this.last + 1);
  }

  setupEvents() {
    let settlingTimer;
    
    const onWheel = (e) => {
      // Don't scroll the page while wheeling inside
      const next = this.target + e.deltaY / WHEEL_UNITS;
      if (next > 0 && next < this.last + 1) e.preventDefault();
      this.to(next);
      
      clearTimeout(settlingTimer);
      settlingTimer = setTimeout(() => this.to(Math.round(this.target)), SETTLE);
    };
    
    this.stageEl.addEventListener('wheel', onWheel, { passive: false });
    
    let dragY = null;
    this.stageEl.addEventListener('pointerdown', (e) => {
      dragY = e.clientY;
      e.currentTarget.setPointerCapture(e.pointerId);
    });
    this.stageEl.addEventListener('pointermove', (e) => {
      if (dragY === null) return;
      this.to(this.target + (dragY - e.clientY) / DRAG_UNITS);
      dragY = e.clientY;
    });
    this.stageEl.addEventListener('pointerup', () => {
      dragY = null;
      if (this.target > 1) this.to(Math.round(this.target));
    });
    
    this.stageEl.addEventListener('keydown', (e) => {
      if (e.key === 'ArrowDown') { this.to(Math.round(this.target) + 1); e.preventDefault(); }
      if (e.key === 'ArrowUp') { this.to(Math.round(this.target) - 1); e.preventDefault(); }
    });
    
    this.indexBtns.forEach((btn, i) => {
      btn.addEventListener('click', () => this.to(i + 1));
    });
  }

  draw() {
    if (this.stage.h === 0) {
      this.frame = requestAnimationFrame(() => this.draw());
      return;
    }
    
    const { ringR, ringScale, drumR, bow } = this.metrics;
    const gap = this.target - this.turn;
    
    if (Math.abs(gap) < 0.0005) {
      this.turn = this.target;
    } else {
      this.turn += gap * (this.reduced ? 1 : EASE);
    }
    
    const t = this.turn;
    const m = clamp(t, 0, 1);
    const pos = Math.max(0, t - 1);
    
    this.wheelEl.style.transform = `translateZ(${-m * drumR}px)`;
    
    for (let i = 0; i < this.count; i++) {
      const d = i - pos;
      const drumDeg = d * STEP;
      const card = this.cards[i];
      if (!card) continue;
      
      card.style.transform = place(d * (360 / this.count), drumDeg, ringR, drumR, bow, m);
      
      card.style.opacity = m > 0.5 && Math.abs(d) > CULL ? '0' : '1';
      card.style.zIndex = String(Math.round(100 - Math.abs(d) * 2));
      
      const inner = card.querySelector('.ww-card-inner');
      if (inner) {
        inner.style.transform = `scale(${lerp(ringScale, 1, m)})`;
      }
    }
    
    this.labelEl.style.opacity = String(1 - m);
    this.titleEl.style.opacity = String(m);
    
    const near = clamp(Math.round(pos), 0, this.last);
    if (near !== this.active) {
      this.active = near;
      this.titleEl.textContent = this.items[this.active]?.title;
      this.indexBtns.forEach((btn, i) => {
        if (i === this.active) btn.classList.add('active');
        else btn.classList.remove('active');
      });
    }
    
    this.frame = requestAnimationFrame(() => this.draw());
  }
}
