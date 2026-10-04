const reviews = [
  { name: 'Ava Green', username: '@ava', body: 'Cascade AI made my workflow 10x faster!', img: 'https://cdn.21st.dev/assets/mirror/55/55cf6231499bcdc496f15ff1d28d4170ac9b99e9279495caa44fca70886d8b2e.jpg', country: '🇦🇺' },
  { name: 'Ana Miller', username: '@ana', body: 'Vertical marquee is a game changer!', img: 'https://cdn.21st.dev/assets/mirror/f0/f07b84f12ef125cbb837a7bd64da401992f5f62bd55fee10d01cd3dcc8abae80.jpg', country: '🇩🇪' },
  { name: 'Mateo Rossi', username: '@mat', body: 'Animations are buttery smooth!', img: 'https://cdn.21st.dev/assets/mirror/7c/7c0d2aa99715b15c218385f5679347782843c02f939d8eee6f9cb1cad6ba6ed0.jpg', country: '🇮🇹' },
  { name: 'Maya Patel', username: '@maya', body: 'Setup was a breeze!', img: 'https://cdn.21st.dev/assets/mirror/f8/f8f2ddc445b6b2318430260bdebb665c9415865827230565aa42f57c9c794baf.jpg', country: '🇮🇳' },
  { name: 'Noah Smith', username: '@noah', body: 'Best marquee component!', img: 'https://cdn.21st.dev/assets/mirror/ae/ae1d49872fdd6f8d9aa933f6ca8bce8cb1ba7e87dfb9d2926661184cb7bfe26d.jpg', country: '🇺🇸' },
  { name: 'Lucas Stone', username: '@luc', body: 'Very customizable and smooth.', img: 'https://cdn.21st.dev/assets/mirror/9a/9aac54d62e727561f6958213b8a3649230a3bba61ba5ddf63c69d3c6e4aecb0a.jpg', country: '🇫🇷' },
  { name: 'Haruto Sato', username: '@haru', body: 'Impressive performance on mobile!', img: 'https://cdn.21st.dev/assets/mirror/e5/e55f3cdab57eb4084f7006cfe9f7f047e638e1b257a53498aaed14b83087152a.jpg', country: '🇯🇵' },
  { name: 'Emma Lee', username: '@emma', body: 'Love the pause on hover feature!', img: 'https://cdn.21st.dev/assets/mirror/03/03410c155320ba33ecb8d798807c6c9610f33b2b2acdd4ed961a68185806df79.jpg', country: '🇨🇦' },
  { name: 'Carlos Ray', username: '@carl', body: 'Great for testimonials and logos.', img: 'https://cdn.21st.dev/assets/mirror/b5/b58616f0d669595c9a42d60a0b9803364c9859f1c3db93a5e3dc408b603e03e8.jpg', country: '🇪🇸' },
];

const renderCard = (r) => `
              <div class="t-card">
                <div class="tc-head">
                  <img src="${r.img}" alt="${r.name}" class="tc-avatar">
                  <div class="tc-info">
                    <div class="tc-name">${r.name} <span>${r.country}</span></div>
                    <div class="tc-user">${r.username}</div>
                  </div>
                </div>
                <div class="tc-body">${r.body}</div>
              </div>`;

const trackHtml = Array(3).fill(reviews.map(renderCard).join('')).join('');

const fs = require('fs');
fs.writeFileSync('scratch_testimonials.html', `
  <!-- ═══════════════════════════════════════════════ TESTIMONIALS -->
  <section class="section testimonials-section" id="testimonials">
    <div class="center-content" style="margin-bottom: 2rem;">
      <h2 class="centered-title split-line" style="color: #fff;">
        <span class="line reveal-line" data-delay="0">What They Say</span>
      </h2>
    </div>

    <div class="testimonials-3d-container">
      <div class="testimonials-3d-grid">
        <!-- Col 1 (Down) -->
        <div class="marquee-col marquee-down">
          <div class="marquee-track">
            ${trackHtml}
          </div>
        </div>
        <!-- Col 2 (Up) -->
        <div class="marquee-col marquee-up">
          <div class="marquee-track">
            ${trackHtml}
          </div>
        </div>
        <!-- Col 3 (Down) -->
        <div class="marquee-col marquee-down">
          <div class="marquee-track">
            ${trackHtml}
          </div>
        </div>
        <!-- Col 4 (Up) -->
        <div class="marquee-col marquee-up">
          <div class="marquee-track">
            ${trackHtml}
          </div>
        </div>
      </div>
      
      <!-- Gradients -->
      <div class="marquee-fade fade-t"></div>
      <div class="marquee-fade fade-b"></div>
      <div class="marquee-fade fade-l"></div>
      <div class="marquee-fade fade-r"></div>
    </div>
  </section>
`);
