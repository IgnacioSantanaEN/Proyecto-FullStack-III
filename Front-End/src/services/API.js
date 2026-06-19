import axios from 'axios';

const API_BASE_URL = 'http://localhost:8086/api/bff';

const API = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Función interna para construir parámetros de consulta de forma limpia
function buildUserQuery(user) {
  if (!user) return "";
  const params = new URLSearchParams();
  if (user.id != null) params.set("userId", String(user.id));
  if (user.role) params.set("role", user.role);
  return params.toString() ? `?${params.toString()}` : "";
}

// ========================================
// ========== MÉTODOS DE AUTENTICACIÓN ====
// ========================================

// Iniciar sesión en el sistema a través del BFF
export async function loginUser(credentials) {
  const payload = {
    email: credentials.email,
    username: credentials.email,
    password: credentials.password // Mapea directo al atributo de Java con @Column
  };

  // POST exacto a la ruta de autenticación del Swagger
  const { data } = await API.post('/usuario/auth/login', payload); 
  
  // Aseguramos que el objeto tenga las propiedades mapeadas para React
  if (data) {
    data.role = data.role || data.rol || 'USUARIO';
    data.rol = data.role;
  }
  
  return data;
}

// ========================================
// ========== MÉTODOS DE USUARIO ==========
// ========================================

// Obtener la lista completa de usuarios
export async function getUsers() {
  const { data } = await API.get('/usuario');
  return data;
}

// Registrar un nuevo usuario u operador
export async function registerUser(userData) {
  // Construimos el JSON usando estrictamente las claves que dictamina tu Swagger
  const payload = {
    name: userData.nombre || userData.name,       // 🌟 Cambiado a 'name'
    email: userData.email,
    password: userData.password,
    role: (userData.rol || userData.role || 'USUARIO').toUpperCase() // 🌟 Cambiado a 'role' en MAYÚSCULAS
  };

  const { data } = await API.post('/usuario', payload);
  return data;
}

// Obtener los detalles de un usuario específico por ID
export async function getUserById(id) {
  const { data } = await API.get(`/usuario/${id}`);
  return data;
}

// Actualizar los datos de un usuario existente
export async function updateUser(id, userData) {
  const { data } = await API.put(`/usuario/${id}`, userData);
  return data;
}

// Eliminar un usuario del sistema por ID
export async function deleteUser(id) {
  const { data } = await API.delete(`/usuario/${id}`);
  return data;
}

// Comprobar la salud del microservicio de usuario a través del BFF
export async function checkUsuarioHealth() {
  try {
    // Apuntamos al endpoint que responde con el listado o un ping rápido
    await API.get('/usuario');
    return true; // Si responde exitosamente, la conexión está viva
  } catch (error) {
    return false; // Si da 500, 404 o error de red, está caído
  }
}

// ========================================
// ========== MÉTODOS DE PRODUCTO =========
// ========================================

// Obtener el listado de todos los productos (aplica filtros de rol si es necesario)
export async function getProducts(user) {
  const query = buildUserQuery(user);
  const { data } = await API.get(`/productos${query}`);
  return data;
}

// Crear un nuevo producto en el catálogo
export async function createProduct(productData) {
  const { data } = await API.post('/productos', productData);
  return data;
}

// Actualizar las propiedades de un producto existente por su ID
export async function updateProduct(id, productData) {
  const { data } = await API.put(`/productos/${id}`, productData);
  return data;
}

// Eliminar físicamente un producto por su ID
export async function deleteProduct(id) {
  const { data } = await API.delete(`/productos/${id}`);
  return data;
}

// ========================================
// ========== MÉTODOS DE CATEGORÍA ========
// ========================================

// Obtener el listado de categorías disponibles para los productos
export async function getCategories() {
  const { data } = await API.get('/categorias');
  return data;
}

// Crear una nueva categoría en el sistema
export async function createCategory(categoryData) {
  const { data } = await API.post('/categorias', categoryData);
  return data;
}

// ========================================
// ========== MÉTODOS DE PEDIDO ===========
// ========================================

// Obtener el historial completo de pedidos (filtra transacciones según el cliente/rol)
export async function getOrders(user) {
  const query = buildUserQuery(user);
  const { data } = await API.get(`/pedidos${query}`);
  return data;
}

// Crear un nuevo pedido en el sistema
export async function createOrder(orderData) {
  const { data } = await API.post('/pedidos', orderData);
  return data;
}

// Actualizar los datos o el estado de un pedido específico (Ej. de PROCESANDO a ENTREGADO)
export async function updateOrder(id, orderData) {
  const { data } = await API.put(`/pedidos/${id}`, orderData);
  return data;
}

// Eliminar un registro de pedido por su ID
export async function deleteOrder(id) {
  const { data } = await API.delete(`/pedidos/${id}`);
  return data;
}