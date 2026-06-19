import React, { useState } from 'react';
import { loginUser } from '../services/API'; 
// 🌟 IMPORTANTE: Importamos el HealthCheck aquí también para ver el estado del MS desde el Login
import HealthCheck from '../components/HealthCheck';

function Login({ onLoginSuccess, onNavigate }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      // Forzamos el envío limpio al método unificado de tu API.js
      const userData = await loginUser({ email, password });
      
      if (userData) {
        onLoginSuccess(userData);
      } else {
        setError('El servidor no retornó un perfil válido.');
      }
    } catch (err) {
      console.error("Error en login frontend:", err);
      // Captura el mensaje exacto si el BFF o el microservicio rechazan la autenticación
      const msg = err.response?.data?.message || 'Error de conexión con el BFF (Puerto 8086) o credenciales inválidas.';
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-[85vh] w-full">
      
      {/* 🟢 Monitor de conexión visible justo arriba del cuadro de Login */}
      <div className="mb-4">
        <HealthCheck />
      </div>

      <div className="w-full max-w-md bg-slate-800 border border-slate-700 rounded-2xl shadow-2xl p-8 transform transition-all duration-300 hover:border-slate-600">
        
        <div className="text-center mb-6">
          <span className="text-4xl">🏪</span>
          <h2 className="text-3xl font-bold text-white tracking-tight mt-2">Iniciar Sesión</h2>
          <p className="text-slate-400 text-sm mt-1">Portal de Acceso Centralizado</p>
        </div>

        {error && (
          <div className="bg-red-500/10 border border-red-500/30 text-red-400 p-3 rounded-xl text-xs text-center font-medium mb-4 font-mono">
            ⚠️ {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-medium text-slate-400 mb-1">Correo Electrónico</label>
            <input
              type="email" 
              required 
              value={email} 
              onChange={(e) => setEmail(e.target.value)}
              className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-2.5 text-white focus:outline-none focus:border-cyan-500 text-sm transition-all placeholder-slate-600 focus:ring-1 focus:ring-cyan-500"
              placeholder="correo@empresa.com"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-400 mb-1">Contraseña</label>
            <input
              type="password" 
              required 
              value={password} 
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-2.5 text-white focus:outline-none focus:border-cyan-500 text-sm transition-all placeholder-slate-600 focus:ring-1 focus:ring-cyan-500"
              placeholder="••••••••"
            />
          </div>

          <button
            type="submit" 
            disabled={loading}
            className="w-full bg-cyan-500 hover:bg-cyan-600 disabled:bg-slate-700 disabled:text-slate-500 text-slate-950 font-semibold py-3 rounded-xl transition-all shadow-lg text-sm mt-2"
          >
            {loading ? 'Autenticando en pasarela...' : 'Ingresar al Sistema'}
          </button>
        </form>

        <div className="text-center pt-4 border-t border-slate-700/50 mt-4">
          <button
            type="button" 
            onClick={() => onNavigate('registro-inicial')}
            className="text-xs text-cyan-400 hover:underline font-medium transition-colors"
          >
            ¿No tienes cuenta operativa? Regístrate aquí
          </button>
        </div>

      </div>
    </div>
  );
}

export default Login;