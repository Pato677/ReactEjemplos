const Usuario = require('../models/usuario.model');
require('dotenv').config();
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');



//generamos el token 
const generateToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET, {expiresIn: '30d'});
};

// Crear un nuevo usuario con contraseña hasheada
module.exports.createUser = async (request, response) => {
    const { userName, email, password } = request.body;
    
    if (!userName || !email || !password) {
        return response.status(400).json({ message: 'Missing fields, all are mandatory!' });
    }
    
    try {
        const userFound = await Usuario.findOne({ 
            where: { email: email } 
        });
        
        if (userFound) {
            return response.status(400).json({ message: 'User already exist' });
        }
        
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);
        
        const newUser = await Usuario.create({
            username: userName,
            email: email,
            password: hashedPassword
        });
        
        response.status(201).json({
            email: newUser.email,
            userName: newUser.username,
            _id: newUser.id,
            token: generateToken(newUser.id)
        });
        
    } catch (err) {
        if (err.name === 'SequelizeValidationError') {
            response.status(400).json({
                message: 'Error de validación',
                errors: err.errors.map(error => error.message)
            });
        } else if (err.name === 'SequelizeUniqueConstraintError') {
            const field = err.errors[0].path;
            response.status(409).json({
                message: `User already exist with this ${field}`
            });
        } else {
            response.status(400).json(err);
        }
    }
};

// Iniciar sesión de usuario
module.exports.loginUser = async (req, res) => {
    const { email, password } = req.body;
    
    if (!email || !password) {
        return res.status(400).json({ message: 'Email and password are required' });
    }
    
    try {
        const userFound = await Usuario.findOne({ 
            where: { email: email } 
        });
        
        console.log('Usuario encontrado: ', userFound);
        
        if (userFound && (await bcrypt.compare(password, userFound.password))) {
            res.json({
                message: 'Login User',
                email: userFound.email,
                userName: userFound.username,
                token: generateToken(userFound.id)
            });
        } else {
            res.status(400).json({ message: 'Login Failed' });
        }
    } catch (err) {
        res.status(500).json({
            message: 'Error during login',
            error: err.message
        });
    }
};

// Crear un usuario (método alternativo manteniendo compatibilidad)
module.exports.createUsuario = async (request, response) => {
    const { username, email, password } = request.body;
    try {
        let hashedPassword = null;
        if (password) {
            const salt = await bcrypt.genSalt(10);
            hashedPassword = await bcrypt.hash(password, salt);
        }
        
        const usuario = await Usuario.create({ 
            username, 
            email,
            password: hashedPassword
        });
        response.status(201).json({
            message: 'Usuario creado exitosamente',
            data: {
                id: usuario.id,
                username: usuario.username,
                email: usuario.email,
                createdAt: usuario.createdAt
            }
        });
    } catch (err) {
        if (err.name === 'SequelizeValidationError') {
            response.status(400).json({
                message: 'Error de validación',
                errors: err.errors.map(error => error.message)
            });
        } else if (err.name === 'SequelizeUniqueConstraintError') {
            const field = err.errors[0].path;
            const value = err.errors[0].value;
            response.status(409).json({
                message: `Error: Ya existe un usuario con ese ${field === 'username' ? 'nombre de usuario' : 'email'}`,
                error: `${field}: ${value} ya está en uso`
            });
        } else {
            response.status(500).json({
                message: 'No se pudo crear el usuario',
                error: err.message
            });
        }
    }
};

// Obtener todos los usuarios
module.exports.getAllUsuarios = async (_, response) => {
    console.log('👥 Petición recibida para obtener todos los usuarios');
    try {
        const usuarios = await Usuario.findAll({
            order: [['createdAt', 'DESC']] // Ordenar por fecha de creación, más recientes primero
        });
        
        console.log('📊 Usuarios encontrados:', usuarios.length);
        console.log('🎯 Primer usuario:', usuarios[0] ? usuarios[0].username : 'Ninguno');
        
        const responseData = {
            message: 'Usuarios obtenidos exitosamente',
            count: usuarios.length,
            data: usuarios
        };
        
        console.log('📡 Enviando respuesta:', responseData);
        response.json(responseData);
    } catch (err) {
        console.error('❌ Error al obtener usuarios:', err);
        response.status(500).json({
            message: 'Error al obtener los usuarios',
            error: err.message
        });
    }
};

// Obtener un usuario por ID
module.exports.getUsuario = async (request, response) => {
    try {
        const usuario = await Usuario.findOne({ 
            where: { id: request.params.id } 
        });
        
        if (!usuario) {
            return response.status(404).json({
                message: 'Usuario no encontrado'
            });
        }
        
        response.json({
            message: 'Usuario encontrado',
            data: usuario
        });
    } catch (err) {
        response.status(500).json({
            message: 'Error al obtener el usuario',
            error: err.message
        });
    }
};

// Actualizar un usuario
module.exports.updateUsuario = async (request, response) => {
    const { username, email } = request.body;
    try {
        const usuario = await Usuario.findOne({ 
            where: { id: request.params.id } 
        });
        
        if (!usuario) {
            return response.status(404).json({
                message: 'Usuario no encontrado'
            });
        }

        await usuario.update({
            username: username || usuario.username,
            email: email || usuario.email
        });

        response.json({
            message: 'Usuario actualizado exitosamente',
            data: usuario
        });
    } catch (err) {
        if (err.name === 'SequelizeValidationError') {
            response.status(400).json({
                message: 'Error de validación',
                errors: err.errors.map(error => error.message)
            });
        } else if (err.name === 'SequelizeUniqueConstraintError') {
            const field = err.errors[0].path;
            const value = err.errors[0].value;
            response.status(409).json({
                message: `Error: Ya existe un usuario con ese ${field === 'username' ? 'nombre de usuario' : 'email'}`,
                error: `${field}: ${value} ya está en uso`
            });
        } else {
            response.status(500).json({
                message: 'Error al actualizar el usuario',
                error: err.message
            });
        }
    }
};

// Eliminar un usuario
module.exports.deleteUsuario = async (request, response) => {
    try {
        const usuario = await Usuario.findOne({ 
            where: { id: request.params.id } 
        });
        
        if (!usuario) {
            return response.status(404).json({
                message: 'Usuario no encontrado'
            });
        }

        await usuario.destroy();
        
        response.json({
            message: 'Usuario eliminado exitosamente'
        });
    } catch (err) {
        response.status(500).json({
            message: 'Error al eliminar el usuario',
            error: err.message
        });
    }
};

// Buscar usuario por username
module.exports.getUsuarioByUsername = async (request, response) => {
    try {
        const { username } = request.params;
        const usuario = await Usuario.findByUsername(username);
        
        if (!usuario) {
            return response.status(404).json({
                message: `Usuario con username "${username}" no encontrado`
            });
        }
        
        response.json({
            message: `Usuario "${username}" encontrado`,
            data: usuario
        });
    } catch (err) {
        response.status(500).json({
            message: 'Error al buscar usuario por username',
            error: err.message
        });
    }
};

// Buscar usuario por email
module.exports.getUsuarioByEmail = async (request, response) => {
    try {
        const { email } = request.params;
        const usuario = await Usuario.findByEmail(email);
        
        if (!usuario) {
            return response.status(404).json({
                message: `Usuario con email "${email}" no encontrado`
            });
        }
        
        response.json({
            message: `Usuario con email "${email}" encontrado`,
            data: usuario
        });
    } catch (err) {
        response.status(500).json({
            message: 'Error al buscar usuario por email',
            error: err.message
        });
    }
};

// Obtener usuarios ordenados por username
module.exports.getUsuariosOrderedByUsername = async (request, response) => {
    try {
        const usuarios = await Usuario.getAllOrderedByUsername();
        
        response.json({
            message: 'Usuarios ordenados por username obtenidos exitosamente',
            count: usuarios.length,
            data: usuarios
        });
    } catch (err) {
        response.status(500).json({
            message: 'Error al obtener usuarios ordenados por username',
            error: err.message
        });
    }
};

// Obtener usuarios ordenados por fecha de creación
module.exports.getUsuariosOrderedByCreation = async (request, response) => {
    try {
        const usuarios = await Usuario.getAllOrderedByCreation();
        
        response.json({
            message: 'Usuarios ordenados por fecha de creación obtenidos exitosamente',
            count: usuarios.length,
            data: usuarios
        });
    } catch (err) {
        response.status(500).json({
            message: 'Error al obtener usuarios ordenados por fecha',
            error: err.message
        });
    }
};

// Buscar usuarios que contengan un texto en el username (búsqueda parcial)
module.exports.searchUsuariosByUsername = async (request, response) => {
    try {
        const { search } = request.query;
        
        if (!search) {
            return response.status(400).json({
                message: 'Parámetro de búsqueda requerido'
            });
        }
        
        const usuarios = await Usuario.findAll({
            where: {
                username: {
                    [require('sequelize').Op.iLike]: `%${search}%`
                }
            },
            order: [['username', 'ASC']]
        });
        
        response.json({
            message: `Búsqueda de usuarios con "${search}" completada`,
            count: usuarios.length,
            data: usuarios
        });
    } catch (err) {
        response.status(500).json({
            message: 'Error en la búsqueda de usuarios',
            error: err.message
        });
    }
};

// Verificar disponibilidad de username
module.exports.checkUsernameAvailability = async (request, response) => {
    try {
        const { username } = request.params;
        const usuario = await Usuario.findByUsername(username);
        
        response.json({
            username: username,
            available: !usuario,
            message: usuario ? 'Username no disponible' : 'Username disponible'
        });
    } catch (err) {
        response.status(500).json({
            message: 'Error al verificar disponibilidad del username',
            error: err.message
        });
    }
};

// Verificar disponibilidad de email
module.exports.checkEmailAvailability = async (request, response) => {
    try {
        const { email } = request.params;
        const usuario = await Usuario.findByEmail(email);
        
        response.json({
            email: email,
            available: !usuario,
            message: usuario ? 'Email no disponible' : 'Email disponible'
        });
    } catch (err) {
        response.status(500).json({
            message: 'Error al verificar disponibilidad del email',
            error: err.message
        });
    }
};
