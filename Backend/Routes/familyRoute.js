const express = require('express');
const familyController = require('../Controllers/familyController');
const authController = require('../Controllers/authController');


const router = express.Router();


router.route('/')
    .get(authController.verificaAcesso, familyController.listarFamilias)
    .post(authController.verificaAcesso, familyController.criaFamilia);

router.route('/:id')
    .get(familyController.getFamilia)
    .post(familyController.associaFamilia);

module.exports = router;