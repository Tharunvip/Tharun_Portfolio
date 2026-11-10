/* ==========================================================================
   Rajendran Tharun Kumar - Interactive JavaScript Engine
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
  initBackgroundCanvas();
  initTypewriter();
  initNavbar();
  initProjectFilters();
  initEstimator();
  initYear();
});

/* --------------------------------------------------------------------------
   1. Interactive Particle Canvas Background
   -------------------------------------------------------------------------- */
function initBackgroundCanvas() {
  const canvas = document.getElementById('bg-canvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');

  let width, height;
  let particles = [];
  const particleCount = 45;
  const mouse = { x: null, y: null, radius: 150 };

  function resize() {
    width = canvas.width = window.innerWidth;
    height = canvas.height = window.innerHeight;
  }

  window.addEventListener('resize', resize);
  resize();

  window.addEventListener('mousemove', (e) => {
    mouse.x = e.clientX;
    mouse.y = e.clientY;
  });

  window.addEventListener('mouseleave', () => {
    mouse.x = null;
    mouse.y = null;
  });

  class Particle {
    constructor() {
      this.x = Math.random() * width;
      this.y = Math.random() * height;
      this.vx = (Math.random() - 0.5) * 0.8;
      this.vy = (Math.random() - 0.5) * 0.8;
      this.radius = Math.random() * 2 + 1;
      this.color = Math.random() > 0.5 ? 'rgba(0, 242, 254, ' : 'rgba(157, 78, 221, ';
      this.alpha = Math.random() * 0.5 + 0.2;
    }

    update() {
      this.x += this.vx;
      this.y += this.vy;

      if (this.x < 0 || this.x > width) this.vx *= -1;
      if (this.y < 0 || this.y > height) this.vy *= -1;

      // Mouse attraction / bounce
      if (mouse.x && mouse.y) {
        const dx = mouse.x - this.x;
        const dy = mouse.y - this.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < mouse.radius) {
          const angle = Math.atan2(dy, dx);
          this.x -= Math.cos(angle) * 1.5;
          this.y -= Math.sin(angle) * 1.5;
        }
      }
    }

    draw() {
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
      ctx.fillStyle = this.color + this.alpha + ')';
      ctx.shadowBlur = 10;
      ctx.shadowColor = 'rgba(0, 242, 254, 0.5)';
      ctx.fill();
    }
  }

  for (let i = 0; i < particleCount; i++) {
    particles.push(new Particle());
  }

  function animate() {
    ctx.clearRect(0, 0, width, height);

    for (let i = 0; i < particles.length; i++) {
      particles[i].update();
      particles[i].draw();

      for (let j = i + 1; j < particles.length; j++) {
        const dx = particles[i].x - particles[j].x;
        const dy = particles[i].y - particles[j].y;
        const dist = Math.sqrt(dx * dx + dy * dy);

        if (dist < 140) {
          ctx.beginPath();
          ctx.moveTo(particles[i].x, particles[i].y);
          ctx.lineTo(particles[j].x, particles[j].y);
          ctx.strokeStyle = `rgba(0, 242, 254, ${0.15 * (1 - dist / 140)})`;
          ctx.lineWidth = 0.8;
          ctx.stroke();
        }
      }
    }

    requestAnimationFrame(animate);
  }

  animate();
}

/* --------------------------------------------------------------------------
   2. Typewriter Effect
   -------------------------------------------------------------------------- */
function initTypewriter() {
  const el = document.getElementById('typewriter');
  if (!el) return;

  const roles = [
    'Full-Stack Developer',
    'Mobile & Web App Specialist',
    'AI / Computer Vision Developer',
    'Firebase Cloud Architect',
    'Freelance Product Engineer'
  ];

  let roleIndex = 0;
  let charIndex = 0;
  let isDeleting = false;
  let typeSpeed = 90;

  function type() {
    const currentRole = roles[roleIndex];

    if (isDeleting) {
      el.textContent = currentRole.substring(0, charIndex - 1);
      charIndex--;
      typeSpeed = 40;
    } else {
      el.textContent = currentRole.substring(0, charIndex + 1);
      charIndex++;
      typeSpeed = 90;
    }

    if (!isDeleting && charIndex === currentRole.length) {
      typeSpeed = 2200; // Pause at end of word
      isDeleting = true;
    } else if (isDeleting && charIndex === 0) {
      isDeleting = false;
      roleIndex = (roleIndex + 1) % roles.length;
      typeSpeed = 400;
    }

    setTimeout(type, typeSpeed);
  }

  type();
}

/* --------------------------------------------------------------------------
   3. Navigation & Scroll Effects
   -------------------------------------------------------------------------- */
function initNavbar() {
  const navbar = document.getElementById('navbar');
  const navToggle = document.getElementById('nav-toggle');
  const navLinks = document.getElementById('nav-links');
  const links = navLinks ? navLinks.querySelectorAll('a') : [];

  const overlay = document.getElementById('nav-overlay');
  const closeBtn = document.getElementById('nav-menu-close');
  const toggleIcon = navToggle ? navToggle.querySelector('i') : null;

  const setToggleIcon = (open) => {
    if (toggleIcon) toggleIcon.className = open ? 'fa-solid fa-xmark' : 'fa-solid fa-bars';
  };

  const isMenuOpen = () => navLinks && navLinks.classList.contains('active');

  const openMenu = () => {
    if (!isMenuOpen()) {
      if (navLinks) navLinks.classList.add('active');
      if (overlay) overlay.classList.add('active');
      document.body.classList.add('menu-open');
      setToggleIcon(true);
    }
  };

  const closeMenu = () => {
    if (isMenuOpen()) {
      if (navLinks) navLinks.classList.remove('active');
      if (overlay) overlay.classList.remove('active');
      document.body.classList.remove('menu-open');
      setToggleIcon(false);
    }
  };

  window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }

    // Scroll spy active link update
    const sections = document.querySelectorAll('section, header');
    let current = '';

    sections.forEach(section => {
      const sectionTop = section.offsetTop - 120;
      if (window.scrollY >= sectionTop) {
        current = section.getAttribute('id');
      }
    });

    links.forEach(link => {
      link.classList.remove('active');
      if (link.getAttribute('href') === `#${current}`) {
        link.classList.add('active');
      }
    });
  });

  // Smooth scroll for all internal anchor links with navbar offset
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
      const targetId = this.getAttribute('href');
      if (targetId === '#' || !targetId) return;

      const targetElement = document.querySelector(targetId);
      if (targetElement) {
        e.preventDefault();
        const navHeight = navbar ? navbar.offsetHeight : 80;
        const targetPosition = targetElement.getBoundingClientRect().top + window.pageYOffset - navHeight - 15;

        window.scrollTo({
          top: targetPosition,
          behavior: 'smooth'
        });

        closeMenu();
      }
    });
  });

  if (navToggle) {
    navToggle.addEventListener('click', () => {
      if (isMenuOpen()) {
        closeMenu();
      } else {
        openMenu();
      }
    });
  }
  if (overlay) overlay.addEventListener('click', closeMenu);
  if (closeBtn) closeBtn.addEventListener('click', closeMenu);
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') closeMenu();
  });

  window.addEventListener('resize', () => {
    if (window.innerWidth > 768) {
      closeMenu();
    }
  });
}

/* --------------------------------------------------------------------------
   4. Project Filtering
   -------------------------------------------------------------------------- */
function initProjectFilters() {
  const filterBtns = document.querySelectorAll('.filter-btn');
  const projectCards = document.querySelectorAll('.project-card');

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const filter = btn.getAttribute('data-filter');

      projectCards.forEach(card => {
        const category = card.getAttribute('data-category');
        if (filter === 'all' || filter === category) {
          card.style.display = 'flex';
          setTimeout(() => {
            card.style.opacity = '1';
            card.style.transform = 'translateY(0)';
          }, 50);
        } else {
          card.style.opacity = '0';
          card.style.transform = 'translateY(20px)';
          setTimeout(() => {
            card.style.display = 'none';
          }, 300);
        }
      });
    });
  });
}

/* --------------------------------------------------------------------------
   5. Deep-Dive Project Case Study Modals
   -------------------------------------------------------------------------- */
const projectData = {
  salonhub: {
    title: "💈 SalonHub — Salon Booking Platform",
    tagline: "Salon booking and queue management for customers, salon owners, and services.",
    overview: "SalonHub helps customers book salon appointments while giving salon owners tools to manage bookings, customers, services, and queues.",
    roles: [
      {
        title: "Customer Role",
        items: [
          "Search & locate nearby salons",
          "View detailed service menus & pricing",
          "Book appointment time slots",
          "Real-time token & queue tracking",
          "Estimated waiting time updates",
          "Instant push notifications & status alerts"
        ]
      },
      {
        title: "Salon Owner Role",
        items: [
          "Manage salon profile & photo gallery",
          "Add/Edit services & dynamic prices",
          "Upload service portfolio via Cloudinary",
          "Manage active customer queue & chair status",
          "Track daily revenue & booking history"
        ]
      },
      {
        title: "Platform Admin Role",
        items: [
          "Platform & partner onboard management",
          "Customer support & feedback dashboard",
          "Access control & security management"
        ]
      }
    ],
    tech: ["Flutter (Android/iOS)", "Firebase Auth", "Cloud Firestore", "Firebase Cloud Messaging (FCM)", "Cloudinary", "Geolocator Services"]
  },
  tradelab: {
    title: "🎨 TradeLab — Interactive Chart Workspace",
    tagline: "Browser-based trading annotation & chart drawing workspace for technical analysis.",
    overview: "Inspired by creative desktop applications, TradeLab provides traders with an unconstrained canvas workspace to annotate market charts, save drawing sets in organized folders, and export trade setups.",
    roles: [
      {
        title: "Key Features & Tools",
        items: [
          "Multi-tool drawing engine (lines, shapes, trend paths)",
          "Text marking & risk-reward ratio labels",
          "File & folder workspace directory state",
          "High performance responsive HTML5 canvas",
          "Mobile touch-friendly responsive interface",
          "Deployment ready on GitHub Pages"
        ]
      }
    ],
    tech: ["HTML5 Canvas API", "JavaScript ES6+", "CSS3 Grid/Flex", "Local Storage", "GitHub Pages"]
  },
  aiassistant: {
    title: "👁️ AI Object Detection & Voice Navigation Assistant",
    tagline: "Assistive computer vision system guiding visually impaired users with real-time audio guidance.",
    overview: "An AI-powered computer vision project combining YOLOv8 spatial object detection with offline Vosk voice recognition to navigate physical environments safely.",
    roles: [
      {
        title: "AI & Computer Vision Core",
        items: [
          "YOLOv8 real-time object detection engine",
          "Spatial region partitioning (Left, Center, Right, Distance)",
          "Vosk offline voice command processing",
          "pyttsx3 audio guidance in natural tone",
          "Multi-language voice output feedback",
          "One-touch emergency SOS location alert"
        ]
      }
    ],
    tech: ["Python 3.10", "YOLOv8", "OpenCV", "Vosk Speech Recognition", "pyttsx3", "Geocoding & Twilio SOS API"]
  },
  latemgmt: {
    title: "🎓 Student Late Management System",
    tagline: "Web portal handling attendance tracking, fine calculation, and institutional reports.",
    overview: "A full-stack administrative platform for educational institutions to monitor student late arrivals, automatically calculate fines, notify parents, and visualize trends.",
    roles: [
      {
        title: "Portal Roles & Features",
        items: [
          "Student login & attendance history view",
          "Faculty logging interface & late entry forms",
          "HOD administrative overview & fine approvals",
          "Automated fine calculation algorithm",
          "PHPMailer automated parent notifications",
          "Chart.js interactive analytics & monthly reports"
        ]
      }
    ],
    tech: ["PHP 8", "MySQL Relational DB", "PHPMailer", "Chart.js", "Bootstrap 5", "HTML5/CSS3"]
  },
  venkateswara: {
    title: "🛕 Sri Venkateswara Temple — Temple Website",
    tagline: "A premium temple website for darshan, sevas, accommodation, donations, festivals, and pilgrim information.",
    overview: "An immersive temple website inspired by Sri Venkateswara Swamy, bringing temple information and essential pilgrim services together in a responsive digital experience.",
    roles: [
      {
        title: "Temple Information",
        items: [
          "Temple history and information",
          "Festival information and gallery",
          "Pilgrim travel and visit details",
          "Responsive mobile, tablet, and desktop layout"
        ]
      },
      {
        title: "Pilgrim Services",
        items: [
          "Darshan information",
          "Sevas and accommodation",
          "Donations and pilgrim information"
        ]
      }
    ],
    tech: ["HTML5", "CSS3", "JavaScript", "Responsive Design"]
  },
  vipsparking: {
    title: "🅿️ VIPsParking — Smart Parking Management System",
    tagline: "Vehicle entry, checkout, and parking charge management for parking shop owners.",
    overview: "VIPsParking helps parking shop owners manage vehicles, calculate parking durations and fees, and track offline payment status, with admin verification and a separate web dashboard.",
    roles: [
      {
        title: "Parking Shop Owner",
        items: [
          "Owner registration and login with admin verification and approval",
          "Vehicle entry management for multiple vehicle types",
          "Record the last four digits of each vehicle registration number",
          "Automatically capture parking entry date and time",
          "Check out vehicles and calculate parking duration and fee",
          "Configure hourly and daily parking rates",
          "Manage payment status for offline payments"
        ]
      },
      {
        title: "Administration",
        items: [
          "Separate admin web dashboard",
          "Review and approve parking shop owners"
        ]
      }
    ],
    tech: ["Flutter", "Dart", "Supabase", "React.js", "JavaScript"]
  }
};

function openProjectModal(key) {
  const modal = document.getElementById('project-modal');
  const body = document.getElementById('modal-body');
  const data = projectData[key];

  if (!modal || !body || !data) return;

  let rolesHtml = '';
  data.roles.forEach(role => {
    let listItems = role.items.map(item => `<li>${item}</li>`).join('');
    rolesHtml += `
      <div class="role-box">
        <h4><i class="fa-solid fa-circle-check"></i> ${role.title}</h4>
        <ul>${listItems}</ul>
      </div>
    `;
  });

  let techTags = data.tech.map(t => `<span class="tech-tag" style="border-color: var(--neon-cyan); color: var(--neon-cyan);">${t}</span>`).join(' ');

  body.innerHTML = `
    <div class="modal-header">
      <div class="section-tag" style="margin-bottom: 10px;">Case Study Breakdown</div>
      <h2 class="modal-title">${data.title}</h2>
      <p style="color: var(--neon-cyan); font-weight: 500; font-size: 1rem;">${data.tagline}</p>
    </div>

    <p style="color: var(--text-secondary); line-height: 1.7; margin-bottom: 24px;">${data.overview}</p>

    <h3 style="font-size: 1.2rem; margin-bottom: 16px;">Platform Architecture & Roles</h3>
    <div class="modal-roles-grid">
      ${rolesHtml}
    </div>

    <h3 style="font-size: 1.1rem; margin-top: 24px; margin-bottom: 12px;">Technologies Used:</h3>
    <div class="tech-tags" style="margin-bottom: 24px;">
      ${techTags}
    </div>

    <div style="display: flex; gap: 16px; margin-top: 30px;">
      <a href="#estimator" class="btn btn-primary" onclick="closeProjectModal(); preselectService('${data.title.includes('Flutter') ? 'Mobile App Development' : 'Full-Stack Development'}');">
        <i class="fa-solid fa-rocket"></i> Build Similar Product
      </a>
      <button class="btn btn-secondary" onclick="closeProjectModal()">Close Modal</button>
    </div>
  `;

  modal.classList.add('active');
  document.body.style.overflow = 'hidden';
}

function closeProjectModal() {
  const modal = document.getElementById('project-modal');
  if (modal) {
    modal.classList.remove('active');
    document.body.style.overflow = 'auto';
  }
}

// Close modal when clicking background overlay
window.addEventListener('click', (e) => {
  const modal = document.getElementById('project-modal');
  if (e.target === modal) {
    closeProjectModal();
  }
});

/* --------------------------------------------------------------------------
   6. Interactive Project Estimator Tool
   -------------------------------------------------------------------------- */
let selectedService = "Website Development";
let selectedTimeline = "5 - 7 Days";
let selectedFeatures = ["User Authentication & Roles", "Firebase Real-Time DB"];

function initEstimator() {
  const typePills = document.querySelectorAll('#type-options .option-pill');
  const featurePills = document.querySelectorAll('#feature-options .option-pill');

  typePills.forEach(pill => {
    pill.addEventListener('click', () => {
      typePills.forEach(p => p.classList.remove('selected'));
      pill.classList.add('selected');

      selectedService = pill.getAttribute('data-value');
      selectedTimeline = pill.getAttribute('data-days') + ' Days';
      updateEstimatorSummary();
    });
  });

  featurePills.forEach(pill => {
    pill.addEventListener('click', () => {
      pill.classList.toggle('selected');

      selectedFeatures = [];
      document.querySelectorAll('#feature-options .option-pill.selected').forEach(p => {
        selectedFeatures.push(p.getAttribute('data-value'));
      });

      updateEstimatorSummary();
    });
  });

  updateEstimatorSummary();
}

function updateEstimatorSummary() {
  const titleEl = document.getElementById('est-service-title');
  const timeEl = document.getElementById('est-timeline');
  const listEl = document.getElementById('est-features-list');

  if (titleEl) titleEl.textContent = selectedService;
  if (timeEl) timeEl.textContent = selectedTimeline;
  if (listEl) {
    listEl.textContent = selectedFeatures.length > 0
      ? selectedFeatures.join(', ')
      : "Standard Clean Architecture & UI";
  }
}

function preselectService(serviceName) {
  const typePills = document.querySelectorAll('#type-options .option-pill');
  typePills.forEach(pill => {
    if (pill.getAttribute('data-value').toLowerCase().includes(serviceName.toLowerCase()) ||
        serviceName.toLowerCase().includes(pill.getAttribute('data-value').toLowerCase())) {
      pill.click();
    }
  });
}

function sendEstimatorWhatsApp() {
  const text = `Hi Rajendran Tharun Kumar! I configured a project scope on your portfolio website:
- Service Needed: ${selectedService}
- Target Timeline: ${selectedTimeline}
- Features/Modules: ${selectedFeatures.join(', ')}

I would like to discuss building this product with you!`;

  const url = `https://wa.me/918977859992?text=${encodeURIComponent(text)}`;
  window.open(url, '_blank');
}

function sendEstimatorEmail() {
  const subject = `Project Inquiry: ${selectedService}`;
  const body = `Hi Rajendran Tharun Kumar,

I would like to request a proposal for a project:
- Service Needed: ${selectedService}
- Timeline Scope: ${selectedTimeline}
- Key Features Needed: ${selectedFeatures.join(', ')}

Please let me know your availability for a quick discussion.`;

  const mailtoUrl = `mailto:tharunvip65@gmail.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
  window.location.href = mailtoUrl;
}

/* --------------------------------------------------------------------------
   7. Form Handling & Helper Utilities
   -------------------------------------------------------------------------- */
function handleFormSubmit(e) {
  e.preventDefault();
  const name = document.getElementById('name').value;
  const email = document.getElementById('email').value;
  const projectType = document.getElementById('project-type').value;
  const message = document.getElementById('message').value;

  const text = `Hi Rajendran Tharun Kumar! My name is ${name} (${email}).
Project Focus: ${projectType}
Details: ${message}`;

  const url = `https://wa.me/918977859992?text=${encodeURIComponent(text)}`;
  window.open(url, '_blank');
}

function initYear() {
  const yearEl = document.getElementById('year');
  if (yearEl) yearEl.textContent = new Date().getFullYear();
}
