/***** MOBILE MENU TOGGLE *****/
const menuButton = document.querySelector(".menu-button");
const navLinks = document.querySelector(".nav-links");

if (menuButton && navLinks) {
  console.log("[DEBUG] Menu button + nav links found, adding toggle event.");

  // Toggle .open on mobile menu
  menuButton.addEventListener("click", () => {
    navLinks.classList.toggle("open");
  });

  // Close mobile menu upon link click
  const navLinkItems = navLinks.querySelectorAll("a");
  navLinkItems.forEach((link) => {
    link.addEventListener("click", () => {
      if (navLinks.classList.contains("open")) {
        navLinks.classList.remove("open");
      }
    });
  });
} else {
  console.warn("[DEBUG] Menu button or nav links NOT found!");
}

/***** LENS CURSOR *****/
const lensCursor = document.querySelector(".lens-cursor");
document.addEventListener("mousemove", (e) => {
  if (!lensCursor) return;
  lensCursor.style.left = e.clientX + "px";
  lensCursor.style.top = e.clientY + "px";
});

const interactiveElems = document.querySelectorAll(
  "a, button, .btn, input[type='submit']"
);
interactiveElems.forEach((elem) => {
  elem.addEventListener("mouseenter", () => {
    if (lensCursor) lensCursor.classList.add("enlarge");
  });
  elem.addEventListener("mouseleave", () => {
    if (lensCursor) lensCursor.classList.remove("enlarge");
  });
});

/***** SMOOTH SCROLL (HOME LINK + CONTACT LINK) *****/
function smoothScrollTo(targetSelector) {
  const targetEl = document.querySelector(targetSelector);
  if (!targetEl) return;

  // Use Lenis if available, otherwise native smooth scroll
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

/***** PINNED HORIZONTAL SCROLL LOGIC FOR #strength *****/
function handleStrengthScroll(currentScrollY) {
  const strengthSection = document.querySelector("#strength.strength-section");
  const strengthSticky = document.querySelector(".strength-sticky");
  const strengthScroller = document.querySelector(".strength-scroller");
  const strengthHeading = document.querySelector(".strength-heading");

  console.log("[DEBUG] handleStrengthScroll called. currentScrollY:", currentScrollY);

  if (!strengthSection || !strengthSticky || !strengthScroller || !strengthHeading) {
    console.warn("[DEBUG] Some strength section elements not found.");
    return;
  }

  const sectionTop = strengthSection.offsetTop;
  const sectionHeight = strengthSection.offsetHeight;
  const start = sectionTop;
  const end = sectionTop + sectionHeight;

  // Only do pinned scroll logic when within the strength section range
  if (currentScrollY < start || currentScrollY > end) {
    console.log("[DEBUG] currentScrollY is outside the strength section range.");
    return;
  }

  const scrollWithin = currentScrollY - start;
  const scrollerWidth = strengthScroller.scrollWidth;
  const viewportWidth = window.innerWidth;
  const totalHorizontal = scrollerWidth - viewportWidth;

  console.log(
    "[DEBUG] scrollerWidth:", scrollerWidth,
    "viewportWidth:", viewportWidth,
    "totalHorizontal:", totalHorizontal
  );

  if (totalHorizontal <= 0) {
    console.warn("[DEBUG] No horizontal overflow; can't scroll horizontally!");
    return;
  }

  const scrollRange = sectionHeight - window.innerHeight;
  let progress = scrollWithin / scrollRange;
  progress = Math.min(Math.max(progress, 0), 1);

  console.log("[DEBUG] scrollWithin:", scrollWithin, "scrollRange:", scrollRange, "progress:", progress);

  const currentX = totalHorizontal * progress;
  console.log("[DEBUG] currentX (scroller translate):", currentX);

  // Move scroller horizontally
  strengthScroller.style.transform = `translateX(-${currentX}px)`;

  // Fade out heading in the first ~30% of vertical scroll
  const fadeStart = 0.0;
  const fadeEnd = 0.3;
  let fadeProgress = 0;
  if (progress > fadeStart) {
    fadeProgress = (progress - fadeStart) / (fadeEnd - fadeStart);
    fadeProgress = Math.min(Math.max(fadeProgress, 0), 1);
  }
  const headingOpacity = 1 - fadeProgress;
  strengthHeading.style.opacity = headingOpacity.toString();
  console.log("[DEBUG] headingOpacity:", headingOpacity);
}

/***** LANGUAGE TOGGLE *****/
const langToggleBtn = document.querySelector(".lang-toggle");
if (langToggleBtn) {
  langToggleBtn.addEventListener("click", (event) => {
    event.preventDefault();
    document.body.classList.toggle("chinese-mode");
    console.log("[DEBUG] Language mode toggled. chinese-mode =", document.body.classList.contains("chinese-mode"));

    // Optional dynamic resume link swap
    /*
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
    */
  });
} else {
  console.warn("[DEBUG] .lang-toggle not found!");
}

/***** NAVBAR SCROLL (no hover logic) *****/
const navbar = document.querySelector(".navbar");
let lastScrollTop = 0;

window.addEventListener("scroll", () => {
  if (!navbar) return;

  const currentScroll = window.pageYOffset || document.documentElement.scrollTop;
  if (currentScroll > lastScrollTop) {
    // Scrolling down -> hide
    navbar.classList.add("nav-hidden");
  } else {
    // Scrolling up -> show
    navbar.classList.remove("nav-hidden");
  }
  lastScrollTop = currentScroll;
});
