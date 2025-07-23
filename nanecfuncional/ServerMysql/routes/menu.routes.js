const MenuController = require('../controllers/menu.controller');

module.exports = function(app){
    // Rutas CRUD básicas para relaciones menu
    app.post('/api/menu/new', MenuController.createMenu);
    app.get('/api/menus', MenuController.getAllMenus);
    app.get('/api/menu/:id', MenuController.getMenu);
    app.delete('/api/menu/:id', MenuController.deleteMenu);
    
    // Rutas para consultas específicas de relaciones
    app.get('/api/menu/restaurante/:restauranteId/tipos', MenuController.getTiposComidaByRestaurante);
    app.get('/api/menu/tipocomida/:tipoComidaId/restaurantes', MenuController.getRestaurantesByTipoComida);
    
    // Rutas para verificar y eliminar relaciones específicas
    app.get('/api/menu/verificar/:restauranteId/:tipoComidaId', MenuController.verificarRelacion);
    app.delete('/api/menu/eliminar/:restauranteId/:tipoComidaId', MenuController.eliminarRelacionEspecifica);
};
