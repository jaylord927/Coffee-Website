(function () {
  'use strict';

  const mount = document.getElementById('site-footer');
  if (!mount) return;

  const inHtmlFolder = /\/html\//i.test(window.location.pathname);
  const rootPrefix = inHtmlFolder ? '../' : '';
  const htmlPrefix = inHtmlFolder ? '' : 'html/';

  const footerUrl = rootPrefix + 'html/footer.html';

  fetch(footerUrl, { cache: 'no-cache' })
    .then(res => {
      if (!res.ok) throw new Error('Footer load failed: ' + res.status);
      return res.text();
    })
    .then(html => {
      const resolved = html
        .replace(/__ROOT__/g, rootPrefix)
        .replace(/__HTML__/g, htmlPrefix);

      mount.innerHTML = resolved;

      if (!document.querySelector('link[data-footer-css]')) {
        const link = document.createElement('link');
        link.rel = 'stylesheet';
        link.href = rootPrefix + 'css/footer.css';
        link.setAttribute('data-footer-css', 'true');
        document.head.appendChild(link);
      }

      const current = (window.location.pathname.split('/').pop() || 'index.html').toLowerCase();
      mount.querySelectorAll('a').forEach(a => {
        const href = (a.getAttribute('href') || '').split('/').pop().toLowerCase();
        if (href && href === current) {
          a.style.color = '#B25E27';
          a.style.fontWeight = '600';
        }
      });
    })
    .catch(err => {
      mount.innerHTML =
        '<footer class="site-footer">' +
        '  <div class="container" style="text-align:center;padding:2rem 0;">' +
        '    <p style="color:rgba(237,237,237,0.6);font-size:0.9rem;">' +
        '      © 2026 AiKoFe. All rights reserved.' +
        '    </p>' +
        '  </div>' +
        '</footer>';
      console.warn('[footer.js]', err.message);
    });
})();