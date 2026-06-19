import React, { useState } from 'react';
import { registerUser } from '../services/API';
// 🌟 IMPORTANTE: Importamos el HealthCheck para ver el estado del MS antes de enviar el formulario
import HealthCheck from '../components/HealthCheck';

function RegistroUsuario({ onNavigate }) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('USUARIO'); // Por defecto en mayúsculas para cumplir con el ENUM
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setSuccess(false);
    setLoading(true);

    try {
      // 🌟 CORRECCIÓN DIRECTA: Enviamos las propiedades nativas requeridas por el microservicio
      await registerUser({
        nombre: name,     // Mapeado a 'nombre'
        email: email,
        password: password,
        rol: role         // Pasa 'USUARIO' o 'ADMIN' en mayúsculas limpias
      });

      setSuccess(true);
      // Limpiamos el formulario tras un registro exitoso
      setName('');
      setEmail('');
      setPassword('');
    } catch (err) {
      console.error("Error en registro frontend:", err);
      const msg = err.response?.data?.message || 'Error de validación (400) o problemas de red con el BFF.';
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-[85vh] w-full">
      
      {/* 🟢 Monitor de conexión visible justo arriba de la tarjeta */}
      <div className="mb-4">
        <HealthCheck />
      </div>

      <div className="w-full max-w-md bg-slate-800 border border-slate-700 rounded-2xl shadow-2xl p-8 transform transition-all duration-300 hover:border-slate-600">
        
        <div className="text-center mb-6">
          <span className="text-4xl">🔑</span>
          <h2 className="text-3xl font-bold text-white tracking-tight mt-2">Registro de Operador</h2>
          <p className="text-slate-400 text-sm mt-1">Dar de alta personal en el microservicio</p>
        </div>

        {error && (
          <div className="bg-red-500/10 border border-red-500/30 text-red-400 p-3 rounded-xl text-xs text-center font-medium mb-4 font-mono">
            ⚠️ {error}
          </div>
        )}

        {success && (
          <div className="bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 p-3 rounded-xl text-xs text-center font-medium mb-4">
            ✅ ¡Operador registrado con éxito en el sistema! Ya puedes iniciar sesión.
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-medium text-slate-400 mb-1">Nombre Completo</label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-2.5 text-white focus:outline-none focus:border-cyan-500 text-sm transition-all"
              placeholder="Juan Pérez"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-400 mb-1">Correo Electrónico</label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-2.5 text-white focus:outline-none focus:border-cyan-500 text-sm transition-all"
              placeholder="operador@empresa.com"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-400 mb-1">Contraseña</label>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-2.5 text-white focus:outline-none focus:border-cyan-500 text-sm transition-all"
              placeholder="Mínimo 4 o 6 caracteres"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-400 mb-1">Rol del Sistema</label>
            <select
              value={role}
              onChange={(e) => setRole(e.target.value)}
              className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-2.5 text-white focus:outline-none focus:border-cyan-500 text-sm transition-all"
            >
              <option value="USUARIO">Usuario (Consultas)</option>
              <option value="ADMIN">Administrador (Control Total)</option>
            </select>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-cyan-500 hover:bg-cyan-600 disabled:bg-slate-700 disabled:text-slate-500 text-slate-950 font-semibold py-3 rounded-xl transition-all shadow-lg text-sm mt-2"
          >
            {loading ? 'Procesando en Microservicio...' : 'Registrar Cuenta'}
          </button>
        </form>

        <div className="text-center pt-4 border-t border-slate-700/50 mt-4">
          <button
            type="button"
            onClick={() => onNavigate('login')}
            className="text-xs text-cyan-400 hover:underline font-medium transition-colors"
          >
            ¿Ya tienes cuenta operativa? Inicia sesión aquí
          </button>
        </div>

      </div>
    </div>
  );
}

export default RegistroUsuario;