import mongoose from 'mongoose';

const DeveloperSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  founded: {
    type: Date,
    required: false
  },
  country: {
    type: String,
    required: true,
    trim: true
  },
  games: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Game'
  }]
});

const Developer = mongoose.model('Developer', DeveloperSchema);
export default Developer;