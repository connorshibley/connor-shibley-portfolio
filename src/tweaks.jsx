export const TWEAK_DEFAULTS = {
  "accent": "#2563EB",
  "accentHue": 225,
  "bgTone": "ink",
  "typePair": "serif-sans",
  "heroVariant": "fullbleed",
  "italicPhrases": true,
  "sectionNumbers": true,
  "grayscalePhotos": true,
  "grainAmount": 4,
  "glowAmount": 10,
  "pulseDot": true,
  "hairlineDividers": true,
  "marqueeEnabled": true,
  "motionLevel": "medium",
  "fontSizeScale": 100
};

const ACCENTS = [
  { name: 'Electric Blue', hex: '#2563EB' },
  { name: 'Rink Cyan', hex: '#06B6D4' },
  { name: 'Ember', hex: '#F97316' },
  { name: 'Lime', hex: '#84CC16' },
  { name: 'Crimson', hex: '#DC2626' },
  { name: 'Violet', hex: '#7C3AED' },
];
const BG_TONES = {
  ink:   { '--ink': '#0A0A0A', '--ink-2': '#101010', '--paper': '#FAFAF7', label: 'Ink' },
  warm:  { '--ink': '#0B0A08', '--ink-2': '#12100D', '--paper': '#F7F2E8', label: 'Warm' },
  cool:  { '--ink': '#08090B', '--ink-2': '#0F1013', '--paper': '#F4F6FA', label: 'Cool' },
  paper: { '--ink': '#F4F1EA', '--ink-2': '#EDEAE2', '--paper': '#12110F', label: 'Paper' },
};
const TYPE_PAIRS = {
  'serif-sans': { display: "'Instrument Serif', Georgia, serif", body: "'IBM Plex Sans', sans-serif", mono: "'JetBrains Mono', monospace", label: 'Serif + Plex' },
  'mono-heavy': { display: "'JetBrains Mono', monospace", body: "'IBM Plex Sans', sans-serif", mono: "'JetBrains Mono', monospace", label: 'Mono-First' },
  'serif-all': { display: "'Instrument Serif', serif", body: "'Instrument Serif', serif", mono: "'JetBrains Mono', monospace", label: 'Serif All' },
};

export function applyTweaks(t) {
  const root = document.documentElement;
  root.style.setProperty('--accent', t.accent);
  root.style.setProperty('--accent-soft', hexToRgba(t.accent, 0.18));
  const tone = BG_TONES[t.bgTone] || BG_TONES.ink;
  root.style.setProperty('--ink', tone['--ink']);
  root.style.setProperty('--ink-2', tone['--ink-2']);
  root.style.setProperty('--paper', tone['--paper']);
  const isLight = t.bgTone === 'paper';
  root.style.setProperty('--paper-dim', isLight ? 'rgba(18,17,15,0.72)' : 'rgba(250,250,247,0.72)');
  root.style.setProperty('--paper-mute', isLight ? 'rgba(18,17,15,0.48)' : 'rgba(250,250,247,0.48)');
  root.style.setProperty('--hairline', isLight ? 'rgba(18,17,15,0.12)' : 'rgba(250,250,247,0.08)');
  root.style.setProperty('--hairline-strong', isLight ? 'rgba(18,17,15,0.22)' : 'rgba(250,250,247,0.16)');
  root.style.setProperty('--grain-opacity', (t.grainAmount / 100).toString());
  root.style.setProperty('--glow-opacity', (t.glowAmount / 100).toString());
  const pair = TYPE_PAIRS[t.typePair] || TYPE_PAIRS['serif-sans'];
  root.style.setProperty('--f-display', pair.display);
  root.style.setProperty('--f-body', pair.body);
  root.style.setProperty('--f-mono', pair.mono);
  document.body.style.fontFamily = pair.body;
  document.documentElement.style.fontSize = (16 * t.fontSizeScale / 100) + 'px';
  document.body.classList.toggle('no-italics', !t.italicPhrases);
  document.body.classList.toggle('no-section-nums', !t.sectionNumbers);
  document.body.classList.toggle('color-photos', !t.grayscalePhotos);
  document.body.classList.toggle('no-pulse', !t.pulseDot);
  document.body.classList.toggle('no-hairlines', !t.hairlineDividers);
  document.body.classList.toggle('no-marquee', !t.marqueeEnabled);
  document.body.classList.toggle('motion-low', t.motionLevel === 'low');
  document.body.classList.toggle('motion-high', t.motionLevel === 'high');
  document.body.setAttribute('data-hero-variant', t.heroVariant);
}

function hexToRgba(hex, a) {
  const h = hex.replace('#', '');
  const r = parseInt(h.substring(0, 2), 16);
  const g = parseInt(h.substring(2, 4), 16);
  const b = parseInt(h.substring(4, 6), 16);
  return `rgba(${r},${g},${b},${a})`;
}

export function TweaksPanel({ tweaks, setTweaks, onClose }) {
  const set = (k, v) => setTweaks(prev => ({ ...prev, [k]: v }));

  return (
    <div className="tweaks-panel">
      <div className="tweaks-head">
        <span className="t">Tweaks</span>
        <button onClick={onClose}>&times;</button>
      </div>
      <div className="tweaks-body">
        <div className="tweak-group">
          <h5>Accent color</h5>
          <div className="swatches">
            {ACCENTS.map(a => (
              <div key={a.hex}
                className={`swatch ${tweaks.accent === a.hex ? 'on' : ''}`}
                style={{ background: a.hex }}
                title={a.name}
                onClick={() => set('accent', a.hex)} />
            ))}
          </div>
        </div>

        <div className="tweak-group">
          <h5>Background tone</h5>
          <div className="seg">
            {Object.entries(BG_TONES).map(([k, v]) => (
              <button key={k} className={tweaks.bgTone === k ? 'on' : ''} onClick={() => set('bgTone', k)}>
                {v.label}
              </button>
            ))}
          </div>
        </div>

        <div className="tweak-group">
          <h5>Type pairing</h5>
          <div className="seg" style={{flexWrap:'wrap', gap:4}}>
            {Object.entries(TYPE_PAIRS).map(([k, v]) => (
              <button key={k} className={tweaks.typePair === k ? 'on' : ''} onClick={() => set('typePair', k)}>
                {v.label}
              </button>
            ))}
          </div>
        </div>

        <div className="tweak-group">
          <h5>Hero layout</h5>
          <div className="seg">
            <button className={tweaks.heroVariant === 'fullbleed' ? 'on' : ''} onClick={() => set('heroVariant', 'fullbleed')}>Full-bleed</button>
            <button className={tweaks.heroVariant === 'split' ? 'on' : ''} onClick={() => set('heroVariant', 'split')}>Split</button>
            <button className={tweaks.heroVariant === 'stacked' ? 'on' : ''} onClick={() => set('heroVariant', 'stacked')}>Stacked</button>
          </div>
        </div>

        <div className="tweak-group">
          <h5>Motion</h5>
          <div className="seg">
            <button className={tweaks.motionLevel === 'low' ? 'on' : ''} onClick={() => set('motionLevel', 'low')}>Quiet</button>
            <button className={tweaks.motionLevel === 'medium' ? 'on' : ''} onClick={() => set('motionLevel', 'medium')}>Default</button>
            <button className={tweaks.motionLevel === 'high' ? 'on' : ''} onClick={() => set('motionLevel', 'high')}>Lively</button>
          </div>
        </div>

        <div className="tweak-group">
          <h5>Signature moves</h5>
          <div className="tweak-row">
            <label>Italic accent phrases</label>
            <button className={`tglswitch ${tweaks.italicPhrases ? 'on' : ''}`} onClick={() => set('italicPhrases', !tweaks.italicPhrases)} />
          </div>
          <div className="tweak-row">
            <label>Section numbers (01 /)</label>
            <button className={`tglswitch ${tweaks.sectionNumbers ? 'on' : ''}`} onClick={() => set('sectionNumbers', !tweaks.sectionNumbers)} />
          </div>
          <div className="tweak-row">
            <label>Grayscale photos</label>
            <button className={`tglswitch ${tweaks.grayscalePhotos ? 'on' : ''}`} onClick={() => set('grayscalePhotos', !tweaks.grayscalePhotos)} />
          </div>
          <div className="tweak-row">
            <label>Availability pulse</label>
            <button className={`tglswitch ${tweaks.pulseDot ? 'on' : ''}`} onClick={() => set('pulseDot', !tweaks.pulseDot)} />
          </div>
          <div className="tweak-row">
            <label>Hairline dividers</label>
            <button className={`tglswitch ${tweaks.hairlineDividers ? 'on' : ''}`} onClick={() => set('hairlineDividers', !tweaks.hairlineDividers)} />
          </div>
          <div className="tweak-row">
            <label>Skills marquee</label>
            <button className={`tglswitch ${tweaks.marqueeEnabled ? 'on' : ''}`} onClick={() => set('marqueeEnabled', !tweaks.marqueeEnabled)} />
          </div>
        </div>

        <div className="tweak-group">
          <h5>Grain &middot; {tweaks.grainAmount}%</h5>
          <input type="range" min="0" max="12" value={tweaks.grainAmount} onChange={e => set('grainAmount', +e.target.value)} />
        </div>

        <div className="tweak-group">
          <h5>Hero glow &middot; {tweaks.glowAmount}%</h5>
          <input type="range" min="0" max="30" value={tweaks.glowAmount} onChange={e => set('glowAmount', +e.target.value)} />
        </div>

        <div className="tweak-group">
          <h5>Type scale &middot; {tweaks.fontSizeScale}%</h5>
          <input type="range" min="85" max="115" value={tweaks.fontSizeScale} onChange={e => set('fontSizeScale', +e.target.value)} />
        </div>
      </div>
    </div>
  );
}

