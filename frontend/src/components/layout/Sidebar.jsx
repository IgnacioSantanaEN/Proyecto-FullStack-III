// ─────────────────────────────────────────────────────────────
// components/layout/Sidebar.jsx
// Panel de navegación lateral.
// Props:
//   open       (bool)     — si está expandido o colapsado
//   activePage (string)   — id de la página activa
//   onNavigate (fn)       — callback(pageId)
//   onLogout   (fn)       — callback de cerrar sesión
// ─────────────────────────────────────────────────────────────

import {
  LayoutDashboard, Package, ShoppingCart, Truck,
  BarChart3, Settings, LogOut,
} from "lucide-react";
import { theme } from "../../styles/theme";

// Mapa de id → ícono (evita guardar componentes en data.js)
const iconMap = {
  LayoutDashboard, Package, ShoppingCart,
  Truck, BarChart3, Settings,
};

const navItems = [
  { id: "dashboard",  label: "Dashboard",     icon: "LayoutDashboard" },
  { id: "inventario", label: "Inventario",    icon: "Package",        badge: 3 },
  { id: "pedidos",    label: "Pedidos",       icon: "ShoppingCart",   badge: 5 },
  { id: "envios",     label: "Envíos",        icon: "Truck" },
  { id: "reportes",   label: "Reportes",      icon: "BarChart3" },
  { id: "config",     label: "Configuración", icon: "Settings" },
];

// ── NavItem interno ───────────────────────────────────────────
function NavItem({ id, label, icon, badge, active, collapsed, onClick }) {
  const Icon = iconMap[icon];
  return (
    <button
      onClick={() => onClick(id)}
      className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium
                  transition-all duration-200 group
                  ${active
                    ? "bg-blue-600 text-white shadow-lg shadow-blue-600/25"
                    : "text-slate-400 hover:text-white hover:bg-slate-700/60"}`}
    >
      <Icon
        size={18}
        className={active ? "text-white" : "text-slate-500 group-hover:text-slate-300"}
      />
      {!collapsed && <span className="flex-1 text-left">{label}</span>}
      {!collapsed && badge && (
        <span className="bg-red-500 text-white text-xs font-bold px-1.5 py-0.5 rounded-full min-w-[20px] text-center">
          {badge}
        </span>
      )}
    </button>
  );
}

// ── Sidebar principal ─────────────────────────────────────────
export default function Sidebar({ open, activePage, onNavigate, onLogout }) {
  return (
    <aside
      className={`flex-shrink-0 ${theme.bg.surface} ${theme.border.default}
                  border-r flex flex-col transition-all duration-300
                  ${open ? theme.sidebar.expanded : theme.sidebar.collapsed}`}
    >
      {/* Logo */}
      <div className={`flex items-center gap-2.5 px-3 ${theme.navbar.height}
                       border-b ${theme.border.default} shrink-0 overflow-hidden`}>
        <div className="w-8 h-8 bg-blue-600 rounded-xl flex items-center justify-center
                        shrink-0 shadow-md shadow-blue-600/30">
          <Truck size={16} className="text-white" />
        </div>
        {open && (
          <span className="font-bold text-white tracking-tight text-sm whitespace-nowrap">
            SmartLogix
          </span>
        )}
      </div>

      {/* Navegación */}
      <nav className="flex-1 px-2 py-4 space-y-0.5 overflow-hidden">
        {navItems.map((item) => (
          <NavItem
            key={item.id}
            {...item}
            active={activePage === item.id}
            collapsed={!open}
            onClick={onNavigate}
          />
        ))}
      </nav>

      {/* Cerrar sesión */}
      <div className={`px-2 pb-4 border-t ${theme.border.default} pt-3 shrink-0`}>
        <button
          onClick={onLogout}
          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm
                     text-slate-500 hover:text-red-400 hover:bg-red-400/10 transition-colors"
        >
          <LogOut size={17} className="shrink-0" />
          {open && <span>Cerrar sesión</span>}
        </button>
      </div>
    </aside>
  );
}
