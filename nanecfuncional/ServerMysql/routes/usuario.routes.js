const UsuarioController = require('../controllers/usuario.controller');

module.exports = function(app){
    // Rutas CRUD básicas
    app.post('/api/usuario/new', UsuarioController.createUsuario);
    app.get('/api/usuarios', UsuarioController.getAllUsuarios);
    app.get('/api/usuario/:id', UsuarioController.getUsuario);
    app.put('/api/usuario/:id', UsuarioController.updateUsuario);
    app.delete('/api/usuario/:id', UsuarioController.deleteUsuario);
    
    // Rutas para búsquedas específicas
    app.get('/api/usuario/username/:username', UsuarioController.getUsuarioByUsername);
    app.get('/api/usuario/email/:email', UsuarioController.getUsuarioByEmail);
    app.get('/api/usuarios/search', UsuarioController.searchUsuariosByUsername);
    
    // Rutas para ordenamiento
    app.get('/api/usuarios/ordered/username', UsuarioController.getUsuariosOrderedByUsername);
    app.get('/api/usuarios/ordered/creation', UsuarioController.getUsuariosOrderedByCreation);
    
    // Rutas para verificación de disponibilidad
    app.get('/api/usuario/check/username/:username', UsuarioController.checkUsernameAvailability);
    app.get('/api/usuario/check/email/:email', UsuarioController.checkEmailAvailability);
};
