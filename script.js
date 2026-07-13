document.addEventListener('DOMContentLoaded', () => {

  /* ---------- Footer year ---------- */
  const yearEl = document.getElementById('year');
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  /* ---------- Sticky header on scroll ---------- */
  const header = document.getElementById('siteHeader');
  const onScrollHeader = () => {
    if (window.scrollY > 60) header.classList.add('scrolled');
    else header.classList.remove('scrolled');
  };
  window.addEventListener('scroll', onScrollHeader, { passive: true });
  onScrollHeader();

  /* ---------- Mobile nav drawer ---------- */
  const hamburger = document.getElementById('hamburger');
  const mobileNav = document.getElementById('mobileNav');
  const mobileOverlay = document.getElementById('mobileOverlay');
  const mobileClose = document.getElementById('mobileClose');

  const openMobileNav = () => {
    mobileNav.classList.add('is-open');
    mobileOverlay.classList.add('is-open');
    hamburger.classList.add('is-open');
    hamburger.setAttribute('aria-expanded', 'true');
    document.body.style.overflow = 'hidden';
  };
  const closeMobileNav = () => {
    mobileNav.classList.remove('is-open');
    mobileOverlay.classList.remove('is-open');
    hamburger.classList.remove('is-open');
    hamburger.setAttribute('aria-expanded', 'false');
    document.body.style.overflow = '';
  };
  hamburger.addEventListener('click', openMobileNav);
  mobileClose.addEventListener('click', closeMobileNav);
  mobileOverlay.addEventListener('click', closeMobileNav);
  mobileNav.querySelectorAll('a').forEach(a => a.addEventListener('click', closeMobileNav));
  document.addEventListener('keydown', (e) => { if (e.key === 'Escape') closeMobileNav(); });

  /* ---------- Hero slider ---------- */
  const slides = Array.from(document.querySelectorAll('.hero-slide'));
  const dotsWrap = document.getElementById('heroDots');
  const prevBtn = document.getElementById('heroPrev');
  const nextBtn = document.getElementById('heroNext');
  let current = 0;
  let sliderTimer;
  let isAnimating = false;

  if (slides.length && dotsWrap) {
    slides.forEach((_, i) => {
      const dot = document.createElement('button');
      dot.setAttribute('aria-label', 'Go to slide ' + (i + 1));
      if (i === 0) dot.classList.add('is-active');
      dot.addEventListener('click', () => goToSlide(i));
      dotsWrap.appendChild(dot);
    });
  }
  const dots = dotsWrap ? Array.from(dotsWrap.children) : [];

  function goToSlide(index) {
    if (isAnimating || index === current) return;
    isAnimating = true;
    slides[current].classList.remove('is-active');
    if (dots[current]) dots[current].classList.remove('is-active');
    current = (index + slides.length) % slides.length;
    slides[current].classList.add('is-active');
    if (dots[current]) dots[current].classList.add('is-active');
    resetTimer();
    setTimeout(() => { isAnimating = false; }, 1600);
  }
  function nextSlide() { goToSlide(current + 1); }
  function prevSlide() { goToSlide(current - 1); }
  function resetTimer() {
    clearInterval(sliderTimer);
    sliderTimer = setInterval(nextSlide, 6000);
  }
  if (slides.length) {
    nextBtn.addEventListener('click', nextSlide);
    prevBtn.addEventListener('click', prevSlide);
    resetTimer();

    let touchStartX = 0;
    let touchStartY = 0;
    const heroEl = document.querySelector('.hero-slider');
    if (heroEl) {
      heroEl.addEventListener('touchstart', (e) => {
        touchStartX = e.touches[0].clientX;
        touchStartY = e.touches[0].clientY;
      }, { passive: true });
      heroEl.addEventListener('touchend', (e) => {
        const dx = e.changedTouches[0].clientX - touchStartX;
        const dy = e.changedTouches[0].clientY - touchStartY;
        if (Math.abs(dx) > Math.abs(dy) && Math.abs(dx) > 50) {
          if (dx > 50) prevSlide();
          else if (dx < -50) nextSlide();
        }
      }, { passive: true });
    }

    const heroSection = document.querySelector('.hero');
    if (heroSection) {
      heroSection.addEventListener('mouseenter', () => clearInterval(sliderTimer));
      heroSection.addEventListener('mouseleave', resetTimer);
    }
  }

  /* ---------- Scroll reveal (IntersectionObserver) ---------- */
  const revealEls = document.querySelectorAll('.reveal');
  if ('IntersectionObserver' in window) {
    const io = new IntersectionObserver((entries) => {
      entries.forEach((entry, index) => {
        if (entry.isIntersecting) {
          setTimeout(() => {
            entry.target.classList.add('in-view');
          }, index * 80);
          io.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -50px 0px' });
    revealEls.forEach(el => io.observe(el));
  } else {
    revealEls.forEach(el => el.classList.add('in-view'));
  }

  /* ---------- Gallery lightbox ---------- */
  const lightbox = document.getElementById('lightbox');
  const lightboxImg = document.getElementById('lightboxImg');
  const lightboxClose = document.getElementById('lightboxClose');

  if (lightbox && lightboxImg) {
    document.querySelectorAll('.gallery-item').forEach(item => {
      item.addEventListener('click', () => {
        const full = item.getAttribute('data-full');
        if (!full) return;
        lightboxImg.src = full;
        const caption = item.querySelector('span');
        lightboxImg.alt = caption ? caption.textContent : 'Palace Afrika Guest Lodge';
        lightbox.classList.add('is-open');
        document.body.style.overflow = 'hidden';
        lightboxClose.focus();
      });
    });

    function closeLightbox() {
      lightbox.classList.remove('is-open');
      lightboxImg.src = '';
      document.body.style.overflow = '';
    }
    lightboxClose.addEventListener('click', closeLightbox);
    lightbox.addEventListener('click', (e) => { if (e.target === lightbox) closeLightbox(); });
    document.addEventListener('keydown', (e) => { if (e.key === 'Escape') closeLightbox(); });

    document.addEventListener('keydown', (e) => {
      if (!lightbox.classList.contains('is-open')) return;
      const items = Array.from(document.querySelectorAll('.gallery-item'));
      const currentItem = items.find(item => item.getAttribute('data-full') === lightboxImg.src);
      const currentIndex = items.indexOf(currentItem);
      if (e.key === 'ArrowRight' && currentIndex < items.length - 1) {
        const nextItem = items[currentIndex + 1];
        lightboxImg.src = nextItem.getAttribute('data-full');
        const caption = nextItem.querySelector('span');
        lightboxImg.alt = caption ? caption.textContent : 'Palace Afrika Guest Lodge';
      } else if (e.key === 'ArrowLeft' && currentIndex > 0) {
        const prevItem = items[currentIndex - 1];
        lightboxImg.src = prevItem.getAttribute('data-full');
        const caption = prevItem.querySelector('span');
        lightboxImg.alt = caption ? caption.textContent : 'Palace Afrika Guest Lodge';
      }
    });
  }

  /* ---------- FAQ accordion ---------- */
  document.querySelectorAll('.faq-item').forEach(item => {
    const btn = item.querySelector('.faq-q');
    const answer = item.querySelector('.faq-a');
    if (!btn || !answer) return;

    btn.addEventListener('click', () => {
      const isOpen = item.classList.contains('is-open');
      document.querySelectorAll('.faq-item.is-open').forEach(openItem => {
        if (openItem !== item) {
          openItem.classList.remove('is-open');
          const openBtn = openItem.querySelector('.faq-q');
          const openAnswer = openItem.querySelector('.faq-a');
          if (openBtn) openBtn.setAttribute('aria-expanded', 'false');
          if (openAnswer) openAnswer.style.maxHeight = null;
        }
      });
      if (isOpen) {
        item.classList.remove('is-open');
        btn.setAttribute('aria-expanded', 'false');
        answer.style.maxHeight = null;
      } else {
        item.classList.add('is-open');
        btn.setAttribute('aria-expanded', 'true');
        answer.style.maxHeight = answer.scrollHeight + 'px';
      }
    });
  });

  /* ---------- About image 3D tilt on hover ---------- */
  const aboutTilt = document.getElementById('aboutTilt');
  if (aboutTilt) {
    const aboutImg = aboutTilt.querySelector('.about-img');
    const maxTilt = 8;
    let rafId = null;

    aboutTilt.addEventListener('mousemove', (e) => {
      if (rafId) cancelAnimationFrame(rafId);
      rafId = requestAnimationFrame(() => {
        const rect = aboutTilt.getBoundingClientRect();
        const x = (e.clientX - rect.left) / rect.width;
        const y = (e.clientY - rect.top) / rect.height;
        const rotateY = (x - 0.5) * maxTilt * 2;
        const rotateX = (0.5 - y) * maxTilt * 2;
        if (aboutImg) {
          aboutImg.style.transform = 'rotateX(' + rotateX + 'deg) rotateY(' + rotateY + 'deg) scale(1.03)';
        }
      });
    });
    aboutTilt.addEventListener('mouseleave', () => {
      if (rafId) cancelAnimationFrame(rafId);
      if (aboutImg) {
        aboutImg.style.transform = 'rotateX(0deg) rotateY(0deg) scale(1)';
      }
    });
  }

  /* ---------- Back to top ---------- */
  const backToTop = document.getElementById('backToTop');
  if (backToTop) {
    window.addEventListener('scroll', () => {
      if (window.scrollY > 600) backToTop.classList.add('is-visible');
      else backToTop.classList.remove('is-visible');
    }, { passive: true });
    backToTop.addEventListener('click', () => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  /* ---------- Smooth scroll for anchor links ---------- */
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
      const targetId = this.getAttribute('href');
      if (targetId === '#') return;
      const targetEl = document.querySelector(targetId);
      if (targetEl) {
        e.preventDefault();
        const headerHeight = header ? header.offsetHeight : 0;
        const targetPosition = targetEl.getBoundingClientRect().top + window.pageYOffset - headerHeight - 20;
        window.scrollTo({ top: targetPosition, behavior: 'smooth' });
      }
    });
  });

  /* ---------- Parallax effect on hero ---------- */
  const heroContent = document.querySelector('.hero-content');
  if (heroContent) {
    window.addEventListener('scroll', () => {
      const scrolled = window.pageYOffset;
      const rate = scrolled * 0.3;
      if (scrolled < window.innerHeight) {
        heroContent.style.transform = 'translateY(' + rate + 'px)';
        heroContent.style.opacity = 1 - (scrolled / (window.innerHeight * 0.8));
      }
    }, { passive: true });
  }

  /* ---------- Active nav link on scroll ---------- */
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.main-nav a[href^="#"]');

  if (sections.length && navLinks.length) {
    const observerOptions = { rootMargin: '-20% 0px -70% 0px' };
    const sectionObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          navLinks.forEach(link => {
            link.classList.remove('is-active');
            if (link.getAttribute('href') === '#' + entry.target.id) {
              link.classList.add('is-active');
            }
          });
        }
      });
    }, observerOptions);
    sections.forEach(section => sectionObserver.observe(section));
  }

  /* ---------- Trust bar counter animation ---------- */
  const trustBar = document.querySelector('.trust-bar');
  if (trustBar && 'IntersectionObserver' in window) {
    const trustObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const nums = trustBar.querySelectorAll('.trust-bar-num');
          nums.forEach((num, i) => {
            const finalText = num.textContent;
            const isDecimal = finalText.indexOf('.') !== -1;
            const finalValue = parseFloat(finalText);
            if (isNaN(finalValue)) return;

            let current = 0;
            const duration = 1500;
            const startTime = performance.now();
            const delay = i * 200;

            setTimeout(() => {
              const animate = (now) => {
                const elapsed = now - startTime - delay;
                const progress = Math.min(elapsed / duration, 1);
                const eased = 1 - Math.pow(1 - progress, 3);

                if (isDecimal) {
                  num.textContent = (eased * finalValue).toFixed(1);
                } else {
                  num.textContent = Math.round(eased * finalValue);
                }

                if (progress < 1) {
                  requestAnimationFrame(animate);
                } else {
                  num.textContent = finalText;
                }
              };
              requestAnimationFrame(animate);
            }, delay);
          });
          trustObserver.unobserve(trustBar);
        }
      });
    }, { threshold: 0.5 });
    trustObserver.observe(trustBar);
  }

  /* ---------- Preload hero images ---------- */
  const heroSlides = document.querySelectorAll('.hero-slide');
  heroSlides.forEach((slide, i) => {
    if (i === 0) return;
    const bgImage = slide.style.backgroundImage;
    if (bgImage) {
      const match = bgImage.match(/url\(['"]?([^'"]*)['"]?\)/i);
      if (match && match[1]) {
        const img = new Image();
        img.src = match[1];
      }
    }
  });

  /* ---------- Lazy load below-fold images ---------- */
  if ('IntersectionObserver' in window) {
    const lazyImages = document.querySelectorAll('img[loading="lazy"]');
    const imageObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-loaded');
          imageObserver.unobserve(entry.target);
        }
      });
    }, { rootMargin: '100px' });
    lazyImages.forEach(img => imageObserver.observe(img));
  }

});
