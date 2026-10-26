/* Ammar Rajabi portfolio — site script */
(function () {
  window.__arReady = true;
  var root = document.documentElement;
  var lang = root.getAttribute('lang') === 'en' ? 'en' : 'fr';
  var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var T = {
    fr: { dark: 'Passer au thème sombre', light: 'Passer au thème clair', open: 'Ouvrir le menu', close: 'Fermer le menu',
          sending: 'Envoi…', sent: 'Message envoyé. Merci, je vous réponds rapidement.',
          error: 'Le message n’a pas pu être envoyé. Écrivez-moi directement : ammar.rajabi.web@gmail.com' },
    en: { dark: 'Switch to dark theme', light: 'Switch to light theme', open: 'Open menu', close: 'Close menu',
          sending: 'Sending…', sent: 'Message sent. Thank you, I will reply soon.',
          error: 'The message could not be sent. Please email me directly: ammar.rajabi.web@gmail.com' }
  }[lang];

  /* ---------- Theme ---------- */
  var themeButtons = document.querySelectorAll('[data-theme-toggle]');
  var themeMeta = document.querySelector('meta[name="theme-color"]');
  function currentTheme() {
    var t = root.getAttribute('data-theme');
    if (t) return t;
    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  }
  function syncTheme() {
    var dark = currentTheme() === 'dark';
    themeButtons.forEach(function (b) { b.setAttribute('aria-label', dark ? T.light : T.dark); });
    if (themeMeta) themeMeta.setAttribute('content', dark ? '#0A111E' : '#FFFFFF');
  }
  themeButtons.forEach(function (b) {
    b.addEventListener('click', function () {
      var next = currentTheme() === 'dark' ? 'light' : 'dark';
      root.setAttribute('data-theme', next);
      try { localStorage.setItem('ar-theme', next); } catch (e) {}
      syncTheme();
    });
  });
  syncTheme();

  /* ---------- Mobile menu ---------- */
  var header = document.querySelector('[data-header]');
  var menuBtn = document.querySelector('[data-menu]');
  var panel = document.getElementById('m-panel');
  function setMenu(open) {
    if (!menuBtn || !panel) return;
    root.classList.toggle('is-menu-open', open);
    menuBtn.setAttribute('aria-expanded', String(open));
    menuBtn.setAttribute('aria-label', open ? T.close : T.open);
    document.body.style.overflow = open ? 'hidden' : '';
    if (open) {
      var first = panel.querySelector('a');
      if (first) first.focus({ preventScroll: true });
    }
  }
  if (menuBtn && panel) {
    menuBtn.addEventListener('click', function () { setMenu(!root.classList.contains('is-menu-open')); });
    panel.querySelectorAll('a').forEach(function (a) { a.addEventListener('click', function () { setMenu(false); }); });
    document.addEventListener('keydown', function (e) {
      if (!root.classList.contains('is-menu-open')) return;
      if (e.key === 'Escape') { setMenu(false); menuBtn.focus({ preventScroll: true }); }
      if (e.key === 'Tab') {
        var items = [menuBtn].concat(Array.prototype.slice.call(panel.querySelectorAll('a')));
        var i = items.indexOf(document.activeElement);
        if (e.shiftKey && i <= 0) { e.preventDefault(); items[items.length - 1].focus(); }
        else if (!e.shiftKey && i === items.length - 1) { e.preventDefault(); items[0].focus(); }
      }
    });
    var desktop = window.matchMedia('(min-width: 921px)');
    var onDesktop = function (m) { if (m.matches) setMenu(false); };
    if (desktop.addEventListener) desktop.addEventListener('change', onDesktop);
  }

  /* ---------- Entrance ---------- */
  document.querySelectorAll('[data-hero]').forEach(function (hero) {
    requestAnimationFrame(function () { requestAnimationFrame(function () { hero.classList.add('is-in'); }); });
  });

  /* ---------- Reveal on scroll ---------- */
  var revealables = document.querySelectorAll('.reveal-img, .rise');
  if ('IntersectionObserver' in window && !reduce) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (en.isIntersecting) { en.target.classList.add('is-shown'); io.unobserve(en.target); }
      });
    }, { rootMargin: '0px 0px -10% 0px' });
    revealables.forEach(function (el) { io.observe(el); });
  } else {
    revealables.forEach(function (el) { el.classList.add('is-shown'); });
  }

  /* ---------- Scroll: header state, progress, light parallax ---------- */
  var bar = document.querySelector('.progress span');
  var fine = window.matchMedia('(hover: hover) and (pointer: fine) and (min-width: 921px)').matches;
  var floaters = document.querySelectorAll('.project .phone, .project .photo-small');
  var ticking = false;
  var maxScroll = 0;
  function measure() { maxScroll = document.documentElement.scrollHeight - window.innerHeight; }
  function onScroll() {
    var y = window.scrollY;
    if (header) header.classList.toggle('is-scrolled', y > 8);
    if (bar) bar.style.transform = 'scaleX(' + (maxScroll > 0 ? Math.min(y / maxScroll, 1) : 0) + ')';
    if (fine && !reduce && floaters.length) {
      var vh = window.innerHeight;
      // read all positions first, then write (no layout thrashing)
      var rects = Array.prototype.map.call(floaters, function (el) { return el.parentElement.getBoundingClientRect(); });
      floaters.forEach(function (el, i) {
        var c = (rects[i].top + rects[i].height / 2 - vh / 2) / vh;
        el.style.transform = 'translateY(' + (c * -28).toFixed(1) + 'px)';
      });
    }
    ticking = false;
  }
  function queue() { if (!ticking) { ticking = true; requestAnimationFrame(onScroll); } }
  window.addEventListener('scroll', queue, { passive: true });
  window.addEventListener('resize', function () { measure(); queue(); }, { passive: true });
  window.addEventListener('load', function () { measure(); queue(); });
  requestAnimationFrame(function () { measure(); onScroll(); });

  /* ---------- Before / after switch (mobile) ---------- */
  document.querySelectorAll('.pair-label').forEach(function (label) {
    var pair = label.nextElementSibling;
    if (!pair) return;
    label.querySelectorAll('[data-show]').forEach(function (b) {
      b.addEventListener('click', function () {
        pair.setAttribute('data-show', b.getAttribute('data-show'));
        label.querySelectorAll('[data-show]').forEach(function (x) { x.setAttribute('aria-selected', String(x === b)); });
      });
    });
  });

  /* ---------- Gallery viewer: zoom only the image (pinch, double-tap, wheel), swipe, keyboard ---------- */
  (function () {
  var openers = Array.prototype.slice.call(document.querySelectorAll('[data-lightbox-src]'));
  if (openers.length) {
    var VT = lang === 'en'
      ? { label: 'Image viewer', close: 'Close', prev: 'Previous image', next: 'Next image', zin: 'Zoom in', zout: 'Zoom out', hint: 'Pinch or double-tap to zoom · swipe to browse' }
      : { label: 'Visionneuse d’images', close: 'Fermer', prev: 'Image précédente', next: 'Image suivante', zin: 'Zoomer', zout: 'Dézoomer', hint: 'Pincez ou touchez deux fois pour zoomer · glissez pour changer' };
    var ic = function (d) { return '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="' + d + '"/></svg>'; };
    var v, stage, img, capEl, countEl, prevB, nextB, hintEl;
    var idx = 0, S = 1, X = 0, Y = 0, baseW = 0, baseH = 0, lastFocus = null, token = 0;
    var MAX = 5;

    function build() {
      v = document.createElement('dialog');
      v.className = 'viewer';
      v.setAttribute('aria-label', VT.label);
      v.innerHTML =
        '<div class="v-top"><span class="v-count" aria-live="polite"></span><div class="v-tools">' +
        '<button type="button" class="v-btn v-zout" aria-label="' + VT.zout + '">' + ic('M5 12h14') + '</button>' +
        '<button type="button" class="v-btn v-zin" aria-label="' + VT.zin + '">' + ic('M12 5v14M5 12h14') + '</button>' +
        '<button type="button" class="v-btn v-close" aria-label="' + VT.close + '">' + ic('M6 6l12 12M18 6 6 18') + '</button></div></div>' +
        '<div class="v-stage"><img class="v-img" alt="" draggable="false"></div>' +
        '<button type="button" class="v-btn v-nav v-prev" aria-label="' + VT.prev + '">' + ic('M15 5l-7 7 7 7') + '</button>' +
        '<button type="button" class="v-btn v-nav v-next" aria-label="' + VT.next + '">' + ic('M9 5l7 7-7 7') + '</button>' +
        '<p class="v-cap"></p><p class="v-hint">' + VT.hint + '</p>';
      document.body.appendChild(v);
      stage = v.querySelector('.v-stage'); img = v.querySelector('.v-img');
      capEl = v.querySelector('.v-cap'); countEl = v.querySelector('.v-count');
      prevB = v.querySelector('.v-prev'); nextB = v.querySelector('.v-next'); hintEl = v.querySelector('.v-hint');
      v.querySelector('.v-close').addEventListener('click', close);
      v.querySelector('.v-zin').addEventListener('click', function () { zoomAt(S * 1.6, 0, 0, true); });
      v.querySelector('.v-zout').addEventListener('click', function () { zoomAt(S / 1.6, 0, 0, true); });
      prevB.addEventListener('click', function () { go(-1); });
      nextB.addEventListener('click', function () { go(1); });
      v.addEventListener('cancel', function (e) { e.preventDefault(); close(); });
      v.addEventListener('close', cleanup);
      v.addEventListener('keydown', function (e) {
        if (e.key === 'ArrowRight') { go(1); e.preventDefault(); }
        else if (e.key === 'ArrowLeft') { go(-1); e.preventDefault(); }
        else if (e.key === '+' || e.key === '=') zoomAt(S * 1.6, 0, 0, true);
        else if (e.key === '-') zoomAt(S / 1.6, 0, 0, true);
        else if (e.key === '0') reset(true);
      });
      img.addEventListener('load', measure);
      window.addEventListener('resize', function () { if (v.open) { measure(); clampApply(false); } });
      bindGestures();
    }

    function measure() {
      var r = stage.getBoundingClientRect();
      var nw = img.naturalWidth || 4, nh = img.naturalHeight || 3;
      var k = Math.min(r.width / nw, r.height / nh);
      baseW = nw * k; baseH = nh * k;
      img.style.width = baseW + 'px'; img.style.height = baseH + 'px';
    }
    function limits() {
      var r = stage.getBoundingClientRect();
      return { x: Math.max(0, (baseW * S - r.width) / 2), y: Math.max(0, (baseH * S - r.height) / 2) };
    }
    function apply(anim) {
      img.classList.toggle('anim', !!anim && !reduce);
      img.style.transform = 'translate3d(' + X + 'px,' + Y + 'px,0) scale(' + S + ')';
      v.classList.toggle('zoomed', S > 1.01);
    }
    function clampApply(anim) {
      var L = limits();
      X = Math.min(L.x, Math.max(-L.x, X)); Y = Math.min(L.y, Math.max(-L.y, Y));
      apply(anim);
    }
    // zoom keeping the point (px, py) — relative to the stage centre — fixed
    function zoomAt(ns, px, py, anim) {
      ns = Math.min(MAX, Math.max(1, ns));
      X = px - (px - X) * (ns / S); Y = py - (py - Y) * (ns / S); S = ns;
      if (S === 1) { X = 0; Y = 0; }
      clampApply(anim);
    }
    function reset(anim) { S = 1; X = 0; Y = 0; apply(anim); }
    function rel(e) { var r = stage.getBoundingClientRect(); return { x: e.clientX - r.left - r.width / 2, y: e.clientY - r.top - r.height / 2 }; }

    function show(i) {
      idx = (i + openers.length) % openers.length;
      var b = openers[idx], t = ++token;
      var thumb = b.querySelector('img');
      reset(false);
      img.style.opacity = '1';
      img.src = thumb ? (thumb.currentSrc || thumb.src) : b.getAttribute('data-lightbox-src');
      img.alt = thumb ? thumb.alt : '';
      var full = new Image();
      full.decoding = 'async';
      full.onload = function () { if (t === token) { img.src = full.src; preload(idx + 1); preload(idx - 1); } };
      full.src = b.getAttribute('data-lightbox-src');
      var fig = b.closest('figure');
      var span = fig && fig.querySelector('figcaption span');
      var title = b.getAttribute('data-lightbox-title') || '';
      capEl.innerHTML = '';
      if (title) { var st = document.createElement('strong'); st.textContent = title; capEl.appendChild(st); }
      if (span) { var sp = document.createElement('span'); sp.textContent = span.textContent; capEl.appendChild(sp); }
      countEl.textContent = (idx + 1) + ' / ' + openers.length;
      var many = openers.length > 1;
      prevB.hidden = !many; nextB.hidden = !many;
    }
    function preload(i) {
      var b = openers[(i + openers.length) % openers.length];
      var p = new Image(); p.decoding = 'async'; p.src = b.getAttribute('data-lightbox-src');
    }
    function go(d) { if (openers.length > 1) show(idx + d); }

    function open(i) {
      if (!v) build();
      lastFocus = document.activeElement;
      root.classList.add('v-lock');
      if (typeof v.showModal === 'function') v.showModal(); else v.setAttribute('open', '');
      measure();
      show(i);
      try {
        if (window.matchMedia('(pointer: coarse)').matches && !sessionStorage.getItem('ar-vhint')) {
          v.classList.add('hint'); sessionStorage.setItem('ar-vhint', '1');
          setTimeout(function () { v.classList.remove('hint'); }, 2600);
        }
      } catch (e) {}
    }
    function close() { if (v.open && typeof v.close === 'function') v.close(); else { v.removeAttribute('open'); cleanup(); } }
    function cleanup() {
      root.classList.remove('v-lock'); token++;
      img.removeAttribute('src');
      if (lastFocus && lastFocus.focus) lastFocus.focus({ preventScroll: true });
    }

    function bindGestures() {
      var pts = {}, n = 0, start = null, pinch = null, lastTap = 0, swipeX = 0, swipeY = 0, moved = false;
      stage.addEventListener('pointerdown', function (e) {
        stage.setPointerCapture(e.pointerId);
        pts[e.pointerId] = { x: e.clientX, y: e.clientY }; n = Object.keys(pts).length;
        moved = false;
        if (n === 1) start = { x: e.clientX, y: e.clientY, X: X, Y: Y, t: Date.now() };
        if (n === 2) {
          var k = Object.keys(pts), a = pts[k[0]], b = pts[k[1]];
          pinch = { d: Math.hypot(a.x - b.x, a.y - b.y), S: S, m: rel({ clientX: (a.x + b.x) / 2, clientY: (a.y + b.y) / 2 }), X: X, Y: Y };
        }
      });
      stage.addEventListener('pointermove', function (e) {
        if (!pts[e.pointerId]) return;
        pts[e.pointerId] = { x: e.clientX, y: e.clientY };
        if (n === 2 && pinch) {
          var k = Object.keys(pts), a = pts[k[0]], b = pts[k[1]];
          var ns = Math.min(MAX, Math.max(1, pinch.S * Math.hypot(a.x - b.x, a.y - b.y) / pinch.d));
          var m = rel({ clientX: (a.x + b.x) / 2, clientY: (a.y + b.y) / 2 });
          S = ns;
          X = m.x - (pinch.m.x - pinch.X) * (ns / pinch.S);
          Y = m.y - (pinch.m.y - pinch.Y) * (ns / pinch.S);
          clampApply(false); moved = true; return;
        }
        if (n === 1 && start) {
          var dx = e.clientX - start.x, dy = e.clientY - start.y;
          if (Math.abs(dx) > 6 || Math.abs(dy) > 6) moved = true;
          if (S > 1.01) { X = start.X + dx; Y = start.Y + dy; clampApply(false); }
          else {
            swipeX = dx; swipeY = dy;
            if (Math.abs(dy) > Math.abs(dx) && dy > 0) { img.style.transform = 'translate3d(0,' + dy + 'px,0)'; v.style.setProperty('--vfade', String(Math.max(.35, 1 - dy / 500))); }
            else img.style.transform = 'translate3d(' + dx + 'px,0,0)';
          }
        }
      });
      function end(e) {
        if (!pts[e.pointerId]) return;
        delete pts[e.pointerId]; n = Object.keys(pts).length;
        if (n < 2) pinch = null;
        if (n === 1) { var k = Object.keys(pts)[0]; start = { x: pts[k].x, y: pts[k].y, X: X, Y: Y, t: Date.now() }; return; }
        if (n > 0) return;
        v.style.removeProperty('--vfade');
        if (S <= 1.01 && moved) {
          if (Math.abs(swipeX) > 60 && Math.abs(swipeX) > Math.abs(swipeY)) { go(swipeX < 0 ? 1 : -1); }
          else if (swipeY > 110 && swipeY > Math.abs(swipeX)) { close(); }
          else reset(true);
        } else if (S <= 1.01) reset(false);
        if (!moved && e.type === 'pointerup') {
          var now = Date.now();
          if (now - lastTap < 300) { var p = rel(e); if (S > 1.01) reset(true); else zoomAt(2.5, p.x, p.y, true); lastTap = 0; }
          else lastTap = now;
        }
        swipeX = 0; swipeY = 0; start = null;
      }
      stage.addEventListener('pointerup', end);
      stage.addEventListener('pointercancel', end);
      stage.addEventListener('wheel', function (e) {
        e.preventDefault();
        var p = rel(e);
        zoomAt(S * Math.exp(-e.deltaY * (e.ctrlKey ? 0.01 : 0.0018)), p.x, p.y, false);
      }, { passive: false });
      // click on the dark backdrop (not on the image) closes, on desktop
      stage.addEventListener('click', function (e) {
        if (e.target === stage && S <= 1.01 && !moved && window.matchMedia('(pointer: fine)').matches) close();
      });
    }

    openers.forEach(function (b, i) {
      b.addEventListener('click', function (e) { e.preventDefault(); open(i); });
    });
  }
  })();

  /* ---------- Contact form (posts to contact.php) ---------- */
  var form = document.querySelector('[data-contact-form]');
  if (form && window.fetch) {
    var status = form.querySelector('[data-form-status]');
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      status.textContent = '';
      status.classList.remove('ok');
      if (!form.reportValidity()) return;
      var btn = form.querySelector('button[type="submit"]');
      var label = btn.textContent;
      btn.disabled = true;
      btn.textContent = T.sending;
      fetch(form.action, { method: 'POST', body: new FormData(form), headers: { 'X-Requested-With': 'XMLHttpRequest' } })
        .then(function (r) { return r.json().then(function (d) { return { ok: r.ok, d: d }; }); })
        .then(function (res) {
          if (!res.ok || !res.d.success) throw new Error('send');
          status.textContent = T.sent;
          status.classList.add('ok');
          form.reset();
        })
        .catch(function () { status.textContent = T.error; })
        .then(function () { btn.disabled = false; btn.textContent = label; });
    });
  }


  /* ---------- Copy e-mail ---------- */
  document.querySelectorAll('[data-copy]').forEach(function (btn) {
    var label = btn.textContent;
    var status = btn.parentElement ? btn.parentElement.querySelector('.copy-status') : null;
    btn.addEventListener('click', function () {
      var text = btn.getAttribute('data-copy');
      var done = function () {
        btn.textContent = btn.getAttribute('data-done');
        btn.classList.add('is-done');
        if (status) status.textContent = btn.getAttribute('data-done');
        setTimeout(function () { btn.textContent = label; btn.classList.remove('is-done'); if (status) status.textContent = ''; }, 2000);
      };
      if (navigator.clipboard && window.isSecureContext) {
        navigator.clipboard.writeText(text).then(done, function () { fallback(); });
      } else { fallback(); }
      function fallback() {
        var t = document.createElement('textarea');
        t.value = text; t.setAttribute('readonly', ''); t.style.position = 'fixed'; t.style.opacity = '0';
        document.body.appendChild(t); t.select();
        try { document.execCommand('copy'); done(); } catch (e) { window.location.href = 'mailto:' + text; }
        document.body.removeChild(t);
      }
    });
  });

  /* ---------- Back to top ---------- */
  var toTop = document.querySelector('[data-to-top]');
  if (toTop) {
    var toTopVisible = false;
    var updateToTop = function () {
      var show = window.scrollY > Math.max(600, window.innerHeight * 0.9);
      if (show !== toTopVisible) { toTopVisible = show; toTop.classList.toggle('is-visible', show); }
    };
    window.addEventListener('scroll', updateToTop, { passive: true });
    updateToTop();
    toTop.addEventListener('click', function () {
      var start = window.scrollY;
      var brand = document.querySelector('.mark');
      var done = function () { if (brand) brand.focus({ preventScroll: true }); };
      if (reduce || start <= 0) { window.scrollTo(0, 0); done(); return; }
      var mobile = window.innerWidth <= 700;
      var ratio = Math.min(start / 4000, 1);
      var duration = mobile ? 760 + 160 * ratio : 560 + 200 * ratio;
      var t0 = null;
      var ease = function (x) { return -(Math.cos(Math.PI * x) - 1) / 2; };
      var step = function (now) {
        if (t0 === null) t0 = now;
        var p = Math.min((now - t0) / duration, 1);
        window.scrollTo(0, Math.round(start * (1 - ease(p))));
        if (p < 1) requestAnimationFrame(step); else done();
      };
      requestAnimationFrame(step);
    });
  }

  document.querySelectorAll('[data-year]').forEach(function (el) { el.textContent = new Date().getFullYear(); });
})();
