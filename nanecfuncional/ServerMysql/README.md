# Servidor MySQL - API de Restaurantes

Este servidor proporciona una API REST para gestionar restaurantes con sistema de reputación.

## Estructura de Restaurante

```json
{
  "id": "integer (auto-increment)",
  "nombre": "string (2-100 caracteres)",
  "direccion": "string (5-200 caracteres)", 
  "tipo": "string (2-50 caracteres)",
  "url": "string (URL válida)",
  "reputacion": "string ('1', '2', '3', '4', '5')",
  "createdAt": "timestamp",
  "updatedAt": "timestamp"
}
```

## Endpoints Disponibles

### 🏪 Restaurantes CRUD

#### GET /api/restaurantes
Obtiene todos los restaurantes ordenados por fecha de creación.
```json
{
  "message": "Restaurantes obtenidos exitosamente",
  "count": 5,
  "data": [...]
}
```

#### GET /api/restaurante/:id
Obtiene un restaurante específico por ID.

#### POST /api/restaurante/new
Crea un nuevo restaurante.
```json
{
  "nombre": "Restaurante Ejemplo",
  "direccion": "Calle Principal 123",
  "tipo": "Comida italiana",
  "url": "https://example.com/imagen.jpg",
  "reputacion": "4"
}
```

#### PUT /api/restaurante/:id
Actualiza un restaurante existente.

#### DELETE /api/restaurante/:id
Elimina un restaurante.

### ⭐ Sistema de Reputación

#### PUT /api/restaurante/:id/reputacion
Actualiza la reputación de un restaurante.
```json
{
  "reputacion": "5"
}
```

### 🔍 Filtros y Búsquedas

#### GET /api/restaurantes/tipo/:tipo
Obtiene restaurantes por tipo de comida.
Ejemplo: `/api/restaurantes/tipo/Comida mexicana`

#### GET /api/restaurantes/reputacion/:reputacion
Obtiene restaurantes por reputación específica.
Ejemplo: `/api/restaurantes/reputacion/5`

#### GET /api/restaurantes/bestrated?limit=10
Obtiene los restaurantes mejor calificados (reputación 5).

## 🚀 Ejecutar el Servidor

### Prerrequisitos
- Node.js
- MySQL Server
- npm o yarn

### Instalación
```bash
cd ServerMysql
npm install
```

### Configuración de Base de Datos
Edita `config/sequelize.config.js` con tus credenciales de MySQL:
```javascript
const username = 'tu_usuario';
const password = 'tu_password';
const bdd_name = 'restaurantesnanec';
const hostName = 'localhost';
```

### Ejecutar en Desarrollo
```bash
npm run dev
```

### Ejecutar en Producción
```bash
npm start
```

El servidor estará disponible en: `http://localhost:8000`

## 🗄️ Base de Datos

El servidor automáticamente:
1. Crea la base de datos si no existe
2. Sincroniza las tablas con los modelos
3. Inserta datos de ejemplo si la tabla está vacía

## 📁 Estructura del Proyecto

```
ServerMysql/
├── config/
│   └── sequelize.config.js    # Configuración de base de datos
├── controllers/
│   └── restaurante.controller.js  # Lógica de negocio
├── models/
│   └── restaurante.model.js   # Modelo de datos Sequelize
├── routes/
│   └── restaurante.routes.js  # Definición de rutas
├── seeders/
│   └── restaurantes-seed.js   # Datos iniciales
├── package.json
└── server.js                  # Punto de entrada
```

## 🛠️ Tecnologías Utilizadas

- **Express.js** - Framework web
- **Sequelize** - ORM para MySQL
- **MySQL2** - Driver para MySQL
- **CORS** - Middleware para CORS
- **Nodemon** - Desarrollo en tiempo real

## ⚠️ Notas Importantes

1. **CORS**: Configurado para permitir todas las conexiones en desarrollo
2. **Validaciones**: Los campos tienen validaciones tanto a nivel de modelo como de controlador
3. **Reputación**: Solo acepta valores del "1" al "5" como strings
4. **Auto-seeding**: Se ejecuta automáticamente al iniciar el servidor si no hay datos
