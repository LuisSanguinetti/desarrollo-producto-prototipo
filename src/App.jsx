import { useRef, useState } from "react";
import Cliente from "./screens/Cliente.jsx";
import Prestador from "./screens/Prestador.jsx";
import { Actividad, Perfil } from "./screens/Extras.jsx";
import { StatusBar, Ico } from "./components/icons.jsx";

const INICIAL = { cliente: "home", prestador: "disponibles" };

const TITULOS = {
  describir: "Nueva changa",
  candidatos: "Prestadores",
  perfil: "Perfil",
  acordar: "Acordar",
  pago: "Pago protegido",
  seguimiento: "Seguimiento",
  detalle: "Detalle de la changa",
};

const NAV = {
  cliente: [
    ["inicio", "Inicio", "home"],
    ["actividad", "Actividad", "activity"],
    ["perfil", "Perfil", "user"],
  ],
  prestador: [
    ["inicio", "Changas", "home"],
    ["actividad", "Trabajos", "activity"],
    ["perfil", "Perfil", "user"],
  ],
};

export default function App() {
  const [rol, setRol] = useState("cliente");
  const [tab, setTab] = useState("inicio");
  const [data, setData] = useState({ screen: INICIAL.cliente });
  const histRef = useRef({ cliente: ["home"], prestador: ["disponibles"] });

  const go = (screen) => {
    histRef.current[rol].push(screen);
    setData((d) => ({ ...d, screen }));
  };
  const back = () => {
    const h = histRef.current[rol];
    if (h.length > 1) {
      h.pop();
      setData((d) => ({ ...d, screen: h[h.length - 1] }));
    }
  };
  const switchRol = (r) => {
    setRol(r);
    setTab("inicio");
    setData({ screen: INICIAL[r] });
    histRef.current = { cliente: ["home"], prestador: ["disponibles"] };
  };

  const canBack = tab === "inicio" && histRef.current[rol].length > 1;

  let body;
  if (tab === "actividad") body = <Actividad rol={rol} />;
  else if (tab === "perfil") body = <Perfil rol={rol} switchRol={switchRol} />;
  else
    body =
      rol === "cliente" ? (
        <Cliente go={go} data={data} setData={setData} />
      ) : (
        <Prestador go={go} data={data} setData={setData} />
      );

  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 14 }}>
      {/* frame del teléfono */}
      <div
        style={{
          width: 400,
          maxWidth: "94vw",
          height: 820,
          maxHeight: "86vh",
          background: "var(--paper)",
          borderRadius: 46,
          border: "11px solid #12100E",
          boxShadow: "0 30px 70px rgba(22,32,28,.32)",
          overflow: "hidden",
          position: "relative",
          display: "flex",
          flexDirection: "column",
        }}
      >
        {/* dynamic island */}
        <div
          style={{
            position: "absolute",
            top: 9,
            left: "50%",
            transform: "translateX(-50%)",
            width: 108,
            height: 30,
            background: "#12100E",
            borderRadius: 18,
            zIndex: 5,
          }}
        />
        <StatusBar />

        {/* app bar: back + título, o nada en el landing */}
        {canBack && (
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 6,
              padding: "4px 14px 8px",
            }}
          >
            <button
              onClick={back}
              style={{
                border: "none",
                background: "none",
                color: "var(--ink)",
                display: "flex",
                alignItems: "center",
                padding: 0,
              }}
            >
              <Ico.chevL />
            </button>
            <span style={{ fontWeight: 700, fontSize: 15 }}>{TITULOS[data.screen] || "Vecino"}</span>
          </div>
        )}

        {/* cuerpo scrolleable */}
        <div style={{ flex: 1, overflowY: "auto", padding: canBack ? "4px 16px 20px" : "8px 16px 20px" }}>
          {body}
        </div>

        {/* bottom nav */}
        <div
          style={{
            display: "flex",
            borderTop: "1px solid var(--line)",
            background: "var(--card)",
            paddingBottom: 10,
          }}
        >
          {NAV[rol].map(([key, label, ico]) => {
            const I = Ico[ico];
            const on = tab === key;
            return (
              <button
                key={key}
                onClick={() => setTab(key)}
                style={{
                  flex: 1,
                  border: "none",
                  background: "none",
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  gap: 3,
                  padding: "9px 0 4px",
                  color: on ? "var(--green)" : "var(--muted)",
                  fontSize: 10.5,
                  fontWeight: 600,
                }}
              >
                <I s={23} />
                {label}
              </button>
            );
          })}
        </div>
        {/* home indicator */}
        <div
          style={{
            position: "absolute",
            bottom: 7,
            left: "50%",
            transform: "translateX(-50%)",
            width: 128,
            height: 5,
            borderRadius: 3,
            background: "var(--ink)",
            opacity: 0.28,
          }}
        />
      </div>

      <p style={{ fontSize: 12, color: "var(--muted)", maxWidth: 400, textAlign: "center", margin: 0, lineHeight: 1.5 }}>
        Prototipo navegable · Vecino — changas de confianza. Recorré el flujo tocando los botones.
        Para ver el lado del prestador: pestaña <strong>Perfil</strong> → “Cambiar a modo prestador”.
      </p>
    </div>
  );
}
