const menubtn = document.getElementById("menu");
const mainweb = document.getElementById("mainWeb");
const HamMenu = document.getElementById("HamMenu");
const closeBtn = document.querySelector(".close-btn");

// Open Hamburger Menu
menubtn.addEventListener('click', () => {
  mainweb.style.display = "none"; // Hide main section
  HamMenu.style.display = "flex"; // Show menu as flex
});

// Close Hamburger Menu
closeBtn.addEventListener('click', () => {
  HamMenu.style.display = "none"; // Hide menu
  mainweb.style.display = "block"; // Show main section
});







