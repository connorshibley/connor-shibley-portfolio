export function initScrollAnimations() {
  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (reduce) return;

  const heads = document.querySelectorAll('.section-head .num');
  heads.forEach((el) => {
    const m = el.textContent.match(/(\d+)\s*\/?/);
    if (!m) return;
    const target = parseInt(m[1], 10);
    el.dataset.target = target;
    el.textContent = '00 /';
    const head = el.closest('.section-head');
    const io = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting && !el.dataset.counted) {
          el.dataset.counted = '1';
          const dur = 700;
          const start = performance.now();
          function tick(now) {
            const t = Math.min(1, (now - start) / dur);
            const eased = 1 - Math.pow(1 - t, 3);
            const v = Math.round(eased * target);
            el.textContent = String(v).padStart(2, '0') + ' /';
            if (t < 1) requestAnimationFrame(tick);
          }
          requestAnimationFrame(tick);
        }
      });
    }, { threshold: 0.3 });
    if (head) io.observe(head);
  });

  const rows = document.querySelectorAll('.proj-row, .exp-row');
  rows.forEach((r) => {
    const io = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) r.classList.add('row-in');
      });
    }, { threshold: 0.3 });
    io.observe(r);
  });

  document.querySelectorAll('.section-head h2').forEach((h) => {
    if (h.dataset.split) return;
    h.dataset.split = '1';
    const text = h.textContent;
    h.textContent = '';
    [...text].forEach((ch, i) => {
      const s = document.createElement('span');
      s.className = 'lt';
      s.textContent = ch === ' ' ? ' ' : ch;
      s.style.transitionDelay = (i * 0.04) + 's';
      h.appendChild(s);
    });
  });

  document.querySelectorAll('.stat .val').forEach((el) => {
    const raw = el.textContent.trim();
    const numMatch = raw.match(/(\d+\.?\d*)/);
    if (!numMatch) return;
    const target = parseFloat(numMatch[1]);
    const prefix = raw.substring(0, raw.indexOf(numMatch[1]));
    const suffix = raw.substring(raw.indexOf(numMatch[1]) + numMatch[1].length);
    const decimals = (numMatch[1].split('.')[1] || '').length;
    const hasItalic = el.querySelector('.it');
    el.dataset.original = el.innerHTML;
    const io = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting && !el.dataset.ticked) {
          el.dataset.ticked = '1';
          const dur = 1100;
          const start = performance.now();
          function tick(now) {
            const t = Math.min(1, (now - start) / dur);
            const eased = 1 - Math.pow(1 - t, 3);
            const v = (eased * target).toFixed(decimals);
            const inner = prefix + v + suffix;
            if (hasItalic) {
              el.innerHTML = '<span class="it">' + inner + '</span>';
            } else {
              el.textContent = inner;
            }
            if (t < 1) requestAnimationFrame(tick);
            else el.innerHTML = el.dataset.original;
          }
          requestAnimationFrame(tick);
        }
      });
    }, { threshold: 0.4 });
    io.observe(el);
  });

  const heroPhoto = document.querySelector('.hero-photo, .hero-silhouette');
  const heroTitle = document.querySelector('.hero-title');
  function onScroll() {
    const y = window.scrollY;
    if (heroPhoto) heroPhoto.style.transform = `translateY(${y * 0.18}px)`;
    if (heroTitle) heroTitle.style.transform = `translateY(${y * 0.06}px)`;
  }
  window.addEventListener('scroll', onScroll, { passive: true });

  let lastY = window.scrollY;
  let lastT = performance.now();
  const tracks = document.querySelectorAll('.marquee-track, .clients-track');
  function velocityCheck() {
    const now = performance.now();
    const dy = window.scrollY - lastY;
    const dt = now - lastT;
    if (dt > 0) {
      const v = dy / dt;
      const reverse = v < -0.4;
      tracks.forEach((t) => t.classList.toggle('marquee-reverse', reverse));
    }
    lastY = window.scrollY;
    lastT = now;
    requestAnimationFrame(velocityCheck);
  }
  requestAnimationFrame(velocityCheck);
}
