/* =============================================
   GENESISTEC — PORTFOLIO
   script.js
   ============================================= */

document.addEventListener('DOMContentLoaded', () => {

  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const finePointer  = window.matchMedia('(hover: hover) and (pointer: fine)').matches;

  /* ── Cursor personalizado (só em computador com mouse) ── */
  const cursor     = document.getElementById('cursor');
  const cursorRing = document.getElementById('cursorRing');

  if (finePointer && cursor && cursorRing) {
    document.documentElement.classList.add('has-custom-cursor');

    let mx = -100, my = -100, rx = -100, ry = -100;

    document.addEventListener('mousemove', e => {
      mx = e.clientX;
      my = e.clientY;
      cursor.style.left = mx - 5 + 'px';
      cursor.style.top  = my - 5 + 'px';
    });

    (function animRing() {
      rx += (mx - rx) * 0.12;
      ry += (my - ry) * 0.12;
      cursorRing.style.left = rx - 18 + 'px';
      cursorRing.style.top  = ry - 18 + 'px';
      requestAnimationFrame(animRing);
    })();

    document.querySelectorAll('a, button, .project-card, input, textarea').forEach(el => {
      el.addEventListener('mouseenter', () => {
        cursor.style.transform       = 'scale(2)';
        cursorRing.style.transform   = 'scale(1.5)';
        cursorRing.style.borderColor = 'rgba(192,96,240,0.6)';
      });
      el.addEventListener('mouseleave', () => {
        cursor.style.transform       = 'scale(1)';
        cursorRing.style.transform   = 'scale(1)';
        cursorRing.style.borderColor = 'rgba(0,229,255,0.5)';
      });
    });
  } else {
    cursor?.remove();
    cursorRing?.remove();
  }

  /* ── Canvas de partículas ── */
  const canvas = document.getElementById('bg-canvas');
  const ctx    = canvas.getContext('2d');
  let W, H;

  function resize() {
    W = canvas.width  = window.innerWidth;
    H = canvas.height = window.innerHeight;
  }
  resize();
  window.addEventListener('resize', resize);

  class Particle {
    constructor() { this.reset(); }
    reset() {
      this.x     = Math.random() * W;
      this.y     = Math.random() * H;
      this.vx    = (Math.random() - 0.5) * 0.3;
      this.vy    = (Math.random() - 0.5) * 0.3;
      this.size  = Math.random() * 1.5 + 0.5;
      this.alpha = Math.random() * 0.5 + 0.1;
      this.color = Math.random() > 0.6 ? '0,229,255' : '192,96,240';
    }
    update() {
      this.x += this.vx;
      this.y += this.vy;
      if (this.x < 0 || this.x > W || this.y < 0 || this.y > H) this.reset();
    }
    draw() {
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(${this.color},${this.alpha})`;
      ctx.fill();
    }
  }

  // Menos partículas no celular para não pesar
  const count     = window.innerWidth < 768 ? 55 : 120;
  const particles = Array.from({ length: count }, () => new Particle());
  const LINK_DIST = 120;
  const LINK_DIST2 = LINK_DIST * LINK_DIST;

  function drawConnections() {
    ctx.lineWidth = 0.5;
    for (let i = 0; i < particles.length; i++) {
      for (let j = i + 1; j < particles.length; j++) {
        const dx = particles[i].x - particles[j].x;
        const dy = particles[i].y - particles[j].y;
        const d2 = dx * dx + dy * dy;
        if (d2 < LINK_DIST2) {
          const dist = Math.sqrt(d2);
          ctx.beginPath();
          ctx.moveTo(particles[i].x, particles[i].y);
          ctx.lineTo(particles[j].x, particles[j].y);
          ctx.strokeStyle = `rgba(0,229,255,${(1 - dist / LINK_DIST) * 0.08})`;
          ctx.stroke();
        }
      }
    }
  }

  function frame() {
    ctx.clearRect(0, 0, W, H);
    particles.forEach(p => { if (!reduceMotion) p.update(); p.draw(); });
    drawConnections();
  }

  if (reduceMotion) {
    frame();                                   // desenha uma vez, sem animar
    window.addEventListener('resize', frame);
  } else {
    (function animate() {
      frame();
      requestAnimationFrame(animate);
    })();
  }

  /* ── Reveal ao rolar ── */
  const revealEls = document.querySelectorAll('.reveal');
  if ('IntersectionObserver' in window && !reduceMotion) {
    const observer = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.1 });
    revealEls.forEach(el => observer.observe(el));
  } else {
    revealEls.forEach(el => el.classList.add('visible'));
  }

  /* ── Nav link ativo ── */
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.nav-links a');

  function setActiveNav() {
    let current = '';
    sections.forEach(s => {
      if (window.scrollY >= s.offsetTop - 200) current = s.id;
    });
    navLinks.forEach(a => {
      a.classList.toggle('active', a.getAttribute('href') === '#' + current);
    });
  }
  window.addEventListener('scroll', setActiveNav, { passive: true });
  setActiveNav();

  /* ── Menu mobile ── */
  const toggle  = document.getElementById('navToggle');
  const linksUl = document.getElementById('navLinks');

  function setMenu(open) {
    linksUl.classList.toggle('open', open);
    toggle.classList.toggle('open', open);
    toggle.setAttribute('aria-expanded', String(open));
    toggle.setAttribute('aria-label', open ? 'Fechar menu' : 'Abrir menu');
    document.body.classList.toggle('menu-open', open);
  }

  if (toggle && linksUl) {
    toggle.addEventListener('click', () => setMenu(!linksUl.classList.contains('open')));
    document.addEventListener('keydown', e => {
      if (e.key === 'Escape' && linksUl.classList.contains('open')) setMenu(false);
    });
  }

  /* ── Smooth scroll ── */
  document.querySelectorAll('a[href^="#"]').forEach(a => {
    a.addEventListener('click', e => {
      const target = document.querySelector(a.getAttribute('href'));
      if (!target) return;
      e.preventDefault();
      if (linksUl?.classList.contains('open')) setMenu(false);
      target.scrollIntoView({ behavior: reduceMotion ? 'auto' : 'smooth' });
      history.replaceState(null, '', a.getAttribute('href'));
    });
  });

  /* ── Formulário de contato → WhatsApp ── */
  const form = document.getElementById('contactForm');
  if (form) {
    form.addEventListener('submit', e => {
      e.preventDefault();
      if (!form.reportValidity()) return;

      const data  = new FormData(form);
      const phone = form.dataset.whatsapp;
      const linhas = [
        'Olá, GenesisTec! Vim pelo site.',
        '',
        `*Nome:* ${data.get('nome').trim()}`,
        `*Email:* ${data.get('email').trim()}`,
      ];
      const projeto = (data.get('projeto') || '').trim();
      if (projeto) linhas.push(`*Projeto:* ${projeto}`);
      linhas.push('', data.get('mensagem').trim());

      const url = `https://wa.me/${phone}?text=${encodeURIComponent(linhas.join('\n'))}`;

      const btn  = form.querySelector('button[type="submit"]');
      const span = btn.querySelector('span');
      span.textContent     = 'Abrindo WhatsApp... ✓';
      btn.style.background = 'linear-gradient(135deg, #00e676, #00c853)';
      btn.disabled         = true;

      window.open(url, '_blank', 'noopener');

      setTimeout(() => {
        span.textContent     = 'Enviar Mensagem';
        btn.style.background = '';
        btn.disabled         = false;
        form.reset();
      }, 3000);
    });
  }

  /* ── Ano do rodapé ── */
  const year = document.getElementById('year');
  if (year) year.textContent = new Date().getFullYear();

});
