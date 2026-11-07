// Primitivas de UI reutilizables (badges, iconos, botones, tarjetas).

export function Badge({ children, tone = "green" }) {
  const tones = {
    green: { bg: "var(--green-soft)", fg: "var(--green)" },
    amber: { bg: "var(--amber-soft)", fg: "var(--amber)" },
    gray: { bg: "#EEEDE8", fg: "var(--muted)" },
  }[tone];
  return (
    <span
      style={{
        background: tones.bg,
        color: tones.fg,
        fontSize: 12,
        fontWeight: 600,
        padding: "4px 9px",
        borderRadius: 99,
        display: "inline-flex",
        gap: 5,
        alignItems: "center",
        lineHeight: 1.2,
      }}
    >
      {children}
    </span>
  );
}

export function Check({ c = "var(--green)" }) {
  return (
    <svg
      width="15"
      height="15"
      viewBox="0 0 24 24"
      fill="none"
      style={{ flex: "0 0 auto", marginTop: 2 }}
    >
      <circle cx="12" cy="12" r="11" fill={c} opacity=".14" />
      <path
        d="M7 12.5l3 3 7-7.5"
        stroke={c}
        strokeWidth="2.2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function Shield({ s = 14, c = "var(--green)" }) {
  return (
    <svg width={s} height={s} viewBox="0 0 24 24" fill="none">
      <path d="M12 2l8 3v6c0 5-3.4 8.3-8 11-4.6-2.7-8-6-8-11V5l8-3z" fill={c} opacity=".16" />
      <path
        d="M12 2l8 3v6c0 5-3.4 8.3-8 11-4.6-2.7-8-6-8-11V5l8-3z"
        stroke={c}
        strokeWidth="1.6"
      />
      <path
        d="M8.5 12l2.4 2.4 4.6-5"
        stroke={c}
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function Star() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="var(--amber)">
      <path d="M12 2l3 6.3 6.9.9-5 4.8 1.2 6.9L12 18.6 5.9 21l1.2-6.9-5-4.8 6.9-.9L12 2z" />
    </svg>
  );
}

export function Btn({ children, onClick, variant = "primary", sub }) {
  const base = {
    width: "100%",
    border: "none",
    borderRadius: 12,
    padding: "14px 16px",
    fontSize: 15,
    fontWeight: 700,
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    gap: 2,
  };
  const styles = {
    primary: { ...base, background: "var(--green)", color: "#fff" },
    amber: { ...base, background: "var(--amber)", color: "#fff" },
    ghost: {
      ...base,
      background: "transparent",
      color: "var(--green)",
      border: "1.5px solid var(--green)",
    },
  }[variant];
  return (
    <button onClick={onClick} style={styles}>
      {children}
      {sub && (
        <span style={{ fontSize: 11.5, fontWeight: 500, opacity: 0.85 }}>{sub}</span>
      )}
    </button>
  );
}

export function Section({ children }) {
  return (
    <div className="fade" style={{ display: "flex", flexDirection: "column", gap: 14 }}>
      {children}
    </div>
  );
}

export function H({ children, sub }) {
  return (
    <div>
      <h2
        style={{
          fontFamily: "var(--font-display)",
          fontWeight: 600,
          fontSize: 21,
          margin: "0 0 2px",
          letterSpacing: "-.01em",
        }}
      >
        {children}
      </h2>
      {sub && <p style={{ margin: 0, color: "var(--muted)", fontSize: 13.5 }}>{sub}</p>}
    </div>
  );
}

export function Card({ children, onClick, pad = 14 }) {
  return (
    <div
      onClick={onClick}
      style={{
        background: "var(--card)",
        border: "1px solid var(--line)",
        borderRadius: 14,
        padding: pad,
        boxShadow: "var(--shadow)",
        cursor: onClick ? "pointer" : "default",
      }}
    >
      {children}
    </div>
  );
}

export function Row({ children }) {
  return (
    <div
      style={{
        display: "flex",
        alignItems: "flex-start",
        gap: 9,
        fontSize: 13.5,
        color: "var(--ink)",
      }}
    >
      {children}
    </div>
  );
}

export function Avatar({ t, size = 46 }) {
  return (
    <div
      style={{
        width: size,
        height: size,
        borderRadius: "50%",
        flex: "0 0 auto",
        background: "linear-gradient(135deg,#0E7C66,#17A085)",
        color: "#fff",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        fontWeight: 700,
        fontSize: size * 0.34,
      }}
    >
      {t}
    </div>
  );
}
