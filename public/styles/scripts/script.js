const hamburger = document.querySelector('.hamburger')
const navLinks = document.querySelector('.nav-links')

if (hamburger) {
  hamburger.addEventListener('click', function() {
    hamburger.classList.toggle('open')
    navLinks.classList.toggle('open')
  })
}