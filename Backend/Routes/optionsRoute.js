const express = require('express');
const optionsController = require('../Controllers/optionsController');


const router = express.Router();

router.route('/:nome')
    .get(optionsController.getListaDeOpcoes)
    .post(optionsController.adicionaNaListaDeOpcoes);


module.exports = router;