const express = require('express');
const entrevistaController = require('../Controllers/entrevistaController');
const authController = require('../Controllers/authController');

const router = express.Router();

router.get('/perguntas', authController.verificaAcesso, entrevistaController.listarPerguntas);

module.exports = router;
