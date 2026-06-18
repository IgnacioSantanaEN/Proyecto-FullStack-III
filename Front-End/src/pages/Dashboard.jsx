import React, { useEffect, useState } from 'react';
import { getOrders, getProducts } from '../services/API';

function Dashboard({ user }) {
  const [metrics, setMetrics] = useState({
    pedidosTotales: 0,
    transitoActivo: 0,
    stockCritico: 0,
    recentOrders: []
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function loadDashboardData() {
      try {
        setLoading(true);
        // Llamada en paralelo a tus dos microservicios mediante el BFF
        const [orders, products] = await Promise.all([
          getOrders(user),
          getProducts(user)
        ]);

        // Procesamos arreglos seguros para evitar fallos si la BD está vacía
        const ordersArr = Array.isArray(orders) ? orders : [];
        const productsArr = Array.isArray(products) ? products : [];

        setMetrics({
          pedidosTotales: ordersArr.length,
          // Filtramos pedidos en tránsito o procesando
          transitoActivo: ordersArr.filter(o => o.estado === 'EN_TRANSITO' || o.estado === 'PROCESANDO').length,
          // Alerta si el producto tiene 5 o menos unidades en inventario
          stockCritico: productsArr.filter(p => p.stock <= 5).length,
          // Tomamos los últimos 4 registros de pedidos para la tabla informativa
          recentOrders: ordersArr.slice(-4).reverse()
        });
      } catch (err) {
        console.error("Error cargando dashboard:", err);
        setError("No se pudo sincronizar el estado operacional con los microservicios.");
      } finally {
        setLoading(false);
      }
    }

    loadDashboardData();
  }, [user]);

  return (
    <div className="space-y-6 animate-fadeIn font-sans">
      
      {/* Encabezado del Módulo */}
      <div>
        <h1 className="text-2xl font-bold text-white tracking-tight">Dashboard de Control</h1>
        <p className="text-sm text-slate-400 mt-0.5">Estado Operacional Consolidado en tiempo real vía BFF</p>
      </div>

      {error && (
        <div className="bg-amber-500/10 border border-amber-500/20 text-amber-400 p-4 rounded-xl text-xs font-mono">
          ⚠️ Sincronización parcial: {error}
        </div>
      )}

      {/* Rejilla de Indicadores (KPI Cards) */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
        
        {/* Card 1: Pedidos Totales */}
        <div className="bg-slate-800 border border-slate-700/70 p-5 rounded-2xl shadow-xl transition-all hover:border-slate-600">
          <div className="flex justify-between items-start">
            <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">Pedidos Totales</p>
            <span className="text-lg">📦</span>
          </div>
          <p className="text-4xl font-extrabold text-cyan-400 mt-2 font-mono">
            {loading ? <span className="animate-pulse">...</span> : metrics.pedidosTotales}
          </p>
          <p className="text-[11px] text-slate-500 mt-1">Registrados en microservicio pedido</p>
        </div>

        {/* Card 2: En Tránsito */}
        <div className="bg-slate-800 border border-slate-700/70 p-5 rounded-2xl shadow-xl transition-all hover:border-slate-600">
          <div className="flex justify-between items-start">
            <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">Tránsito Activo</p>
            <span className="text-lg">🚚</span>
          </div>
          <p className="text-4xl font-extrabold text-amber-400 mt-2 font-mono">
            {loading ? <span className="animate-pulse">...</span> : metrics.transitoActivo}
          </p>
          <p className="text-[11px] text-slate-500 mt-1">Flujo pendiente de entrega</p>
        </div>

        {/* Card 3: Stock Crítico */}
        <div className="bg-slate-800 border border-slate-700/70 p-5 rounded-2xl shadow-xl transition-all hover:border-slate-600">
          <div className="flex justify-between items-start">
            <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">Alertas de Inventario</p>
            <span className="text-lg">⚠️</span>
          </div>
          <p className="text-4xl font-extrabold text-rose-400 mt-2 font-mono">
            {loading ? <span className="animate-pulse">...</span> : metrics.stockCritico}
          </p>
          <p className="text-[11px] text-slate-500 mt-1">Productos con stock ≤ 5 unidades</p>
        </div>

      </div>

      {/* Tabla Inferior: Historial de Transacciones */}
      <div className="bg-slate-800 border border-slate-700/70 rounded-2xl p-6 shadow-2xl">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-md font-bold text-white tracking-tight">Últimas Transacciones del Sistema</h3>
          <span className="text-[10px] uppercase font-mono bg-slate-900 border border-slate-700 text-slate-400 px-2 py-0.5 rounded-md">
            Live Link: BFF 8086
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead>
              <tr className="border-b border-slate-700 text-slate-400 text-xs uppercase tracking-wider">
                <th className="py-2.5 px-3">ID Transacción</th>
                <th className="py-2.5 px-3">Cliente / Destino</th>
                <th className="py-2.5 px-3 text-right">Estado</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-700/40 text-slate-300">
              {loading ? (
                <tr>
                  <td colSpan="3" className="py-6 text-center text-xs text-slate-500 italic animate-pulse">
                    Consultando flujos con el Gateway BFF...
                  </td>
                </tr>
              ) : metrics.recentOrders.length === 0 ? (
                <tr>
                  <td colSpan="3" className="py-6 text-center text-xs text-slate-500 italic">
                    No se registran órdenes activas en el histórico de la base de datos.
                  </td>
                </tr>
              ) : (
                metrics.recentOrders.map((pedido, index) => (
                  <tr key={pedido.id || index} className="hover:bg-slate-700/20 transition-colors">
                    <td className="py-3 px-3 font-mono text-cyan-400 text-xs font-semibold">
                      #{pedido.id || 'N/A'}
                    </td>
                    <td className="py-3 px-3 text-xs font-medium text-slate-200">
                      {pedido.cliente || pedido.destino || 'Corporativo General'}
                    </td>
                    <td className="py-3 px-3 text-right">
                      <span className={`inline-block px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wide ${
                        pedido.estado === 'ENTREGADO' 
                          ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' 
                          : pedido.estado === 'PENDIENTE'
                          ? 'bg-amber-500/10 text-amber-400 border border-amber-500/20'
                          : 'bg-cyan-500/10 text-cyan-400 border border-cyan-500/20'
                      }`}>
                        {pedido.estado || 'PROCESANDO'}
                      </span>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
}

export default Dashboard;