import mongoose from 'mongoose';
import dotenv from 'dotenv';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Conectar a MongoDB
mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

// Definir el esquema del juego
const gameSchema = new mongoose.Schema({
  title: String,
  genre: String,
  releaseYear: Number,
  weight: Number,
  rating: Number,
  description: String,
  image: String,
  developer: String,
  youtubeUrl: String,
  requirements: {
    gpu: String,
    ram: String,
    cpu: String
  },
  downloadLink: String
});

const Game = mongoose.model('Game', gameSchema);

// Función para convertir ObjectIds
function convertObjectIds(data) {
  if (Array.isArray(data)) {
    return data.map(item => convertObjectIds(item));
  } else if (typeof data === 'object' && data !== null) {
    const converted = {};
    for (const [key, value] of Object.entries(data)) {
      if (key === '_id' && value && typeof value === 'object' && value.$oid) {
        converted[key] = value.$oid;
      } else {
        converted[key] = convertObjectIds(value);
      }
    }
    return converted;
  }
  return data;
}

// Función para importar datos
async function importData() {
  try {
    console.log('Conectando a MongoDB...');
    await mongoose.connection;
    console.log('Conectado a MongoDB');

    // Leer el archivo JSON
    const jsonData = fs.readFileSync(path.join(__dirname, 'juegos-emu.games.json'), 'utf8');
    const games = JSON.parse(jsonData);

    console.log(`Encontrados ${games.length} juegos para importar`);

    // Convertir ObjectIds
    const convertedGames = convertObjectIds(games);

    // Limpiar la colección existente
    await Game.deleteMany({});
    console.log('Colección limpiada');

    // Insertar los juegos
    const result = await Game.insertMany(convertedGames);
    console.log(`${result.length} juegos importados exitosamente`);

    console.log('Importación completada');
    process.exit(0);
  } catch (error) {
    console.error('Error durante la importación:', error);
    process.exit(1);
  }
}

// Ejecutar la importación
importData(); 