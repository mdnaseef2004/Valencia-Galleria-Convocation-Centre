// Valencia Galleria Luxury Site Engine

document.addEventListener('DOMContentLoaded', () => {
  // Register GSAP Plugins
  if (typeof gsap !== 'undefined' && typeof ScrollTrigger !== 'undefined') {
    gsap.registerPlugin(ScrollTrigger);
  }

  // --------------------------------------------------------------------------
  // 1. LENIS SMOOTH SCROLLING SETUP
  // --------------------------------------------------------------------------
  let lenis = null;
  if (typeof Lenis !== 'undefined') {
    lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
      wheelMultiplier: 1.0,
      touchMultiplier: 1.5,
      smoothTouch: false
    });

    if (typeof ScrollTrigger !== 'undefined') {
      lenis.on('scroll', ScrollTrigger.update);
      gsap.ticker.add((time) => {
        lenis.raf(time * 1000);
      });
      gsap.ticker.lagSmoothing(0);
    } else {
      function raf(time) {
        lenis.raf(time);
        requestAnimationFrame(raf);
      }
      requestAnimationFrame(raf);
    }
  }

  // --------------------------------------------------------------------------
  // 2. CANVAS AMBIENT GOLD DUST PARTICLES
  // --------------------------------------------------------------------------
  function initGoldParticles() {
    const canvas = document.getElementById('particle-canvas');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');

    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    window.addEventListener('resize', () => {
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    });

    const particles = [];
    const particleCount = window.innerWidth < 768 ? 16 : 40;

    class Particle {
      constructor() {
        this.reset();
      }
      reset() {
        this.x = Math.random() * width;
        this.y = Math.random() * height;
        this.size = Math.random() * 2 + 0.8;
        this.speedY = Math.random() * -0.4 - 0.1;
        this.speedX = Math.random() * 0.3 - 0.15;
        this.opacity = Math.random() * 0.6 + 0.2;
        this.fadeSpeed = Math.random() * 0.005 + 0.002;
      }
      update() {
        this.y += this.speedY;
        this.x += this.speedX;
        this.opacity -= this.fadeSpeed;

        if (this.y < 0 || this.opacity <= 0) {
          this.reset();
          this.y = height + 10;
        }
      }
      draw() {
        ctx.save();
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(212, 175, 55, ${this.opacity})`;
        if (width > 768) {
          ctx.shadowBlur = 6;
          ctx.shadowColor = 'rgba(212, 175, 55, 0.8)';
        }
        ctx.fill();
        ctx.restore();
      }
    }

    for (let i = 0; i < particleCount; i++) {
      particles.push(new Particle());
    }

    function animateParticles() {
      ctx.clearRect(0, 0, width, height);
      particles.forEach((p) => {
        p.update();
        p.draw();
      });
      requestAnimationFrame(animateParticles);
    }
    animateParticles();
  }

  // --------------------------------------------------------------------------
  // 3. GSAP SCROLLTRIGGER ANIMATIONS
  // --------------------------------------------------------------------------
  function initGSAPAnimations() {
    if (typeof gsap === 'undefined' || typeof ScrollTrigger === 'undefined') return;

    // Navigation Bar scroll state with passive listener
    const navbar = document.querySelector('.navbar');
    if (navbar) {
      const handleNavbarScroll = () => {
        if (window.scrollY > 40) {
          navbar.classList.add('scrolled');
        } else {
          navbar.classList.remove('scrolled');
        }
      };
      window.addEventListener('scroll', handleNavbarScroll, { passive: true });
      handleNavbarScroll();
    }

    // Hero Parallax & Zoom effect
    const heroBg = document.querySelector('.hero-bg-img');
    const heroContent = document.querySelector('.hero-content');
    if (heroBg) {
      gsap.to(heroBg, {
        scale: 1.2,
        yPercent: 15,
        ease: 'none',
        scrollTrigger: {
          trigger: '.hero-section',
          start: 'top top',
          end: 'bottom top',
          scrub: true
        }
      });

      gsap.to(heroContent, {
        yPercent: -15,
        opacity: 0.6,
        ease: 'none',
        scrollTrigger: {
          trigger: '.hero-section',
          start: 'top top',
          end: 'bottom top',
          scrub: true
        }
      });
    }

    // Fade Up Elements across sections
    const fadeUpEls = document.querySelectorAll('.gsap-fade-up');
    fadeUpEls.forEach((el) => {
      gsap.fromTo(
        el,
        { opacity: 0, y: 40 },
        {
          opacity: 1,
          y: 0,
          duration: 0.9,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: el,
            start: 'top 90%',
            once: true
          }
        }
      );
    });

    // Infrastructure Image Scroll Scale
    const infraImg = document.querySelector('.infra-image');
    if (infraImg) {
      gsap.fromTo(
        infraImg,
        { scale: 1.15 },
        {
          scale: 1.0,
          duration: 1.2,
          ease: 'power2.out',
          scrollTrigger: {
            trigger: '.infra-image-wrapper',
            start: 'top 80%',
            end: 'bottom 20%',
            scrub: true
          }
        }
      );
    }

    // Hall 02 Andalucia Hall Horizontal Move
    const hall2Img = document.querySelector('.hall-horizontal-img');
    if (hall2Img) {
      gsap.to(hall2Img, {
        xPercent: -15,
        ease: 'none',
        scrollTrigger: {
          trigger: '.hall-02-block',
          start: 'top bottom',
          end: 'bottom top',
          scrub: true
        }
      });
    }

    // Hall 03 Cordoba & Granada Dark Wipe Reveal
    const hall3Block = document.querySelector('.hall-03-block');
    const hall3Bg = document.querySelector('.hall-03-bg');
    if (hall3Block && hall3Bg) {
      gsap.fromTo(
        hall3Bg,
        { scale: 1.2, opacity: 0.2 },
        {
          scale: 1.0,
          opacity: 0.6,
          duration: 1.5,
          ease: 'power2.out',
          scrollTrigger: {
            trigger: hall3Block,
            start: 'top 75%',
            end: 'bottom bottom',
            toggleActions: 'play none none reverse'
          }
        }
      );
    }

    // Stats Counters
    const statNumbers = document.querySelectorAll('.stat-number');
    statNumbers.forEach((stat) => {
      const target = parseInt(stat.getAttribute('data-target') || '0', 10);
      const suffix = stat.getAttribute('data-suffix') || '';

      ScrollTrigger.create({
        trigger: stat,
        start: 'top 85%',
        onEnter: () => {
          let count = { val: 0 };
          gsap.to(count, {
            val: target,
            duration: 2,
            ease: 'power2.out',
            onUpdate: () => {
              stat.textContent = Math.floor(count.val) + suffix;
            }
          });
        }
      });
    });
  }

  // --------------------------------------------------------------------------
  // 4. INTERACTIVE LIGHTBOX & MASONRY GALLERY SYSTEM
  // --------------------------------------------------------------------------
  const galleryImages = [
    // Exterior
    { src: 'Extertior/Valencia-galleria-Outfit.jpeg?v=10', title: 'Valencia Galleria Aerial Overview', category: 'exterior', span: 'span-wide' },
    { src: 'Extertior/introslide2.jpg?v=10', title: 'Grand Exterior Campus', category: 'exterior', span: '' },
    { src: 'Extertior/introslide3.jpg?v=10', title: 'Palatial Entrance Façade', category: 'exterior', span: 'span-tall' },
    { src: 'Extertior/introslide4.jpg?v=10', title: 'Illuminated Evening Grounds', category: 'exterior', span: '' },
    { src: 'Extertior/introslide5.jpg?v=10', title: 'Architectural Details & Portico', category: 'exterior', span: '' },
    { src: 'Extertior/introslide6.jpg?v=10', title: 'Spacious Promenade & Driveway', category: 'exterior', span: 'span-wide' },

    // Alhambra Hall
    { src: 'Alhambra/hall11.jpg?v=10', title: 'Alhambra Grand Banquet Hall', category: 'alhambra', span: 'span-wide' },
    { src: 'Alhambra/hall13.jpg?v=10', title: 'Alhambra Stage & Chandelier Lighting', category: 'alhambra', span: 'span-tall' },
    { src: 'Alhambra/hall6.jpg?v=10', title: 'Alhambra Stage Backdrop Setup', category: 'alhambra', span: '' },
    { src: 'Alhambra/hall3.jpg?v=10', title: 'Alhambra Intimate Guest Seating', category: 'alhambra', span: '' },
    { src: 'Alhambra/hall5.jpg?v=10', title: 'Alhambra Interior Promenade', category: 'alhambra', span: '' },
    { src: 'Alhambra/hall8.jpg?v=10', title: 'Alhambra Luxury Seating Layout', category: 'alhambra', span: '' },
    { src: 'Alhambra/hall16.jpg?v=10', title: 'Alhambra Modern Interiors', category: 'alhambra', span: '' },

    // Andalusia VIP Lounge
    { src: 'Andalisia/vip1.jpg?v=10', title: 'Andalusia Executive Reception Lounge', category: 'andalucia', span: 'span-wide' },
    { src: 'Andalisia/vip2.jpg?v=10', title: 'Andalusia VIP Suite Ambience', category: 'andalucia', span: '' },
    { src: 'Andalisia/vip3.jpg?v=10', title: 'Andalusia Luxury Welcome Desk', category: 'andalucia', span: '' },

    // Cordoba & Granada Dining
    { src: 'Cordoba-Granada/dinning1.jpg?v=10', title: 'Cordoba & Granada Grand Dining Pavilion', category: 'cordoba', span: 'span-wide' },
    { src: 'Cordoba-Granada/dinning14.jpg?v=10', title: 'Granada Luxury Dining Arrangement', category: 'cordoba', span: 'span-tall' },
    { src: 'Cordoba-Granada/dinning15.jpg?v=10', title: 'Cordoba Banquet Tables & Linens', category: 'cordoba', span: '' },
    { src: 'Cordoba-Granada/dinning16.jpg?v=10', title: 'Cordoba & Granada Full Hall Capacity', category: 'cordoba', span: 'span-wide' },
    { src: 'Cordoba-Granada/dinning9.jpg?v=10', title: 'Curated Dining Table Setting', category: 'cordoba', span: '' },
    { src: 'Cordoba-Granada/dinning11.jpg?v=10', title: 'Bespoke Feast Setup', category: 'cordoba', span: '' },

    // Educational Events & Convocations
    { src: 'Raihan-Madrasa-Event/0F1A0437.jpg?v=10', title: 'Raihan Online Madrasa Convocation', category: 'educational', span: 'span-wide' },
    { src: 'Raihan-Madrasa-Event/0F1A0394.jpg?v=10', title: 'Grand Educational Assembly', category: 'educational', span: 'span-tall' },
    { src: 'Spark-Connect-Event/087A9373.jpg?v=10', title: 'Spark Connect Academic Conference', category: 'educational', span: 'span-wide' },
    { src: 'Raihan-Madrasa-Event/duff.jpg?v=10', title: 'Raihan Online Madrasa Cultural Performance', category: 'educational', span: 'span-tall' },
    { src: 'Spark-Connect-Event/087A9387.jpg?v=10', title: 'Academic Symposium & Address', category: 'educational', span: '' },

    // Corporate & Conference Events
    { src: 'Build-X-Event/0T5A0852.JPG?v=10', title: 'Build X Corporate Summit', category: 'exterior', span: 'span-wide' },
    { src: 'Build-X-Event/0T5A0786.JPG?v=10', title: 'Executive Expo & Exhibition', category: 'exterior', span: '' },
    { src: 'CONFERENCES/Faculty-Development-2026/0F1A1536.jpg?v=10', title: 'Faculty Development Program Conference 2026', category: 'educational', span: 'span-wide' },
    { src: 'CONFERENCES/Faculty-Development-2026/0F1A1511.jpg?v=10', title: 'Faculty Conference Keynote Session', category: 'educational', span: '' }
  ];

  let currentImageIndex = 0;
  let filteredImages = [...galleryImages];
  let isGalleryExpanded = false;

  function initGalleryAndLightbox() {
    const gridContainer = document.getElementById('gallery-masonry-grid');
    const filterBtns = document.querySelectorAll('.gallery-filter-btn');
    const toggleBtn = document.getElementById('gallery-toggle-btn');

    const lightboxModal = document.getElementById('lightbox-modal');
    const lightboxImg = document.getElementById('lightbox-img');
    const lightboxCaption = document.getElementById('lightbox-caption');
    const lightboxClose = document.getElementById('lightbox-close');
    const lightboxPrev = document.getElementById('lightbox-prev');
    const lightboxNext = document.getElementById('lightbox-next');

    if (!gridContainer) return;

    function renderGallery(category = 'all') {
      gridContainer.innerHTML = '';
      filteredImages = category === 'all' 
        ? galleryImages 
        : galleryImages.filter((img) => img.category === category);

      // Only show 3 photos initially unless expanded
      const displayImages = isGalleryExpanded ? filteredImages : filteredImages.slice(0, 3);

      displayImages.forEach((img) => {
        const actualIndex = filteredImages.indexOf(img);
        const itemEl = document.createElement('div');
        itemEl.className = `gallery-item ${img.span}`;
        itemEl.setAttribute('data-index', actualIndex);
        itemEl.innerHTML = `
          <img src="${img.src}" alt="${img.title}" class="gallery-img" loading="lazy" />
          <div class="gallery-overlay">
            <span class="gallery-category-tag">${img.category}</span>
            <h4 class="gallery-caption">${img.title}</h4>
          </div>
        `;

        itemEl.addEventListener('click', () => {
          openLightbox(actualIndex);
        });

        gridContainer.appendChild(itemEl);
      });

      // Update toggle button text and visibility
      if (toggleBtn) {
        if (filteredImages.length <= 3) {
          toggleBtn.style.display = 'none';
        } else {
          toggleBtn.style.display = 'inline-flex';
          toggleBtn.innerHTML = isGalleryExpanded ? 'VIEW LESS PHOTOS ↑' : 'VIEW MORE PHOTOS ↓';
        }
      }
    }

    // Toggle Button Listener (View More / View Less)
    if (toggleBtn) {
      toggleBtn.addEventListener('click', () => {
        isGalleryExpanded = !isGalleryExpanded;
        const currentCategory = document.querySelector('.gallery-filter-btn.active')?.getAttribute('data-filter') || 'all';
        renderGallery(currentCategory);

        if (!isGalleryExpanded) {
          const gallerySection = document.getElementById('gallery');
          if (gallerySection) gallerySection.scrollIntoView({ behavior: 'smooth' });
        }
      });
    }

    // Filter Button Events
    filterBtns.forEach((btn) => {
      btn.addEventListener('click', () => {
        filterBtns.forEach((b) => b.classList.remove('active'));
        btn.classList.add('active');
        isGalleryExpanded = false; // Reset to 3 photos when switching category
        const cat = btn.getAttribute('data-filter') || 'all';
        renderGallery(cat);
      });
    });

    // Lightbox Functions
    function openLightbox(index) {
      currentImageIndex = index;
      const imgData = filteredImages[currentImageIndex];
      if (!imgData) return;

      lightboxImg.src = imgData.src;
      lightboxCaption.textContent = imgData.title;
      lightboxModal.classList.add('active');
      document.body.style.overflow = 'hidden';
    }

    function closeLightbox() {
      lightboxModal.classList.remove('active');
      document.body.style.overflow = '';
    }

    function showPrev() {
      currentImageIndex = (currentImageIndex - 1 + filteredImages.length) % filteredImages.length;
      const imgData = filteredImages[currentImageIndex];
      lightboxImg.src = imgData.src;
      lightboxCaption.textContent = imgData.title;
    }

    function showNext() {
      currentImageIndex = (currentImageIndex + 1) % filteredImages.length;
      const imgData = filteredImages[currentImageIndex];
      lightboxImg.src = imgData.src;
      lightboxCaption.textContent = imgData.title;
    }

    if (lightboxClose) lightboxClose.addEventListener('click', closeLightbox);
    if (lightboxPrev) lightboxPrev.addEventListener('click', showPrev);
    if (lightboxNext) lightboxNext.addEventListener('click', showNext);

    if (lightboxModal) {
      lightboxModal.addEventListener('click', (e) => {
        if (e.target === lightboxModal) closeLightbox();
      });
    }

    document.addEventListener('keydown', (e) => {
      if (!lightboxModal.classList.contains('active')) return;
      if (e.key === 'Escape') closeLightbox();
      if (e.key === 'ArrowLeft') showPrev();
      if (e.key === 'ArrowRight') showNext();
    });

    // Initial render
    renderGallery('all');
  }

  // --------------------------------------------------------------------------
  // 5. TESTIMONIAL CAROUSEL
  // --------------------------------------------------------------------------
  const testimonials = [
    {
      quote: "A truly grand venue. The Alhambra hall ambience, towering ceilings, and flawless support made our daughter's wedding unforgettable.",
      author: "Malik & Family — Grand Wedding Event"
    },
    {
      quote: "Valencia Galleria sets a new standard for luxury event venues. The Andalusia VIP lounge and massive dining area catered seamlessly to 1,500+ guests.",
      author: "Siddique Hassan — Corporate Summit Host"
    },
    {
      quote: "Architecturally stunning and incredibly well-managed. From stage lighting to spacious parking, every detail was handled to perfection.",
      author: "Dr. Farooq Ahmad — Reception Host"
    }
  ];

  let activeTestimonialIndex = 0;

  function initTestimonials() {
    const quoteEl = document.getElementById('testimonial-quote');
    const authorEl = document.getElementById('testimonial-author');
    const prevBtn = document.getElementById('testimonial-prev');
    const nextBtn = document.getElementById('testimonial-next');

    if (!quoteEl || !authorEl) return;

    function updateTestimonial(index) {
      activeTestimonialIndex = index;
      if (typeof gsap !== 'undefined') {
        gsap.to([quoteEl, authorEl], {
          opacity: 0,
          y: -10,
          duration: 0.3,
          onComplete: () => {
            quoteEl.textContent = `“${testimonials[activeTestimonialIndex].quote}”`;
            authorEl.textContent = `— ${testimonials[activeTestimonialIndex].author}`;
            gsap.to([quoteEl, authorEl], {
              opacity: 1,
              y: 0,
              duration: 0.4
            });
          }
        });
      } else {
        quoteEl.textContent = `“${testimonials[activeTestimonialIndex].quote}”`;
        authorEl.textContent = `— ${testimonials[activeTestimonialIndex].author}`;
      }
    }

    if (prevBtn) {
      prevBtn.addEventListener('click', () => {
        const newIdx = (activeTestimonialIndex - 1 + testimonials.length) % testimonials.length;
        updateTestimonial(newIdx);
      });
    }

    if (nextBtn) {
      nextBtn.addEventListener('click', () => {
        const newIdx = (activeTestimonialIndex + 1) % testimonials.length;
        updateTestimonial(newIdx);
      });
    }

    setInterval(() => {
      const newIdx = (activeTestimonialIndex + 1) % testimonials.length;
      updateTestimonial(newIdx);
    }, 6000);
  }

  // --------------------------------------------------------------------------
  // EVENTS & RECENT EVENTS CAROUSEL NAVIGATION CONTROLS
  // --------------------------------------------------------------------------
  function initEventsCarousel() {
    const wrapper = document.querySelector('.events-carousel-wrapper');
    const prevBtn = document.getElementById('events-prev-btn');
    const nextBtn = document.getElementById('events-next-btn');
    const pillPrev = document.getElementById('events-pill-prev');
    const pillNext = document.getElementById('events-pill-next');
    const counter = document.getElementById('events-counter');

    if (!wrapper) return;

    const cards = wrapper.querySelectorAll('.event-card');

    function getStepWidth() {
      if (window.innerWidth <= 768) {
        return (wrapper.clientWidth / 2) + 6;
      }
      return 358;
    }

    function updateCounter() {
      if (!counter || cards.length === 0) return;
      const scrollLeft = wrapper.scrollLeft;
      const stepWidth = getStepWidth();
      const index = Math.round(scrollLeft / stepWidth) + 1;
      const clampedIndex = Math.min(Math.max(index, 1), cards.length);
      counter.textContent = `${clampedIndex} / ${cards.length}`;
    }

    function scrollNext() {
      const stepWidth = getStepWidth();
      if (wrapper.scrollLeft + wrapper.clientWidth >= wrapper.scrollWidth - 15) {
        wrapper.scrollTo({ left: 0, behavior: 'smooth' });
      } else {
        wrapper.scrollBy({ left: stepWidth, behavior: 'smooth' });
      }
    }

    function scrollPrev() {
      const stepWidth = getStepWidth();
      if (wrapper.scrollLeft <= 15) {
        wrapper.scrollTo({ left: wrapper.scrollWidth, behavior: 'smooth' });
      } else {
        wrapper.scrollBy({ left: -stepWidth, behavior: 'smooth' });
      }
    }

    if (prevBtn) prevBtn.addEventListener('click', scrollPrev);
    if (nextBtn) nextBtn.addEventListener('click', scrollNext);
    if (pillPrev) pillPrev.addEventListener('click', scrollPrev);
    if (pillNext) pillNext.addEventListener('click', scrollNext);

    wrapper.addEventListener('scroll', updateCounter, { passive: true });
    window.addEventListener('resize', updateCounter, { passive: true });
    updateCounter();
  }

  function initRecentEventsCarousel() {
    const wrapper = document.querySelector('.recent-events-marquee-wrapper');
    const prevBtn = document.getElementById('recent-prev-btn');
    const nextBtn = document.getElementById('recent-next-btn');
    const pillPrev = document.getElementById('recent-pill-prev');
    const pillNext = document.getElementById('recent-pill-next');
    const counter = document.getElementById('recent-counter');

    if (!wrapper) return;

    const cards = wrapper.querySelectorAll('.recent-event-card');
    const stepWidth = 368;

    function updateCounter() {
      if (!counter || cards.length === 0) return;
      const scrollLeft = wrapper.scrollLeft;
      const index = Math.round(scrollLeft / stepWidth) + 1;
      const clampedIndex = Math.min(Math.max(index, 1), cards.length);
      counter.textContent = `${clampedIndex} / ${cards.length}`;
    }

    function scrollNext() {
      if (wrapper.scrollLeft + wrapper.clientWidth >= wrapper.scrollWidth - 15) {
        wrapper.scrollTo({ left: 0, behavior: 'smooth' });
      } else {
        wrapper.scrollBy({ left: stepWidth, behavior: 'smooth' });
      }
    }

    function scrollPrev() {
      if (wrapper.scrollLeft <= 15) {
        wrapper.scrollTo({ left: wrapper.scrollWidth, behavior: 'smooth' });
      } else {
        wrapper.scrollBy({ left: -stepWidth, behavior: 'smooth' });
      }
    }

    if (prevBtn) prevBtn.addEventListener('click', scrollPrev);
    if (nextBtn) nextBtn.addEventListener('click', scrollNext);
    if (pillPrev) pillPrev.addEventListener('click', scrollPrev);
    if (pillNext) pillNext.addEventListener('click', scrollNext);

    wrapper.addEventListener('scroll', updateCounter, { passive: true });
    updateCounter();
  }

  // --------------------------------------------------------------------------
  // 6. ENQUIRY FORM & MODAL HANDLERS
  // --------------------------------------------------------------------------
  function initFormAndModals() {
    const enquiryForm = document.getElementById('enquiry-form');
    const mobileToggle = document.getElementById('mobile-toggle');
    const mobileNav = document.getElementById('mobile-nav');
    const mobileNavLinks = document.querySelectorAll('.mobile-nav-link');

    if (mobileToggle && mobileNav) {
      mobileToggle.addEventListener('click', () => {
        mobileNav.classList.toggle('active');
      });

      mobileNavLinks.forEach((link) => {
        link.addEventListener('click', () => {
          mobileNav.classList.remove('active');
        });
      });
    }

    const dateInput = document.getElementById('enquiry-date');
    const datePlaceholder = document.getElementById('date-placeholder');
    if (dateInput && datePlaceholder) {
      const checkDateValue = () => {
        if (dateInput.value) {
          datePlaceholder.style.opacity = '0';
        } else {
          datePlaceholder.style.opacity = '1';
        }
      };
      dateInput.addEventListener('change', checkDateValue);
      dateInput.addEventListener('input', checkDateValue);
      dateInput.addEventListener('focus', () => { datePlaceholder.style.opacity = '0'; });
      dateInput.addEventListener('blur', checkDateValue);
      checkDateValue();
    }

    if (enquiryForm) {
      enquiryForm.addEventListener('submit', (e) => {
        e.preventDefault();
        
        const name = document.getElementById('enquiry-name')?.value.trim() || 'N/A';
        const phone = document.getElementById('enquiry-phone')?.value.trim() || 'N/A';
        const email = document.getElementById('enquiry-email')?.value.trim() || 'N/A';
        const eventType = document.getElementById('enquiry-event-type')?.value || 'N/A';
        const date = document.getElementById('enquiry-date')?.value || 'N/A';
        const guests = document.getElementById('enquiry-guests')?.value || 'N/A';
        const message = document.getElementById('enquiry-message')?.value.trim() || 'None';

        const whatsappMessage = 
          `*VALENCIA GALLERIA - NEW EVENT ENQUIRY*\n\n` +
          `👤 *Name:* ${name}\n` +
          `📞 *Phone:* ${phone}\n` +
          `✉️ *Email:* ${email}\n` +
          `🎉 *Event Type:* ${eventType}\n` +
          `📅 *Event Date:* ${date}\n` +
          `👥 *Expected Guests:* ${guests}\n\n` +
          `💬 *Message / Requests:*\n${message}`;

        const adminWhatsAppUrl = `https://wa.me/917510103055?text=${encodeURIComponent(whatsappMessage)}`;

        const submitBtn = enquiryForm.querySelector('button[type="submit"]');
        const originalText = submitBtn.innerHTML;
        
        submitBtn.innerHTML = `OPENING WHATSAPP...`;
        submitBtn.disabled = true;

        setTimeout(() => {
          window.open(adminWhatsAppUrl, '_blank');
          enquiryForm.reset();
          submitBtn.innerHTML = originalText;
          submitBtn.disabled = false;
        }, 500);
      });
    }

    // Smooth Anchor Link Scrolling
    document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
      anchor.addEventListener('click', function (e) {
        const targetId = this.getAttribute('href');
        if (targetId === '#') return;
        const targetEl = document.querySelector(targetId);
        if (targetEl) {
          e.preventDefault();
          if (lenis) {
            lenis.scrollTo(targetEl, { offset: -80 });
          } else {
            targetEl.scrollIntoView({ behavior: 'smooth' });
          }
        }
      });
    });
  }

  // --------------------------------------------------------------------------
  // EVENT PHOTO ALBUM LIGHTBOX MODAL HANDLER
  // --------------------------------------------------------------------------
  const eventAlbums = {
    ayadi: {
      title: "Ayadi Convocation Ceremony",
      tag: "CONVOCATION ALBUM",
      photos: [
        "Ayadi-Convocation-Event/0F1A3112.jpg?v=10",
        "Ayadi-Convocation-Event/0F1A3113.jpg?v=10",
        "Ayadi-Convocation-Event/0F1A3125.jpg?v=10",
        "Ayadi-Convocation-Event/0F1A3140.jpg?v=10",
        "Ayadi-Convocation-Event/0F1A3205.jpg?v=10",
        "Ayadi-Convocation-Event/0F1A3354.jpg?v=10",
        "Ayadi-Convocation-Event/0F1A4204.jpg?v=10",
        "Ayadi-Convocation-Event/0F1A4228.jpg?v=10",
        "Ayadi-Convocation-Event/0F1A4254.jpg?v=10",
        "Ayadi-Convocation-Event/0F1A4258.jpg?v=10",
        "Ayadi-Convocation-Event/0F1A4277.jpg?v=10",
        "Ayadi-Convocation-Event/0F1A4295.jpg?v=10",
        "Ayadi-Convocation-Event/0F1A4329.jpg?v=10"
      ]
    },
    hr: {
      title: "Human Resources (HR) Training Program",
      tag: "CORPORATE CONFERENCE ALBUM",
      photos: [
        "CONFERENCES/HR-Training/0T5A9627.jpg?v=10",
        "CONFERENCES/HR-Training/0T5A9635.jpg?v=10",
        "CONFERENCES/HR-Training/0T5A9650.jpg?v=10",
        "CONFERENCES/HR-Training/0T5A9724.jpg?v=10",
        "CONFERENCES/HR-Training/0T5A9730.jpg?v=10",
        "CONFERENCES/HR-Training/0T5A9802.jpg?v=10",
        "CONFERENCES/HR-Training/0T5A9822.jpg?v=10",
        "CONFERENCES/HR-Training/0T5A9844.jpg?v=10"
      ]
    },
    raihan: {
      title: "Raihan Online Madrasa Cultural Fest",
      tag: "CULTURAL ALBUM",
      photos: [
        "Raihan-Madrasa-Event/duff.jpg?v=10",
        "Raihan-Madrasa-Event/0F1A0394.jpg?v=10",
        "Raihan-Madrasa-Event/0F1A0437.jpg?v=10",
        "Raihan-Madrasa-Event/0F1A0479.jpg?v=10",
        "Raihan-Madrasa-Event/0F1A0482.jpg?v=10",
        "Raihan-Madrasa-Event/0F1A0517.jpg?v=10",
        "Raihan-Madrasa-Event/0F1A0542.jpg?v=10",
        "Raihan-Madrasa-Event/0F1A0545.jpg?v=10",
        "Raihan-Madrasa-Event/0F1A0579.jpg?v=10"
      ]
    },
    buildx: {
      title: "Build X Corporate Expo & Summit",
      tag: "CORPORATE ALBUM",
      photos: [
        "Build-X-Event/0T5A0852.JPG?v=10",
        "Build-X-Event/0T5A0786.JPG?v=10",
        "Build-X-Event/0T5A0792-1.JPG?v=10",
        "Build-X-Event/0T5A0797.JPG?v=10"
      ]
    },
    spark: {
      title: "Spark Connect Academic Summit",
      tag: "ACADEMIC ALBUM",
      photos: [
        "Spark-Connect-Event/087A9373.jpg?v=10",
        "Spark-Connect-Event/087A8464.jpg?v=10",
        "Spark-Connect-Event/087A9381.jpg?v=10",
        "Spark-Connect-Event/087A9387.jpg?v=10",
        "Spark-Connect-Event/087A9390.jpg?v=10",
        "Spark-Connect-Event/087A9395.jpg?v=10",
        "Spark-Connect-Event/087A9398.jpg?v=10",
        "Spark-Connect-Event/087A9400.jpg?v=10",
        "Spark-Connect-Event/087A9405.jpg?v=10",
        "Spark-Connect-Event/087A9411.jpg?v=10",
        "Spark-Connect-Event/087A9413.jpg?v=10"
      ]
    },
    faculty: {
      title: "Faculty Development Program 2026",
      tag: "CONFERENCE ALBUM",
      photos: [
        "CONFERENCES/Faculty-Development-2026/0F1A1536.jpg?v=10",
        "CONFERENCES/Faculty-Development-2026/0F1A1511.jpg?v=10",
        "CONFERENCES/Faculty-Development-2026/0F1A1556.jpg?v=10",
        "CONFERENCES/Faculty-Development-2026/0F1A1558.jpg?v=10"
      ]
    },
    zeely: {
      title: "Zeely Convocation Ceremony",
      tag: "CONVOCATION ALBUM",
      photos: [
        "Zeely-Convocation-Event/0F1A4022.jpg?v=10",
        "Zeely-Convocation-Event/0F1A4159.jpg?v=10",
        "Zeely-Convocation-Event/0F1A4181.jpg?v=10",
        "Zeely-Convocation-Event/0F1A4236.jpg?v=10",
        "Zeely-Convocation-Event/0F1A4250.jpg?v=10",
        "Zeely-Convocation-Event/0F1A4401.jpg?v=10",
        "Zeely-Convocation-Event/0F1A4436.jpg?v=10",
        "Zeely-Convocation-Event/0F1A4447.jpg?v=10",
        "Zeely-Convocation-Event/0F1A4484.jpg?v=10",
        "Zeely-Convocation-Event/0F1A4496.jpg?v=10",
        "Zeely-Convocation-Event/0F1A4703.jpg?v=10"
      ]
    },
    cordoba: {
      title: "Cordoba & Granada Ballroom & Dining Pavilion",
      tag: "HALL 03 - PHOTO ALBUM",
      photos: [
        "Cordoba-Granada/dinning16.jpg?v=10",
        "Cordoba-Granada/dinning1.jpg?v=10",
        "Cordoba-Granada/dinning14.jpg?v=10",
        "Cordoba-Granada/dinning15.jpg?v=10",
        "Cordoba-Granada/dinning9.jpg?v=10",
        "Cordoba-Granada/dinning11.jpg?v=10"
      ]
    },
    alhambra: {
      title: "Alhambra Hall - Intimate Event Venue",
      tag: "HALL 01 - PHOTO ALBUM",
      photos: [
        "Alhambra/hall11.jpg?v=10",
        "Alhambra/hall13.jpg?v=10",
        "Alhambra/hall16.jpg?v=10",
        "Alhambra/hall3.jpg?v=10",
        "Alhambra/hall5.jpg?v=10",
        "Alhambra/hall6.jpg?v=10",
        "Alhambra/hall8.jpg?v=10",
        "Alhambra/0F1A1722.JPG?v=10",
        "Alhambra/0F1A1751.JPG?v=10",
        "Alhambra/0F1A1753.JPG?v=10"
      ]
    },
    andalucia: {
      title: "Andalusia Hall & VIP Executive Lounge",
      tag: "HALL 02 - PHOTO ALBUM",
      photos: [
        "Andalisia/vip1.jpg?v=10",
        "Andalisia/vip2.jpg?v=10",
        "Andalisia/vip3.jpg?v=10"
      ]
    },
        pinarayi: {
      title: "Shri Pinarayi Vijayan - Civilis Launching & Year Declaration Program",
      tag: "CIVILIS LAUNCHING & YEAR DECLARATION PROGRAM",
      photos: [
        "pinarayi-vijayan/pinarayi-vijayan-1.jpeg?v=10",
        "pinarayi-vijayan/pinarayi-vijayan-2.jpeg?v=10",
        "pinarayi-vijayan/pinarayi-vijayan-3.jpeg?v=10",
        "pinarayi-vijayan/pinarayi-vijayan-4.jpeg?v=10"
      ]
    },
    rahulgandhi: {
      title: "Shri Rahul Gandhi's Official Visit to Valencia Galleria",
      tag: "VVIP DIGNITARY VISIT ALBUM",
      photos: [
        "rahull-ghandhi/rahul-ghandh-stage.jpeg?v=10",
        "rahull-ghandhi/rahul-ghandh-stage-2.jpeg?v=10",
        "rahull-ghandhi/rahul-ghandh-walking.jpeg?v=10",
        "rahull-ghandhi/rahul-ghandhi-hall.jpeg?v=10",
        "rahull-ghandhi/rahul-ghandh-sign.jpeg?v=10",
        "rahull-ghandhi/rahul-ghandh-program.jpeg?v=10",
        "rahull-ghandhi/rahul-ghandh-invite.jpeg?v=10"
      ]
    }
  };

  function initEventAlbumModal() {
    const modal = document.getElementById('event-modal');
    const modalImg = document.getElementById('event-modal-img');
    const modalTitle = document.getElementById('event-modal-title');
    const modalTag = document.getElementById('event-modal-tag');
    const modalCounter = document.getElementById('event-modal-counter');
    const modalThumbnails = document.getElementById('event-modal-thumbnails');
    const closeBtn = document.getElementById('event-modal-close');
    const prevBtn = document.getElementById('event-modal-prev');
    const nextBtn = document.getElementById('event-modal-next');

    let currentAlbum = null;
    let currentPhotoIdx = 0;

    function openAlbum(albumKey) {
      currentAlbum = eventAlbums[albumKey];
      if (!currentAlbum || !currentAlbum.photos.length) return;

      currentPhotoIdx = 0;
      modalTitle.textContent = currentAlbum.title;
      modalTag.textContent = currentAlbum.tag;
      
      renderModalPhoto();
      renderThumbnails();

      modal.classList.add('active');
      document.body.style.overflow = 'hidden';
    }

    function renderModalPhoto() {
      if (!currentAlbum) return;
      modalImg.src = currentAlbum.photos[currentPhotoIdx];
      modalCounter.textContent = `Photo ${currentPhotoIdx + 1} of ${currentAlbum.photos.length}`;
      
      const thumbs = modalThumbnails.querySelectorAll('.event-thumb');
      thumbs.forEach((t, i) => {
        if (i === currentPhotoIdx) {
          t.classList.add('active');
          t.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });
        } else {
          t.classList.remove('active');
        }
      });
    }

    function renderThumbnails() {
      if (!currentAlbum) return;
      modalThumbnails.innerHTML = '';
      currentAlbum.photos.forEach((src, idx) => {
        const thumb = document.createElement('img');
        thumb.src = src;
        thumb.className = `event-thumb ${idx === 0 ? 'active' : ''}`;
        thumb.addEventListener('click', () => {
          currentPhotoIdx = idx;
          renderModalPhoto();
        });
        modalThumbnails.appendChild(thumb);
      });
    }

    function closeAlbum() {
      modal.classList.remove('active');
      document.body.style.overflow = '';
    }

    function prevPhoto() {
      if (!currentAlbum) return;
      currentPhotoIdx = (currentPhotoIdx - 1 + currentAlbum.photos.length) % currentAlbum.photos.length;
      renderModalPhoto();
    }

    function nextPhoto() {
      if (!currentAlbum) return;
      currentPhotoIdx = (currentPhotoIdx + 1) % currentAlbum.photos.length;
      renderModalPhoto();
    }

    document.querySelectorAll('.recent-event-card, .event-card, .rahul-marquee-card, .vvip-photo-card').forEach((card) => {
      card.addEventListener('click', () => {
        const albumKey = card.getAttribute('data-album');
        if (albumKey) openAlbum(albumKey);
      });
    });

    const openCordobaBtn = document.getElementById('open-cordoba-gallery');
    if (openCordobaBtn) {
      openCordobaBtn.addEventListener('click', () => {
        openAlbum('cordoba');
      });
    }

    const openAlhambraBtn = document.getElementById('open-alhambra-gallery');
    if (openAlhambraBtn) {
      openAlhambraBtn.addEventListener('click', () => {
        openAlbum('alhambra');
      });
    }

    const openAndaluciaBtn = document.getElementById('open-andalucia-gallery');
    if (openAndaluciaBtn) {
      openAndaluciaBtn.addEventListener('click', () => {
        openAlbum('andalucia');
      });
    }

        const openPinarayiBtn = document.getElementById('open-pinarayi-gallery');
    if (openPinarayiBtn) {
      openPinarayiBtn.addEventListener('click', () => {
        openAlbum('pinarayi');
      });
    }

    const openRahulGandhiBtn = document.getElementById('open-rahulgandhi-gallery');
    if (openRahulGandhiBtn) {
      openRahulGandhiBtn.addEventListener('click', () => {
        openAlbum('rahulgandhi');
      });
    }

    if (closeBtn) closeBtn.addEventListener('click', closeAlbum);
    if (prevBtn) prevBtn.addEventListener('click', prevPhoto);
    if (nextBtn) nextBtn.addEventListener('click', nextPhoto);

    if (modal) {
      modal.addEventListener('click', (e) => {
        if (e.target === modal) closeAlbum();
      });
    }

    document.addEventListener('keydown', (e) => {
      if (!modal || !modal.classList.contains('active')) return;
      if (e.key === 'Escape') closeAlbum();
      if (e.key === 'ArrowLeft') prevPhoto();
      if (e.key === 'ArrowRight') nextPhoto();
    });
  }

  // --------------------------------------------------------------------------
  // THE FIRST IMPRESSION ANIMATED SLIDESHOW
  // --------------------------------------------------------------------------
  function initFirstImpressionSlideshow() {
    const slides = document.querySelectorAll('.impression-slide');
    const dots = document.querySelectorAll('.impression-dot');
    const prevBtn = document.getElementById('impression-prev');
    const nextBtn = document.getElementById('impression-next');
    if (!slides.length) return;

    let currentSlide = 0;
    let slideTimer = null;

    function goToSlide(idx) {
      slides[currentSlide].classList.remove('active');
      if (dots[currentSlide]) dots[currentSlide].classList.remove('active');

      currentSlide = (idx + slides.length) % slides.length;

      slides[currentSlide].classList.add('active');
      if (dots[currentSlide]) dots[currentSlide].classList.add('active');
    }

    function nextSlide() {
      goToSlide(currentSlide + 1);
    }

    function prevSlide() {
      goToSlide(currentSlide - 1);
    }

    function startAutoSlide() {
      stopAutoSlide();
      slideTimer = setInterval(nextSlide, 4000);
    }

    function stopAutoSlide() {
      if (slideTimer) clearInterval(slideTimer);
    }

    if (prevBtn) {
      prevBtn.addEventListener('click', () => {
        prevSlide();
        startAutoSlide();
      });
    }

    if (nextBtn) {
      nextBtn.addEventListener('click', () => {
        nextSlide();
        startAutoSlide();
      });
    }

    dots.forEach((dot, idx) => {
      dot.addEventListener('click', () => {
        goToSlide(idx);
        startAutoSlide();
      });
    });

    const container = document.getElementById('impression-slideshow');
    if (container) {
      container.addEventListener('mouseenter', stopAutoSlide);
      container.addEventListener('mouseleave', startAutoSlide);
    }

    startAutoSlide();
  }

  // --------------------------------------------------------------------------
  // CORDOBA & GRANADA BALLROOM SLIDER
  // --------------------------------------------------------------------------
  function initCordobaSlider() {
    const slides = document.querySelectorAll('.cordoba-slide');
    const prevBtn = document.getElementById('cordoba-prev');
    const nextBtn = document.getElementById('cordoba-next');
    if (!slides.length) return;

    let currentSlide = 0;
    let timer = null;

    function goToSlide(idx) {
      slides[currentSlide].classList.remove('active');
      currentSlide = (idx + slides.length) % slides.length;
      slides[currentSlide].classList.add('active');
    }

    function next() { goToSlide(currentSlide + 1); }
    function prev() { goToSlide(currentSlide - 1); }

    function startAuto() {
      stopAuto();
      timer = setInterval(next, 4500);
    }

    function stopAuto() {
      if (timer) clearInterval(timer);
    }

    if (prevBtn) prevBtn.addEventListener('click', () => { prev(); startAuto(); });
    if (nextBtn) nextBtn.addEventListener('click', () => { next(); startAuto(); });

    startAuto();
  }

  function initAlhambraSlider() {
    const slides = document.querySelectorAll('.alhambra-slide');
    const prevBtn = document.getElementById('alhambra-prev');
    const nextBtn = document.getElementById('alhambra-next');
    if (!slides.length) return;

    let currentSlide = 0;
    let timer = null;

    function goToSlide(idx) {
      slides[currentSlide].classList.remove('active');
      currentSlide = (idx + slides.length) % slides.length;
      slides[currentSlide].classList.add('active');
    }

    function next() { goToSlide(currentSlide + 1); }
    function prev() { goToSlide(currentSlide - 1); }

    function startAuto() {
      stopAuto();
      timer = setInterval(next, 4000);
    }

    function stopAuto() {
      if (timer) clearInterval(timer);
    }

    if (prevBtn) prevBtn.addEventListener('click', () => { prev(); startAuto(); });
    if (nextBtn) nextBtn.addEventListener('click', () => { next(); startAuto(); });

    startAuto();
  }

  function initAndaluciaSlider() {
    const slides = document.querySelectorAll('.andalucia-slide');
    const prevBtn = document.getElementById('andalucia-prev');
    const nextBtn = document.getElementById('andalucia-next');
    if (!slides.length) return;

    let currentSlide = 0;
    let timer = null;

    function goToSlide(idx) {
      slides[currentSlide].classList.remove('active');
      currentSlide = (idx + slides.length) % slides.length;
      slides[currentSlide].classList.add('active');
    }

    function next() { goToSlide(currentSlide + 1); }
    function prev() { goToSlide(currentSlide - 1); }

    function startAuto() {
      stopAuto();
      timer = setInterval(next, 4200);
    }

    function stopAuto() {
      if (timer) clearInterval(timer);
    }

    if (prevBtn) prevBtn.addEventListener('click', () => { prev(); startAuto(); });
    if (nextBtn) nextBtn.addEventListener('click', () => { next(); startAuto(); });

    startAuto();
  }

  // Run modules
  initGoldParticles();
  initGSAPAnimations();
  initGalleryAndLightbox();
  initFirstImpressionSlideshow();
  initAlhambraSlider();
  initAndaluciaSlider();
  initCordobaSlider();
  initEventsCarousel();
  initRecentEventsCarousel();
  initEventAlbumModal();
  initTestimonials();
  initFormAndModals();

  if (typeof ScrollTrigger !== 'undefined') {
    ScrollTrigger.refresh();
  }
});

window.addEventListener('load', () => {
  if (typeof ScrollTrigger !== 'undefined') {
    ScrollTrigger.refresh();
  }
});
