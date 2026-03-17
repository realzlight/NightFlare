const menubtn = document.getElementById("menu");
const mainweb = document.getElementById("mainWeb");
const HamMenu = document.getElementById("HamMenu");
const closeBtn = document.querySelector(".close-btn");

// Open Hamburger Menu
menubtn.addEventListener("click", () => {
  mainweb.style.display = "none";
  HamMenu.style.display = "flex";
});

// Close Hamburger Menu (X button)
closeBtn.addEventListener("click", () => {
  HamMenu.style.display = "none";
  mainweb.style.display = "block";
});

// Close menu when navigation link is clicked
const navLinks = document.querySelectorAll(".menu-list a");

navLinks.forEach(link => {
  link.addEventListener("click", () => {
    setTimeout(()=>{
      HamMenu.style.display = "none";
    mainweb.style.display = "block";
      
    },400)
    
  });
});