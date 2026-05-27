// ─────────────────────────────────────────────────────────────
// App.jsx
// Raíz de la aplicación. Solo gestiona:
//   1. Estado de sesión
//   2. Navegación entre páginas
//   3. Estado del sidebar
//   4. Toast de bienvenida
//   5. Datos del usuario autenticado
//
// NO contiene ningún estilo inline ni lógica de UI.
// Toda la estructura visual vive en components/layout/.
// ─────────────────────────────────────────────────────────────

import { useState, useEffect } from "react";

// Layout
import MainLayout   from "./components/layout/MainLayout";

// UI
import Toast        from "./components/ui/Toast";

// Páginas
import LoginPage    from "./pages/LoginPage";
import DashboardPage  from "./pages/DashboardPage";
import InventarioPage from "./pages/InventarioPage";
import PedidosPage    from "./pages/PedidosPage";
import EnviosPage     from "./pages/EnviosPage";
import ReportesPage   from "./pages/ReportesPage";
import ConfigPage     from "./pages/ConfigPage";
import UserPage       from "./pages/UserPage";
import RegisterUserPage from "./pages/RegisterUserPage";

// ── Mapa de rutas → componentes ───────────────────────────────
const PAGE_MAP = {
  dashboard:  DashboardPage,
  inventario: InventarioPage,
  pedidos:    PedidosPage,
  envios:     EnviosPage,
  reportes:   ReportesPage,
  config:     ConfigPage,
  usuarios:   UserPage,
  registrar:  RegisterUserPage,
};

// ── Estilos globales (fuente + scrollbar + animaciones) ───────
const GlobalStyles = () => (
  <style>{`
    @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700&display=swap');

    /* Card base — usada por cardClass en theme.js */
    .card {
      background: rgb(15 23 42);
      border: 1px solid rgb(30 41 59 / 0.8);
      border-radius: 0.875rem;
      transition: border-color 0.2s;
    }

    /* Toast de entrada */
    @keyframes fadeIn {
      from { opacity: 0; transform: translateY(-8px); }
      to   { opacity: 1; transform: translateY(0);    }
    }

    /* Scrollbar personalizada */
    * { scrollbar-width: thin; scrollbar-color: #1e293b transparent; }
    ::-webkit-scrollbar       { width: 5px; height: 5px; }
    ::-webkit-scrollbar-thumb { background: #1e293b; border-radius: 9999px; }
  `}</style>
);

// ── Componente raíz ───────────────────────────────────────────
export default function App() {
  const [logged,      setLogged]      = useState(false);
  const [user,        setUser]        = useState(null);
  const [activePage,  setActivePage]  = useState("dashboard");
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [toast,       setToast]       = useState(null);

  // Verificar si hay usuario guardado en localStorage al cargar
  useEffect(() => {
    const savedUser = localStorage.getItem("user");
    if (savedUser) {
      try {
        setUser(JSON.parse(savedUser));
        setLogged(true);
      } catch (e) {
        console.error("Error al recuperar usuario:", e);
        localStorage.removeItem("user");
      }
    }
  }, []);

  // Mostrar bienvenida al iniciar sesión
  useEffect(() => {
    if (!logged) return;
    setToast(`Bienvenido ${user?.name || "usuario"} ✓`);
    const timer = setTimeout(() => setToast(null), 3000);
    return () => clearTimeout(timer);
  }, [logged]);

  // ── Login ──────────────────────────────────────────────────
  if (!logged) {
    return (
      <>
        <GlobalStyles />
        <LoginPage onLogin={(userData) => {
          setUser(userData);
          setLogged(true);
        }} />
      </>
    );
  }

  // ── Panel principal ────────────────────────────────────────
  const PageComponent = PAGE_MAP[activePage] ?? DashboardPage;

  return (
    <>
      <GlobalStyles />

      {/* Notificación flotante */}
      <Toast message={toast} />

      {/* Shell: Sidebar + Navbar + Main + Footer */}
      <MainLayout
        sidebarOpen={sidebarOpen}
        activePage={activePage}
        user={user}
        onToggleSidebar={() => setSidebarOpen((v) => !v)}
        onNavigate={setActivePage}
        onLogout={() => {
          setLogged(false);
          setUser(null);
          localStorage.removeItem("user");
        }}
      >
        <PageComponent user={user} onNavigate={setActivePage} />
      </MainLayout>
    </>
  );
}
