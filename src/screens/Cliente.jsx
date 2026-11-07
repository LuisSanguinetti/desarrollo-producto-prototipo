import { useState } from "react";
import { CATEGORIAS, PRESTADORES } from "../data.js";
import { Badge, Check, Shield, Star, Btn, Section, H, Card, Row } from "../components/ui.jsx";
import { Ico, PersonAvatar } from "../components/icons.jsx";

// Flujo del cliente: home -> describir -> candidatos -> perfil -> acordar -> pago -> seguimiento.
export default function Cliente({ go, data, setData }) {
  switch (data.screen) {
    case "home":
      return <Home go={go} setData={setData} />;
    case "describir":
      return <Describir go={go} />;
    case "candidatos":
      return <Candidatos go={go} setData={setData} />;
    case "perfil":
      return <PerfilPrestador go={go} p={data.sel} />;
    case "acordar":
      return <Acordar go={go} p={data.sel} />;
    case "pago":
      return <Pago go={go} />;
    case "seguimiento":
      return <Seguimiento go={go} />;
    default:
      return null;
  }
}

function PrestadorRow({ p, onClick }) {
  return (
    <Card onClick={onClick}>
      <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
        <div style={{ position: "relative" }}>
          <PersonAvatar v={p.v} size={50} />
          {p.online && (
            <span
              style={{
                position: "absolute",
                right: -1,
                bottom: -1,
                width: 13,
                height: 13,
                borderRadius: "50%",
                background: "#2BB673",
                border: "2.5px solid var(--card)",
              }}
            />
          )}
        </div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 5 }}>
            <strong style={{ fontSize: 15 }}>{p.nombre}</strong>
            {p.verificado && <Shield s={14} />}
          </div>
          <div
            style={{
              fontSize: 12.5,
              color: "var(--muted)",
              margin: "1px 0 5px",
              overflow: "hidden",
              textOverflow: "ellipsis",
              whiteSpace: "nowrap",
            }}
          >
            {p.titulo}
          </div>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 10,
              fontSize: 12.5,
              color: "var(--ink)",
            }}
          >
            <span style={{ display: "inline-flex", alignItems: "center", gap: 3, fontWeight: 600 }}>
              <Star /> {p.rating}
            </span>
            <span style={{ color: "var(--muted)" }}>·</span>
            <span style={{ display: "inline-flex", alignItems: "center", gap: 3, color: "var(--muted)" }}>
              <Ico.pin s={13} /> {p.distancia}
            </span>
            <span style={{ color: "var(--muted)" }}>·</span>
            <span style={{ display: "inline-flex", alignItems: "center", gap: 3, color: "var(--muted)" }}>
              <Ico.clock s={13} /> {p.responde}
            </span>
          </div>
        </div>
        <div style={{ textAlign: "right" }}>
          <div style={{ fontWeight: 700, color: "var(--amber)", fontSize: 13.5, whiteSpace: "nowrap" }}>
            {p.precio}
          </div>
          <div style={{ color: "var(--muted)", marginTop: 6 }}>
            <Ico.chevR />
          </div>
        </div>
      </div>
    </Card>
  );
}

function Home({ go, setData }) {
  return (
    <Section>
      {/* saludo + bell + avatar */}
      <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between" }}>
        <div>
          <div style={{ fontSize: 13.5, color: "var(--muted)" }}>Hola, Lucía 👋</div>
          <h2
            style={{
              fontFamily: "var(--font-display)",
              fontWeight: 600,
              fontSize: 22,
              margin: "2px 0 0",
              letterSpacing: "-.01em",
            }}
          >
            ¿Qué resolvemos hoy?
          </h2>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <span style={{ position: "relative", color: "var(--ink)" }}>
            <Ico.bell />
            <span
              style={{
                position: "absolute",
                top: -1,
                right: -1,
                width: 8,
                height: 8,
                borderRadius: "50%",
                background: "var(--amber)",
              }}
            />
          </span>
          <PersonAvatar v={0} size={38} />
        </div>
      </div>

      {/* ubicación */}
      <div style={{ display: "flex", alignItems: "center", gap: 5, color: "var(--muted)", fontSize: 13, marginTop: -4 }}>
        <Ico.pin /> <strong style={{ color: "var(--ink)", fontWeight: 600 }}>Pocitos, Montevideo</strong>
        <span style={{ marginLeft: 2 }}>▾</span>
      </div>

      {/* buscador */}
      <button
        onClick={() => go("describir")}
        style={{
          display: "flex",
          alignItems: "center",
          gap: 9,
          width: "100%",
          textAlign: "left",
          background: "var(--card)",
          border: "1px solid var(--line)",
          borderRadius: 13,
          padding: "13px 14px",
          color: "var(--muted)",
          fontSize: 14,
          boxShadow: "var(--shadow)",
        }}
      >
        <Ico.search /> ¿Qué necesitás? Armar, mudanza, limpieza…
      </button>

      {/* banner de confianza */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 11,
          background: "var(--green-soft)",
          borderRadius: 13,
          padding: "12px 14px",
        }}
      >
        <Shield s={26} />
        <div style={{ fontSize: 12.8, color: "var(--ink)", lineHeight: 1.4 }}>
          <strong>Gente verificada y pago protegido.</strong> Tu dinero se libera recién cuando el
          trabajo está hecho.
        </div>
      </div>

      {/* categorías */}
      <div>
        <div style={{ fontWeight: 700, fontSize: 14, margin: "2px 0 10px" }}>Categorías</div>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 10 }}>
          {CATEGORIAS.map((c) => {
            const I = Ico[c.ico];
            return (
              <button
                key={c.key}
                onClick={() => {
                  setData((d) => ({ ...d, tipo: c.key }));
                  go("describir");
                }}
                style={{
                  background: "var(--card)",
                  border: "1px solid var(--line)",
                  borderRadius: 13,
                  padding: "13px 6px 11px",
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  gap: 7,
                  boxShadow: "var(--shadow)",
                }}
              >
                <span
                  style={{
                    width: 40,
                    height: 40,
                    borderRadius: 11,
                    background: "var(--green-soft)",
                    color: "var(--green)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <I s={22} />
                </span>
                <span style={{ fontSize: 11.5, fontWeight: 600, color: "var(--ink)", textAlign: "center", lineHeight: 1.2 }}>
                  {c.label}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* cerca tuyo */}
      <div style={{ display: "flex", flexDirection: "column", gap: 11 }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
          <div style={{ fontWeight: 700, fontSize: 14 }}>Cerca tuyo</div>
          <span style={{ fontSize: 12.5, color: "var(--green)", fontWeight: 600 }}>Ver todos</span>
        </div>
        {PRESTADORES.map((p) => (
          <PrestadorRow
            key={p.id}
            p={p}
            onClick={() => {
              setData((d) => ({ ...d, sel: p }));
              go("perfil");
            }}
          />
        ))}
      </div>
    </Section>
  );
}

function Describir({ go }) {
  const [tipo, setTipo] = useState("armar");
  return (
    <Section>
      <H sub="Contanos qué necesitás. Te mostramos solo gente verificada cerca.">¿Qué changa tenés?</H>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 10 }}>
        {CATEGORIAS.map((c) => {
          const I = Ico[c.ico];
          const on = tipo === c.key;
          return (
            <button
              key={c.key}
              onClick={() => setTipo(c.key)}
              style={{
                background: on ? "var(--green-soft)" : "var(--card)",
                border: "1.5px solid " + (on ? "var(--green)" : "var(--line)"),
                color: on ? "var(--green)" : "var(--ink)",
                borderRadius: 13,
                padding: "12px 4px 10px",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                gap: 6,
                fontWeight: 600,
                fontSize: 11.5,
              }}
            >
              <I s={22} />
              <span style={{ textAlign: "center", lineHeight: 1.2 }}>{c.label}</span>
            </button>
          );
        })}
      </div>
      <Card pad={0}>
        <div style={{ padding: 14, borderBottom: "1px solid var(--line)" }}>
          <label style={{ fontSize: 12.5, fontWeight: 600, color: "var(--muted)" }}>Descripción</label>
          <div style={{ marginTop: 6, fontSize: 13.5, color: "var(--ink)" }}>
            Armar un placar de 3 puertas, ya comprado y en caja.
          </div>
        </div>
        <div style={{ display: "flex" }}>
          <div style={{ flex: 1, padding: 14, borderRight: "1px solid var(--line)" }}>
            <label style={{ fontSize: 12.5, fontWeight: 600, color: "var(--muted)" }}>Dónde</label>
            <div style={{ marginTop: 6, fontSize: 13.5 }}>Pocitos, Montevideo</div>
          </div>
          <div style={{ flex: 1, padding: 14 }}>
            <label style={{ fontSize: 12.5, fontWeight: 600, color: "var(--muted)" }}>Cuándo</label>
            <div style={{ marginTop: 6, fontSize: 13.5 }}>Hoy, tarde</div>
          </div>
        </div>
      </Card>
      <div style={{ display: "flex", gap: 8, alignItems: "center", color: "var(--muted)", fontSize: 12.5 }}>
        <div
          style={{
            width: 54,
            height: 54,
            borderRadius: 10,
            border: "1.5px dashed var(--line)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            flex: "0 0 auto",
            fontSize: 20,
          }}
        >
          ＋
        </div>
        <span>Sumá una foto para que te coticen mejor (opcional)</span>
      </div>
      <Btn onClick={() => go("candidatos")}>Ver prestadores disponibles</Btn>
    </Section>
  );
}

function Candidatos({ go, setData }) {
  return (
    <Section>
      <H sub="Todos con identidad verificada. Precio y reputación a la vista.">3 personas pueden ayudarte</H>
      {PRESTADORES.map((p) => (
        <PrestadorRow
          key={p.id}
          p={p}
          onClick={() => {
            setData((d) => ({ ...d, sel: p }));
            go("perfil");
          }}
        />
      ))}
    </Section>
  );
}

function PerfilPrestador({ go, p }) {
  return (
    <Section>
      <div style={{ display: "flex", gap: 13, alignItems: "center" }}>
        <PersonAvatar v={p.v} size={62} ring />
        <div>
          <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
            <h2 style={{ fontFamily: "var(--font-display)", fontWeight: 600, fontSize: 22, margin: 0 }}>
              {p.nombre}
            </h2>
            <Shield s={18} />
          </div>
          <div style={{ fontSize: 13, color: "var(--muted)" }}>
            En Vecino desde {p.desde} · {p.zona}
          </div>
        </div>
      </div>
      <div style={{ display: "flex", gap: 7, flexWrap: "wrap" }}>
        <Badge tone="amber">
          <Star /> {p.rating} · {p.resenas} reseñas
        </Badge>
        <Badge tone="gray">{p.trabajos} trabajos</Badge>
        {p.insignias.map((i) => (
          <Badge key={i}>
            <Shield /> {i}
          </Badge>
        ))}
      </div>
      <Card>
        <strong style={{ fontSize: 13.5 }}>Qué incluye este servicio</strong>
        <div style={{ display: "flex", flexDirection: "column", gap: 8, marginTop: 10 }}>
          {p.incluye.map((i) => (
            <Row key={i}>
              <Check />
              <span>{i}</span>
            </Row>
          ))}
        </div>
      </Card>
      <Card>
        <strong style={{ fontSize: 13.5 }}>Reseñas recientes</strong>
        <div style={{ marginTop: 9, fontSize: 13, color: "var(--ink)", lineHeight: 1.5 }}>
          <div style={{ marginBottom: 8 }}>
            <Stars /> <em>“Puntual y prolijo, dejó todo armado y limpio.”</em> — Ana, hace 3 días
          </div>
          <div>
            <Stars /> <em>“Re recomendable, trajo todas las herramientas.”</em> — Flor, hace 1 semana
          </div>
        </div>
      </Card>
      <Btn onClick={() => go("acordar")}>Acordar precio y alcance</Btn>
    </Section>
  );
}

function Stars() {
  return (
    <span style={{ display: "inline-flex", gap: 1, verticalAlign: "middle" }}>
      {[0, 1, 2, 3, 4].map((i) => (
        <Star key={i} />
      ))}
    </span>
  );
}

function Acordar({ go, p }) {
  return (
    <Section>
      <H sub="Dejá claro qué se hace y cuánto, antes de confirmar.">Acuerdo con {p.nombre}</H>
      <Card>
        <strong style={{ fontSize: 13.5 }}>La changa</strong>
        <div style={{ display: "flex", flexDirection: "column", gap: 8, marginTop: 10 }}>
          <Row>
            <Check />
            <span>Armar un placar de 3 puertas (ya comprado, en caja)</span>
          </Row>
          <Row>
            <Check />
            <span>Pocitos · hoy a partir de las 16:00</span>
          </Row>
          <Row>
            <Check />
            <span>Incluye herramientas y retirar el embalaje</span>
          </Row>
        </div>
      </Card>
      <Card>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <span style={{ fontSize: 13.5, color: "var(--muted)" }}>Precio acordado</span>
          <span style={{ fontFamily: "var(--font-display)", fontWeight: 600, fontSize: 24, color: "var(--amber)" }}>
            $ 1.400
          </span>
        </div>
        <div style={{ fontSize: 12, color: "var(--muted)", marginTop: 4 }}>
          Cerrado. Sin sorpresas al final: si aparece algo extra, se acuerda antes.
        </div>
      </Card>
      <Btn variant="amber" onClick={() => go("pago")}>
        Confirmar y pagar
      </Btn>
      <button
        onClick={() => go("candidatos")}
        style={{ background: "none", border: "none", color: "var(--muted)", fontSize: 13, fontWeight: 600 }}
      >
        Elegir otra persona
      </button>
    </Section>
  );
}

function Pago({ go }) {
  return (
    <Section>
      <H>Pago protegido</H>
      <Card>
        <div style={{ display: "flex", gap: 11, alignItems: "flex-start" }}>
          <Shield s={30} c="var(--amber)" />
          <div style={{ fontSize: 13.5, lineHeight: 1.5 }}>
            Pagás ahora, pero <strong>tu dinero queda retenido por Vecino</strong>. Recién se le
            libera al prestador <strong>cuando vos confirmás</strong> que el trabajo quedó bien.
          </div>
        </div>
      </Card>
      <Card>
        <div style={{ display: "flex", justifyContent: "space-between", fontSize: 13.5, marginBottom: 7 }}>
          <span>Trabajo</span>
          <span>$ 1.400</span>
        </div>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            fontSize: 13.5,
            color: "var(--muted)",
            marginBottom: 7,
          }}
        >
          <span>Comisión Vecino</span>
          <span>$ 140</span>
        </div>
        <div
          style={{
            borderTop: "1px solid var(--line)",
            paddingTop: 9,
            display: "flex",
            justifyContent: "space-between",
            fontWeight: 700,
            fontSize: 15,
          }}
        >
          <span>Total retenido</span>
          <span style={{ color: "var(--amber)" }}>$ 1.540</span>
        </div>
      </Card>
      <Btn variant="amber" onClick={() => go("seguimiento")} sub="El dinero no se libera hasta tu confirmación">
        Pagar $ 1.540 · queda en garantía
      </Btn>
    </Section>
  );
}

function Seguimiento({ go }) {
  const [done, setDone] = useState(false);
  const pasos = [
    { t: "Pago retenido", d: "$ 1.540 en garantía", ok: true },
    { t: "Mariana confirmó", d: "Llega hoy 16:00", ok: true },
    { t: "Trabajo en curso", d: "Armando el placar", ok: true },
    {
      t: "Confirmás y se libera el pago",
      d: done ? "¡Listo! Pago liberado a Mariana" : "Pendiente de tu OK",
      ok: done,
    },
  ];
  return (
    <Section>
      <H sub="Seguí la changa en vivo. Vos tenés el último control.">Changa en marcha</H>

      {/* mini-mapa */}
      <div
        style={{
          position: "relative",
          height: 120,
          borderRadius: 14,
          overflow: "hidden",
          border: "1px solid var(--line)",
        }}
      >
        <svg width="100%" height="100%" viewBox="0 0 340 120" preserveAspectRatio="xMidYMid slice">
          <rect width="340" height="120" fill="#EAF0ED" />
          <g stroke="#D4DED8" strokeWidth="2">
            <path d="M-10 30H350M-10 70H350M-10 100H350" />
            <path d="M60 -10V130M150 -10V130M240 -10V130" />
          </g>
          <path d="M40 95 Q120 80 150 70 T300 25" stroke="var(--green)" strokeWidth="3.5" fill="none" strokeDasharray="2 8" strokeLinecap="round" />
          <circle cx="40" cy="95" r="6" fill="var(--amber)" stroke="#fff" strokeWidth="2.5" />
          <circle cx="300" cy="25" r="7" fill="var(--green)" stroke="#fff" strokeWidth="2.5" />
        </svg>
        <div
          style={{
            position: "absolute",
            left: 10,
            bottom: 10,
            background: "var(--card)",
            borderRadius: 9,
            padding: "6px 10px",
            fontSize: 12,
            fontWeight: 600,
            boxShadow: "var(--shadow)",
          }}
        >
          Mariana está en camino · 8 min
        </div>
      </div>

      <Card>
        {pasos.map((s, i) => (
          <div key={i} style={{ display: "flex", gap: 11, paddingBottom: i < 3 ? 14 : 0 }}>
            <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
              <div
                style={{
                  width: 18,
                  height: 18,
                  borderRadius: "50%",
                  background: s.ok ? "var(--green)" : "var(--line)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                {s.ok && (
                  <svg width="11" height="11" viewBox="0 0 24 24">
                    <path d="M6 12.5l3.5 3.5 8-9" stroke="#fff" strokeWidth="3" fill="none" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                )}
              </div>
              {i < 3 && (
                <div style={{ width: 2, flex: 1, background: s.ok ? "var(--green)" : "var(--line)", minHeight: 24 }} />
              )}
            </div>
            <div style={{ marginTop: -2 }}>
              <div style={{ fontWeight: 600, fontSize: 14 }}>{s.t}</div>
              <div style={{ fontSize: 12.5, color: "var(--muted)" }}>{s.d}</div>
            </div>
          </div>
        ))}
      </Card>

      {!done ? (
        <Btn variant="amber" onClick={() => setDone(true)}>
          Confirmar trabajo terminado → liberar pago
        </Btn>
      ) : (
        <>
          <Card>
            <div style={{ textAlign: "center", fontSize: 14 }}>
              Se liberaron <strong>$ 1.400</strong> a Mariana. ¡Dejale una reseña!
            </div>
          </Card>
          <Btn variant="ghost" onClick={() => go("home")}>
            Volver al inicio
          </Btn>
        </>
      )}
    </Section>
  );
}
