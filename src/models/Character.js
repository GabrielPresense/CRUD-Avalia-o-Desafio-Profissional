const mongoose = require('mongoose');

const characterSchema = new mongoose.Schema({
  nome: {
    type: String,
    required: true,
    trim: true
  },
  nomeAventureiro: {
    type: String,
    required: true,
    trim: true
  },
  classe: {
    type: String,
    required: true,
    enum: ['Guerreiro', 'Mago', 'Arqueiro', 'Ladino', 'Bardo']
  },
  level: {
    type: Number,
    required: true,
    min: 1,
    max: 100
  },
  forca: {
    type: Number,
    required: true,
    min: 0,
    max: 10
  },
  defesa: {
    type: Number,
    required: true,
    min: 0,
    max: 10
  },
  magicItems: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'MagicItem'
  }],
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// Validação para garantir que a soma de força + defesa = 10
characterSchema.pre('save', function(next) {
  if (this.forca + this.defesa !== 10) {
    next(new Error('A soma de força e defesa deve ser igual a 10'));
  }
  next();
});

module.exports = mongoose.model('Character', characterSchema); 