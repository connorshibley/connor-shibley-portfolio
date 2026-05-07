import { useState, useEffect, useRef } from 'react';

function useReveal() {
  const ref = useRef(null);
  const [seen, setSeen] = useState(false);
  useEffect(() => {
    if (!ref.current) return;
    const io = new IntersectionObserver((entries) => {
      entries.forEach((e) => {
        setSeen(e.isIntersecting);
      });
    }, { threshold: 0.12 });
    io.observe(ref.current);
    return () => io.disconnect();
  }, []);
  return [ref, seen];
}

function Reveal({ children, delay = 0, className = '', as: As = 'div', variant = 'up' }) {
  const [ref, seen] = useReveal();
  const style = delay ? { transitionDelay: `${delay}s` } : undefined;
  return (
    <As ref={ref} className={`fade-up reveal reveal-${variant} ${seen ? 'in' : ''} ${className}`} style={style}>
      {children}
    </As>
  );
}

function ScrollProgress() {
  const [pct, setPct] = useState(0);
  useEffect(() => {
    const onScroll = () => {
      const h = document.documentElement;
      const max = h.scrollHeight - h.clientHeight;
      const p = max > 0 ? (h.scrollTop || document.body.scrollTop) / max : 0;
      setPct(Math.min(1, Math.max(0, p)));
    };
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);
  return <div className="scroll-progress" style={{ transform: `scaleX(${pct})` }} />;
}

function useScrollParallax(ref, factor = 0.18) {
  useEffect(() => {
    if (!ref.current) return;
    let raf = null;
    const onScroll = () => {
      if (raf) return;
      raf = requestAnimationFrame(() => {
        if (ref.current) {
          const y = window.scrollY * factor;
          ref.current.style.setProperty('--parallax-y', `${y}px`);
        }
        raf = null;
      });
    };
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => { window.removeEventListener('scroll', onScroll); if (raf) cancelAnimationFrame(raf); };
  }, [ref, factor]);
}

function useTheme() {
  const [theme, setTheme] = useState(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('theme') || 'light';
    }
    return 'light';
  });
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('theme', theme);
  }, [theme]);
  const toggle = () => setTheme(t => t === 'dark' ? 'light' : 'dark');
  return [theme, toggle];
}

function Nav({ scrolled, onNav, route, theme, onToggleTheme }) {
  const links = [
    ['about', '01', 'About'],
    ['experience', '02', 'Experience'],
    ['projects', '03', 'Projects'],
    ['resume', '04', 'Résumé'],
    ['contact', '05', 'Contact'],
  ];
  return (
    <div className={`nav-wrap ${scrolled ? 'scrolled' : ''}`}>
      <nav className="nav">
        <a className="nav-brand" href="#top" onClick={(e) => { e.preventDefault(); onNav('home'); }}>
          <span className="name">Connor Shibley</span>
        </a>
        <div className="nav-links">
          {links.map(([id, num, label]) => (
            <a key={id}
              className={route === id ? 'active' : ''}
              href={`#${id}`}
              onClick={(e) => { e.preventDefault(); onNav(id); }}>
              <span className="num">{num}</span>{label}
            </a>
          ))}
          <button className="theme-toggle" onClick={onToggleTheme} aria-label="Toggle theme">
            {theme === 'dark' ? '☀' : '☾'}
          </button>
        </div>
      </nav>
    </div>
  );
}

function Silhouette() {
  return (
    <svg viewBox="0 0 500 700" preserveAspectRatio="xMidYEnd meet" aria-hidden="true">
      <defs>
        <linearGradient id="sgrad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#1a1a1a" />
          <stop offset="60%" stopColor="#0d0d0d" />
          <stop offset="100%" stopColor="#050505" />
        </linearGradient>
        <linearGradient id="rim" x1="1" y1="0" x2="0" y2="0">
          <stop offset="0%" stopColor="rgba(37,99,235,0.35)" />
          <stop offset="100%" stopColor="rgba(37,99,235,0)" />
        </linearGradient>
      </defs>
      <path d="M 340 120 C 380 150, 400 210, 400 260 L 400 520 C 400 540, 395 560, 385 580 L 440 580 L 440 700 L 320 700 L 320 580 C 330 560, 335 540, 335 520 L 335 260 C 335 210, 320 165, 300 140 Z"
        fill="url(#rim)" opacity="0.55" />
      <path d="M 250 60
               C 290 60, 320 95, 320 135
               C 320 165, 305 190, 285 205
               L 305 230
               C 340 240, 370 260, 380 300
               L 395 420
               C 395 460, 385 500, 375 535
               L 380 700
               L 120 700
               L 125 535
               C 115 500, 105 460, 105 420
               L 120 300
               C 130 260, 160 240, 195 230
               L 215 205
               C 195 190, 180 165, 180 135
               C 180 95, 210 60, 250 60 Z"
        fill="url(#sgrad)" />
      <path d="M 120 300 C 140 290, 170 285, 200 285" stroke="rgba(37,99,235,0.12)" strokeWidth="1" fill="none" />
    </svg>
  );
}

function Hero({ onNav }) {
  const portraitRef = useRef(null);
  useScrollParallax(portraitRef, 0.22);
  return (
    <section id="home" className="hero">
      <div className="hero-photo">
        <div className="hero-glow g1" />
        <div className="hero-glow g2" />
      </div>
      <div className="hero-portrait" ref={portraitRef}>
        <img src="headshot.webp" alt="Connor Shibley" />
        <div className="hero-portrait-shade" />
      </div>
      <div className="hero-silhouette"><Silhouette /></div>

      <div className="hero-content">
        <div className="hero-top">
          <div className="fade-up in stagger-1">
            <span className="hero-avail">
              <span className="pulse"></span>
              Looking for Summer 2026 opportunities
            </span>
          </div>
        </div>

        <div style={{marginTop: 'auto'}}>
          <h1 className="hero-title fade-up in stagger-2">
            <span className="br">I help businesses</span>
            <span className="br"><span className="it">actually</span> adopt AI.</span>
          </h1>

          <div className="hero-sub-row">
            <div className="hero-cta fade-up in stagger-4">
              <a className="btn btn-primary" href="#projects" onClick={(e) => { e.preventDefault(); onNav('projects'); }}>
                See the work <span className="arr">&rarr;</span>
              </a>
              <a className="btn btn-ghost" href="#resume" onClick={(e) => { e.preventDefault(); onNav('resume'); }}>
                View r&eacute;sum&eacute;
              </a>
            </div>
          </div>

          <div className="hero-meta fade-up in stagger-5">
            <span>Geneva, NY &middot; Ottawa, ON</span><span className="dot"></span>
            <span>HWS '28</span><span className="dot"></span>
            <span>Econ + Mgmt</span><span className="dot"></span>
            <span>Licom.ai &middot; HWS AI Club President &middot; Statesmen #31</span>
          </div>
        </div>
      </div>
    </section>
  );
}

function Marquee() {
  const items = [
    ['Prompt engineering', true],
    ['n8n automation', false],
    ['Antigravity', true],
    ['Agent workflows', false],
    ['LLM evaluation', false],
    ['RAG pipelines', true],
    ['Vector search', false],
    ['Claude · GPT · Gemini', false],
    ['Fine-tuning', true],
    ['Multimodal', false],
    ['MCP servers', false],
    ['AI implementation', true],
    ['Vibecoding', false],
    ['Synthetic data', false],
    ['Tool use', true],
    ['Inference', false],
  ];
  const track = (
    <div className="marquee-track">
      {[...items, ...items].map((it, i) => (
        <div key={i} className="marquee-item">
          {it[1] ? <span className="it">{it[0]}</span> : it[0]}
        </div>
      ))}
    </div>
  );
  return (
    <div className="marquee" aria-hidden="true">
      {track}
    </div>
  );
}

function ClientsMarquee() {
  const clients = [
    { id: 'southside', name: 'Southside Tap & Grill', src: 'logos/southside.png' },
    { id: 'sumit', name: 'Summit Strength & Fitness', src: 'logos/summit.png' },
    { id: 'hws', name: 'Hobart and William Smith Colleges', src: 'logos/hws.png', color: true },
    { id: 'energizing', name: 'Energizing Talent', src: 'logos/energizing-talent.png', color: true },
    { id: 'cst', name: 'CST Logistics', src: 'logos/cst.png', color: true },
    { id: 'delex', name: 'Delex Cargo Services', src: 'logos/delex.png', color: true },
    { id: 'licom', name: 'Licom.ai', src: 'logos/licom.png' },
    { id: 'flx', name: 'FLX Extracts', src: 'logos/flx.png', color: true },
    { id: 'ccn', name: 'CCN', src: 'logos/ccn.svg', color: true },
  ];
  const row = [...clients, ...clients];
  return (
    <section className="clients">
      <div className="clients-head">
        <span className="clients-label">Clients &middot; Collaborators</span>
      </div>
      <div className="clients-marquee">
        <div className="clients-track">
          {row.map((c, i) => (
            <div key={c.id + '-' + i} className={`clients-item clients-logo-item${c.color ? ' is-color' : ''}`} title={c.name}>
              <img
                src={c.src}
                alt={c.name}
                style={{ width: '220px', height: '110px', objectFit: 'contain' }}
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function About() {
  return (
    <section id="about" className="section section-pad">
      <Reveal className="section-head">
        <span className="num">01 /</span>
        <h2>About</h2>
        <span className="trail">&mdash; The short version</span>
      </Reveal>
      <div className="about-grid">
        <div>
          <Reveal>
            <p className="about-lede">
              Started AI to help my <span className="it">family's businesses.</span> Now consulting with <span className="it">10+ companies</span> &mdash; and still just getting started.
            </p>
          </Reveal>
          <Reveal delay={0.1}>
            <div className="about-body">
              <p>
                I got my start in AI the way a lot of people do — solving a problem in front of me. My dad runs a restaurant in Ottawa called <strong>Southside</strong>, and my brother owns a gym called <strong>Sumit Strength</strong>. I started using AI to help with their marketing — social content, email campaigns, customer analysis — and realized pretty fast that the tools were ready; most businesses just didn't know how to pick them up.
              </p>
              <p>
                That's the gap I work in now. I'm a sophomore at Hobart and William Smith Colleges, double-majoring in Economics and Management & Entrepreneurship (class of 2028, 3.5 GPA). Day to day I'm an AI Consulting Intern at <strong>Licom.ai</strong>, a Global AI Strategist on the HWS AI Club On Board, and a goaltender for the NCAA D3 Hobart Statesmen — <strong>2025 National Champions</strong>.
              </p>
              <p>
                The same competitive fire that drives me in the crease drives how I work with companies. I've always been an innovator — rebuilding, rethinking, refusing to accept "that's how it's done." Now I have the tools to channel that into real impact, helping businesses move faster, operate smarter, and build what's next.
              </p>
            </div>
          </Reveal>
          <Reveal delay={0.2}>
            <div className="about-signature">Built for the next play.</div>
          </Reveal>
        </div>
        <Reveal delay={0.1}>
          <div className="photo-plate">
            <img src="hockey.webp" alt="Connor Shibley, Hobart Statesmen" className="photo-plate-img" />
            <span className="cap">[ Hobart Statesmen &middot; 2025 National Champions ]</span>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

function Stats() {
  const items = [
    ['3.5', 'GPA · HWS'],
    ['10+', 'Client engagements', true],
    ["'25", 'National Champions'],
    ["'28", 'HWS graduation'],
  ];
  return (
    <Reveal className="stats stats-grid">
      {items.map(([v, l, it], i) => (
        <div key={i} className="stat">
          <div className="val">{it ? <span className="it">{v}</span> : v}</div>
          <div className="lbl">{l}</div>
        </div>
      ))}
    </Reveal>
  );
}

function Experience() {
  const rows = [
    {
      ix: '01',
      role: 'AI Consulting Intern',
      org: 'Licom.ai · Huntington Beach, CA',
      blurb: 'Support AI marketing and implementation projects. Manage LinkedIn presence across client accounts — content, analytics, and strategy. Run structured QA reviews of client dashboards and AI automation deliverables. Draft issue reports and Linear tickets, coordinating cross-functional feedback on client work.',
      when: 'Jan 2026 — Present',
    },
    {
      ix: '02',
      role: 'Club President',
      org: 'HWS AI Club',
      blurb: 'President of the HWS AI Club. Shape club direction, strategy, and programming for the HWS AI community.',
      when: 'Sep 2025 — Present',
    },
    {
      ix: '03',
      role: 'NCAA D3 Goaltender, #31',
      org: 'Hobart Statesmen · 2025 National Champions',
      blurb: '2025 NCAA D3 National Champions, 2025 NEHC League Champions, 2026 SUNY League Champions, 2026 National Finalists. Balancing 40+ hours a week of athletic commitments with school.',
      when: 'Aug 2024 — Present',
    },
    {
      ix: '04',
      role: 'Seasonal Goalie Coach',
      org: 'Dave Stathos Goalie Performance Center · Ottawa, ON',
      blurb: 'Instruct goalies of all ages by designing customized training plans to improve technique and performance.',
      when: 'Apr 2019 — Present',
    },
    {
      ix: '05',
      role: 'Junior Hockey',
      org: 'Ottawa Junior Senators · CCHL',
      blurb: 'CCHL League Champions. 2020 OHL Draft pick.',
      when: 'Sep 2022 — Apr 2023',
    },
    {
      ix: '06',
      role: 'Member',
      org: 'HWS Investment Club',
      blurb: 'Company deep-dives, thesis writeups, and pitch practice. Foundation for the longer arc toward AI-adjacent finance.',
      when: 'Dec 2024 — Present',
    },
    {
      ix: '07',
      role: 'B.A., Economics · B.A., Management & Entrepreneurship',
      org: 'Hobart and William Smith Colleges · GPA 3.5',
      blurb: "Double-major, anticipated May 2028. Dean's List (Spring 2025 – Present). Elizabeth Blackwell Scholarship recipient. Bloomberg Market Concepts certified.",
      when: 'Class of 2028',
    },
  ];
  return (
    <section id="experience" className="section section-pad">
      <Reveal className="section-head">
        <span className="num">02 /</span>
        <h2>Experience</h2>
        <span className="trail">&mdash; Work, athletics, classroom</span>
      </Reveal>
      <div className="exp-list">
        {rows.map((r, i) => (
          <Reveal key={i} delay={i * 0.06} className="exp-row-wrap">
            <div className="exp-row">
              <div className="ix">{r.ix}</div>
              <div className="role">
                {r.role}
                <span className="org">{r.org}</span>
              </div>
              <div className="blurb">{r.blurb}</div>
              <div className="when">{r.when}</div>
            </div>
          </Reveal>
        ))}
      </div>
    </section>
  );
}

function Projects() {
  const [open, setOpen] = useState(null);
  const [lightbox, setLightbox] = useState(null);
  const rows = [
    {
      ix: '01', year: '2026', kind: 'EDU · WEB APP', slug: 'ai-fluency-coach',
      title: 'AI Fluency Coach', titleIt: 'Fluency',
      meta: 'hwsaicoach.com · Adaptive assessment · 6 dimensions',
      note: 'Built an AI fluency assessment platform from scratch — an adaptive 10-minute test that scores students across six dimensions (fundamentals, prompting, workflow, ethics, evaluation, integration), then generates personalized resources and a class leaderboard. Live at hwsaicoach.com, used by HWS students and faculty.',
      stack: ['React', 'Adaptive Assessment', 'Leaderboard', 'Resources'],
      facts: { Role: 'Designer + Builder', Scope: 'End-to-end', Status: 'Live · hwsaicoach.com' },
      photos: [
        { src: 'projects/ai-fluency-coach/ai-fluency-coach.png', cap: 'AI Fluency Coach — hwsaicoach.com landing page', href: 'https://hwsaicoach.com/' },
      ],
      links: [
        { label: 'Visit live site ↗', href: 'https://hwsaicoach.com/' },
      ],
    },
    {
      ix: '02', year: '2026', kind: 'EDU · LMS', slug: 'hws-literacy',
      title: 'HWS AI Literacy Course', titleIt: 'Literacy',
      meta: 'Canvas LMS · Four modules · Three-tier policy',
      note: 'A campus-wide AI literacy course delivered through Canvas. Four modules cover tool fluency, ethics, academic integrity, and applied workflows. The three-tier faculty policy scaffold gives instructors a clear framework for disclosure and permitted use.',
      stack: ['Canvas LMS', 'Curriculum', 'Policy'],
      facts: { Role: 'Curriculum lead', Scope: 'Campus-wide', Status: 'In deployment' },
      photos: [
        { src: 'projects/hws-literacy/01.webp', cap: 'Why AI in our school' },
        { src: 'projects/hws-literacy/02.webp', cap: 'Faculty presentation' },
        { src: 'projects/hws-literacy/03.webp', cap: 'Three-tier policy scaffold' },
        { src: 'projects/hws-literacy/04.webp', cap: 'Student module overview' },
        { src: 'projects/hws-literacy/05.webp', cap: 'Implementation plan' },
      ],
      links: [],
    },
    {
      ix: '03', year: '2025', kind: 'CLIENT · QA', slug: 'cst-dashboard',
      title: 'CST Logistics Dashboard QA', titleIt: 'QA',
      meta: 'Vercel · Linear · Production',
      note: 'Production QA for CST Logistics — a Chicagoland intermodal trucking and drayage carrier — built and shipped at Licom.ai. Regression cycles on each Vercel preview, structured Linear ticketing with repro steps and screenshots.',
      stack: ['Vercel', 'Linear', 'QA'],
      facts: { Role: 'QA lead (intern)', Client: 'CST Logistics', Cadence: 'Per-sprint' },
      photos: [
        { src: 'projects/cst-dashboard/landing.webp', cap: 'CST Logistics — live landing page', href: 'https://cst-logistics-dashboard-8f4r.vercel.app/' },
      ],
      links: [
        { label: 'Visit live site ↗', href: 'https://cst-logistics-dashboard-8f4r.vercel.app/' },
        { label: 'Licom.ai ↗', href: 'https://licom.ai' },
      ],
    },
    {
      ix: '04', year: '2025', kind: 'CLUB · CURRICULUM', slug: 'ai-bootcamp',
      title: 'AI Club Bootcamp', titleIt: 'Bootcamp',
      meta: '20 weeks · ~20 members · Project-based',
      note: 'Co-designed and co-led a 20-week bootcamp built around end-of-module deliverables and weekly critique. Focus shifted from tool tours to taste — students leave with a portfolio of real work, not a stack of demos.',
      stack: ['Curriculum', 'Teaching', 'Critique'],
      facts: { Role: 'President · Co-lead', Cohort: '20 members', Length: '20 weeks' },
      photos: [
        { src: 'projects/ai-bootcamp/teaching.webp', cap: 'Teaching the cohort — live transcription / AI tool walkthrough' },
      ],
      links: [],
    },
    {
      ix: '05', year: '2025', kind: 'AUTOMATION', slug: 'weekly-digest',
      title: 'AI Club Weekly Digest', titleIt: 'Digest',
      meta: 'n8n · OpenAI · Gmail · Sundays 10am ET',
      note: 'An n8n workflow that runs every Sunday at 10am ET — pulls the email list from a Google Sheet, fetches the latest AI news, has an OpenAI model write a personalized digest, then loops over the recipients and sends each one through Gmail.',
      stack: ['n8n', 'OpenAI', 'Google Sheets', 'Gmail'],
      facts: { Role: 'Builder', Cadence: 'Weekly · Sun 10am ET', Owner: 'HWS AI Club' },
      photos: [
        { src: 'projects/weekly-digest/workflow.webp', cap: 'n8n workflow — trigger → fetch → generate → loop → send' },
      ],
      links: [],
    },
    {
      ix: '06', year: '2025', kind: 'CLIENT · MARKETING', slug: 'linkedin-analytics',
      title: 'Licom Client LinkedIn', titleIt: 'LinkedIn',
      meta: 'Energizing Talent · DelEx Air Cargo · Editorial calendars + long-form posts',
      note: "LinkedIn content strategy and execution for Licom.ai clients across two industries — HR consulting (Energizing Talent) and global air freight (DelEx Air Cargo). Built editorial calendars, wrote the long-form posts in each client's voice, designed supporting infographics.",
      stack: ['LinkedIn', 'Content Strategy', 'Copywriting', 'Infographics'],
      facts: { Role: 'Marketing (intern)', Clients: 'Energizing Talent, DelEx Air Cargo', Output: 'Multi-client campaigns' },
      photos: [
        { src: 'projects/linkedin-analytics/toc.webp', cap: 'Energizing Talent — 90-day editorial calendar' },
        { src: 'projects/linkedin-analytics/infographic.webp', cap: 'Energizing Talent — Day 4 infographic' },
        { src: 'projects/linkedin-analytics/post.webp', cap: 'Energizing Talent — Day 4 LinkedIn post' },
        { src: 'projects/linkedin-analytics/delex-posts.webp', cap: 'DelEx Air Cargo — long-form posts' },
      ],
      links: [],
    },
    {
      ix: '07', year: '2026', kind: 'DESIGN · WEB', slug: 'web-design',
      title: 'Web Design', titleIt: 'Design',
      meta: 'Four shipped client sites · Brand + landing pages',
      note: 'Design and build editorial, high-fidelity websites end-to-end — brand system, type pairing, copy, and live responsive implementation. Four shipped client sites this year.',
      stack: ['HTML', 'CSS', 'React', 'Figma', 'Typography', 'Branding'],
      facts: { Role: 'Designer + Builder', Scope: 'End-to-end', Output: '4 live sites' },
      photos: [
        { src: 'projects/web-design/hws-ai-club.webp', cap: 'HWS AI Club', href: 'https://hws-ai-club.figma.site/' },
        { src: 'projects/web-design/energizing-talent.webp', cap: 'Energizing Talent', href: 'https://azalea-sprout-81212683.figma.site' },
        { src: 'projects/web-design/southside-tap.webp', cap: 'Southside Tap & Grill', href: 'https://nova-props-83849491.figma.site' },
        { src: 'projects/web-design/sumit-strength.webp', cap: 'Sumit Strength & Athletics', href: 'https://summit-strength.figma.site' },
      ],
      links: [
        { label: 'HWS AI Club ↗', href: 'https://hws-ai-club.figma.site/' },
        { label: 'Energizing Talent ↗', href: 'https://azalea-sprout-81212683.figma.site' },
        { label: 'Southside Tap & Grill ↗', href: 'https://nova-props-83849491.figma.site' },
        { label: 'Sumit Strength ↗', href: 'https://summit-strength.figma.site' },
      ],
    },
  ];

  useEffect(() => {
    if (lightbox === null) return;
    const onKey = (e) => {
      const p = rows[lightbox.project];
      if (!p) return;
      if (e.key === 'Escape') setLightbox(null);
      else if (e.key === 'ArrowLeft') setLightbox({ ...lightbox, idx: (lightbox.idx - 1 + p.photos.length) % p.photos.length });
      else if (e.key === 'ArrowRight') setLightbox({ ...lightbox, idx: (lightbox.idx + 1) % p.photos.length });
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [lightbox]);

  return (
    <section id="projects" className="section section-pad">
      <Reveal className="section-head">
        <span className="num">03 /</span>
        <h2>Projects</h2>
        <span className="trail">&mdash; Click any line to expand</span>
      </Reveal>
      <div className="proj-list">
        {rows.map((r, i) => {
          const isOpen = open === i;
          return (
            <div key={i}>
              <Reveal delay={i * 0.04}>
                <div className="proj-row" onClick={() => setOpen(isOpen ? null : i)}>
                  <div className="ix">{r.ix}</div>
                  <div className="title">
                    {r.title.split(r.titleIt)[0]}
                    <span className="it">{r.titleIt}</span>
                    {r.title.split(r.titleIt)[1]}
                    <span className="org">{r.kind}</span>
                  </div>
                  <div className="blurb">{r.note}</div>
                  <div className="when">
                    <span className="yr">{r.year}</span>
                    <span className="hint">{isOpen ? '− CLOSE' : '+ EXPAND'}</span>
                  </div>
                </div>
              </Reveal>
              <div className={`proj-detail ${isOpen ? 'open' : ''}`}>
                <div className="proj-detail-inner">
                  <div>
                    <p className="note">{r.note}</p>
                    <div className="stack">
                      {r.stack.map((s, j) => <span key={j}>{s}</span>)}
                    </div>
                    {r.links && r.links.length > 0 && (
                      <div className="proj-links">
                        {r.links.map((l, k) => (
                          <a key={k} href={l.href} target="_blank" rel="noopener noreferrer" className="proj-link">
                            {l.label}
                          </a>
                        ))}
                      </div>
                    )}
                  </div>
                  <div className="facts">
                    {Object.entries(r.facts).map(([k, v]) => (
                      <div key={k}><span className="k">{k}</span><span className="v">{v}</span></div>
                    ))}
                  </div>
                </div>
                {r.photos && r.photos.length > 0 && (
                  <div className="proj-gallery">
                    {r.photos.map((p, k) => (
                      <button
                        key={k}
                        className="proj-photo"
                        onClick={() => setLightbox({ project: i, idx: k })}
                        aria-label={`Open photo: ${p.cap || 'image'}`}
                      >
                        <img
                          src={p.src}
                          alt={p.cap || ''}
                          loading="lazy"
                          onError={(e) => { e.currentTarget.parentElement.classList.add('missing'); }}
                        />
                        <span className="proj-photo-cap">
                          <span className="ix">{String(k + 1).padStart(2, '0')}</span>
                          <span>{p.cap}</span>
                        </span>
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
      {lightbox !== null && (() => {
        const p = rows[lightbox.project];
        const ph = p.photos[lightbox.idx];
        const prev = () => setLightbox({ ...lightbox, idx: (lightbox.idx - 1 + p.photos.length) % p.photos.length });
        const next = () => setLightbox({ ...lightbox, idx: (lightbox.idx + 1) % p.photos.length });
        return (
          <div className="lightbox" onClick={() => setLightbox(null)}>
            <button className="lb-close" onClick={() => setLightbox(null)} aria-label="Close">&times; CLOSE</button>
            <button className="lb-nav lb-prev" onClick={(e) => { e.stopPropagation(); prev(); }} aria-label="Previous">&larr;</button>
            <div className="lb-stage" onClick={(e) => e.stopPropagation()}>
              <img src={ph.src} alt={ph.cap || ''} className="lb-img" onError={(e) => { e.currentTarget.style.opacity = 0.2; }} />
              <div className="lb-caption">
                <span className="lb-ix">{p.ix} &middot; {String(lightbox.idx + 1).padStart(2, '0')} / {String(p.photos.length).padStart(2, '0')}</span>
                <span>{ph.cap}</span>
                <span className="lb-title">{p.title}</span>
                {ph.href && (
                  <a className="lb-link" href={ph.href} target="_blank" rel="noopener noreferrer" onClick={(e) => e.stopPropagation()}>
                    Visit site {'↗'}
                  </a>
                )}
              </div>
            </div>
            <button className="lb-nav lb-next" onClick={(e) => { e.stopPropagation(); next(); }} aria-label="Next">&rarr;</button>
          </div>
        );
      })()}
    </section>
  );
}

function ResumeViewer() {
  const sectionRef = useRef(null);
  const containerRef = useRef(null);
  const [status, setStatus] = useState('idle');

  useEffect(() => {
    if (!sectionRef.current) return;
    const io = new IntersectionObserver((entries) => {
      entries.forEach((e) => {
        if (e.isIntersecting) {
          setStatus((s) => (s === 'idle' ? 'loading' : s));
          io.disconnect();
        }
      });
    }, { rootMargin: '200px 0px' });
    io.observe(sectionRef.current);
    return () => io.disconnect();
  }, []);

  useEffect(() => {
    if (status !== 'loading') return;
    let cancelled = false;
    (async () => {
      try {
        const [{ getDocument, GlobalWorkerOptions }, workerUrl] = await Promise.all([
          import('pdfjs-dist'),
          import('pdfjs-dist/build/pdf.worker.min.mjs?url').then((m) => m.default),
        ]);
        GlobalWorkerOptions.workerSrc = workerUrl;
        const pdf = await getDocument('resume.pdf').promise;
        if (cancelled || !containerRef.current) return;
        containerRef.current.innerHTML = '';
        for (let i = 1; i <= pdf.numPages; i++) {
          const page = await pdf.getPage(i);
          const viewport = page.getViewport({ scale: 2 });
          const canvas = document.createElement('canvas');
          canvas.className = 'resume-page';
          canvas.width = viewport.width;
          canvas.height = viewport.height;
          const ctx = canvas.getContext('2d');
          await page.render({ canvasContext: ctx, viewport }).promise;
          if (cancelled) return;
          containerRef.current.appendChild(canvas);
        }
        setStatus('ready');
      } catch (e) {
        console.error(e);
        setStatus('error');
      }
    })();
    return () => { cancelled = true; };
  }, [status]);

  return (
    <section id="resume" ref={sectionRef} className="section section-pad">
      <Reveal className="section-head">
        <span className="num">04 /</span>
        <h2>Résumé</h2>
        <span className="trail">&mdash; Scroll within the frame</span>
      </Reveal>
      <Reveal>
        <div className="resume-frame-wrap">
          <div className="resume-frame-head">
            <div className="resume-chip">
              <span className="dot-red" />
              <span className="dot-yellow" />
              <span className="dot-green" />
              <span className="resume-path">CS_Resume.pdf</span>
            </div>
            <div className="resume-actions">
              <a href="resume.pdf" target="_blank" rel="noopener noreferrer" className="resume-btn">Open {'↗'}</a>
              <a href="resume.pdf" download="Connor-Shibley-Resume.pdf" className="resume-btn">Download &darr;</a>
            </div>
          </div>
          <div className="resume-frame">
            {(status === 'idle' || status === 'loading') && <div className="resume-status">Loading resume&hellip;</div>}
            {status === 'error' && (
              <div className="resume-status">
                Couldn't render inline. <a href="resume.pdf" target="_blank" rel="noopener noreferrer" style={{color:'var(--accent)'}}>Open the PDF &rarr;</a>
              </div>
            )}
            <div ref={containerRef} className="resume-pages" />
          </div>
        </div>
      </Reveal>
    </section>
  );
}

function Contact() {
  return (
    <section id="contact" className="section section-pad">
      <Reveal className="section-head">
        <span className="num">05 /</span>
        <h2>Contact</h2>
        <span className="trail">&mdash; The easiest way to reach me</span>
      </Reveal>
      <div className="contact-single">
        <Reveal>
          <p className="contact-lede">
            Want AI in your business? Let's <span className="it">talk.</span>
          </p>
        </Reveal>
        <Reveal delay={0.1}>
          <div className="contact-channels">
            <a className="contact-channel" href="mailto:Connorshibley@gmail.com">
              <span className="k">Email</span>
              <span className="v">Connorshibley@gmail.com</span>
              <span className="arrow">&rarr;</span>
            </a>
            <a className="contact-channel" href="tel:+13157590898">
              <span className="k">Phone</span>
              <span className="v">+1 (315) 759-0898</span>
              <span className="arrow">&rarr;</span>
            </a>
            <a className="contact-channel" href="https://linkedin.com/in/connor-shibley" target="_blank" rel="noopener noreferrer">
              <span className="k">LinkedIn</span>
              <span className="v">/in/connor-shibley</span>
              <span className="arrow">{'↗'}</span>
            </a>
            <a className="contact-channel" href="resume.pdf" download="Connor-Shibley-Resume.pdf">
              <span className="k">Résumé</span>
              <span className="v">Download &middot; PDF</span>
              <span className="arrow">&darr;</span>
            </a>
            <a className="contact-channel" href="#location" onClick={(e) => e.preventDefault()}>
              <span className="k">Based in</span>
              <span className="v">Geneva, NY &middot; Ottawa, ON</span>
              <span className="arrow">&middot;</span>
            </a>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

function Footer({ onNav }) {
  return (
    <footer className="footer">
      <div className="footer-inner">
        <div className="footer-mark">
          Connor<br/>
          <span className="it">Shibley.</span>
        </div>
        <div className="footer-col">
          <h4>Site</h4>
          <a href="#about" onClick={(e) => { e.preventDefault(); onNav('about'); }}>About</a>
          <a href="#experience" onClick={(e) => { e.preventDefault(); onNav('experience'); }}>Experience</a>
          <a href="#projects" onClick={(e) => { e.preventDefault(); onNav('projects'); }}>Projects</a>
          <a href="#resume" onClick={(e) => { e.preventDefault(); onNav('resume'); }}>Résumé</a>
          <a href="#contact" onClick={(e) => { e.preventDefault(); onNav('contact'); }}>Contact</a>
        </div>
        <div className="footer-col">
          <h4>Elsewhere</h4>
          <a href="https://linkedin.com/in/connor-shibley" target="_blank" rel="noopener noreferrer">LinkedIn</a>
          <a href="mailto:Connorshibley@gmail.com">Email</a>
          <a href="resume.pdf" target="_blank" rel="noopener noreferrer">Résumé (PDF)</a>
          <a href="https://licom.ai" target="_blank" rel="noopener noreferrer">Licom.ai</a>
        </div>
      </div>
      <div className="footer-bottom">
        <span>&copy; 2026 Connor Shibley &middot; Geneva, NY &middot; Ottawa, ON</span>
        <span>Built by hand &middot; Last updated May '26</span>
      </div>
    </footer>
  );
}

export { useTheme, Reveal, ScrollProgress, Nav, Hero, Marquee, ClientsMarquee, About, Stats, Experience, Projects, ResumeViewer, Contact, Footer };
