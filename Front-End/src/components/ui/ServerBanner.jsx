import React from 'react';

export default function ServerBanner({ error, visible = false, onClose = () => {}, onRetry = () => {} }) {
  if (!visible) return null;
  return (
    <div className="flex items-start gap-4 p-3 rounded-md bg-amber-600/10 border border-amber-600/20">
      <div className="flex-1">
        <strong className="text-amber-400">No se pudo conectar al backend.</strong>
        <div className="text-slate-300 text-sm mt-1">
          Verifica que XAMPP y los servicios backend estén corriendo en los puertos configurados (p. ej. http://localhost:8080 y http://localhost:8081).
        </div>
        {error && <div className="text-rose-300 text-xs mt-1">Detalle: {String(error)}</div>}
      </div>
      <div className="flex items-center gap-2">
        <button onClick={onClose} className="text-xs px-3 py-1 bg-slate-700/30 rounded-md">Cerrar</button>
        <button onClick={onRetry} className="text-xs px-3 py-1 bg-emerald-600 rounded-md">Reintentar</button>
      </div>
    </div>
  );
}
