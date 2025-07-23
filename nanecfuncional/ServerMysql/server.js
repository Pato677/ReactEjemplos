const express = require('express')
const cors = require('cors');
const app = express();
const port = 8000;

// Configuración de CORS más permisiva para desarrollo
app.use(cors({
    origin: true, // Permite cualquier origen en desarrollo
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
}));

// Middleware adicional para headers CORS manuales
app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
    
    if (req.method === 'OPTIONS') {
        res.sendStatus(200);
    } else {
        next();
    }
});

require('./config/sequelize.config')
const { seedRestaurantes } = require('./seeders/restaurantes-seed');

app.use(express.json()); // Middleware para parsear JSON en el cuerpo de la solicitud
app.use(express.urlencoded({ extended: true })); // Middleware para parsear datos de formularios

// Función para inicializar la base de datos
async function initializeDatabase() {
    try {
        await seedRestaurantes();
    } catch (error) {
        console.error('Error al inicializar la base de datos:', error);
    }
}

// Ruta de prueba
app.get('/api/test', (req, res) => {
    console.log('🔗 Petición recibida en /api/test desde:', req.headers.origin || 'unknown');
    res.json({ message: 'Servidor funcionando correctamente', timestamp: new Date() });
});
 const allRestauranteRoutes = require('./routes/restaurante.routes');
 allRestauranteRoutes(app);
 const allTipoComidaRoutes = require('./routes/tipocomida.routes');
 allTipoComidaRoutes(app);
 const allMenuRoutes = require('./routes/menu.routes');
 allMenuRoutes(app);

// Iniciar servidor y base de datos
app.listen(port, async () => {
    console.log("🚀 Server corriendo en el puerto: ", port);
    console.log("🔗 API disponible en: http://localhost:" + port + "/api/");
    
    // Inicializar base de datos con datos de ejemplo
    await initializeDatabase();
}); 