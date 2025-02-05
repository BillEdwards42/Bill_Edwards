/***** MOBILE MENU TOGGLE *****/
// Select menu button and navigation links
const menuButton = document.querySelector(".menu-button");
const navLinks = document.querySelector(".nav-links");

if (menuButton && navLinks) {
  // Toggle the mobile menu when clicking the menu button
  menuButton.addEventListener("click", () => {
    navLinks.classList.toggle("open");
  });
  // Close the menu when any nav link is clicked
  navLinks.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", () => {
      if (navLinks.classList.contains("open")) {
        navLinks.classList.remove("open");
      }
    });
  });
}

/***** LENS CURSOR *****/
// Move the custom cursor ("lens") with the mouse
const lensCursor = document.querySelector(".lens-cursor");
document.addEventListener("mousemove", (e) => {
  if (!lensCursor) return;
  lensCursor.style.left = `${e.clientX}px`;
  lensCursor.style.top = `${e.clientY}px`;
});

// Enlarge the lens when hovering over interactive elements
document.querySelectorAll("a, button, .btn, input[type='submit']").forEach((elem) => {
  elem.addEventListener("mouseenter", () => {
    if (lensCursor) lensCursor.classList.add("enlarge");
  });
  elem.addEventListener("mouseleave", () => {
    if (lensCursor) lensCursor.classList.remove("enlarge");
  });
});

/***** SMOOTH SCROLL (HOME & CONTACT LINKS) *****/
function smoothScrollTo(targetSelector) {
  const targetEl = document.querySelector(targetSelector);
  if (!targetEl) return;
  // If Lenis is available, use it; otherwise, fall back to native smooth scroll
  if (typeof lenis !== "undefined") {
    lenis.scrollTo(targetSelector);
  } else {
    targetEl.scrollIntoView({ behavior: "smooth" });
  }
}
const homeLink = document.querySelector(".brand");
const contactLink = document.querySelector(".contact-link");
if (homeLink) {
  homeLink.addEventListener("click", (e) => {
    e.preventDefault();
    smoothScrollTo("#hero");
  });
}
if (contactLink) {
  contactLink.addEventListener("click", (e) => {
    e.preventDefault();
    smoothScrollTo("#contact-footer");
  });
}

/***** PINNED MEGA SCROLL LOGIC *****/
function handleMegaScroll(currentScrollY) {
  const megaSection = document.querySelector("#mega-scroll.mega-scroll-section");
  if (!megaSection) return;

  // The sticky container within the mega section
  const stickyContainer = megaSection.querySelector(".mega-sticky");

  // Calculate pinned progress (a value between 0 and 1)
  const sectionTop = megaSection.offsetTop;
  const sectionHeight = megaSection.offsetHeight;
  const scrollWithin = currentScrollY - sectionTop;
  const scrollRange = sectionHeight - window.innerHeight;
  let pinnedProgress = scrollWithin / scrollRange;
  pinnedProgress = Math.min(1, Math.max(0, pinnedProgress)); // Clamp between 0 and 1

  // Get portfolio and strength scrollers and their headings
  const portfolioScroller = document.querySelector(".portfolio-scroller");
  const portfolioHeading = document.querySelector(".portfolio-heading");
  const strengthScroller = document.querySelector(".strength-scroller");
  const strengthHeading = document.querySelector(".strength-heading");
  if (!portfolioScroller || !strengthScroller) return;

  /********** 1) BACKGROUND COLOR FADE **********/
// Update the sticky container’s background based on scroll progress.
// For pinnedProgress below 0.5, we fade from the mega navy to a portfolio dark tone.
// For pinnedProgress 0.5 and above, we immediately set the background to the strength color.
if (stickyContainer) {
  if (pinnedProgress < 0.5) {
    // Fade from mega navy (#11224d) to portfolio tone (#192332) as the user scrolls
    const fromColor = { r: 17, g: 34, b: 77 };   // #11224d
    const toColor = { r: 25, g: 35, b: 50 };      // example portfolio tone (#192332)
    const fadeStart = 0.30;
    const fadeEnd = 0.5;
    if (pinnedProgress <= fadeStart) {
      stickyContainer.style.backgroundColor = "rgb(17,34,77)";
    } else if (pinnedProgress >= fadeEnd) {
      stickyContainer.style.backgroundColor = "rgb(25,35,50)";
    } else {
      const t = (pinnedProgress - fadeStart) / (fadeEnd - fadeStart);
      const r = Math.round(fromColor.r + (toColor.r - fromColor.r) * t);
      const g = Math.round(fromColor.g + (toColor.g - fromColor.g) * t);
      const b = Math.round(fromColor.b + (toColor.b - fromColor.b) * t);
      stickyContainer.style.backgroundColor = `rgb(${r}, ${g}, ${b})`;
    }
  } else {
    // Once pinnedProgress reaches 0.5, switch to the strength color
    stickyContainer.style.backgroundColor = "#f5f5f5";
  }
}
  /********** 2) PORTFOLIO SCROLLER **********/
  // Use pinned progress from 0.0 to 0.5 for the portfolio
  const portStart = 0.0;
  const portEnd = 0.5;
  const pP = clamp01((pinnedProgress - portStart) / (portEnd - portStart));
  const portfolioOverflow = portfolioScroller.scrollWidth - window.innerWidth;
  const portfolioExtra = 300; // Extra off-screen distance
  const portfolioX = - (portfolioOverflow + portfolioExtra) * pP;
  if (pinnedProgress <= portEnd) {
    portfolioScroller.style.transform = `translateX(${portfolioX}px)`;
    // Fade out portfolio heading over the first 30% of this subrange
    let headingFade = Math.min(1, pP / 0.3);
    portfolioHeading.style.opacity = (1 - headingFade).toString();
  } else {
    portfolioScroller.style.transform = `translateX(${- (portfolioOverflow + portfolioExtra)}px)`;
    portfolioHeading.style.opacity = "0";
  }
  // Optionally fade out portfolio scroller (so it doesn't block the strength section)
  const fadeOutStart = 0.4;
  const fadeOutEnd = 0.5;
  if (pinnedProgress < fadeOutStart) {
    portfolioScroller.style.opacity = "1";
    portfolioScroller.style.pointerEvents = "auto";
  } else if (pinnedProgress > fadeOutEnd) {
    portfolioScroller.style.opacity = "0";
    portfolioScroller.style.pointerEvents = "none";
  } else {
    const localT = (pinnedProgress - fadeOutStart) / (fadeOutEnd - fadeOutStart);
    portfolioScroller.style.opacity = (1 - localT).toString();
    portfolioScroller.style.pointerEvents = "none";
  }

  /********** 3) STRENGTH SCROLLER **********/
  // Use pinned progress from 0.5 to 1.0 for strength
  const strStart = 0.5;
  const strEnd = 1.0;
  const sP = clamp01((pinnedProgress - strStart) / (strEnd - strStart));
  const strengthOverflow = strengthScroller.scrollWidth - window.innerWidth;
  const strengthExtra = -1300;
  const strengthStartX = - (strengthOverflow + strengthExtra);
  const strengthEndX = - strengthExtra;
  const strengthX = lerp(strengthStartX, strengthEndX, sP);
  if (pinnedProgress >= strStart) {
    strengthScroller.style.transform = `translateX(${strengthX}px)`;
  } else {
    strengthScroller.style.transform = `translateX(${-strengthOverflow}px)`;
  }
  // Make "My Strengths" heading fully visible right at the start (at pinnedProgress 0.5)
  // then fade it gradually until pinnedProgress reaches 1.0.
  if (pinnedProgress >= strStart) {
    strengthHeading.style.opacity = (1 - sP).toString();
  } else {
    strengthHeading.style.opacity = "0";
  }
}

// Utility functions: clamp value between 0 and 1, and linear interpolation
function clamp01(val) {
  return Math.max(0, Math.min(1, val));
}
function lerp(a, b, t) {
  return a + (b - a) * t;
}

/***** LANGUAGE TOGGLE *****/
const langToggleBtn = document.querySelector(".lang-toggle");
if (langToggleBtn) {
  langToggleBtn.addEventListener("click", (event) => {
    event.preventDefault();
    document.body.classList.toggle("chinese-mode");
    const resumeBtn = document.querySelector(".resume-btn");
    if (resumeBtn) {
      if (document.body.classList.contains("chinese-mode")) {
        resumeBtn.href = "./assets/docs/Bill_resume_chi.pdf";
        resumeBtn.download = "Bill_resume_chi.pdf";
      } else {
        resumeBtn.href = "./assets/docs/Bill_resume_eng.pdf";
        resumeBtn.download = "Bill_resume_eng.pdf";
      }
    }
  });
}

/***** NAVBAR SCROLL (HIDE ON SCROLL DOWN, SHOW ON SCROLL UP) *****/
const navbar = document.querySelector(".navbar");
let lastScrollTop = 0;
window.addEventListener("scroll", () => {
  const currentScroll = window.pageYOffset || document.documentElement.scrollTop;
  if (currentScroll > lastScrollTop) {
    navbar.classList.add("nav-hidden");
  } else {
    navbar.classList.remove("nav-hidden");
  }
  lastScrollTop = currentScroll;
});

/********************************
 * PORTFOLIO MODAL / IMAGE POPUP
 ********************************/
// Get modal elements
const modalEl = document.getElementById("portfolio-modal");
const modalImage = modalEl?.querySelector(".modal-image");
const modalDescText = modalEl?.querySelector(".modal-desc-text");
const arrowLeft = modalEl?.querySelector(".modal-arrow-left");
const arrowRight = modalEl?.querySelector(".modal-arrow-right");
const closeBtn = modalEl?.querySelector(".modal-close");

// Variables for modal slideshow
let currentImages = [];
let currentIndex = 0;
const AUTO_FLIP_DELAY = 4000; // milliseconds

// Attach event listeners to each portfolio card's info icon
document.querySelectorAll(".portfolio-card").forEach((card) => {
  const infoButton = card.querySelector(".info-icon");
  if (!infoButton) return;
  infoButton.addEventListener("click", (e) => {
    e.stopPropagation();
    currentImages = [];
    currentIndex = 0;
    // Gather hidden images and descriptions from the card
    card.querySelectorAll(".hidden-images .hidden-image").forEach((hi) => {
      const src = hi.querySelector(".img-src")?.textContent.trim() || "";
      const en = hi.querySelector(".desc-en")?.textContent.trim() || "";
      const zh = hi.querySelector(".desc-zh")?.textContent.trim() || "";
      currentImages.push({ src, en, zh });
    });
    openModal();
  });
});

function openModal() {
  if (!currentImages.length) return;
  document.body.classList.add("modal-open");
  modalEl.classList.add("active");
  loadImage();
}
function closeModal() {
  document.body.classList.remove("modal-open");
  modalEl.classList.remove("active");
}
function loadImage() {
  if (!modalImage) return;
  const isChinese = document.body.classList.contains("chinese-mode");
  const { src, en, zh } = currentImages[currentIndex];
  modalImage.style.opacity = 0;
  modalImage.onload = () => {
    modalImage.style.opacity = 1;
  };
  modalImage.src = src;
  if (modalDescText) {
    modalDescText.innerHTML = `
      <span class="lang-en" style="${isChinese ? 'display:none;' : ''}">
        ${en}
      </span>
      <span class="lang-zh" style="${isChinese ? '' : 'display:none;'}">
        ${zh}
      </span>
    `;
  }
  // Show or hide navigation arrows based on current index
  if (arrowLeft) {
    arrowLeft.style.display = currentIndex > 0 ? "block" : "none";
  }
  if (arrowRight) {
    arrowRight.style.display = currentIndex < currentImages.length - 1 ? "block" : "none";
  }
}

// Modal navigation events
if (arrowLeft) {
  arrowLeft.addEventListener("click", () => {
    if (currentIndex > 0) {
      currentIndex--;
      loadImage();
    }
  });
}
if (arrowRight) {
  arrowRight.addEventListener("click", () => {
    if (currentIndex < currentImages.length - 1) {
      currentIndex++;
      loadImage();
    }
  });
}
if (closeBtn) {
  closeBtn.addEventListener("click", closeModal);
}