gsap.registerPlugin(ScrollTrigger);

// ─── MOTION.DEV — safe fallback if CDN fails ───────────
const motionLoaded = typeof Motion !== 'undefined';
const animate = motionLoaded ? Motion.animate  : () => {};
const inView   = motionLoaded ? Motion.inView   : () => {};
const stagger  = motionLoaded ? Motion.stagger  : () => 0;

// ─── HERO INTRO (called first — GSAP only, no Motion dep) ─
heroIn();

// ─── CURSOR ────────────────────────────────────────────
const cd = document.getElementById('cur-d'), cr = document.getElementById('cur-r');
let mx = 0, my = 0, rx = 0, ry = 0;
document.addEventListener('mousemove', e => { mx = e.clientX; my = e.clientY; });
(function tick() {
  cd.style.cssText = `left:${mx}px;top:${my}px;`;
  rx += (mx - rx) * 0.1; ry += (my - ry) * 0.1;
  cr.style.cssText = `left:${rx}px;top:${ry}px;`;
  requestAnimationFrame(tick);
})();

// ─── NAV SCROLL ────────────────────────────────────────
window.addEventListener('scroll', () => {
  document.getElementById('nav').classList.toggle('scrolled', scrollY > 60);
});

// ─── MOBILE MENU ───────────────────────────────────────
const mobMenu = document.getElementById('mob-menu');
const mobBtn  = document.getElementById('mob-menu-btn');
const mobClose = document.getElementById('mob-menu-close');

function openMenu() {
  mobMenu.classList.add('open');
  document.body.style.overflow = 'hidden';
}
function closeMenu() {
  mobMenu.classList.remove('open');
  document.body.style.overflow = '';
}

mobBtn.addEventListener('click', openMenu);
mobClose.addEventListener('click', closeMenu);
document.querySelectorAll('.mob-nav-links a').forEach(a => {
  a.addEventListener('click', closeMenu);
});

// ─── HERO INTRO ────────────────────────────────────────
function heroIn() {
  const tl = gsap.timeline();
  tl.to(['#hc1', '#hc2', '#hc3'], { y: 0, duration: 1.15, ease: 'power4.out', stagger: 0.1 })
    .to('#hlabel', { opacity: 1, y: 0, duration: 0.8, ease: 'power3.out' }, 0.1)
    .to('#hfoot', { opacity: 1, duration: 0.9, ease: 'power3.out' }, 0.6);
}

// (heroIn already called at top of file)

// ─── FLOATING ORBS (Motion.dev) ────────────────────────
const orb1 = document.querySelector('.orb-1');
const orb2 = document.querySelector('.orb-2');
const orb3 = document.querySelector('.orb-3');

animate(orb1,
  { x: [0, 40, -20, 0], y: [0, -50, 20, 0] },
  { duration: 12, repeat: Infinity, ease: 'ease-in-out' }
);
animate(orb2,
  { x: [0, -30, 25, 0], y: [0, 40, -30, 0] },
  { duration: 15, repeat: Infinity, ease: 'ease-in-out', delay: 2 }
);
animate(orb3,
  { x: [0, 25, -15, 0], y: [0, -30, 40, 0] },
  { duration: 10, repeat: Infinity, ease: 'ease-in-out', delay: 4 }
);

// ─── CONTACT GLOW PULSE (Motion.dev) ───────────────────
animate('.c-glow',
  { opacity: [0.7, 1, 0.7] },
  { duration: 4, repeat: Infinity, ease: 'ease-in-out' }
);

// ─── SCROLL REVEALS (Motion.dev) ───────────────────────
document.querySelectorAll('.rev').forEach((el) => {
  inView(el, () => {
    animate(el,
      { opacity: [0, 1], y: [36, 0] },
      { duration: 0.85, ease: [0.16, 1, 0.3, 1] }
    );
  }, { margin: '-10% 0px' });
});

// ─── SERVICES CARDS STAGGER (Motion.dev) ───────────────
// Only hide cards if Motion is confirmed loaded (avoids invisible-forever bug)
if (motionLoaded) {
  document.querySelectorAll('.sc').forEach(c => {
    c.style.opacity = '0';
    c.style.transform = 'translateY(32px)';
  });
}
inView('#hout', () => {
  animate('.sc',
    { opacity: [0, 1], y: [32, 0] },
    { duration: 0.7, delay: stagger(0.14), ease: [0.16, 1, 0.3, 1] }
  );
}, { margin: '-15% 0px' });

// ─── HORIZONTAL SCROLL (desktop only) ──────────────────
if (window.innerWidth > 768) {
  (function () {
    const track = document.getElementById('htrack'), outer = document.getElementById('hout');
    gsap.to(track, {
      x: () => -(track.scrollWidth - window.innerWidth + 112),
      ease: 'none',
      scrollTrigger: {
        trigger: outer, start: 'top top',
        end: () => '+=' + (track.scrollWidth - window.innerWidth + 112),
        pin: true, scrub: 1, invalidateOnRefresh: true, anticipatePin: 1
      }
    });
  })();
}

// ─── STEP HOVER ────────────────────────────────────────
document.querySelectorAll('.step').forEach(s => {
  s.addEventListener('mouseenter', () => gsap.to(s, { paddingLeft: '10px', duration: 0.3, ease: 'power2.out' }));
  s.addEventListener('mouseleave', () => gsap.to(s, { paddingLeft: '0px', duration: 0.3, ease: 'power2.out' }));
});

// ─── CARD MOUSE GLOW ───────────────────────────────────
document.querySelectorAll('.sc').forEach(card => {
  card.addEventListener('mousemove', e => {
    const r = card.getBoundingClientRect();
    const x = ((e.clientX - r.left) / r.width * 100).toFixed(1);
    const y = ((e.clientY - r.top) / r.height * 100).toFixed(1);
    card.style.background = `radial-gradient(circle at ${x}% ${y}%,rgba(59,126,255,0.05) 0%,#fff 55%)`;
  });
  card.addEventListener('mouseleave', () => { card.style.background = '#fff'; });
});

// ─── PARALLAX HERO ─────────────────────────────────────
gsap.to('.h-title', { y: -90, ease: 'none', scrollTrigger: { trigger: '#hero', start: 'top top', end: 'bottom top', scrub: 1.3 } });

// ─── SERVICE CARD ICONS — DRAW ON SCROLL ───────────────
document.querySelectorAll('.sc').forEach(sc => {
  inView(sc, () => {
    const paths = sc.querySelectorAll('.ic-path');
    animate(paths, { strokeDashoffset: [200, 0] }, { duration: 1, ease: [0.16, 1, 0.3, 1], delay: stagger(0.08) });
  }, { margin: '-5% 0px' });
});

// ─── DRAWING X — DRAW IN ON SCROLL ─────────────────────
gsap.to('.x-stroke', {
  strokeDashoffset: 0,
  duration: 1.4,
  ease: 'power3.out',
  stagger: 0.25,
  scrollTrigger: { trigger: '.how-x-svg', start: 'top 75%', toggleActions: 'play none none reverse' }
});
