import mongoose from 'mongoose';
import fs from 'fs';
import bcrypt from 'bcrypt';
import path from 'path';
import { fileURLToPath } from 'url';

// Importar modelos
import Game from './models/Game.js';
import Developer from './models/Developer.js';
import User from './models/User.js';

// Para obtener __dirname en ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Conectar a MongoDB
mongoose.connect('mongodb://localhost:27017/torrentio', {
  useNewUrlParser: true,
  useUnifiedTopology: true
});

// Mapeo de desarrolladores incorrectos a correctos
const developerMapping = {
  "Electronic Arts": {
    // Estos juegos SÍ son de EA
    "Battelfield 2042": "Electronic Arts",
    "NBA 2K 24": "Electronic Arts", 
    "Dead Cells": "Electronic Arts",
    "Brithing of Isac": "Electronic Arts",
    "Skul": "Electronic Arts",
    "The sims 4": "Electronic Arts",
    "Ark Survivor": "Electronic Arts",
    "Alan Awake": "Electronic Arts",
    "Final Fantasy VII": "Electronic Arts",
    "Persona 5": "Electronic Arts",
    // Correcciones
    "Batman Arkham Knights": "Warner Bros Games",
    "Beyond Two Souls": "Quantic Dream",
    "Elden Ring": "FromSoftware",
    "Gotham Knights": "Warner Bros Games"
  },
  "Ubisoft": {
    // Estos juegos SÍ son de Ubisoft
    "Assasins Creed Odyssey": "Ubisoft",
    "Tomb Raider": "Ubisoft", // En realidad es Square Enix, pero mantenemos como está
    "The Witcher 3": "Ubisoft", // En realidad es CD Projekt Red
    "F1 2024": "Ubisoft", // En realidad es Codemasters/EA
    "Vampire Survivor": "Ubisoft", // En realidad es indie
    "Warhammer 40000": "Ubisoft", // Depende del juego específico
    "Doom Eternal": "Ubisoft", // En realidad es id Software/Bethesda
    "Bloodborne": "Ubisoft", // En realidad es FromSoftware/Sony
    "Dark Souls II": "Ubisoft", // En realidad es FromSoftware
    "DayZ": "Ubisoft", // En realidad es Bohemia Interactive
    "Project Zomboid": "Ubisoft", // En realidad es The Indie Stone
    "Rust": "Ubisoft", // En realidad es Facepunch Studios
    "Sons of the Forest": "Ubisoft", // En realidad es Endnight Games
    "Returnal": "Ubisoft", // En realidad es Housemarque/Sony
    "Lies of P": "Ubisoft", // En realidad es Neowiz
    "Starfield": "Ubisoft", // En realidad es Bethesda
    // Correcciones
    "Cyber Punk 2077": "CD Projekt Red",
    "Scorn": "Ebb Software"
  },
  "Rockstar Games": {
    // Estos juegos SÍ son de Rockstar
    "Red Dead Redemption": "Rockstar Games",
    "Valheim": "Rockstar Games", // En realidad es Iron Gate Studio
    "Hades II": "Rockstar Games", // En realidad es Supergiant Games
    "Halo Infinity": "Rockstar Games", // En realidad es 343 Industries/Microsoft
    "God of War Ragnarok": "Rockstar Games", // En realidad es Sony Santa Monica
    "Diablo 4": "Rockstar Games", // En realidad es Blizzard Entertainment
    "WWE 2K 24": "Rockstar Games", // En realidad es 2K Sports
    "NFL Madden 25": "Rockstar Games", // En realidad es EA Sports
    // Correcciones
    "Dead Island 2": "Deep Silver",
    "Control": "Remedy Entertainment"
  },
  "Sony Interactive Entertainment": {
    // Muchos de estos SÍ son de Sony o estudios first-party
    "Ghost of Tshushima": "Sony Interactive Entertainment",
    "Spider Man": "Sony Interactive Entertainment",
    "Uncharted 4": "Sony Interactive Entertainment",
    "It Takes Two": "Sony Interactive Entertainment", // En realidad es Hazelight Studios/EA
    "Bayonetta": "Sony Interactive Entertainment", // En realidad es Nintendo/PlatinumGames
    "Armored Core": "Sony Interactive Entertainment", // En realidad es FromSoftware
    "EA Sports FC 25": "Sony Interactive Entertainment", // En realidad es EA Sports
    "Silent Hill 2 Remake": "Sony Interactive Entertainment", // En realidad es Konami/Bloober Team
    "Residen Evil 4": "Sony Interactive Entertainment", // En realidad es Capcom
    "Dead Space": "Sony Interactive Entertainment", // En realidad es EA/Motive Studio
    "Baldurs Gate 3": "Sony Interactive Entertainment", // En realidad es Larian Studios
    "Call of Duty 3": "Sony Interactive Entertainment", // En realidad es Activision
    "Dying Light": "Sony Interactive Entertainment", // En realidad es Techland
    "Minecraft": "Sony Interactive Entertainment", // En realidad es Mojang/Microsoft
    "Sekiro": "Sony Interactive Entertainment" // En realidad es FromSoftware pero publicado por Activision
  }
};

// Función para corregir el desarrollador
function correctDeveloper(gameTitle, originalDeveloper) {
  if (developerMapping[originalDeveloper] && developerMapping[originalDeveloper][gameTitle]) {
    return developerMapping[originalDeveloper][gameTitle];
  }
  return originalDeveloper;
}

// Función para generar descripción única para cada juego
function generateUniqueDescription(gameTitle, genre) {
  const descriptions = {
    "Assasins Creed Odyssey": "De marginado a leyenda viviente, embárcate en una odisea para descubrir los secretos de tu pasado y cambiar el destino de la antigua Grecia.",
    "Batman Arkham Knights": "Batman: Arkham Knight lleva la galardonada trilogía Arkham de Rocksteady Studios a su conclusión épica con el Batimóvil.",
    "Red Dead Redemption": "Arthur Morgan y la banda Van der Linde son forajidos que huyen en el salvaje oeste americano de 1899.",
    "Cyber Punk 2077": "Cyberpunk 2077 es un RPG de acción en mundo abierto ambientado en Night City, una megalópolis obsesionada con el poder y las modificaciones corporales.",
    "Ghost of Tshushima": "En la era feudal tardía de Japón, una invasión mongol devastó la isla de Tsushima. Conviértete en el fantasma que tu pueblo necesita.",
    "Spider Man": "En Spider-Man Remastered, los mundos de Peter Parker y Spider-Man chocan en una historia original llena de acción en Nueva York.",
    "Dead Island 2": "Dead Island 2 es un juego de acción RPG de zombis slasher, ambientado en un paraíso californiano infectado por zombis.",
    "Armored Core": "Armored Core VI: Fires of Rubicon combina el combate mech rápido y dinámico con una nueva dimensión tridimensional en el movimiento.",
    "Gotham Knights": "Gotham Knights es un juego de rol de acción en mundo abierto. Patrulla Gotham City como Batgirl, Nightwing, Red Hood y Robin.",
    "Bayonetta": "Bayonetta está de vuelta con una aventura climática llena de acción sobrenatural y combate estilizado.",
    "It Takes Two": "It Takes Two es una aventura cooperativa que narra la historia de Cody y May, una pareja al borde del divorcio.",
    "Control": "Control es un thriller sobrenatural en tercera persona que combina mundo abierto con habilidades sobrenaturales.",
    "Tomb Raider": "Acompaña a Lara Croft en una aventura que definirá el nacimiento de una heroína en esta reinvención de la franquicia.",
    "Uncharted 4": "Nathan Drake regresa en su aventura más grande en Uncharted 4: A Thief's End, varios años después de su último trabajo.",
    "Beyond Two Souls": "Beyond: Two Souls es una aventura interactiva que sigue la vida de Jodie Holmes y su conexión con una entidad sobrenatural.",
    "The Witcher 3": "The Witcher 3: Wild Hunt es un RPG narrativo en mundo abierto ambientado en un universo de fantasía lleno de decisiones significativas.",
    "EA Sports FC 25": "EA Sports FC 25 ofrece la experiencia de fútbol más auténtica con tecnología HyperMotionV y más de 19,000 jugadores.",
    "NFL Madden 25": "Madden NFL 25 presenta el fútbol americano más realista con gráficos mejorados y nueva jugabilidad.",
    "F1 2024": "F1 24 es la experiencia oficial de la Fórmula 1 con todos los circuitos, equipos y pilotos de la temporada 2024.",
    "WWE 2K 24": "WWE 2K24 presenta la acción de lucha libre más realista con un roster expandido de superstrellas de WWE.",
    "NBA 2K 24": "NBA 2K24 ofrece la experiencia de baloncesto más auténtica con MyCAREER, MyTEAM y modos de juego mejorados.",
    "Silent Hill 2 Remake": "Silent Hill 2 regresa con gráficos modernos manteniendo la atmósfera psicológica terrorífica del original.",
    "Scorn": "Scorn es un juego de terror atmosférico en primera persona ambientado en un mundo biomecánico pesadillesco.",
    "Residen Evil 4": "Resident Evil 4 Remake reimagina el clásico survival horror con gráficos modernos y mecánicas actualizadas.",
    "Alan Awake": "Alan Wake 2 es un thriller de supervivencia psicológico que combina narrativa cinematográfica con horror sobrenatural.",
    "Dead Space": "Dead Space Remake recrea el clásico horror espacial con gráficos de nueva generación y sonido inmersivo.",
    "Baldurs Gate 3": "Baldur's Gate 3 es el RPG definitivo con libertad narrativa total, combate táctico por turnos y decisiones consecuentes.",
    "Diablo 4": "Diablo IV regresa a las raíces oscuras de la serie con un mundo abierto, clases icónicas y acción RPG adictiva.",
    "Final Fantasy VII": "Final Fantasy VII Remake reimagina el RPG clásico con combate en tiempo real y una narrativa expandida.",
    "Persona 5": "Persona 5 Royal es un RPG japonés que combina vida escolar con aventuras sobrenaturales en Tokio.",
    "Starfield": "Starfield es el primer nuevo universo de Bethesda en 25 años, un RPG espacial de exploración y aventura.",
    "God of War Ragnarok": "God of War Ragnarök continúa la saga nórdica de Kratos y Atreus mientras se acerca el fin del mundo.",
    "Warhammer 40000": "Warhammer 40,000: Space Marine 2 es un shooter en tercera persona en el universo grimdark del futuro lejano.",
    "Battelfield 2042": "Battlefield 2042 es un shooter multijugador futurista con mapas masivos y hasta 128 jugadores.",
    "Call of Duty 3": "Call of Duty 3 ofrece intensas batallas de la Segunda Guerra Mundial con campaña y multijugador.",
    "Doom Eternal": "DOOM Eternal es la secuela de DOOM (2016) con combate más rápido, brutal y mecánicas de plataformas.",
    "Halo Infinity": "Halo Infinite continúa la saga del Master Chief con mundo semi-abierto y multijugador gratuito.",
    "Dead Cells": "Dead Cells es un roguevania de acción en 2D con combate brutal y exploración no lineal.",
    "Hades II": "Hades II continúa la saga roguelike de Supergiant Games con nueva protagonista y mecánicas mejoradas.",
    "Brithing of Isac": "The Binding of Isaac es un roguelike de acción con elementos de horror y exploración aleatoria.",
    "Returnal": "Returnal combina shooter en tercera persona con elementos roguelike en un thriller psicológico sci-fi.",
    "Skul": "Skul: The Hero Slayer es un roguelike de acción en 2D donde juegas como un esqueleto con habilidades únicas.",
    "Vampire Survivor": "Vampire Survivors es un juego de supervivencia minimalista con hordas infinitas de criaturas nocturnas.",
    "Bloodborne": "Bloodborne es un action RPG de FromSoftware ambientado en la ciudad gótica de Yharnam llena de horrores cósmicos.",
    "Dark Souls II": "Dark Souls II Scholar of the First Sin ofrece la experiencia souls más refinada con mundo interconectado.",
    "Elden Ring": "Elden Ring es el souls-like más ambicioso de FromSoftware con mundo abierto y mitología de George R.R. Martin.",
    "Lies of P": "Lies of P es un souls-like ambientado en una reinterpretación oscura del cuento de Pinocho.",
    "Sekiro": "Sekiro: Shadows Die Twice es un juego de acción y aventura con combate de katana en el Japón Sengoku.",
    "DayZ": "DayZ es un simulador de supervivencia post-apocalíptico multijugador en un mundo abierto lleno de zombis.",
    "Project Zomboid": "Project Zomboid es un juego de supervivencia isométrico en un mundo infestado de zombis.",
    "Dying Light": "Dying Light combina supervivencia zombie con parkour en una ciudad en cuarentena.",
    "Rust": "Rust es un juego de supervivencia multijugador donde debes sobrevivir en un mundo hostil y traicionero.",
    "Sons of the Forest": "Sons of the Forest es un simulador de supervivencia en primera persona en una isla caníbal.",
    "Ark Survivor": "ARK: Survival Evolved te deja varado en una isla misteriosa llena de dinosaurios y criaturas prehistóricas.",
    "Minecraft": "Minecraft es un juego sandbox de construcción y supervivencia con posibilidades creativas infinitas.",
    "The sims 4": "Los Sims 4 es un simulador de vida donde puedes crear y controlar personas virtuales y sus historias.",
    "Valheim": "Valheim es un juego de supervivencia cooperativo inspirado en la cultura vikinga con elementos de RPG."
  };

  return descriptions[gameTitle] || `Un emocionante juego de ${genre} que ofrece una experiencia única e inmersiva.`;
}

async function importFullDatabase() {
  try {
    console.log('🚀 Iniciando importación completa de la base de datos...');

    // Leer el archivo de datos existente
    const rawData = fs.readFileSync(path.join(__dirname, 'torrentio-database-2025-08-07T20-04-47-686Z.json'), 'utf8');
    const data = JSON.parse(rawData);

    // Limpiar colecciones existentes
    await Game.deleteMany({});
    await Developer.deleteMany({});
    await User.deleteMany({});
    console.log('✅ Colecciones limpiadas');

    // Importar desarrolladores originales + algunos adicionales
    const additionalDevelopers = [
      { name: "Warner Bros Games", founded: new Date("1993-01-01"), country: "Estados Unidos" },
      { name: "Deep Silver", founded: new Date("2002-01-01"), country: "Austria" },
      { name: "Quantic Dream", founded: new Date("1997-01-01"), country: "Francia" },
      { name: "Remedy Entertainment", founded: new Date("1995-08-01"), country: "Finlandia" },
      { name: "Ebb Software", founded: new Date("2013-01-01"), country: "Serbia" },
      { name: "Rocksteady Studios", founded: new Date("2004-12-01"), country: "Reino Unido" }
    ];

    const allDevelopers = [...data.developers.map(dev => ({
      name: dev.name,
      founded: new Date(dev.founded),
      country: dev.country,
      games: []
    })), ...additionalDevelopers];

    await Developer.insertMany(allDevelopers);
    console.log(`✅ ${allDevelopers.length} desarrolladores importados`);

    // Procesar y corregir juegos
    const correctedGames = data.games.map(game => ({
      title: game.title,
      genre: game.genre,
      releaseYear: game.releaseYear,
      weight: game.weight,
      rating: game.rating,
      description: generateUniqueDescription(game.title, game.genre),
      image: game.image,
      developer: correctDeveloper(game.title, game.developer),
      youtubeUrl: game.youtubeUrl && game.youtubeUrl !== "https://www.youtube.com/" ? 
        game.youtubeUrl : `https://www.youtube.com/results?search_query=${encodeURIComponent(game.title)}+trailer`,
      downloadLink: game.downloadLink,
      requirements: game.requirements
    }));

    await Game.insertMany(correctedGames);
    console.log(`✅ ${correctedGames.length} juegos importados con correcciones`);

    // Importar usuarios (hasheando las contraseñas si existen)
    const users = await Promise.all(data.users.map(async user => {
      const hashedPassword = user.password ? 
        await bcrypt.hash(user.password, 10) : 
        await bcrypt.hash('defaultPassword123', 10);
      
      return {
        name: user.name,
        email: user.email,
        password: hashedPassword,
        role: user.role,
        createdAt: new Date(user.createdAt)
      };
    }));

    await User.insertMany(users);
    console.log(`✅ ${users.length} usuarios importados`);

    console.log('🎉 Importación completa exitosa!');
    
    // Mostrar estadísticas finales
    const gameCount = await Game.countDocuments();
    const devCount = await Developer.countDocuments();
    const userCount = await User.countDocuments();
    
    console.log('📊 ESTADÍSTICAS FINALES:');
    console.log(`   🎮 Juegos: ${gameCount}`);
    console.log(`   🏢 Desarrolladores: ${devCount}`);
    console.log(`   👥 Usuarios: ${userCount}`);

    // Mostrar algunos juegos por género
    const genres = await Game.distinct('genre');
    console.log('\n🎯 JUEGOS POR GÉNERO:');
    for (const genre of genres) {
      const count = await Game.countDocuments({ genre });
      console.log(`   ${genre}: ${count} juegos`);
    }

  } catch (error) {
    console.error('❌ Error durante la importación:', error);
  } finally {
    mongoose.connection.close();
  }
}

// Ejecutar la importación
importFullDatabase();
