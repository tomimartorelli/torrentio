const mongoose = require('mongoose');
const fs = require('fs');
const path = require('path');

// Importar modelos
const Game = require('./models/Game');
const Developer = require('./models/Developer');
const User = require('./models/User');

// Conectar a MongoDB
mongoose.connect('mongodb://localhost:27017/torrentio', {
  useNewUrlParser: true,
  useUnifiedTopology: true
});

// Función para limpiar y corregir los datos
function correctGameData() {
  return [
    {
      title: "Assassin's Creed Odyssey",
      genre: "Acción",
      releaseYear: 2018,
      weight: 110,
      developer: "Ubisoft",
      description: "De marginado a leyenda viviente, embárcate en una odisea para descubrir los secretos de tu pasado y cambiar el destino de la antigua Grecia. Desde bosques exuberantes y vibrantes hasta islas volcánicas y ciudades bulliciosas, comienza un viaje de exploración y encuentros en un mundo devastado por la guerra y moldeado por dioses y hombres.",
      image: "uploads\\1733350224624-assasins-creed.jpg",
      youtubeUrl: "https://www.youtube.com/watch?v=Asy_p4xStbk",
      downloadLink: "https://buzzheavier.com/9ijwpud2aubn",
      requirements: {
        gpu: "AMD Radeon R9 285, NVIDIA GeForce GTX 660",
        ram: "8 GB",
        cpu: "AMD FX 6300 @ 3.8 GHz, Ryzen 3 – 1200, Intel Core i5 2400 @ 3.1 GHz"
      }
    },
    {
      title: "Batman Arkham Knight",
      genre: "Acción",
      releaseYear: 2015,
      weight: 45,
      developer: "Rocksteady Studios",
      description: "Batman: Arkham Knight lleva la galardonada trilogía Arkham de Rocksteady Studios a su conclusión épica. Desarrollado exclusivamente para plataformas de nueva generación, Batman: Arkham Knight presenta la versión del Batimóvil de diseño exclusivo de Rocksteady.",
      image: "uploads\\1733350511329-batman.jpg",
      youtubeUrl: "https://www.youtube.com/watch?v=JeGAQXY2FzI",
      downloadLink: "https://buzzheavier.com/qlhbq0546no5",
      requirements: {
        gpu: "NVIDIA GeForce GTX 660",
        ram: "6 GB",
        cpu: "Intel Core i5-750, 2.67 GHz | AMD Phenom II X4 965, 3.4 GHz"
      }
    },
    {
      title: "Red Dead Redemption 2",
      genre: "Acción",
      releaseYear: 2018,
      weight: 150,
      developer: "Rockstar Games",
      description: "Arthur Morgan y la banda Van der Linde son forajidos que huyen. Con agentes federales y los mejores cazarrecompensas de la nación pisándoles los talones, la pandilla debe robar, robar y abrirse camino a través del accidentado corazón de Estados Unidos para sobrevivir.",
      image: "uploads\\1733350678035-red-dead.jpg",
      youtubeUrl: "https://www.youtube.com/watch?v=Dw_oH5oiUSE",
      downloadLink: "https://dd.buzzheavier.com/f/GUbCYSfB8AA",
      requirements: {
        gpu: "Nvidia GeForce GTX 770 2GB / AMD Radeon R9 280 3GB",
        ram: "8 GB",
        cpu: "Intel Core i5-2500K / AMD FX-6300"
      }
    },
    {
      title: "Cyberpunk 2077",
      genre: "Acción",
      releaseYear: 2020,
      weight: 70,
      developer: "CD Projekt Red",
      description: "Cyberpunk 2077 es un RPG de acción en mundo abierto ambientado en Night City, una megalópolis obsesionada con el poder, el glamur y las modificaciones corporales. Juegas como V, un mercenario forajido que busca un implante único que es la clave de la inmortalidad.",
      image: "uploads\\1733350761492-cyber-punk.jpeg",
      youtubeUrl: "https://www.youtube.com/watch?v=8X2kIfS6fb8",
      downloadLink: "https://buzzheavier.com/9ijwpud2aubn",
      requirements: {
        gpu: "AMD Radeon R9 285, NVIDIA GeForce GTX 660",
        ram: "8 GB",
        cpu: "AMD FX 6300 @ 3.8 GHz, Ryzen 3 – 1200, Intel Core i5 2400 @ 3.1 GHz"
      }
    },
    {
      title: "Ghost of Tsushima",
      genre: "Acción",
      releaseYear: 2020,
      weight: 50,
      developer: "Sony Interactive Entertainment",
      description: "En la era feudal tardía de Japón, una invasión mongol devastó la isla de Tsushima. Como uno de los últimos samuráis supervivientes, debes alzarte en contra de los abrumadores obstáculos para proteger lo que queda de tu hogar y tu gente.",
      image: "uploads\\1733350838451-ghost-premium.jpeg",
      youtubeUrl: "https://www.youtube.com/watch?v=iqysmS4lxwQ",
      downloadLink: "https://buzzheavier.com/9ijwpud2aubn",
      requirements: {
        gpu: "AMD Radeon R9 285, NVIDIA GeForce GTX 660",
        ram: "8 GB",
        cpu: "AMD FX 6300 @ 3.8 GHz, Ryzen 3 – 1200, Intel Core i5 2400 @ 3.1 GHz"
      }
    },
    {
      title: "Spider-Man Remastered",
      genre: "Acción",
      releaseYear: 2022,
      weight: 75,
      developer: "Sony Interactive Entertainment",
      description: "En Spider-Man Remastered, los mundos de Peter Parker y Spider-Man chocan en una historia original llena de acción. Juega como un Spider-Man experimentado luchando contra el crimen y el caos en la ciudad de Nueva York.",
      image: "uploads\\1733350871146-spider-man.jpg",
      youtubeUrl: "https://www.youtube.com/watch?v=q4GdJVvdxss",
      downloadLink: "https://buzzheavier.com/9ijwpud2aubn",
      requirements: {
        gpu: "NVIDIA GeForce GTX 660",
        ram: "8 GB",
        cpu: "Intel Core i5-750, 2.67 GHz | AMD Phenom II X4 965, 3.4 GHz"
      }
    },
    {
      title: "Dead Island 2",
      genre: "Acción",
      releaseYear: 2023,
      weight: 70,
      developer: "Deep Silver",
      description: "Dead Island 2 es un juego de acción RPG de zombis slasher, ambientado en un paraíso californiano infectado por zombis. Con una gran cantidad de armas cuerpo a cuerpo totalmente personalizables, puedes enfrentar hordas de zombis en una épica aventura sangrienta.",
      image: "uploads\\1733350903703-dead island.jpg",
      youtubeUrl: "https://www.youtube.com/watch?v=sNgPLg85f80",
      downloadLink: "https://buzzheavier.com/qlhbq0546no5",
      requirements: {
        gpu: "NVIDIA GeForce GTX 660",
        ram: "6 GB",
        cpu: "Intel Core i5-750, 2.67 GHz | AMD Phenom II X4 965, 3.4 GHz"
      }
    },
    {
      title: "Armored Core VI",
      genre: "Acción",
      releaseYear: 2023,
      weight: 60,
      developer: "FromSoftware",
      description: "Armored Core VI: Fires of Rubicon es un juego de acción mech en tercera persona que combina el combate rápido, dinámico e inmersivo con una nueva dimensión tridimensional en el movimiento más potente de la historia de la serie.",
      image: "uploads\\1733350936656-armored-core.jpg",
      youtubeUrl: "https://www.youtube.com/watch?v=YJ1lzLKtXDo",
      downloadLink: "https://buzzheavier.com/9ijwpud2aubn",
      requirements: {
        gpu: "AMD Radeon R9 285, NVIDIA GeForce GTX 660",
        ram: "8 GB",
        cpu: "AMD FX 6300 @ 3.8 GHz, Ryzen 3 – 1200, Intel Core i5 2400 @ 3.1 GHz"
      }
    },
    {
      title: "Gotham Knights",
      genre: "Acción",
      releaseYear: 2022,
      weight: 45,
      developer: "Warner Bros Games",
      description: "Gotham Knights es un juego de rol de acción en mundo abierto ambientado en el Gotham más dinámico e interactivo hasta la fecha. Patrulla Gotham City como Batgirl, Nightwing, Red Hood y Robin en una historia completamente original.",
      image: "uploads\\1733350967439-gotham-knights.jpg",
      youtubeUrl: "https://www.youtube.com/watch?v=IhVf_3TeTQE",
      downloadLink: "https://buzzheavier.com/9ijwpud2aubn",
      requirements: {
        gpu: "AMD Radeon R9 285, NVIDIA GeForce GTX 660",
        ram: "8 GB",
        cpu: "AMD FX 6300 @ 3.8 GHz, Ryzen 3 – 1200, Intel Core i5 2400 @ 3.1 GHz"
      }
    },
    {
      title: "Bayonetta 3",
      genre: "Acción",
      releaseYear: 2022,
      weight: 16,
      developer: "Nintendo",
      description: "Bayonetta está de vuelta con una aventura climática! No te pierdas esta frenética escapada llena de acción cuando nuestra amada bruja de Umbra luche para detener una invasión misteriosa antes de que la realidad que conoce llegue a su fin.",
      image: "uploads\\1733351035741-bayonneta.jpg",
      youtubeUrl: "https://www.youtube.com/watch?v=bUAtX4Q2h_4",
      downloadLink: "https://buzzheavier.com/9ijwpud2aubn",
      requirements: {
        gpu: "NVIDIA GeForce GTX 660",
        ram: "6 GB",
        cpu: "Intel Core i5-750, 2.67 GHz | AMD Phenom II X4 965, 3.4 GHz"
      }
    }
  ];
}

// Función para importar desarrolladores corregidos
function correctDeveloperData() {
  return [
    { name: "Ubisoft", founded: new Date("1986-03-28"), country: "Francia" },
    { name: "Electronic Arts", founded: new Date("1982-05-27"), country: "Estados Unidos" },
    { name: "Activision Blizzard", founded: new Date("1979-10-01"), country: "Estados Unidos" },
    { name: "Nintendo", founded: new Date("1889-09-23"), country: "Japón" },
    { name: "Sony Interactive Entertainment", founded: new Date("1993-11-16"), country: "Japón" },
    { name: "Microsoft Game Studios", founded: new Date("2000-03-30"), country: "Estados Unidos" },
    { name: "CD Projekt Red", founded: new Date("2002-02-01"), country: "Polonia" },
    { name: "Rockstar Games", founded: new Date("1998-12-01"), country: "Estados Unidos" },
    { name: "Bethesda Softworks", founded: new Date("1986-06-28"), country: "Estados Unidos" },
    { name: "Capcom", founded: new Date("1979-05-30"), country: "Japón" },
    { name: "Square Enix", founded: new Date("2003-04-01"), country: "Japón" },
    { name: "Bandai Namco", founded: new Date("2006-03-31"), country: "Japón" },
    { name: "Konami", founded: new Date("1969-03-21"), country: "Japón" },
    { name: "Sega", founded: new Date("1960-06-03"), country: "Japón" },
    { name: "FromSoftware", founded: new Date("1986-11-01"), country: "Japón" },
    { name: "Rocksteady Studios", founded: new Date("2004-12-01"), country: "Reino Unido" },
    { name: "Deep Silver", founded: new Date("2002-01-01"), country: "Austria" },
    { name: "Warner Bros Games", founded: new Date("1993-01-01"), country: "Estados Unidos" }
  ];
}

async function importData() {
  try {
    console.log('🚀 Iniciando importación de datos...');

    // Limpiar colecciones existentes
    await Game.deleteMany({});
    await Developer.deleteMany({});
    console.log('✅ Colecciones limpiadas');

    // Importar desarrolladores
    const developers = correctDeveloperData();
    await Developer.insertMany(developers);
    console.log(`✅ ${developers.length} desarrolladores importados`);

    // Importar juegos corregidos (solo una muestra)
    const games = correctGameData();
    await Game.insertMany(games);
    console.log(`✅ ${games.length} juegos importados con datos corregidos`);

    console.log('🎉 Importación completada exitosamente!');
    
    // Mostrar estadísticas
    const gameCount = await Game.countDocuments();
    const devCount = await Developer.countDocuments();
    console.log(`📊 Total de juegos: ${gameCount}`);
    console.log(`📊 Total de desarrolladores: ${devCount}`);

  } catch (error) {
    console.error('❌ Error durante la importación:', error);
  } finally {
    mongoose.connection.close();
  }
}

// Ejecutar la importación
importData();
