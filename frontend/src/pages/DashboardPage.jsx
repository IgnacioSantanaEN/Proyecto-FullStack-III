// ─────────────────────────────────────────────────────────────
// pages/DashboardPage.jsx
// Vista principal del panel. Muestra KPIs, gráficos y
// una tabla de pedidos recientes.
// ─────────────────────────────────────────────────────────────

import {
  ShoppingCart, Package, Truck, CheckCircle, RefreshCw, ChevronRight,
} from "lucide-react";
import {
  AreaChart, Area, BarChart, Bar, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
} from "recharts";

import StatCard from "../components/ui/StatCard";
import Badge    from "../components/ui/Badge";
import { cardClass, chartTooltipStyle } from "../styles/theme";
import { estadoBadgeClass }             from "../utils/badges";
import { useEffect, useState } from "react";
import { getOrders, getProducts } from "../services/api";
import ServerBanner from "../components/ui/ServerBanner";

// ── Subcomponente: gráfico de área (Pedidos y Envíos) ─────────
function ChartPedidosSemana({ pedidosDia = [] }) {
  return (
    <div className={`${cardClass} p-5 lg:col-span-2`}>
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-white font-semibold">Pedidos y Envíos</h3>
          <p className="text-slate-500 text-xs">Última semana</p>
        </div>
        <div className="flex items-center gap-3 text-xs text-slate-500">
          <span className="flex items-center gap-1">
            <span className="w-2 h-2 rounded-full bg-blue-500 inline-block" /> Pedidos
          </span>
          <span className="flex items-center gap-1">
            <span className="w-2 h-2 rounded-full bg-emerald-500 inline-block" /> Envíos
          </span>
        </div>
      </div>
      <ResponsiveContainer width="100%" height={200}>
        <AreaChart data={pedidosDia}>
          <defs>
            <linearGradient id="gPedidos" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%"  stopColor="#3b82f6" stopOpacity={0.3} />
              <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
            </linearGradient>
            <linearGradient id="gEnvios" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%"  stopColor="#22c55e" stopOpacity={0.3} />
              <stop offset="95%" stopColor="#22c55e" stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
          <XAxis dataKey="dia"  tick={{ fill: "#64748b", fontSize: 12 }} axisLine={false} tickLine={false} />
          <YAxis                tick={{ fill: "#64748b", fontSize: 12 }} axisLine={false} tickLine={false} />
          <Tooltip contentStyle={chartTooltipStyle} />
          <Area type="monotone" dataKey="pedidos" stroke="#3b82f6" fill="url(#gPedidos)" strokeWidth={2} name="Pedidos" />
          <Area type="monotone" dataKey="envios"  stroke="#22c55e" fill="url(#gEnvios)"  strokeWidth={2} name="Envíos" />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}

// ── Subcomponente: donut de estado de envíos ──────────────────
function ChartEstadoEnvios({ estadoEnviosPie = [] }) {
  return (
    <div className={`${cardClass} p-5`}>
      <h3 className="text-white font-semibold mb-1">Estado Envíos</h3>
      <p className="text-slate-500 text-xs mb-4">Distribución actual</p>
      <ResponsiveContainer width="100%" height={160}>
        <PieChart>
          <Pie
            data={estadoEnviosPie}
            cx="50%" cy="50%"
            innerRadius={45} outerRadius={70}
            paddingAngle={3} dataKey="value"
          >
            {estadoEnviosPie.map((entry, i) => (
              <Cell key={i} fill={entry.color} />
            ))}
          </Pie>
          <Tooltip contentStyle={chartTooltipStyle} />
        </PieChart>
      </ResponsiveContainer>
      <div className="space-y-1.5 mt-2">
        {estadoEnviosPie.map((e) => (
          <div key={e.name} className="flex items-center justify-between text-xs">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full" style={{ background: e.color }} />
              <span className="text-slate-400">{e.name}</span>
            </div>
            <span className="text-white font-semibold">{e.value}%</span>
          </div>
        ))}
      </div>
    </div>
  );
}

// ── Subcomponente: gráfico de barras mensual ──────────────────
function ChartCrecimientoMensual({ crecimientoMensual = [] }) {
  return (
    <div className={`${cardClass} p-5`}>
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-white font-semibold">Crecimiento Mensual</h3>
          <p className="text-slate-500 text-xs">Ingresos 2026</p>
        </div>
        <span className="text-xs px-2 py-1 bg-emerald-500/15 text-emerald-400
                         rounded-lg border border-emerald-500/30">
          +23% YTD
        </span>
      </div>
      <ResponsiveContainer width="100%" height={160}>
        <BarChart data={crecimientoMensual} barSize={32}>
          <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
          <XAxis dataKey="mes" tick={{ fill: "#64748b", fontSize: 12 }} axisLine={false} tickLine={false} />
          <YAxis
            tick={{ fill: "#64748b", fontSize: 12 }} axisLine={false} tickLine={false}
            tickFormatter={(v) => `$${(v / 1000).toFixed(0)}k`}
          />
          <Tooltip
            contentStyle={chartTooltipStyle}
            formatter={(v) => [`$${v.toLocaleString("es-CL")}`, "Ingresos"]}
          />
          <Bar dataKey="ingresos" fill="#3b82f6" radius={[6, 6, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}

// ── Subcomponente: tabla de pedidos recientes ─────────────────
function TablaPedidosRecientes({ pedidos = [], loading = false, error = null }) {
  return (
    <div className={`${cardClass} p-5`}>
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-white font-semibold">Pedidos Recientes</h3>
        <button className="text-xs text-blue-400 hover:text-blue-300
                           flex items-center gap-1 transition-colors">
          Ver todos <ChevronRight size={13} />
        </button>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-slate-700/50">
              {["Pedido", "Cliente", "Estado", "Fecha", "Monto"].map((h) => (
                <th key={h} className="text-left text-xs text-slate-500 font-medium pb-3 pr-4">
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {loading && (
              <tr><td colSpan={5} className="py-6 text-center text-slate-400">Cargando pedidos...</td></tr>
            )}
            {!loading && error && (
              <tr><td colSpan={5} className="py-6 text-center text-rose-400">Error: {String(error)}</td></tr>
            )}
            {!loading && !error && pedidos.slice(0, 5).map((p) => {
              const id = p.id || p._id || p.codigo || "-";
              const cliente = p.cliente || (p.usuario && (p.usuario.nombre || p.usuario.name)) || p.customer || "-";
              const estado = p.estado || p.status || p.state || "Desconocido";
              const fecha = p.fecha || p.createdAt || p.date || "-";
              const monto = p.monto || p.total || p.amount || "-";
              return (
                <tr key={id} className="border-b border-slate-700/30 hover:bg-slate-700/20 transition-colors">
                  <td className="py-3 pr-4 text-blue-400 font-mono text-xs font-medium">{id}</td>
                  <td className="py-3 pr-4 text-white">{cliente}</td>
                  <td className="py-3 pr-4">
                    <Badge label={estado} className={estadoBadgeClass(estado)} />
                  </td>
                  <td className="py-3 pr-4 text-slate-400 text-xs">{new Date(fecha).toLocaleString()}</td>
                  <td className="py-3 text-white font-medium">{typeof monto === 'number' ? `$${monto}` : monto}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}

// ── Página principal ──────────────────────────────────────────
export default function DashboardPage() {
  const [pedidos, setPedidos] = useState([]);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showServerError, setShowServerError] = useState(true);

  async function fetchData() {
    setLoading(true);
    try {
      const [o, p] = await Promise.all([getOrders(), getProducts()]);
      setPedidos(Array.isArray(o) ? o : (o.content || []));
      setProducts(Array.isArray(p) ? p : (p.content || []));
      setError(null);
    } catch (err) {
      setError(err.message || String(err));
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    let mounted = true;
    if (mounted) fetchData();
    return () => { mounted = false; };
  }, []);

  // Helpers para agregados simples
  const safeDate = (d) => {
    const date = d ? new Date(d) : null;
    return date && !isNaN(date) ? date : null;
  };

  const pedidosHoy = pedidos.filter((o) => {
    const dt = safeDate(o.fecha || o.createdAt || o.date);
    if (!dt) return false;
    const today = new Date();
    return dt.toDateString() === today.toDateString();
  }).length;

  const stockBajo = products.filter((prod) => {
    const stock = prod.stock ?? prod.cantidad ?? prod.quantity ?? 0;
    return typeof stock === 'number' && stock <= 5;
  }).length;

  const enviosActivos = pedidos.filter((o) => {
    const st = (o.estado || o.status || "").toString().toLowerCase();
    return st.includes("en") || st.includes("transito") || st.includes("shipping") || st.includes("sent") || st.includes("shipped");
  }).length;

  const entregasHoy = pedidos.filter((o) => {
    const st = (o.estado || o.status || "").toString().toLowerCase();
    const dt = safeDate(o.fechaEntrega || o.entregadoEn || o.deliveryDate || o.date);
    if (!dt) return false;
    const today = new Date();
    return dt.toDateString() === today.toDateString() || st.includes("delivered") || st.includes("entregado");
  }).length;

  // Agregaciones para gráficos (sencillas)
  const pedidosDia = (() => {
    const days = Array.from({ length: 7 }).map((_, i) => {
      const d = new Date();
      d.setDate(d.getDate() - (6 - i));
      return { dia: d.toLocaleDateString(), pedidos: 0, envios: 0 };
    });
    pedidos.forEach((o) => {
      const dt = safeDate(o.fecha || o.createdAt || o.date);
      if (!dt) return;
      const idx = days.findIndex((day) => new Date(day.dia).toDateString() === dt.toDateString());
      if (idx >= 0) {
        days[idx].pedidos += 1;
        const st = (o.estado || o.status || "").toString().toLowerCase();
        if (st.includes("en") || st.includes("transito") || st.includes("shipped")) days[idx].envios += 1;
      }
    });
    return days;
  })();

  const estadoEnviosPie = (() => {
    const counts = {};
    pedidos.forEach((o) => {
      const st = (o.estado || o.status || "Desconocido").toString();
      counts[st] = (counts[st] || 0) + 1;
    });
    const colors = ["#22c55e", "#3b82f6", "#f97316", "#ef4444", "#a78bfa"];
    return Object.keys(counts).map((k, i) => ({ name: k, value: Math.round((counts[k] / Math.max(1, pedidos.length)) * 100), color: colors[i % colors.length] }));
  })();

  const crecimientoMensual = (() => {
    const byMonth = Array.from({ length: 12 }).map((_, i) => ({ mes: new Date(0, i).toLocaleString(undefined, { month: 'short' }), ingresos: 0 }));
    pedidos.forEach((o) => {
      const dt = safeDate(o.fecha || o.createdAt || o.date);
      const monto = Number(o.total ?? o.monto ?? o.amount ?? 0) || 0;
      if (!dt) return;
      const m = dt.getMonth();
      byMonth[m].ingresos += monto;
    });
    return byMonth;
  })();

  const isConnectionError = error && /conexi[oó]n|No se puede conectar|Failed to fetch|ECONNREFUSED|NetworkError/i.test(error);

  const handleRetry = () => {
    setShowServerError(true);
    fetchData();
  };

  return (
    <div className="space-y-6">
      {/* Encabezado */}
      <div>
        <h1 className="text-2xl font-bold text-white">Hola, Administrador 👋</h1>
        <p className="text-slate-400 mt-1 text-sm">
          Resumen de operaciones logísticas — Viernes 22 Mayo 2026
        </p>
      </div>

      <ServerBanner
        error={error}
        visible={isConnectionError && showServerError}
        onClose={() => setShowServerError(false)}
        onRetry={handleRetry}
      />

      {/* KPI Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard icon={ShoppingCart} label="Pedidos hoy"    value={String(pedidosHoy)} delta={0}  color="bg-blue-600"   sub="vs. día anterior" />
        <StatCard icon={Package}      label="Stock bajo"     value={String(stockBajo)}  delta={0}  color="bg-amber-500"  sub="productos en alerta (<=5)" />
        <StatCard icon={Truck}        label="Envíos activos" value={String(enviosActivos)}  delta={0}   color="bg-violet-600" sub="en tránsito ahora" />
        <StatCard icon={CheckCircle}  label="Entregas hoy"   value={String(entregasHoy)}  delta={0}  color="bg-emerald-600" sub="completadas" />
      </div>

      {/* Gráficos superiores */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <ChartPedidosSemana pedidosDia={pedidosDia} />
        <ChartEstadoEnvios estadoEnviosPie={estadoEnviosPie} />
      </div>

      {/* Gráfico de crecimiento */}
      <ChartCrecimientoMensual crecimientoMensual={crecimientoMensual} />

      {/* Tabla de pedidos */}
      <TablaPedidosRecientes pedidos={pedidos} loading={loading} error={error} />
    </div>
  );
}
