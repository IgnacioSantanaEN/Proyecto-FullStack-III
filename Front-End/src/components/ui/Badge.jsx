// ─────────────────────────────────────────────────────────────
// components/ui/Badge.jsx
// Badge genérico de estado. Recibe las clases desde utils/badges.js.
// Props: label (string), className (string de clases Tailwind)
// ─────────────────────────────────────────────────────────────

export default function Badge({ label, className = "" }) {
  return (
    <span className={`text-xs px-2.5 py-1 rounded-full border ${className}`}>
      {label}
    </span>
  );
}
