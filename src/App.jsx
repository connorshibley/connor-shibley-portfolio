import { useEffect, useState } from 'react';
import {
  Nav,
  Hero,
  ClientsMarquee,
  Stats,
  About,
  Marquee,
  Experience,
  Projects,
  ResumeViewer,
  Contact,
  Footer,
  ScrollProgress,
} from './components.jsx';
import { TweaksPanel, TWEAK_DEFAULTS, applyTweaks } from './tweaks.jsx';

export default function App() {
  const [scrolled, setScrolled] = useState(false);
  const [tweaks, setTweaks] = useState(TWEAK_DEFAULTS);
  const [tweaksOpen, setTweaksOpen] = useState(false);

  useEffect(() => { applyTweaks(tweaks); }, [tweaks]);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    onScroll();
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    const onKey = (e) => {
      const tag = e.target?.tagName;
      if (tag === 'INPUT' || tag === 'TEXTAREA') return;
      if (e.shiftKey && (e.key === 'T' || e.key === 't')) {
        e.preventDefault();
        setTweaksOpen((v) => !v);
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);

  const handleNav = (target) => {
    if (target === 'home') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }
    const el = document.getElementById(target);
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <>
      <div className="grain" />
      <ScrollProgress />
      <Nav scrolled={scrolled} onNav={handleNav} route="home" />
      <Hero onNav={handleNav} />
      <ClientsMarquee />
      <Stats />
      <About />
      <Marquee />
      <Experience />
      <Projects />
      <ResumeViewer />
      <Contact />
      <Footer onNav={handleNav} />
      {tweaksOpen && <TweaksPanel tweaks={tweaks} setTweaks={setTweaks} onClose={() => setTweaksOpen(false)} />}
    </>
  );
}
