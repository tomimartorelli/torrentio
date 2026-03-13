import User from '../models/User.js';
import Game from '../models/Game.js';
import Developer from '../models/Developer.js';

export const getAppStats = async (req, res) => {
  try {
    // Obtener conteos de todas las colecciones en paralelo
    const [usersCount, gamesCount, developersCount] = await Promise.all([
      User.countDocuments(),
      Game.countDocuments(),
      Developer.countDocuments()
    ]);

    // Calcular estadísticas adicionales
    const estimatedDownloads = gamesCount * 150; // Estimación basada en juegos disponibles

    // Obtener fecha de último usuario registrado
    const latestUser = await User.findOne({}, {}, { sort: { 'createdAt': -1 } });
    const lastUserDate = latestUser ? latestUser.createdAt : new Date();

    const stats = {
      users: usersCount,
      games: gamesCount,
      developers: developersCount,
      downloads: estimatedDownloads,
      lastUpdate: new Date(),
      lastUserRegistration: lastUserDate,
      // Estadísticas adicionales
      avgGamesPerDeveloper: developersCount > 0 ? Math.round(gamesCount / developersCount) : 0,
      growth: {
        users: usersCount,
        games: gamesCount,
        developers: developersCount
      }
    };

    res.json({
      success: true,
      data: stats,
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error('Error fetching app stats:', error);
    res.status(500).json({
      success: false,
      message: 'Error al obtener estadísticas de la aplicación',
      error: error.message
    });
  }
};

export const getDetailedStats = async (req, res) => {
  try {
    // Estadísticas más detalladas para admin
    const [
      usersCount,
      gamesCount,
      developersCount,
      recentUsers,
      topGenres,
      topDevelopers
    ] = await Promise.all([
      User.countDocuments(),
      Game.countDocuments(),
      Developer.countDocuments(),
      User.find({}, { name: 1, email: 1, createdAt: 1 })
        .sort({ createdAt: -1 })
        .limit(5),
      Game.aggregate([
        { $group: { _id: '$genre', count: { $sum: 1 } } },
        { $sort: { count: -1 } },
        { $limit: 5 }
      ]),
      Game.aggregate([
        { $group: { _id: '$developer', count: { $sum: 1 } } },
        { $sort: { count: -1 } },
        { $limit: 5 }
      ])
    ]);

    const detailedStats = {
      overview: {
        users: usersCount,
        games: gamesCount,
        developers: developersCount,
        estimatedDownloads: gamesCount * 150
      },
      recent: {
        users: recentUsers
      },
      analytics: {
        topGenres: topGenres.map(genre => ({
          name: genre._id,
          count: genre.count
        })),
        topDevelopers: topDevelopers.map(dev => ({
          name: dev._id,
          count: dev.count
        }))
      },
      lastUpdate: new Date()
    };

    res.json({
      success: true,
      data: detailedStats,
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error('Error fetching detailed stats:', error);
    res.status(500).json({
      success: false,
      message: 'Error al obtener estadísticas detalladas',
      error: error.message
    });
  }
};
