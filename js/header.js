const burger = document.getElementById('burger');
const nav = document.getElementById('nav');
const overlay = document.getElementById('menu-overlay');

function setMenu(open) {
  if (burger) {
    burger.classList.toggle('active', open);
    burger.setAttribute('aria-expanded', open ? 'true' : 'false');
    burger.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
  }
  if (nav) nav.classList.toggle('active', open);
  if (overlay) overlay.classList.toggle('active', open);
  document.body.classList.toggle('menu-open', open);
}

function closeMenu() {
  setMenu(false);
}

if (burger && nav && overlay) {
  burger.addEventListener('click', () => {
    setMenu(!burger.classList.contains('active'));
  });

  burger.addEventListener('keydown', (event) => {
    if (event.key !== 'Enter' && event.key !== ' ') return;
    event.preventDefault();
    setMenu(!burger.classList.contains('active'));
  });

  overlay.addEventListener('click', closeMenu);
}

document.querySelectorAll('.nav a').forEach(link => {
  link.addEventListener('click', closeMenu);
});
