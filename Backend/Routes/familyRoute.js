const express = require('express');
const familyController = require('../Controllers/familyController');
const authController = require('../Controllers/authController');


const router = express.Router();


router.get('/usuariosAssociados', familyController.getUsuariosAssociados);

router.route('/')
    .get(authController.verificaAcesso, familyController.listarFamilias)
    .post(authController.verificaAcesso, familyController.criaFamilia);

router.route('/:id')
    .get(familyController.getFamilia)
    .post(familyController.associaFamilia)
    .delete(familyController.deletaFamilia);

module.exports = router;