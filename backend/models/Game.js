import mongoose from 'mongoose';

const gameSchema = new mongoose.Schema({
  title: { type: String, required: true },
  genre: { type: String, required: true },
  releaseYear: { type: Number, required: true },
  weight: { type: Number, required: true },
  rating: { type: Number, default: null },
  description: { type: String },
  image: { type: String },
  developer: { type: String },
  youtubeUrl: { type: String },
  requirements: {
    gpu: { type: String, default: null },
    ram: { type: String, default: null },
    cpu: { type: String, default: null },
  },
  downloadLink: { type: String },
});

const Game = mongoose.model('Game', gameSchema);

export default Game;
