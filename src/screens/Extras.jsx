import { ACTIVIDAD_CLIENTE, ACTIVIDAD_PRESTADOR } from "../data.js";
import { Badge, Shield, Star, Section, H, Card } from "../components/ui.jsx";
import { Ico, PersonAvatar } from "../components/icons.jsx";

// Pestaña "Actividad" / "Trabajos": historial de changas.
export function Actividad({ rol }) {
  const lista = rol === "cliente" ? ACTIVIDAD_CLIENTE : ACTIVIDAD_PRESTADOR;
  const sub = rol === "cliente" ? "Tus changas pasadas" : "Trabajos que hiciste";
  return (
    <Section>
      <H sub={sub}>{rol === "cliente" ? "Mi actividad" : "Mis trabajos"}</H>
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 10,
          background: "var(--green-soft)",
          borderRadius: 13,
          padding: "12px 14px",
        }}
      >
        <span style={{ color: "var(--green)" }}>
          <Ico.clock s={20} />
        </span>
        <div style={{ fontSize: 13, color: "var(--ink)" }}>
          <strong>1 changa en curso.</strong> Seguila desde Inicio.
        </div>
      </div>
      {lista.map((a, i) => (
        <Card key={i}>
          <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
            <PersonAvatar v={a.v} size={44} />
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ fontWeight: 600, fontSize: 14 }}>{a.titulo}</div>
              <div style={{ fontSize: 12.5, color: "var(--muted)" }}>
                {a.quien} · {a.fecha}
              </div>
            </div>
            <div style={{ textAlign: "right" }}>
              <div style={{ fontWeight: 700, color: "var(--amber)", fontSize: 14 }}>{a.monto}</div>
              <div style={{ fontSize: 11.5, color: "var(--green)", fontWeight: 600 }}>{a.estado}</div>
            </div>
          </div>
        </Card>
      ))}
    </Section>
  );
}

// Pestaña "Perfil": datos del usuario y cambio de modo (cliente / prestador).
export function Perfil({ rol, switchRol }) {
  const esCliente = rol === "cliente";
  return (
    <Section>
      <div style={{ display: "flex", gap: 14, alignItems: "center", marginTop: 4 }}>
        <PersonAvatar v={0} size={64} ring />
        <div>
          <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
            <h2 style={{ fontFamily: "var(--font-display)", fontWeight: 600, fontSize: 22, margin: 0 }}>Lucía M.</h2>
            <Shield s={18} />
          </div>
          <div style={{ fontSize: 13, color: "var(--muted)" }}>Pocitos, Montevideo</div>
        </div>
      </div>

      <div style={{ display: "flex", gap: 7, flexWrap: "wrap" }}>
        <Badge>
          <Shield /> Identidad verificada
        </Badge>
        <Badge tone="amber">
          <Star /> 4.9
        </Badge>
        <Badge tone="gray">Miembro desde 2023</Badge>
      </div>

      {[
        ["Métodos de pago", "Visa ···· 4421"],
        ["Mis direcciones", "Casa · Trabajo"],
        ["Ayuda y seguridad", "Centro de confianza"],
      ].map(([t, d]) => (
        <Card key={t}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <div>
              <div style={{ fontWeight: 600, fontSize: 14 }}>{t}</div>
              <div style={{ fontSize: 12.5, color: "var(--muted)" }}>{d}</div>
            </div>
            <span style={{ color: "var(--muted)" }}>
              <Ico.chevR />
            </span>
          </div>
        </Card>
      ))}

      {/* cambio de modo */}
      <Card>
        <div style={{ fontSize: 13, color: "var(--muted)", marginBottom: 10 }}>
          Estás usando Vecino como <strong style={{ color: "var(--ink)" }}>{esCliente ? "cliente" : "prestador"}</strong>.
        </div>
        <button
          onClick={() => switchRol(esCliente ? "prestador" : "cliente")}
          style={{
            width: "100%",
            border: "1.5px solid var(--green)",
            background: "transparent",
            color: "var(--green)",
            borderRadius: 12,
            padding: "12px",
            fontSize: 14,
            fontWeight: 700,
          }}
        >
          {esCliente ? "Cambiar a modo prestador" : "Cambiar a modo cliente"}
        </button>
      </Card>
    </Section>
  );
}
