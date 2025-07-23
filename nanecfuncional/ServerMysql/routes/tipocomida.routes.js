const TipoComidaController = require('../controllers/tipocomida.controllers');

module.exports = function(app){
    // Rutas CRUD básicas
    app.post('/api/tipocomida/new', TipoComidaController.createTipoComida);
    app.get('/api/tiposcomida', TipoComidaController.getAllTiposComida);
    app.get('/api/tipocomida/:id', TipoComidaController.getTipoComida);
    app.put('/api/tipocomida/:id', TipoComidaController.updateTipoComida);
    app.delete('/api/tipocomida/:id', TipoComidaController.deleteTipoComida);
    
    // Rutas para filtros y búsquedas
    app.get('/api/tiposcomida/pais/:pais', TipoComidaController.getTiposComidaByPais);
    app.get('/api/tiposcomida/nombre/:nombre', TipoComidaController.getTipoComidaByNombre);
    app.get('/api/tiposcomida/search', TipoComidaController.searchTiposComidaByName);
    
    // Rutas para ordenamiento
    app.get('/api/tiposcomida/ordered/name', TipoComidaController.getTiposComidaOrderedByName);
    app.get('/api/tiposcomida/ordered/country', TipoComidaController.getTiposComidaOrderedByCountry);
    
    // Ruta para estadísticas
    app.get('/api/tiposcomida/stats/pais', TipoComidaController.getEstadisticasByPais);
};
