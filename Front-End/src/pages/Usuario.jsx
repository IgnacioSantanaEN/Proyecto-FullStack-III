import React, { useEffect, useState } from 'react';
import { getUsers } from '../services/API';

function Usuario({ user, onNavigate }) {
  const [usersList, setUsersList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function loadUsers() {
      try {
        setLoading(true);
        const res = await getUsers();
        // Controlamos si la respuesta viene directa en un arreglo o empaquetada en un .content
        setUsersList(Array.isArray(res) ? res : (res?.content || []));
      } catch (err) {
        console.error("Error cargando usuarios:", err);
        setError('No se pudieron recuperar los usuarios del sistema corporativo.');
      } finally {
        setLoading(false);
      }
    }
    loadUsers();
  }, []);

  // Validación de rol en minúsculas para mayor seguridad
  const isAdmin = user?.role?.toLowerCase() === 'admin' || user?.rol?.toLowerCase() === 'admin';

  return (
    <div className="space-y-6 animate-fadeIn font-sans">
      
      {/* Encabezado */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white tracking-tight">Panel de Usuarios</h1>
          <p className="text-sm text-slate-400 mt-0.5">Lista de operadores autorizados con acceso directo al BFF</p>
        </div>

        {/* 🛡️ El botón de agregar solo se renderiza si el rol autenticado es ADMIN */}
        {isAdmin && (
          <button 
            onClick={() => onNavigate('crear-usuario')}
            className="bg-cyan-500 hover:bg-cyan-600 text-slate-950 px-4 py-2.5 rounded-xl text-xs font-bold transition-all shadow-lg active:scale-95"
          >
            + Agregar Nuevo Operador
          </button>
        )}
      </div>

      {error && (
        <div className="bg-red-500/10 border border-red-500/20 text-red-400 p-4 rounded-xl text-xs font-mono">
          ⚠️ {error}
        </div>
      )}

      {/* Contenedor de la Tabla */}
      <div className="bg-slate-800 border border-slate-700/70 rounded-2xl p-6 shadow-2xl">
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead>
              <tr className="border-b border-slate-700 text-slate-400 text-xs uppercase tracking-wider">
                <th className="py-3 px-4">Nombre Completo</th>
                <th className="py-3 px-4">Correo Electrónico</th>
                <th className="py-3 px-4 text-right">Rol Asignado</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-700/40 text-slate-300">
              {loading ? (
                <tr>
                  <td colSpan="3" className="py-6 text-center text-xs text-slate-500 italic animate-pulse">
                    Extrayendo personal desde el microservicio usuario...
                  </td>
                </tr>
              ) : usersList.length === 0 ? (
                <tr>
                  <td colSpan="3" className="py-6 text-center text-xs text-slate-500 italic">
                    No se registran usuarios cargados en este momento.
                  </td>
                </tr>
              ) : (
                usersList.map((u, index) => (
                  <tr key={u.id || u.email || index} className="hover:bg-slate-700/20 transition-colors">
                    <td className="py-3.5 px-4 font-medium text-white text-sm">
                      {u.nombre || u.name || 'Sin nombre'}
                    </td>
                    <td className="py-3.5 px-4 font-mono text-xs text-slate-400">
                      {u.email}
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      <span className={`inline-block px-2.5 py-0.5 rounded text-[10px] font-bold uppercase tracking-wide ${
                        u.role?.toLowerCase() === 'admin' || u.rol?.toLowerCase() === 'admin'
                          ? 'bg-red-500/10 text-red-400 border border-red-500/20' 
                          : 'bg-slate-700 text-slate-300 border border-slate-600'
                      }`}>
                        {u.role || u.rol || 'usuario'}
                      </span>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
}

export default Usuario;