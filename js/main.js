/**
 * Astra Global Solution — Main JavaScript
 * Handles component loading, navigation, and global interactions
 */

document.addEventListener('DOMContentLoaded', () => {
  loadComponents();
});

/**
 * Load reusable HTML components (navbar & footer)
 */
async function loadComponents() {
  const navbarPlaceholder = document.getElementById('navbar-placeholder');
  const footerPlaceholder = document.getElementById('footer-placeholder');

  try {
    const [navbarHTML, footerHTML] = await Promise.all([
      fetch('components/navbar.html').then(res => {
        if (!res.ok) throw new Error('Failed to load navbar');
        return res.text();
      }),
      fetch('components/footer.html').then(res => {
        if (!res.ok) throw new Error('Failed to load footer');
        return res.text();
      })
    ]);

    if (navbarPlaceholder) {
      navbarPlaceholder.innerHTML = navbarHTML;
      initNavbar();
    }

    if (footerPlaceholder) {
      footerPlaceholder.innerHTML = footerHTML;
      initFooter();
    }

    window.dispatchEvent(new CustomEvent('astra:components-loaded'));
  } catch (error) {
    console.error('Error loading components:', error);
  }
}

/**
 * Initialize navbar functionality
 */
function initNavbar() {
  const navbar = document.getElementById('navbar');
  const navToggle = document.getElementById('navToggle');
  const navbarNav = document.getElementById('navbarNav');
  const navOverlay = document.getElementById('navOverlay');
  const navLinks = document.querySelectorAll('.nav-link');

  setActiveNavLink();
  handleNavbarScroll(navbar);

  if (navToggle && navbarNav) {
    navToggle.addEventListener('click', () => toggleMobileNav(navToggle, navbarNav, navOverlay));

    if (navOverlay) {
      navOverlay.addEventListener('click', () => closeMobileNav(navToggle, navbarNav, navOverlay));
    }

    navLinks.forEach(link => {
      link.addEventListener('click', () => closeMobileNav(navToggle, navbarNav, navOverlay));
    });

    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') closeMobileNav(navToggle, navbarNav, navOverlay);
    });

    window.addEventListener('resize', () => {
      if (window.innerWidth > 768) {
        closeMobileNav(navToggle, navbarNav, navOverlay);
      }
    });
  }
}

function toggleMobileNav(toggle, nav, overlay) {
  const isOpen = nav.classList.toggle('open');
  toggle.classList.toggle('active', isOpen);
  toggle.setAttribute('aria-expanded', isOpen);
  document.body.classList.toggle('nav-open', isOpen);
  if (overlay) {
    overlay.classList.toggle('active', isOpen);
    overlay.setAttribute('aria-hidden', !isOpen);
  }
}

function closeMobileNav(toggle, nav, overlay) {
  nav.classList.remove('open');
  toggle.classList.remove('active');
  toggle.setAttribute('aria-expanded', 'false');
  document.body.classList.remove('nav-open');
  if (overlay) {
    overlay.classList.remove('active');
    overlay.setAttribute('aria-hidden', 'true');
  }
}

function handleNavbarScroll(navbar) {
  if (!navbar) return;

  const onScroll = () => {
    navbar.classList.toggle('scrolled', window.scrollY > 40);
  };

  onScroll();
  window.addEventListener('scroll', onScroll, { passive: true });
}

/**
 * Highlight the active navigation link based on current page
 */
function setActiveNavLink() {
  const currentPage = getCurrentPage();
  const navLinks = document.querySelectorAll('.nav-link');

  navLinks.forEach(link => {
    const page = link.getAttribute('data-page');
    if (page === currentPage) {
      link.classList.add('active');
    }
  });
}

/**
 * Get current page name from URL
 */
function getCurrentPage() {
  const path = window.location.pathname;
  const filename = path.substring(path.lastIndexOf('/') + 1);
  const page = filename.replace('.html', '') || 'index';
  return page;
}

/**
 * Initialize footer functionality
 */
function initFooter() {
  const yearEl = document.getElementById('currentYear');
  if (yearEl) {
    yearEl.textContent = new Date().getFullYear();
  }

  initNewsletterForm();
  initBackToTop();
}

function initNewsletterForm() {
  const form = document.getElementById('newsletterForm');
  if (!form) return;

  form.addEventListener('submit', e => {
    e.preventDefault();
    form.classList.remove('is-success', 'has-error');

    const input = form.querySelector('#newsletterEmail');
    const email = input?.value.trim() || '';
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailRegex.test(email)) {
      form.classList.add('has-error');
      return;
    }

    form.classList.add('is-success');
    form.reset();
    setTimeout(() => form.classList.remove('is-success'), 5000);
  });

  form.querySelector('#newsletterEmail')?.addEventListener('input', () => {
    form.classList.remove('has-error');
  });
}

function initBackToTop() {
  const btn = document.getElementById('footerBackTop');
  if (!btn) return;

  btn.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
}

/**
 * Initialize FAQ accordion (used on services page)
 */
function initFAQ() {
  const faqItems = document.querySelectorAll('.faq-item');

  faqItems.forEach(item => {
    const question = item.querySelector('.faq-question');
    if (question) {
      question.addEventListener('click', () => {
        const isActive = item.classList.contains('active');
        faqItems.forEach(i => i.classList.remove('active'));
        if (!isActive) {
          item.classList.add('active');
        }
      });
    }
  });
}

/**
 * Initialize portfolio filter (used on portfolio page)
 */
function initPortfolioFilter() {
  const filterBtns = document.querySelectorAll('.filter-btn');
  const portfolioItems = document.querySelectorAll('.portfolio-item');

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const filter = btn.getAttribute('data-filter');

      portfolioItems.forEach(item => {
        if (filter === 'all' || item.getAttribute('data-category') === filter) {
          item.style.display = 'block';
        } else {
          item.style.display = 'none';
        }
      });
    });
  });
}

/**
 * Initialize contact form validation
 */
function initContactForm() {
  const form = document.getElementById('contactForm');
  if (!form) return;

  form.addEventListener('submit', (e) => {
    e.preventDefault();

    let isValid = true;
    const requiredFields = form.querySelectorAll('[required]');

    requiredFields.forEach(field => {
      const group = field.closest('.form-group');
      if (!field.value.trim()) {
        group.classList.add('has-error');
        field.classList.add('error');
        isValid = false;
      } else {
        group.classList.remove('has-error');
        field.classList.remove('error');
      }
    });

    const emailField = form.querySelector('[type="email"]');
    if (emailField && emailField.value) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(emailField.value)) {
        emailField.closest('.form-group').classList.add('has-error');
        emailField.classList.add('error');
        isValid = false;
      }
    }

    if (isValid) {
      const successMsg = document.querySelector('.form-success');
      if (successMsg) {
        successMsg.classList.add('show');
        form.reset();
        setTimeout(() => successMsg.classList.remove('show'), 5000);
      }
    }
  });

  form.querySelectorAll('input, textarea').forEach(field => {
    field.addEventListener('input', () => {
      const group = field.closest('.form-group');
      if (field.value.trim()) {
        group.classList.remove('has-error');
        field.classList.remove('error');
      }
    });
  });
}

/**
 * Animate stat counters on scroll
 */
function initStatCounters() {
  const statNumbers = document.querySelectorAll('.stat-number');

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        animateCounter(entry.target);
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.5 });

  statNumbers.forEach(stat => observer.observe(stat));
}

function animateCounter(element) {
  const target = parseInt(element.getAttribute('data-target'), 10);
  const suffix = element.getAttribute('data-suffix') || '';

  if (typeof gsap !== 'undefined') {
    const obj = { val: 0 };
    gsap.to(obj, {
      val: target,
      duration: 2,
      ease: 'power2.out',
      onUpdate: () => {
        element.textContent = Math.floor(obj.val) + suffix;
      },
      onComplete: () => {
        element.textContent = target + suffix;
      }
    });
    return;
  }

  const duration = 2000;
  const step = target / (duration / 16);
  let current = 0;

  const timer = setInterval(() => {
    current += step;
    if (current >= target) {
      element.textContent = target + suffix;
      clearInterval(timer);
    } else {
      element.textContent = Math.floor(current) + suffix;
    }
  }, 16);
}

// Export init functions for page-specific use
window.AstraApp = {
  initFAQ,
  initPortfolioFilter,
  initContactForm,
  initStatCounters
};
