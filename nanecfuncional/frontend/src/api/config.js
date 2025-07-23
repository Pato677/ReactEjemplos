import axios from 'axios';

// Base URL del servidor backend
const BASE_URL = 'http://localhost:8000';

// Crear una instancia de axios con configuración predeterminada
const api = axios.create({
  baseURL: BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor para manejo de errores
api.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error('API Error:', error);
    if (error.code === 'ERR_NETWORK') {
      throw new Error('No se puede conectar al servidor. Verifica que esté ejecutándose en ' + BASE_URL);
    }
    if (error.response) {
      throw new Error(`Error del servidor: ${error.response.status} - ${error.response.data?.message || 'Error desconocido'}`);
    }
    throw new Error(`Error de conexión: ${error.message}`);
  }
);

export default api;
export { BASE_URL };
