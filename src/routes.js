const express = require('express');
const characterController = require('./controllers/characterController');
const magicItemController = require('./controllers/magicItemController');

const routes = express.Router();

// Rotas para Personagens
routes.get('/characters', characterController.index);
routes.get('/characters/:id', characterController.show);
routes.post('/characters', characterController.create);
routes.put('/characters/:id', characterController.update);
routes.delete('/characters/:id', characterController.delete);

// Rotas para Itens Mágicos
routes.get('/magic-items', magicItemController.index);
routes.get('/magic-items/:id', magicItemController.show);
routes.post('/magic-items', magicItemController.create);
routes.put('/magic-items/:id', magicItemController.update);
routes.delete('/magic-items/:id', magicItemController.delete);

// Novas rotas para Itens Mágicos
routes.get('/characters/:characterId/magic-items', magicItemController.listByCharacter);
routes.get('/characters/:characterId/amulet', magicItemController.findAmuletByCharacter);

module.exports = routes; 