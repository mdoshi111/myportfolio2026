/* ─────────────────────────────────────────────────────────
   Monik Doshi Portfolio — main.js
   ───────────────────────────────────────────────────────── */

/* ── 1. Active nav link on scroll ─────────────────────── */
(function () {
  const sections = document.querySelectorAll('div[id]');
  const navLinks = document.querySelectorAll('.nav-links a');

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          navLinks.forEach((link) => {
            link.classList.toggle(
              'active',
              link.getAttribute('href') === '#' + entry.target.id
            );
          });
        }
      });
    },
    { rootMargin: '-40% 0px -55% 0px' }
  );

  sections.forEach((sec) => observer.observe(sec));

  // Inject active link style dynamically
  const style = document.createElement('style');
  style.textContent = '.nav-links a.active { color: #0ea5e9; }';
  document.head.appendChild(style);
})();

/* ── 2. Animate KPI numbers on scroll (count-up) ──────── */
(function () {
  function parseValue(text) {
    text = text.trim();
    const num = parseFloat(text.replace(/[^0-9.]/g, ''));
    return { num, text };
  }

  function animateCounter(el) {
    const original = el.dataset.target || el.innerText;
    el.dataset.target = original;

    const prefix = original.match(/^\$/) ? '$' : '';
    const suffix = original.match(/[%M+]+$/) ? original.match(/[%M+]+$/)[0] : '';
    const raw = parseFloat(original.replace(/[^0-9.]/g, ''));

    if (isNaN(raw)) return;

    const duration = 1200;
    const steps = 50;
    const increment = raw / steps;
    let current = 0;
    let step = 0;

    const timer = setInterval(() => {
      step++;
      current = Math.min(current + increment, raw);
      const display = Number.isInteger(raw)
        ? Math.round(current)
        : current.toFixed(1);
      el.innerText = prefix + display + suffix;
      if (step >= steps) {
        el.innerText = original; // restore exact original
        clearInterval(timer);
      }
    }, duration / steps);
  }

  const kpiNumbers = document.querySelectorAll('.kpi-number');
  const resultNums = document.querySelectorAll('.result-num');
  const metricValues = document.querySelectorAll('.metric-value');

  const allCounters = [...kpiNumbers, ...resultNums, ...metricValues];

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting && !entry.target.dataset.animated) {
          entry.target.dataset.animated = 'true';
          animateCounter(entry.target);
        }
      });
    },
    { threshold: 0.5 }
  );

  allCounters.forEach((el) => observer.observe(el));
})();

/* ── 3. Scroll-reveal for cards ────────────────────────── */
(function () {
  const style = document.createElement('style');
  style.textContent = `
    .reveal { opacity: 0; transform: translateY(28px); transition: opacity .55s ease, transform .55s ease; }
    .reveal.visible { opacity: 1; transform: none; }
  `;
  document.head.appendChild(style);

  const cards = document.querySelectorAll(
    '.case-card, .metric-card, .tech-card, .tl-item'
  );
  cards.forEach((el) => el.classList.add('reveal'));

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.12 }
  );

  cards.forEach((el) => observer.observe(el));
})();

/* ── 4. Smooth scroll for nav links ────────────────────── */
(function () {
  document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener('click', function (e) {
      const target = document.querySelector(this.getAttribute('href'));
      if (target) {
        e.preventDefault();
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });
  });
})();

/* ── 5. Back-to-top button ─────────────────────────────── */
(function () {
  const btn = document.createElement('button');
  btn.innerHTML = '↑';
  btn.setAttribute('aria-label', 'Back to top');
  btn.style.cssText = `
    position: fixed; bottom: 2rem; right: 2rem;
    width: 44px; height: 44px; border-radius: 50%;
    background: #1a56db; color: #fff;
    border: none; cursor: pointer;
    font-size: 1.2rem; font-weight: 700;
    box-shadow: 0 4px 16px rgba(26,86,219,.35);
    opacity: 0; transition: opacity .3s, transform .3s;
    transform: translateY(12px);
    z-index: 999;
  `;
  document.body.appendChild(btn);

  window.addEventListener('scroll', () => {
    const show = window.scrollY > 400;
    btn.style.opacity = show ? '1' : '0';
    btn.style.transform = show ? 'translateY(0)' : 'translateY(12px)';
  });

  btn.addEventListener('click', () =>
    window.scrollTo({ top: 0, behavior: 'smooth' })
  );
})();
