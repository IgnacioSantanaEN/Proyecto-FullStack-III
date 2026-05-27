import { useEffect, useState } from 'react';
import { cardClass } from '../styles/theme';
import { getUsers } from '../services/api';
import ServerBanner from '../components/ui/ServerBanner';

export default function UserPage({ onNavigate = () => {} }) {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showBanner, setShowBanner] = useState(true);

  async function load() {
    setLoading(true);
    try {
      const res = await getUsers();
      setUsers(Array.isArray(res) ? res : (res.content || []));
      setError(null);
    } catch (err) {
      setError(err.message || String(err));
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => { load(); }, []);

  const isConnectionError = error && /conexi[oó]n|No se puede conectar|Failed to fetch|ECONNREFUSED|NetworkError/i.test(error);

  return (
    <div className="space-y-5">
      <ServerBanner error={error} visible={isConnectionError && showBanner} onClose={() => setShowBanner(false)} onRetry={load} />

      <div>
        <h1 className="text-2xl font-bold text-white">Usuarios</h1>
        <p className="text-slate-400 text-sm mt-0.5">Listado de usuarios registrados</p>
      </div>
      <div className="flex justify-end">
        <button onClick={() => onNavigate('registrar')} className="px-3 py-1 bg-emerald-600 text-white rounded text-sm">Crear usuario</button>
      </div>

      <div className="">
        <div className={`${cardClass} p-4`}> 
          {loading && <div className="text-slate-400">Cargando usuarios...</div>}
          {!loading && error && <div className="text-rose-400">Error: {String(error)}</div>}

          {!loading && !error && (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-slate-700/50 text-slate-400 text-xs">
                    <th className="text-left py-2">ID</th>
                    <th className="text-left py-2">Nombre</th>
                    <th className="text-left py-2">Email</th>
                    <th className="text-left py-2">Rol</th>
                  </tr>
                </thead>
                <tbody>
                  {users.map((u) => (
                    <tr key={u.id || u._id || u.email} className="border-b border-slate-700/30 hover:bg-slate-700/10">
                      <td className="py-2 text-slate-300">{u.id || u._id || '-'}</td>
                      <td className="py-2 text-white">{u.nombre || u.name || u.fullName || '-'}</td>
                      <td className="py-2 text-slate-300">{u.email || '-'}</td>
                      <td className="py-2 text-slate-300">{u.role || u.rol || '-'}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
