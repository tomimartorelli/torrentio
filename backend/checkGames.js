import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Game from './models/Game.js';
import Developer from './models/Developer.js';

dotenv.config();

async function checkGames() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Conectado a MongoDB');

    // Obtener todos los juegos
    const games = await Game.find().limit(10);
    console.log('\n=== PRIMEROS 10 JUEGOS ===');
    games.forEach(game => {
      console.log(`- ${game.title} | Desarrollador: ${game.developer || 'NO ASIGNADO'}`);
    });

    // Obtener todos los desarrolladores
    const developers = await Developer.find();
    console.log('\n=== DESARROLLADORES ===');
    developers.forEach(dev => {
      console.log(`- ${dev.name} (${dev.country})`);
    });

    // Contar juegos por desarrollador
    console.log('\n=== JUEGOS POR DESARROLLADOR ===');
    const developerCounts = {};
    games.forEach(game => {
      const dev = game.developer || 'Sin Desarrollador';
      developerCounts[dev] = (developerCounts[dev] || 0) + 1;
    });
    
    Object.entries(developerCounts).forEach(([dev, count]) => {
      console.log(`- ${dev}: ${count} juegos`);
    });

    mongoose.connection.close();
    console.log('\nConexión cerrada');
  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  }
}

checkGames(); 