/**
 * Astra Global Solution — Logo page loader
 */
(function initLogoLoader() {
  const loader = document.getElementById('pageLoader');
  if (!loader) return;

  const hide = () => {
    loader.classList.add('is-hidden');
    document.body.classList.remove('is-loading');
    setTimeout(() => loader.remove(), 550);
  };

  if (document.readyState === 'complete') {
    setTimeout(hide, 400);
  } else {
    window.addEventListener('load', () => setTimeout(hide, 400));
  }

  window.addEventListener('astra:components-loaded', () => {
    setTimeout(hide, 300);
  });

  setTimeout(hide, 3500);
})();
