const USER_BASE_URL = import.meta.env.VITE_API_URL_USUARIO || import.meta.env.VITE_API_URL || 'http://localhost:8082';
const PRODUCT_BASE_URL = import.meta.env.VITE_API_URL_PRODUCTO || 'http://localhost:8083';

function buildUserQuery(user) {
  if (!user) return "";
  const params = new URLSearchParams();
  if (user.id != null) params.set("userId", String(user.id));
  if (user.role) params.set("role", user.role);
  return params.toString() ? `?${params.toString()}` : "";
}

async function fetchJson(path, options = {}, baseUrl = USER_BASE_URL) {
  try {
    const response = await fetch(`${baseUrl}${path}`, {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      ...options,
    });

    if (!response.ok) {
      const errorText = await response.text();
      let errorMessage = `${response.status} ${response.statusText}`;
      
      // Intentar parsear como JSON
      try {
        const errorJson = JSON.parse(errorText);
        errorMessage = errorJson.error || errorJson.message || errorMessage;
      } catch (e) {
        // Si no es JSON válido, usar el texto
        errorMessage = errorText || errorMessage;
      }
      
      throw new Error(errorMessage);
    }

    if (response.status === 204) {
      return null;
    }
    return response.json();
  } catch (error) {
    // Si no es un error de red, re-lanzar
    if (error instanceof TypeError) {
      throw new Error(`Error de conexión: No se puede conectar a ${baseUrl}. Verifica que el servidor esté en línea.`);
    }
    throw error;
  }
}

// ========== AUTENTICACIÓN ==========

export async function loginUser(email, password) {
  return fetchJson('/api/auth/login', {
    method: 'POST',
    body: JSON.stringify({ email, password }),
  }, USER_BASE_URL);
}

export async function registerUser(userData) {
  return fetchJson('/api/users', {
    method: 'POST',
    body: JSON.stringify(userData),
  }, USER_BASE_URL);
}

// ========== USUARIOS ==========

export function getUsers(query = '') {
  const path = `/api/users${query}`;
  return fetchJson(path, {}, USER_BASE_URL);
}

// ========== VERIFICAR SALUD DEL SERVIDOR ==========

export async function checkServerHealth() {
  try {
    return await fetchJson('/api/health', {}, USER_BASE_URL);
  } catch (error) {
    throw new Error(`Servidor no disponible: ${error.message}`);
  }
}

// ========== PRODUCTOS ==========

export function getProducts(user) {
  const query = buildUserQuery(user);
  return fetchJson(`/api/productos${query}`, {}, PRODUCT_BASE_URL);
}

export function createProduct(product, user) {
  const query = buildUserQuery(user);
  return fetchJson(`/api/productos${query}`, {
    method: 'POST',
    body: JSON.stringify(product),
  }, PRODUCT_BASE_URL);
}

export function updateProduct(product, user) {
  if (!product || (product.id == null)) throw new Error('Producto inválido: se requiere id para actualizar.');
  // El endpoint del microservicio espera PUT /api/productos/{id} con el body del producto
  return fetchJson(`/api/productos/${product.id}`, {
    method: 'PUT',
    body: JSON.stringify(product),
  }, PRODUCT_BASE_URL);
}

export async function checkProductHealth() {
  try {
    // Llamamos al endpoint de productos (GET) para validar que el servicio responde
    const res = await fetchJson('/api/productos', {}, PRODUCT_BASE_URL);
    return { ok: true, info: Array.isArray(res) ? `${res.length} items` : 'respuesta' };
  } catch (err) {
    throw new Error(`Producto no disponible: ${err.message}`);
  }
}

// Eliminar producto por id
export function deleteProduct(id) {
  return fetchJson(`/api/productos/${id}`, {
    method: 'DELETE',
  }, PRODUCT_BASE_URL);
}

// ========== CATEGORÍAS ==========

export function getCategories() {
  return fetchJson('/api/categorias', {}, PRODUCT_BASE_URL);
}

export function createCategory(category) {
  return fetchJson('/api/categorias', {
    method: 'POST',
    body: JSON.stringify(category),
  }, PRODUCT_BASE_URL);
}

// ========== PEDIDOS ==========

export function getOrders(user) {
  const query = buildUserQuery(user);
  return fetchJson(`/api/pedidos${query}`, {}, PRODUCT_BASE_URL);
}

export function createOrder(order, user) {
  const query = buildUserQuery(user);
  return fetchJson(`/api/pedidos${query}`, {
    method: 'POST',
    body: JSON.stringify(order),
  }, PRODUCT_BASE_URL);
}
