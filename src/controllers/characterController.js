const Character = require('../models/character');
const MagicItem = require('../models/magicItem');

class characterController {
  // Criar um novo personagem
  async create(req, res) {
    try {
      const character = await Character.create(req.body);
      return res.status(201).json(character);
    } catch (error) {
      return res.status(400).json({ error: error.message });
    }
  }

  // Listar todos os personagens
  async index(req, res) {
    try {
      const characters = await Character.find().populate('magicItems');
      const charactersWithTotalStats = characters.map(character => {
        const totalStats = characterController.calculateTotalStats(character);
        return { ...character.toObject(), ...totalStats };
      });
      return res.json(charactersWithTotalStats);
    } catch (error) {
      return res.status(500).json({ error: error.message });
    }
  }

  // Buscar um personagem específico
  async show(req, res) {
    try {
      const character = await Character.findById(req.params.id).populate('magicItems');
      if (!character) {
        return res.status(404).json({ error: 'Personagem não encontrado' });
      }
      const totalStats = characterController.calculateTotalStats(character);
      return res.json({ ...character.toObject(), ...totalStats });
    } catch (error) {
      return res.status(500).json({ error: error.message });
    }
  }

  // Atualizar nome aventureiro
  async update(req, res) {
    try {
      const { nomeAventureiro } = req.body;
      const character = await Character.findByIdAndUpdate(
        req.params.id,
        { nomeAventureiro },
        { new: true }
      ).populate('magicItems');
      
      if (!character) {
        return res.status(404).json({ error: 'Personagem não encontrado' });
      }
      
      const totalStats = characterController.calculateTotalStats(character);
      return res.json({ ...character.toObject(), ...totalStats });
    } catch (error) {
      return res.status(400).json({ error: error.message });
    }
  }

  // Deletar um personagem
  async delete(req, res) {
    try {
      const character = await Character.findByIdAndDelete(req.params.id);
      if (!character) {
        return res.status(404).json({ error: 'Personagem não encontrado' });
      }
      return res.status(204).send();
    } catch (error) {
      return res.status(500).json({ error: error.message });
    }
  }

  // Calcular estatísticas totais (força e defesa) incluindo itens mágicos
  static calculateTotalStats(character) {
    const totalForca = character.magicItems.reduce((sum, item) => sum + item.forca, character.forca);
    const totalDefesa = character.magicItems.reduce((sum, item) => sum + item.defesa, character.defesa);
    
    return {
      forcaTotal: totalForca,
      defesaTotal: totalDefesa
    };
  }
}

module.exports = new characterController(); 