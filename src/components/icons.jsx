// Iconos SVG (línea) y avatares ilustrados. Todo inline, sin imágenes externas.

const stroke = {
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 1.8,
  strokeLinecap: "round",
  strokeLinejoin: "round",
};

export const Ico = {
  home: (p) => (
    <svg viewBox="0 0 24 24" width={p?.s || 24} height={p?.s || 24} {...stroke}>
      <path d="M3 10.5 12 3l9 7.5" />
      <path d="M5 9.5V20h14V9.5" />
      <path d="M9.5 20v-5h5v5" />
    </svg>
  ),
  activity: (p) => (
    <svg viewBox="0 0 24 24" width={p?.s || 24} height={p?.s || 24} {...stroke}>
      <rect x="4" y="3.5" width="16" height="17" rx="2.5" />
      <path d="M8.5 3.5V2.5m7 1V2.5M8 9h8M8 13h8M8 17h5" />
    </svg>
  ),
  user: (p) => (
    <svg viewBox="0 0 24 24" width={p?.s || 24} height={p?.s || 24} {...stroke}>
      <circle cx="12" cy="8" r="4" />
      <path d="M4.5 20a7.5 7.5 0 0 1 15 0" />
    </svg>
  ),
  search: (p) => (
    <svg viewBox="0 0 24 24" width={p?.s || 20} height={p?.s || 20} {...stroke}>
      <circle cx="11" cy="11" r="7" />
      <path d="m20 20-3.5-3.5" />
    </svg>
  ),
  pin: (p) => (
    <svg viewBox="0 0 24 24" width={p?.s || 16} height={p?.s || 16} {...stroke}>
      <path d="M12 21s7-5.2 7-11a7 7 0 1 0-14 0c0 5.8 7 11 7 11Z" />
      <circle cx="12" cy="10" r="2.5" />
    </svg>
  ),
  clock: (p) => (
    <svg viewBox="0 0 24 24" width={p?.s || 15} height={p?.s || 15} {...stroke}>
      <circle cx="12" cy="12" r="9" />
      <path d="M12 7v5l3 2" />
    </svg>
  ),
  chevL: (p) => (
    <svg viewBox="0 0 24 24" width={p?.s || 22} height={p?.s || 22} {...stroke}>
      <path d="m14.5 6-6 6 6 6" />
    </svg>
  ),
  chevR: (p) => (
    <svg viewBox="0 0 24 24" width={p?.s || 18} height={p?.s || 18} {...stroke}>
      <path d="m9.5 6 6 6-6 6" />
    </svg>
  ),
  bell: (p) => (
    <svg viewBox="0 0 24 24" width={p?.s || 20} height={p?.s || 20} {...stroke}>
      <path d="M6 9a6 6 0 1 1 12 0c0 5 2 6 2 6H4s2-1 2-6Z" />
      <path d="M10 20a2 2 0 0 0 4 0" />
    </svg>
  ),
  // categorías
  armar: (p) => (
    <svg viewBox="0 0 24 24" width={p?.s || 24} height={p?.s || 24} {...stroke}>
      <path d="M14.5 6.5 18 3l3 3-3.5 3.5" />
      <path d="M15.5 9.5 7 18l-3 .9.9-3L13.5 7.5" />
      <path d="M4 20.5h6" />
    </svg>
  ),
  mudanza: (p) => (
    <svg viewBox="0 0 24 24" width={p?.s || 24} height={p?.s || 24} {...stroke}>
      <path d="M3.5 8.5 12 4l8.5 4.5L12 13 3.5 8.5Z" />
      <path d="M3.5 8.5V16L12 20.5 20.5 16V8.5M12 13v7.5" />
    </svg>
  ),
  colgar: (p) => (
    <svg viewBox="0 0 24 24" width={p?.s || 24} height={p?.s || 24} {...stroke}>
      <rect x="4" y="6" width="16" height="12" rx="1.5" />
      <path d="M12 3v3M8.5 14l2.5-3 2 2.5 1.5-1.8L17 14" />
    </svg>
  ),
  limpieza: (p) => (
    <svg viewBox="0 0 24 24" width={p?.s || 24} height={p?.s || 24} {...stroke}>
      <path d="M9 3h3v4H9zM9 7h3l1.5 7h-6L9 7Z" />
      <path d="M8 14h6v6.5a1 1 0 0 1-1 1H9a1 1 0 0 1-1-1V14Z" />
      <path d="M15 4.5h2M15.5 7.5h2.5M16 10.5h2" />
    </svg>
  ),
  jardin: (p) => (
    <svg viewBox="0 0 24 24" width={p?.s || 24} height={p?.s || 24} {...stroke}>
      <path d="M12 21c0-5 0-8 0-8" />
      <path d="M12 13c-4.5 0-7-2.5-7-7 4.5 0 7 2.5 7 7Z" />
      <path d="M12 11c0-3.5 2-6 6-6 0 3.5-2 6-6 6Z" />
    </svg>
  ),
  otro: (p) => (
    <svg viewBox="0 0 24 24" width={p?.s || 24} height={p?.s || 24} {...stroke}>
      <circle cx="5.5" cy="12" r="1.3" />
      <circle cx="12" cy="12" r="1.3" />
      <circle cx="18.5" cy="12" r="1.3" />
    </svg>
  ),
};

// Barra de estado estilo iOS
export function StatusBar() {
  return (
    <div
      style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        padding: "8px 22px 2px",
        fontSize: 13,
        fontWeight: 700,
        color: "var(--ink)",
      }}
    >
      <span style={{ letterSpacing: "0.02em" }}>9:41</span>
      <span style={{ display: "inline-flex", gap: 6, alignItems: "center" }}>
        {/* señal */}
        <svg width="18" height="12" viewBox="0 0 18 12">
          {[0, 1, 2, 3].map((i) => (
            <rect
              key={i}
              x={i * 4.5}
              y={8 - i * 2.4}
              width="3"
              height={4 + i * 2.4}
              rx="0.8"
              fill="var(--ink)"
            />
          ))}
        </svg>
        {/* wifi */}
        <svg width="16" height="12" viewBox="0 0 16 12" fill="none">
          <path d="M1 4.2a10 10 0 0 1 14 0" stroke="var(--ink)" strokeWidth="1.6" strokeLinecap="round" />
          <path d="M3.3 6.6a6.5 6.5 0 0 1 9.4 0" stroke="var(--ink)" strokeWidth="1.6" strokeLinecap="round" />
          <circle cx="8" cy="9.6" r="1.1" fill="var(--ink)" />
        </svg>
        {/* batería */}
        <svg width="26" height="13" viewBox="0 0 26 13">
          <rect x="0.5" y="1" width="22" height="11" rx="3" fill="none" stroke="var(--ink)" strokeOpacity="0.4" />
          <rect x="2" y="2.5" width="17" height="8" rx="1.6" fill="var(--ink)" />
          <rect x="24" y="4.5" width="2" height="4" rx="1" fill="var(--ink)" fillOpacity="0.4" />
        </svg>
      </span>
    </div>
  );
}

// Avatares ilustrados (3 variantes). Leen como foto de perfil sin usar imágenes externas.
const SKINS = ["#E8B894", "#C98A5E", "#8D5A3C"];
const HAIR = ["#2E2A26", "#5A3A24", "#1F2A33"];
const BG = [
  ["#0E7C66", "#17A085"],
  ["#B9820A", "#D9A33A"],
  ["#3A6B8C", "#5B93B8"],
];

export function PersonAvatar({ v = 0, size = 46, ring }) {
  const skin = SKINS[v % 3];
  const hair = HAIR[v % 3];
  const [c1, c2] = BG[v % 3];
  const id = "av" + v + "-" + size;
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 48 48"
      style={{
        flex: "0 0 auto",
        borderRadius: "50%",
        boxShadow: ring ? "0 0 0 2.5px var(--card), 0 0 0 4px var(--green)" : "none",
      }}
    >
      <defs>
        <linearGradient id={id} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor={c1} />
          <stop offset="1" stopColor={c2} />
        </linearGradient>
        <clipPath id={id + "c"}>
          <circle cx="24" cy="24" r="24" />
        </clipPath>
      </defs>
      <g clipPath={`url(#${id}c)`}>
        <rect width="48" height="48" fill={`url(#${id})`} />
        {/* hombros */}
        <ellipse cx="24" cy="46" rx="16" ry="12" fill="#ffffff" opacity="0.92" />
        {/* cuello */}
        <rect x="20.5" y="29" width="7" height="8" rx="3" fill={skin} />
        {/* cabeza */}
        <circle cx="24" cy="21" r="9.5" fill={skin} />
        {/* pelo */}
        <path d="M14.5 20c0-6 4.2-9.5 9.5-9.5S33.5 14 33.5 20c-1.5-2-3-3-5.5-3.3-.4 2-2 3-4 3-2.4 0-3.6-1.2-4-3-2.3.5-3.8 1.5-5.5 3.3Z" fill={hair} />
      </g>
    </svg>
  );
}
