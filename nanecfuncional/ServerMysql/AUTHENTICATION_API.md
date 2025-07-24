# API de Autenticación de Usuarios

## Nuevos Endpoints Agregados

### 1. Registro de Usuario (Signup)
**POST** `/api/auth/register`

**Body (JSON):**
```json
{
    "userName": "usuario123",
    "email": "usuario@ejemplo.com",
    "password": "contraseña123"
}
```

**Respuesta exitosa (201):**
```json
{
    "email": "usuario@ejemplo.com",
    "userName": "usuario123", 
    "_id": 1,
    "token": "jwt_token_aqui"
}
```

**Errores posibles:**
- 400: Missing fields, all are mandatory!
- 400: User already exist
- 409: User already exist with this email/username

### 2. Inicio de Sesión (Login)
**POST** `/api/auth/login`

**Body (JSON):**
```json
{
    "email": "usuario@ejemplo.com",
    "password": "contraseña123"
}
```

**Respuesta exitosa (200):**
```json
{
    "message": "Login User",
    "email": "usuario@ejemplo.com",
    "userName": "usuario123",
    "token": "jwt_token_aqui"
}
```

**Errores posibles:**
- 400: Email and password are required
- 400: Login Failed (credenciales incorrectas)

## Características Implementadas

✅ **Hasheado de Contraseñas**: Utiliza bcryptjs con salt de 10 rounds
✅ **Generación de JWT**: Tokens válidos por 30 días
✅ **Validación de Campos**: Email, username y password obligatorios
✅ **Verificación de Duplicados**: No permite usuarios con mismo email
✅ **Comparación Segura**: bcrypt.compare para verificar contraseñas
✅ **Manejo de Errores**: Respuestas detalladas para diferentes errores

## Modelo Usuario Actualizado

El modelo ya incluye el campo `password` con las siguientes validaciones:
- Obligatorio (allowNull: false)
- Mínimo 6 caracteres
- Máximo 100 caracteres
- Se almacena hasheado en la base de datos

## Variables de Entorno

Asegúrate de tener en tu archivo `.env`:
```
JWT_SECRET=tu_clave_secreta_muy_segura_para_jwt_tokens_2024
```

## Métodos del Controlador

### createUser
- Registro de usuario con password hasheado
- Generación automática de JWT token
- Validación de campos obligatorios
- Verificación de duplicados por email

### loginUser
- Verificación de credenciales
- Comparación segura de passwords
- Generación de token JWT
- Manejo de errores de autenticación

## Ejemplos de Uso con Axios

### Registro:
```javascript
const registro = async () => {
    try {
        const response = await axios.post('http://localhost:8000/api/auth/register', {
            userName: 'miusuario',
            email: 'mi@email.com',
            password: 'mipassword123'
        });
        
        const { token, userName, email } = response.data;
        localStorage.setItem('token', token);
        // Redirigir o actualizar estado
    } catch (error) {
        console.error('Error en registro:', error.response.data.message);
    }
};
```

### Login:
```javascript
const login = async () => {
    try {
        const response = await axios.post('http://localhost:8000/api/auth/login', {
            email: 'mi@email.com',
            password: 'mipassword123'
        });
        
        const { token, userName, email } = response.data;
        localStorage.setItem('token', token);
        // Redirigir o actualizar estado
    } catch (error) {
        console.error('Error en login:', error.response.data.message);
    }
};
```

## Testing con Postman

1. **Registro:**
   - POST http://localhost:8000/api/auth/register
   - Headers: Content-Type: application/json
   - Body: raw JSON con userName, email, password

2. **Login:**
   - POST http://localhost:8000/api/auth/login  
   - Headers: Content-Type: application/json
   - Body: raw JSON con email, password

## Notas Importantes

- Las contraseñas se almacenan hasheadas usando bcryptjs
- Los tokens JWT incluyen el ID del usuario y expiran en 30 días
- El modelo mantiene compatibilidad con métodos anteriores
- Se agregaron rutas de autenticación sin afectar las existentes
