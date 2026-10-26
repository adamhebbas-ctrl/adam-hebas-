// ---------- Gauge ruler (builds tick marks, then sweeps the needle once) ----------
(function buildGauge() {
  const ticksEl = document.getElementById('gaugeTicks');
  const needle = document.getElementById('gaugeNeedle');
  if (!ticksEl || !needle) return;

  // 0 to 8, with 4 minor ticks between each major mark
  const majors = 8;
  const minorsBetween = 4;
  const frag = document.createDocumentFragment();

  for (let i = 0; i <= majors; i++) {
    const major = document.createElement('span');
    major.className = 'tick major';
    major.dataset.n = i;
    frag.appendChild(major);

    if (i < majors) {
      for (let j = 0; j < minorsBetween; j++) {
        const minor = document.createElement('span');
        minor.className = 'tick';
        frag.appendChild(minor);
      }
    }
  }
  ticksEl.appendChild(frag);

  window.addEventListener('load', () => needle.classList.add('run'));
})();

// ---------- Profile picture fallback ----------
(function pfpFallback() {
  const img = document.getElementById('pfp');
  const box = document.getElementById('portrait');
  if (!img || !box) return;

  const showFallback = () => box.classList.add('no-img');
  img.addEventListener('error', showFallback);
  if (img.complete && img.naturalWidth === 0) showFallback();
})();

// ---------- Mobile menu ----------
(function mobileMenu() {
  const btn = document.getElementById('menuBtn');
  const links = document.getElementById('navLinks');
  if (!btn || !links) return;

  const close = () => {
    links.classList.remove('open');
    btn.setAttribute('aria-expanded', 'false');
    btn.setAttribute('aria-label', 'Open menu');
  };

  btn.addEventListener('click', () => {
    const open = links.classList.toggle('open');
    btn.setAttribute('aria-expanded', String(open));
    btn.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
  });

  links.querySelectorAll('a').forEach(a => a.addEventListener('click', close));
  document.addEventListener('keydown', e => { if (e.key === 'Escape') close(); });
})();

// ---------- Highlight current section in the nav ----------
(function activeNav() {
  const links = document.querySelectorAll('.nav-links a');
  const sections = [...links]
    .map(a => document.querySelector(a.getAttribute('href')))
    .filter(Boolean);

  if (!('IntersectionObserver' in window)) return;

  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      links.forEach(a =>
        a.classList.toggle('active', a.getAttribute('href') === '#' + entry.target.id)
      );
    });
  }, { rootMargin: '-45% 0px -50% 0px' });

  sections.forEach(s => observer.observe(s));
})();

// ---------- Scroll progress line in the nav ----------
(function scrollProgress() {
  const bar = document.getElementById('progress');
  if (!bar) return;
  let ticking = false;

  const update = () => {
    const max = document.documentElement.scrollHeight - window.innerHeight;
    const ratio = max > 0 ? Math.min(window.scrollY / max, 1) : 0;
    bar.style.transform = 'scaleX(' + ratio + ')';
    ticking = false;
  };

  window.addEventListener('scroll', () => {
    if (!ticking) { requestAnimationFrame(update); ticking = true; }
  }, { passive: true });
  window.addEventListener('resize', update);
  update();
})();

// ---------- Copy WhatsApp number ----------
(function copyNumber() {
  const btn = document.getElementById('copyBtn');
  const status = document.getElementById('copyStatus');
  if (!btn || !status) return;

  btn.addEventListener('click', async () => {
    const number = btn.dataset.number;
    try {
      await navigator.clipboard.writeText(number);
      status.textContent = 'Number copied.';
    } catch (err) {
      status.textContent = 'Copy failed. The number is ' + number;
    }
    setTimeout(() => { status.textContent = ''; }, 3000);
  });
})();

// ---------- Footer year ----------
document.getElementById('year').textContent = new Date().getFullYear();