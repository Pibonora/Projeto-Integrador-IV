// Animação

document.addEventListener('DOMContentLoaded', (event) => {
  let menu = document.querySelector('#menu-icon');
  let navbar = document.querySelector('.navbar');

  menu.onclick = () => {
    menu.classList.toggle('bx-x');
    navbar.classList.toggle('open');
  };
});

const sr = ScrollReveal({
  distance: '40px',
  duration: 2500,
  reset: true
});
sr.reveal('.logo', { delay: 200, origin: 'left' });
sr.reveal('.menu-btn', { delay: 520, origin: 'right' });
sr.reveal('.home-text span', { delay: 600, origin: 'top' });
sr.reveal('.home-text h1', { delay: 680, origin: 'left' });
sr.reveal('.home-text p', { delay: 750, origin: 'right' });
sr.reveal('.home', { delay: 860, origin: 'bottom' });
sr.reveal('.social', { delay: 950, origin: 'bottom' });
sr.reveal('.home-img', { delay: 1000, origin: 'right' });
sr.reveal('.container-card', { delay: 500, origin: 'right' });
sr.reveal('.menu-btn-constraste', { delay: 600, origin: 'right' });
sr.reveal('.enabled', { delay: 700, origin: 'right' });

function toggle() {
  var element = document.getElementById("body");
  element.classList.toggle("body2");
}
