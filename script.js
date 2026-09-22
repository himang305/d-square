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

/* =========================================================
   SHOPPING CART, CHECKOUT & WHATSAPP ORDER ENGINE
   ========================================================= */
const CartEngine = (function() {
  let cart = [];

  // Load saved cart from localStorage
  function loadCart() {
    try {
      const saved = localStorage.getItem('deeva_cart');
      if (saved) cart = JSON.parse(saved);
    } catch(e) {
      cart = [];
    }
  }

  function saveCart() {
    try {
      localStorage.setItem('deeva_cart', JSON.stringify(cart));
    } catch(e) {}
    updateUI();
  }

  function addItem(item) {
    const minOrder = item.minQty || 1;
    const initialAdd = item.initialQty || minOrder;
    const existing = cart.find(i => i.name === item.name && i.variant === item.variant);
    if (existing) {
      existing.qty += 1;
    } else {
      cart.push({
        id: item.id || item.name.toLowerCase().replace(/[^a-z0-9]/g, '_'),
        name: item.name,
        price: parseFloat(item.price),
        img: item.img || 'favicon.jpg',
        variant: item.variant || '',
        minQty: minOrder,
        qty: initialAdd
      });
    }
    saveCart();
    showToast(`Added "${item.name}" (${existing ? existing.qty : initialAdd} pcs) to cart! 🛒`);
    bumpBadge();
  }

  function removeItem(index) {
    cart.splice(index, 1);
    saveCart();
  }

  function updateQty(index, change) {
    if (cart[index]) {
      const item = cart[index];
      const minOrder = item.minQty || 1;
      const newQty = item.qty + change;
      if (newQty < minOrder) {
        cart.splice(index, 1);
        showToast(`Removed "${item.name}" from cart`);
      } else {
        item.qty = newQty;
      }
      saveCart();
    }
  }

  function getTotal() {
    return cart.reduce((sum, i) => sum + (i.price * i.qty), 0);
  }

  function getItemCount() {
    return cart.reduce((sum, i) => sum + i.qty, 0);
  }

  function bumpBadge() {
    const badges = document.querySelectorAll('.cart-badge');
    badges.forEach(badge => {
      badge.classList.remove('bump');
      void badge.offsetWidth;
      badge.classList.add('bump');
    });
  }

  function showToast(msg) {
    let container = document.querySelector('.cart-toast-container');
    if (!container) {
      container = document.createElement('div');
      container.className = 'cart-toast-container';
      document.body.appendChild(container);
    }
    const toast = document.createElement('div');
    toast.className = 'cart-toast';
    toast.innerHTML = `<span>✨</span> <span>${msg}</span>`;
    container.appendChild(toast);
    setTimeout(() => toast.classList.add('show'), 10);
    setTimeout(() => {
      toast.classList.remove('show');
      setTimeout(() => toast.remove(), 300);
    }, 2500);
  }

  // Inject Cart Elements (Drawer & Modal) into DOM
  function injectDOM() {
    // 1. Inject Cart Icon into navbar right actions if not already present
    const navActions = document.querySelector('.nav-right-actions');
    if (navActions && !document.querySelector('.nav-btn-cart')) {
      const cartBtn = document.createElement('button');
      cartBtn.className = 'nav-btn-cart';
      cartBtn.setAttribute('aria-label', 'Shopping Cart');
      cartBtn.type = 'button';
      cartBtn.innerHTML = `🛒 Cart <span class="cart-badge">0</span>`;
      cartBtn.addEventListener('click', openDrawer);
      navActions.insertBefore(cartBtn, navActions.firstChild);
    }

    // 2. Inject Cart Drawer Overlay
    if (!document.querySelector('.cart-drawer-overlay')) {
      const drawerHTML = `
        <div class="cart-drawer-overlay" id="cartOverlay">
          <div class="cart-drawer">
            <div class="cart-header">
              <h3>🛒 Your Sweet Cart</h3>
              <button class="cart-close-btn" id="closeCartBtn">&times;</button>
            </div>
            <div class="cart-body" id="cartBody">
              <!-- Rendered items or empty state -->
            </div>
            <div class="cart-footer">
              <div class="cart-summary-row">
                <span class="cart-summary-label">Total Amount:</span>
                <span class="cart-total-val" id="cartTotalVal">₹0</span>
              </div>
              <button class="btn-checkout" id="startCheckoutBtn">
                Proceed to Checkout →
              </button>
            </div>
          </div>
        </div>
      `;
      document.body.insertAdjacentHTML('beforeend', drawerHTML);

      document.getElementById('closeCartBtn').addEventListener('click', closeDrawer);
      document.getElementById('cartOverlay').addEventListener('click', (e) => {
        if (e.target.id === 'cartOverlay') closeDrawer();
      });
      document.getElementById('startCheckoutBtn').addEventListener('click', () => {
        if (cart.length === 0) {
          showToast('Please add items to your cart first! 🎂');
          return;
        }
        closeDrawer();
        openCheckoutModal();
      });
    }

    // 3. Inject Checkout Modal
    if (!document.querySelector('.checkout-modal-overlay')) {
      const checkoutHTML = `
        <div class="checkout-modal-overlay" id="checkoutOverlay">
          <div class="checkout-modal">
            <div class="checkout-header">
              <h3>📦 Complete Your Order</h3>
              <button class="cart-close-btn" id="closeCheckoutBtn">&times;</button>
            </div>
            <div class="checkout-body">
              <form id="checkoutForm">
                <div class="form-group">
                  <label for="custName">Your Full Name *</label>
                  <input type="text" id="custName" class="form-input" placeholder="e.g. Jyoti Chaudhary" required>
                </div>
                <div class="form-group">
                  <label for="custPhone">Phone Number *</label>
                  <input type="tel" id="custPhone" class="form-input" placeholder="e.g. 9876543210" required>
                </div>
                <div class="form-group">
                  <label for="custAddress">Delivery Address / Landmark (Dholpur) *</label>
                  <textarea id="custAddress" class="form-input" rows="2" placeholder="Street, Colony, Landmark or Store Pick up" required></textarea>
                </div>
                <div class="form-group">
                  <label for="custNotes">Special Instructions / Cake Message (Optional)</label>
                  <input type="text" id="custNotes" class="form-input" placeholder="e.g. Write 'Happy Birthday' on cake / Less spicy">
                </div>

                <div class="payment-section">
                  <div class="payment-title">💳 Payment Option</div>
                  <div class="payment-options">
                    <button type="button" class="payment-option-btn selected" data-mode="UPI / QR Code">
                      📲 UPI / QR Code
                    </button>
                    <button type="button" class="payment-option-btn" data-mode="Cash on Delivery / Pickup">
                      💵 Cash / Store Pickup
                    </button>
                  </div>

                  <div class="qr-code-card" id="qrContainer">
                    <div style="font-size: 12px; font-weight: 700; color: #3b2017;">Scan QR Code to Pay via GPay / PhonePe / Paytm</div>
                    <img src="https://api.qrserver.com/v1/create-qr-code/?size=180x180&data=upi://pay?pa=9116013272@upi%26pn=DeevaDessert" alt="Deeva Dessert Payment QR Code">
                    <div><span class="upi-id-badge">UPI ID: 9116013272@upi</span></div>
                    <div style="font-size: 11.5px; font-weight: 700; color: #2b6736; background: #eef7ee; padding: 6px 10px; border-radius: 8px; margin-top: 8px; display: flex; align-items: center; justify-content: center; gap: 6px;">
                      📸 <span>Please share your payment screenshot in WhatsApp chat after sending order</span>
                    </div>
                  </div>
                </div>

                <div class="cart-summary-row" style="margin-top: 20px;">
                  <span class="cart-summary-label">Total Payable:</span>
                  <span class="cart-total-val" id="checkoutTotalVal">₹0</span>
                </div>

                <button type="submit" class="btn-checkout" style="margin-top: 10px;">
                  💬 Place Order on WhatsApp
                </button>
              </form>
            </div>
          </div>
        </div>
      `;
      document.body.insertAdjacentHTML('beforeend', checkoutHTML);

      document.getElementById('closeCheckoutBtn').addEventListener('click', closeCheckoutModal);
      document.getElementById('checkoutOverlay').addEventListener('click', (e) => {
        if (e.target.id === 'checkoutOverlay') closeCheckoutModal();
      });

      // Payment option toggle
      const pBtns = document.querySelectorAll('.payment-option-btn');
      pBtns.forEach(btn => {
        btn.addEventListener('click', () => {
          pBtns.forEach(b => b.classList.remove('selected'));
          btn.classList.add('selected');
          const qr = document.getElementById('qrContainer');
          if (btn.dataset.mode.includes('Cash')) {
            qr.style.display = 'none';
          } else {
            qr.style.display = 'block';
          }
        });
      });

      // Submit Form → WhatsApp Link
      document.getElementById('checkoutForm').addEventListener('submit', handleCheckoutSubmit);
    }
  }

  function openDrawer() {
    injectDOM();
    updateUI();
    document.getElementById('cartOverlay')?.classList.add('active');
    document.body.style.overflow = 'hidden';
  }

  function closeDrawer() {
    document.getElementById('cartOverlay')?.classList.remove('active');
    document.body.style.overflow = '';
  }

  function openCheckoutModal() {
    const total = getTotal();
    const checkoutVal = document.getElementById('checkoutTotalVal');
    if (checkoutVal) checkoutVal.innerText = `₹${total}`;
    document.getElementById('checkoutOverlay')?.classList.add('active');
    document.body.style.overflow = 'hidden';
  }

  function closeCheckoutModal() {
    document.getElementById('checkoutOverlay')?.classList.remove('active');
    document.body.style.overflow = '';
  }

  function updateUI() {
    const badges = document.querySelectorAll('.cart-badge');
    const count = getItemCount();
    badges.forEach(b => b.innerText = count);

    const cartBody = document.getElementById('cartBody');
    const cartTotalVal = document.getElementById('cartTotalVal');
    if (!cartBody) return;

    if (cart.length === 0) {
      cartBody.innerHTML = `
        <div class="cart-empty">
          <span class="cart-empty-icon">🍰</span>
          <p>Your cart is empty!</p>
          <span style="font-size: 13px; color: var(--text-muted);">Add delicious cakes, pastries &amp; snacks to get started.</span>
        </div>
      `;
      if (cartTotalVal) cartTotalVal.innerText = '₹0';
      return;
    }

    let itemsHTML = '<div class="cart-items-list">';
    cart.forEach((item, index) => {
      itemsHTML += `
        <div class="cart-item">
          <img src="${item.img}" alt="${item.name}" class="cart-item-img" onerror="this.src='favicon.jpg'">
          <div class="cart-item-info">
            <div class="cart-item-title">${item.name} ${item.variant ? `(${item.variant})` : ''}</div>
            <div class="cart-item-price">₹${item.price} &times; ${item.qty} = ₹${item.price * item.qty}</div>
          </div>
          <div class="cart-item-actions">
            <button class="cart-qty-btn" type="button" onclick="CartEngine.updateQty(${index}, -1)">-</button>
            <span class="cart-qty-num">${item.qty}</span>
            <button class="cart-qty-btn" type="button" onclick="CartEngine.updateQty(${index}, 1)">+</button>
          </div>
          <button class="cart-remove-btn" type="button" onclick="CartEngine.removeItem(${index})" title="Remove">&times;</button>
        </div>
      `;
    });
    itemsHTML += '</div>';

    cartBody.innerHTML = itemsHTML;
    if (cartTotalVal) cartTotalVal.innerText = `₹${getTotal()}`;
  }

  function handleCheckoutSubmit(e) {
    e.preventDefault();
    const name = document.getElementById('custName').value.trim();
    const phone = document.getElementById('custPhone').value.trim();
    const address = document.getElementById('custAddress').value.trim();
    const notes = document.getElementById('custNotes').value.trim();

    const selectedPayBtn = document.querySelector('.payment-option-btn.selected');
    const payMode = selectedPayBtn ? selectedPayBtn.dataset.mode : 'UPI / QR Code';

    if (!name || !phone || !address) {
      alert('Please fill in all required contact details.');
      return;
    }

    const total = getTotal();

    let msg = `🍰 *NEW ORDER - DEEVA DESSERT* 🍰\n`;
    msg += `--------------------------------\n`;
    msg += `👤 *Customer Name:* ${name}\n`;
    msg += `📞 *Phone Number:* ${phone}\n`;
    msg += `📍 *Delivery Address:* ${address}\n`;
    if (notes) {
      msg += `📝 *Instructions / Message:* ${notes}\n`;
    }
    msg += `--------------------------------\n`;
    msg += `🛒 *ORDER ITEMS:*\n`;

    cart.forEach((item, idx) => {
      const variantText = item.variant ? ` (${item.variant})` : '';
      msg += `${idx + 1}. *${item.name}${variantText}* x ${item.qty} = ₹${item.price * item.qty}\n`;
    });

    msg += `--------------------------------\n`;
    msg += `💰 *TOTAL PAYABLE:* ₹${total}\n`;
    msg += `💳 *PAYMENT METHOD:* ${payMode}\n`;

    if (!payMode.includes('Cash')) {
      msg += `📸 *Note:* I will attach my payment receipt / screenshot in this chat below.\n`;
    }

    msg += `--------------------------------\n`;
    msg += `Thank you! Please confirm and process my order.`;

    const waUrl = `https://wa.me/919116013272?text=${encodeURIComponent(msg)}`;

    cart = [];
    saveCart();
    closeCheckoutModal();

    window.open(waUrl, '_blank');
  }

  function autoBindProductCards() {
    // 1. Bind to .product-card elements
    document.querySelectorAll('.product-card').forEach(card => {
      const footer = card.querySelector('.product-card-footer');
      if (footer && !card.querySelector('.btn-add-cart')) {
        const nameElem = card.querySelector('.product-card-name');
        const priceElem = card.querySelector('.product-card-price');
        const imgElem = card.querySelector('.product-card-photo');

        if (nameElem && priceElem) {
          const name = nameElem.innerText.trim();
          const priceMatch = priceElem.innerText.match(/\d+/);
          const price = priceMatch ? priceMatch[0] : 0;
          const img = imgElem ? imgElem.getAttribute('src') : 'favicon.jpg';

          const addBtn = document.createElement('button');
          addBtn.className = 'btn-add-cart';
          addBtn.innerHTML = `🛒 Add`;
          addBtn.type = 'button';
          addBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            addItem({ name, price, img });
          });
          footer.appendChild(addBtn);
        }
      }
    });

    // 2. Bind to .teatime-card in cakes.html
    document.querySelectorAll('.teatime-card').forEach(card => {
      if (!card.querySelector('.btn-add-cart')) {
        const titleElem = card.querySelector('h4');
        const priceElem = card.querySelector('.price-pill');
        const imgElem = card.querySelector('img');

        if (titleElem && priceElem) {
          const name = titleElem.innerText.trim();
          const priceMatch = priceElem.innerText.match(/\d+/);
          const price = priceMatch ? priceMatch[0] : 0;
          const img = imgElem ? imgElem.getAttribute('src') : 'favicon.jpg';

          const btnContainer = document.createElement('div');
          btnContainer.style.marginTop = '10px';
          btnContainer.style.textAlign = 'center';

          const addBtn = document.createElement('button');
          addBtn.className = 'btn-add-cart';
          addBtn.style.width = '100%';
          addBtn.innerHTML = `🛒 Add to Cart (₹${price})`;
          addBtn.type = 'button';
          addBtn.addEventListener('click', () => {
            addItem({ name, price, img, variant: '1 Kg' });
          });
          btnContainer.appendChild(addBtn);
          card.appendChild(btnContainer);
        }
      }
    });

    // 3. Bind to .menu-price-table rows in cakes.html
    document.querySelectorAll('.menu-price-table tr').forEach(row => {
      const tds = row.querySelectorAll('td');
      if (tds.length >= 2 && !row.querySelector('.table-add-cart-btn')) {
        const itemName = tds[0].innerText.replace(/^[•\s]+/, '').trim();
        const thElems = Array.from(row.closest('table')?.querySelectorAll('th') || []);
        const headers = thElems.map(th => th.innerText.trim());
        const headersLower = headers.map(h => h.toLowerCase());

        if (headers.length >= 2 && itemName && !itemName.toLowerCase().includes('customize')) {
          // Check if table has a "Min. Order" column
          let minOrderQty = 1;
          const minColIdx = headersLower.findIndex(h => h.includes('min'));
          if (minColIdx !== -1 && tds[minColIdx]) {
            const minMatch = tds[minColIdx].innerText.match(/\d+/);
            if (minMatch) minOrderQty = parseInt(minMatch[0], 10);
          }

          for (let i = 1; i < tds.length; i++) {
            const headerText = headersLower[i] || '';
            // Skip non-price columns like "Min. Order"
            if (headerText.includes('min') || headerText.includes('order')) continue;

            const priceText = tds[i].innerText.trim();
            const priceMatch = priceText.match(/\d+/);
            if (priceMatch) {
              const price = priceMatch[0];
              const variant = (headers[i] && !headersLower[i].includes('price'))
                ? headers[i]
                : (minOrderQty > 1 ? `Min. ${minOrderQty} pcs` : '');

              const addBtn = document.createElement('button');
              addBtn.className = 'table-add-cart-btn';
              addBtn.innerHTML = `+🛒`;
              addBtn.title = `Add ${itemName} - ₹${price}`;
              addBtn.type = 'button';
              addBtn.addEventListener('click', (e) => {
                e.stopPropagation();
                const cellImg = tds[0].querySelector('img')?.getAttribute('src') || 'favicon.jpg';
                addItem({
                  name: itemName,
                  price,
                  variant,
                  img: cellImg,
                  minQty: minOrderQty,
                  initialQty: minOrderQty
                });
              });
              tds[i].appendChild(addBtn);
            }
          }
        }
      }
    });
  }

  function init() {
    loadCart();
    injectDOM();
    updateUI();
    autoBindProductCards();
  }

  return {
    init,
    addItem,
    removeItem,
    updateQty,
    openDrawer,
    closeDrawer,
    openCheckoutModal,
    closeCheckoutModal
  };
})();

// Expose CartEngine globally
window.CartEngine = CartEngine;

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => CartEngine.init());
} else {
  CartEngine.init();
}

