/* ═══════════════════════════════════════════════
   MUSK INSIGHTS BR — Main JavaScript
   Navigation, scroll animations, filters
   ═══════════════════════════════════════════════ */

document.addEventListener('DOMContentLoaded', () => {
  // ── Mobile Menu Toggle ──
  const toggle = document.querySelector('.nav-toggle');
  const links = document.querySelector('.nav-links');
  if (toggle && links) {
    toggle.addEventListener('click', () => {
      links.classList.toggle('open');
      toggle.classList.toggle('active');
    });
    // Close menu on link click
    links.querySelectorAll('a').forEach(a => {
      a.addEventListener('click', () => {
        links.classList.remove('open');
        toggle.classList.remove('active');
      });
    });
  }

  // ── Scroll Fade-in Animations ──
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1 });

  document.querySelectorAll('.fade-in').forEach(el => observer.observe(el));

  // ── Animated Counters ──
  const counters = document.querySelectorAll('[data-count]');
  const counterObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const el = entry.target;
        const target = parseInt(el.dataset.count, 10);
        const suffix = el.dataset.suffix || '';
        const duration = 2000;
        const start = performance.now();

        function update(now) {
          const progress = Math.min((now - start) / duration, 1);
          const eased = 1 - Math.pow(1 - progress, 3); // ease-out cubic
          el.textContent = Math.floor(eased * target) + suffix;
          if (progress < 1) requestAnimationFrame(update);
        }
        requestAnimationFrame(update);
        counterObserver.unobserve(el);
      }
    });
  }, { threshold: 0.5 });

  counters.forEach(el => counterObserver.observe(el));

  // ── Content Filter Tabs ──
  const tabs = document.querySelectorAll('.filter-tab');
  const cards = document.querySelectorAll('[data-type]');
  if (tabs.length && cards.length) {
    tabs.forEach(tab => {
      tab.addEventListener('click', () => {
        tabs.forEach(t => t.classList.remove('active'));
        tab.classList.add('active');
        const filter = tab.dataset.filter;
        cards.forEach(card => {
          if (filter === 'todos' || card.dataset.type === filter) {
            card.style.display = '';
          } else {
            card.style.display = 'none';
          }
        });
      });
    });
  }

  // ── Lightbox for clickable images ──
  const lightbox = document.createElement('div');
  lightbox.id = 'lightbox';
  lightbox.style.cssText = 'display:none;position:fixed;inset:0;z-index:9999;background:rgba(0,0,0,0.92);justify-content:center;align-items:center;cursor:zoom-out;';
  lightbox.innerHTML = '<button style="position:absolute;top:20px;right:24px;background:none;border:none;color:#fff;font-size:2.5rem;cursor:pointer;z-index:10000;line-height:1;" aria-label="Fechar">&times;</button><img style="max-width:92vw;max-height:92vh;border-radius:8px;object-fit:contain;" alt="">';
  document.body.appendChild(lightbox);

  const lbImg = lightbox.querySelector('img');
  const lbClose = lightbox.querySelector('button');

  function openLightbox(src) {
    lbImg.src = src;
    lightbox.style.display = 'flex';
    document.body.style.overflow = 'hidden';
  }
  function closeLightbox() {
    lightbox.style.display = 'none';
    document.body.style.overflow = '';
  }

  lbClose.addEventListener('click', closeLightbox);
  lightbox.addEventListener('click', (e) => { if (e.target !== lbImg) closeLightbox(); });
  document.addEventListener('keydown', (e) => { if (e.key === 'Escape') closeLightbox(); });

  // Convert image links that open in new tab to lightbox
  document.querySelectorAll('a[target="_blank"]').forEach(a => {
    const href = a.getAttribute('href');
    if (href && /\.(png|jpg|jpeg|webp|gif)$/i.test(href)) {
      a.removeAttribute('target');
      a.addEventListener('click', (e) => {
        e.preventDefault();
        openLightbox(href);
      });
      a.style.cursor = 'zoom-in';
    }
  });

  // ── Nav background on scroll ──
  const nav = document.querySelector('.nav');
  if (nav) {
    window.addEventListener('scroll', () => {
      if (window.scrollY > 50) {
        nav.style.background = 'rgba(10, 10, 10, 0.95)';
      } else {
        nav.style.background = 'rgba(10, 10, 10, 0.85)';
      }
    });
  }
});
