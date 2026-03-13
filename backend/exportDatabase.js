import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Game from './models/Game.js';
import Developer from './models/Developer.js';
import User from './models/User.js';
import fs from 'fs';

dotenv.config();

async function exportDatabase() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Conectado a MongoDB');

    // Exportar juegos
    const games = await Game.find({});
    console.log(`Exportando ${games.length} juegos...`);

    // Exportar desarrolladores
    const developers = await Developer.find({});
    console.log(`Exportando ${developers.length} desarrolladores...`);

    // Exportar usuarios (opcional, sin contraseñas)
    const users = await User.find({}, { password: 0 }); // Excluir contraseñas
    console.log(`Exportando ${users.length} usuarios...`);

    // Crear objeto de exportación
    const exportData = {
      exportDate: new Date().toISOString(),
      games: games,
      developers: developers,
      users: users,
      stats: {
        totalGames: games.length,
        totalDevelopers: developers.length,
        totalUsers: users.length
      }
    };

    // Crear nombre de archivo con timestamp
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    const filename = `torrentio-database-${timestamp}.json`;

    // Escribir archivo
    fs.writeFileSync(filename, JSON.stringify(exportData, null, 2));
    
    console.log(`\n✅ Base de datos exportada exitosamente a: ${filename}`);
    console.log(`📊 Estadísticas:`);
    console.log(`   - Juegos: ${games.length}`);
    console.log(`   - Desarrolladores: ${developers.length}`);
    console.log(`   - Usuarios: ${users.length}`);
    
    // Mostrar algunos ejemplos
    console.log(`\n📋 Ejemplos de datos exportados:`);
    console.log(`   - Primer juego: ${games[0]?.title || 'N/A'}`);
    console.log(`   - Primer desarrollador: ${developers[0]?.name || 'N/A'}`);
    console.log(`   - Primer usuario: ${users[0]?.name || 'N/A'}`);

    mongoose.connection.close();
    console.log('\nConexión cerrada');
  } catch (error) {
    console.error('Error al exportar:', error);
    process.exit(1);
  }
}

exportDatabase(); 