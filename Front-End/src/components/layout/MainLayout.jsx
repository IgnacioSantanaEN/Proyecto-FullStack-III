// ─────────────────────────────────────────────────────────────
// components/layout/MainLayout.jsx
// Shell principal del panel: Sidebar + Navbar + Main + Footer.
// Este componente SOLO se encarga de la estructura visual,
// no de lógica de negocio.
//
// Props:
//   sidebarOpen    (bool)
//   activePage     (string)
//   user           (object) — datos del usuario autenticado
//   onToggleSidebar(fn)
//   onNavigate     (fn)
//   onLogout       (fn)
//   children       (ReactNode) — contenido de la página activa
// ─────────────────────────────────────────────────────────────

import Sidebar  from "./Sidebar";
import Navbar   from "./Navbar";
import Footer   from "./Footer";
import { theme } from "../../styles/theme";

export default function MainLayout({
  sidebarOpen,
  activePage,
  user,
  onToggleSidebar,
  onNavigate,
  onLogout,
  children,
}) {
  return (
    <div
      className={`min-h-screen ${theme.bg.base} flex text-slate-300`}
      style={{ fontFamily: "'DM Sans', system-ui, sans-serif" }}
    >
      {/* ── Sidebar (izquierda) ──────────────────────────── */}
      <Sidebar
        open={sidebarOpen}
        activePage={activePage}
        onNavigate={onNavigate}
        user={user}
        onLogout={onLogout}
      />

      {/* ── Área de contenido (derecha) ──────────────────── */}
      <div className="flex-1 flex flex-col min-w-0">

        {/* Header */}
        <Navbar onToggleSidebar={onToggleSidebar} user={user} onLogout={onLogout} />

        {/* Body / Contenido dinámico */}
        <main className="flex-1 p-5 overflow-auto">
          {children}
        </main>

        {/* Footer */}
        <Footer />

      </div>
    </div>
  );
}
