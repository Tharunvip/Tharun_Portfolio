const body = document.body;
const header = document.getElementById("siteHeader");
const intro = document.getElementById("intro");
const skipIntro = document.getElementById("skipIntro");
const menuToggle = document.getElementById("menuToggle");
const navMenu = document.getElementById("navMenu");
const parallax = document.querySelector("[data-parallax]");
const zoomImage = document.querySelector("[data-zoom]");
const lightbox = document.getElementById("lightbox");
const lightboxImage = lightbox.querySelector("img");
const closeLightbox = document.getElementById("closeLightbox");
const prevImage = document.getElementById("prevImage");
const nextImage = document.getElementById("nextImage");
const scrollProgress = document.getElementById("scrollProgress");
const toTop = document.getElementById("toTop");
const cursorGlow = document.getElementById("cursorGlow");
const detailModal = document.getElementById("detailModal");
const modalEyebrow = document.getElementById("modalEyebrow");
const modalTitle = document.getElementById("modalTitle");
const modalBody = document.getElementById("modalBody");
const modalActions = document.getElementById("modalActions");
const closeModalBtn = document.getElementById("closeModal");
const loginModal = document.getElementById("loginModal");
const closeLogin = document.getElementById("closeLogin");
const loginForm = document.getElementById("loginForm");
const toast = document.getElementById("toast");

const reduceMotion = () => window.matchMedia("(prefers-reduced-motion: reduce)").matches;

body.classList.add("intro-active");

const finishIntro = () => {
  intro.classList.add("is-hidden");
  intro.setAttribute("aria-hidden", "true");
  body.classList.remove("intro-active");
};

const introTimer = window.setTimeout(finishIntro, 2600);

skipIntro.addEventListener("click", () => {
  window.clearTimeout(introTimer);
  finishIntro();
});

const updateHeader = () => {
  header.classList.toggle("is-scrolled", window.scrollY > 16);
};

const updateMotion = () => {
  const y = window.scrollY;
  if (parallax) {
    parallax.style.transform = `translateY(${y * 0.08}px) scale(1.08)`;
  }
  if (zoomImage) {
    const rect = zoomImage.parentElement.getBoundingClientRect();
    const progress = Math.min(1, Math.max(0, (window.innerHeight - rect.top) / (window.innerHeight + rect.height)));
    zoomImage.style.transform = `scale(${1.06 + progress * 0.08})`;
  }
};

const updateScrollUI = () => {
  const doc = document.documentElement;
  const max = doc.scrollHeight - window.innerHeight;
  const ratio = max > 0 ? window.scrollY / max : 0;
  scrollProgress.style.width = `${Math.min(100, ratio * 100)}%`;
  toTop.classList.toggle("is-visible", window.scrollY > window.innerHeight * 0.6);
  updateActiveNav();
};

const navLinks = [...navMenu.querySelectorAll('a[href^="#"]')];
const updateActiveNav = () => {
  const offset = window.scrollY + 140;
  let current = "";
  document.querySelectorAll("main section[id]").forEach((section) => {
    if (section.offsetTop <= offset) {
      current = section.id;
    }
  });
  navLinks.forEach((link) => {
    link.classList.toggle("is-active", link.getAttribute("href") === `#${current}`);
  });
};

window.addEventListener("scroll", () => {
  updateHeader();
  updateScrollUI();
  if (!reduceMotion()) {
    updateMotion();
  }
});

toTop.addEventListener("click", () => {
  window.scrollTo({ top: 0, behavior: reduceMotion() ? "auto" : "smooth" });
});

menuToggle.addEventListener("click", () => {
  const isOpen = navMenu.classList.toggle("is-open");
  body.classList.toggle("menu-open", isOpen);
  menuToggle.setAttribute("aria-expanded", String(isOpen));
});

navMenu.querySelectorAll("a").forEach((link) => {
  link.addEventListener("click", () => {
    navMenu.classList.remove("is-open");
    body.classList.remove("menu-open");
    menuToggle.setAttribute("aria-expanded", "false");
  });
});

const observer = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("is-visible");
        observer.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.16 }
);

document.querySelectorAll(".reveal").forEach((element) => observer.observe(element));

document.querySelectorAll(".reveal").forEach((element) => {
  const siblings = [...(element.parentElement?.children || [])].filter((node) => node.classList.contains("reveal"));
  const index = siblings.indexOf(element);
  if (index > 0) {
    element.style.transitionDelay = `${Math.min(index * 90, 360)}ms`;
  }
});

/* Gallery lightbox */
const galleryButtons = [...document.querySelectorAll("#gallery button")];
let galleryIndex = 0;

const openGallery = (index) => {
  galleryIndex = (index + galleryButtons.length) % galleryButtons.length;
  const button = galleryButtons[galleryIndex];
  lightboxImage.src = button.dataset.full;
  lightboxImage.alt = button.querySelector("img").alt;
  lightbox.classList.add("is-open");
  lightbox.setAttribute("aria-hidden", "false");
};

galleryButtons.forEach((button, index) => {
  button.addEventListener("click", () => openGallery(index));
});

const closeGallery = () => {
  lightbox.classList.remove("is-open");
  lightbox.setAttribute("aria-hidden", "true");
  lightboxImage.removeAttribute("src");
};

closeLightbox.addEventListener("click", closeGallery);
prevImage.addEventListener("click", () => openGallery(galleryIndex - 1));
nextImage.addEventListener("click", () => openGallery(galleryIndex + 1));
lightbox.addEventListener("click", (event) => {
  if (event.target === lightbox) {
    closeGallery();
  }
});

window.addEventListener("keydown", (event) => {
  const galleryOpen = lightbox.classList.contains("is-open");
  if (galleryOpen && event.key === "Escape") {
    closeGallery();
  }
  if (galleryOpen && event.key === "ArrowLeft") {
    openGallery(galleryIndex - 1);
  }
  if (galleryOpen && event.key === "ArrowRight") {
    openGallery(galleryIndex + 1);
  }
  if (event.key === "Escape") {
    closeModal();
    closeLoginModal();
  }
});

/* Toast notifications */
let toastTimer;
const showToast = (message) => {
  toast.textContent = message;
  toast.classList.add("is-visible");
  window.clearTimeout(toastTimer);
  toastTimer = window.setTimeout(() => toast.classList.remove("is-visible"), 2600);
};

/* Detail modal content */
const detailContent = {
  "Regular Darshan": {
    eyebrow: "Darshan",
    body: "<p>A calm, traditional visit through the main pilgrim route of the temple.</p><ul><li><strong>Timings:</strong> Morning 06:00 – 13:00, Evening 15:00 – 22:00</li><li><strong>Duration:</strong> Approx. 60–90 minutes</li><li><strong>Includes:</strong> Main sanctum view and prasadam counter</li></ul>",
    action: "Book Regular Darshan"
  },
  "Special Entry": {
    eyebrow: "Darshan",
    body: "<p>Guided access for pilgrims with time-sensitive travel plans and limited daily capacity.</p><ul><li><strong>Slots:</strong> Every 30 minutes through the day</li><li><strong>Capacity:</strong> Limited entries per slot</li><li><strong>Includes:</strong> Priority queue and escort assistance</li></ul>",
    action: "Reserve Special Entry"
  },
  "Special Darshan": {
    eyebrow: "Darshan",
    body: "<p>A more intimate ritual window with assisted temple flow on selected auspicious days.</p><ul><li><strong>Availability:</strong> Selected festival and Ekadasi days</li><li><strong>Duration:</strong> Approx. 30 minutes near the sanctum</li><li><strong>Includes:</strong> Guided ritual briefing</li></ul>",
    action: "Request Special Darshan"
  },
  "Suprabhatam Seva": {
    eyebrow: "Sevas",
    body: "<p>Dawn prayers offered as the temple awakens, a serene start to the day.</p><ul><li><strong>Duration:</strong> 45 minutes</li><li><strong>Ideal for:</strong> Early pilgrims seeking quiet devotion</li><li><strong>Includes:</strong> Seva participation and blessing</li></ul>",
    action: "Offer Suprabhatam Seva"
  },
  "Pushpa Archana": {
    eyebrow: "Sevas",
    body: "<p>Flower offerings with sacred recitations, performed with devotion.</p><ul><li><strong>Duration:</strong> 30 minutes</li><li><strong>Includes:</strong> Floral offering and name recitation</li><li><strong>Ideal for:</strong> Families and group offerings</li></ul>",
    action: "Offer Pushpa Archana"
  },
  "Deepa Alankara": {
    eyebrow: "Sevas",
    body: "<p>Evening lamp ceremony across the mandapam, filling the temple with light.</p><ul><li><strong>Duration:</strong> 60 minutes</li><li><strong>Time:</strong> Around sunset</li><li><strong>Includes:</strong> Lamp offering and devotional singing</li></ul>",
    action: "Offer Deepa Alankara"
  },
  "Mandara Suite": {
    eyebrow: "Accommodation",
    body: "<p>Quiet hill-facing suite for families and elders.</p><ul><li><strong>Amenities:</strong> Breakfast, lift access, temple shuttle</li><li><strong>Occupancy:</strong> Up to 3 guests</li><li><strong>Rate:</strong> From ₹4,800 per night</li></ul>",
    action: "Check Availability"
  },
  "Deepam Rooms": {
    eyebrow: "Accommodation",
    body: "<p>Warm, efficient rooms minutes from the eastern gate.</p><ul><li><strong>Amenities:</strong> Wi-Fi, hot water, temple shuttle</li><li><strong>Occupancy:</strong> Up to 2 guests</li><li><strong>Rate:</strong> From ₹2,400 per night</li></ul>",
    action: "Check Availability"
  },
  "Ananta Cottages": {
    eyebrow: "Accommodation",
    body: "<p>Private cottages for longer spiritual retreats.</p><ul><li><strong>Amenities:</strong> Garden, dining, prayer alcove</li><li><strong>Occupancy:</strong> Up to 4 guests</li><li><strong>Rate:</strong> From ₹7,200 per night</li></ul>",
    action: "Check Availability"
  },
  Brahmotsavam: {
    eyebrow: "Festivals",
    body: "<p>Processions, lamps and music across the temple streets during the grand annual utsavam.</p><ul><li><strong>Highlights:</strong> Garuda Seva, Rathotsavam, music ensembles</li><li><strong>Advance booking:</strong> Recommended 30 days prior</li></ul>",
    action: "Set Festival Reminder"
  },
  Deepotsava: {
    eyebrow: "Festivals",
    body: "<p>A night of thousands of lamps and devotional singing across the temple precinct.</p><ul><li><strong>Highlights:</strong> Lamp illumination, bhajans, special darshan</li><li><strong>Advance booking:</strong> Recommended 20 days prior</li></ul>",
    action: "Set Festival Reminder"
  },
  "Vaikunta Ekadasi": {
    eyebrow: "Festivals",
    body: "<p>The auspicious day when the gates of Vaikunta are opened, drawing devotees from across the land.</p><ul><li><strong>Highlights:</strong> Uttara Dwara darshan, special sevas</li><li><strong>Advance booking:</strong> Recommended 45 days prior</li></ul>",
    action: "Set Festival Reminder"
  },
  "How to Reach": {
    eyebrow: "Information",
    body: "<p>Reach Tirumala by air, rail or road with convenient connectivity to Tirupati.</p><ul><li><strong>Air:</strong> Tirupati Airport — 40 min drive</li><li><strong>Rail:</strong> Tirupati Main Station — 25 min drive</li><li><strong>Road:</strong> Ghat road from Tirupati to Tirumala</li></ul>"
  },
  "Temple Timings": {
    eyebrow: "Information",
    body: "<p>Daily darshan and seva timings are subject to change on festival days.</p><ul><li><strong>Morning:</strong> 06:00 – 13:00</li><li><strong>Evening:</strong> 15:00 – 22:00</li><li><strong>Sevas:</strong> Span from dawn to night</li></ul>"
  },
  "Dress Code": {
    eyebrow: "Information",
    body: "<p>Traditional attire is recommended to honour the sanctity of the temple.</p><ul><li><strong>Men:</strong> Dhoti, kurta or formal wear</li><li><strong>Women:</strong> Saree, salwar kameez or formal wear</li><li><strong>Avoid:</strong> Shorts, sleeveless and informal clothing</li></ul>"
  },
  "Rules & Regulations": {
    eyebrow: "Information",
    body: "<p>Please help preserve the sanctity of the shrine.</p><ul><li>Mobile phones are not permitted inside the sanctum areas</li><li>Maintain silence and follow queue discipline</li><li>Photography restrictions apply as directed by staff</li></ul>"
  },
  Parking: {
    eyebrow: "Information",
    body: "<p>Secure parking is available near the temple entrances.</p><ul><li><strong>Locations:</strong> Multi-level parking at Alipiri and main gates</li><li><strong>Charges:</strong> Nominal hourly and daily rates</li><li><strong>Shuttle:</strong> Free buses to the temple complex</li></ul>"
  },
  Accommodation: {
    eyebrow: "Information",
    body: "<p>Stay close to the sacred hill across a range of options.</p><ul><li>Guest suites, rooms and private cottages</li><li>Shuttle access to the temple gates</li><li>Assistance for elders and group pilgrims</li></ul>"
  },
  Transport: {
    eyebrow: "Information",
    body: "<p>Move around the temple town with ease.</p><ul><li>Free temple shuttle buses</li><li>Auto and cab services at the main stand</li><li>Accessible transport on request</li></ul>"
  },
  "Emergency Information": {
    eyebrow: "Information",
    body: "<p>Help is always nearby throughout the temple campus.</p><ul><li>Medical assistance and first aid centres</li><li>Lost-and-found and help desks</li><li>Emergency contact: 108</li></ul>"
  }
};

const renderModalActions = (label) => {
  modalActions.innerHTML = "";
  if (label) {
    const primary = document.createElement("button");
    primary.className = "btn btn--gold";
    primary.textContent = label;
    primary.addEventListener("click", () => {
      closeModal();
      showToast(`${label} — our team will reach out shortly.`);
    });
    modalActions.appendChild(primary);
  }
  const secondary = document.createElement("button");
  secondary.className = "btn btn--ghost";
  secondary.textContent = "Close";
  secondary.addEventListener("click", closeModal);
  modalActions.appendChild(secondary);
};

const openModal = (title) => {
  const content = detailContent[title];
  modalEyebrow.textContent = content?.eyebrow || "Temple Services";
  modalTitle.textContent = title;
  modalBody.innerHTML = content?.body || "<p>Details for this offering are being prepared.</p>";
  renderModalActions(content?.action);
  detailModal.classList.add("is-open");
  detailModal.setAttribute("aria-hidden", "false");
  body.classList.add("menu-open");
};

const closeModal = () => {
  detailModal.classList.remove("is-open");
  detailModal.setAttribute("aria-hidden", "true");
  if (!loginModal.classList.contains("is-open")) {
    body.classList.remove("menu-open");
  }
};

closeModalBtn.addEventListener("click", closeModal);
detailModal.addEventListener("click", (event) => {
  if (event.target === detailModal) {
    closeModal();
  }
});

document.querySelectorAll(".feature-card button, .story-card button, .room-card button").forEach((button) => {
  button.addEventListener("click", () => {
    const card = button.closest("article");
    const title = card?.querySelector("h3")?.textContent.trim();
    if (title) {
      openModal(title);
    }
  });
});

document.querySelectorAll(".info-grid article").forEach((article) => {
  article.addEventListener("click", () => {
    const title = article.querySelector("h3")?.textContent.trim();
    if (title && detailContent[title]) {
      openModal(title);
    }
  });
});

document.querySelectorAll(".festival__link").forEach((link) => {
  link.addEventListener("click", (event) => {
    event.preventDefault();
    openModal(link.dataset.festival);
  });
});

/* Login modal */
const openLoginModal = () => {
  loginModal.classList.add("is-open");
  loginModal.setAttribute("aria-hidden", "false");
  body.classList.add("menu-open");
};

const closeLoginModal = () => {
  loginModal.classList.remove("is-open");
  loginModal.setAttribute("aria-hidden", "true");
  if (!detailModal.classList.contains("is-open")) {
    body.classList.remove("menu-open");
  }
};

document.querySelectorAll(".nav__login").forEach((button) => {
  button.addEventListener("click", openLoginModal);
});

closeLogin.addEventListener("click", closeLoginModal);
loginModal.addEventListener("click", (event) => {
  if (event.target === loginModal) {
    closeLoginModal();
  }
});

loginForm.addEventListener("submit", (event) => {
  event.preventDefault();
  const mobile = loginForm.elements.mobile.value.trim();
  closeLoginModal();
  loginForm.reset();
  showToast(mobile ? `Secure OTP sent to ${mobile}.` : "Secure OTP sent.");
});

/* Map actions */
const tolaMapsUrl = "https://www.google.com/maps/search/?api=1&query=Tirumala+Venkateswara+Temple";
document.querySelectorAll("[data-map]").forEach((button) => {
  button.addEventListener("click", () => {
    const mode = button.dataset.map;
    window.open(tolaMapsUrl, "_blank", "noopener");
    showToast(mode === "directions" ? "Opening directions to Tirumala…" : "Opening Tirumala on the map…");
  });
});

/* Language chip */
const langChip = document.querySelector(".nav__chip");
if (langChip) {
  const languages = ["EN", "TE"];
  let langIndex = 0;
  langChip.addEventListener("click", () => {
    langIndex = (langIndex + 1) % languages.length;
    langChip.textContent = languages[langIndex];
    langChip.setAttribute("aria-label", `Switch language, current ${languages[langIndex]}`);
    showToast(languages[langIndex] === "TE" ? "Language switched to తెలుగు" : "Language switched to English");
  });
}

/* Live temple status */
const clockEl = document.getElementById("liveClock");
const statusEl = document.getElementById("templeStatus");
const queueEl = document.getElementById("queueTime");
const nextSevaEl = document.getElementById("nextSeva");
const liveDot = document.getElementById("liveDot");

const sevasToday = [
  { name: "Suprabhatam", hour: 3, minute: 0 },
  { name: "Thomala Seva", hour: 4, minute: 0 },
  { name: "Archana", hour: 5, minute: 30 },
  { name: "Kalyanotsavam", hour: 11, minute: 0 },
  { name: "Unjal Seva", hour: 17, minute: 30 },
  { name: "Ekanta Seva", hour: 21, minute: 30 }
];

const istNow = () => new Date(Date.now() + 330 * 60000);

const pad = (value) => String(value).padStart(2, "0");

const updateLiveStatus = () => {
  const now = istNow();
  const hours = now.getUTCHours();
  const minutes = now.getUTCMinutes();
  const seconds = now.getUTCSeconds();

  clockEl.textContent = `${pad(hours)}:${pad(minutes)}:${pad(seconds)}`;

  const openMorning = hours >= 6 && hours < 13;
  const openEvening = hours >= 15 && hours < 22;
  const isOpen = openMorning || openEvening;
  statusEl.textContent = isOpen ? "Darshan Open" : "Temple Closed";
  liveDot.classList.toggle("is-closed", !isOpen);

  const peak = openMorning ? minutes / 60 + 0.6 : openEvening ? minutes / 60 + 0.9 : 0.2;
  const baseWait = Math.round(40 + peak * 90 + ((hours * 13) % 25));
  queueEl.textContent = isOpen ? `${baseWait} min` : "Opens at 06:00";

  const upcoming = sevasToday.find((seva) => seva.hour > hours || (seva.hour === hours && seva.minute > minutes));
  nextSevaEl.textContent = upcoming ? `${upcoming.name} · ${pad(upcoming.hour)}:${pad(upcoming.minute)}` : "Tomorrow 03:00";
};

/* Festival countdowns */
const festivalCountdowns = [...document.querySelectorAll(".festival__countdown")];
const updateCountdowns = () => {
  const now = Date.now();
  festivalCountdowns.forEach((el) => {
    let target = new Date(`${el.dataset.date}T00:00:00`).getTime();
    if (now - target > 86400000) {
      const next = new Date(`${el.dataset.date}T00:00:00`);
      next.setFullYear(next.getFullYear() + 1);
      target = next.getTime();
    }
    const diff = target - now;
    if (diff <= 0) {
      el.textContent = "Celebration today";
      return;
    }
    const days = Math.floor(diff / 86400000);
    const hours = Math.floor((diff % 86400000) / 3600000);
    const minutes = Math.floor((diff % 3600000) / 60000);
    el.textContent = `Starts in ${days}d ${hours}h ${minutes}m`;
  });
};

/* Cursor glow */
if (window.matchMedia("(pointer: fine)").matches && cursorGlow) {
  let glowX = window.innerWidth / 2;
  let glowY = window.innerHeight / 2;
  let currentX = glowX;
  let currentY = glowY;

  window.addEventListener("mousemove", (event) => {
    glowX = event.clientX;
    glowY = event.clientY;
    cursorGlow.classList.add("is-active");
  });

  document.addEventListener("mouseleave", () => cursorGlow.classList.remove("is-active"));

  const renderGlow = () => {
    currentX += (glowX - currentX) * 0.12;
    currentY += (glowY - currentY) * 0.12;
    cursorGlow.style.transform = `translate3d(${currentX}px, ${currentY}px, 0)`;
    window.requestAnimationFrame(renderGlow);
  };

  if (!reduceMotion()) {
    window.requestAnimationFrame(renderGlow);
  }
}

/* Card tilt */
if (window.matchMedia("(pointer: fine)").matches && !reduceMotion()) {
  document.querySelectorAll(".feature-card, .room-card").forEach((card) => {
    card.addEventListener("mousemove", (event) => {
      const rect = card.getBoundingClientRect();
      const px = (event.clientX - rect.left) / rect.width - 0.5;
      const py = (event.clientY - rect.top) / rect.height - 0.5;
      card.style.transform = `perspective(900px) rotateY(${px * 6}deg) rotateX(${-py * 6}deg) translateY(-4px)`;
    });
    card.addEventListener("mouseleave", () => {
      card.style.transform = "";
    });
  });
}

updateHeader();
updateScrollUI();
if (!reduceMotion()) {
  updateMotion();
}
updateLiveStatus();
updateCountdowns();
window.setInterval(updateLiveStatus, 1000);
window.setInterval(updateCountdowns, 60000);
