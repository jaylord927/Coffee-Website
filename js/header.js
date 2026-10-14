(function () {
  'use strict';

  if (window.__headerInitDone) return;
  window.__headerInitDone = true;

  const mount = document.getElementById('site-header');
  if (!mount) return;

  const inHtmlFolder = /\/html\//i.test(window.location.pathname);
  const rootPrefix = inHtmlFolder ? '../' : '';
  const htmlPrefix = inHtmlFolder ? '' : 'html/';

  const headerUrl = rootPrefix + 'html/header.html';

  function ensureStylesheet() {
    if (document.querySelector('link[data-header-css]')) return;
    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = rootPrefix + 'css/header.css';
    link.setAttribute('data-header-css', 'true');
    document.head.appendChild(link);
  }

  function markActiveLink(root) {
    const current = (window.location.pathname.split('/').pop() || 'index.html').toLowerCase();
    root.querySelectorAll('.nav-links a').forEach(a => {
      const target = (a.getAttribute('data-page') || '').toLowerCase();
      a.classList.toggle('active', Boolean(target) && target === current);
    });
  }

  function wireInteractions(root) {
    const hamburger = root.querySelector('#hamburger');
    const navLinks = root.querySelector('#navLinks');
    const backdrop = root.querySelector('#navBackdrop');
    if (!hamburger || !navLinks) return;

    function openNav() {
      hamburger.classList.add('open');
      navLinks.classList.add('open');
      hamburger.setAttribute('aria-expanded', 'true');
      if (backdrop) backdrop.classList.add('show');
      document.body.style.overflow = 'hidden';
    }

    function closeNav() {
      hamburger.classList.remove('open');
      navLinks.classList.remove('open');
      hamburger.setAttribute('aria-expanded', 'false');
      if (backdrop) backdrop.classList.remove('show');
      document.body.style.overflow = '';
    }

    function toggleNav() {
      navLinks.classList.contains('open') ? closeNav() : openNav();
    }

    hamburger.addEventListener('click', toggleNav);
    navLinks.querySelectorAll('a').forEach(link => link.addEventListener('click', closeNav));
    if (backdrop) backdrop.addEventListener('click', closeNav);

    document.addEventListener('keydown', e => {
      if (e.key === 'Escape' && navLinks.classList.contains('open')) closeNav();
    });

    const mq = window.matchMedia('(min-width: 769px)');
    const handleResize = e => { if (e.matches) closeNav(); };
    if (mq.addEventListener) mq.addEventListener('change', handleResize);
    else mq.addListener(handleResize);
  }

  function wireScroll(root) {
    function onScroll() {
      root.classList.toggle('scrolled', window.scrollY > 50);
    }
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
  }

  ensureStylesheet();

  fetch(headerUrl, { cache: 'no-cache' })
    .then(res => {
      if (!res.ok) throw new Error('Header load failed: ' + res.status);
      return res.text();
    })
    .then(html => {
      const resolved = html
        .replace(/__ROOT__/g, rootPrefix)
        .replace(/__HTML__/g, htmlPrefix);

      mount.innerHTML = resolved;
      document.body.classList.add('has-site-header');

      const headerEl = mount.querySelector('.site-header');
      if (!headerEl) return;

      markActiveLink(headerEl);
      wireInteractions(headerEl);
      wireScroll(headerEl);
    })
    .catch(err => {
      mount.innerHTML =
        '<header class="site-header" style="background:#fff;box-shadow:0 2px 8px rgba(0,0,0,.08);">' +
        '  <div class="nav-wrap" style="display:flex;justify-content:space-between;align-items:center;padding:1rem 4%;">' +
        '    <a href="' + rootPrefix + 'index.html" style="font-weight:700;color:#0D0504;text-decoration:none;">AiKoFe</a>' +
        '    <a href="' + htmlPrefix + 'contact.html" style="color:#B25E27;text-decoration:none;font-weight:600;">Contact</a>' +
        '  </div>' +
        '</header>';
      document.body.classList.add('has-site-header');
      console.warn('[header.js]', err.message);
    });
})();