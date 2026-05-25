// ─────────────────────────────────────────────────────────────
// pages/PedidosPage.jsx
// Gestión de pedidos con filtro por estado.
// ─────────────────────────────────────────────────────────────

import { useEffect, useState } from "react";
import { Plus, Eye, Edit2, X } from "lucide-react";
import Badge from "../components/ui/Badge";
import { cardClass, btnPrimary, inputClass } from "../styles/theme";
import { estadoBadgeClass } from "../utils/badges";
import { pedidosData } from "../constants/data";
import { createOrder, getOrders } from "../services/api";

const ESTADOS = ["todos", "Pendiente", "Enviado", "Entregado", "Cancelado"];

export default function PedidosPage({ user }) {
  const [filtro, setFiltro] = useState("todos");
  const [pedidos, setPedidos] = useState([]);
  const [isCreating, setIsCreating] = useState(false);
  const [isViewingOrEditing, setIsViewingOrEditing] = useState(false);
  const [editingMode, setEditingMode] = useState("view"); // "view" | "edit"
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [formError, setFormError] = useState("");
  const [newOrder, setNewOrder] = useState({
    orderNumber: "",
    cliente: "",
    estado: "Pendiente",
    fecha: "",
    monto: "",
    items: "",
  });

  useEffect(() => {
    loadPedidos();
  }, [user]);

  async function loadPedidos() {
    try {
      const response = await getOrders(user);
      setPedidos(response);
    } catch (error) {
      console.warn("No se pudo cargar pedidos desde backend", error);
      setPedidos(pedidosData);
    }
  }

  const filtered =
    filtro === "todos"
      ? pedidos
      : pedidos.filter((p) => p.estado === filtro);

  function handleNewOrderChange(field, value) {
    setNewOrder((current) => ({ ...current, [field]: value }));
  }

  function openNewOrder() {
    setFormError("");
    setNewOrder({
      orderNumber: `PED-${Date.now().toString().slice(-6)}`,
      cliente: "",
      estado: "Pendiente",
      fecha: new Date().toISOString().slice(0, 10),
      monto: "",
      items: "1",
    });
    setIsCreating(true);
  }

  function closeNewOrder() {
    setIsCreating(false);
    setFormError("");
  }

  function openViewOrder(order) {
    setSelectedOrder(order);
    setEditingMode("view");
    setFormError("");
    setIsViewingOrEditing(true);
  }

  function openEditOrder(order) {
    setSelectedOrder(order);
    setEditingMode("edit");
    setFormError("");
    setIsViewingOrEditing(true);
  }

  function closeViewOrEdit() {
    setIsViewingOrEditing(false);
    setSelectedOrder(null);
    setFormError("");
  }

  async function handleCreateOrder(event) {
    event?.preventDefault();
    const { orderNumber, cliente, estado, fecha, monto, items } = newOrder;
    if (!orderNumber || !cliente.trim() || !estado || !fecha || !monto.trim() || !items.trim()) {
      setFormError("Completa todos los campos para crear el pedido.");
      return;
    }

    const itemCount = Number(items);
    if (Number.isNaN(itemCount) || itemCount < 1) {
      setFormError("La cantidad de items debe ser un número válido mayor a 0.");
      return;
    }

    try {
      const payload = {
        orderNumber: orderNumber.trim(),
        cliente: cliente.trim(),
        estado,
        fecha,
        monto: monto.trim(),
        items: itemCount,
      };
      const created = await createOrder(payload, user);
      setPedidos((current) => [created, ...current]);
      closeNewOrder();
    } catch (error) {
      console.error(error);
      setFormError("No se pudo crear el pedido. Intenta nuevamente.");
    }
  }

  async function handleSaveEditOrder(event) {
    event?.preventDefault();
    if (!selectedOrder || !selectedOrder.cliente?.trim() || !selectedOrder.estado || !selectedOrder.fecha || !selectedOrder.monto?.trim()) {
      setFormError("Completa todos los campos.");
      return;
    }

    const itemCount = Number(selectedOrder.items);
    if (Number.isNaN(itemCount) || itemCount < 1) {
      setFormError("La cantidad de items debe ser un número válido mayor a 0.");
      return;
    }

    try {
      // Actualizar el pedido en la lista local
      setPedidos((current) =>
        current.map((p) =>
          p.id === selectedOrder.id ? selectedOrder : p
        )
      );
      closeViewOrEdit();
    } catch (error) {
      console.error(error);
      setFormError("No se pudo actualizar el pedido. Intenta nuevamente.");
    }
  }

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">Gestión de Pedidos</h1>
          <p className="text-slate-400 text-sm mt-0.5">
            {pedidos.length} pedidos en total
          </p>
        </div>
        <button className={btnPrimary} onClick={openNewOrder}>
          <Plus size={16} /> Nuevo Pedido
        </button>
      </div>

      <div className="flex gap-2 flex-wrap">
        {ESTADOS.map((e) => (
          <button
            key={e}
            onClick={() => setFiltro(e)}
            className={`text-sm px-3 py-2 rounded-xl border transition-colors capitalize
              ${filtro === e
                ? "bg-blue-600 border-blue-600 text-white"
                : "border-slate-700 text-slate-400 hover:text-white hover:border-slate-600"}`}
          >
            {e === "todos" ? "Todos" : e}
          </button>
        ))}
      </div>

      <div className={`${cardClass} overflow-hidden`}>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-slate-700/50 bg-slate-800/50">
                {["Pedido", "Cliente", "Items", "Estado", "Fecha", "Monto", "Acciones"].map((h) => (
                  <th key={h} className="text-left text-xs text-slate-500 font-medium px-5 py-3">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.map((p) => (
                <tr
                  key={p.id}
                  className="border-b border-slate-700/30 hover:bg-slate-700/20 transition-colors"
                >
                  <td className="px-5 py-3.5 text-blue-400 font-mono text-xs font-semibold">
                    {p.orderNumber || p.id}
                  </td>
                  <td className="px-5 py-3.5 text-white">{p.cliente}</td>
                  <td className="px-5 py-3.5 text-slate-400">
                    {p.items} artículo{p.items > 1 ? "s" : ""}
                  </td>
                  <td className="px-5 py-3.5">
                    <Badge label={p.estado} className={estadoBadgeClass(p.estado)} />
                  </td>
                  <td className="px-5 py-3.5 text-slate-400 text-xs">{p.fecha}</td>
                  <td className="px-5 py-3.5 text-white font-semibold">{p.monto}</td>
                  <td className="px-5 py-3.5">
                    <div className="flex items-center gap-2">
                      <button onClick={() => openViewOrder(p)} className="p-1.5 text-slate-500 hover:text-blue-400 hover:bg-blue-400/10 rounded-lg transition-colors" title="Ver detalles">
                        <Eye size={14} />
                      </button>
                      <button onClick={() => openEditOrder(p)} className="p-1.5 text-slate-500 hover:text-slate-300 hover:bg-slate-700 rounded-lg transition-colors" title="Editar pedido">
                        <Edit2 size={14} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {isCreating && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 p-4">
          <div className={`${cardClass} w-full max-w-2xl p-6 relative`}>
            <button
              onClick={closeNewOrder}
              className="absolute top-4 right-4 text-slate-500 hover:text-white p-2 rounded-lg transition-colors"
              aria-label="Cerrar formulario"
            >
              <X size={18} />
            </button>

            <div className="mb-4">
              <h2 className="text-xl font-semibold text-white">Crear nuevo pedido</h2>
              <p className="text-slate-500 text-sm mt-1">Registra un nuevo pedido y envíalo al backend.</p>
            </div>

            <form onSubmit={handleCreateOrder} className="grid gap-4 sm:grid-cols-2">
              <label className="space-y-2 text-sm text-slate-300">
                Número de pedido
                <input
                  value={newOrder.orderNumber}
                  readOnly
                  className={`${inputClass} bg-slate-900 cursor-not-allowed`}
                />
              </label>
              <label className="space-y-2 text-sm text-slate-300">
                Cliente
                <input
                  value={newOrder.cliente}
                  onChange={(e) => handleNewOrderChange("cliente", e.target.value)}
                  className={inputClass}
                  placeholder="Nombre del cliente"
                />
              </label>
              <label className="space-y-2 text-sm text-slate-300">
                Estado
                <select
                  value={newOrder.estado}
                  onChange={(e) => handleNewOrderChange("estado", e.target.value)}
                  className={inputClass}
                >
                  {ESTADOS.filter((estado) => estado !== "todos").map((estado) => (
                    <option key={estado} value={estado}>{estado}</option>
                  ))}
                </select>
              </label>
              <label className="space-y-2 text-sm text-slate-300">
                Fecha
                <input
                  type="date"
                  value={newOrder.fecha}
                  onChange={(e) => handleNewOrderChange("fecha", e.target.value)}
                  className={inputClass}
                />
              </label>
              <label className="space-y-2 text-sm text-slate-300">
                Monto
                <input
                  value={newOrder.monto}
                  onChange={(e) => handleNewOrderChange("monto", e.target.value)}
                  className={inputClass}
                  placeholder="250.00"
                />
              </label>
              <label className="space-y-2 text-sm text-slate-300">
                Items
                <input
                  value={newOrder.items}
                  onChange={(e) => handleNewOrderChange("items", e.target.value)}
                  className={inputClass}
                  type="number"
                  min="1"
                  placeholder="Número de artículos"
                />
              </label>

              {formError && (
                <div className="sm:col-span-2 bg-red-500/10 border border-red-500/30 text-red-300 text-sm px-4 py-3 rounded-xl">
                  {formError}
                </div>
              )}

              <div className="sm:col-span-2 flex flex-col gap-3 sm:flex-row sm:justify-end">
                <button
                  type="button"
                  onClick={closeNewOrder}
                  className="w-full sm:w-auto px-4 py-2 rounded-xl border border-slate-700 text-slate-300 hover:text-white hover:border-slate-500 transition-colors"
                >
                  Cancelar
                </button>
                <button type="submit" className={`${btnPrimary} w-full sm:w-auto justify-center`}>
                  Crear pedido
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {isViewingOrEditing && selectedOrder && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 p-4">
          <div className={`${cardClass} w-full max-w-2xl p-6 relative`}>
            <button
              onClick={closeViewOrEdit}
              className="absolute top-4 right-4 text-slate-500 hover:text-white p-2 rounded-lg transition-colors"
              aria-label="Cerrar"
            >
              <X size={18} />
            </button>

            <div className="mb-4">
              <h2 className="text-xl font-semibold text-white">
                {editingMode === "view" ? "Detalles del Pedido" : "Editar Pedido"}
              </h2>
              <p className="text-slate-500 text-sm mt-1">
                {editingMode === "view" 
                  ? "Información del pedido" 
                  : "Modifica los datos del pedido y guarda los cambios"}
              </p>
            </div>

            <form onSubmit={editingMode === "view" ? undefined : handleSaveEditOrder} className="grid gap-4 sm:grid-cols-2">
              <label className="space-y-2 text-sm text-slate-300">
                Número de pedido
                <input
                  value={selectedOrder.orderNumber || selectedOrder.id}
                  readOnly
                  className={`${inputClass} bg-slate-900 cursor-not-allowed`}
                />
              </label>
              <label className="space-y-2 text-sm text-slate-300">
                Cliente
                <input
                  value={selectedOrder.cliente}
                  onChange={(e) => editingMode === "edit" && setSelectedOrder({...selectedOrder, cliente: e.target.value})}
                  readOnly={editingMode === "view"}
                  className={`${inputClass} ${editingMode === "view" ? "bg-slate-900 cursor-not-allowed" : ""}`}
                  placeholder="Nombre del cliente"
                />
              </label>
              <label className="space-y-2 text-sm text-slate-300">
                Estado
                <select
                  value={selectedOrder.estado}
                  onChange={(e) => editingMode === "edit" && setSelectedOrder({...selectedOrder, estado: e.target.value})}
                  disabled={editingMode === "view"}
                  className={`${inputClass} ${editingMode === "view" ? "bg-slate-900 cursor-not-allowed" : ""}`}
                >
                  {ESTADOS.filter((estado) => estado !== "todos").map((estado) => (
                    <option key={estado} value={estado}>{estado}</option>
                  ))}
                </select>
              </label>
              <label className="space-y-2 text-sm text-slate-300">
                Fecha
                <input
                  type="date"
                  value={selectedOrder.fecha}
                  onChange={(e) => editingMode === "edit" && setSelectedOrder({...selectedOrder, fecha: e.target.value})}
                  readOnly={editingMode === "view"}
                  className={`${inputClass} ${editingMode === "view" ? "bg-slate-900 cursor-not-allowed" : ""}`}
                />
              </label>
              <label className="space-y-2 text-sm text-slate-300">
                Monto
                <input
                  value={selectedOrder.monto}
                  onChange={(e) => editingMode === "edit" && setSelectedOrder({...selectedOrder, monto: e.target.value})}
                  readOnly={editingMode === "view"}
                  className={`${inputClass} ${editingMode === "view" ? "bg-slate-900 cursor-not-allowed" : ""}`}
                  placeholder="250.00"
                />
              </label>
              <label className="space-y-2 text-sm text-slate-300">
                Items
                <input
                  value={selectedOrder.items}
                  onChange={(e) => editingMode === "edit" && setSelectedOrder({...selectedOrder, items: e.target.value})}
                  readOnly={editingMode === "view"}
                  className={`${inputClass} ${editingMode === "view" ? "bg-slate-900 cursor-not-allowed" : ""}`}
                  type="number"
                  min="1"
                  placeholder="Número de artículos"
                />
              </label>

              {formError && (
                <div className="sm:col-span-2 bg-red-500/10 border border-red-500/30 text-red-300 text-sm px-4 py-3 rounded-xl">
                  {formError}
                </div>
              )}

              <div className="sm:col-span-2 flex flex-col gap-3 sm:flex-row sm:justify-end">
                <button
                  type="button"
                  onClick={closeViewOrEdit}
                  className="w-full sm:w-auto px-4 py-2 rounded-xl border border-slate-700 text-slate-300 hover:text-white hover:border-slate-500 transition-colors"
                >
                  {editingMode === "view" ? "Cerrar" : "Cancelar"}
                </button>
                {editingMode === "edit" && (
                  <button type="submit" className={`${btnPrimary} w-full sm:w-auto justify-center`}>
                    Guardar cambios
                  </button>
                )}
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
