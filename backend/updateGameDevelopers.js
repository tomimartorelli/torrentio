import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Game from './models/Game.js';
import Developer from './models/Developer.js';

dotenv.config();

// Mapeo de nombres de desarrolladores para corregir inconsistencias
const developerMapping = {
  'Sony': 'Sony Interactive Entertainment',
  'WB Games': 'Electronic Arts', // Warner Bros Games -> EA
  'Ubisoft': 'Ubisoft',
  'Rockstar Games': 'Rockstar Games',
  'CD Projekt Red': 'CD Projekt Red',
  'Nintendo': 'Nintendo',
  'Microsoft': 'Microsoft Game Studios',
  'Activision': 'Activision Blizzard',
  'Capcom': 'Capcom',
  'Square Enix': 'Square Enix',
  'Bandai Namco': 'Bandai Namco',
  'Konami': 'Konami',
  'Sega': 'Sega',
  'FromSoftware': 'FromSoftware'
};

async function updateGameDevelopers() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Conectado a MongoDB');

    // Obtener todos los juegos
    const games = await Game.find();
    console.log(`Total de juegos encontrados: ${games.length}`);

    // Obtener todos los desarrolladores
    const developers = await Developer.find();
    console.log(`Total de desarrolladores: ${developers.length}`);

    let updatedCount = 0;
    let skippedCount = 0;

    for (const game of games) {
      const originalDeveloper = game.developer;
      const mappedDeveloper = developerMapping[originalDeveloper];

      if (mappedDeveloper) {
        // Verificar si el desarrollador mapeado existe
        const developerExists = developers.find(dev => dev.name === mappedDeveloper);
        
        if (developerExists) {
          game.developer = mappedDeveloper;
          await game.save();
          console.log(`✅ Actualizado: "${originalDeveloper}" -> "${mappedDeveloper}" en "${game.title}"`);
          updatedCount++;
        } else {
          console.log(`❌ Desarrollador no encontrado: "${mappedDeveloper}" para "${game.title}"`);
          skippedCount++;
        }
      } else {
        console.log(`⚠️  Sin mapeo: "${originalDeveloper}" en "${game.title}"`);
        skippedCount++;
      }
    }

    console.log(`\n=== RESUMEN ===`);
    console.log(`Juegos actualizados: ${updatedCount}`);
    console.log(`Juegos sin cambios: ${skippedCount}`);

    // Mostrar estadísticas finales
    console.log(`\n=== JUEGOS POR DESARROLLADOR (DESPUÉS) ===`);
    const finalGames = await Game.find();
    const developerCounts = {};
    finalGames.forEach(game => {
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

updateGameDevelopers(); 