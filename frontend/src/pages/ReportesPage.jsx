// ─────────────────────────────────────────────────────────────
// pages/ReportesPage.jsx
// Resumen de productos y pedidos con vista similar a las secciones de inventario y pedidos.
// ─────────────────────────────────────────────────────────────

import { useEffect, useState } from "react";
import { ShoppingCart, CheckCircle, Clock, XCircle } from "lucide-react";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { cardClass, chartTooltipStyle } from "../styles/theme";
import { getOrders, getProducts } from "../services/api";
import { pedidosData, inventarioData, pedidosDia } from "../constants/data";
import Badge from "../components/ui/Badge";
import { estadoBadgeClass, stockBadgeClass } from "../utils/badges";

export default function ReportesPage({ user }) {
  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      setLoading(true);
      try {
        const [prodData, orderData] = await Promise.all([
          getProducts(user),
          getOrders(user),
        ]);
        setProducts(prodData || inventarioData);
        setOrders(orderData || pedidosData);
      } catch (error) {
        console.warn("Error cargando datos de reportes:", error);
        setProducts(inventarioData);
        setOrders(pedidosData);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [user]);

  const totalStock = products.reduce((sum, item) => sum + Number(item.stock || 0), 0);
  const activeOrders = orders.filter((item) => item.estado !== "Entregado" && item.estado !== "Cancelado").length;

  const stats = [
    { label: "Total productos", value: products.length, icon: ShoppingCart, color: "text-blue-400" },
    { label: "Total pedidos", value: orders.length, icon: CheckCircle, color: "text-emerald-400" },
    { label: "Stock disponible", value: totalStock, icon: Clock, color: "text-amber-400" },
    { label: "Pedidos activos", value: activeOrders, icon: XCircle, color: "text-red-400" },
  ];

  if (loading) {
    return (
      <div className="space-y-5">
        <div className="flex items-center justify-center py-20">
          <p className="text-slate-400">Cargando reportes...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-5">
      <div>
        <h1 className="text-2xl font-bold text-white">Reportes</h1>
        <p className="text-slate-400 text-sm mt-0.5">Resumen de productos y pedidos por usuario</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
        {stats.map(({ label, value, icon: Icon, color }) => (
          <div key={label} className={`${cardClass} p-5`}>
            <div className="flex items-center justify-between mb-3">
              <span className={`text-sm font-medium text-slate-400`}>{label}</span>
              <Icon size={18} className={color} />
            </div>
            <p className="text-3xl font-bold text-white">{value}</p>
          </div>
        ))}
      </div>

      <div className={`${cardClass} p-5`}>
        <div className="flex items-center justify-between mb-4 gap-4 flex-wrap">
          <div>
            <h3 className="text-white font-semibold">Reporte de Productos</h3>
            <p className="text-slate-500 text-sm">Productos visibles para este usuario</p>
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-slate-700/50 bg-slate-800/50">
                {['Producto', 'SKU', 'Categoría', 'Stock', 'Estado'].map((h) => (
                  <th key={h} className="text-left text-xs text-slate-500 font-medium px-5 py-3">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {products.map((item) => (
                <tr key={item.id || item.sku} className="border-b border-slate-700/30 hover:bg-slate-700/20 transition-colors">
                  <td className="px-5 py-3.5 text-white font-medium">{item.producto || item.name}</td>
                  <td className="px-5 py-3.5 text-slate-400 font-mono text-xs">{item.sku}</td>
                  <td className="px-5 py-3.5 text-slate-400 text-xs">{item.categoria || item.categoriaNombre}</td>
                  <td className="px-5 py-3.5 text-white font-semibold">{item.stock}</td>
                  <td className="px-5 py-3.5"><Badge label={item.estado} className={stockBadgeClass(item.estado)} /></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
        <div className={`${cardClass} p-5`}>
          <div className="flex items-center justify-between mb-4 gap-4 flex-wrap">
            <div>
              <h3 className="text-white font-semibold">Ganancias por día</h3>
              <p className="text-slate-500 text-sm">Comparativo diario de ingresos</p>
            </div>
          </div>
          <div className="h-[320px]">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={pedidosDia}>
                <defs>
                  <linearGradient id="gainColor" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#34d399" stopOpacity={0.35} />
                    <stop offset="95%" stopColor="#34d399" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                <XAxis dataKey="dia" tick={{ fill: "#64748b", fontSize: 12 }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fill: "#64748b", fontSize: 12 }} axisLine={false} tickLine={false} tickFormatter={(value) => `$${value / 1000}k`} />
                <Tooltip contentStyle={chartTooltipStyle} formatter={(value) => [`$${value.toLocaleString("es-CL")}`, "Ganancias"]} />
                <Area type="monotone" dataKey="ganancias" stroke="#34d399" fillOpacity={1} fill="url(#gainColor)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className={`${cardClass} p-5`}>
          <div className="flex items-center justify-between mb-4 gap-4 flex-wrap">
            <div>
              <h3 className="text-white font-semibold">Reporte de Pedidos</h3>
              <p className="text-slate-500 text-sm">Pedidos visibles para este usuario</p>
            </div>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-slate-700/50 bg-slate-800/50">
                  {['Pedido', 'Cliente', 'Items', 'Estado', 'Fecha', 'Monto'].map((h) => (
                    <th key={h} className="text-left text-xs text-slate-500 font-medium px-5 py-3">
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {orders.map((item) => (
                  <tr key={item.id} className="border-b border-slate-700/30 hover:bg-slate-700/20 transition-colors">
                    <td className="px-5 py-3.5 text-blue-400 font-mono text-xs font-semibold">{item.orderNumber || item.id}</td>
                    <td className="px-5 py-3.5 text-white">{item.cliente}</td>
                    <td className="px-5 py-3.5 text-slate-400">{item.items}</td>
                    <td className="px-5 py-3.5"><Badge label={item.estado} className={estadoBadgeClass(item.estado)} /></td>
                    <td className="px-5 py-3.5 text-slate-400 text-xs">{item.fecha}</td>
                    <td className="px-5 py-3.5 text-white font-semibold">{item.monto}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
