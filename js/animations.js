/**
 * Astra Global Solution — Motion System
 * GSAP · ScrollTrigger · AOS
 * Text reveal · Parallax · Cards · Smooth scroll · Counters · Page transitions
 */

const AstraMotion = {
  initialized: false,
  reduced: false,
  gsapReady: false,
  triggers: [],

  init() {
    if (this.initialized) return;
    this.initialized = true;
    this.reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    this.gsapReady = typeof gsap !== 'undefined';

    injectPageTransition();
    initPageEnterTransition();
    initSmoothScroll();
    initPageTransitions();

    if (this.reduced) {
      document.body.classList.add('motion-reduced');
      enableStaticFallback();
      initAOS(true);
      return;
    }

    document.body.classList.add('motion-ready');

    if (this.gsapReady) {
      initGSAPMotion();
      initAOS(false);
    } else {
      initAOS(true);
      initScrollFallback();
    }
  },

  refresh() {
    if (typeof ScrollTrigger !== 'undefined') {
      ScrollTrigger.refresh(true);
    }
    if (typeof AOS !== 'undefined') {
      AOS.refresh();
    }
  },

  kill() {
    this.triggers.forEach(t => t.kill());
    this.triggers = [];
    if (typeof ScrollTrigger !== 'undefined') {
      ScrollTrigger.getAll().forEach(t => t.kill());
    }
  }
};

document.addEventListener('DOMContentLoaded', () => AstraMotion.init());
window.addEventListener('astra:components-loaded', () => {
  animateLateElements('.footer-col');
  setTimeout(() => AstraMotion.refresh(), 100);
});

function animateLateElements(selector) {
  if (!AstraMotion.gsapReady || AstraMotion.reduced) return;

  const els = gsap.utils.toArray(selector).filter(el => !el.dataset.motionDone);
  if (!els.length) return;

  gsap.from(els, {
    opacity: 0,
    y: 28,
    duration: 0.6,
    stagger: 0.08,
    ease: 'power2.out',
    onComplete: () => els.forEach(el => { el.dataset.motionDone = 'true'; })
  });
}

window.AstraMotion = AstraMotion;

/* ── Page transition overlay ── */
function injectPageTransition() {
  if (document.getElementById('pageTransition')) return;
  const overlay = document.createElement('div');
  overlay.id = 'pageTransition';
  overlay.className = 'page-transition';
  overlay.setAttribute('aria-hidden', 'true');
  document.body.prepend(overlay);
}

function initPageEnterTransition() {
  const overlay = document.getElementById('pageTransition');
  if (!overlay || AstraMotion.reduced) return;

  if (document.getElementById('pageLoader')) return;

  overlay.classList.add('is-active');
  overlay.style.opacity = '1';

  if (AstraMotion.gsapReady) {
    gsap.to(overlay, {
      opacity: 0,
      duration: 0.45,
      ease: 'power2.inOut',
      onComplete: () => {
        overlay.classList.remove('is-active');
        overlay.style.opacity = '';
      }
    });
  } else {
    overlay.style.transition = 'opacity 0.4s ease';
    requestAnimationFrame(() => {
      overlay.style.opacity = '0';
      setTimeout(() => overlay.classList.remove('is-active'), 400);
    });
  }
}

function initPageTransitions() {
  if (AstraMotion.reduced) return;

  document.addEventListener('click', e => {
    const link = e.target.closest('a');
    if (!link) return;

    const href = link.getAttribute('href');
    if (!href || href.startsWith('#') || href.startsWith('mailto:') || href.startsWith('tel:')) return;
    if (link.target === '_blank' || link.hasAttribute('download')) return;
    if (link.hostname && link.hostname !== window.location.hostname) return;

    e.preventDefault();
    const overlay = document.getElementById('pageTransition');
    document.body.classList.add('is-transitioning');

    const navigate = () => { window.location.href = link.href; };

    if (overlay && AstraMotion.gsapReady) {
      overlay.classList.add('is-active');
      gsap.to(overlay, {
        opacity: 1,
        duration: 0.35,
        ease: 'power2.in',
        onComplete: navigate
      });
    } else if (overlay) {
      overlay.classList.add('is-active');
      overlay.style.opacity = '1';
      setTimeout(navigate, 300);
    } else {
      navigate();
    }
  });
}

/* ── Smooth scroll ── */
function initSmoothScroll() {
  document.addEventListener('click', e => {
    const link = e.target.closest('a[href^="#"]');
    if (!link) return;

    const id = link.getAttribute('href');
    if (!id || id === '#') return;

    const target = document.querySelector(id);
    if (!target) return;

    e.preventDefault();
    const navHeight = parseInt(getComputedStyle(document.documentElement).getPropertyValue('--navbar-height'), 10) || 80;
    const y = target.getBoundingClientRect().top + window.scrollY - navHeight;

    if (AstraMotion.gsapReady && !AstraMotion.reduced && gsap.plugins?.scrollTo) {
      gsap.to(window, {
        scrollTo: { y, autoKill: false },
        duration: 0.85,
        ease: 'power2.inOut'
      });
    } else {
      window.scrollTo({ top: y, behavior: AstraMotion.reduced ? 'auto' : 'smooth' });
    }
  });
}

/* ── GSAP core ── */
function initGSAPMotion() {
  if (typeof ScrollTrigger !== 'undefined') {
    gsap.registerPlugin(ScrollTrigger);
    ScrollTrigger.config({
      limitCallbacks: true,
      ignoreMobileResize: true
    });
  }

  stripDuplicateAOS();
  initHeroTimeline();
  initTextReveal();
  initParallaxLayers();
  initBatchCardAnimations();
  initSectionSpecificAnimations();
  initCounters();
  initNavbarGlassScroll();
}

function stripDuplicateAOS() {
  document.querySelectorAll('[data-aos]').forEach(el => {
    el.removeAttribute('data-aos');
    el.removeAttribute('data-aos-delay');
    el.removeAttribute('data-aos-duration');
  });
}

function trackTrigger(config) {
  const trigger = ScrollTrigger.create(config);
  AstraMotion.triggers.push(trigger);
  return trigger;
}

/* ── Text reveal ── */
function initTextReveal() {
  const selectors = ['.hero-title-line', '.page-hero h1', '.section-title'];
  const elements = [];

  selectors.forEach(sel => {
    document.querySelectorAll(sel).forEach(el => {
      if (!el.classList.contains('text-reveal')) {
        wrapRevealWords(el);
        el.classList.add('text-reveal');
      }
      if (!el.closest('#hero')) elements.push(el);
    });
  });

  elements.forEach(el => {
    const words = el.querySelectorAll('.reveal-word');
    if (!words.length) return;

    gsap.from(words, {
      scrollTrigger: {
        trigger: el,
        start: 'top 88%',
        toggleActions: 'play none none none'
      },
      y: '1.1em',
      opacity: 0,
      duration: 0.65,
      stagger: 0.04,
      ease: 'power3.out'
    });
  });

  document.querySelectorAll('.section-label').forEach(label => {
    gsap.from(label, {
      scrollTrigger: { trigger: label, start: 'top 90%', toggleActions: 'play none none none' },
      y: 16,
      opacity: 0,
      duration: 0.5,
      ease: 'power2.out'
    });
  });
}

function wrapRevealWords(el) {
  if (el.dataset.revealWrapped) return;
  el.dataset.revealWrapped = 'true';

  const walker = document.createTreeWalker(el, NodeFilter.SHOW_TEXT, null, false);
  const textNodes = [];
  while (walker.nextNode()) textNodes.push(walker.currentNode);

  textNodes.forEach(node => {
    const text = node.textContent;
    if (!text.trim()) return;
    const frag = document.createDocumentFragment();
    text.split(/(\s+)/).forEach(part => {
      if (/^\s+$/.test(part)) {
        frag.appendChild(document.createTextNode(part));
      } else if (part) {
        const span = document.createElement('span');
        span.className = 'reveal-word';
        span.textContent = part;
        frag.appendChild(span);
      }
    });
    node.parentNode.replaceChild(frag, node);
  });
}

/* ── Hero timeline ── */
function initHeroTimeline() {
  const hero = document.getElementById('hero');
  if (!hero) return;

  document.querySelectorAll('.hero-title-line').forEach(line => {
    if (!line.classList.contains('text-reveal')) {
      wrapRevealWords(line);
      line.classList.add('text-reveal');
    }
  });

  const tl = gsap.timeline({ defaults: { ease: 'power3.out' } });
  tl.from('.hero-badge', { y: 30, opacity: 0, duration: 0.7, delay: 0.15 })
    .from('.hero-title-line .reveal-word', { y: 40, opacity: 0, duration: 0.55, stagger: 0.06 }, '-=0.35')
    .from('.hero-subtitle', { y: 30, opacity: 0, duration: 0.7 }, '-=0.45')
    .from('.hero-btn', { y: 20, opacity: 0, duration: 0.6, stagger: 0.1 }, '-=0.4')
    .from('.hero-scroll', { y: 20, opacity: 0, duration: 0.5 }, '-=0.2');

  gsap.from('.hero-glow', {
    scale: 0.6,
    opacity: 0,
    duration: 1.5,
    stagger: 0.2,
    ease: 'power2.out',
    delay: 0.1
  });

  const heroLogo = document.querySelector('.hero-logo-mark');
  if (heroLogo) {
    gsap.from(heroLogo, {
      scale: 0.5,
      opacity: 0,
      rotation: -12,
      duration: 1.2,
      ease: 'back.out(1.8)',
      delay: 0.3
    });
  }
}

/* ── Parallax ── */
function initParallaxLayers() {
  if (typeof ScrollTrigger === 'undefined') return;

  const isMobile = window.matchMedia('(max-width: 768px)').matches;
  if (isMobile) return;

  document.querySelectorAll('[data-parallax]').forEach(el => {
    const speed = parseFloat(el.getAttribute('data-parallax')) || 0.3;
    gsap.to(el, {
      y: () => speed * 120,
      ease: 'none',
      scrollTrigger: {
        trigger: el.closest('section') || el,
        start: 'top bottom',
        end: 'bottom top',
        scrub: true
      }
    });
  });

  const pageHero = document.querySelector('.page-hero');
  if (pageHero) {
    gsap.to(pageHero, {
      y: 60,
      opacity: 0.65,
      ease: 'none',
      scrollTrigger: {
        trigger: pageHero,
        start: 'top top',
        end: 'bottom top',
        scrub: true
      }
    });
  }

  const contactCards = document.querySelector('.contact-channels-grid');
  if (contactCards) {
    gsap.to(contactCards, {
      y: -30,
      ease: 'none',
      scrollTrigger: {
        trigger: contactCards,
        start: 'top bottom',
        end: 'bottom top',
        scrub: true
      }
    });
  }
}

/* ── Batch card animations (performance) ── */
function initBatchCardAnimations() {
  const batchSelectors = [
    '.fade-in',
    '.benefit-card',
    '.job-card',
    '.contact-channel-card',
    '.contact-form-panel',
    '.contact-sidebar-card',
    '.office-card',
    '.team-card',
    '.value-card',
    '.industry-detail-card'
  ].join(', ');

  const elements = gsap.utils.toArray(batchSelectors);
  if (!elements.length) return;

  gsap.set(elements, { opacity: 0, y: 36 });
  elements.forEach(el => el.classList.add('motion-card'));

  ScrollTrigger.batch(elements, {
    start: 'top 92%',
    once: true,
    onEnter: batch => {
      gsap.to(batch, {
        opacity: 1,
        y: 0,
        duration: 0.65,
        stagger: 0.07,
        ease: 'power2.out',
        overwrite: true,
        onComplete: () => batch.forEach(el => el.classList.remove('motion-card'))
      });
    }
  });
}

/* ── Section-specific animations ── */
function initSectionSpecificAnimations() {
  batchReveal('.about-stat-card', { y: 40, stagger: 0.1 });
  batchReveal('.about-glass-card', { y: 50, stagger: 0.08 });
  batchReveal('.svc-card', { y: 60, rotateX: 8, stagger: 0.1, duration: 0.85 });
  batchReveal('.ind-card', { scale: 0.88, y: 40, ease: 'back.out(1.4)', stagger: 0.08 });
  batchReveal('.ind-stat-card', { y: 30, stagger: 0.1 });
  gsap.set('.portfolio-card', { opacity: 1, visibility: 'visible', y: 0 });
  batchReveal('.card, .service-card, .glass-card', { y: 50 });

  gsap.from('.about-astra-media', {
    scrollTrigger: { trigger: '.about-astra-grid', start: 'top 80%', toggleActions: 'play none none none' },
    x: -60,
    opacity: 0,
    duration: 1,
    ease: 'power3.out'
  });

  gsap.utils.toArray('.why-item').forEach((item, i) => {
    const isLeft = item.classList.contains('why-item--left');
    gsap.from(item, {
      scrollTrigger: { trigger: item, start: 'top 88%', toggleActions: 'play none none none' },
      x: isLeft ? -50 : 50,
      opacity: 0,
      duration: 0.8,
      delay: i * 0.05,
      ease: 'power3.out'
    });
  });

  const timelineLine = document.querySelector('.why-timeline-line');
  if (timelineLine) {
    gsap.from(timelineLine, {
      scrollTrigger: { trigger: '.why-timeline', start: 'top 75%', toggleActions: 'play none none none' },
      scaleY: 0,
      transformOrigin: 'top center',
      duration: 1.2,
      ease: 'power2.inOut'
    });
  }

  initProcessWorkflow();
  initServiceCard3D();
  initIndustryCardCounts();
}

function batchReveal(selector, opts = {}) {
  const items = gsap.utils.toArray(selector);
  if (!items.length) return;

  items.forEach((item, i) => {
    gsap.from(item, {
      scrollTrigger: { trigger: item, start: 'top 90%', toggleActions: 'play none none none' },
      opacity: 0,
      duration: opts.duration || 0.7,
      delay: opts.stagger ? i * opts.stagger : 0,
      ease: opts.ease || 'power2.out',
      y: opts.y ?? 40,
      scale: opts.scale,
      rotateX: opts.rotateX
    });
  });
}

/* ── Counter animations ── */
function initCounters() {
  const counters = document.querySelectorAll('.stat-number[data-target], .counter-animate[data-target]');
  if (!counters.length) return;

  counters.forEach(el => {
    const target = parseFloat(el.getAttribute('data-target'));
    const suffix = el.getAttribute('data-suffix') || '';
    const prefix = el.getAttribute('data-prefix') || '';
    const decimals = parseInt(el.getAttribute('data-decimals') || '0', 10);

    if (Number.isNaN(target)) return;

    const animate = () => {
      if (el.dataset.counted === 'true') return;
      el.dataset.counted = 'true';

      if (AstraMotion.gsapReady && !AstraMotion.reduced) {
        const obj = { val: 0 };
        gsap.to(obj, {
          val: target,
          duration: 2,
          ease: 'power2.out',
          onUpdate: () => {
            const n = decimals ? obj.val.toFixed(decimals) : Math.floor(obj.val);
            el.textContent = prefix + n + suffix;
          },
          onComplete: () => {
            el.textContent = prefix + (decimals ? target.toFixed(decimals) : target) + suffix;
          }
        });
      } else {
        el.textContent = prefix + target + suffix;
      }
    };

    if (typeof ScrollTrigger !== 'undefined') {
      ScrollTrigger.create({
        trigger: el,
        start: 'top 88%',
        once: true,
        onEnter: animate
      });
    } else {
      animate();
    }
  });
}

function initNavbarGlassScroll() {
  const navbarGlass = document.querySelector('.navbar-glass');
  if (!navbarGlass || typeof ScrollTrigger === 'undefined') return;

  trackTrigger({
    start: 'top -80',
    onUpdate: self => {
      const progress = Math.min(self.progress * 5, 1);
      navbarGlass.style.background = `rgba(5, 11, 24, ${0.35 + progress * 0.45})`;
    }
  });
}

/* ── Process workflow ── */
function initProcessWorkflow() {
  const timeline = document.querySelector('.process-timeline');
  const trackFill = document.querySelector('.process-track-fill');
  const steps = document.querySelectorAll('.process-step-item');
  if (!timeline || !steps.length) return;

  if (trackFill) {
    gsap.to(trackFill, {
      width: '100%',
      scrollTrigger: { trigger: timeline, start: 'top 75%', end: 'bottom 60%', scrub: 1 },
      ease: 'none'
    });
  }

  steps.forEach((step, i) => {
    gsap.from(step, {
      scrollTrigger: { trigger: step, start: 'top 90%', toggleActions: 'play none none none' },
      y: 50,
      opacity: 0,
      duration: 0.7,
      delay: i * 0.12,
      ease: 'back.out(1.4)'
    });

    const icon = step.querySelector('.process-node-icon');
    if (icon) {
      gsap.from(icon, {
        scrollTrigger: { trigger: step, start: 'top 85%', toggleActions: 'play none none none' },
        scale: 0,
        duration: 0.5,
        delay: i * 0.1,
        ease: 'back.out(2)'
      });
    }
  });
}

function initIndustryCardCounts() {
  document.querySelectorAll('.ind-card').forEach(card => {
    const countEl = card.querySelector('.ind-stat strong[data-count]');
    if (!countEl) return;
    const target = parseInt(countEl.getAttribute('data-count'), 10);

    const run = () => {
      if (countEl.dataset.animated === 'true') return;
      countEl.dataset.animated = 'true';
      if (AstraMotion.gsapReady) {
        const obj = { val: 0 };
        gsap.to(obj, {
          val: target,
          duration: 1.5,
          ease: 'power2.out',
          onUpdate: () => { countEl.textContent = Math.floor(obj.val); }
        });
      } else {
        countEl.textContent = target;
      }
    };

    ScrollTrigger?.create({ trigger: card, start: 'top 85%', once: true, onEnter: run });
    card.addEventListener('mouseenter', run);
  });
}

function initServiceCard3D() {
  if (window.matchMedia('(hover: none)').matches || window.matchMedia('(max-width: 768px)').matches) return;

  document.querySelectorAll('.svc-card').forEach(card => {
    const inner = card.querySelector('.svc-card-inner');
    if (!inner) return;

    card.addEventListener('mousemove', e => {
      const rect = card.getBoundingClientRect();
      const rotateX = ((e.clientY - rect.top - rect.height / 2) / (rect.height / 2)) * -8;
      const rotateY = ((e.clientX - rect.left - rect.width / 2) / (rect.width / 2)) * 8;
      inner.style.transform = `perspective(800px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateZ(20px)`;
    });

    card.addEventListener('mouseleave', () => {
      inner.style.transform = 'perspective(800px) rotateX(0) rotateY(0) translateZ(0)';
    });
  });
}

/* ── AOS (fallback / light enhancement) ── */
function initAOS(force) {
  if (typeof AOS === 'undefined') return;
  if (!force && AstraMotion.gsapReady) return;

  AOS.init({
    duration: 700,
    easing: 'ease-out-cubic',
    once: true,
    offset: 50,
    disable: AstraMotion.reduced
  });
}

function initScrollFallback() {
  const observer = new IntersectionObserver(entries => {
    entries.forEach((entry, i) => {
      if (entry.isIntersecting) {
        setTimeout(() => entry.target.classList.add('visible'), i * 60);
        observer.unobserve(entry.target);
      }
    });
  }, { rootMargin: '0px 0px -50px 0px', threshold: 0.1 });

  document.querySelectorAll('.fade-in, .section-header').forEach(el => {
    if (!el.classList.contains('fade-in')) el.classList.add('fade-in');
    observer.observe(el);
  });
}

function enableStaticFallback() {
  document.querySelectorAll('.fade-in, .motion-card').forEach(el => el.classList.add('visible'));
  document.querySelectorAll('[data-aos]').forEach(el => {
    el.style.opacity = '1';
    el.style.transform = 'none';
  });
}
