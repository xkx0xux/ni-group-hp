/* NI Group — Proposal Demo（夜明けシネマ演出） */
(function () {
  'use strict';

  var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var hasGsap = typeof window.gsap !== 'undefined' && typeof window.ScrollTrigger !== 'undefined';
  var cinematic = hasGsap && !reduceMotion;

  var header = document.getElementById('siteHeader');
  var hero = document.querySelector('.hero');
  var lenis = null; /* シネマ有効時に代入（モーダルのスクロールロックでも参照） */

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
     ニュース詳細モーダル（GSAP非依存）
     ========================================================= */
  var NEWS = [
    {
      date: '2025.12.16', dateISO: '2025-12-16', tag: 'お知らせ',
      title: 'カスタマーハラスメントに対する当社の基本方針について',
      img: 'assets/img/news/policy.jpg', fit: 'cover',
      alt: '打ち合わせをするスタッフの手元',
      html:
        '<p>株式会社New innovationでは、すべてのお客様に安全・安心なサービスを提供するとともに、従業員が安心して業務に取り組める就業環境を守るため、「カスタマーハラスメントに対する基本方針」を制定いたしました。</p>' +
        '<p>本方針では、カスタマーハラスメントの定義や、該当行為への対応方針を明確にし、社内外における適切な対応体制の整備を進めております。</p>' +
        '<p>今後もお客様からのご意見・ご要望に真摯に向き合いながら、より良いサービスの提供と、健全な関係づくりに努めてまいります。</p>'
    },
    {
      date: '2025.11.28', dateISO: '2025-11-28', tag: '受賞',
      title: 'NIグループ社員の井上 海選手が『第8回日本社会人選手権水泳競技大会』に出場＆入賞🏊',
      img: 'assets/img/news/swim.jpg', fit: 'cover',
      alt: '第8回日本社会人選手権水泳競技大会に出場した井上 海選手',
      html:
        '<p>NIグループ社員の井上 海選手が『第8回日本社会人選手権水泳競技大会』に出場＆入賞しました🏊</p>' +
        '<p class="news-score">【成績】<br>井上 海　50m バタフライ　第7位　24.05</p>' +
        '<p>久しぶりの大会ながらもベストタイムを更新し、強者揃いのバタフライで入賞を果たしました✨</p>' +
        '<p class="news-sign">内田 雄真</p>'
    },
    {
      date: '2025.06.16', dateISO: '2025-06-16', tag: '資格',
      title: '登録電気工事の免許を取得しました',
      img: 'assets/img/news/license.jpg', fit: 'contain',
      alt: '登録電気工事業者登録証',
      html:
        '<p>このたび、登録電気工事業者として必要な「登録電気工事業」の免許を取得いたしました。</p>' +
        '<p>これにより、法令に基づいた適正な工事の実施が可能となり、より安全で信頼性の高い電気工事サービスを提供できる体制が整いました。</p>' +
        '<p>今後も引き続き、技術と品質の向上に努めてまいります。</p>' +
        '<p class="news-sign">内田 雄真</p>'
    }
  ];

  var modal = document.getElementById('newsModal');
  if (modal) {
    var mImg = document.getElementById('newsModalImg');
    var mDate = document.getElementById('newsModalDate');
    var mTag = document.getElementById('newsModalTag');
    var mTitle = document.getElementById('newsModalTitle');
    var mText = document.getElementById('newsModalText');
    var mClose = modal.querySelector('.news-modal-close');
    var lastFocus = null;

    function openNews(i) {
      var d = NEWS[i];
      if (!d) return;
      mImg.src = d.img;
      mImg.alt = d.alt;
      mImg.classList.toggle('is-contain', d.fit === 'contain');
      mDate.textContent = d.date;
      mDate.setAttribute('datetime', d.dateISO);
      mTag.textContent = d.tag;
      mTitle.textContent = d.title;
      mText.innerHTML = d.html;
      lastFocus = document.activeElement;
      modal.hidden = false;
      modal.querySelector('.news-modal-panel').scrollTop = 0;
      document.documentElement.style.overflow = 'hidden';
      if (lenis) lenis.stop();
      mClose.focus();
    }
    function closeNews() {
      modal.hidden = true;
      document.documentElement.style.overflow = '';
      if (lenis) lenis.start();
      if (lastFocus) lastFocus.focus();
    }

    document.querySelectorAll('[data-news]').forEach(function (a) {
      a.addEventListener('click', function (e) {
        e.preventDefault();
        openNews(parseInt(a.getAttribute('data-news'), 10));
      });
    });
    modal.addEventListener('click', function (e) {
      if (e.target.closest('[data-close]')) closeNews();
    });
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && !modal.hidden) closeNews();
    });
  }

  /* =========================================================
     シネマ演出（GSAP + Lenis）
     ========================================================= */
  if (!cinematic) return;

  gsap.registerPlugin(ScrollTrigger);

  /* ---------- Lenis 慣性スクロール ---------- */
  if (typeof window.Lenis !== 'undefined') {
    lenis = new Lenis({ lerp: 0.1 });
    lenis.on('scroll', ScrollTrigger.update);
    gsap.ticker.add(function (time) { lenis.raf(time * 1000); });
    gsap.ticker.lagSmoothing(0);
  }

  /* アンカーは Lenis 経由でなめらかに */
  document.querySelectorAll('a[href^="#"]').forEach(function (a) {
    if (a.hasAttribute('data-news')) return; /* ニュースはモーダルで処理 */
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
  if (hero) {
    gsap.to('.hero-bg', {
      yPercent: 16, ease: 'none',
      scrollTrigger: { trigger: '.hero', start: 'top top', end: 'bottom top', scrub: true }
    });
    gsap.to('.hero-inner', {
      y: -48, opacity: 0.15, ease: 'none',
      scrollTrigger: { trigger: '.hero', start: '28% top', end: 'bottom top', scrub: true }
    });
  }

  /* ---------- ステートメント：夜明け（ピン留め＋明転） ---------- */
  var statement = document.querySelector('.statement');
  if (statement) {
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
  }

  /* ---------- 事業カード：時間差で立ち上がる ---------- */
  if (document.querySelector('.biz-grid')) {
    gsap.from('.biz-card', {
      y: 46, opacity: 0, duration: 0.85, ease: 'power3.out', stagger: 0.09,
      scrollTrigger: { trigger: '.biz-grid', start: 'top 82%', once: true }
    });
  }

  /* ---------- 実績カード（system.html）：時間差で立ち上がる ---------- */
  if (document.querySelector('.sys-grid')) {
    gsap.from('.sys-card', {
      y: 46, opacity: 0, duration: 0.85, ease: 'power3.out', stagger: 0.09,
      scrollTrigger: { trigger: '.sys-grid', start: 'top 82%', once: true }
    });
  }

  /* ---------- CEO写真：ゆっくり寄る ---------- */
  if (document.querySelector('.ceo-inner')) {
    gsap.from('.ceo-photo', {
      scale: 1.07, duration: 1.4, ease: 'power2.out',
      scrollTrigger: { trigger: '.ceo-inner', start: 'top 75%', once: true }
    });
  }

  /* ---------- CTA：オーロラをわずかに視差 ---------- */
  if (document.querySelector('.cta')) {
    gsap.fromTo('.cta-aurora', { yPercent: -8 }, {
      yPercent: 8, ease: 'none',
      scrollTrigger: { trigger: '.cta', start: 'top bottom', end: 'bottom top', scrub: true }
    });
  }
})();
