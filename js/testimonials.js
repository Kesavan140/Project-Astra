/**
 * Astra Global Solution — Premium Testimonial Slider (Swiper.js)
 */

document.addEventListener('DOMContentLoaded', () => {
  initTestimonialSlider();
});

function initTestimonialSlider() {
  const swiperEl = document.querySelector('.testimonial-swiper');
  if (!swiperEl || typeof Swiper === 'undefined') return;

  new Swiper('.testimonial-swiper', {
    slidesPerView: 1,
    spaceBetween: 24,
    loop: true,
    grabCursor: true,
    speed: 700,
    autoplay: {
      delay: 5000,
      disableOnInteraction: false,
      pauseOnMouseEnter: true
    },
    pagination: {
      el: '.testimonial-pagination',
      clickable: true,
      dynamicBullets: true
    },
    navigation: {
      nextEl: '.testimonial-next',
      prevEl: '.testimonial-prev'
    },
    breakpoints: {
      640: {
        slidesPerView: 1,
        spaceBetween: 20
      },
      768: {
        slidesPerView: 2,
        spaceBetween: 24
      },
      1100: {
        slidesPerView: 3,
        spaceBetween: 28
      }
    }
  });
}
