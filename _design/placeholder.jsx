// Placeholder image for project shots — subtle B&W striped panel with a label.
// Two variants: 'A' (clean) and 'B' (with monospace caption strip below).

function Placeholder({ label, sublabel, ratio = '4/3', variant = 'A', dark = false, tone = 'neutral' }) {
  // tone: 'neutral' (gray) | 'plan' (lighter) | 'photo' (darker)
  const toneStops = {
    neutral: ['#dcdad4', '#cbc8c1', '#bbb7af'],
    plan:    ['#ebe9e3', '#dedbd3', '#cfcbc1'],
    photo:   ['#9a9892', '#85837d', '#6f6d68'],
    dark:    ['#2a2a2c', '#1f1f21', '#161617'],
  };
  const stops = dark ? toneStops.dark : toneStops[tone];

  const stripe = `repeating-linear-gradient(135deg, ${stops[0]} 0 22px, ${stops[1]} 22px 44px, ${stops[2]} 44px 66px)`;

  return (
    <div
      style={{
        position: 'relative',
        width: '100%',
        aspectRatio: ratio,
        background: stripe,
        overflow: 'hidden',
      }}
    >
      {/* faint vignette */}
      <div style={{
        position: 'absolute', inset: 0,
        background: dark
          ? 'radial-gradient(ellipse at center, rgba(0,0,0,0) 40%, rgba(0,0,0,.35) 100%)'
          : 'radial-gradient(ellipse at center, rgba(255,255,255,0) 40%, rgba(0,0,0,.06) 100%)',
      }} />
      {/* corner crop marks */}
      <CornerMarks dark={dark} />
      {/* label */}
      {(label || sublabel) && (
        <div style={{
          position: 'absolute',
          left: 16, bottom: 16,
          fontFamily: 'JetBrains Mono, ui-monospace, monospace',
          fontSize: 10,
          letterSpacing: '0.08em',
          textTransform: 'uppercase',
          color: dark ? 'rgba(255,255,255,.75)' : 'rgba(0,0,0,.55)',
          background: dark ? 'rgba(0,0,0,.3)' : 'rgba(255,255,255,.7)',
          padding: '4px 7px',
          backdropFilter: 'blur(3px)',
        }}>
          {label}{sublabel && <span style={{ opacity: 0.55, marginLeft: 8 }}>{sublabel}</span>}
        </div>
      )}
    </div>
  );
}

function CornerMarks({ dark }) {
  const c = dark ? 'rgba(255,255,255,.4)' : 'rgba(0,0,0,.25)';
  const sz = 10;
  const off = 10;
  const mark = (pos) => {
    const base = { position: 'absolute', width: sz, height: sz, borderColor: c, borderStyle: 'solid', borderWidth: 0 };
    const map = {
      tl: { top: off, left: off, borderTopWidth: 1, borderLeftWidth: 1 },
      tr: { top: off, right: off, borderTopWidth: 1, borderRightWidth: 1 },
      bl: { bottom: off, left: off, borderBottomWidth: 1, borderLeftWidth: 1 },
      br: { bottom: off, right: off, borderBottomWidth: 1, borderRightWidth: 1 },
    };
    return <span key={pos} style={{ ...base, ...map[pos] }} />;
  };
  return <>{['tl','tr','bl','br'].map(mark)}</>;
}

window.Placeholder = Placeholder;
