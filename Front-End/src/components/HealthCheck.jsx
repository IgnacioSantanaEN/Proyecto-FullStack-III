import React, { useState, useEffect } from 'react';
import { checkUsuarioHealth } from '../services/API';

function HealthCheck() {
  const [status, setStatus] = useState('checking'); // 'online', 'offline', 'checking'

  const verifyConnection = async () => {
    setStatus('checking');
    const isAlive = await checkUsuarioHealth();
    setStatus(isAlive ? 'online' : 'offline');
  };

  // Comprobación automática cada 30 segundos
  useEffect(() => {
    verifyConnection();
    const interval = setInterval(verifyConnection, 30000);
    return () => clearInterval(interval);
  }, []);

  return (
    <button
      onClick={verifyConnection}
      title="Click para comprobar conexión con MS-Usuario"
      className="flex items-center space-x-2 bg-slate-900/60 border border-slate-700 hover:border-slate-600 px-3 py-1.5 rounded-xl transition-all active:scale-95 text-xs font-mono"
    >
      {status === 'checking' && (
        <>
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-amber-500"></span>
          </span>
          <span className="text-amber-400 font-medium">Validando MS...</span>
        </>
      )}

      {status === 'online' && (
        <>
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
          </span>
          <span className="text-emerald-400 font-medium">MS-Usuario OK</span>
        </>
      )}

      {status === 'offline' && (
        <>
          <span className="relative flex h-2 w-2">
            <span className="relative inline-flex rounded-full h-2 w-2 bg-rose-500"></span>
          </span>
          <span className="text-rose-400 font-medium">MS-Usuario OFF</span>
        </>
      )}
    </button>
  );
}

export default HealthCheck;