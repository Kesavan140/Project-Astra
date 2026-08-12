/**
 * Astra Global Solution — Portfolio Showcase
 * Filter tabs, project cards, lightbox gallery
 */

const PORTFOLIO_CATEGORIES = [
  { id: 'all',        label: 'All Projects' },
  { id: 'web',        label: 'Web Projects' },
  { id: 'mobile',     label: 'Mobile Apps' },
  { id: 'engineering', label: 'Engineering Designs' },
  { id: 'marketing',  label: 'Marketing Campaigns' }
];

const PORTFOLIO_PROJECTS = [
  {
    id: 'web-1',
    category: 'web',
    tag: 'Web Projects',
    title: 'NexGen Corporate Portal',
    description: 'A fully responsive corporate website with CMS integration, delivering a 60% increase in lead generation.',
    image: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=900&h=600&fit=crop&auto=format&q=80'
  },
  {
    id: 'web-2',
    category: 'web',
    tag: 'Web Projects',
    title: 'Luxe E-Commerce Store',
    description: 'Premium online retail platform with advanced filtering, payment gateway, and real-time inventory sync.',
    image: 'https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=900&h=600&fit=crop&auto=format&q=80'
  },
  {
    id: 'web-3',
    category: 'web',
    tag: 'Web Projects',
    title: 'Analytics SaaS Dashboard',
    description: 'Real-time data visualization dashboard with role-based access and automated reporting for enterprise clients.',
    image: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=900&h=600&fit=crop&auto=format&q=80'
  },
  {
    id: 'mobile-1',
    category: 'mobile',
    tag: 'Mobile Apps',
    title: 'FitPulse Health App',
    description: 'Cross-platform fitness tracking app with wearable integration, used by 100K+ active users worldwide.',
    image: 'https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?w=900&h=600&fit=crop&auto=format&q=80'
  },
  {
    id: 'mobile-2',
    category: 'mobile',
    tag: 'Mobile Apps',
    title: 'NovaBank Mobile',
    description: 'Secure mobile banking application with biometric auth, instant transfers, and AI-powered financial insights.',
    image: 'https://images.unsplash.com/photo-1563013544-824ae1b704d3?w=900&h=600&fit=crop&auto=format&q=80'
  },
  {
    id: 'eng-1',
    category: 'engineering',
    tag: 'Engineering Designs',
    title: 'Industrial Plant CAD System',
    description: 'Precision 3D CAD modeling and simulation for a large-scale manufacturing facility redesign project.',
    image: 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=900&h=600&fit=crop&auto=format&q=80'
  },
  {
    id: 'eng-2',
    category: 'engineering',
    tag: 'Engineering Designs',
    title: 'Smart Factory IoT Platform',
    description: 'IoT sensor network and control dashboard enabling predictive maintenance across 12 production lines.',
    image: 'https://images.unsplash.com/photo-1504917595217-d4dc5ebe6122?w=900&h=600&fit=crop&auto=format&q=80'
  },
  {
    id: 'mkt-1',
    category: 'marketing',
    tag: 'Marketing Campaigns',
    title: 'Global Brand Launch',
    description: 'Multi-channel brand awareness campaign reaching 2M+ impressions across digital and social platforms.',
    image: 'https://images.unsplash.com/photo-1533750349088-cd871a165123?w=900&h=600&fit=crop&auto=format&q=80'
  },
  {
    id: 'mkt-2',
    category: 'marketing',
    tag: 'Marketing Campaigns',
    title: 'Digital Growth Campaign',
    description: 'Performance marketing strategy that achieved 3x ROI through SEO, PPC, and conversion rate optimization.',
    image: 'https://images.unsplash.com/photo-1432888622747-4cef9d4b3b0e?w=900&h=600&fit=crop&auto=format&q=80'
  }
];

document.addEventListener('DOMContentLoaded', () => {
  initPortfolioShowcase();
});

function initPortfolioShowcase() {
  const tabsEl = document.getElementById('portfolioTabs');
  const gridEl = document.getElementById('portfolioGrid');
  if (!tabsEl || !gridEl) return;

  renderPortfolioTabs(tabsEl);
  renderPortfolioGrid(gridEl, PORTFOLIO_PROJECTS);
  createLightbox();
  bindPortfolioFilters(tabsEl, gridEl);
  bindLightboxTriggers(gridEl);
}

function renderPortfolioTabs(container) {
  container.innerHTML = PORTFOLIO_CATEGORIES.map((cat, i) =>
    `<button class="portfolio-tab${i === 0 ? ' active' : ''}" data-filter="${cat.id}" type="button">${cat.label}</button>`
  ).join('');
}

function renderPortfolioGrid(container, projects) {
  container.innerHTML = projects.map((project, index) => `
    <article class="portfolio-card" data-category="${project.category}" data-index="${index}" data-aos="fade-up" data-aos-delay="${(index % 3) * 100}">
      <div class="portfolio-card-media" data-lightbox="${index}" role="button" tabindex="0" aria-label="View ${project.title}">
        <img src="${project.image}" alt="${project.title} — Astra Global Solution portfolio project" width="900" height="600" loading="lazy" decoding="async">
        <div class="portfolio-card-hover">
          <span class="portfolio-view-btn">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
            View Project
          </span>
        </div>
      </div>
      <div class="portfolio-card-body">
        <span class="portfolio-card-tag">${project.tag}</span>
        <h3>${project.title}</h3>
        <p>${project.description}</p>
      </div>
    </article>
  `).join('');

  if (typeof AOS !== 'undefined') AOS.refresh();
}

function bindPortfolioFilters(tabsEl, gridEl) {
  const tabs = tabsEl.querySelectorAll('.portfolio-tab');
  const cards = gridEl.querySelectorAll('.portfolio-card');

  tabs.forEach(tab => {
    tab.addEventListener('click', () => {
      tabs.forEach(t => t.classList.remove('active'));
      tab.classList.add('active');

      const filter = tab.getAttribute('data-filter');
      gridEl.classList.add('is-filtering');

      cards.forEach(card => {
        const match = filter === 'all' || card.getAttribute('data-category') === filter;
        card.classList.toggle('is-muted', !match);
        card.style.opacity = match ? '1' : '0.38';
        card.style.transform = match ? '' : 'scale(0.986)';
        card.style.filter = match ? 'none' : 'grayscale(0.15) saturate(0.7)';
        card.style.visibility = 'visible';
        card.style.display = 'block';
      });
    });
  });
}

/* ── Lightbox ── */
let lightboxEl = null;
let currentIndex = 0;
let visibleProjects = [];

function createLightbox() {
  if (document.getElementById('portfolioLightbox')) return;

  lightboxEl = document.createElement('div');
  lightboxEl.className = 'lightbox';
  lightboxEl.id = 'portfolioLightbox';
  lightboxEl.setAttribute('role', 'dialog');
  lightboxEl.setAttribute('aria-modal', 'true');
  lightboxEl.innerHTML = `
    <div class="lightbox-backdrop"></div>
    <div class="lightbox-panel">
      <button class="lightbox-close" aria-label="Close">&times;</button>
      <button class="lightbox-nav lightbox-prev" aria-label="Previous">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M15 18l-6-6 6-6"/></svg>
      </button>
      <button class="lightbox-nav lightbox-next" aria-label="Next">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M9 18l6-6-6-6"/></svg>
      </button>
      <div class="lightbox-image-wrap">
        <img class="lightbox-img" src="" alt="">
      </div>
      <div class="lightbox-info">
        <span class="lightbox-tag"></span>
        <h3 class="lightbox-title"></h3>
        <p class="lightbox-desc"></p>
      </div>
    </div>
  `;
  document.body.appendChild(lightboxEl);

  lightboxEl.querySelector('.lightbox-close').addEventListener('click', closeLightbox);
  lightboxEl.querySelector('.lightbox-backdrop').addEventListener('click', closeLightbox);
  lightboxEl.querySelector('.lightbox-prev').addEventListener('click', () => navigateLightbox(-1));
  lightboxEl.querySelector('.lightbox-next').addEventListener('click', () => navigateLightbox(1));

  document.addEventListener('keydown', (e) => {
    if (!lightboxEl.classList.contains('open')) return;
    if (e.key === 'Escape') closeLightbox();
    if (e.key === 'ArrowLeft') navigateLightbox(-1);
    if (e.key === 'ArrowRight') navigateLightbox(1);
  });
}

function bindLightboxTriggers(gridEl) {
  gridEl.addEventListener('click', (e) => {
    const media = e.target.closest('[data-lightbox]');
    if (!media) return;
    openLightbox(parseInt(media.getAttribute('data-lightbox'), 10));
  });

  gridEl.addEventListener('keydown', (e) => {
    if (e.key !== 'Enter' && e.key !== ' ') return;
    const media = e.target.closest('[data-lightbox]');
    if (!media) return;
    e.preventDefault();
    openLightbox(parseInt(media.getAttribute('data-lightbox'), 10));
  });
}

function getVisibleProjects() {
  return PORTFOLIO_PROJECTS.filter((_, i) => {
    const card = document.querySelector(`.portfolio-card[data-index="${i}"]`);
    return card && !card.classList.contains('hidden');
  });
}

function openLightbox(index) {
  visibleProjects = PORTFOLIO_PROJECTS;
  currentIndex = index;
  updateLightboxContent();
  lightboxEl.classList.add('open');
  document.body.classList.add('lightbox-open');
}

function closeLightbox() {
  lightboxEl.classList.remove('open');
  document.body.classList.remove('lightbox-open');
}

function navigateLightbox(dir) {
  const visible = getVisibleProjects();
  const currentProject = PORTFOLIO_PROJECTS[currentIndex];
  let visIdx = visible.findIndex(p => p.id === currentProject.id);
  visIdx = (visIdx + dir + visible.length) % visible.length;
  currentIndex = PORTFOLIO_PROJECTS.findIndex(p => p.id === visible[visIdx].id);
  updateLightboxContent();
}

function updateLightboxContent() {
  const project = PORTFOLIO_PROJECTS[currentIndex];
  if (!project) return;

  lightboxEl.querySelector('.lightbox-img').src = project.image;
  lightboxEl.querySelector('.lightbox-img').alt = project.title;
  lightboxEl.querySelector('.lightbox-tag').textContent = project.tag;
  lightboxEl.querySelector('.lightbox-title').textContent = project.title;
  lightboxEl.querySelector('.lightbox-desc').textContent = project.description;
}

window.initPortfolioShowcase = initPortfolioShowcase;
