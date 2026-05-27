import { useState } from 'react';
import { cardClass } from '../styles/theme';
import { registerUser } from '../services/api';
import ServerBanner from '../components/ui/ServerBanner';

export default function RegisterUserPage({ onNavigate = () => {} }) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('user');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [showBanner, setShowBanner] = useState(true);
  const [success, setSuccess] = useState(null);

  async function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(null);
    try {
      const payload = { name, email, password, role };
      const res = await registerUser(payload);
      setSuccess('Usuario creado correctamente');
      setName(''); setEmail(''); setPassword(''); setRole('user');
      // opcional: navegar al listado de usuarios
      setTimeout(() => onNavigate('usuarios'), 900);
    } catch (err) {
      setError(err.message || String(err));
    } finally {
      setLoading(false);
    }
  }

  const isConnectionError = error && /conexi[oó]n|No se puede conectar|Failed to fetch|ECONNREFUSED|NetworkError/i.test(error);

  return (
    <div className="space-y-5">
      <ServerBanner error={error} visible={isConnectionError && showBanner} onClose={() => setShowBanner(false)} onRetry={() => { setShowBanner(true); }} />

      <div>
        <h1 className="text-2xl font-bold text-white">Registrar Usuario</h1>
        <p className="text-slate-400 text-sm mt-0.5">Crea una nueva cuenta de usuario</p>
      </div>

      <div className={`${cardClass} p-5 max-w-xl`}>
        {success && <div className="mb-3 text-emerald-400">{success}</div>}
        {error && !isConnectionError && <div className="mb-3 text-rose-400">Error: {String(error)}</div>}

        <form onSubmit={handleSubmit} className="space-y-3">
          <div>
            <label className="text-slate-300 text-xs">Nombre</label>
            <input required value={name} onChange={(e)=>setName(e.target.value)} className="w-full mt-1 p-2 rounded bg-slate-800 border border-slate-700 text-white" />
          </div>

          <div>
            <label className="text-slate-300 text-xs">Email</label>
            <input required type="email" value={email} onChange={(e)=>setEmail(e.target.value)} className="w-full mt-1 p-2 rounded bg-slate-800 border border-slate-700 text-white" />
          </div>

          <div>
            <label className="text-slate-300 text-xs">Contraseña</label>
            <input required type="password" value={password} onChange={(e)=>setPassword(e.target.value)} className="w-full mt-1 p-2 rounded bg-slate-800 border border-slate-700 text-white" />
          </div>

          <div>
            <label className="text-slate-300 text-xs">Rol</label>
            <select value={role} onChange={(e)=>setRole(e.target.value)} className="w-full mt-1 p-2 rounded bg-slate-800 border border-slate-700 text-white">
              <option value="user">user</option>
              <option value="admin">admin</option>
            </select>
          </div>

          <div className="flex gap-2">
            <button type="submit" disabled={loading} className="px-4 py-2 bg-emerald-600 rounded text-white">{loading ? 'Guardando...' : 'Registrar'}</button>
            <button type="button" onClick={()=>onNavigate('usuarios')} className="px-4 py-2 bg-slate-700 rounded text-white">Cancelar</button>
          </div>
        </form>
      </div>
    </div>
  );
}
