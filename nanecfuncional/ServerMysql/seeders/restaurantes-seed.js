const Restaurante = require('../models/restaurante.model');

const restaurantesData = [
    {
        nombre: "Restaurante 3",
        direccion: "Calle 4",
        tipo: "Comida mexicana",
        url: "https://res.cloudinary.com/tf-lab/image/upload/w_520,h_520,c_fill,q_auto,f_auto/restaurant/2fb1fcf8-6f0f-4c6b-9bef-ec71022d8c23/62bc27c4-5945-4441-b4ff-0e8ecbe7d84e.jpg",
        reputacion: "1"
    },
    {
        nombre: "Poliburgers",
        direccion: "Ladron de Guevara",
        tipo: "Comida rápida",
        url: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=520&h=520&fit=crop&crop=center",
        reputacion: "4"
    },
    {
        nombre: "La Parrilla Quiteña",
        direccion: "Av. 10 de Agosto",
        tipo: "Parrillada",
        url: "https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=520&h=520&fit=crop&crop=center",
        reputacion: "5"
    },
    {
        nombre: "Sushi Zen",
        direccion: "La Carolina",
        tipo: "Comida japonesa",
        url: "https://images.unsplash.com/photo-1579584425555-c3ce17fd4351?w=520&h=520&fit=crop&crop=center",
        reputacion: "4"
    },
    {
        nombre: "Pizzería Italiana",
        direccion: "Zona Rosa",
        tipo: "Comida italiana",
        url: "https://images.unsplash.com/photo-1565299624946-b28f40a0ca4b?w=520&h=520&fit=crop&crop=center",
        reputacion: "3"
    }
];

async function seedRestaurantes() {
    try {
        console.log('🌱 Iniciando seeding de restaurantes...');
        
        // Verificar si ya existen restaurantes
        const existingRestaurantes = await Restaurante.findAll();
        
        if (existingRestaurantes.length > 0) {
            console.log('⚠️ Ya existen restaurantes en la base de datos. Omitiendo seeding.');
            return;
        }
        
        // Crear restaurantes
        for (const restauranteData of restaurantesData) {
            await Restaurante.create(restauranteData);
            console.log(`✅ Restaurante "${restauranteData.nombre}" creado exitosamente`);
        }
        
        console.log('🎉 Seeding completado exitosamente');
        console.log(`📊 Total de restaurantes creados: ${restaurantesData.length}`);
        
    } catch (error) {
        console.error('❌ Error durante el seeding:', error.message);
        throw error;
    }
}

module.exports = { seedRestaurantes };
