require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const routes = require('./routes');

const app = express();

// Middlewares
app.use(cors());
app.use(express.json());

// Rotas
app.use(routes);

// Conexão com o MongoDB
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/rpg-database', {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => console.log('Conectado ao MongoDB'))
.catch(err => console.error('Erro ao conectar ao MongoDB:', err));

// Iniciar o servidor
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
}); 