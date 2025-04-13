const mongoose = require('mongoose');

const magicItemSchema = new mongoose.Schema({
  nome: {
    type: String,
    required: true,
    trim: true
  },
  tipo: {
    type: String,
    required: true,
    enum: ['Arma', 'Armadura', 'Amuleto']
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
  character: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Character'
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// Validações específicas para cada tipo de item
magicItemSchema.pre('save', async function(next) {
  // Arma: defesa = 0
  if (this.tipo === 'Arma' && this.defesa !== 0) {
    next(new Error('Arma deve ter defesa igual a 0'));
  }

  // Armadura: forca = 0
  if (this.tipo === 'Armadura' && this.forca !== 0) {
    next(new Error('Armadura deve ter força igual a 0'));
  }

  // Não pode ter força e defesa = 0
  if (this.forca === 0 && this.defesa === 0) {
    next(new Error('Item não pode ter força e defesa igual a 0'));
  }

  // Verificar se personagem já tem amuleto
  if (this.tipo === 'Amuleto' && this.character) {
    const existingAmulet = await this.constructor.findOne({
      tipo: 'Amuleto',
      character: this.character
    });
    
    if (existingAmulet && !existingAmulet._id.equals(this._id)) {
      next(new Error('Personagem já possui um amuleto'));
    }
  }

  next();
});

module.exports = mongoose.model('MagicItem', magicItemSchema); 