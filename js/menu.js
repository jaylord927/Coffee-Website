/* Menu page interactivity */

// Mobile nav
const hamburger = document.getElementById('hamburger');
const navLinks  = document.getElementById('navLinks');
hamburger.addEventListener('click', () => {
  hamburger.classList.toggle('open');
  navLinks.classList.toggle('open');
});
navLinks.querySelectorAll('a').forEach(link => {
  link.addEventListener('click', () => {
    hamburger.classList.remove('open');
    navLinks.classList.remove('open');
  });
});

// Navbar scroll
const navbar = document.getElementById('navbar');
window.addEventListener('scroll', () => {
  navbar.classList.toggle('scrolled', window.scrollY > 50);
});

// Category filter
const filterBtns = document.querySelectorAll('.filter-btn');
const menuItems  = document.querySelectorAll('.menu-item');
const menuNote   = document.getElementById('menuNote');

filterBtns.forEach(btn => {
  btn.addEventListener('click', () => {
    filterBtns.forEach(b => b.classList.remove('active'));
    btn.classList.add('active');

    const category = btn.dataset.category;
    let count = 0;
    menuItems.forEach(item => {
      const match = category === 'all' || item.dataset.category === category;
      item.classList.toggle('hidden', !match);
      if (match) count++;
    });

    menuNote.textContent = `Showing ${count} item${count !== 1 ? 's' : ''} in "${btn.textContent.trim()}".`;
  });
});
menuNote.textContent = '';