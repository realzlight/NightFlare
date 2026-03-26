/* =========================
   SOUND SYSTEM
========================= */
const tick = new Audio("tic.mp3");
tick.volume = 1;
let soundUnlocked = false;

function unlockSound() {
  if (soundUnlocked) return;
  tick.play().then(() => {
    tick.pause();
    tick.currentTime = 0;
    soundUnlocked = true;
    startProgress();
  }).catch(() => {});
}

document.addEventListener("click", unlockSound, { once: true });
document.addEventListener("touchstart", unlockSound, { once: true });


/* =========================
   COUNTDOWN
========================= */
const launchDate = new Date(2026, 3, 1, 0, 0, 0).getTime(); // April 1 2026

function updateCountdown() {
  const diff = launchDate - Date.now();
  if (diff <= 0) {
    document.querySelector(".countdown").innerHTML = "LIVE 🚀";
    return;
  }
  document.getElementById("days").textContent    = String(Math.floor(diff / 86400000)).padStart(2, "0");
  document.getElementById("hours").textContent   = String(Math.floor((diff / 3600000) % 24)).padStart(2, "0");
  document.getElementById("minutes").textContent = String(Math.floor((diff / 60000) % 60)).padStart(2, "0");
  document.getElementById("seconds").textContent = String(Math.floor((diff / 1000) % 60)).padStart(2, "0");
}

setInterval(updateCountdown, 1000);
updateCountdown();


/* =========================
   DIALOG SYSTEM
========================= */
const dialogs = document.querySelectorAll(".dialog");
const nav1    = document.querySelector(".nav1");   // ← single declaration used everywhere

let current     = 0;
let isAnimating = false;
const duration  = 600;
const delay     = 5000;
let timer;
let tickInterval;


/* =========================
   PROGRESS BAR
========================= */
const progressContainer = document.createElement("div");
progressContainer.className = "progress-container";

dialogs.forEach(() => {
  const seg  = document.createElement("div");
  seg.className = "progress-seg";
  const fill = document.createElement("div");
  fill.className = "progress-fill";
  seg.appendChild(fill);
  progressContainer.appendChild(seg);
});

nav1.appendChild(progressContainer);


/* =========================
   START PROGRESS
========================= */
function startProgress() {
  clearTimeout(timer);
  clearInterval(tickInterval);

  const fills = document.querySelectorAll(".progress-fill");
  fills.forEach((f, i) => {
    f.style.transition = "none";
    f.style.width = i < current ? "100%" : "0%";
  });

  const activeFill = fills[current];
  progressContainer.offsetHeight; // force reflow

  setTimeout(() => {
    activeFill.style.transition = `width ${delay}ms linear`;
    activeFill.style.width = "100%";

    tickInterval = setInterval(() => {
      if (soundUnlocked) {
        tick.currentTime = 0;
        tick.play().catch(() => {});
      }
    }, 1000);
  }, 20);

  timer = setTimeout(() => {
    clearInterval(tickInterval);
    goNext();
  }, delay);
}


/* =========================
   DIALOG SWITCH LOGIC
========================= */
function goNext() { goTo((current + 1) % dialogs.length, "up"); }
function goPrev() { goTo((current - 1 + dialogs.length) % dialogs.length, "down"); }

function goTo(index, direction) {
  if (isAnimating || index === current) return;
  isAnimating = true;

  const currentEl = dialogs[current];
  const nextEl    = dialogs[index];

  dialogs.forEach(d => d.classList.remove("exit-up", "exit-down", "enter-up", "enter-down"));

  currentEl.querySelector(".bg").style.transform = direction === "up" ? "translateY(-30%)" : "translateY(30%)";
  nextEl.querySelector(".bg").style.transform    = direction === "up" ? "translateY(30%)"  : "translateY(-30%)";

  currentEl.classList.remove("active");
  currentEl.classList.add(direction === "up" ? "exit-up" : "exit-down");
  nextEl.classList.add(direction === "up" ? "enter-up" : "enter-down");

  setTimeout(() => {
    nextEl.classList.add("active");
    nextEl.classList.remove("enter-up", "enter-down");
  }, 50);

  setTimeout(() => {
    currentEl.classList.remove("exit-up", "exit-down");
    currentEl.querySelector(".bg").style.transform = "";
    nextEl.querySelector(".bg").style.transform    = "";
    current     = index;
    isAnimating = false;
    startProgress();
  }, duration);
}

startProgress();


/* =========================
   HAMBURGER MENU
========================= */
const sneakpeak = document.querySelector(".navbtn")
sneakpeak.addEventListener("click", () => fullMenu.classList.add("active"));

document.getElementById("menuClose").addEventListener("click", () => {
  fullMenu.classList.remove("active");
});


const menuIcon = document.getElementById("menu");
const fullMenu = document.querySelector(".fullmenu");

menuIcon.addEventListener("click", () => fullMenu.classList.add("active"));

document.getElementById("menuClose").addEventListener("click", () => {
  fullMenu.classList.remove("active");
});

fullMenu.querySelectorAll(".menu-links a").forEach(link => {
  link.addEventListener("click", () => fullMenu.classList.remove("active"));
});

/* NAV1 TOGGLE SWITCH */
const nav1Switch = document.getElementById("nav1Switch");
nav1Switch.classList.add("active");

nav1Switch.addEventListener("click", () => {
  nav1Switch.classList.toggle("active");
  const isEnabled = nav1Switch.classList.contains("active");
  nav1.style.display = isEnabled ? "flex" : "none";
});


