const express = require('express');
const authController = require('../Controllers/authController');

const router = express.Router();

router.get('/protected', authController.verificaLogin);

router.route('/criarUsuario').post(authController.verificaAcesso, authController.verificaTipoUsuario("Administrador"), authController.criarUsuario)
                             
router.route('/usuarios').get(authController.verificaAcesso, authController.verificaTipoUsuario("Administrador"), authController.getUsuarios);

router.route('/usuarios/:id')
    .get(authController.getUsuario)
    .delete(authController.deletaUsuario);

router.route('/usuariosParaAssociar').get(authController.verificaAcesso, authController.verificaTipoUsuario("Administrador", "Entrevistador"), authController.getUsuariosParaAssociar);

router.route('/').post(authController.login);

router.route('/esqueciMinhaSenha').post(authController.achaUsuario);
router.route('/esqueciMinhaSenha/usuario/:id').get(authController.getPerguntaSeguranca);
router.route('/esqueciMinhaSenha/usuario/:id').post(authController.esqueciMinhaSenha);
router.route('/resetaSenha/:resetToken').patch(authController.resetaSenha);

router.route('/alterarSenha').patch(authController.verificaAcesso, authController.alterarSenha);
router.route('/alterarDadosPessoais').patch(authController.verificaAcesso, authController.alterarDadosPessoais);
router.patch('/alterarPerguntaSeguranca', authController.verificaAcesso, authController.alteraPerguntaSeguranca);

module.exports = router;