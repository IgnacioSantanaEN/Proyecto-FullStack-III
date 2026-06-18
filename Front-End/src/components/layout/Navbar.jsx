// ─────────────────────────────────────────────────────────────
// components/layout/Navbar.jsx
// Barra de navegación superior (Header de la app).
// Props:
//   onToggleSidebar (fn) — abre/cierra el sidebar
//   user           (obj) — datos del usuario autenticado
//   onLogout       (fn) — callback para cerrar sesión
// ─────────────────────────────────────────────────────────────

import { Menu, Search, Bell, LogOut } from "lucide-react";
import { useState } from "react";
import { theme } from "../../styles/theme";

export default function Navbar({ onToggleSidebar, user, onLogout }) {
  const [showLogoutMenu, setShowLogoutMenu] = useState(false);
  
  // Obtener iniciales del usuario
  const getInitials = () => {
    if (!user) return "??";
    const name = (user.name || "").trim();
    if (!name) return "U";
    // usar primeras dos letras del nombre como iniciales
    const initials = name.split(" ").map(s=>s[0]||"").slice(0,2).join("").toUpperCase();
    return initials || "U";
  };
  
  const getUserDisplayName = () => {
    if (!user) return "Usuario";
    return `${user.name || ""}`.trim() || "Usuario";
  };

  return (
    <header
      className={`${theme.navbar.height} ${theme.bg.surface}
                  border-b ${theme.border.default}
                  flex items-center px-4 gap-3 shrink-0`}
    >
      {/* Toggle sidebar */}
      <button
        onClick={onToggleSidebar}
        className="p-1.5 text-slate-500 hover:text-white hover:bg-slate-700
                   rounded-lg transition-colors"
        aria-label="Toggle sidebar"
      >
        <Menu size={18} />
      </button>

      {/* Espacio flexible */}
      <div className="flex-1" />

      {/* Buscador */}
      <div className="relative hidden sm:block">
        <Search
          size={14}
          className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500"
        />
        <input
          placeholder="Buscar..."
          className="bg-slate-800 border border-slate-700 text-sm text-white
                     rounded-xl pl-8 pr-4 py-2 w-48
                     focus:outline-none focus:border-blue-500 transition-colors
                     placeholder:text-slate-600"
        />
      </div>

      {/* Notificaciones */}
      <button
        className="relative p-2 text-slate-500 hover:text-white hover:bg-slate-700
                   rounded-lg transition-colors"
        aria-label="Notificaciones"
      >
        <Bell size={18} />
        <span className="absolute top-1.5 right-1.5 w-1.5 h-1.5 bg-red-500 rounded-full" />
      </button>

      {/* Avatar del usuario */}
      <div className="relative">
        <button
          onClick={() => setShowLogoutMenu(!showLogoutMenu)}
          className={`flex items-center gap-2.5 pl-3 pr-2 py-2 border-l ${theme.border.default}
                      hover:bg-slate-800 rounded-lg transition-colors cursor-pointer`}
        >
          <div
            className="w-8 h-8 bg-gradient-to-br from-blue-500 to-violet-600
                       rounded-full flex items-center justify-center
                       text-xs font-bold text-white"
          >
            {getInitials()}
          </div>
          <div className="hidden sm:block text-left">
            <p className="text-xs font-semibold text-white leading-none mb-0.5">
              {getUserDisplayName()}
            </p>
            <p className="text-xs text-slate-500 leading-none">{user?.email || "usuario@empresa.cl"}</p>
          </div>
        </button>
        
        {/* Menú de logout */}
        {showLogoutMenu && (
          <div className="absolute right-0 mt-2 w-40 bg-slate-800 border border-slate-700 rounded-lg shadow-lg z-50">
            <button
              onClick={() => {
                setShowLogoutMenu(false);
                onLogout();
              }}
              className="w-full flex items-center gap-2 px-4 py-2 text-sm text-red-400 hover:bg-slate-700 rounded-lg transition-colors"
            >
              <LogOut size={16} />
              Cerrar sesión
            </button>
          </div>
        )}
      </div>
    </header>
  );
}
