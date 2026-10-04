export function initImageStream(container) {
  if (!container) return;

  const PATH = {
    perspective: 30,
    cardWidth: 18,
    cardHeight: 25,
    cardRadius: 0.4,
    birthHeight: 2.6,
    exitHeight: 46,
    railBirth: -11,
    railExit: 44,
    fan: 3.3,
    turnBirth: 6,
    turnExit: 28,
    stops: 24,
  };

  const cards = 9;
  const speed = 18;
  const axis = 55;

  const id = Math.random().toString(36).substring(2, 9);
  const rightName = `ish-r-${id}`;
  const leftName = `ish-l-${id}`;
  const cardClass = `ish-c-${id}`;

  function keyframes(dir, name, p) {
    const steps = [];
    for (let s = 0; s <= p.stops; s++) {
      const u = s / p.stops;
      const scale = (p.birthHeight / p.cardHeight) * Math.pow(p.exitHeight / p.birthHeight, u);
      const z = p.perspective * (1 - 1 / scale);
      const rail = p.railExit - (p.railExit - p.railBirth) * Math.pow(1 - u, p.fan);
      const turn = p.turnBirth + (p.turnExit - p.turnBirth) * u;
      steps.push(
        `${(u * 100).toFixed(2)}%{transform:translate3d(${(dir * rail).toFixed(2)}cqw,0,${z.toFixed(2)}cqw) rotateY(${(-dir * turn).toFixed(2)}deg)}`
      );
    }
    return `@keyframes ${name}{${steps.join("")}}`;
  }

  const css = 
    keyframes(1, rightName, PATH) + 
    keyframes(-1, leftName, PATH) + 
    `@media(prefers-reduced-motion:reduce){.${cardClass}{animation-play-state:paused}}` +
    `.${cardClass} { position: absolute; overflow: hidden; backface-visibility: hidden; will-change: transform; }` +
    `.${cardClass} img { width: 100%; height: 100%; object-fit: cover; pointer-events: none; }`;

  const styleEl = document.createElement("style");
  styleEl.textContent = css;
  document.head.appendChild(styleEl);

  // We set containerType inline-size on the wrapper to enable cqw units
  const wrapper = document.createElement("div");
  wrapper.style.position = "absolute";
  wrapper.style.inset = "0";
  wrapper.style.pointerEvents = "none";
  wrapper.style.containerType = "inline-size";

  const scene = document.createElement("div");
  scene.style.position = "absolute";
  scene.style.inset = "0";
  scene.style.perspective = `${PATH.perspective}cqw`;
  scene.style.perspectiveOrigin = `50% ${axis}%`;

  const world = document.createElement("div");
  world.style.position = "absolute";
  world.style.inset = "0";
  world.style.transformStyle = "preserve-3d";
  scene.appendChild(world);
  wrapper.appendChild(scene);

  const CDN = "https://pub-940ccf6255b54fa799a9b01050e6c227.r2.dev";
  const IMAGES = [
    { src: `${CDN}/stock-images/767d99bb371a54d0d36751e8cecae43c.jpg` },
    { src: `${CDN}/gradients/hero_gradient/hero-gradients-01.png` },
    { src: `${CDN}/stock-images/821d815affa6496c39cbdeeec7a84603.jpg` },
    { src: `${CDN}/gradients/crimson_aura/crimson-aura-02.png` },
    { src: `${CDN}/stock-images/937438c560ada1c83317f2c11b3454b0.jpg` },
    { src: `${CDN}/gradients/hue-flow/hue-flow-01.png` },
    { src: `${CDN}/stock-images/98f89cb9994f5c382ab964062c4039db.jpg` },
    { src: `${CDN}/gradients/moon/moon-grade-03.png` },
    { src: `${CDN}/stock-images/ddcbee38be8b7274e19e132d7ab35b53.jpg` },
    { src: `${CDN}/gradients/hero_gradient/hero-gradients-03.png` },
    { src: `${CDN}/gradients/hue-flow/hue-flow-02.png` },
    { src: `${CDN}/gradients/moon/moon-grade-05.png` }
  ];

  [rightName, leftName].forEach(animName => {
    for (let i = 0; i < cards; i++) {
      const imgData = IMAGES[i % IMAGES.length];
      const card = document.createElement("div");
      card.className = cardClass;
      card.style.left = "50%";
      card.style.top = `${axis}%`;
      card.style.width = `${PATH.cardWidth}cqw`;
      card.style.height = `${PATH.cardHeight}cqw`;
      card.style.marginLeft = `${-PATH.cardWidth / 2}cqw`;
      card.style.marginTop = `${-PATH.cardHeight / 2}cqw`;
      card.style.borderRadius = `${PATH.cardRadius}cqw`;
      card.style.animation = `${animName} ${speed}s linear infinite`;
      card.style.animationDelay = `${-(i * speed) / cards}s`;

      const img = document.createElement("img");
      img.src = imgData.src;
      img.loading = "lazy";
      img.decoding = "async";
      card.appendChild(img);

      world.appendChild(card);
    }
  });

  container.appendChild(wrapper);
}
