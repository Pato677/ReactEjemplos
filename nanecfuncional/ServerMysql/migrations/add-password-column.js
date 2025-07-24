const sequelize = require('../config/sequelize.config');

// Script para agregar la columna password a la tabla usuarios existente
const addPasswordColumn = async () => {
    try {
        console.log('🔧 Iniciando migración: Agregando columna password...');
        
        // Verificar si la columna ya existe
        const [results] = await sequelize.query(`
            SELECT COLUMN_NAME 
            FROM INFORMATION_SCHEMA.COLUMNS 
            WHERE TABLE_SCHEMA = 'restaurantesnanec' 
            AND TABLE_NAME = 'usuarios' 
            AND COLUMN_NAME = 'password'
        `);
        
        if (results.length > 0) {
            console.log('✅ La columna password ya existe en la tabla usuarios');
            return;
        }
        
        // Agregar la columna password
        await sequelize.query(`
            ALTER TABLE usuarios 
            ADD COLUMN password VARCHAR(100) NOT NULL DEFAULT ''
        `);
        
        console.log('✅ Columna password agregada exitosamente a la tabla usuarios');
        
        // Opcional: Mostrar la estructura actual de la tabla
        const [tableInfo] = await sequelize.query(`
            DESCRIBE usuarios
        `);
        
        console.log('📋 Estructura actual de la tabla usuarios:');
        console.table(tableInfo);
        
    } catch (error) {
        console.error('❌ Error durante la migración:', error.message);
        
        // Si el error es que la tabla no existe, crearla
        if (error.message.includes("Table 'restaurantesnanec.usuarios' doesn't exist")) {
            console.log('📝 La tabla usuarios no existe. Se creará automáticamente con sync()...');
            
            // Forzar sincronización para crear todas las tablas
            await sequelize.sync({ force: false, alter: true });
            console.log('✅ Tablas sincronizadas exitosamente');
        } else {
            throw error;
        }
    }
};

// Ejecutar la migración si se ejecuta directamente
if (require.main === module) {
    addPasswordColumn()
        .then(() => {
            console.log('🎉 Migración completada exitosamente');
            process.exit(0);
        })
        .catch((error) => {
            console.error('💥 Error en la migración:', error);
            process.exit(1);
        });
}

module.exports = { addPasswordColumn };
