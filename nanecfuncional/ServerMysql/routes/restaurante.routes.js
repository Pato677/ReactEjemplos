const RestauranteController = require('../controllers/restaurante.controller');

module.exports = function(app){
    // Rutas CRUD básicas
    app.post('/api/restaurante/new', RestauranteController.createRestaurante);
    app.get('/api/restaurantes', RestauranteController.getAllRestaurantes);
    app.get('/api/restaurante/:id', RestauranteController.getRestaurante);
    app.put('/api/restaurante/:id', RestauranteController.updateRestaurante);
    app.delete('/api/restaurante/:id', RestauranteController.deleteRestaurante);
    
    // Ruta para actualizar reputación
    app.put('/api/restaurante/:id/reputacion', RestauranteController.updateReputacion);
    
    // Rutas para filtros y búsquedas
    app.get('/api/restaurantes/tipo/:tipo', RestauranteController.getRestaurantesByTipo);
    app.get('/api/restaurantes/reputacion/:reputacion', RestauranteController.getRestaurantesByReputacion);
    app.get('/api/restaurantes/bestrated', RestauranteController.getBestRatedRestaurantes);
};
