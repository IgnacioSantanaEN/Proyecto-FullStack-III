import { useEffect, useState } from 'react';
import { cardClass } from '../styles/theme';
import { getUsers, registerUser, checkServerHealth } from '../services/api';
import ServerBanner from '../components/ui/ServerBanner';

export default function UserPage({ onNavigate = () => {}, user = null }) {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showBanner, setShowBanner] = useState(true);
  const [showCreate, setShowCreate] = useState(false);
  const [newName, setNewName] = useState('');
  const [newEmail, setNewEmail] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [newRole, setNewRole] = useState('usuario');
  const [healthMsg, setHealthMsg] = useState(null);

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

  // comprobar rol del usuario autenticado (si existe)
  const userRole = String(user?.role || user?.rol || '').toLowerCase();
  const isAdmin = userRole === 'admin';

  async function handleCreate(e) {
    e.preventDefault();
    try {
      setLoading(true);
      await registerUser({ name: newName, email: newEmail, password: newPassword, role: newRole });
      setNewName(''); setNewEmail(''); setNewPassword(''); setNewRole('user');
      setShowCreate(false);
      await load();
    } catch (err) {
      setError(err.message || String(err));
    } finally {
      setLoading(false);
    }
  }

  async function handleCheck() {
    try {
      const res = await checkServerHealth();
      setHealthMsg(res && res.error ? res.error : JSON.stringify(res));
    } catch (err) {
      setHealthMsg(err.message || String(err));
    }
  }

  const isConnectionError = error && /conexi[oó]n|No se puede conectar|Failed to fetch|ECONNREFUSED|NetworkError/i.test(error);

  // búsqueda para usuarios no-admin
  const [searchTerm, setSearchTerm] = useState('');
  const [searchResults, setSearchResults] = useState(null);
  const [searchLoading, setSearchLoading] = useState(false);

  const handleSearch = async () => {
    setSearchLoading(true);
    setSearchResults(null);
    try {
      const res = await getUsers();
      const list = Array.isArray(res) ? res : (res.content || []);
      const term = String(searchTerm || '').trim().toLowerCase();
      if (!term) {
        setSearchResults([]);
        return;
      }
      const matches = list.filter(u => (u.nombre || u.name || '').toLowerCase().includes(term));
      setSearchResults(matches);
    } catch (err) {
      setError(err.message || String(err));
    } finally {
      setSearchLoading(false);
    }
  };

  return (
    <div className="space-y-5">
      <ServerBanner error={error} visible={isConnectionError && showBanner} onClose={() => setShowBanner(false)} onRetry={load} />

      <div>
        <h1 className="text-2xl font-bold text-white">Usuarios</h1>
        <p className="text-slate-400 text-sm mt-0.5">Listado de usuarios registrados</p>
      </div>
      <div className="flex justify-end">
        <div className="flex gap-2">
          {isAdmin && (
            <>
              <button onClick={() => onNavigate('registrar')} className="px-3 py-1 bg-emerald-600 text-white rounded text-sm">Crear usuario</button>
              <button onClick={() => setShowCreate((s)=>!s)} className="px-3 py-1 bg-slate-700 text-white rounded text-sm">Crear inline</button>
            </>
          )}
          <button onClick={handleCheck} className="px-3 py-1 bg-slate-600 text-white rounded text-sm">Verificar MS usuario</button>
        </div>
      </div>

      {healthMsg && <div className="text-sm text-slate-300">Health: {healthMsg}</div>}

      {showCreate && (
        <div className={`${cardClass} p-4 max-w-xl`}>
          <h2 className="text-white font-semibold mb-2">Crear usuario (rápido)</h2>
          <form onSubmit={handleCreate} className="space-y-2">
            <div>
              <input required placeholder="Nombre" value={newName} onChange={(e)=>setNewName(e.target.value)} className="w-full mt-1 p-2 rounded bg-slate-800 border border-slate-700 text-white" />
            </div>
            <div>
              <input required type="email" placeholder="Email" value={newEmail} onChange={(e)=>setNewEmail(e.target.value)} className="w-full mt-1 p-2 rounded bg-slate-800 border border-slate-700 text-white" />
            </div>
            <div>
              <input required type="password" placeholder="Contraseña" value={newPassword} onChange={(e)=>setNewPassword(e.target.value)} className="w-full mt-1 p-2 rounded bg-slate-800 border border-slate-700 text-white" />
            </div>
            <div>
              <select value={newRole} onChange={(e)=>setNewRole(e.target.value)} className="w-full mt-1 p-2 rounded bg-slate-800 border border-slate-700 text-white">
                <option value="usuario">usuario</option>
                <option value="admin">admin</option>
              </select>
            </div>
            <div className="flex gap-2">
              <button type="submit" className="px-3 py-1 bg-emerald-600 text-white rounded text-sm">Crear</button>
              <button type="button" onClick={()=>setShowCreate(false)} className="px-3 py-1 bg-slate-700 text-white rounded text-sm">Cerrar</button>
            </div>
          </form>
        </div>
      )}

      {/* Si no es admin, mostrar barra de búsqueda simple */}
      {!isAdmin && (
        <div className={`${cardClass} p-4 max-w-2xl`}> 
          <h2 className="text-white font-semibold mb-2">Buscar usuario</h2>
          <div className="flex gap-2">
            <input value={searchTerm} onChange={(e)=>setSearchTerm(e.target.value)} placeholder="Buscar por nombre" className="flex-1 p-2 rounded bg-slate-800 border border-slate-700 text-white" />
            <button onClick={handleSearch} className="px-4 py-2 bg-blue-600 text-white rounded">Buscar</button>
          </div>

          <div className="mt-4">
            {searchLoading && <div className="text-slate-400">Buscando...</div>}
            {searchResults && searchResults.length === 0 && <div className="text-slate-400">No se encontraron coincidencias.</div>}
            {searchResults && searchResults.length > 0 && (
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-slate-700/50 text-slate-400 text-xs">
                    <th className="text-left py-2">ID</th>
                    <th className="text-left py-2">Nombre</th>
                  </tr>
                </thead>
                <tbody>
                  {searchResults.map(u=> (
                    <tr key={u.id||u._id||u.email} className="border-b border-slate-700/30 hover:bg-slate-700/10">
                      <td className="py-2 text-slate-300">{u.id || u._id || '-'}</td>
                      <td className="py-2 text-white">{u.nombre || u.name || '-'}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>
      )}

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
