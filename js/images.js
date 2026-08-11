/**
 * Image performance — lazy loading, decoding, dimensions
 */
document.addEventListener('DOMContentLoaded', () => {
  initImageOptimization();
});

function initImageOptimization() {
  const images = document.querySelectorAll('img:not([data-no-optimize])');

  images.forEach((img, index) => {
    if (!img.hasAttribute('decoding')) {
      img.setAttribute('decoding', 'async');
    }

    const isPriority = img.hasAttribute('fetchpriority') ||
      img.dataset.priority === 'high' ||
      img.closest('#hero, .page-hero');

    if (!img.hasAttribute('loading') && !isPriority) {
      img.setAttribute('loading', 'lazy');
    }

    if (isPriority && !img.hasAttribute('fetchpriority')) {
      img.setAttribute('fetchpriority', 'high');
    }

    if (img.src && img.src.includes('unsplash.com') && !img.dataset.optimized) {
      img.src = typeof optimizeImageUrl === 'function'
        ? optimizeImageUrl(img.src, {
            width: img.getAttribute('width') || undefined,
            height: img.getAttribute('height') || undefined
          })
        : img.src;
      img.dataset.optimized = 'true';
    }
  });
}
