// ─────────────────────────────────────────────────────────────
// pages/ConfigPage.jsx
// Configuración general del sistema.
// ─────────────────────────────────────────────────────────────

import { Settings, Bell, ChevronRight } from "lucide-react";
import { cardClass } from "../styles/theme";

const secciones = [
  { title: "Perfil de Empresa",   desc: "Nombre, RUT, dirección",    icon: Settings },
  { title: "Usuarios y Permisos", desc: "Gestión de accesos",        icon: Settings },
  { title: "Integraciones",       desc: "APIs y servicios externos", icon: Settings },
  { title: "Notificaciones",      desc: "Alertas y avisos",          icon: Bell      },
];

export default function ConfigPage() {
  return (
    <div className="space-y-5">
      <div>
        <h1 className="text-2xl font-bold text-white">Configuración</h1>
        <p className="text-slate-400 text-sm mt-0.5">Preferencias del sistema</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {secciones.map(({ title, desc, icon: Icon }) => (
          <div
            key={title}
            className={`${cardClass} p-5 flex items-center gap-4
                        hover:border-slate-600 transition-colors cursor-pointer`}
          >
            <div className="p-2.5 bg-slate-700/60 rounded-xl">
              <Icon size={18} className="text-slate-400" />
            </div>
            <div className="flex-1">
              <p className="text-white font-medium">{title}</p>
              <p className="text-slate-500 text-xs">{desc}</p>
            </div>
            <ChevronRight size={16} className="text-slate-600" />
          </div>
        ))}
      </div>
    </div>
  );
}
