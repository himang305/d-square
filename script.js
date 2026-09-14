/* =========================================================
   DEEVA DESSERT — ULTRA-SMOOTH GSAP & SCROLLTRIGGER ENGINE
   ========================================================= */

document.addEventListener('DOMContentLoaded', () => {

  // 1. DYNAMIC MOUSE CURSOR GLOW
  const cursorGlow = document.createElement('div');
  cursorGlow.className = 'cursor-glow';
  document.body.appendChild(cursorGlow);

  let mouseX = window.innerWidth / 2;
  let mouseY = window.innerHeight / 2;
  let currentX = mouseX;
  let currentY = mouseY;

  window.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
  }, { passive: true });

  function renderCursor() {
    currentX += (mouseX - currentX) * 0.12;
    currentY += (mouseY - currentY) * 0.12;
    cursorGlow.style.left = `${currentX}px`;
    cursorGlow.style.top = `${currentY}px`;
    requestAnimationFrame(renderCursor);
  }
  renderCursor();

  // 2. NAVBAR SCROLL GLASSMORPHISM
  const navbar = document.querySelector('.navbar');
  if (navbar) {
    window.addEventListener('scroll', () => {
      if (window.scrollY > 30) {
        navbar.classList.add('scrolled');
      } else {
        navbar.classList.remove('scrolled');
      }
    }, { passive: true });
  }

  // 3. MOBILE MENU TOGGLE
  const toggleBtn = document.getElementById('mobileToggle');
  const mobileMenu = document.getElementById('mobileMenu');
  if (toggleBtn && mobileMenu) {
    toggleBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      toggleBtn.classList.toggle('open');
      mobileMenu.classList.toggle('open');
    });

    document.addEventListener('click', (e) => {
      if (!mobileMenu.contains(e.target) && !toggleBtn.contains(e.target)) {
        toggleBtn.classList.remove('open');
        mobileMenu.classList.remove('open');
      }
    });

    mobileMenu.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        toggleBtn.classList.remove('open');
        mobileMenu.classList.remove('open');
      });
    });
  }

  // 4. INTERACTIVE 3D TILT EFFECT FOR HERO CARD
  const heroCard = document.getElementById('heroCard') || document.querySelector('.hero-3d-card');
  const heroStage = document.getElementById('heroVisual') || document.querySelector('.hero-visual-stage');

  if (heroCard && heroStage) {
    let bounds;
    const onMouseEnter = () => { bounds = heroStage.getBoundingClientRect(); };
    const onMouseMove = (e) => {
      if (!bounds) bounds = heroStage.getBoundingClientRect();
      const mX = e.clientX - bounds.left;
      const mY = e.clientY - bounds.top;
      const xPct = (mX / bounds.width) - 0.5;
      const yPct = (mY / bounds.height) - 0.5;
      const rotateX = -yPct * 24;
      const rotateY = xPct * 28;
      heroCard.style.transform = `rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateZ(15px)`;
    };
    const onMouseLeave = () => {
      heroCard.style.transform = 'rotateX(0deg) rotateY(0deg) translateZ(0px)';
    };

    heroStage.addEventListener('mouseenter', onMouseEnter);
    heroStage.addEventListener('mousemove', onMouseMove);
    heroStage.addEventListener('mouseleave', onMouseLeave);
  }

  // 5. INTERACTIVE 3D TILT FOR PRODUCT CARDS
  const productCards = document.querySelectorAll('.product-card');
  productCards.forEach(card => {
    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      const xPct = (x / rect.width) - 0.5;
      const yPct = (y / rect.height) - 0.5;
      const rotX = -yPct * 12;
      const rotY = xPct * 12;
      card.style.transform = `perspective(1000px) rotateX(${rotX}deg) rotateY(${rotY}deg) translateY(-8px)`;
    });

    card.addEventListener('mouseleave', () => {
      card.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) translateY(0px)';
    });
  });

  // 6. INTERACTIVE FLAVOUR SHOWCASE TABS
  const tabBtns = document.querySelectorAll('.flavour-tab-btn');
  const panels = document.querySelectorAll('.flavour-panel');

  tabBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const targetId = btn.getAttribute('data-target');
      tabBtns.forEach(b => b.classList.remove('active'));
      panels.forEach(p => p.classList.remove('active'));

      btn.classList.add('active');
      const targetPanel = document.getElementById(targetId);
      if (targetPanel) {
        targetPanel.classList.add('active');
      }
    });
  });

  // 7. HORIZONTAL CAROUSEL BUTTONS (Drag & Arrows)
  const trackWrapper = document.getElementById('carouselTrackWrapper');
  const prevBtn = document.getElementById('carouselPrev');
  const nextBtn = document.getElementById('carouselNext');

  if (trackWrapper && prevBtn && nextBtn) {
    prevBtn.addEventListener('click', () => {
      trackWrapper.scrollBy({ left: -340, behavior: 'smooth' });
    });
    nextBtn.addEventListener('click', () => {
      trackWrapper.scrollBy({ left: 340, behavior: 'smooth' });
    });

    // Mouse drag scrolling support
    let isDown = false;
    let startX;
    let scrollLeft;

    trackWrapper.addEventListener('mousedown', (e) => {
      isDown = true;
      startX = e.pageX - trackWrapper.offsetLeft;
      scrollLeft = trackWrapper.scrollLeft;
    });
    trackWrapper.addEventListener('mouseleave', () => { isDown = false; });
    trackWrapper.addEventListener('mouseup', () => { isDown = false; });
    trackWrapper.addEventListener('mousemove', (e) => {
      if (!isDown) return;
      e.preventDefault();
      const x = e.pageX - trackWrapper.offsetLeft;
      const walk = (x - startX) * 1.8;
      trackWrapper.scrollLeft = scrollLeft - walk;
    });
  }

  // 8. GSAP + SCROLLTRIGGER INTEGRATION (Zomato-Style Fluid Animations)
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  if (typeof gsap !== 'undefined' && typeof ScrollTrigger !== 'undefined' && !prefersReducedMotion) {
    gsap.registerPlugin(ScrollTrigger);

    // A. Hero Sequential Entrance Animation
    const heroElements = document.querySelectorAll('.hero-anim-elem');
    if (heroElements.length) {
      gsap.from(heroElements, {
        y: 40,
        opacity: 0,
        duration: 1.1,
        stagger: 0.18,
        ease: 'power3.out',
        delay: 0.2
      });
    }

    const heroCardElem = document.getElementById('heroCard');
    if (heroCardElem) {
      gsap.from(heroCardElem, {
        scale: 0.88,
        opacity: 0,
        y: 60,
        duration: 1.3,
        ease: 'power3.out',
        delay: 0.4
      });
    }

    // B. Hero Scroll Parallax & Dissolve
    const heroFoodImg = document.getElementById('heroFoodImg');
    if (heroFoodImg) {
      gsap.to(heroFoodImg, {
        yPercent: 22,
        scale: 1.15,
        ease: 'none',
        scrollTrigger: {
          trigger: '#heroSection',
          start: 'top top',
          end: 'bottom top',
          scrub: 0.8
        }
      });
    }

    const heroText = document.getElementById('heroText');
    if (heroText) {
      gsap.to(heroText, {
        y: -50,
        opacity: 0.3,
        ease: 'none',
        scrollTrigger: {
          trigger: '#heroSection',
          start: 'top top',
          end: 'bottom top',
          scrub: 0.6
        }
      });
    }

    // Floating Hero Chips subtle counter-parallax
    ['heroChip1', 'heroChip2', 'heroChip3'].forEach((id, idx) => {
      const chip = document.getElementById(id);
      if (chip) {
        gsap.to(chip, {
          y: (idx + 1) * -35,
          ease: 'none',
          scrollTrigger: {
            trigger: '#heroSection',
            start: 'top top',
            end: 'bottom top',
            scrub: 1
          }
        });
      }
    });

    // C. Parallax Floating Food Emblems / Crumbs across vertical scroll
    const decoItems = document.querySelectorAll('.deco-item');
    decoItems.forEach(item => {
      const speed = parseFloat(item.getAttribute('data-speed')) || 0.2;
      gsap.to(item, {
        y: speed * 400,
        rotation: speed * 120,
        ease: 'none',
        scrollTrigger: {
          trigger: 'body',
          start: 'top top',
          end: 'bottom bottom',
          scrub: 1.2
        }
      });
    });

    // D. Horizontal Product Carousel Desktop Scroll Linkage
    if (trackWrapper && window.innerWidth >= 1024) {
      ScrollTrigger.create({
        trigger: '#horizontalMenuSection',
        start: 'top 75%',
        end: 'bottom 25%',
        onUpdate: (self) => {
          const maxScroll = trackWrapper.scrollWidth - trackWrapper.clientWidth;
          trackWrapper.scrollLeft = self.progress * maxScroll;
        }
      });
    }

    // E. Menu Cards Stagger on Scroll
    const menuCards = document.querySelectorAll('#menuCardsGrid .menu-card');
    if (menuCards.length) {
      gsap.fromTo(menuCards,
        { y: 50, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.8,
          stagger: 0.14,
          ease: 'power2.out',
          scrollTrigger: {
            trigger: '#menuCardsGrid',
            start: 'top 82%'
          }
        }
      );
    }

    // F. Pillars (Promise) Stagger Reveal
    const pillars = document.querySelectorAll('#pillarsGrid .pillar');
    if (pillars.length) {
      gsap.fromTo(pillars,
        { scale: 0.9, y: 40, opacity: 0 },
        {
          scale: 1,
          y: 0,
          opacity: 1,
          duration: 0.8,
          stagger: 0.12,
          ease: 'back.out(1.4)',
          scrollTrigger: {
          trigger: '#pillarsGrid',
          start: 'top 82%'
        }
      });
    }

    // G. Large Food Image Smooth Parallax & Scale Transitions
    const parallaxCards = document.querySelectorAll('.parallax-card');
    parallaxCards.forEach(card => {
      const img = card.querySelector('.parallax-img');
      if (img) {
        gsap.fromTo(img, 
          { yPercent: -12, scale: 1.14 },
          {
            yPercent: 12,
            scale: 1.02,
            ease: 'none',
            scrollTrigger: {
              trigger: card,
              start: 'top bottom',
              end: 'bottom top',
              scrub: 1
            }
          }
        );
      }
    });

    // H. Header Titles Fade & Slide
    const sectionHeaders = document.querySelectorAll('.section-header');
    sectionHeaders.forEach(header => {
      gsap.fromTo(header,
        { y: 35, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.85,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: header,
            start: 'top 85%'
          }
        }
      );
    });

  } else {
    // Fallback if GSAP is unavailable or reduced-motion is requested
    const revealElements = document.querySelectorAll('.reveal, .hero-anim-elem');
    if ('IntersectionObserver' in window) {
      const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            entry.target.classList.add('visible');
            observer.unobserve(entry.target);
          }
        });
      }, { threshold: 0.05 });
      revealElements.forEach(el => observer.observe(el));
    } else {
      revealElements.forEach(el => el.classList.add('visible'));
    }
  }

  // Safety fallback — ensure all .reveal elements are visible quickly
  setTimeout(() => {
    document.querySelectorAll('.reveal').forEach(el => el.classList.add('visible'));
  }, 200);

  // 9. THREE.JS 3D FLOATING PARTICLES & GOLDEN RINGS
  if (typeof THREE !== 'undefined') {
    initThreeParticles();
  }
});

function initThreeParticles() {
  const container = document.getElementById('three-canvas');
  if (!container) return;

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 0.1, 1000);
  camera.position.z = 80;

  const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  container.appendChild(renderer.domElement);

  const group = new THREE.Group();
  scene.add(group);

  const colors = [0xb7652b, 0xdf8849, 0xf5e7d6, 0x5a3020, 0xd4a373];
  const items = [];

  for (let i = 0; i < 28; i++) {
    let geom;
    if (i % 3 === 0) {
      geom = new THREE.TorusGeometry(2 + Math.random() * 2.5, 0.5 + Math.random() * 0.3, 16, 32);
    } else if (i % 3 === 1) {
      geom = new THREE.IcosahedronGeometry(1.6 + Math.random() * 1.5, 0);
    } else {
      geom = new THREE.SphereGeometry(1.5 + Math.random() * 1.8, 16, 16);
    }

    const mat = new THREE.MeshStandardMaterial({
      color: colors[i % colors.length],
      roughness: 0.25,
      metalness: 0.4,
      transparent: true,
      opacity: 0.45 + Math.random() * 0.35
    });

    const mesh = new THREE.Mesh(geom, mat);
    mesh.position.set(
      (Math.random() - 0.5) * 140,
      (Math.random() - 0.5) * 100,
      (Math.random() - 0.5) * 60
    );
    mesh.rotation.set(Math.random() * Math.PI, Math.random() * Math.PI, 0);

    const speed = {
      rotX: (Math.random() - 0.5) * 0.02,
      rotY: (Math.random() - 0.5) * 0.02,
      floatSpeed: 0.001 + Math.random() * 0.0015,
      floatOffset: Math.random() * Math.PI * 2
    };

    group.add(mesh);
    items.push({ mesh, speed });
  }

  // Ambient & Directional Lights
  const ambientLight = new THREE.AmbientLight(0xfff7ed, 1.2);
  scene.add(ambientLight);

  const dirLight1 = new THREE.DirectionalLight(0xffeedd, 1.8);
  dirLight1.position.set(40, 60, 50);
  scene.add(dirLight1);

  const dirLight2 = new THREE.DirectionalLight(0xb7652b, 1.0);
  dirLight2.position.set(-40, -30, -20);
  scene.add(dirLight2);

  let mouseX = 0;
  let mouseY = 0;
  let targetX = 0;
  let targetY = 0;

  window.addEventListener('mousemove', (e) => {
    mouseX = (e.clientX / window.innerWidth - 0.5) * 25;
    mouseY = (e.clientY / window.innerHeight - 0.5) * 25;
  }, { passive: true });

  window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
  });

  function animate() {
    requestAnimationFrame(animate);

    targetX += (mouseX - targetX) * 0.05;
    targetY += (mouseY - targetY) * 0.05;

    group.rotation.y = targetX * 0.02;
    group.rotation.x = -targetY * 0.02;

    const time = Date.now();
    items.forEach(item => {
      item.mesh.rotation.x += item.speed.rotX;
      item.mesh.rotation.y += item.speed.rotY;
      item.mesh.position.y += Math.sin(time * item.speed.floatSpeed + item.speed.floatOffset) * 0.04;
    });

    renderer.render(scene, camera);
  }

  animate();
}
