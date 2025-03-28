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
    .delete(familyController.deletaFamilia)
    .patch(familyController.editaFamilia);

router.post('/entrevista/facilities', familyController.enviaFormularioFacilities);

router.post('/entrevista/estrutural', familyController.enviaFormularioEstrutural);

router.route('/upload/imagem/:id')
    .post(familyController.fazUploadImagem.single('image'), familyController.insereNovaImagem)
    .delete(familyController.deletaImagem)
    .patch(familyController.editaDescricaoImagem);

router.route('/upload/arquivo/:id')
    .post(familyController.fazUploadArquivo.single('arquivo'), familyController.insereNovoArquivo)
    .delete(familyController.deletaArquivo)
    .patch(familyController.editaDescricaoArquivo);

module.exports = router;