import React, { useState } from 'react';

function App() {
  const [resultado, setResultado] = useState(null);
  const [errorStatus, setErrorStatus] = useState(null);
  const [loading, setLoading] = useState(false);

  const probarBffDirecto = async () => {
    setLoading(true);
    setResultado(null);
    setErrorStatus(null);
    
    try {
      // Apuntamos directo al endpoint que funcionó en Postman
      const response = await fetch('http://localhost:8086/api/bff/usuario', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json'
        }
      });

      const data = await response.json();
      setResultado(`¡ÉXITO! Conexión establecida. Respuesta: ${JSON.stringify(data)}`);
    } catch (err) {
      setErrorStatus(
        `❌ ERROR DE RED EN EL NAVEGADOR\n\n` +
        `Si Postman responde pero aquí se corta al instante con 'Failed to fetch', ` +
        `es una confirmación del 100% de que el navegador está bloqueando la petición por CORS.\n\n` +
        `Mensaje interno: ${err.message}`
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-900 text-white flex flex-col items-center justify-center p-6 font-sans">
      <div className="w-full max-w-lg bg-slate-800 border border-slate-700 rounded-2xl p-8 shadow-2xl space-y-6">
        
        <div className="text-center">
          <span className="text-3xl">🧪</span>
          <h1 className="text-2xl font-bold text-cyan-400 mt-2">Diagnóstico de Red Unificado</h1>
          <p className="text-slate-400 text-sm mt-1">
            Validando si el navegador web tiene permitido hablar con el BFF.
          </p>
        </div>

        <div className="bg-slate-900 border border-slate-700/50 rounded-xl p-4 text-xs text-slate-400 space-y-1">
          <p><strong>Método:</strong> <span className="text-emerald-400 font-mono">GET</span></p>
          <p><strong>Endpoint:</strong> <span className="text-slate-300 font-mono">http://localhost:8086/api/bff/usuario</span></p>
        </div>

        <button 
          onClick={probarBffDirecto}
          disabled={loading}
          className="w-full bg-cyan-500 hover:bg-cyan-600 disabled:bg-slate-700 text-slate-950 font-semibold py-3 px-4 rounded-xl transition-all shadow-lg text-sm"
        >
          {loading ? 'Conectando...' : '🚀 Lanzar Petición Física'}
        </button>

        {resultado && (
          <div className="bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 p-4 rounded-xl text-sm font-medium animate-fadeIn">
            {resultado}
          </div>
        )}

        {errorStatus && (
          <div className="bg-red-500/10 border border-red-500/30 text-orange-200 p-4 rounded-xl text-xs font-mono whitespace-pre-line border-l-4 border-l-orange-500">
            {errorStatus}
          </div>
        )}
        
      </div>
    </div>
  );
}

export default App;