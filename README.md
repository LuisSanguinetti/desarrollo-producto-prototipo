# Vecino · Prototipo

Prototipo navegable de **Vecino**, un marketplace de changas de confianza para Uruguay
(estilo TaskRabbit). Hecho para la 2ª entrega del obligatorio de DPBT.

Muestra dos flujos y los elementos de confianza que son el diferencial del producto:
identidad **verificada**, **reputación**, **precio y alcance acordados antes**, y **pago protegido**
(retenido hasta que el cliente confirma).

## Qué incluye

- **Flujo cliente:** describir changa → candidatos verificados → perfil → acordar precio/alcance → pago protegido → seguimiento y liberación del pago.
- **Flujo prestador:** changas disponibles con pago asegurado → detalle con alcance → aceptar.

Datos de ejemplo, sin backend: todo corre en el navegador para recorrer el flujo.

## Cómo correrlo

Necesitás [Node.js](https://nodejs.org) 18 o superior.

```bash
cd prototipo-vecino
npm install
npm run dev
```

Abrí la URL que imprime la consola (normalmente http://localhost:5173).

Para una build estática:

```bash
npm run build
npm run preview
```

## Estructura

```
prototipo-vecino/
├─ index.html              # punto de entrada
├─ package.json            # dependencias y scripts (React 18 + Vite)
├─ vite.config.js
└─ src/
   ├─ main.jsx             # monta React
   ├─ App.jsx              # shell: switch de rol, frame de teléfono, navegación
   ├─ index.css            # paleta (:root) y estilos base
   ├─ data.js              # datos de ejemplo (prestadores, changas)
   ├─ components/
   │  └─ ui.jsx            # primitivas: Badge, Btn, Card, iconos, Avatar…
   └─ screens/
      ├─ Cliente.jsx       # las 6 pantallas del cliente
      └─ Prestador.jsx     # las pantallas del prestador
```

## Stack

React 18 + Vite. Fuentes: Figtree (cuerpo) y Fraunces (títulos) vía Google Fonts.
