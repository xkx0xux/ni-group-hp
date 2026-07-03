/* NI Group — Proposal Demo（夜明けシネマ演出） */
(function () {
  'use strict';

  var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var hasGsap = typeof window.gsap !== 'undefined' && typeof window.ScrollTrigger !== 'undefined';
  var cinematic = hasGsap && !reduceMotion;

  var header = document.getElementById('siteHeader');
  var hero = document.querySelector('.hero');

  /* ---------- Header: スクロールで影 ---------- */
  function onScroll() {
    header.classList.toggle('is-scrolled', window.scrollY > 8);
    /* シネマ無効時のフォールバック：ヒーローを抜けたら昼テーマへ */
    if (!cinematic && hero) {
      header.classList.toggle('on-night', window.scrollY < hero.offsetHeight - 90);
    }
  }
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  /* ---------- Mobile Nav ---------- */
  var toggle = document.getElementById('navToggle');
  var nav = document.getElementById('siteNav');
  if (toggle && nav) {
    toggle.addEventListener('click', function () {
      var open = toggle.getAttribute('aria-expanded') === 'true';
      toggle.setAttribute('aria-expanded', String(!open));
      document.body.classList.toggle('nav-open', !open);
    });
    nav.addEventListener('click', function (e) {
      if (e.target.closest('a')) {
        toggle.setAttribute('aria-expanded', 'false');
        document.body.classList.remove('nav-open');
      }
    });
  }

  /* ---------- 星空（ヒーロー） ---------- */
  var starField = document.getElementById('heroStars');
  if (starField) {
    var starCount = window.innerWidth < 768 ? 34 : 64;
    var frag = document.createDocumentFragment();
    for (var s = 0; s < starCount; s++) {
      var star = document.createElement('i');
      var size = Math.random() < 0.85 ? 1.5 : 2.5;
      star.style.width = size + 'px';
      star.style.height = size + 'px';
      star.style.left = (Math.random() * 100) + '%';
      star.style.top = (Math.random() * 88) + '%';
      star.style.setProperty('--o', String(0.18 + Math.random() * 0.5));
      star.style.setProperty('--tw', (2.4 + Math.random() * 3.6).toFixed(2) + 's');
      star.style.setProperty('--twd', (Math.random() * 4).toFixed(2) + 's');
      if (Math.random() < 0.3) star.style.background = '#C4B5FD';
      frag.appendChild(star);
    }
    starField.appendChild(frag);
  }

  /* ---------- スクロール出現（IO・GSAP非依存の土台） ---------- */
  var revealEls = document.querySelectorAll('.reveal');
  if (revealEls.length && 'IntersectionObserver' in window && !reduceMotion) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-in');
          io.unobserve(entry.target);
        }
      });
    }, { threshold: 0.16, rootMargin: '0px 0px -8% 0px' });
    revealEls.forEach(function (el) { io.observe(el); });
  } else {
    revealEls.forEach(function (el) { el.classList.add('is-in'); });
  }

  /* ---------- 数字カウントアップ ---------- */
  var counters = document.querySelectorAll('[data-count]');
  function animateCount(el) {
    var target = parseFloat(el.getAttribute('data-count'));
    var duration = 1200;
    var start = null;
    function tick(ts) {
      if (!start) start = ts;
      var p = Math.min((ts - start) / duration, 1);
      var eased = 1 - Math.pow(1 - p, 3);
      el.textContent = Math.round(target * eased).toLocaleString('ja-JP');
      if (p < 1) requestAnimationFrame(tick);
    }
    requestAnimationFrame(tick);
  }
  if (counters.length) {
    if ('IntersectionObserver' in window && !reduceMotion) {
      var cio = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            animateCount(entry.target);
            cio.unobserve(entry.target);
          }
        });
      }, { threshold: 0.5 });
      counters.forEach(function (el) { cio.observe(el); });
    } else {
      counters.forEach(function (el) {
        el.textContent = parseFloat(el.getAttribute('data-count')).toLocaleString('ja-JP');
      });
    }
  }

  /* =========================================================
     シネマ演出（GSAP + Lenis）
     ========================================================= */
  if (!cinematic) return;

  gsap.registerPlugin(ScrollTrigger);

  /* ---------- Lenis 慣性スクロール ---------- */
  var lenis = null;
  if (typeof window.Lenis !== 'undefined') {
    lenis = new Lenis({ lerp: 0.1 });
    lenis.on('scroll', ScrollTrigger.update);
    gsap.ticker.add(function (time) { lenis.raf(time * 1000); });
    gsap.ticker.lagSmoothing(0);
  }

  /* アンカーは Lenis 経由でなめらかに */
  document.querySelectorAll('a[href^="#"]').forEach(function (a) {
    a.addEventListener('click', function (e) {
      var id = a.getAttribute('href');
      if (id.length < 2) {
        if (lenis) { e.preventDefault(); lenis.scrollTo(0); }
        return;
      }
      var target = document.querySelector(id);
      if (target && lenis) {
        e.preventDefault();
        lenis.scrollTo(target, { offset: -70 });
      }
    });
  });

  /* ---------- ヒーロー：視差＋去り際のフェード ---------- */
  gsap.to('.hero-bg', {
    yPercent: 16, ease: 'none',
    scrollTrigger: { trigger: '.hero', start: 'top top', end: 'bottom top', scrub: true }
  });
  gsap.to('.hero-inner', {
    y: -48, opacity: 0.15, ease: 'none',
    scrollTrigger: { trigger: '.hero', start: '28% top', end: 'bottom top', scrub: true }
  });

  /* ---------- ステートメント：夜明け（ピン留め＋明転） ---------- */
  var statement = document.querySelector('.statement');
  var stWords = document.querySelectorAll('#statementText .st-w');
  var stSubWords = document.querySelectorAll('#statementSub .st-w');
  var stEyebrow = document.querySelector('.st-eyebrow');

  /* 初期状態＝夜（CSSの基本は昼なのでJSで夜に巻き戻す） */
  gsap.set(statement, { backgroundColor: '#0B0912' });
  gsap.set(stWords, { color: 'rgba(255,255,255,0.13)' });
  gsap.set(stSubWords, { color: 'rgba(255,255,255,0.10)' });
  gsap.set(stEyebrow, { color: '#A78BFA' });

  var dawn = gsap.timeline({
    scrollTrigger: {
      trigger: statement,
      start: 'top top',
      end: '+=160%',
      scrub: true,
      pin: true,
      anticipatePin: 1,
      onUpdate: function (self) {
        header.classList.toggle('on-night', self.progress < 0.72);
      }
    }
  });

  dawn
    /* 言葉がひとつずつ灯る */
    .to(stWords, { color: 'rgba(255,255,255,1)', stagger: 0.14, duration: 1.6, ease: 'none' }, 0)
    .to('.dawn-glow', { opacity: 1, duration: 1.8, ease: 'none' }, 0.2)
    .to(stSubWords, { color: 'rgba(255,255,255,0.92)', stagger: 0.1, duration: 0.9, ease: 'none' }, '>-0.5')
    /* 夜明け：深紫の朝焼け → 薄紫 → 白（灰色を経由しない） */
    .to(statement, { backgroundColor: '#4C1D95', duration: 0.8, ease: 'none' }, '>+0.2')
    .to(statement, { backgroundColor: '#EDE9FA', duration: 1.2, ease: 'power1.in' }, '>')
    .to(stWords, { color: '#17141F', duration: 1.1, ease: 'power1.inOut' }, '<+0.35')
    .to(stSubWords, { color: '#5B5566', duration: 1.1, ease: 'power1.inOut' }, '<')
    .to(stEyebrow, { color: '#6D28D9', duration: 1.1 }, '<')
    .to(statement, { backgroundColor: '#FFFFFF', duration: 0.8, ease: 'none' }, '>-0.3')
    .to('.dawn-glow', { opacity: 0, duration: 1.0 }, '<');

  /* ---------- 事業カード：時間差で立ち上がる ---------- */
  gsap.from('.biz-card', {
    y: 46, opacity: 0, duration: 0.85, ease: 'power3.out', stagger: 0.09,
    scrollTrigger: { trigger: '.biz-grid', start: 'top 82%', once: true }
  });

  /* ---------- CEO写真：ゆっくり寄る ---------- */
  gsap.from('.ceo-photo', {
    scale: 1.07, duration: 1.4, ease: 'power2.out',
    scrollTrigger: { trigger: '.ceo-inner', start: 'top 75%', once: true }
  });

  /* ---------- CTA：オーロラをわずかに視差 ---------- */
  gsap.fromTo('.cta-aurora', { yPercent: -8 }, {
    yPercent: 8, ease: 'none',
    scrollTrigger: { trigger: '.cta', start: 'top bottom', end: 'bottom top', scrub: true }
  });
})();
