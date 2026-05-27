import React from 'react';
import { cardClass, btnPrimary } from '../styles/theme';

export default function LandingPage({ onSelect = () => {} }) {
  return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center p-6">
      <div className="w-full max-w-3xl">
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-3 mb-3 justify-center">
            <div className="w-12 h-12 bg-gradient-to-br from-blue-600 to-violet-600 rounded-xl flex items-center justify-center shadow-lg">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M3 12h18" stroke="#fff" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
            </div>
            <div>
              <h1 className="text-3xl font-bold text-white">SmartLogix</h1>
              <p className="text-slate-400">Plataforma de gestión logística — accede a tu cuenta</p>
            </div>
          </div>
        </div>

        <div className={`${cardClass} p-8 flex flex-col sm:flex-row items-center gap-6 justify-between`}> 
          <div className="flex-1 text-center sm:text-left">
            <h2 className="text-xl font-semibold text-white">Empieza ahora</h2>
            <p className="text-slate-400 mt-1">Crea una cuenta o inicia sesión para acceder al tablero y administrar usuarios y productos.</p>
          </div>

          <div className="flex gap-3">
            <button
              onClick={() => onSelect('register')}
              className="px-6 py-3 rounded-xl bg-white text-slate-900 font-semibold shadow-sm hover:shadow-md transition-colors"
            >
              Registrarse
            </button>

            <button
              onClick={() => onSelect('login')}
              className="px-6 py-3 rounded-xl bg-gradient-to-br from-indigo-700 to-violet-700 text-white font-semibold shadow-lg hover:from-indigo-600 hover:to-violet-600 transition-colors"
            >
              Iniciar sesión
            </button>
          </div>
        </div>

        <p className="text-center text-slate-500 text-sm mt-4">¿Necesitas ayuda? Contacta con soporte técnico.</p>
      </div>
    </div>
  );
}
