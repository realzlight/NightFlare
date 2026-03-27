document.addEventListener("DOMContentLoaded", () => {

  /* =========================
     COUNTDOWN
  ========================= */
  const launchDate = new Date(2026, 3, 1, 0, 0, 0).getTime();

  function updateCountdown() {
    const diff = launchDate - Date.now();

    if (diff <= 0) {
      document.querySelector(".countdown").textContent = "LIVE 🚀";
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
    duration: 4000
  });
});

document.querySelector(".navbtn").addEventListener("click", () => {
  openPopup({
    icon: "🔒",
    title: "Coming Soon",
    sub: "SneakPeek drops with the launch.",
    duration: 4000
  });
});
/*==============================*/