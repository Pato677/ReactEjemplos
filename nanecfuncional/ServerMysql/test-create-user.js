const sequelize = require('./config/sequelize.config');
const Usuario = require('./models/usuario.model');
const bcrypt = require('bcryptjs');

// Script de prueba para crear un usuario con contraseña
const testCreateUser = async () => {
    try {
        console.log('🧪 Iniciando prueba de creación de usuario...');
        
        // Datos de prueba
        const userData = {
            username: 'usuariotest',
            email: 'test@email.com',
            password: 'password123'
        };
        
        // Hashear la contraseña
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(userData.password, salt);
        
        // Crear el usuario
        const usuario = await Usuario.create({
            username: userData.username,
            email: userData.email,
            password: hashedPassword
        });
        
        console.log('✅ Usuario creado exitosamente:');
        console.log('📧 Email:', usuario.email);
        console.log('👤 Username:', usuario.username);
        console.log('🆔 ID:', usuario.id);
        console.log('🔐 Password hasheada:', usuario.password.substring(0, 20) + '...');
        
        // Verificar que la contraseña se puede comparar
        const isValidPassword = await bcrypt.compare(userData.password, usuario.password);
        console.log('🔑 Verificación de contraseña:', isValidPassword ? '✅ Correcta' : '❌ Incorrecta');
        
        return usuario;
        
    } catch (error) {
        console.error('❌ Error al crear usuario:', error.message);
        
        if (error.name === 'SequelizeUniqueConstraintError') {
            console.log('ℹ️  El usuario ya existe. Intentando con datos diferentes...');
            
            const randomNum = Math.floor(Math.random() * 1000);
            return testCreateUser({
                username: `usuariotest${randomNum}`,
                email: `test${randomNum}@email.com`,
                password: 'password123'
            });
        }
        
        throw error;
    }
};

// Ejecutar la prueba
if (require.main === module) {
    testCreateUser()
        .then(() => {
            console.log('🎉 Prueba completada exitosamente');
            process.exit(0);
        })
        .catch((error) => {
            console.error('💥 Error en la prueba:', error);
            process.exit(1);
        });
}

module.exports = { testCreateUser };
