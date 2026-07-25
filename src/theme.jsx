export const TOKENS = {
  graphite: "#1B1F24",
  blueprint: "#1868A8",
  blueprintDeep: "#0F4D82",
  copper: "#E2661C",
  copperLight: "#F3934D",
  cyan: "#1FC9B7",
  paper: "#FAF7EF",
  ink: "#1B1F24",
  danger: "#C63B3B",
};

export function GridBG({ dark }) {
  const line = dark ? "rgba(237,232,222,0.06)" : "rgba(27,31,36,0.06)";
  return (
    <div
      aria-hidden="true"
      style={{
        position: "absolute",
        inset: 0,
        backgroundImage: `linear-gradient(${line} 1px, transparent 1px), linear-gradient(90deg, ${line} 1px, transparent 1px)`,
        backgroundSize: "40px 40px",
        pointerEvents: "none",
      }}
    />
  );
}

export const globalStyles = `
  @import url('https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@500;600;700&family=Inter:wght@400;500;600&family=IBM+Plex+Mono:wght@400;500&display=swap');
  * { box-sizing: border-box; }
  body { margin: 0; }
  .akm-h1, .akm-h2, .akm-h3 { font-family: 'Space Grotesk', sans-serif; letter-spacing: -0.01em; }
  .akm-mono { font-family: 'IBM Plex Mono', monospace; }
  .akm-btn { transition: transform 0.15s ease, background 0.15s ease, border-color 0.15s ease, opacity 0.15s ease; cursor: pointer; }
  .akm-btn:active { transform: scale(0.97); }
  .akm-btn:disabled { opacity: 0.6; cursor: not-allowed; }
  .akm-card { transition: border-color 0.2s ease, transform 0.2s ease; }
  .akm-card:hover { border-color: ${TOKENS.copper}; transform: translateY(-2px); }
  .akm-nav a { position: relative; }
  .akm-nav a:after { content: ''; position: absolute; left: 0; bottom: -6px; width: 0; height: 1px; background: ${TOKENS.copper}; transition: width 0.2s ease; }
  .akm-nav a:hover:after { width: 100%; }
  input, select, textarea, button { font-family: 'Inter', sans-serif; }
  table { border-collapse: collapse; }
  #hizmetlerimiz, #teklif-form { scroll-margin-top: 88px; }
  .akm-spin { animation: akm-spin 0.8s linear infinite; }
  @keyframes akm-spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
  @keyframes akm-pulse { 0% { opacity: 0.8; transform: scale(1); } 100% { opacity: 0; transform: scale(1.35); } }
  @media (max-width: 860px) { .akm-desktop-nav { display: none !important; } .akm-mobile-toggle { display: flex !important; } .akm-split { grid-template-columns: 1fr !important; } .akm-hero-grid { grid-template-columns: 1fr !important; } .akm-hero-photo { order: -1; margin-bottom: 12px; } }
`;
