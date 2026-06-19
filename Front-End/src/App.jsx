import React, { useState } from 'react';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Usuario from './pages/Usuario';
import RegistroUsuario from './pages/RegistroUsuario';
// 🌟 LÍNEA NUEVA: Importamos el componente de salud corporativa
import HealthCheck from './components/HealthCheck'; 

function App() {
  const [user, setUser] = useState(null);
  const [currentView, setCurrentView] = useState('login'); 

  const handleLoginSuccess = (usuarioLogueado) => {
    setUser(usuarioLogueado);
    setCurrentView('dashboard'); 
  };

  const handleLogout = () => {
    setUser(null);
    setCurrentView('login'); 
  };

  // ====================================================
  // 🛡️ MODULO PRIVADO (SESIÓN INICIADA Y ACTIVA) =======
  // ====================================================
  if (user) {
    return (
      <div className="min-h-screen bg-slate-900 text-white font-sans selection:bg-cyan-500/30">
        
        {/* Barra de Navegación Superior */}
        <nav className="bg-slate-800 p-4 flex justify-between border-b border-slate-700 shadow-xl items-center sticky top-0 z-50">
          <div className="flex items-center space-x-6">
            <span 
              onClick={() => setCurrentView('dashboard')} 
              className="text-cyan-400 font-bold text-lg tracking-wider cursor-pointer active:scale-95 transition-transform"
            >
              🏪 SISTEMA BFF
            </span>
            <button 
              onClick={() => setCurrentView('dashboard')} 
              className={`text-xs font-bold tracking-wide uppercase transition-colors ${currentView === 'dashboard' ? 'text-cyan-400' : 'text-slate-400 hover:text-slate-200'}`}
            >
              Dashboard
            </button>
            <button 
              onClick={() => setCurrentView('usuarios')} 
              className={`text-xs font-bold tracking-wide uppercase transition-colors ${currentView === 'usuarios' || currentView === 'crear-usuario' ? 'text-cyan-400' : 'text-slate-400 hover:text-slate-200'}`}
            >
              Usuarios
            </button>
          </div>
          
          {/* Zona Derecha de la barra superior */}
          <div className="flex items-center space-x-4">
            
            {/* 🌟 LÍNEA NUEVA: Aquí queda insertado el botón de HealthCheck */}
            <HealthCheck />

            {/* Tag Dinámico del Rol actual */}
            <span className="text-[10px] bg-slate-700 px-3 py-1 rounded-xl text-slate-300 font-mono uppercase tracking-wider border border-slate-600">
              {user.role || user.rol || 'usuario'}
            </span>
            <button 
              onClick={handleLogout} 
              className="text-xs bg-red-500/10 hover:bg-red-500/20 text-red-400 px-3 py-1.5 rounded-xl border border-red-500/20 font-semibold tracking-wide transition-all active:scale-95"
            >
              Cerrar Sesión
            </button>
          </div>
        </nav>

        {/* Zona Dinámica de Inyección de Módulos */}
        <main className="p-6 max-w-5xl mx-auto min-h-[calc(100vh-73px)] flex flex-col justify-between">
          <div className="w-full">
            {currentView === 'dashboard' && <Dashboard user={user} />}
            {currentView === 'usuarios' && <Usuario user={user} onNavigate={(v) => setCurrentView(v)} />}
            {currentView === 'crear-usuario' && <RegistroUsuario onNavigate={(v) => setCurrentView(v)} />}
          </div>
          
          <footer className="text-center text-[11px] text-slate-600 pt-12 font-mono">
            Arquitectura de Microservicios Unificada • Backend for Frontend (BFF) Activo
          </footer>
        </main>
      </div>
    );
  }

  // ====================================================
  // 🌐 MODULO PÚBLICO (ACCESO Y REGISTRO INICIAL) ======
  // ====================================================
  return (
    <div className="min-h-screen bg-slate-900 text-white flex items-center justify-center p-4 font-sans selection:bg-cyan-500/30">
      <div className="w-full max-w-md">
        {currentView === 'login' && (
          <Login onLoginSuccess={handleLoginSuccess} onNavigate={(v) => setCurrentView(v)} />
        )}
        {currentView === 'registro-inicial' && (
          <RegistroUsuario onNavigate={(v) => setCurrentView(v)} />
        )}
      </div>
    </div>
  );
}

export default App;