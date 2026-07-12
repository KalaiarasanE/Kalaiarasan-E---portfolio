/**
 * Kalaiarasan E - Premium Portfolio Website
 * Custom interactive UI/UX engine (script.js)
 */

document.addEventListener('DOMContentLoaded', () => {
  initPageLoader();
  initCustomCursor();
  initThemeToggle();
  initTypingEffect();
  initDynamicGreeting();
  initNavbarScroll();
  initSpotlightEffect();
  initTiltCards();
  initCounterAnimations();
  initProjectFilters();
  initCertificateModal();
  initContactForm();
  initScrollReveal();
  initEmailCopy();
});

/* ==========================================
   1. PAGE LOADER
   ========================================== */
function initPageLoader() {
  const loader = document.getElementById('page-loader');
  const percentText = document.getElementById('loader-percentage');
  const progressLine = document.getElementById('loader-progress-line');
  
  if (!loader) return;

  let count = 0;
  const target = 100;
  const duration = 1200; // ms
  const stepTime = Math.floor(duration / target);

  const timer = setInterval(() => {
    count++;
    if (percentText) percentText.textContent = count;
    if (progressLine) progressLine.style.width = `${count}%`;

    if (count >= target) {
      clearInterval(timer);
      setTimeout(() => {
        loader.classList.add('fade-out');
        document.body.classList.remove('no-scroll');
        // Trigger entrance animations for hero section
        document.querySelector('.home')?.classList.add('active-reveal');
      }, 300);
    }
  }, stepTime);
}

/* ==========================================
   2. CUSTOM CURSOR & MAGNETIC EFFECT
   ========================================== */
function initCustomCursor() {
  const cursorDot = document.querySelector('.cursor-dot');
  const cursorOutline = document.querySelector('.cursor-outline');
  
  if (!cursorDot || !cursorOutline) return;

  // Create Smoke Air Canvas
  const canvas = document.createElement('canvas');
  canvas.className = 'smoke-canvas';
  document.body.appendChild(canvas);
  
  const ctx = canvas.getContext('2d');
  let width = canvas.width = window.innerWidth;
  let height = canvas.height = window.innerHeight;
  
  window.addEventListener('resize', () => {
    width = canvas.width = window.innerWidth;
    height = canvas.height = window.innerHeight;
  });

  let mouseX = 0;
  let mouseY = 0;
  let cursorX = 0;
  let cursorY = 0;
  let particles = [];
  let colorHue = 0; // Cycles to create beautiful RGB rainbow flow

  class SmokeAirParticle {
    constructor(x, y, hue, isClick = false) {
      this.x = x;
      this.y = y;
      this.hue = hue;
      
      if (isClick) {
        const angle = Math.random() * Math.PI * 2;
        const speed = Math.random() * 2 + 1;
        this.vx = Math.cos(angle) * speed;
        this.vy = Math.sin(angle) * speed - 0.5;
      } else {
        this.vx = (Math.random() - 0.5) * 0.8;
        this.vy = -Math.random() * 0.5 - 0.2; // Slow upward gaseous drift
      }
      
      this.size = Math.random() * 15 + 10; // Initial size
      this.alpha = 0.55; // Soft gaseous alpha
      this.fadeSpeed = Math.random() * 0.007 + 0.005;
      this.growthSpeed = Math.random() * 0.5 + 0.3; // Smoke expansion
    }

    update() {
      this.x += this.vx;
      this.y += this.vy;
      this.alpha -= this.fadeSpeed;
      this.size += this.growthSpeed;
    }

    draw() {
      if (this.alpha <= 0 || this.size <= 0) return;
      ctx.beginPath();
      
      // Radial gradient for gaseous smoky air puff
      const grad = ctx.createRadialGradient(
        this.x, this.y, 0,
        this.x, this.y, this.size
      );
      
      grad.addColorStop(0, `hsla(${this.hue}, 100%, 65%, ${this.alpha})`);
      grad.addColorStop(0.3, `hsla(${this.hue}, 100%, 65%, ${this.alpha * 0.35})`);
      grad.addColorStop(1, 'rgba(0, 0, 0, 0)');
      
      ctx.fillStyle = grad;
      ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
      ctx.fill();
    }
  }

  // Follow mouse coordinates
  window.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
    
    // Set dot immediately
    cursorDot.style.transform = `translate3d(${mouseX}px, ${mouseY}px, 0) translate(-50%, -50%)`;
    
    // Cycle hue smoothly as cursor moves
    colorHue = (colorHue + 1.5) % 360;
    
    // Spawn trail particles
    if (Math.random() < 0.75) {
      particles.push(new SmokeAirParticle(mouseX, mouseY, colorHue, false));
    }
  });

  // Smooth easing for the cursor outline and smoke animation loop
  const renderCursor = () => {
    // Interpolation (lerp) for cursor outline
    cursorX += (mouseX - cursorX) * 0.15;
    cursorY += (mouseY - cursorY) * 0.15;
    
    cursorOutline.style.transform = `translate3d(${cursorX}px, ${cursorY}px, 0) translate(-50%, -50%)`;
    
    // Render smoke air particles
    ctx.clearRect(0, 0, width, height);
    
    // Update and draw particles
    for (let i = particles.length - 1; i >= 0; i--) {
      const p = particles[i];
      p.update();
      if (p.alpha <= 0) {
        particles.splice(i, 1);
      } else {
        p.draw();
      }
    }

    requestAnimationFrame(renderCursor);
  };
  requestAnimationFrame(renderCursor);

  // Click effects
  window.addEventListener('mousedown', () => {
    cursorDot.style.transform = `translate3d(${mouseX}px, ${mouseY}px, 0) translate(-50%, -50%) scale(0.6)`;
    cursorOutline.style.transform = `translate3d(${cursorX}px, ${cursorY}px, 0) translate(-50%, -50%) scale(1.6)`;
    cursorOutline.style.borderColor = 'var(--neon-accent)';
  });

  window.addEventListener('mouseup', () => {
    cursorDot.style.transform = `translate3d(${mouseX}px, ${mouseY}px, 0) translate(-50%, -50%) scale(1)`;
    cursorOutline.style.transform = `translate3d(${cursorX}px, ${cursorY}px, 0) translate(-50%, -50%) scale(1)`;
    cursorOutline.style.borderColor = 'var(--cursor-color)';
  });

  // Ripple effect on click
  window.addEventListener('click', (e) => {
    const ripple = document.createElement('div');
    ripple.className = 'cursor-ripple';
    ripple.style.left = `${e.clientX}px`;
    ripple.style.top = `${e.clientY}px`;
    document.body.appendChild(ripple);
    
    ripple.addEventListener('animationend', () => {
      ripple.remove();
    });
    
    // Spawn burst of multi-colored smoky air clouds on click
    const burstCount = 14;
    for (let i = 0; i < burstCount; i++) {
      // Cycle hue per particle in the click burst
      const clickHue = (colorHue + (i * (360 / burstCount))) % 360;
      particles.push(new SmokeAirParticle(e.clientX, e.clientY, clickHue, true));
    }
  });

  // Hover states for interactive elements
  const interactives = document.querySelectorAll('a, button, input, textarea, select, .project-card, .certificate-container, .theme-toggle, .filter-btn, .service-card, .tilt-card');
  
  interactives.forEach(el => {
    el.addEventListener('mouseenter', () => {
      cursorOutline.classList.add('hovered');
      cursorDot.classList.add('hovered');
      
      // Magnetic effect feedback (slight scaling)
      if (el.classList.contains('magnetic-btn')) {
        el.style.transform = 'scale(1.05)';
      }
    });

    el.addEventListener('mouseleave', () => {
      cursorOutline.classList.remove('hovered');
      cursorDot.classList.remove('hovered');
      
      if (el.classList.contains('magnetic-btn')) {
        el.style.transform = 'scale(1)';
      }
    });
  });
}

/* ==========================================
   3. THEME SWITCHER (DARK / LIGHT)
   ========================================== */
function initThemeToggle() {
  const toggleBtn = document.querySelector('.theme-toggle');
  if (!toggleBtn) return;

  const currentTheme = localStorage.getItem('theme') || 'dark';
  document.body.setAttribute('data-theme', currentTheme);
  updateThemeIcon(currentTheme);

  toggleBtn.addEventListener('click', () => {
    const activeTheme = document.body.getAttribute('data-theme');
    const newTheme = activeTheme === 'dark' ? 'light' : 'dark';
    
    document.body.setAttribute('data-theme', newTheme);
    localStorage.setItem('theme', newTheme);
    updateThemeIcon(newTheme);
    
    showToast(`Switched to ${newTheme} mode! 🌟`);
  });
}

function updateThemeIcon(theme) {
  const icon = document.querySelector('.theme-toggle i');
  if (!icon) return;
  
  if (theme === 'light') {
    icon.className = 'fas fa-moon';
  } else {
    icon.className = 'fas fa-sun';
  }
}

/* ==========================================
   4. TYPING CAROUSEL
   ========================================== */
function initTypingEffect() {
  const typedTextSpan = document.getElementById('typed-text');
  if (!typedTextSpan) return;

  const textArray = ["Web Developer 💻", "UI/UX Designer 🎨", "Problem Solver 🚀", "Tech Enthusiast 🌟"];
  const typingSpeed = 100;
  const erasingSpeed = 60;
  const newTextDelay = 2000;
  let textArrayIndex = 0;
  let charIndex = 0;

  function type() {
    if (charIndex < textArray[textArrayIndex].length) {
      typedTextSpan.textContent += textArray[textArrayIndex].charAt(charIndex);
      charIndex++;
      setTimeout(type, typingSpeed);
    } else {
      setTimeout(erase, newTextDelay);
    }
  }

  function erase() {
    if (charIndex > 0) {
      typedTextSpan.textContent = textArray[textArrayIndex].substring(0, charIndex - 1);
      charIndex--;
      setTimeout(erase, erasingSpeed);
    } else {
      textArrayIndex = (textArrayIndex + 1) % textArray.length;
      setTimeout(type, 500);
    }
  }

  setTimeout(type, 1000);
}

/* ==========================================
   5. TIME-BASED GREETING
   ========================================== */
function initDynamicGreeting() {
  const greetingEl = document.getElementById('dynamic-greeting');
  if (!greetingEl) return;

  const hour = new Date().getHours();
  let greetingMsg = "Hello";

  if (hour >= 5 && hour < 12) {
    greetingMsg = "Good morning ☀️";
  } else if (hour >= 12 && hour < 17) {
    greetingMsg = "Good afternoon 🌤️";
  } else if (hour >= 17 && hour < 22) {
    greetingMsg = "Good evening 🌆";
  } else {
    greetingMsg = "Hey there 🌙";
  }

  greetingEl.textContent = greetingMsg;
}

/* ==========================================
   6. NAVBAR DESIGN & SCROLL TRIGGERS
   ========================================== */
function initNavbarScroll() {
  const header = document.querySelector('header');
  const scrollProgressBar = document.querySelector('.scroll-progress-bar');
  const backToTopBtn = document.querySelector('.back-to-top');
  
  let lastScrollTop = 0;
  const threshold = 50;

  window.addEventListener('scroll', () => {
    const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
    
    // Header hide on scroll down / show on scroll up
    if (header) {
      if (scrollTop > lastScrollTop && scrollTop > threshold) {
        header.classList.add('nav-hidden');
      } else {
        header.classList.remove('nav-hidden');
      }
      
      // Backdrop-blur background opacity on scroll
      if (scrollTop > 10) {
        header.classList.add('scrolled');
      } else {
        header.classList.remove('scrolled');
      }
    }

    lastScrollTop = scrollTop <= 0 ? 0 : scrollTop;

    // Scroll Progress Bar
    if (scrollProgressBar) {
      const docHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
      const scrollPercent = (scrollTop / docHeight) * 100;
      scrollProgressBar.style.width = `${scrollPercent}%`;
    }

    // Back to top floating button
    if (backToTopBtn) {
      if (scrollTop > 500) {
        backToTopBtn.classList.add('show');
      } else {
        backToTopBtn.classList.remove('show');
      }
    }
  });

  // Mobile menu toggle
  const hamburger = document.querySelector('.hamburger');
  const navMenu = document.querySelector('nav');
  const navLinks = document.querySelectorAll('nav a');

  if (hamburger && navMenu) {
    hamburger.addEventListener('click', () => {
      hamburger.classList.toggle('active');
      navMenu.classList.toggle('active');
    });

    navLinks.forEach(link => {
      link.addEventListener('click', () => {
        hamburger.classList.remove('active');
        navMenu.classList.remove('active');
      });
    });
  }

  // Scroll to top click event
  if (backToTopBtn) {
    backToTopBtn.addEventListener('click', () => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }
}

/* ==========================================
   7. MOUSE SPOTLIGHT EFFECT
   ========================================== */
function initSpotlightEffect() {
  const cards = document.querySelectorAll('.spotlight-card');
  
  cards.forEach(card => {
    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      
      card.style.setProperty('--mouse-x', `${x}px`);
      card.style.setProperty('--mouse-y', `${y}px`);
    });
  });
}

/* ==========================================
   8. 3D TILT EFFECT
   ========================================== */
function initTiltCards() {
  const tiltCards = document.querySelectorAll('.tilt-card');
  
  tiltCards.forEach(card => {
    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      
      // Relative values from center of card (-0.5 to 0.5)
      const xPercent = (x / rect.width) - 0.5;
      const yPercent = (y / rect.height) - 0.5;
      
      // Calculate angles (max 15 degrees)
      const rotateX = -yPercent * 20;
      const rotateY = xPercent * 20;
      
      card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.02, 1.02, 1.02)`;
    });
    
    card.addEventListener('mouseleave', () => {
      card.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)';
    });
  });
}

/* ==========================================
   9. COUNTER ANIMATION UPON SCROLL
   ========================================== */
function initCounterAnimations() {
  const counters = document.querySelectorAll('.counter-number');
  
  const animateCounter = (counter) => {
    const target = +counter.getAttribute('data-target');
    const duration = 2000; // Total count duration (2s)
    const stepTime = 20;   // Interval between increments
    const totalSteps = duration / stepTime;
    const increment = target / totalSteps;
    
    let count = 0;
    const timer = setInterval(() => {
      count += increment;
      if (count >= target) {
        counter.textContent = target;
        clearInterval(timer);
      } else {
        counter.textContent = Math.floor(count);
      }
    }, stepTime);
  };

  const observer = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        animateCounter(entry.target);
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.5 });

  counters.forEach(counter => observer.observe(counter));
}

/* ==========================================
   10. PROJECTS FILTER ENGINE
   ========================================== */
function initProjectFilters() {
  const filterBtns = document.querySelectorAll('.filter-btn');
  const projectCards = document.querySelectorAll('.project-card');

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      // Toggle active classes
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const filterValue = btn.getAttribute('data-filter');

      projectCards.forEach(card => {
        const category = card.getAttribute('data-category');
        
        // Hide card first to animate transition
        card.style.opacity = '0';
        card.style.transform = 'scale(0.8) translateY(20px)';
        
        setTimeout(() => {
          if (filterValue === 'all' || category === filterValue) {
            card.style.display = 'block';
            setTimeout(() => {
              card.style.opacity = '1';
              card.style.transform = 'scale(1) translateY(0)';
            }, 50);
          } else {
            card.style.display = 'none';
          }
        }, 300);
      });
    });
  });
}

/* ==========================================
   11. CERTIFICATES FULLSCREEN MODAL
   ========================================== */
function initCertificateModal() {
  const modal = document.getElementById('certificateModal');
  const modalImg = document.getElementById('modalImage');
  const closeBtn = document.querySelector('.modal .close');
  
  window.openModal = function(imageSrc) {
    if (!modal || !modalImg) return;
    
    modalImg.src = imageSrc;
    modal.classList.remove('hide');
    modal.classList.add('show');
    document.body.classList.add('no-scroll');
  };

  window.closeModal = function() {
    if (!modal) return;
    
    modal.classList.add('hide');
    modal.classList.remove('show');
    document.body.classList.remove('no-scroll');
  };

  if (closeBtn) {
    closeBtn.addEventListener('click', closeModal);
  }

  if (modal) {
    modal.addEventListener('click', (e) => {
      if (e.target === modal) {
        closeModal();
      }
    });
  }
}

// Testimonials carousel logic removed

/* ==========================================
   13. CONTACT FORM & CONFETTI ENGINE
   ========================================== */
function initContactForm() {
  const form = document.getElementById('contactForm');
  if (!form) return;

  form.addEventListener('submit', (e) => {
    e.preventDefault();

    const submitBtn = form.querySelector('.submit-btn');
    const originalText = submitBtn.innerHTML;
    
    // Simulate Loading State
    submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Sending...';
    submitBtn.style.pointerEvents = 'none';

    setTimeout(() => {
      submitBtn.innerHTML = '<i class="fas fa-check"></i> Sent Successfully!';
      submitBtn.style.background = 'linear-gradient(135deg, #11998e, #38ef7d)';
      
      // Toast notification
      showToast('Thank you! Message sent successfully. 🚀');
      
      // Fire confetti blast
      fireConfetti();
      
      // Reset Form after delay
      setTimeout(() => {
        form.reset();
        submitBtn.innerHTML = originalText;
        submitBtn.style.pointerEvents = 'all';
        submitBtn.style.background = '';
      }, 3000);

    }, 1500);
  });
}

// Lightweight HTML5 Canvas Confetti Engine
function fireConfetti() {
  const canvas = document.createElement('canvas');
  canvas.id = 'confetti-canvas';
  canvas.style.position = 'fixed';
  canvas.style.top = '0';
  canvas.style.left = '0';
  canvas.style.width = '100vw';
  canvas.style.height = '100vh';
  canvas.style.zIndex = '9999';
  canvas.style.pointerEvents = 'none';
  document.body.appendChild(canvas);

  const ctx = canvas.getContext('2d');
  let width = canvas.width = window.innerWidth;
  let height = canvas.height = window.innerHeight;

  window.addEventListener('resize', () => {
    width = canvas.width = window.innerWidth;
    height = canvas.height = window.innerHeight;
  });

  const colors = ['#f44336', '#e91e63', '#9c27b0', '#673ab7', '#3f51b5', '#2196f3', '#03a9f4', '#00bcd4', '#009688', '#4caf50', '#8bc34a', '#cddc39', '#ffeb3b', '#ffc107', '#ff9800', '#ff5722', '#00ffe7', '#ff0080'];
  const particles = [];

  class ConfettiParticle {
    constructor() {
      this.x = Math.random() * width;
      this.y = Math.random() * height - height; // Start off screen
      this.r = Math.random() * 6 + 4;
      this.d = Math.random() * height;
      this.color = colors[Math.floor(Math.random() * colors.length)];
      this.tilt = Math.random() * 10 - 5;
      this.tiltAngleIncremental = Math.random() * 0.07 + 0.02;
      this.tiltAngle = 0;
    }
    
    update() {
      this.tiltAngle += this.tiltAngleIncremental;
      this.y += (Math.cos(this.d) + 3 + this.r / 2) / 2;
      this.x += Math.sin(this.tiltAngle);
      this.tilt = Math.sin(this.tiltAngle - this.r / 2) * 10;
    }
  }

  // Spawn 150 particles
  for (let i = 0; i < 150; i++) {
    particles.push(new ConfettiParticle());
  }

  let animationFrame;
  function draw() {
    ctx.clearRect(0, 0, width, height);

    let remainingParticles = 0;
    particles.forEach(p => {
      p.update();
      if (p.y < height) {
        remainingParticles++;
      }

      ctx.beginPath();
      ctx.lineWidth = p.r;
      ctx.strokeStyle = p.color;
      ctx.moveTo(p.x + p.tilt + p.r / 2, p.y);
      ctx.lineTo(p.x + p.tilt, p.y + p.tilt + p.r / 2);
      ctx.stroke();
    });

    if (remainingParticles > 0) {
      animationFrame = requestAnimationFrame(draw);
    } else {
      cancelAnimationFrame(animationFrame);
      canvas.remove();
    }
  }

  draw();
}

/* ==========================================
   14. SCROLL REVEAL (INTERSECTION OBSERVER)
   ========================================== */
function initScrollReveal() {
  const sections = document.querySelectorAll('section');
  const revealElements = document.querySelectorAll('.reveal');

  const revealOnScroll = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('active-reveal');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.15 });

  sections.forEach(sec => revealOnScroll.observe(sec));
  revealElements.forEach(el => revealOnScroll.observe(el));
  
  // Highlight navigation link relative to active scroll section
  const navLinks = document.querySelectorAll('nav a');
  const activeSectionObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const id = entry.target.getAttribute('id');
        navLinks.forEach(link => {
          const href = link.getAttribute('href').replace('#', '');
          if (href === id) {
            link.classList.add('active');
          } else {
            link.classList.remove('active');
          }
        });
      }
    });
  }, { threshold: 0.5 });

  sections.forEach(sec => {
    if (sec.getAttribute('id')) {
      activeSectionObserver.observe(sec);
    }
  });
}

/* ==========================================
   15. EMAIL COPY & TOAST NOTIFICATION UTILITY
   ========================================= */
function initEmailCopy() {
  const copyBtn = document.querySelector('.email-copy-btn');
  if (!copyBtn) return;

  copyBtn.addEventListener('click', () => {
    const emailText = copyBtn.getAttribute('data-email') || 'kalaiarasane08@gmail.com';
    
    navigator.clipboard.writeText(emailText).then(() => {
      showToast('Email address copied to clipboard! 📋');
    }).catch(err => {
      console.error('Could not copy email: ', err);
    });
  });
}

// Toast System
function showToast(message) {
  // Check if container exists, else create it
  let container = document.querySelector('.toast-container');
  if (!container) {
    container = document.createElement('div');
    container.className = 'toast-container';
    document.body.appendChild(container);
  }

  const toast = document.createElement('div');
  toast.className = 'toast-notification';
  toast.innerHTML = `<span>${message}</span>`;
  container.appendChild(toast);

  // Trigger animations
  setTimeout(() => {
    toast.classList.add('show');
  }, 50);

  // Hide and remove
  setTimeout(() => {
    toast.classList.remove('show');
    toast.classList.add('hide');
    toast.addEventListener('transitionend', () => {
      toast.remove();
    });
  }, 3000);
}
