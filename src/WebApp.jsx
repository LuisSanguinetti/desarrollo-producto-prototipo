import { useRef, useState, useEffect } from "react";
import { CATEGORIAS, PRESTADORES, CHANGAS_PRESTADOR } from "./data.js";
import { Badge, Check, Shield, Star, Btn, Card } from "./components/ui.jsx";
import { Ico, PersonAvatar } from "./components/icons.jsx";

// Versión web (desktop) del prototipo Vecino.
// Router simple por "view" + historial para "volver".

const INICIAL = { cliente: "home", prestador: "changas" };

export default function WebApp() {
  const [rol, setRol] = useState("cliente");
  const [data, setData] = useState({ view: INICIAL.cliente });
  const hist = useRef([INICIAL.cliente]);

  // Changas contratadas por el cliente. "en curso" hasta que las marca terminadas.
  // Se guardan en localStorage para que sobrevivan al recargar la página.
  const [jobs, setJobs] = useState(() => {
    try {
      const guardado = localStorage.getItem("vecino.jobs");
      return guardado ? JSON.parse(guardado) : [];
    } catch {
      return [];
    }
  });
  useEffect(() => {
    try {
      localStorage.setItem("vecino.jobs", JSON.stringify(jobs));
    } catch {
      /* modo privado o storage lleno: seguimos sin persistir */
    }
  }, [jobs]);

  // Trabajos aceptados por el prestador. "en curso" hasta que los marca cobrados.
  const [trabajos, setTrabajos] = useState(() => {
    try {
      const guardado = localStorage.getItem("vecino.trabajos");
      return guardado ? JSON.parse(guardado) : [];
    } catch {
      return [];
    }
  });
  useEffect(() => {
    try {
      localStorage.setItem("vecino.trabajos", JSON.stringify(trabajos));
    } catch {
      /* ignorar */
    }
  }, [trabajos]);
  const aceptarTrabajo = (c) => {
    const id = Date.now();
    setTrabajos((ts) => {
      if (ts.some((t) => t.changaId === c.id && t.estado === "en curso")) return ts;
      return [
        {
          id,
          changaId: c.id,
          titulo: c.titulo,
          zona: c.zona,
          cuando: c.cuando,
          monto: c.monto,
          cliente: c.cliente,
          estado: "en curso",
        },
        ...ts,
      ];
    });
    return id;
  };
  const cobrarTrabajo = (id) =>
    setTrabajos((ts) => ts.map((t) => (t.id === id ? { ...t, estado: "cobrada" } : t)));
  const addJob = (p) => {
    const id = Date.now();
    setJobs((js) => [
      {
        id,
        nombre: p?.nombre || "Prestador",
        v: p?.v ?? 0,
        titulo: "Armar un placar de 3 puertas",
        monto: "$ 1.400",
        estado: "en curso",
        fecha: "Hoy",
      },
      ...js,
    ]);
    return id;
  };
  const completeJob = (id) =>
    setJobs((js) => js.map((j) => (j.id === id ? { ...j, estado: "completada" } : j)));

  const go = (view, extra = {}) => {
    hist.current.push(view);
    setData((d) => ({ ...d, ...extra, view }));
  };
  const back = () => {
    if (hist.current.length > 1) {
      hist.current.pop();
      setData((d) => ({ ...d, view: hist.current[hist.current.length - 1] }));
    }
  };
  const switchRol = (r) => {
    setRol(r);
    hist.current = [INICIAL[r]];
    setData({ view: INICIAL[r] });
  };

  let body;
  if (rol === "cliente") {
    body =
      {
        home: <Home go={go} setData={setData} />,
        resultados: <Resultados go={go} setData={setData} />,
        perfilp: <PerfilPrestador go={go} p={data.sel} back={back} />,
        checkout: <Checkout go={go} p={data.sel} back={back} addJob={addJob} />,
        seguimiento: <Seguimiento go={go} p={data.sel} jobId={data.jobId} completeJob={completeJob} />,
        actividad: <Actividad go={go} setData={setData} jobs={jobs} />,
      }[data.view] || null;
  } else {
    body =
      {
        changas: <Changas go={go} setData={setData} />,
        detalle: <DetalleChanga go={go} c={data.selc} back={back} aceptarTrabajo={aceptarTrabajo} />,
        trabajoseg: <SeguimientoPrestador go={go} c={data.selc} trabajoId={data.trabajoId} cobrarTrabajo={cobrarTrabajo} />,
        trabajos: <MisTrabajos go={go} setData={setData} trabajos={trabajos} />,
      }[data.view] || null;
  }

  return (
    <div style={{ minHeight: "100%", display: "flex", flexDirection: "column" }}>
      <TopNav rol={rol} switchRol={switchRol} go={go} data={data} jobs={jobs} trabajos={trabajos} />
      <main style={{ flex: 1 }}>{body}</main>
      <Footer />
    </div>
  );
}

/* ---------------------------------------------------------------- NAV */
function TopNav({ rol, switchRol, go, data, jobs = [], trabajos = [] }) {
  const esCliente = rol === "cliente";
  const enCurso = jobs.filter((j) => j.estado === "en curso").length;
  const trabEnCurso = trabajos.filter((t) => t.estado === "en curso").length;
  const links = esCliente
    ? [["Inicio", "home"], ["Cómo funciona", "home"], ["Actividad", "actividad"]]
    : [["Changas", "changas"], ["Mis trabajos", "trabajos"]];
  return (
    <header
      style={{
        position: "sticky",
        top: 0,
        zIndex: 20,
        background: "rgba(255,255,255,0.86)",
        backdropFilter: "blur(10px)",
        borderBottom: "1px solid var(--line)",
      }}
    >
      <div
        style={{
          maxWidth: 1180,
          margin: "0 auto",
          padding: "0 24px",
          height: 64,
          display: "flex",
          alignItems: "center",
          gap: 24,
        }}
      >
        {/* logo */}
        <button
          onClick={() => go(rol === "cliente" ? "home" : "changas")}
          style={{ display: "flex", alignItems: "center", gap: 9, background: "none", border: "none", padding: 0 }}
        >
          <span
            style={{
              width: 30,
              height: 30,
              borderRadius: 9,
              background: "var(--green)",
              color: "#fff",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontFamily: "var(--font-display)",
              fontWeight: 700,
              fontSize: 18,
            }}
          >
            V
          </span>
          <span style={{ fontFamily: "var(--font-display)", fontWeight: 600, fontSize: 20 }}>Vecino</span>
        </button>

        {/* nav links */}
        <nav style={{ display: "flex", gap: 22, marginLeft: 8 }} className="nav-desktop">
          {links.map(([l, v], i) => (
            <button
              key={i}
              onClick={() => go(v)}
              className="navlink"
              style={{
                background: "none",
                border: "none",
                color: data?.view === v && v !== "home" ? "var(--green)" : "var(--muted)",
                fontSize: 14.5,
                fontWeight: 600,
                padding: "6px 0",
                display: "inline-flex",
                alignItems: "center",
                gap: 6,
              }}
            >
              {l}
              {((l === "Actividad" && enCurso > 0) || (l === "Mis trabajos" && trabEnCurso > 0)) && (
                <span
                  style={{
                    background: "var(--amber)",
                    color: "#fff",
                    fontSize: 11,
                    fontWeight: 700,
                    minWidth: 18,
                    height: 18,
                    borderRadius: 9,
                    display: "inline-flex",
                    alignItems: "center",
                    justifyContent: "center",
                    padding: "0 5px",
                  }}
                >
                  {l === "Actividad" ? enCurso : trabEnCurso}
                </span>
              )}
            </button>
          ))}
        </nav>

        <div style={{ flex: 1 }} />

        {/* ubicación */}
        <span
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: 5,
            color: "var(--muted)",
            fontSize: 13.5,
            fontWeight: 600,
          }}
          className="nav-desktop"
        >
          <Ico.pin /> Pocitos, MVD
        </span>

        {/* toggle rol */}
        <button
          onClick={() => switchRol(esCliente ? "prestador" : "cliente")}
          className="lift"
          style={{
            border: "1.5px solid var(--green)",
            background: "transparent",
            color: "var(--green)",
            borderRadius: 99,
            padding: "8px 15px",
            fontSize: 13.5,
            fontWeight: 700,
          }}
        >
          {esCliente ? "Soy prestador" : "Soy cliente"}
        </button>

        <span style={{ color: "var(--ink)" }}>
          <Ico.bell />
        </span>
        <PersonAvatar v={esCliente ? 0 : 2} size={36} />
      </div>
    </header>
  );
}

function Footer() {
  return (
    <footer style={{ borderTop: "1px solid var(--line)", background: "var(--card)" }}>
      <div
        style={{
          maxWidth: 1080,
          margin: "0 auto",
          padding: "22px 24px",
          display: "flex",
          justifyContent: "space-between",
          flexWrap: "wrap",
          gap: 12,
          color: "var(--muted)",
          fontSize: 13,
        }}
      >
        <span>
          <strong style={{ color: "var(--ink)" }}>Vecino</strong> · changas de confianza · Prototipo DPBT
        </span>
        <span>Verificación · Pago protegido · Precio claro</span>
      </div>
    </footer>
  );
}

/* ---------------------------------------------------------------- CARDS */
function PrestadorCard({ p, onClick }) {
  return (
    <div
      className="cardx"
      onClick={onClick}
      style={{
        background: "var(--card)",
        border: "1px solid var(--line)",
        borderRadius: 16,
        padding: 18,
        boxShadow: "var(--shadow)",
        cursor: "pointer",
        display: "flex",
        flexDirection: "column",
        gap: 13,
      }}
    >
      <div style={{ display: "flex", gap: 13, alignItems: "center" }}>
        <div style={{ position: "relative" }}>
          <PersonAvatar v={p.v} size={56} />
          {p.online && (
            <span
              style={{
                position: "absolute",
                right: 0,
                bottom: 0,
                width: 14,
                height: 14,
                borderRadius: "50%",
                background: "#2BB673",
                border: "2.5px solid var(--card)",
              }}
            />
          )}
        </div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
            <strong style={{ fontSize: 16 }}>{p.nombre}</strong>
            <Shield s={15} />
          </div>
          <div style={{ fontSize: 13, color: "var(--muted)" }}>{p.zona}</div>
        </div>
      </div>

      <div style={{ fontSize: 13.5, color: "var(--ink)" }}>{p.titulo}</div>

      <div style={{ display: "flex", alignItems: "center", gap: 12, fontSize: 13, color: "var(--muted)" }}>
        <span style={{ display: "inline-flex", alignItems: "center", gap: 4, color: "var(--ink)", fontWeight: 600 }}>
          <Star /> {p.rating} <span style={{ color: "var(--muted)", fontWeight: 400 }}>({p.resenas})</span>
        </span>
        <span style={{ display: "inline-flex", alignItems: "center", gap: 4 }}>
          <Ico.pin s={13} /> {p.distancia}
        </span>
        <span style={{ display: "inline-flex", alignItems: "center", gap: 4 }}>
          <Ico.clock s={13} /> {p.responde}
        </span>
      </div>

      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          borderTop: "1px solid var(--line)",
          paddingTop: 13,
        }}
      >
        <span style={{ fontWeight: 700, color: "var(--amber)", fontSize: 15 }}>{p.precio}</span>
        <span
          className="lift"
          style={{
            background: "var(--green)",
            color: "#fff",
            borderRadius: 10,
            padding: "8px 14px",
            fontSize: 13.5,
            fontWeight: 700,
          }}
        >
          Ver perfil
        </span>
      </div>
    </div>
  );
}

const GRID = { display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(290px, 1fr))", gap: 18 };

function SectionTitle({ children, hint }) {
  return (
    <div style={{ display: "flex", alignItems: "baseline", justifyContent: "space-between", margin: "0 0 16px" }}>
      <h2 style={{ fontFamily: "var(--font-display)", fontWeight: 600, fontSize: 24, margin: 0, letterSpacing: "-.01em" }}>
        {children}
      </h2>
      {hint && <span style={{ fontSize: 13.5, color: "var(--green)", fontWeight: 600 }}>{hint}</span>}
    </div>
  );
}

function BackLink({ back }) {
  return (
    <button
      onClick={back}
      className="navlink"
      style={{
        background: "none",
        border: "none",
        color: "var(--muted)",
        fontSize: 14,
        fontWeight: 600,
        display: "inline-flex",
        alignItems: "center",
        gap: 2,
        padding: 0,
        marginBottom: 18,
      }}
    >
      <Ico.chevL s={18} /> Volver
    </button>
  );
}

/* ---------------------------------------------------------------- HOME */
function Home({ go, setData }) {
  return (
    <>
      {/* HERO */}
      <section style={{ borderBottom: "1px solid var(--line)" }}>
        <div
          style={{
            maxWidth: 1080,
            margin: "0 auto",
            padding: "56px 24px 48px",
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
            gap: 40,
            alignItems: "center",
          }}
        >
          <div>
            <div
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: 6,
                background: "var(--green-soft)",
                color: "var(--green)",
                borderRadius: 99,
                padding: "6px 12px",
                fontSize: 13,
                fontWeight: 700,
                marginBottom: 18,
              }}
            >
              <Shield s={14} /> Gente verificada · Pago protegido
            </div>
            <h1
              style={{
                fontFamily: "var(--font-display)",
                fontWeight: 600,
                fontSize: 42,
                lineHeight: 1.08,
                letterSpacing: "-.02em",
                margin: "0 0 14px",
                textWrap: "balance",
              }}
            >
              Resolvé cualquier changa del hogar, con gente de confianza.
            </h1>
            <p style={{ fontSize: 16.5, color: "var(--muted)", margin: "0 0 26px", lineHeight: 1.5, maxWidth: 440 }}>
              Armar muebles, mudanzas, instalaciones y más. Elegís a alguien verificado, acordás el
              precio antes y pagás protegido.
            </p>

            {/* buscador */}
            <div
              style={{
                display: "flex",
                gap: 8,
                background: "var(--card)",
                border: "1px solid var(--line)",
                borderRadius: 14,
                padding: 8,
                boxShadow: "var(--shadow)",
                maxWidth: 520,
                flexWrap: "wrap",
              }}
            >
              <div style={{ flex: "1 1 180px", display: "flex", alignItems: "center", gap: 8, padding: "6px 10px" }}>
                <Ico.search />
                <span style={{ color: "var(--muted)", fontSize: 14.5 }}>¿Qué necesitás? Ej: armar un placar</span>
              </div>
              <button
                onClick={() => go("resultados")}
                className="lift"
                style={{
                  background: "var(--green)",
                  color: "#fff",
                  border: "none",
                  borderRadius: 10,
                  padding: "11px 22px",
                  fontSize: 14.5,
                  fontWeight: 700,
                }}
              >
                Buscar
              </button>
            </div>

            <div style={{ display: "flex", gap: 18, marginTop: 20, flexWrap: "wrap", color: "var(--muted)", fontSize: 13.5 }}>
              {["Verificados", "Precio acordado", "Pago en garantía"].map((t) => (
                <span key={t} style={{ display: "inline-flex", alignItems: "center", gap: 6 }}>
                  <Check /> {t}
                </span>
              ))}
            </div>
          </div>

          {/* preview card flotante */}
          <div style={{ display: "flex", justifyContent: "center" }}>
            <div style={{ position: "relative", width: "100%", maxWidth: 360 }}>
              <div style={{ transform: "rotate(-3deg)", opacity: 0.6, position: "absolute", inset: 0 }}>
                <PrestadorCard p={PRESTADORES[1]} onClick={() => {}} />
              </div>
              <div style={{ position: "relative" }}>
                <PrestadorCard
                  p={PRESTADORES[0]}
                  onClick={() => {
                    setData((d) => ({ ...d, sel: PRESTADORES[0] }));
                    go("perfilp");
                  }}
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CATEGORÍAS */}
      <div className="page">
        <SectionTitle>Categorías</SectionTitle>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(150px, 1fr))", gap: 14 }}>
          {CATEGORIAS.map((c) => {
            const I = Ico[c.ico];
            return (
              <button
                key={c.key}
                onClick={() => {
                  setData((d) => ({ ...d, tipo: c.key }));
                  go("resultados");
                }}
                className="cardx"
                style={{
                  background: "var(--card)",
                  border: "1px solid var(--line)",
                  borderRadius: 14,
                  padding: "20px 14px",
                  boxShadow: "var(--shadow)",
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  gap: 11,
                }}
              >
                <span
                  style={{
                    width: 48,
                    height: 48,
                    borderRadius: 13,
                    background: "var(--green-soft)",
                    color: "var(--green)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <I s={26} />
                </span>
                <span style={{ fontSize: 13.5, fontWeight: 600 }}>{c.label}</span>
              </button>
            );
          })}
        </div>

        {/* PRESTADORES */}
        <div style={{ height: 44 }} />
        <SectionTitle hint="Ver todos">Prestadores cerca tuyo</SectionTitle>
        <div style={GRID}>
          {PRESTADORES.map((p) => (
            <PrestadorCard
              key={p.id}
              p={p}
              onClick={() => {
                setData((d) => ({ ...d, sel: p }));
                go("perfilp");
              }}
            />
          ))}
        </div>

        {/* CÓMO FUNCIONA */}
        <div style={{ height: 44 }} />
        <SectionTitle>Cómo funciona</SectionTitle>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: 18 }}>
          {[
            ["1", "Contá qué necesitás", "Elegí la categoría y describí la changa. Te mostramos solo gente verificada cerca."],
            ["2", "Acordá precio y alcance", "Comparás reputación y precio, y dejás claro qué se hace antes de empezar."],
            ["3", "Pagá protegido", "Tu dinero queda retenido y se libera recién cuando confirmás que quedó bien."],
          ].map(([n, t, d]) => (
            <div key={n} style={{ background: "var(--card)", border: "1px solid var(--line)", borderRadius: 14, padding: 20, boxShadow: "var(--shadow)" }}>
              <div
                style={{
                  width: 34,
                  height: 34,
                  borderRadius: 10,
                  background: "var(--ink)",
                  color: "#fff",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontWeight: 700,
                  marginBottom: 12,
                }}
              >
                {n}
              </div>
              <div style={{ fontWeight: 700, fontSize: 15.5, marginBottom: 5 }}>{t}</div>
              <div style={{ fontSize: 13.5, color: "var(--muted)", lineHeight: 1.5 }}>{d}</div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}

/* ---------------------------------------------------------------- RESULTADOS */
function Resultados({ go, setData }) {
  return (
    <div className="page">
      <SectionTitle hint={PRESTADORES.length + " disponibles"}>Prestadores para tu changa</SectionTitle>
      <div style={{ display: "flex", gap: 10, flexWrap: "wrap", marginBottom: 22 }}>
        {["Más cerca", "Mejor puntuados", "Verificados", "Responde rápido"].map((f, i) => (
          <span
            key={f}
            style={{
              border: "1px solid " + (i === 0 ? "var(--green)" : "var(--line)"),
              background: i === 0 ? "var(--green-soft)" : "var(--card)",
              color: i === 0 ? "var(--green)" : "var(--ink)",
              borderRadius: 99,
              padding: "7px 14px",
              fontSize: 13,
              fontWeight: 600,
            }}
          >
            {f}
          </span>
        ))}
      </div>
      <div style={GRID}>
        {PRESTADORES.map((p) => (
          <PrestadorCard
            key={p.id}
            p={p}
            onClick={() => {
              setData((d) => ({ ...d, sel: p }));
              go("perfilp");
            }}
          />
        ))}
      </div>
    </div>
  );
}

/* ---------------------------------------------------------------- PERFIL PRESTADOR */
function PerfilPrestador({ go, p, back }) {
  return (
    <div className="page">
      <BackLink back={back} />
      <div style={{ display: "grid", gridTemplateColumns: "minmax(0,1fr) 340px", gap: 28, alignItems: "start" }} className="split">
        {/* izquierda */}
        <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
          <div style={{ display: "flex", gap: 18, alignItems: "center" }}>
            <PersonAvatar v={p.v} size={78} ring />
            <div>
              <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <h1 style={{ fontFamily: "var(--font-display)", fontWeight: 600, fontSize: 30, margin: 0 }}>{p.nombre}</h1>
                <Shield s={22} />
              </div>
              <div style={{ color: "var(--muted)", fontSize: 14.5, marginTop: 2 }}>
                {p.titulo} · {p.zona}
              </div>
            </div>
          </div>

          <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
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

          <Card pad={20}>
            <strong style={{ fontSize: 15 }}>Qué incluye este servicio</strong>
            <div style={{ display: "flex", flexDirection: "column", gap: 10, marginTop: 12 }}>
              {p.incluye.map((i) => (
                <div key={i} style={{ display: "flex", gap: 9, fontSize: 14 }}>
                  <Check />
                  <span>{i}</span>
                </div>
              ))}
            </div>
          </Card>

          <Card pad={20}>
            <strong style={{ fontSize: 15 }}>Reseñas recientes</strong>
            <div style={{ marginTop: 14, display: "flex", flexDirection: "column", gap: 16 }}>
              {[
                ["Ana", "hace 3 días", "Puntual y prolijo, dejó todo armado y limpio. Lo vuelvo a llamar.", 1],
                ["Flor", "hace 1 semana", "Re recomendable, trajo todas las herramientas y re buena onda.", 2],
              ].map(([n, f, txt, v]) => (
                <div key={n} style={{ display: "flex", gap: 12 }}>
                  <PersonAvatar v={v} size={40} />
                  <div>
                    <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                      <strong style={{ fontSize: 14 }}>{n}</strong>
                      <span style={{ display: "inline-flex", gap: 1 }}>
                        {[0, 1, 2, 3, 4].map((i) => (
                          <Star key={i} />
                        ))}
                      </span>
                      <span style={{ fontSize: 12.5, color: "var(--muted)" }}>{f}</span>
                    </div>
                    <div style={{ fontSize: 13.5, color: "var(--ink)", marginTop: 3, lineHeight: 1.5 }}>{txt}</div>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </div>

        {/* derecha: tarjeta de contratación (sticky) */}
        <div style={{ position: "sticky", top: 84 }}>
          <Card pad={20}>
            <div style={{ fontSize: 13.5, color: "var(--muted)" }}>Desde</div>
            <div style={{ fontFamily: "var(--font-display)", fontWeight: 600, fontSize: 30, color: "var(--amber)", margin: "2px 0 14px" }}>
              {p.precio}
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 10, fontSize: 13.5, color: "var(--ink)", marginBottom: 16 }}>
              <span style={{ display: "inline-flex", alignItems: "center", gap: 7 }}>
                <Ico.clock s={15} /> Responde en {p.responde}
              </span>
              <span style={{ display: "inline-flex", alignItems: "center", gap: 7 }}>
                <Ico.pin s={15} /> A {p.distancia} de tu dirección
              </span>
              <span style={{ display: "inline-flex", alignItems: "center", gap: 7, color: "var(--green)", fontWeight: 600 }}>
                <Shield s={15} /> Pago protegido por Vecino
              </span>
            </div>
            <Btn onClick={() => go("checkout")}>Acordar y contratar</Btn>
          </Card>
        </div>
      </div>
    </div>
  );
}

/* ---------------------------------------------------------------- CHECKOUT */
function Checkout({ go, p, back, addJob }) {
  return (
    <div className="page" style={{ maxWidth: 680 }}>
      <BackLink back={back} />
      <h1 style={{ fontFamily: "var(--font-display)", fontWeight: 600, fontSize: 28, margin: "0 0 6px" }}>
        Confirmar changa con {p?.nombre || "el prestador"}
      </h1>
      <p style={{ color: "var(--muted)", margin: "0 0 24px", fontSize: 15 }}>
        Revisá qué se hace y cuánto. El pago queda en garantía hasta que confirmes.
      </p>

      <Card pad={20}>
        <strong style={{ fontSize: 15 }}>La changa</strong>
        <div style={{ display: "flex", flexDirection: "column", gap: 10, marginTop: 12 }}>
          {[
            "Armar un placar de 3 puertas (ya comprado, en caja)",
            "Pocitos · hoy a partir de las 16:00",
            "Incluye herramientas y retirar el embalaje",
          ].map((t) => (
            <div key={t} style={{ display: "flex", gap: 9, fontSize: 14 }}>
              <Check />
              <span>{t}</span>
            </div>
          ))}
        </div>
      </Card>

      <div style={{ height: 16 }} />
      <Card pad={20}>
        <div style={{ display: "flex", gap: 12, alignItems: "flex-start", marginBottom: 16 }}>
          <Shield s={26} c="var(--amber)" />
          <div style={{ fontSize: 14, lineHeight: 1.5 }}>
            <strong>Pago protegido.</strong> Pagás ahora pero el dinero queda retenido por Vecino y se
            libera recién cuando confirmás que el trabajo quedó bien.
          </div>
        </div>
        <div style={{ display: "flex", justifyContent: "space-between", fontSize: 14, marginBottom: 8 }}>
          <span>Trabajo</span>
          <span>$ 1.400</span>
        </div>
        <div style={{ display: "flex", justifyContent: "space-between", fontSize: 14, color: "var(--muted)", marginBottom: 8 }}>
          <span>Comisión Vecino</span>
          <span>$ 140</span>
        </div>
        <div
          style={{
            borderTop: "1px solid var(--line)",
            paddingTop: 10,
            display: "flex",
            justifyContent: "space-between",
            fontWeight: 700,
            fontSize: 16,
          }}
        >
          <span>Total retenido</span>
          <span style={{ color: "var(--amber)" }}>$ 1.540</span>
        </div>
      </Card>

      <div style={{ height: 20 }} />
      <Btn
        variant="amber"
        onClick={() => {
          const jobId = addJob ? addJob(p) : undefined;
          go("seguimiento", { jobId });
        }}
        sub="El dinero no se libera hasta tu confirmación"
      >
        Pagar $ 1.540 · queda en garantía
      </Btn>
    </div>
  );
}

/* ---------------------------------------------------------------- SEGUIMIENTO */
function Seguimiento({ go, p, jobId, completeJob }) {
  const [done, setDone] = useState(false);
  const nombre = (p?.nombre || "Mariana").split(" ")[0];
  const marcarTerminado = () => {
    if (jobId && completeJob) completeJob(jobId);
    setDone(true);
  };
  const pasos = [
    { t: "Pago retenido", d: "$ 1.540 en garantía", ok: true },
    { t: `${nombre} confirmó`, d: "Llega hoy 16:00", ok: true },
    { t: "Trabajo en curso", d: "Armando el placar", ok: true },
    { t: "Confirmás y se libera el pago", d: done ? `¡Listo! Pago liberado a ${nombre}` : "Pendiente de tu OK", ok: done },
  ];
  return (
    <div className="page" style={{ maxWidth: 920 }}>
      <h1 style={{ fontFamily: "var(--font-display)", fontWeight: 600, fontSize: 28, margin: "0 0 20px" }}>Changa en marcha</h1>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: 22, alignItems: "start" }}>
        {/* timeline */}
        <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>
          <Card pad={20}>
            {pasos.map((s, i) => (
              <div key={i} style={{ display: "flex", gap: 13, paddingBottom: i < 3 ? 16 : 0 }}>
                <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
                  <div
                    style={{
                      width: 20,
                      height: 20,
                      borderRadius: "50%",
                      background: s.ok ? "var(--green)" : "var(--line)",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    {s.ok && (
                      <svg width="12" height="12" viewBox="0 0 24 24">
                        <path d="M6 12.5l3.5 3.5 8-9" stroke="#fff" strokeWidth="3" fill="none" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                    )}
                  </div>
                  {i < 3 && <div style={{ width: 2, flex: 1, background: s.ok ? "var(--green)" : "var(--line)", minHeight: 26 }} />}
                </div>
                <div style={{ marginTop: -1 }}>
                  <div style={{ fontWeight: 600, fontSize: 15 }}>{s.t}</div>
                  <div style={{ fontSize: 13, color: "var(--muted)" }}>{s.d}</div>
                </div>
              </div>
            ))}
          </Card>
          {!done ? (
            <Btn variant="amber" onClick={marcarTerminado}>
              Confirmar trabajo terminado → liberar pago
            </Btn>
          ) : (
            <>
              <Card pad={18}>
                <div style={{ textAlign: "center", fontSize: 14.5 }}>
                  Se liberaron <strong>$ 1.400</strong> a {nombre}. ¡Dejale una reseña!
                </div>
              </Card>
              <Btn variant="ghost" onClick={() => go("actividad")}>
                Ver mi actividad
              </Btn>
            </>
          )}
        </div>

        {/* mapa */}
        <div style={{ borderRadius: 16, overflow: "hidden", border: "1px solid var(--line)", position: "relative", minHeight: 320 }}>
          <svg width="100%" height="100%" viewBox="0 0 460 340" preserveAspectRatio="xMidYMid slice" style={{ display: "block" }}>
            <rect width="460" height="340" fill="#EAF0ED" />
            <g stroke="#D4DED8" strokeWidth="2.5">
              <path d="M-10 70H470M-10 150H470M-10 230H470M-10 300H470" />
              <path d="M70 -10V350M180 -10V350M300 -10V350M400 -10V350" />
            </g>
            <rect x="92" y="92" width="70" height="46" fill="#DCE6E0" />
            <rect x="320" y="168" width="60" height="54" fill="#DCE6E0" />
            <path d="M60 280 Q160 240 220 190 T380 90" stroke="var(--green)" strokeWidth="4" fill="none" strokeDasharray="2 10" strokeLinecap="round" />
            <circle cx="60" cy="280" r="8" fill="var(--amber)" stroke="#fff" strokeWidth="3" />
            <circle cx="380" cy="90" r="9" fill="var(--green)" stroke="#fff" strokeWidth="3" />
          </svg>
          <div
            style={{
              position: "absolute",
              left: 14,
              bottom: 14,
              background: "var(--card)",
              borderRadius: 11,
              padding: "9px 13px",
              fontSize: 13,
              fontWeight: 600,
              boxShadow: "var(--shadow)",
              display: "flex",
              alignItems: "center",
              gap: 8,
            }}
          >
            <PersonAvatar v={p?.v ?? 0} size={28} /> {nombre} está en camino · 8 min
          </div>
        </div>
      </div>
    </div>
  );
}

/* ---------------------------------------------------------------- ACTIVIDAD (cliente) */
function Actividad({ go, setData, jobs }) {
  const enCurso = jobs.filter((j) => j.estado === "en curso");
  const hechas = jobs.filter((j) => j.estado === "completada");

  const abrirSeguimiento = (j) => {
    setData((d) => ({ ...d, sel: { nombre: j.nombre, v: j.v }, jobId: j.id }));
    go("seguimiento", { sel: { nombre: j.nombre, v: j.v }, jobId: j.id });
  };

  const JobCard = ({ j, activo }) => (
    <Card pad={16}>
      <div style={{ display: "flex", gap: 13, alignItems: "center" }}>
        <PersonAvatar v={j.v} size={46} />
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ fontWeight: 600, fontSize: 15 }}>{j.titulo}</div>
          <div style={{ fontSize: 13, color: "var(--muted)" }}>
            {j.nombre} · {j.fecha}
          </div>
        </div>
        <div style={{ textAlign: "right", display: "flex", flexDirection: "column", alignItems: "flex-end", gap: 6 }}>
          <span style={{ fontWeight: 700, color: "var(--amber)", fontSize: 15 }}>{j.monto}</span>
          {activo ? (
            <Badge tone="amber">
              <span
                style={{
                  width: 7,
                  height: 7,
                  borderRadius: "50%",
                  background: "var(--amber)",
                  display: "inline-block",
                }}
              />
              En curso
            </Badge>
          ) : (
            <Badge tone="green">
              <Check /> Completada
            </Badge>
          )}
        </div>
      </div>
      {activo && (
        <div style={{ marginTop: 14 }}>
          <Btn onClick={() => abrirSeguimiento(j)}>Ver seguimiento</Btn>
        </div>
      )}
    </Card>
  );

  return (
    <div className="page" style={{ maxWidth: 760 }}>
      <h1 style={{ fontFamily: "var(--font-display)", fontWeight: 600, fontSize: 28, margin: "0 0 6px" }}>Mi actividad</h1>
      <p style={{ color: "var(--muted)", margin: "0 0 24px", fontSize: 15 }}>
        Tus changas contratadas. Quedan <strong>en curso</strong> hasta que confirmás que el trabajo
        está hecho.
      </p>

      {jobs.length === 0 ? (
        <Card pad={28}>
          <div style={{ textAlign: "center", color: "var(--muted)" }}>
            <div style={{ fontSize: 15, fontWeight: 600, color: "var(--ink)", marginBottom: 4 }}>
              Todavía no contrataste ninguna changa
            </div>
            <div style={{ fontSize: 14, marginBottom: 16 }}>Cuando contratés a alguien, la vas a ver acá.</div>
            <Btn onClick={() => go("home")}>Buscar una changa</Btn>
          </div>
        </Card>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
          {enCurso.length > 0 && (
            <div>
              <div style={{ fontWeight: 700, fontSize: 15, margin: "0 0 12px", display: "flex", alignItems: "center", gap: 8 }}>
                En curso
                <span
                  style={{
                    background: "var(--amber)",
                    color: "#fff",
                    fontSize: 12,
                    fontWeight: 700,
                    minWidth: 20,
                    height: 20,
                    borderRadius: 10,
                    display: "inline-flex",
                    alignItems: "center",
                    justifyContent: "center",
                    padding: "0 6px",
                  }}
                >
                  {enCurso.length}
                </span>
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                {enCurso.map((j) => (
                  <JobCard key={j.id} j={j} activo />
                ))}
              </div>
            </div>
          )}
          {hechas.length > 0 && (
            <div>
              <div style={{ fontWeight: 700, fontSize: 15, margin: "0 0 12px" }}>Historial</div>
              <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                {hechas.map((j) => (
                  <JobCard key={j.id} j={j} activo={false} />
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

/* ---------------------------------------------------------------- PRESTADOR: CHANGAS */
function Changas({ go, setData }) {
  return (
    <div className="page">
      {/* resumen */}
      <div
        style={{
          background: "var(--ink)",
          color: "#fff",
          borderRadius: 18,
          padding: "22px 26px",
          display: "flex",
          justifyContent: "space-between",
          flexWrap: "wrap",
          gap: 16,
          marginBottom: 30,
        }}
      >
        <div>
          <div style={{ fontSize: 13, opacity: 0.75 }}>Ganado esta semana</div>
          <div style={{ fontFamily: "var(--font-display)", fontWeight: 600, fontSize: 32 }}>$ 4.700</div>
        </div>
        <div style={{ display: "flex", gap: 34, alignItems: "center" }}>
          <div>
            <div style={{ fontSize: 13, opacity: 0.75 }}>Changas</div>
            <div style={{ fontWeight: 700, fontSize: 20 }}>3</div>
          </div>
          <div>
            <div style={{ fontSize: 13, opacity: 0.75 }}>Puntaje</div>
            <div style={{ fontWeight: 700, fontSize: 20, color: "#8FD9C4" }}>★ 4.9</div>
          </div>
        </div>
      </div>

      <SectionTitle hint={CHANGAS_PRESTADOR.length + " cerca tuyo"}>Changas disponibles</SectionTitle>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))", gap: 18 }}>
        {CHANGAS_PRESTADOR.map((c) => (
          <div
            key={c.id}
            className="cardx"
            onClick={() => {
              setData((d) => ({ ...d, selc: c }));
              go("detalle");
            }}
            style={{
              background: "var(--card)",
              border: "1px solid var(--line)",
              borderRadius: 16,
              padding: 20,
              boxShadow: "var(--shadow)",
              cursor: "pointer",
            }}
          >
            <div style={{ display: "flex", justifyContent: "space-between", gap: 10, marginBottom: 6 }}>
              <strong style={{ fontSize: 16.5 }}>{c.titulo}</strong>
              <span style={{ fontWeight: 700, color: "var(--amber)", fontSize: 16, whiteSpace: "nowrap" }}>{c.monto}</span>
            </div>
            <div style={{ fontSize: 13.5, color: "var(--muted)", display: "flex", alignItems: "center", gap: 6, marginBottom: 14 }}>
              <Ico.pin s={14} /> {c.zona} · {c.cuando}
            </div>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <Badge tone="amber">
                <Shield c="var(--amber)" /> Pago asegurado
              </Badge>
              <span className="lift" style={{ background: "var(--green)", color: "#fff", borderRadius: 10, padding: "8px 16px", fontSize: 13.5, fontWeight: 700 }}>
                Ver detalle
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ---------------------------------------------------------------- PRESTADOR: DETALLE */
function DetalleChanga({ go, c, back, aceptarTrabajo }) {
  const aceptar = () => {
    const trabajoId = aceptarTrabajo ? aceptarTrabajo(c) : undefined;
    go("trabajoseg", { trabajoId });
  };
  return (
    <div className="page" style={{ maxWidth: 820 }}>
      <BackLink back={back} />
      <div style={{ display: "grid", gridTemplateColumns: "minmax(0,1fr) 300px", gap: 26, alignItems: "start" }} className="split">
        <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>
          <div>
            <h1 style={{ fontFamily: "var(--font-display)", fontWeight: 600, fontSize: 28, margin: "0 0 4px" }}>{c.titulo}</h1>
            <div style={{ color: "var(--muted)", fontSize: 14.5, display: "flex", alignItems: "center", gap: 6 }}>
              <Ico.pin s={15} /> {c.zona} · {c.cuando}
            </div>
          </div>
          <Card pad={20}>
            <strong style={{ fontSize: 15 }}>Pedido por {c.cliente}</strong>
            <div style={{ fontSize: 13, color: "var(--muted)", marginTop: 2 }}>Alcance definido</div>
            <div style={{ display: "flex", flexDirection: "column", gap: 10, marginTop: 12 }}>
              {c.alcance.map((a) => (
                <div key={a} style={{ display: "flex", gap: 9, fontSize: 14 }}>
                  <Check />
                  <span>{a}</span>
                </div>
              ))}
            </div>
          </Card>
        </div>

        <div style={{ position: "sticky", top: 84 }}>
          <Card pad={20}>
            <div style={{ fontSize: 13.5, color: "var(--muted)" }}>Vas a cobrar</div>
            <div style={{ fontFamily: "var(--font-display)", fontWeight: 600, fontSize: 30, color: "var(--amber)", margin: "2px 0 12px" }}>
              {c.monto}
            </div>
            <div style={{ display: "flex", gap: 8, alignItems: "flex-start", fontSize: 12.8, color: "var(--ink)", marginBottom: 16, lineHeight: 1.45 }}>
              <Shield s={18} c="var(--amber)" />
              <span>El cliente ya pagó. El dinero está retenido y es tuyo al terminar.</span>
            </div>
            <Btn onClick={aceptar}>Aceptar changa</Btn>
          </Card>
        </div>
      </div>
    </div>
  );
}

/* ---------------------------------------------------------------- PRESTADOR: SEGUIMIENTO */
function SeguimientoPrestador({ go, c, trabajoId, cobrarTrabajo }) {
  const [done, setDone] = useState(false);
  const marcar = () => {
    if (trabajoId && cobrarTrabajo) cobrarTrabajo(trabajoId);
    setDone(true);
  };
  if (!c) {
    return (
      <div className="page" style={{ maxWidth: 760 }}>
        <Card pad={24}>
          <div style={{ textAlign: "center" }}>
            <div style={{ fontWeight: 600, marginBottom: 12 }}>Abrí el trabajo desde tu lista.</div>
            <Btn onClick={() => go("trabajos")}>Ir a Mis trabajos</Btn>
          </div>
        </Card>
      </div>
    );
  }
  const pasos = [
    { t: "Changa aceptada", d: "El cliente ya pagó (en garantía)", ok: true },
    { t: "Vas en camino", d: `A lo de ${c.cliente} · ${c.zona}`, ok: true },
    { t: "Trabajo en curso", d: "Manos a la obra", ok: true },
    { t: "Marcás terminado y cobrás", d: done ? `¡Cobraste ${c.monto}!` : "Pendiente de tu confirmación", ok: done },
  ];
  return (
    <div className="page" style={{ maxWidth: 920 }}>
      <h1 style={{ fontFamily: "var(--font-display)", fontWeight: 600, fontSize: 28, margin: "0 0 4px" }}>{c.titulo}</h1>
      <p style={{ color: "var(--muted)", margin: "0 0 20px", fontSize: 15 }}>
        Pedido por {c.cliente} · {c.cuando}
      </p>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: 22, alignItems: "start" }}>
        <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>
          <Card pad={20}>
            {pasos.map((s, i) => (
              <div key={i} style={{ display: "flex", gap: 13, paddingBottom: i < 3 ? 16 : 0 }}>
                <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
                  <div
                    style={{
                      width: 20,
                      height: 20,
                      borderRadius: "50%",
                      background: s.ok ? "var(--green)" : "var(--line)",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    {s.ok && (
                      <svg width="12" height="12" viewBox="0 0 24 24">
                        <path d="M6 12.5l3.5 3.5 8-9" stroke="#fff" strokeWidth="3" fill="none" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                    )}
                  </div>
                  {i < 3 && <div style={{ width: 2, flex: 1, background: s.ok ? "var(--green)" : "var(--line)", minHeight: 26 }} />}
                </div>
                <div style={{ marginTop: -1 }}>
                  <div style={{ fontWeight: 600, fontSize: 15 }}>{s.t}</div>
                  <div style={{ fontSize: 13, color: "var(--muted)" }}>{s.d}</div>
                </div>
              </div>
            ))}
          </Card>
          {!done ? (
            <Btn variant="amber" onClick={marcar}>
              Marcar trabajo terminado → cobrar {c.monto}
            </Btn>
          ) : (
            <>
              <Card pad={18}>
                <div style={{ textAlign: "center", fontSize: 14.5 }}>
                  Se acreditó <strong>{c.monto}</strong> a tu cuenta. ¡Buen trabajo!
                </div>
              </Card>
              <Btn variant="ghost" onClick={() => go("trabajos")}>
                Ver mis trabajos
              </Btn>
            </>
          )}
        </div>

        {/* mapa: vas a lo del cliente */}
        <div style={{ borderRadius: 16, overflow: "hidden", border: "1px solid var(--line)", position: "relative", minHeight: 320 }}>
          <svg width="100%" height="100%" viewBox="0 0 460 340" preserveAspectRatio="xMidYMid slice" style={{ display: "block" }}>
            <rect width="460" height="340" fill="#EAF0ED" />
            <g stroke="#D4DED8" strokeWidth="2.5">
              <path d="M-10 70H470M-10 150H470M-10 230H470M-10 300H470" />
              <path d="M70 -10V350M180 -10V350M300 -10V350M400 -10V350" />
            </g>
            <rect x="96" y="96" width="70" height="46" fill="#DCE6E0" />
            <rect x="320" y="170" width="60" height="54" fill="#DCE6E0" />
            <path d="M70 270 Q170 230 230 180 T380 92" stroke="var(--green)" strokeWidth="4" fill="none" strokeDasharray="2 10" strokeLinecap="round" />
            <circle cx="70" cy="270" r="8" fill="var(--green)" stroke="#fff" strokeWidth="3" />
            <circle cx="380" cy="92" r="9" fill="var(--amber)" stroke="#fff" strokeWidth="3" />
          </svg>
          <div
            style={{
              position: "absolute",
              left: 14,
              bottom: 14,
              background: "var(--card)",
              borderRadius: 11,
              padding: "9px 13px",
              fontSize: 13,
              fontWeight: 600,
              boxShadow: "var(--shadow)",
              display: "flex",
              alignItems: "center",
              gap: 8,
            }}
          >
            <Ico.pin s={16} /> Vas a lo de {c.cliente} · 8 min
          </div>
        </div>
      </div>
    </div>
  );
}

/* ---------------------------------------------------------------- PRESTADOR: MIS TRABAJOS */
function MisTrabajos({ go, setData, trabajos }) {
  const enCurso = trabajos.filter((t) => t.estado === "en curso");
  const hechas = trabajos.filter((t) => t.estado === "cobrada");

  const abrir = (t) => {
    const selc = {
      id: t.changaId,
      titulo: t.titulo,
      zona: t.zona,
      cuando: t.cuando,
      monto: t.monto,
      cliente: t.cliente,
    };
    setData((d) => ({ ...d, selc, trabajoId: t.id }));
    go("trabajoseg", { selc, trabajoId: t.id });
  };

  const TrabCard = ({ t, activo }) => (
    <Card pad={16}>
      <div style={{ display: "flex", gap: 13, alignItems: "center" }}>
        <span
          style={{
            width: 44,
            height: 44,
            borderRadius: 12,
            background: "var(--green-soft)",
            color: "var(--green)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            flex: "0 0 auto",
          }}
        >
          <Ico.armar s={22} />
        </span>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ fontWeight: 600, fontSize: 15 }}>{t.titulo}</div>
          <div style={{ fontSize: 13, color: "var(--muted)" }}>
            {t.cliente} · {t.cuando}
          </div>
        </div>
        <div style={{ textAlign: "right", display: "flex", flexDirection: "column", alignItems: "flex-end", gap: 6 }}>
          <span style={{ fontWeight: 700, color: "var(--amber)", fontSize: 15 }}>{t.monto}</span>
          {activo ? (
            <Badge tone="amber">
              <span style={{ width: 7, height: 7, borderRadius: "50%", background: "var(--amber)", display: "inline-block" }} />
              En curso
            </Badge>
          ) : (
            <Badge tone="green">
              <Check /> Cobrada
            </Badge>
          )}
        </div>
      </div>
      {activo && (
        <div style={{ marginTop: 14 }}>
          <Btn onClick={() => abrir(t)}>Ver seguimiento</Btn>
        </div>
      )}
    </Card>
  );

  return (
    <div className="page" style={{ maxWidth: 760 }}>
      <h1 style={{ fontFamily: "var(--font-display)", fontWeight: 600, fontSize: 28, margin: "0 0 6px" }}>Mis trabajos</h1>
      <p style={{ color: "var(--muted)", margin: "0 0 24px", fontSize: 15 }}>
        Changas que aceptaste. Quedan <strong>en curso</strong> hasta que las marcás terminadas y cobrás.
      </p>

      {trabajos.length === 0 ? (
        <Card pad={28}>
          <div style={{ textAlign: "center", color: "var(--muted)" }}>
            <div style={{ fontSize: 15, fontWeight: 600, color: "var(--ink)", marginBottom: 4 }}>
              Todavía no aceptaste ninguna changa
            </div>
            <div style={{ fontSize: 14, marginBottom: 16 }}>Aceptá una de las disponibles y la vas a ver acá.</div>
            <Btn onClick={() => go("changas")}>Ver changas disponibles</Btn>
          </div>
        </Card>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
          {enCurso.length > 0 && (
            <div>
              <div style={{ fontWeight: 700, fontSize: 15, margin: "0 0 12px" }}>En curso</div>
              <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                {enCurso.map((t) => (
                  <TrabCard key={t.id} t={t} activo />
                ))}
              </div>
            </div>
          )}
          {hechas.length > 0 && (
            <div>
              <div style={{ fontWeight: 700, fontSize: 15, margin: "0 0 12px" }}>Cobradas</div>
              <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                {hechas.map((t) => (
                  <TrabCard key={t.id} t={t} activo={false} />
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
