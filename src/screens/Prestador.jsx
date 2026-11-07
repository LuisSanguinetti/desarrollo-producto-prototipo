import { useState } from "react";
import { CHANGAS_PRESTADOR } from "../data.js";
import { Badge, Check, Shield, Btn, Section, H, Card, Row } from "../components/ui.jsx";
import { Ico } from "../components/icons.jsx";

// Flujo del prestador: disponibles -> detalle -> aceptar.
export default function Prestador({ go, data, setData }) {
  switch (data.screen) {
    case "disponibles":
      return <Disponibles go={go} setData={setData} />;
    case "detalle":
      return <Detalle go={go} c={data.selc} />;
    default:
      return null;
  }
}

function Disponibles({ go, setData }) {
  return (
    <Section>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
        <H sub="Cada changa ya tiene el pago asegurado y la tarea definida.">Changas cerca tuyo</H>
      </div>

      {/* resumen de ganancias */}
      <div
        style={{
          background: "var(--ink)",
          color: "#fff",
          borderRadius: 14,
          padding: "14px 16px",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <div>
          <div style={{ fontSize: 12, opacity: 0.75 }}>Ganado esta semana</div>
          <div style={{ fontFamily: "var(--font-display)", fontWeight: 600, fontSize: 24 }}>$ 4.700</div>
        </div>
        <div style={{ textAlign: "right", fontSize: 12, opacity: 0.85 }}>
          <div>3 changas</div>
          <div style={{ color: "#8FD9C4", fontWeight: 600 }}>★ 4.9</div>
        </div>
      </div>

      {CHANGAS_PRESTADOR.map((c) => (
        <Card
          key={c.id}
          onClick={() => {
            setData((d) => ({ ...d, selc: c }));
            go("detalle");
          }}
        >
          <div style={{ display: "flex", justifyContent: "space-between", gap: 8 }}>
            <strong style={{ fontSize: 15 }}>{c.titulo}</strong>
            <span style={{ fontWeight: 700, color: "var(--amber)", whiteSpace: "nowrap" }}>{c.monto}</span>
          </div>
          <div
            style={{
              fontSize: 12.5,
              color: "var(--muted)",
              margin: "4px 0 10px",
              display: "flex",
              alignItems: "center",
              gap: 5,
            }}
          >
            <Ico.pin s={13} /> {c.zona} · {c.cuando}
          </div>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <Badge tone="amber">
              <Shield c="var(--amber)" /> Pago asegurado
            </Badge>
            <span style={{ color: "var(--green)", fontSize: 13, fontWeight: 600, display: "inline-flex", alignItems: "center" }}>
              Ver <Ico.chevR s={16} />
            </span>
          </div>
        </Card>
      ))}
    </Section>
  );
}

function Detalle({ go, c }) {
  const [ok, setOk] = useState(false);
  return (
    <Section>
      <H sub={c.zona + " · " + c.cuando}>{c.titulo}</H>
      <Card>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <span style={{ fontSize: 13.5, color: "var(--muted)" }}>Vas a cobrar</span>
          <span style={{ fontFamily: "var(--font-display)", fontWeight: 600, fontSize: 24, color: "var(--amber)" }}>
            {c.monto}
          </span>
        </div>
        <div style={{ marginTop: 8 }}>
          <Badge tone="amber">
            <Shield c="var(--amber)" /> El cliente ya pagó. El dinero está retenido y es tuyo al terminar.
          </Badge>
        </div>
      </Card>
      <Card>
        <strong style={{ fontSize: 13.5 }}>Pedido por {c.cliente}</strong>
        <div style={{ fontSize: 12.5, color: "var(--muted)", marginTop: 2 }}>Alcance definido</div>
        <div style={{ display: "flex", flexDirection: "column", gap: 8, marginTop: 10 }}>
          {c.alcance.map((a) => (
            <Row key={a}>
              <Check />
              <span>{a}</span>
            </Row>
          ))}
        </div>
      </Card>
      {!ok ? (
        <Btn onClick={() => setOk(true)}>Aceptar changa</Btn>
      ) : (
        <>
          <Card>
            <div style={{ textAlign: "center", fontSize: 14 }}>
              ✅ Aceptaste. El cliente ya recibió tu confirmación. Al terminar y confirmar, cobrás{" "}
              <strong>{c.monto}</strong>.
            </div>
          </Card>
          <Btn variant="ghost" onClick={() => go("disponibles")}>
            Ver más changas
          </Btn>
        </>
      )}
    </Section>
  );
}
