// ─────────────────────────────────────────────────────────────
// components/layout/Footer.jsx
// Pie de página del panel administrativo.
// Muestra versión del sistema, copyright y estado del servidor.
// ─────────────────────────────────────────────────────────────

import { theme } from "../../styles/theme";

export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer
      className={`${theme.footer.height} ${theme.bg.surface}
                  border-t ${theme.border.default}
                  flex items-center justify-between
                  px-5 shrink-0`}
    >
      {/* Copyright */}
      <p className="text-xs text-slate-600">
        © {year} SmartLogix — Plataforma Logística para PYMEs
      </p>

      {/* Estado del sistema + versión */}
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-1.5">
          {/* Indicador de estado */}
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
          <span className="text-xs text-slate-600">Sistema operativo</span>
        </div>
        <span className="text-xs text-slate-700">v1.0.0</span>
      </div>
    </footer>
  );
}
