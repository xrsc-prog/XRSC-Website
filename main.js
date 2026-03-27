gsap.registerPlugin(ScrollTrigger);

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

// ─── WEBGL HERO PARTICLES ──────────────────────────────
(function () {
  const c = document.getElementById('hero-canvas');
  const gl = c.getContext('webgl') || c.getContext('experimental-webgl');
  if (!gl) return;

  function resize() {
    c.width = c.offsetWidth * Math.min(devicePixelRatio, 2);
    c.height = c.offsetHeight * Math.min(devicePixelRatio, 2);
    gl.viewport(0, 0, c.width, c.height);
  }
  resize(); window.addEventListener('resize', resize);

  const N = 320;
  const pos = new Float32Array(N * 2), vel = new Float32Array(N * 2), sz = new Float32Array(N), col = new Float32Array(N * 3);
  for (let i = 0; i < N; i++) {
    pos[i * 2] = Math.random() * 2 - 1; pos[i * 2 + 1] = Math.random() * 2 - 1;
    vel[i * 2] = (Math.random() - .5) * .0003; vel[i * 2 + 1] = (Math.random() - .5) * .0003 - .00008;
    sz[i] = Math.random() * 2.5 + 1;
    const t = Math.random();
    col[i * 3] = .23 + t * .28; col[i * 3 + 1] = .49 - t * .22; col[i * 3 + 2] = 1 - t * .04;
  }

  const vs = `attribute vec2 p;attribute float s;attribute vec3 c;varying vec3 vc;uniform vec2 m;
  void main(){vec2 q=p;float d=distance(q,m);float r=smoothstep(0.,0.35,d);q+=normalize(q-m)*(1.-r)*.06;
  gl_Position=vec4(q,0,1);gl_PointSize=s*(1.+(1.-r)*2.5);vc=c;}`;
  const fs = `precision mediump float;varying vec3 vc;
  void main(){vec2 c2=gl_PointCoord-.5;if(length(c2)>.5)discard;
  float a=smoothstep(.5,.08,length(c2))*.5;gl_FragColor=vec4(vc,a);}`;

  function sh(t, src) { const s = gl.createShader(t); gl.shaderSource(s, src); gl.compileShader(s); return s; }
  const prog = gl.createProgram();
  gl.attachShader(prog, sh(gl.VERTEX_SHADER, vs)); gl.attachShader(prog, sh(gl.FRAGMENT_SHADER, fs));
  gl.linkProgram(prog); gl.useProgram(prog);

  const pb = gl.createBuffer(), sb = gl.createBuffer(), cb = gl.createBuffer();
  let mouse = [0, 0];
  c.addEventListener('mousemove', e => {
    const r = c.getBoundingClientRect();
    mouse[0] = (e.clientX - r.left) / r.width * 2 - 1;
    mouse[1] = -((e.clientY - r.top) / r.height) * 2 + 1;
  });
  const um = gl.getUniformLocation(prog, 'm');

  function frame() {
    requestAnimationFrame(frame);
    for (let i = 0; i < N; i++) {
      pos[i * 2] += vel[i * 2]; pos[i * 2 + 1] += vel[i * 2 + 1];
      if (pos[i * 2] > 1.2) pos[i * 2] = -1.2; if (pos[i * 2] < -1.2) pos[i * 2] = 1.2;
      if (pos[i * 2 + 1] < -1.2) { pos[i * 2 + 1] = 1.2; pos[i * 2] = Math.random() * 2 - 1; }
    }
    gl.clearColor(1, 1, 1, 0); gl.clear(gl.COLOR_BUFFER_BIT);
    gl.enable(gl.BLEND); gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);
    gl.uniform2fv(um, mouse);
    const ap = gl.getAttribLocation(prog, 'p'), as = gl.getAttribLocation(prog, 's'), ac = gl.getAttribLocation(prog, 'c');
    gl.bindBuffer(gl.ARRAY_BUFFER, pb); gl.bufferData(gl.ARRAY_BUFFER, pos, gl.DYNAMIC_DRAW);
    gl.enableVertexAttribArray(ap); gl.vertexAttribPointer(ap, 2, gl.FLOAT, false, 0, 0);
    gl.bindBuffer(gl.ARRAY_BUFFER, sb); gl.bufferData(gl.ARRAY_BUFFER, sz, gl.STATIC_DRAW);
    gl.enableVertexAttribArray(as); gl.vertexAttribPointer(as, 1, gl.FLOAT, false, 0, 0);
    gl.bindBuffer(gl.ARRAY_BUFFER, cb); gl.bufferData(gl.ARRAY_BUFFER, col, gl.STATIC_DRAW);
    gl.enableVertexAttribArray(ac); gl.vertexAttribPointer(ac, 3, gl.FLOAT, false, 0, 0);
    gl.drawArrays(gl.POINTS, 0, N);
  }
  frame();
})();

// ─── CONTACT CANVAS ────────────────────────────────────
(function () {
  const c = document.getElementById('c-canvas');
  const ctx = c.getContext('2d');
  function resize() { c.width = c.offsetWidth; c.height = c.offsetHeight; }
  resize(); window.addEventListener('resize', resize);

  const pts = Array.from({ length: 100 }, () => ({
    x: Math.random(), y: Math.random(),
    vx: (Math.random() - .5) * .0004, vy: (Math.random() - .5) * .0004
  }));

  function draw() {
    requestAnimationFrame(draw); ctx.clearRect(0, 0, c.width, c.height);
    pts.forEach(p => {
      p.x += p.vx; p.y += p.vy;
      if (p.x < 0 || p.x > 1) p.vx *= -1; if (p.y < 0 || p.y > 1) p.vy *= -1;
    });
    for (let i = 0; i < pts.length; i++) {
      for (let j = i + 1; j < pts.length; j++) {
        const dx = (pts[i].x - pts[j].x) * c.width, dy = (pts[i].y - pts[j].y) * c.height;
        const d = Math.sqrt(dx * dx + dy * dy);
        if (d < 130) {
          ctx.strokeStyle = `rgba(100,80,220,${(1 - d / 130) * .12})`; ctx.lineWidth = .5;
          ctx.beginPath(); ctx.moveTo(pts[i].x * c.width, pts[i].y * c.height);
          ctx.lineTo(pts[j].x * c.width, pts[j].y * c.height); ctx.stroke();
        }
      }
    }
    pts.forEach(p => {
      ctx.fillStyle = 'rgba(130,80,230,0.2)';
      ctx.beginPath(); ctx.arc(p.x * c.width, p.y * c.height, 1.5, 0, Math.PI * 2); ctx.fill();
    });
  }
  draw();
})();

// ─── LOADER ────────────────────────────────────────────
(function () {
  const bar = document.getElementById('ll-bar'), pct = document.getElementById('ll-pct');
  const logo = document.getElementById('ll-logo'), curtain = document.getElementById('ll-curtain');
  const loader = document.getElementById('loader');
  const tl = gsap.timeline();
  tl.to(logo, { opacity: 1, y: 0, duration: 0.9, ease: 'power3.out' }, 0.3);

  let p = 0;
  const iv = setInterval(() => {
    p += Math.random() * 16 + 5; if (p >= 100) { p = 100; clearInterval(iv); }
    gsap.to(bar, { width: p + '%', duration: 0.25, ease: 'power2.out' });
    pct.textContent = Math.round(p) + '%';
  }, 110);

  tl.to({}, { duration: 1.8 })
    .to(curtain, { scaleY: 0, duration: 1, ease: 'power4.inOut', transformOrigin: 'bottom' }, '-=0.4')
    .to(loader, {
      yPercent: -100, duration: 1, ease: 'power4.inOut', onComplete: () => {
        loader.style.display = 'none';
        const nav = document.getElementById('nav');
        nav.style.opacity = 1; nav.classList.add('vis');
        heroIn();
      }
    }, '-=0.4');
})();

function heroIn() {
  const tl = gsap.timeline();
  tl.to(['#hc1', '#hc2', '#hc3'], { y: 0, duration: 1.15, ease: 'power4.out', stagger: 0.1 })
    .to('#hlabel', { opacity: 1, y: 0, duration: 0.8, ease: 'power3.out' }, 0.1)
    .to('#hfoot', { opacity: 1, duration: 0.9, ease: 'power3.out' }, 0.6);
}

// ─── SCROLL REVEALS ────────────────────────────────────
gsap.utils.toArray('.rev').forEach((el, i) => {
  gsap.fromTo(el, { opacity: 0, y: 36 }, {
    opacity: 1, y: 0, duration: 0.95, ease: 'power3.out',
    scrollTrigger: { trigger: el, start: 'top 88%' },
    delay: (i % 3) * 0.07
  });
});

// ─── HORIZONTAL SCROLL ─────────────────────────────────
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

// ─── HOW BIG X ANIMATES IN ─────────────────────────────
gsap.to('.how-big', {
  color: 'transparent',
  WebkitTextStroke: '1px transparent',
  backgroundImage: 'linear-gradient(130deg,#3B7EFF,#9B5FFF)',
  WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text',
  duration: 1.2,
  scrollTrigger: { trigger: '.how-big', start: 'top 65%', toggleActions: 'play none none reverse' }
});

