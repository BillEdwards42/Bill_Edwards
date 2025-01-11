/***** MOBILE MENU TOGGLE *****/
const menuButton = document.querySelector(".menu-button");
const navLinks = document.querySelector(".nav-links");

if (menuButton && navLinks) {
  console.log("[DEBUG] Menu button + nav links found, adding toggle event.");
  
  // Instead of toggling display directly, we toggle the .open class
  menuButton.addEventListener("click", () => {
    navLinks.classList.toggle("open");
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

/***** CONTACT FORM HANDLING *****/
const contactForm = document.querySelector(".contact-form");
if (contactForm) {
  console.log("[DEBUG] Found contact form, adding submit listener.");
  contactForm.addEventListener("submit", (event) => {
    event.preventDefault();
    alert("Form submitted (placeholder).");
    contactForm.reset();
  });
} else {
  console.warn("[DEBUG] No contact form found!");
}

/***** SMOOTH SCROLL (HOME LINK + CONTACT LINK) WITH LENIS *****/
const homeLink = document.querySelector(".brand");       // logo -> #hero
const contactLink = document.querySelector(".contact-link"); // "Contact" -> #contact-footer

function smoothScrollTo(targetSelector) {
  if (typeof lenis === "undefined") return;
  lenis.scrollTo(targetSelector);
}

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
const strengthSection = document.querySelector("#strength.strength-section");
const strengthSticky = document.querySelector(".strength-sticky");
const strengthHeading = document.querySelector(".strength-heading");
const strengthScroller = document.querySelector(".strength-scroller");

/**
 * Called by the older Lenis snippet when 'scroll' event fires.
 * We rely on the snippet for the RAF and everything else.
 */
function handleStrengthScroll(currentScrollY) {
  console.log("[DEBUG] handleStrengthScroll called. currentScrollY:", currentScrollY);

  if (!strengthSection) {
    console.warn("[DEBUG] #strength.strength-section not found in DOM.");
    return;
  }
  if (!strengthSticky) {
    console.warn("[DEBUG] .strength-sticky not found in DOM.");
    return;
  }
  if (!strengthScroller) {
    console.warn("[DEBUG] .strength-scroller not found in DOM.");
    return;
  }
  if (!strengthHeading) {
    console.warn("[DEBUG] .strength-heading not found in DOM.");
    return;
  }

  const sectionTop = strengthSection.offsetTop;
  const sectionHeight = strengthSection.offsetHeight;
  const start = sectionTop;
  const end = sectionTop + sectionHeight;

  // If we haven't reached the Strength section or we've passed it, do nothing
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

  const scrollRange = sectionHeight - window.innerHeight; // how much vertical space we have
  let progress = scrollWithin / scrollRange;
  progress = Math.min(Math.max(progress, 0), 1);
  console.log("[DEBUG] scrollWithin:", scrollWithin, "scrollRange:", scrollRange, "progress:", progress);

  const initialOffset = 0;
  const currentX = initialOffset + totalHorizontal * progress;
  console.log("[DEBUG] currentX (scroller translate):", currentX);

  // Apply horizontal translate
  strengthScroller.style.transform = `translateX(-${currentX}px)`;

  // Fade heading from progress=0..0.3
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

/***** DYNAMIC NAVBAR BACKGROUND + TEXT COLOR PER SECTION *****/
const sections = document.querySelectorAll("section");
const navbar = document.querySelector(".navbar");
const navLinksAll = navbar.querySelectorAll(".nav-links a");

// Also reference the navLinks UL, so we can update BG color
// if we want it to match dynamic nav color
// (We've declared `navLinks` above for the mobile menu.)
function pickTextColor(bgHex) {
  const r = parseInt(bgHex.substr(1, 2), 16);
  const g = parseInt(bgHex.substr(3, 2), 16);
  const b = parseInt(bgHex.substr(5, 2), 16);
  const luminance = 0.299 * r + 0.587 * g + 0.114 * b;
  return luminance > 150 ? "#000" : "#fff";
}

const obsOptions = {
  root: null,
  rootMargin: "-60% 0px -40% 0px",
  threshold: 0
};

function handleSectionIntersect(entries) {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      let newBg = "#ffffff";
      switch (entry.target.id) {
        case "hero":
          newBg = "#fdf9f5";  // Hero’s color
          break;
        case "services":
          newBg = "#11224d";  // Navy
          break;
        case "who-we-are":
          newBg = "#1C245B";  // Calm dark purple
          break;
        case "strength":
          newBg = "#fdf9f5";  // Cream color
          break;
        case "contact-footer":
          newBg = "#ffffff";  // White
          break;
      }
      // Slow fade on the navbar
      navbar.style.transition = "background-color 1.5s ease";
      navbar.style.backgroundColor = newBg;

      // Also update nav text color
      const newTextColor = pickTextColor(newBg);
      navbar.style.color = newTextColor;
      navLinksAll.forEach((link) => {
        link.style.color = newTextColor;
      });

      // If the mobile menu is open, sync its background color too
      updateNavColor(newBg);
    }
  });
}

const observer = new IntersectionObserver(handleSectionIntersect, obsOptions);
sections.forEach((sec) => observer.observe(sec));

function updateNavColor(newColor) {
  // If the .open class is active, we set the background on navLinks
  // so it matches (with some alpha)
  if (navLinks.classList.contains("open")) {
    navLinks.style.backgroundColor = hexToRgba(newColor, 0.8);
  } else {
    // otherwise, clear or revert to default
    navLinks.style.backgroundColor = "transparent";
  }
}

// Convert #11224d to 'rgba(17,34,77,0.8)' for example
function hexToRgba(hex, alpha) {
  const r = parseInt(hex.substr(1, 2), 16);
  const g = parseInt(hex.substr(3, 2), 16);
  const b = parseInt(hex.substr(5, 2), 16);
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}
