/**
 * Astra Global Solution — Futuristic Hero
 * Particle network + glow orb parallax
 */

document.addEventListener('DOMContentLoaded', () => {
  initHeroParticles();
  initHeroParallax();
});

/**
 * Canvas particle network background
 */
function initHeroParticles() {
  const canvas = document.getElementById('heroParticles');
  const hero = document.getElementById('hero');
  if (!canvas || !hero) return;

  const ctx = canvas.getContext('2d');
  let particles = [];
  let animationId;
  let width, height;

  const config = {
    count: 80,
    maxDistance: 140,
    speed: 0.35,
    dotSize: 1.5,
    lineOpacity: 0.12,
    dotColor: '44, 213, 255',
    lineColor: '0, 91, 255'
  };

  function resize() {
    width = hero.offsetWidth;
    height = hero.offsetHeight;
    canvas.width = width;
    canvas.height = height;
    config.count = width < 768 ? 45 : width < 1024 ? 60 : 80;
    createParticles();
  }

  function createParticles() {
    particles = [];
    for (let i = 0; i < config.count; i++) {
      particles.push({
        x: Math.random() * width,
        y: Math.random() * height,
        vx: (Math.random() - 0.5) * config.speed,
        vy: (Math.random() - 0.5) * config.speed,
        size: Math.random() * config.dotSize + 0.5,
        opacity: 0.3 + Math.random() * 0.4
      });
    }
  }

  function draw() {
    ctx.clearRect(0, 0, width, height);

    particles.forEach((p, i) => {
      p.x += p.vx;
      p.y += p.vy;

      if (p.x < 0 || p.x > width) p.vx *= -1;
      if (p.y < 0 || p.y > height) p.vy *= -1;

      ctx.beginPath();
      ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(${config.dotColor}, ${p.opacity})`;
      ctx.fill();

      for (let j = i + 1; j < particles.length; j++) {
        const p2 = particles[j];
        const dx = p.x - p2.x;
        const dy = p.y - p2.y;
        const dist = Math.sqrt(dx * dx + dy * dy);

        if (dist < config.maxDistance) {
          const alpha = (1 - dist / config.maxDistance) * config.lineOpacity;
          ctx.beginPath();
          ctx.moveTo(p.x, p.y);
          ctx.lineTo(p2.x, p2.y);
          ctx.strokeStyle = `rgba(${config.lineColor}, ${alpha})`;
          ctx.lineWidth = 0.6;
          ctx.stroke();
        }
      }
    });

    animationId = requestAnimationFrame(draw);
  }

  resize();
  draw();

  window.addEventListener('resize', () => {
    cancelAnimationFrame(animationId);
    resize();
    draw();
  });

  document.addEventListener('visibilitychange', () => {
    if (document.hidden) {
      cancelAnimationFrame(animationId);
    } else {
      draw();
    }
  });
}

/**
 * Parallax on glow orbs while scrolling
 */
function initHeroParallax() {
  const hero = document.getElementById('hero');
  const glows = document.querySelectorAll('.hero-glow');
  const content = document.querySelector('.hero-content');
  if (!hero || glows.length === 0) return;

  if (typeof gsap !== 'undefined' && typeof ScrollTrigger !== 'undefined') {
    gsap.registerPlugin(ScrollTrigger);

    glows.forEach((glow, i) => {
      gsap.to(glow, {
        y: (i + 1) * 80,
        opacity: 0,
        scrollTrigger: {
          trigger: hero,
          start: 'top top',
          end: 'bottom top',
          scrub: true
        }
      });
    });

    if (content) {
      gsap.to(content, {
        y: 120,
        opacity: 0,
        scrollTrigger: {
          trigger: hero,
          start: 'top top',
          end: 'bottom top',
          scrub: true
        }
      });
    }

    gsap.to('.hero-scroll', {
      opacity: 0,
      y: 20,
      scrollTrigger: {
        trigger: hero,
        start: 'top top',
        end: '30% top',
        scrub: true
      }
    });
  } else {
    window.addEventListener('scroll', () => {
      const scrolled = window.scrollY;
      const heroHeight = hero.offsetHeight;
      if (scrolled > heroHeight) return;

      const progress = scrolled / heroHeight;
      glows.forEach((glow, i) => {
        glow.style.transform = `translateY(${scrolled * (0.15 + i * 0.05)}px)`;
        glow.style.opacity = 0.5 - progress * 0.5;
      });
    }, { passive: true });
  }
}
