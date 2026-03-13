import Game from '../models/Game.js';

export const createGame = async (req, res) => {
  try {
    const {
      title,
      genre,
      releaseYear,
      rating,
      description,
      weight,
      developer,
      youtubeUrl,
      requirements,
      downloadLink,
    } = req.body;

    if (!title || !genre || !releaseYear || !weight) {
      return res.status(400).json({ message: 'Missing required fields' });
    }

    const parsedRequirements = requirements ? requirements : {};
    const releaseYearNum = releaseYear ? Number(releaseYear) : null;
    const weightNum = weight ? Number(weight) : null;

    const newGame = new Game({
      title,
      genre,
      releaseYear: releaseYearNum,
      weight: weightNum,
      rating: rating ? Number(rating) : null,
      description,
      image: req.file ? req.file.path : null,
      developer,
      youtubeUrl,
      requirements: {
        gpu: parsedRequirements.gpu || null,
        ram: parsedRequirements.ram || null,
        cpu: parsedRequirements.cpu || null,
      },
      downloadLink,
    });

    await newGame.save();
    res.status(201).json(newGame);
  } catch (error) {
    if (error.name === 'ValidationError') {
      console.error('Validation Error:', error.message);
      return res.status(400).json({ message: 'Validation Error', details: error.errors });
    }
    console.error('Error creating game:', error.message);
    res.status(500).json({ message: 'Error creating game', error: error.message });
  }
};

export const getAllGames = async (req, res) => {
  try {
    const games = await Game.find();
    res.status(200).json(games);
  } catch (error) {
    console.error('Error fetching games:', error);
    res.status(500).json({ message: 'Error fetching games', error: error.message });
  }
};

export const getGamesByCategory = async (req, res) => {
  try {
    const { genre } = req.params;
    const games = await Game.find({ genre });

    if (games.length === 0) {
      return res.status(404).json({ message: 'No se encontraron juegos para esta categoría' });
    }

    res.status(200).json(games);
  } catch (error) {
    console.error('Error fetching games by category:', error);
    res.status(500).json({ message: 'Error fetching games by category', error: error.message });
  }
};

export const updateGame = async (req, res) => {
  try {
    const gameId = req.params.id;
    const updatedData = { ...req.body };

    if (req.files?.image) {
      updatedData.image = req.files.image[0].path;
    }
    if (req.files?.gallery) {
      updatedData.gallery = req.files.gallery.map((file) => file.path);
    }

    const updatedGame = await Game.findByIdAndUpdate(gameId, updatedData, {
      new: true,
    });

    if (!updatedGame) {
      return res.status(404).json({ message: 'Juego no encontrado' });
    }

    res.status(200).json(updatedGame);
  } catch (error) {
    console.error('Error updating game:', error);
    res.status(500).json({ message: 'Error updating game', error: error.message });
  }
};

export const deleteGame = async (req, res) => {
  try {
    const gameId = req.params.id;
    const deletedGame = await Game.findByIdAndDelete(gameId);

    if (!deletedGame) {
      return res.status(404).json({ message: 'Juego no encontrado' });
    }

    res.status(200).json({ message: 'Juego eliminado con éxito' });
  } catch (error) {
    console.error('Error deleting game:', error);
    res.status(500).json({ message: 'Error deleting game', error: error.message });
  }
};
