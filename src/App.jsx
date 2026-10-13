import { useEffect, useState, useRef } from 'react'
import './App.css'


const projects = [
  {
    number: '01',
    title: 'BolaNow',
    type: 'Football Information Platform',
    description: 'A modern football platform concept for news, match schedules, and scores.',
    tag: 'React · UI/UX',
    visual: 'bolanow',
    image: '/projects/bolanow.jpg',
    visualLabel: 'FOOTBALL • LIVE SCORES',
  },
  {
    number: '02',
    title: 'SUMBER JAYA',
    type: 'Furniture Business Website',
    description: 'A responsive digital storefront concept for a furniture business.',
    tag: 'React · Business',
    visual: 'sumber-jaya',
    image: '/projects/sumber-jaya.jpg',
    visualLabel: 'FURNITURE • HOME LIVING',
  },
  {
    number: '03',
    title: 'WenCrypto',
    type: 'Web3 Wallet Concept',
    description: 'A cryptocurrency wallet interface focused on a clean and simple experience.',
    tag: 'Web3 · Interface',
    visual: 'wencrypto',
    image: '/projects/wencrypto.jpg',
    visualLabel: 'WEB3 • DIGITAL ASSETS',
  },
]




function ParticleText({ text }) {
  return (
    <span className="intro-particle-word">
      {Array.from(text).map((char, index) => {
        const angle = index * 2.399
        const distance = 24 + (index % 5) * 8
        return (
          <span
            className="intro-particle-char"
            key={`${text}-${index}`}
            style={{
              "--char-index": index,
              "--scatter-x": `${Math.cos(angle) * distance}px`,
              "--scatter-y": `${Math.sin(angle) * distance}px`,
            }}
          >
            {char}
          </span>
        )
      })}
    </span>
  )
}


function ParticleIntroCanvas({ active }) {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let frame;
    let width = 0;
    let height = 0;
    let particles = [];
    const started = performance.now();

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 1.5);
      width = window.innerWidth;
      height = window.innerHeight;
      canvas.width = Math.floor(width * dpr);
      canvas.height = Math.floor(height * dpr);
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

      const off = document.createElement("canvas");
      const octx = off.getContext("2d");
      if (!octx) return;

      off.width = width;
      off.height = height;

      const small = width < 500;
      const line1 = "ENTER MY WORLD";
      const line2 = "WENDYOR MASTARIOL";
      const size1 = Math.min(width * 0.105, 54);
      const size2 = Math.min(width * (small ? 0.085 : 0.082), 64);

      octx.fillStyle = "#ffffff";
      octx.textAlign = "center";
      octx.textBaseline = "middle";
      octx.font = `800 ${size1}px Arial, sans-serif`;
      octx.fillText(line1, width / 2, height / 2 - 32, width * 0.92);
      octx.font = `900 ${size2}px Arial, sans-serif`;
      const wordA = "WENDYOR";
      const wordB = "MASTARIOL";
      const gap = size2 * 0.20;
      const widthA = octx.measureText(wordA).width;
      const widthB = octx.measureText(wordB).width;
      const total = widthA + gap + widthB;
      const left = (width - total) / 2;
      octx.textAlign = "left";
      octx.fillStyle = "#55dcff";
      octx.fillText(wordA, left, height / 2 + 30);
      octx.fillStyle = "#ffe39a";
      octx.fillText(wordB, left + widthA + gap, height / 2 + 30);
      octx.textAlign = "center";

      const image = octx.getImageData(0, 0, width, height).data;
      const targets = [];
      const step = small ? 3 : 4;

      for (let y = 0; y < height; y += step) {
        for (let x = 0; x < width; x += step) {
          if (image[(y * width + x) * 4 + 3] > 80) {
            const pixel = (y * width + x) * 4;
            const color = `rgb(${image[pixel]}, ${image[pixel + 1]}, ${image[pixel + 2]})`;
            targets.push({ x, y, color });
          }
        }
      }

      particles = targets.map((target) => ({
        tx: target.x,
        ty: target.y,
        x: Math.random() * width,
        y: Math.random() * height,
        vx: (Math.random() - 0.5) * 2,
        vy: (Math.random() - 0.5) * 2,
        size: Math.random() * 0.8 + 1.0,
        twinkle: Math.random() * Math.PI * 2,
      }));
    };

    const drawLightning = (now) => {
  const elapsed = now - started;
  if (!active || elapsed < 350 || elapsed > 6900 || !width || !height) return;

  const t = now * 0.001;
  const pulse = 0.76 + Math.abs(Math.sin(t * 5.4)) * 0.24;
  const center = width * 0.5 + Math.sin(t * 1.9) * width * 0.018;
  const amplitude = Math.min(width * 0.15, 66);
  const points = [];
  const segments = 72;

  // Arus ganas: gelombang bertumpuk dengan gerakan yang berbeda.
  for (let i = 0; i <= segments; i++) {
    const u = i / segments;
    const y = -12 + (height + 24) * u;
    const envelope = 0.45 + Math.sin(u * Math.PI) * 0.7;
    const wave =
      Math.sin(u * 10.5 - t * 3.4) * amplitude * 0.46 +
      Math.sin(u * 19 - t * 4.7 + 1.2) * amplitude * 0.25 +
      Math.sin(u * 31 - t * 6.2) * amplitude * 0.13 +
      Math.sin(u * 5.2 - t * 2.1) * amplitude * 0.28;
    const jagged =
      Math.sin(i * 2.7 - t * 8) * width * 0.009 +
      Math.sin(i * 5.1 + t * 6) * width * 0.005;

    points.push({ x: center + wave * envelope + jagged, y });
  }

  ctx.save();
  ctx.lineCap = 'round';
  ctx.lineJoin = 'round';

  // Api plasma biru di kedua sisi petir.
  // Setiap lidah api berdenyut, melengkung, dan berubah arah.
  for (let i = 3; i < points.length - 3; i += 2) {
    const p = points[i];
    const u = i / segments;

    for (const side of [-1, 1]) {
      const flicker = Math.sin(t * 10 + i * 1.7 + side * 2);
      const length = width * (0.018 + 0.035 * Math.abs(flicker));
      const bend = Math.sin(t * 7 + i * 0.9) * length * 0.65;
      const reach = side * length * (0.45 + Math.abs(flicker));

      ctx.beginPath();
      ctx.moveTo(p.x + side * 3, p.y);
      ctx.quadraticCurveTo(
        p.x + reach + bend,
        p.y - 4 - Math.abs(flicker) * 8,
        p.x + reach * 0.55 + bend,
        p.y - 9 - Math.abs(flicker) * 13
      );
      ctx.strokeStyle = i % 4 === 0 ? '#32aaff' : '#63eaff';
      ctx.lineWidth = 2 + Math.abs(flicker) * 3;
      ctx.globalAlpha = (0.25 + Math.abs(flicker) * 0.5) * pulse;
      ctx.shadowColor = '#087dff';
      ctx.shadowBlur = 17;
      ctx.stroke();
    }
  }

  // Gambar inti petir berlapis supaya terasa panas dan bertenaga.
  const strokeCore = (lineWidth, color, alpha, blur) => {
    ctx.beginPath();
    ctx.moveTo(points[0].x, points[0].y);
    for (let i = 1; i < points.length; i++) {
      ctx.lineTo(points[i].x, points[i].y);
    }
    ctx.lineWidth = lineWidth;
    ctx.strokeStyle = color;
    ctx.globalAlpha = alpha * pulse;
    ctx.shadowColor = color;
    ctx.shadowBlur = blur;
    ctx.stroke();
  };

  strokeCore(27, '#005bff', 0.2, 42);
  strokeCore(15, '#087dff', 0.4, 32);
  strokeCore(7, '#168dff', 0.75, 23);
  strokeCore(3, '#65e5ff', 1, 15);
  strokeCore(1.1, '#ffffff', 0.96, 7);

  // Cabang listrik liar.
  ctx.lineWidth = 2;
  ctx.strokeStyle = '#73eaff';
  ctx.shadowColor = '#168dff';
  ctx.shadowBlur = 16;

  for (let i = 4; i < points.length - 3; i += 4) {
    const p = points[i];
    const side = Math.sin(t * 4 + i * 1.4) > 0 ? 1 : -1;
    const reach = width * (0.025 + 0.02 * Math.abs(Math.sin(t * 6 + i)));

    ctx.globalAlpha = (0.45 + 0.45 * Math.abs(Math.sin(t * 8 + i))) * pulse;
    ctx.beginPath();
    ctx.moveTo(p.x, p.y);
    ctx.lineTo(p.x + side * reach * 0.5, p.y + 5);
    ctx.lineTo(p.x + side * reach, p.y + 14);
    ctx.lineTo(p.x + side * reach * 0.8, p.y + 19);
    ctx.stroke();
  }

  // Kilatan kecil yang muncul dan padam.
  for (let i = 0; i < 12; i++) {
    const u = ((i * 0.137 + t * 0.19) % 1);
    const index = Math.min(segments, Math.floor(u * segments));
    const p = points[index];
    const side = i % 2 === 0 ? 1 : -1;
    const flicker = Math.abs(Math.sin(t * 11 + i * 2.8));

    ctx.globalAlpha = flicker * 0.8;
    ctx.strokeStyle = '#b8f5ff';
    ctx.lineWidth = 1.2 + flicker;
    ctx.beginPath();
    ctx.moveTo(p.x, p.y);
    ctx.lineTo(p.x + side * (8 + flicker * 15), p.y - 5);
    ctx.lineTo(p.x + side * (14 + flicker * 23), p.y + 3);
    ctx.stroke();
  }

  ctx.restore();
  ctx.globalAlpha = 1;
  ctx.shadowBlur = 0;
};

    const animate = (now) => {
      const elapsed = now - started;
      ctx.clearRect(0, 0, width, height);

      const gathering = active ? Math.max(0, Math.min(1, (elapsed - 850) / 2400)) : 0;

      for (const p of particles) {
        if (gathering > 0) {
          const force = 0.018 + gathering * 0.055;
          p.vx += (p.tx - p.x) * force;
          p.vy += (p.ty - p.y) * force;
          p.vx *= 0.78;
          p.vy *= 0.78;
          p.x += p.vx;
          p.y += p.vy;
        } else {
          p.x += p.vx * 0.35;
          p.y += p.vy * 0.35;
          if (p.x < 0) p.x = width;
          if (p.x > width) p.x = 0;
          if (p.y < 0) p.y = height;
          if (p.y > height) p.y = 0;
        }

        const sparkle = 0.55 + Math.abs(Math.sin(now * 0.004 + p.twinkle)) * 0.45;
        ctx.globalAlpha = sparkle;
        ctx.fillStyle = p.color || "#baf8ff";
        ctx.shadowColor = "#28aaff";
        ctx.shadowBlur = gathering > 0.8 ? 5 : 9;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fill();
      }

      ctx.globalAlpha = 1;
      ctx.shadowBlur = 0;
      drawLightning(now);
      frame = requestAnimationFrame(animate);
    };

    resize();
    window.addEventListener("resize", resize);
    frame = requestAnimationFrame(animate);

    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("resize", resize);
    };
  }, [active]);




  return (
    <>
      <canvas
        ref={canvasRef}
        className="intro-particle-canvas"
        aria-hidden="true"
        style={{ opacity: active ? 1 : 0 }}
      />
    </>
  );
}

function App() {
  const [activeSection, setActiveSection] = useState('home');
  const [typedName, setTypedName] = useState('');
  const [corePosition, setCorePosition] = useState({ x: 0, y: 0 });
  
const dragStart = useRef({ x: 0, y: 0 });
const dragOrigin = useRef({ x: 0, y: 0 });
const dragging = useRef(false);

const handleCorePointerDown = (e) => {
  e.preventDefault();
  dragging.current = true;
  dragStart.current = { x: e.clientX, y: e.clientY };
  dragOrigin.current = { ...corePosition };
  e.currentTarget.setPointerCapture(e.pointerId);
};

const handleCorePointerMove = (e) => {
  if (!dragging.current) return;

  setCorePosition({
    x: dragOrigin.current.x + e.clientX - dragStart.current.x,
    y: dragOrigin.current.y + e.clientY - dragStart.current.y,
  });
};

const handleCorePointerUp = () => {
  dragging.current = false;
};
  const [isScanning, setIsScanning] = useState(false);
  const [isSpiderMode, setIsSpiderMode] = useState(false);
  const [isTouching, setIsTouching] = useState(false);
  const [isReleaseHold, setIsReleaseHold] = useState(false);
  const [touchPos, setTouchPos] = useState({ x: 0, y: 0 });
  
const [showIntro, setShowIntro] = useState(true);
const [introClosing, setIntroClosing] = useState(false);
const [introProgress, setIntroProgress] = useState(0);
const [showLoading, setShowLoading] = useState(false);

useEffect(() => {
  let interval;
  let finishTimer;

  const loadingDelay = setTimeout(() => {
    setShowLoading(true);
    const startedAt = Date.now();

    interval = setInterval(() => {
      const elapsed = Date.now() - startedAt;
      const progress = Math.min(
        100,
        Math.floor((elapsed / 3500) * 100)
      );

      setIntroProgress(progress);

      if (progress >= 100) {
        clearInterval(interval);
        finishTimer = setTimeout(() => {
          setIntroClosing(true);
          finishTimer = setTimeout(() => {
            setShowIntro(false);
          }, 1150);
        }, 500);
      }
    }, 40);
  }, 3300);

  return () => {
    clearTimeout(loadingDelay);
    clearInterval(interval);
    clearTimeout(finishTimer);
  };
}, []);

useEffect(() => {
  const text = 'WENDYOR MASTARIOL.';
  let index = 0;
  let deleting = false;
  let timer;

  const animate = () => {
    if (!deleting) {
      index++;
      setTypedName(text.slice(0, index));

      if (index === text.length) {
        deleting = true;
        timer = setTimeout(animate, 1400);
        return;
      }

      timer = setTimeout(animate, 115);
    } else {
      index--;
      setTypedName(text.slice(0, index));

      if (index === 0) {
        deleting = false;
        timer = setTimeout(animate, 500);
        return;
      }

      timer = setTimeout(animate, 65);
    }
  };

  timer = setTimeout(animate, 700);

  return () => clearTimeout(timer);
}, []);  

useEffect(() => {
  if (isTouching) {
    setIsSpiderMode(false);
    setIsReleaseHold(false);
    return;
  }

  setIsSpiderMode(false);
  setIsReleaseHold(true);

  const delay = setTimeout(() => {
    setIsReleaseHold(false);
    setIsSpiderMode(true);
  }, 2500);

  return () => clearTimeout(delay);
}, [isTouching]);

useEffect(() => {
  if (isTouching || isReleaseHold) return;

  const interval = setInterval(() => {
    setIsSpiderMode((current) => !current);
  }, 2500);

  return () => clearInterval(interval);
}, [isTouching, isReleaseHold]);
(() => {
  let interval;

  if (isTouching) {
    setIsSpiderMode(false);
    return;
  }

  setIsSpiderMode(false);
  setIsReleaseHold(true);

  const delay = setTimeout(() => {
    setIsReleaseHold(false);
    setIsSpiderMode(true);

    interval = setInterval(() => {
      setIsSpiderMode((current) => !current);
    }, 3500);
  }, 5000);

  return () => {
    clearTimeout(delay);
    if (interval) clearInterval(interval);
  };
}, [isTouching]);
    

  useEffect(() => {
    const ids = ['home', 'about', 'projects', 'contact'];

    const updateActiveSection = () => {
      const marker = window.innerHeight * 0.35;
      let current = 'home';

      ids.forEach((id) => {
        const section = document.getElementById(id);
        if (section && section.getBoundingClientRect().top <= marker) {
          current = id;
        }
      });

      setActiveSection(current);
    };

    window.addEventListener('scroll', updateActiveSection, {
      passive: true,
    });
    window.addEventListener('resize', updateActiveSection);
    updateActiveSection();

    return () => {
      window.removeEventListener('scroll', updateActiveSection);
      window.removeEventListener('resize', updateActiveSection);
    };
  }, []);


  return (
    <main> {showIntro && (
  <div className={`intro-screen${introClosing ? " intro-closing" : ""}`}>
      <div className="intro-door intro-door-left" aria-hidden="true" />
      <div className="intro-door intro-door-right" aria-hidden="true" />
      <div className="intro-tag">PERSONAL PORTFOLIO</div>
      <div className="intro-year" aria-label="2026">
        <span className="year-digit year-left">2</span>
        <span className="year-digit year-top">0</span>
        <span className="year-digit year-bottom">2</span>
        <span className="year-digit year-right">6</span>
      </div>
      <ParticleIntroCanvas active={showLoading} /><div className="hologram-portrait">
          <img
            src="/1000171409-removebg-preview.png"
            alt="Wendyor hologram portrait"
          />
        </div>

      <div className="intro-content">

<div
          className="intro-progress"
          style={{
            opacity: showLoading ? 1 : 0,
            visibility: showLoading ? 'visible' : 'hidden'
          }}
        >
          <div className="intro-progress-top">
            <span>ENERGY CHARGING</span>
            <span>{introProgress}%</span>
          </div>
          <div className="intro-progress-track">
            <div
              className="intro-progress-fill"
              style={{ width: `${introProgress}%` }}
            />
          </div>
        </div>
      </div>
    </div>
  )}
      <nav className="navbar">
        <a href="#home" className="logo">WM<span>.</span></a>
        <div className="nav-links">
  <a
    href="#home"
    className={activeSection === 'home' ? 'active' : ''}
    onClick={() => setActiveSection('home')}
  >
    Home
  </a>

  <a
    href="#about"
    className={activeSection === 'about' ? 'active' : ''}
    onClick={() => setActiveSection('about')}
  >
    About
  </a>

  <a
    href="#projects"
    className={activeSection === 'projects' ? 'active' : ''}
    onClick={() => setActiveSection('projects')}
  >
    Portfolio
  </a>

  <a
    href="#contact"
    className={activeSection === 'contact' ? 'active' : ''}
    onClick={() => setActiveSection('contact')}
  >
    Contact
  </a>
</div>
      </nav>

      <section className="hero" id="home">
        <div className="hero-glow" />
        <div className="hero-content">
          <div className="status">
            <span className="status-dot" />
            PERSONAL PORTFOLIO · 2026
          </div>
          <p className="eyebrow">HELLO, I'M</p>
          <h1 className="hero-typewriter">
  <span>{typedName.slice(0, 7)}</span>
  <br />
  <span>
    {typedName.length > 8 ? typedName.slice(8) : ''}
    <span className="typewriter-cursor" aria-hidden="true">|</span>
  </span>
</h1>
          <p className="hero-description">
            Turning ideas into <span>digital experiences</span>.
            Exploring web development, creative technology, and modern design.
          </p>
          <div className="hero-actions">
            <a className="button-primary" href="#projects">Explore My Work <span>↘</span></a>
            <a className="button-ghost" href="#about">Discover More</a>
          </div>
          <div className="hero-meta">
            <span>WEB DEVELOPER</span>
            <span>CREATIVE THINKER</span>
            <span>ALWAYS LEARNING</span>
          </div>
        </div>
        <div className="hero-visual" aria-hidden="true">
          <div className="orbit orbit-one" />
          <div className="orbit orbit-two" />
          <div
  className="core-drag-layer"
  style={{
    transform: `translate3d(${corePosition.x}px, ${corePosition.y}px, 0)`,
    cursor: 'grab',
    touchAction: 'none',
  }}
  onPointerDown={handleCorePointerDown}
  onPointerMove={handleCorePointerMove}
  onPointerUp={handleCorePointerUp}
  onPointerCancel={handleCorePointerUp}
>
  <div className="core">
    <span>W</span>
    <div className="core-line" />
    <small>CREATE · BUILD · REPEAT</small>
  </div>
</div>
          <span className="floating-label label-one">DESIGN_01</span>
          <span className="floating-label label-two">DIGITAL FUTURE ↗</span>
          <span className="visual-index">001 / 003</span>
        </div>
        <a href="#about" className="scroll-cue"><span /> SCROLL TO EXPLORE</a>
      </section>

      <section className="about section" id="about">
        <div className="section-label"><span>01</span> / ABOUT ME</div>
        <div className="about-grid">
          <h2>Curious mind.<br /><span>Digital builder.</span></h2>
          <div className="about-copy">
            <p>
              I'm Wendyor Mastariol, an aspiring digital creator who enjoys
              building websites and exploring new technology.
            </p>
            <p>
              My focus is learning by creating — turning concepts into useful,
              clean, and memorable digital experiences.
            </p>
            <div className="skills">
              <span>HTML & CSS</span><span>JavaScript</span>
              <span>React</span><span>Responsive Design</span>
              <span>UI Exploration</span>
            </div>
          </div>
        </div>
      


      
        <div className="section-label"><span>01</span> / ABOUT & IDENTITY</div>
        <div className="face-layout">
          <div className="face-intro-left">
            <p className="eyebrow">HELLO, MY NAME IS</p>
            <h2>Wendyor<br /><span>Mastariol.</span></h2>
            <p>Welcome to my personal website.</p>
          </div>
        <button
          type="button"
          className={`face-stage ${isScanning ? 'is-scanning' : ''} ${isSpiderMode ? 'is-spider' : ''} ${isTouching ? 'is-touching' : ''} ${isReleaseHold ? 'is-release-hold' : ''}`}
          
          aria-label="Sentuh foto untuk melihat Spider-Man"
          onPointerDown={(e) => {
            const rect = e.currentTarget.getBoundingClientRect();
            e.currentTarget.setPointerCapture(e.pointerId);
            setTouchPos({ x: e.clientX - rect.left, y: e.clientY - rect.top });
            setIsSpiderMode(false);
            setIsTouching(true);
          }}
          onPointerMove={(e) => {
            if (!isTouching) return;
            const rect = e.currentTarget.getBoundingClientRect();
            setTouchPos({ x: e.clientX - rect.left, y: e.clientY - rect.top });
          }}
          onPointerUp={() => {
  setIsSpiderMode(false);
  setIsReleaseHold(true);
  setIsTouching(false);
}}
onPointerCancel={() => {
  setIsSpiderMode(false);
  setIsReleaseHold(true);
  setIsTouching(false);
}}
        >
          <img
  src="/wajah-baru.png"
  alt="Wendyor portrait"
  style={{
    opacity: isSpiderMode && !isTouching ? 0 : 1,
    transition: isReleaseHold ? 'none' : 'opacity 2s ease-in-out',
  }}
/>
                    <img
            className="spider-overlay"
            src="/spiderman-baru.png"
            alt=""
            style={{
              opacity: isTouching ? 1 : (isReleaseHold ? 0 : (isSpiderMode ? 1 : 0)),
              transition: isReleaseHold ? 'none' : 'opacity 2s ease-in-out',
              ...(isTouching ? {
                maskImage: `radial-gradient(circle 58px at ${touchPos.x}px ${touchPos.y}px, black 42%, rgba(0,0,0,0.72) 68%, transparent 100%)`,
                WebkitMaskImage: `radial-gradient(circle 58px at ${touchPos.x}px ${touchPos.y}px, black 42%, rgba(0,0,0,0.72) 68%, transparent 100%)`,
                transition: 'none',
              } : {}),
            }}
          />
          <span className="face-frame" />
          <span className="scan-line" />
          <span className="face-grid" />
          <span className="face-hud">BIOMETRIC SCAN <b>● LIVE</b></span>
          <span className="face-corner corner-tl" />
          <span className="face-corner corner-tr" />
          <span className="face-corner corner-bl" />
          <span className="face-corner corner-br" />
          <span className="spider-emblem">✳</span>
          <span className="face-status">
            {isScanning ? 'SCANNING...' : isSpiderMode ? 'HERO MODE ACTIVATED' : 'INITIALIZING...'}
          </span>
        </button>
          <div className="face-intro-right">
            <p className="eyebrow">WHAT I DO</p>
            <h2>I'm a<br /><span>Web Developer.</span></h2>
            <p>Building ideas into digital experiences.</p>
          </div>
        </div>

      </section>

      <section className="projects section" id="projects">
        <div className="section-label"><span>02</span> / SELECTED WORK</div>
        <div className="projects-heading">
          <h2>Things I've<br /><span>been building.</span></h2>
          <p>A selection of projects and concepts<br />from my digital journey.</p>
        </div>
        <div className="project-list">
          {projects.map((project) => (
            
<article
  className={`project-card project-${project.visual}`}
  key={project.number}
>
  <div className="project-thumb">
    <img
      src={project.image}
      alt={project.title}
      loading="lazy"
    />
    <span className="thumb-number">{project.number}</span>
  </div>

  <div className="project-info">
    <p className="project-type">{project.type}</p>
    <h3>{project.title}</h3>
    <p className="project-description">{project.description}</p>
    <span className="project-tag">{project.tag}</span>
  </div>

  <a
    className="project-arrow"
    href="#contact"
    aria-label={`Ask about ${project.title}`}
  >
    ↗
  </a>
</article>

          ))}
        </div>
        <p className="project-note">* Project descriptions represent concepts and work in progress.</p>
      </section>

      <section className="contact section" id="contact">
        <div className="section-label"><span>03</span> / GET IN TOUCH</div>
        <p className="eyebrow">HAVE AN IDEA?</p>
        <h2>Let's build<br /><span>something great.</span></h2>

        <div className="contact-fight-visual">
          <video
            className="contact-fight-video"
            autoPlay
            muted
            loop
            playsInline
            preload="metadata"
            aria-label="Stickman fight animation"
          >
            <source
              src={`${import.meta.env.BASE_URL}videos/stickman-fight-transparent.webm`}
              type="video/mp4"
            />
          </video>
        </div>
        <p className="contact-copy">
          Have a project in mind or want to work together?
          I'd love to hear from you.
        </p>
        <a className="button-primary" href="mailto:hello@example.com">
          Start a Conversation <span>↗</span>
        </a>
     
      </section>


      <footer>
        <a href="#home" className="logo">WM<span>.</span></a>
        <p>DESIGNED TO EXPLORE. BUILT TO EVOLVE.</p>
        <span>© 2026 WENDYOR MASTARIOL</span>
      </footer>
    </main>
  )
}

export default App

