import axios from 'axios';

// La URL raíz apunta exactamente al puerto del contenedor BFF mapeado en tu docker-compose
const API_BASE_URL = 'http://localhost:8086/api/bff';

const API = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json'
  }
});

// ========== MÉTODOS DE AUTENTICACIÓN Y USUARIO ==========

// Envía las credenciales nativas { email, password }
export async function loginUser(credentials) {
  const { data } = await API.post('/usuario/auth/login', credentials);
  return data;
}

// Envía el esquema completo en español { nombre, email, password, role }
export async function registerUser(userData) {
  const { data } = await API.post('/usuario', userData);
  return data;
}

// Trae la lista completa de usuarios guardados en la BD
export async function getUsers() {
  const { data } = await API.get('/usuario');
  return data;
}

export async function checkServerHealth() {
  // Intenta pegarle a la raíz del BFF o un endpoint simple
  const { data } = await API.get('/health'); 
  return data;
}