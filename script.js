document.addEventListener("DOMContentLoaded", () => {

  /* =========================
     COUNTDOWN
  ========================= */
  const launchDate = new Date(2026, 3, 1, 0, 0, 0).getTime();

  function updateCountdown() {
    const diff = launchDate - Date.now();

    if (diff <= 0) {
      document.querySelector(".countdown").textContent = "ArcOS";
      return;
    }

    document.getElementById("days").textContent =
      String(Math.floor(diff / 86400000)).padStart(2, "0");

    document.getElementById("hours").textContent =
      String(Math.floor((diff / 3600000) % 24)).padStart(2, "0");

    document.getElementById("minutes").textContent =
      String(Math.floor((diff / 60000) % 60)).padStart(2, "0");

    document.getElementById("seconds").textContent =
      String(Math.floor((diff / 1000) % 60)).padStart(2, "0");
  }

  setInterval(updateCountdown, 1000);
  updateCountdown();


  /* =========================
     NAV DIALOG SYSTEM
  ========================= */
  const dialogs = document.querySelectorAll(".dialog");
const fills   = document.querySelectorAll(".progress-fill");

let current = 0;
const delay = 7000;
const duration = 600;
let isAnimating = false;

function runCycle() {
  // ===== PROGRESS =====
  fills.forEach((f, i) => {
    f.style.transition = "none";

    if (i < current) {
      f.style.width = "100%";
    } else {
      f.style.width = "0%";
    }
  });

  const activeFill = fills[current];

  // force reflow (no flicker)
activeFill.style.transition = "none";
activeFill.style.width = "0%";

activeFill.offsetWidth; // 👈 magic line

activeFill.style.transition = `width ${delay}ms linear`;
activeFill.style.width = "100%";


  // ===== DIALOG =====
  setTimeout(() => {
    if (isAnimating) return;

    isAnimating = true;

    const next = (current + 1) % dialogs.length;

    const currentEl = dialogs[current];
    const nextEl = dialogs[next];
    // trigger count when reaching 2nd dialog (index 1)
if (next === 1) {
  animateCount(50000, 2000); // 2s animation
}

    dialogs.forEach(d =>
      d.classList.remove("exit-up", "exit-down", "enter-up", "enter-down")
    );

    currentEl.classList.remove("active");
    currentEl.classList.add("exit-up");

    nextEl.classList.add("enter-up");

    setTimeout(() => {
      nextEl.classList.add("active");
      nextEl.classList.remove("enter-up");
    }, 50);

    setTimeout(() => {
      currentEl.classList.remove("exit-up");
      current = next;
      isAnimating = false;
      runCycle(); // 🔁 LOOP CONTROLLED HERE (NOT setInterval)
    }, duration);

  }, delay);
}

// 🚀 start
runCycle();


  /* =========================
     HERO DIALOG SYSTEM (FIXED)
  ========================= */
  const hDialogs = document.querySelectorAll(".hdialog");

  if (hDialogs.length > 0) {
    let hIndex = 0;

    setInterval(() => {
      hDialogs[hIndex].classList.remove("active");

      hIndex = (hIndex + 1) % hDialogs.length;

      hDialogs[hIndex].classList.add("active");
    }, 5000);
  }


  /* =========================
     HAMBURGER MENU
  ========================= */
  const fullMenu = document.querySelector(".fullmenu");
  const menuIcon = document.getElementById("menu");
  const closeBtn = document.getElementById("menuClose");

  function openMenu() {
    fullMenu.classList.add("active");
  }

  function closeMenu() {
    fullMenu.classList.remove("active");
  }

  if (menuIcon) menuIcon.addEventListener("click", openMenu)
  if (closeBtn) closeBtn.addEventListener("click", closeMenu);

  document.querySelectorAll(".menu-links a").forEach(link => {
    link.addEventListener("click", closeMenu);
  });

});



function animateCount(target, duration = 2000) {
  const el = document.getElementById("userCount");
  if (!el) return;

  let start = 0;
  const startTime = performance.now();

  function update(now) {
    const progress = Math.min((now - startTime) / duration, 1);

    // ease-out (smooth finish)
    const eased = 1 - Math.pow(1 - progress, 3);

    const value = Math.floor(eased * target);
    el.textContent = value.toLocaleString();

    if (progress < 1) {
      requestAnimationFrame(update);
    }
  }

  requestAnimationFrame(update);
}

/*============================= */
/*POPUP MECHANISM*/

const popup      = document.getElementById("popup");
const popupIcon  = document.getElementById("popupIcon");
const popupTitle = document.getElementById("popupTitle");
const popupSub   = document.getElementById("popupSub");
const popupFill  = document.getElementById("popupFill");
const popupClose = document.getElementById("popupClose");

let popupTimer = null;
let popupState = false;

function openPopup({ icon = "🔔", title = "Notice", sub = "", duration = 4000 }) {
  clearTimeout(popupTimer);

  popupIcon.textContent  = icon;
  popupTitle.textContent = title;
  popupSub.textContent   = sub;

  // reset progress
  popupFill.style.transition = "none";
  popupFill.style.transform  = "scaleX(1)";

  popup.classList.add("active");
  popupState = true;

  // start shrink after paint
  requestAnimationFrame(() => {
    requestAnimationFrame(() => {
      popupFill.style.transition = `transform ${duration}ms linear`;
      popupFill.style.transform  = "scaleX(0)";
    });
  });

  popupTimer = setTimeout(closePopup, duration);
}

function closePopup() {
  popup.classList.remove("active");
  popupState = false;
  clearTimeout(popupTimer);
}

popupClose.addEventListener("click", closePopup);

// Updated calls
document.querySelector(".herobtn").addEventListener("click", () => {
  openPopup({
    icon: "🚀",
    title: "SneakPeek isn't available yet",
    sub: "We're cooking something big. Stay tuned.",
    duration: 3000
  });
});

document.querySelector(".navbtn").addEventListener("click", () => {
  openPopup({
    icon: "🔒",
    title: "Coming Soon",
    sub: "SneakPeek drops with the launch.",
    duration: 3000
  });
});

document.querySelector(".docsbtn").addEventListener("click", () => {
  openPopup({
    icon: "📃",
    title: "Docs Loading...",
    sub: "Optimizing Docs Page For Better Readibility",
    duration: 3000
  });
});
/*==============================*/
/* TXT SPLIT + WAVE + SUBTXT   */
/*==============================*/

/* --- LETTER SPLITTER --- */
function splitLetters(selector) {
  document.querySelectorAll(selector).forEach(el => {
    el.childNodes.forEach(node => {
      if (node.nodeType === 3) {
        const letters = node.textContent.split("").map(char => {
          const span       = document.createElement("span");
          span.className   = "letter";
          span.textContent = char === " " ? "\u00A0" : char;
          return span;
        });
        letters.forEach(s => el.insertBefore(s, node));
        el.removeChild(node);
      }
    });
  });
}

/* --- WAVE EFFECT --- */
function applyWave(selector, maxDist = 80, strength = 0.35) {
  document.querySelectorAll(selector).forEach(el => {

    el.addEventListener("mousemove", e => {
      el.querySelectorAll(".letter").forEach(letter => {
        const rect    = letter.getBoundingClientRect();
        const centerX = rect.left + rect.width / 2;
        const dist    = Math.abs(e.clientX - centerX);

        if (dist < maxDist) {
          const s = 1 - dist / maxDist;
          letter.style.transform = `scale(${1 + s * strength})`;
          letter.style.opacity   = String(0.5 + s * 0.5);
        } else {
          letter.style.transform = "scale(1)";
          letter.style.opacity   = "0.5";
        }
      });
    });

    el.addEventListener("mouseleave", () => {
      el.querySelectorAll(".letter").forEach(l => {
        l.style.transform = "scale(1)";
        l.style.opacity   = "1";
      });
    });

  });
}

/* --- INIT HEADLINES --- */
splitLetters(".line1, .line2");
applyWave(".line1, .line2", 80, 0.35);


/* --- SUBTXT GRADIENT CONTROL --- */
const subtxt = document.querySelector(".subtxt");

if (subtxt) {
  const defaultBg = `linear-gradient(
    120deg,
    rgba(200,200,200,0.5) 0%,
    rgba(200,200,200,0.5) 40%,
    #ffffff 48%,
    #ffffff 52%,
    rgba(200,200,200,0.5) 60%,
    rgba(200,200,200,0.5) 100%
  )`;

  subtxt.addEventListener("mousemove", e => {
    const rect = subtxt.getBoundingClientRect();
    const x    = ((e.clientX - rect.left) / rect.width) * 100;

    subtxt.style.animationPlayState = "paused";
    subtxt.style.backgroundImage    = `linear-gradient(
      120deg,
      rgba(200,200,200,0.4) 0%,
      rgba(200,200,200,0.4) ${x - 12}%,
      #ffffff          ${x - 4}%,
      #ffffff          ${x + 4}%,
      rgba(200,200,200,0.4) ${x + 12}%,
      rgba(200,200,200,0.4) 100%
    )`;
  });

  subtxt.addEventListener("mouseleave", () => {
    subtxt.style.animationPlayState = "running";
    subtxt.style.backgroundImage    = defaultBg;
    subtxt.style.backgroundSize     = "300% 300%";
  });
}

/*==============================*/