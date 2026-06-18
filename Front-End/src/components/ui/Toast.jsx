// ─────────────────────────────────────────────────────────────
// components/ui/Toast.jsx
// Notificación flotante de éxito. Se renderiza arriba a la derecha.
// Props: message (string) — si es null/undefined no renderiza nada.
// ─────────────────────────────────────────────────────────────

import { CheckCircle } from "lucide-react";

export default function Toast({ message }) {
  if (!message) return null;

  return (
    <div
      className="fixed top-4 right-4 z-50 bg-slate-800 border border-emerald-500/30
                 text-white text-sm px-4 py-3 rounded-xl shadow-xl
                 flex items-center gap-2"
      style={{ animation: "fadeIn 0.3s ease" }}
    >
      <CheckCircle size={15} className="text-emerald-400 shrink-0" />
      <span>{message}</span>
    </div>
  );
}
