// ─────────────────────────────────────────────────────────────
// constants/data.js
// Datos mock centralizados. En producción estos vendrían
// de llamadas a la API (ej: axios.get('/api/pedidos')).
// ─────────────────────────────────────────────────────────────

export const pedidosDia = [
  { dia: "Lun", pedidos: 42, envios: 35, ganancias: 1240000 },
  { dia: "Mar", pedidos: 58, envios: 50, ganancias: 980000 },
  { dia: "Mié", pedidos: 47, envios: 44, ganancias: 760000 },
  { dia: "Jue", pedidos: 73, envios: 68, ganancias: 1430000 },
  { dia: "Vie", pedidos: 91, envios: 85, ganancias: 1920000 },
  { dia: "Sáb", pedidos: 64, envios: 60, ganancias: 1120000 },
  { dia: "Dom", pedidos: 38, envios: 30, ganancias: 540000 },
];

export const crecimientoMensual = [
  { mes: "Ene", ingresos: 48000 },
  { mes: "Feb", ingresos: 52000 },
  { mes: "Mar", ingresos: 61000 },
  { mes: "Abr", ingresos: 58000 },
  { mes: "May", ingresos: 74000 },
  { mes: "Jun", ingresos: 69000 },
];

export const estadoEnviosPie = [
  { name: "Entregados",  value: 58, color: "#22c55e" },
  { name: "En tránsito", value: 27, color: "#3b82f6" },
  { name: "Pendientes",  value: 10, color: "#f59e0b" },
  { name: "Cancelados",  value: 5,  color: "#ef4444" },
];

export const inventarioData = [];

export const pedidosData = [
  { id: "#PED-0891", orderNumber: "PED-0891", cliente: "Tech Solutions SpA",   estado: "Entregado", fecha: "22 May 2026", monto: "$1.240.000", items: 3 },
  { id: "#PED-0890", orderNumber: "PED-0890", cliente: "Distribuidora Norte",  estado: "Enviado",   fecha: "22 May 2026", monto: "$456.000",   items: 1 },
  { id: "#PED-0889", orderNumber: "PED-0889", cliente: "Oficinas Modernas",    estado: "Pendiente", fecha: "21 May 2026", monto: "$892.000",   items: 5 },
  { id: "#PED-0888", orderNumber: "PED-0888", cliente: "Import Express Ltda",  estado: "Enviado",   fecha: "21 May 2026", monto: "$334.000",   items: 2 },
  { id: "#PED-0887", orderNumber: "PED-0887", cliente: "MegaStore SRL",        estado: "Cancelado", fecha: "20 May 2026", monto: "$1.100.000", items: 4 },
  { id: "#PED-0886", orderNumber: "PED-0886", cliente: "Grupo Retail Chile",   estado: "Entregado", fecha: "20 May 2026", monto: "$678.000",   items: 2 },
  { id: "#PED-0885", orderNumber: "PED-0885", cliente: "StartupHub Co.",       estado: "Pendiente", fecha: "19 May 2026", monto: "$234.000",   items: 1 },
  { id: "#PED-0884", orderNumber: "PED-0884", cliente: "LogiPyme SpA",         estado: "Entregado", fecha: "19 May 2026", monto: "$956.000",   items: 6 },
];

export const enviosData = [
  { id: "ENV-441", pedido: "PED-0890", transportista: "Starken Express", origen: "Santiago", destino: "Valparaíso",  estado: "En tránsito", eta: "23 May", progreso: 65  },
  { id: "ENV-440", pedido: "PED-0888", transportista: "Chilexpress",     origen: "Santiago", destino: "Concepción",  estado: "En tránsito", eta: "24 May", progreso: 40  },
  { id: "ENV-439", pedido: "PED-0891", transportista: "DHL Chile",       origen: "Santiago", destino: "Santiago",    estado: "Entregado",   eta: "22 May", progreso: 100 },
  { id: "ENV-438", pedido: "PED-0886", transportista: "Starken Express", origen: "Santiago", destino: "Antofagasta", estado: "Entregado",   eta: "20 May", progreso: 100 },
  { id: "ENV-437", pedido: "PED-0884", transportista: "DHL Chile",       origen: "Santiago", destino: "La Serena",   estado: "Entregado",   eta: "19 May", progreso: 100 },
  { id: "ENV-436", pedido: "PED-0889", transportista: "Chilexpress",     origen: "Santiago", destino: "Temuco",      estado: "Preparando",  eta: "25 May", progreso: 10  },
];

export const navItems = [
  { id: "dashboard",  label: "Dashboard",      icon: "LayoutDashboard" },
  { id: "inventario", label: "Inventario",     icon: "Package" },
  { id: "pedidos",    label: "Pedidos",        icon: "ShoppingCart",   badge: 5 },
  { id: "envios",     label: "Envíos",         icon: "Truck" },
  { id: "reportes",   label: "Reportes",       icon: "BarChart3" },
  { id: "config",     label: "Configuración",  icon: "Settings" },
];
