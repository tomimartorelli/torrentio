import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Developer from './models/Developer.js';

dotenv.config();

const testDevelopers = [
  {
    name: 'Ubisoft',
    founded: '1986-03-28',
    country: 'Francia'
  },
  {
    name: 'Electronic Arts',
    founded: '1982-05-27',
    country: 'Estados Unidos'
  },
  {
    name: 'Activision Blizzard',
    founded: '1979-10-01',
    country: 'Estados Unidos'
  },
  {
    name: 'Nintendo',
    founded: '1889-09-23',
    country: 'Japón'
  },
  {
    name: 'Sony Interactive Entertainment',
    founded: '1993-11-16',
    country: 'Japón'
  },
  {
    name: 'Microsoft Game Studios',
    founded: '2000-03-30',
    country: 'Estados Unidos'
  },
  {
    name: 'CD Projekt Red',
    founded: '2002-02-01',
    country: 'Polonia'
  },
  {
    name: 'Rockstar Games',
    founded: '1998-12-01',
    country: 'Estados Unidos'
  },
  {
    name: 'Bethesda Softworks',
    founded: '1986-06-28',
    country: 'Estados Unidos'
  },
  {
    name: 'Capcom',
    founded: '1979-05-30',
    country: 'Japón'
  },
  {
    name: 'Square Enix',
    founded: '2003-04-01',
    country: 'Japón'
  },
  {
    name: 'Bandai Namco',
    founded: '2006-03-31',
    country: 'Japón'
  },
  {
    name: 'Konami',
    founded: '1969-03-21',
    country: 'Japón'
  },
  {
    name: 'Sega',
    founded: '1960-06-03',
    country: 'Japón'
  },
  {
    name: 'FromSoftware',
    founded: '1986-11-01',
    country: 'Japón'
  }
];

async function createTestDevelopers() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Conectado a MongoDB');

    // Limpiar desarrolladores existentes
    await Developer.deleteMany({});
    console.log('Desarrolladores existentes eliminados');

    // Insertar nuevos desarrolladores
    const result = await Developer.insertMany(testDevelopers);
    console.log(`${result.length} desarrolladores creados exitosamente`);

    // Mostrar los desarrolladores creados
    const developers = await Developer.find();
    console.log('Desarrolladores en la base de datos:');
    developers.forEach(dev => {
      console.log(`- ${dev.name} (${dev.country}) - Fundado: ${dev.founded}`);
    });

    mongoose.connection.close();
    console.log('Conexión cerrada');
  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  }
}

createTestDevelopers(); 