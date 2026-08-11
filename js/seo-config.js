/**
 * Astra Global Solution — SEO Configuration
 * Update SITE_URL when deploying to production.
 */
const SEO_CONFIG = {
  siteName: 'Astra Global Solution',
  siteUrl: 'https://www.astraglobalsolution.com',
  twitterHandle: '@AstraGlobal',
  defaultOgImage: 'https://www.astraglobalsolution.com/assets/logo/astra-logo.png',
  locale: 'en_US',
  email: 'info@astraglobalsolution.com',
  phone: '+1-555-123-4567',
  address: {
    street: '123 Business Avenue, Suite 500',
    city: 'New York',
    region: 'NY',
    postal: '10001',
    country: 'US'
  }
};

/**
 * Optimize Unsplash / remote image URLs for performance.
 */
function optimizeImageUrl(url, options = {}) {
  if (!url || typeof url !== 'string') return url;

  const { width, height, quality = 80, fit = 'crop' } = options;

  try {
    const parsed = new URL(url);
    if (width) parsed.searchParams.set('w', String(width));
    if (height) parsed.searchParams.set('h', String(height));
    parsed.searchParams.set('q', String(quality));
    parsed.searchParams.set('auto', 'format');
    if (fit) parsed.searchParams.set('fit', fit);
    return parsed.toString();
  } catch {
    return url;
  }
}

/**
 * Build canonical URL — prefers clean paths when using URL rewrites.
 */
function seoUrl(path) {
  const base = SEO_CONFIG.siteUrl.replace(/\/$/, '');
  const clean = path.replace(/^\//, '').replace(/\.html$/, '');
  if (!clean || clean === 'index') return `${base}/`;
  return `${base}/${clean}`;
}

window.SEO_CONFIG = SEO_CONFIG;
window.optimizeImageUrl = optimizeImageUrl;
window.seoUrl = seoUrl;
