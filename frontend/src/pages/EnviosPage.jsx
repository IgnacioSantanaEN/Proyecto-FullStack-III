// ─────────────────────────────────────────────────────────────
// pages/EnviosPage.jsx
// Gestión de envíos con formulario editable y selección de pedido.
// ─────────────────────────────────────────────────────────────

import { useEffect, useMemo, useState } from "react";
import { MapPin, Edit2, Trash2 } from "lucide-react";
import Badge from "../components/ui/Badge";
import { cardClass } from "../styles/theme";
import { estadoBadgeClass, progressColor } from "../utils/badges";
import { enviosData, pedidosData } from "../constants/data";
import { getOrders } from "../services/api";

const estadoOptions = ["Preparando", "En tránsito", "Entregado", "Cancelado"];

function TablaEnvios({ envios, pedidoMap, onEdit, onDelete }) {
  return (
    <div className={`${cardClass} overflow-hidden`}>
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-slate-700/50 bg-slate-800/50">
              {[
                "ID Envío",
                "Pedido",
                "Cliente",
                "Transportista",
                "Ruta",
                "Estado",
                "Progreso",
                "ETA",
                "Acciones",
              ].map((h) => (
                <th key={h} className="text-left text-xs text-slate-500 font-medium px-5 py-3">
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {envios.map((e) => {
              const pedidoInfo = pedidoMap.get(e.pedido) || {};
              return (
                <tr
                  key={e.id}
                  className="border-b border-slate-700/30 hover:bg-slate-700/20 transition-colors"
                >
                  <td className="px-5 py-3.5 text-slate-300 font-mono text-xs">{e.id}</td>
                  <td className="px-5 py-3.5 text-blue-400 font-mono text-xs">
                    {pedidoInfo.orderNumber || e.pedido}
                  </td>
                  <td className="px-5 py-3.5 text-slate-300 text-xs">
                    {pedidoInfo.cliente || "—"}
                  </td>
                  <td className="px-5 py-3.5 text-white text-xs">{e.transportista}</td>
                  <td className="px-5 py-3.5">
                    <div className="flex items-center gap-1 text-xs text-slate-400">
                      <MapPin size={11} className="text-slate-500" />
                      {e.origen} → {e.destino}
                    </div>
                  </td>
                  <td className="px-5 py-3.5">
                    <Badge label={e.estado} className={estadoBadgeClass(e.estado)} />
                  </td>
                  <td className="px-5 py-3.5 w-36">
                    <div className="flex items-center gap-2">
                      <div className="flex-1 h-1.5 bg-slate-700 rounded-full overflow-hidden">
                        <div
                          className="h-full rounded-full transition-all"
                          style={{
                            width: `${e.progreso}%`,
                            background: progressColor(e.progreso),
                          }}
                        />
                      </div>
                      <span className="text-xs text-slate-400 w-8">{e.progreso}%</span>
                    </div>
                  </td>
                  <td className="px-5 py-3.5 text-slate-400 text-xs">{e.eta}</td>
                  <td className="px-5 py-3.5">
                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => onEdit(e)}
                        className="inline-flex items-center justify-center h-8 w-8 rounded-lg border border-slate-700 bg-slate-900 text-slate-300 hover:bg-slate-800 hover:text-white transition"
                        title="Editar envío"
                      >
                        <Edit2 size={14} />
                      </button>
                      <button
                        type="button"
                        onClick={() => onDelete(e.id)}
                        className="inline-flex items-center justify-center h-8 w-8 rounded-lg border border-slate-700 bg-slate-900 text-slate-300 hover:bg-red-600 hover:text-white transition"
                        title="Eliminar envío"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default function EnviosPage({ user }) {
  const [pedidos, setPedidos] = useState(pedidosData);
  const pedidoMap = useMemo(
    () => new Map(pedidos.map((pedido) => [pedido.orderNumber || pedido.id, pedido])),
    [pedidos]
  );

  const [envios, setEnvios] = useState([...enviosData]);
  const [editingEnvioId, setEditingEnvioId] = useState(null);
  const [form, setForm] = useState({
    id: `ENV-${Math.floor(100 + Math.random() * 900)}`,
    pedido: "",
    transportista: "",
    origen: "Santiago",
    destino: "Valparaíso",
    estado: "Preparando",
    eta: "",
    progreso: 0,
  });

  useEffect(() => {
    async function loadPedidos() {
      try {
        const response = await getOrders(user);
        setPedidos(Array.isArray(response) && response.length ? response : pedidosData);
      } catch (error) {
        console.warn("No se pudieron cargar pedidos desde backend:", error);
        setPedidos(pedidosData);
      }
    }
    loadPedidos();
  }, [user]);

  useEffect(() => {
    if (!form.pedido && pedidos.length > 0) {
      setForm((current) => ({
        ...current,
        pedido: pedidos[0].orderNumber || pedidos[0].id,
      }));
    }
  }, [pedidos, form.pedido]);

  const stats = useMemo(
    () => [
      { label: "Total envíos", value: envios.length, color: "text-blue-400" },
      { label: "Entregados", value: envios.filter((e) => e.estado === "Entregado").length, color: "text-emerald-400" },
      { label: "En tránsito", value: envios.filter((e) => e.estado === "En tránsito" || e.estado === "Enviado").length, color: "text-slate-400" },
      { label: "Pendientes", value: envios.filter((e) => e.estado === "Preparando").length, color: "text-amber-400" },
    ],
    [envios]
  );

  const handleChange = (key) => (event) => {
    const value = event.target.type === "number" ? Number(event.target.value) : event.target.value;
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const resetForm = () => {
    setEditingEnvioId(null);
    setForm({
      id: `ENV-${Math.floor(100 + Math.random() * 900)}`,
      pedido: pedidos[0]?.orderNumber || pedidosData[0]?.orderNumber || "",
      transportista: "",
      origen: "Santiago",
      destino: "Valparaíso",
      estado: "Preparando",
      eta: "",
      progreso: 0,
    });
  };

  const handleEditEnvio = (envio) => {
    setEditingEnvioId(envio.id);
    setForm({ ...envio });
  };

  const handleDeleteEnvio = (envioId) => {
    setEnvios((prev) => prev.filter((envio) => envio.id !== envioId));
    if (editingEnvioId === envioId) {
      setEditingEnvioId(null);
      resetForm();
    }
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    if (!form.id || !form.pedido || !form.transportista || !form.origen || !form.destino || !form.eta) {
      return;
    }

    if (editingEnvioId) {
      setEnvios((prev) => prev.map((envio) => (envio.id === editingEnvioId ? form : envio)));
      setEditingEnvioId(null);
    } else {
      setEnvios((prev) => [form, ...prev]);
    }

    resetForm();
  };

  return (
    <div className="space-y-5">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold text-white">Gestión de Envíos</h1>
          <p className="text-slate-400 text-sm mt-0.5">{envios.length} envíos registrados</p>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-4 gap-4">
        {stats.map(({ label, value, color }) => (
          <div key={label} className={`${cardClass} p-5`}>
            <div className="text-sm text-slate-400 mb-2">{label}</div>
            <div className={`text-3xl font-bold ${color}`}>{value}</div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-4">
        <div className={`${cardClass} p-5`}>
          <div className="flex items-center justify-between gap-3 mb-5">
            <div>
              <h2 className="text-lg font-semibold text-white">
                {editingEnvioId ? "Editar envío" : "Agregar envío"}
              </h2>
              <p className="text-slate-400 text-sm">Selecciona el pedido y completa los datos de despacho.</p>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 gap-4">
              <label className="block text-slate-300 text-xs font-semibold">
                ID de envío
                <input
                  value={form.id}
                  onChange={handleChange("id")}
                  className="mt-2 w-full rounded-xl border border-slate-700 bg-slate-950 px-3 py-2 text-sm text-white outline-none focus:border-blue-500"
                  placeholder="ENV-XXX"
                />
              </label>

              <label className="block text-slate-300 text-xs font-semibold">
                Pedido asociado
                <select
                  value={form.pedido}
                  onChange={handleChange("pedido")}
                  className="mt-2 w-full rounded-xl border border-slate-700 bg-slate-950 px-3 py-2 text-sm text-white outline-none focus:border-blue-500"
                >
                  {pedidos.map((pedido) => (
                    <option key={pedido.id || pedido.orderNumber} value={pedido.orderNumber || pedido.id}>
                      {pedido.orderNumber || pedido.id} - {pedido.cliente}
                    </option>
                  ))}
                </select>
              </label>

              <label className="block text-slate-300 text-xs font-semibold">
                Transportista
                <input
                  value={form.transportista}
                  onChange={handleChange("transportista")}
                  className="mt-2 w-full rounded-xl border border-slate-700 bg-slate-950 px-3 py-2 text-sm text-white outline-none focus:border-blue-500"
                  placeholder="DHL Chile"
                />
              </label>

              <div className="grid grid-cols-2 gap-4">
                <label className="block text-slate-300 text-xs font-semibold">
                  Origen
                  <input
                    value={form.origen}
                    onChange={handleChange("origen")}
                    className="mt-2 w-full rounded-xl border border-slate-700 bg-slate-950 px-3 py-2 text-sm text-white outline-none focus:border-blue-500"
                    placeholder="Santiago"
                  />
                </label>
                <label className="block text-slate-300 text-xs font-semibold">
                  Destino
                  <input
                    value={form.destino}
                    onChange={handleChange("destino")}
                    className="mt-2 w-full rounded-xl border border-slate-700 bg-slate-950 px-3 py-2 text-sm text-white outline-none focus:border-blue-500"
                    placeholder="Valparaíso"
                  />
                </label>
              </div>

              <label className="block text-slate-300 text-xs font-semibold">
                Estado
                <select
                  value={form.estado}
                  onChange={handleChange("estado")}
                  className="mt-2 w-full rounded-xl border border-slate-700 bg-slate-950 px-3 py-2 text-sm text-white outline-none focus:border-blue-500"
                >
                  {estadoOptions.map((estado) => (
                    <option key={estado} value={estado}>
                      {estado}
                    </option>
                  ))}
                </select>
              </label>

              <label className="block text-slate-300 text-xs font-semibold">
                Progreso (%)
                <input
                  type="number"
                  min="0"
                  max="100"
                  value={form.progreso}
                  onChange={handleChange("progreso")}
                  className="mt-2 w-full rounded-xl border border-slate-700 bg-slate-950 px-3 py-2 text-sm text-white outline-none focus:border-blue-500"
                />
              </label>

              <label className="block text-slate-300 text-xs font-semibold">
                ETA
                <input
                  value={form.eta}
                  onChange={handleChange("eta")}
                  className="mt-2 w-full rounded-xl border border-slate-700 bg-slate-950 px-3 py-2 text-sm text-white outline-none focus:border-blue-500"
                  placeholder="25 May"
                />
              </label>
            </div>

            <button
              type="submit"
              className="inline-flex items-center justify-center rounded-xl bg-blue-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-blue-500"
            >
              {editingEnvioId ? "Guardar cambios" : "Agregar envío"}
            </button>
          </form>
        </div>

        <div className="xl:col-span-2">
          <TablaEnvios envios={envios} pedidoMap={pedidoMap} onEdit={handleEditEnvio} onDelete={handleDeleteEnvio} />
        </div>
      </div>
    </div>
  );
}
