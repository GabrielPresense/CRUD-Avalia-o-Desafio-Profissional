const MagicItem = require('../models/magicItem');
const Character = require('../models/character');

class magicItemController {
  // Criar um novo item mágico
  async create(req, res) {
    try {
      const { character: characterId } = req.body;
      
      // Verificar se o personagem existe
      const character = await Character.findById(characterId);
      if (!character) {
        return res.status(404).json({ error: 'Personagem não encontrado' });
      }

      const magicItem = await MagicItem.create(req.body);
      
      // Adicionar o item à lista de itens do personagem
      await Character.findByIdAndUpdate(
        characterId,
        { $push: { magicItems: magicItem._id } }
      );

      return res.status(201).json(magicItem);
    } catch (error) {
      return res.status(400).json({ error: error.message });
    }
  }

  // Listar todos os itens mágicos
  async index(req, res) {
    try {
      const magicItems = await MagicItem.find().populate('character');
      return res.json(magicItems);
    } catch (error) {
      return res.status(500).json({ error: error.message });
    }
  }

  // Buscar um item mágico específico
  async show(req, res) {
    try {
      const magicItem = await MagicItem.findById(req.params.id).populate('character');
      if (!magicItem) {
        return res.status(404).json({ error: 'Item mágico não encontrado' });
      }
      return res.json(magicItem);
    } catch (error) {
      return res.status(500).json({ error: error.message });
    }
  }

  // Atualizar um item mágico
  async update(req, res) {
    try {
      const { character: characterId } = req.body;
      
      if (characterId) {
        // Verificar se o novo personagem existe
        const character = await Character.findById(characterId);
        if (!character) {
          return res.status(404).json({ error: 'Personagem não encontrado' });
        }
      }

      const magicItem = await MagicItem.findByIdAndUpdate(
        req.params.id,
        req.body,
        { new: true }
      ).populate('character');

      if (!magicItem) {
        return res.status(404).json({ error: 'Item mágico não encontrado' });
      }
      return res.json(magicItem);
    } catch (error) {
      return res.status(400).json({ error: error.message });
    }
  }

  // Deletar um item mágico
  async delete(req, res) {
    try {
      const magicItem = await MagicItem.findById(req.params.id);
      if (!magicItem) {
        return res.status(404).json({ error: 'Item mágico não encontrado' });
      }

      // Remover o item da lista de itens do personagem
      if (magicItem.character) {
        await Character.findByIdAndUpdate(
          magicItem.character,
          { $pull: { magicItems: magicItem._id } }
        );
      }

      await magicItem.deleteOne();
      return res.status(204).send();
    } catch (error) {
      return res.status(500).json({ error: error.message });
    }
  }

  // Listar itens mágicos por personagem
  async listByCharacter(req, res) {
    try {
      const { characterId } = req.params;
      const magicItems = await MagicItem.find({ character: characterId });
      return res.json(magicItems);
    } catch (error) {
      return res.status(500).json({ error: error.message });
    }
  }

  // Buscar amuleto do personagem
  async findAmuletByCharacter(req, res) {
    try {
      const { characterId } = req.params;
      const amulet = await MagicItem.findOne({
        character: characterId,
        tipo: 'Amuleto'
      });
      
      if (!amulet) {
        return res.status(404).json({ error: 'Amuleto não encontrado para este personagem' });
      }
      
      return res.json(amulet);
    } catch (error) {
      return res.status(500).json({ error: error.message });
    }
  }
}

module.exports = new magicItemController(); 