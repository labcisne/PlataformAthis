const User = require('../Models/userModel');
const Family = require('../Models/familyModel')
const jwt = require('jsonwebtoken');
const util = require('node:util');
const asyncErrorHandler = require('../Utils/asyncErrorHandler');
const CustomError = require('../Utils/customError');
const crypto = require('node:crypto');


function signToken(id, role){

    return jwt.sign({id, role}, process.env.SECRET_STR, {
        expiresIn: process.env.LOGIN_EXPIRES
    });
}


exports.criarUsuario = asyncErrorHandler(async (req, res, next) => {

    const newUser = await User.create(req.body);

    res.status(201).json({
        status: 'success',
        data: {
            newUser
        }
    })
});


exports.primeiroAcesso = asyncErrorHandler(async (req, res, next) => {

    const users = await User.find();

    res.status(200).json({
        status: "success",
        length: users.length
    });

});

exports.login = asyncErrorHandler(async (req, res, next) => {

    if(!req.body.login || !req.body.senha){
        throw new CustomError('Entre com as credenciais do usuário!', 400);
    }

    const user = await User.findOne({login: req.body.login}).select('+senha');

    if(!user || !(await user.verificaSenha(req.body.senha, user.senha))){
        throw new CustomError('Login ou senha incorreto!', 401);
    }

    const token = signToken(user._id, user.tipoUsuario);

    res.cookie("authToken", token, {
        httpOnly: true,
        secure: false, //em produção bota pra true com um HTTPS
        sameSite: "strict",
    });

    res.status(200).json({
        status: 'success',
        user,
        token
    });
});


exports.verificaLogin = asyncErrorHandler(async (req, res, next) => {

    //verifica se o token exite
    const token = req.cookies.authToken;

    if(!token){
        throw new CustomError('Faça login para continuar!', 401);
    }

    //valida o token
    const decodedToken = await util.promisify(jwt.verify)(token, process.env.SECRET_STR);

    //verifica se o usuário existe no banco de dados
    const user = await User.findById(decodedToken.id);

    if(!user){
        throw new CustomError('Usuário não existe!', 401);
    }

    //caso o usuário tenha mudado a senha recentemente
    if(user.mudouSenhaRecentemente(decodedToken.iat)){
        throw new CustomError('Senha alterada recentemente. Faça login para continuar.', 401);
    }

    res.status(200).json({
        status:'success',
        user
    });
}); 


exports.verificaAcesso = asyncErrorHandler(async (req, res, next) => {
    
    //verifica se o token exite
    
    const token = req.cookies.authToken;

    if(!token){
        throw new CustomError('Faça login para continuar!', 401);
    }

    //valida o token
    const decodedToken = await util.promisify(jwt.verify)(token, process.env.SECRET_STR);

    //verifica se o usuário existe no banco de dados
    const user = await User.findById(decodedToken.id);

    if(!user){
        throw new CustomError('Usuário não existe!', 401);
    }

    //caso o usuário tenha mudado a senha recentemente
    if(user.mudouSenhaRecentemente(decodedToken.iat)){
        throw new CustomError('Senha alterada recentemente. Faça login para continuar.', 401);
    }

    req.user = user;
    next();
});


exports.verificaTipoUsuario = (...userType) => {

    return (req, res, next) => {

        if(userType.includes(req.user.tipoUsuario)){
            next();
        }
        else{
            next(new CustomError('Você não tem permissão para essa ação', 401));
        }
    }
}


exports.achaUsuario = asyncErrorHandler(async (req, res, next) => {

    const user = await User.findOne(req.body);

    if(!user){
        throw new CustomError('Usuário não existe!', 404);
    }

    res.status(200).json({
        status: 'success',
        link: `http://localhost:3000/esqueciMinhaSenha/usuario/${user._id}`
    })
});


exports.getPerguntaSeguranca = asyncErrorHandler(async (req, res, next) => {

    const user = await User.findById(req.params.id).select('+perguntaSeguranca');

    res.status(200).json({
        status: 'success',
        perguntaSeguranca: user.perguntaSeguranca
    });
});


exports.esqueciMinhaSenha = asyncErrorHandler (async (req, res, next) => {

    const user = await User.findById(req.params.id).select('+respostaSeguranca');

    if(!(await user.verificaSenha(req.body.respostaSeguranca, user.respostaSeguranca))){
        throw new CustomError('Resposta de segurança incorreta', 400);
    }

    const tokenResetSenha = user.geraTokenResetSenha();
    await user.save({validateBeforeSave: false});

    res.status(200).json({
        status: 'success',
        message: 'O token abaixo irá expirar em 10 minutos!',
        link: `http://localhost:3000/resetaSenha/${tokenResetSenha}`
    });
});


exports.resetaSenha = asyncErrorHandler(async (req, res, next) => {

    const token = crypto.createHash('sha256').update(req.params.resetToken).digest('hex');
    const user = await User.findOne({
        tokenResetSenha: token,
        tokenResetSenhaExpira: {$gt: Date.now()}
    });

    if(!user){
        throw new CustomError('Token para troca de senha invalido!', 401);
    }

    user.senha = req.body.novaSenha;
    user.confirmarSenha = req.body.confirmarNovaSenha;
    user.tokenResetSenha = undefined;
    user.tokenResetSenhaExpira = undefined;
    user.senhaAlteradaEm = Date.now();

    await user.save();

    res.status(200).json({
        status: 'success',
        message: 'Senha modificada!'
    });
});


exports.alterarSenha = asyncErrorHandler(async (req, res, next) => {

    let user;

    if(req.body.id){

        user = await User.findById(req.body.id).select('+senha');

        user.senha = req.body.novaSenha;
        user.confirmarSenha = req.body.confirmarNovaSenha;
        user.senhaAlteradaEm = Date.now();
        await user.save({validateModifiedOnly: true});
    }
    else{

        user = await User.findById(req.user._id).select('+senha');
        const senhaAtual = req.body.senhaAtual;
    
        if(!senhaAtual || !(await user.verificaSenha(senhaAtual, user.senha))){
            throw new CustomError('Senha atual incorreta!', 400);
        }
    
        user.senha = req.body.novaSenha;
        user.confirmarSenha = req.body.confirmarNovaSenha;
        user.senhaAlteradaEm = Date.now();
        await user.save({validateModifiedOnly: true});
    }

    res.status(200).json({
        status: 'success',
        message: 'Senha alterada com sucesso!'
    });
});


exports.alterarDadosPessoais = asyncErrorHandler (async (req, res, next) => {

    let updatedUser;

    if(req.body.id){
        updatedUser = await User.findByIdAndUpdate(req.body.id, req.body.obj, {new: true, runValidators: true});

    }
    else{ //Possivelmente ajeitar esse código abaixo por conta do req.body
        updatedUser = await User.findByIdAndUpdate(req.user._id, req.body, {new: true, runValidators: true});
    }

    if(!updatedUser){
        throw new CustomError('Usuario nao encontrado', 404);
    }

    //implementar o log de quando a modificação foi feita

    res.status(200).json({
        status: 'success',
        message: 'Dados pessoais alterados com sucesso!',
        updatedUser
    });
});


exports.getUsuarios = asyncErrorHandler(async (req, res, next) => {

    const users = await User.find({ _id: { $ne: req.user._id } });

    if(!users){
        throw new CustomError('Usuarios não encontrados', 404);
    }

    res.status(200).json({
        status: 'success',
        users
    });
});


exports.getUsuariosParaAssociar = asyncErrorHandler(async (req, res, next) => {

    const users = await User.find({
        tipoUsuario: { $in: ["Entrevistador", "Lider Comunitario"] },
        familiasAssociadas: { $ne: req.query.familiaId },
    });
    
    if(!users){
        throw new CustomError('Usuarios não encontrados', 404);
    }

    res.status(200).json({
        status: 'success',
        users
    });
});

exports.getUsuario = asyncErrorHandler(async (req, res, next) => {

    const user = await User.findById(req.params.id).select("+perguntaSeguranca +dataCadastro");

    if(!user){
        throw new CustomError('Usuario não encontrado', 404);
    }

    res.status(200).json({
        status: 'success',
        user
    });
});


exports.deletaUsuario = asyncErrorHandler(async(req, res, next) => {

    const userToDelete = await User.findById(req.params.id);

    if(!userToDelete){
        throw new CustomError('Usuario não encontrado', 404);
    }

    const families = await Family.find({_id: { $in: userToDelete.familiasAssociadas }});
    if(families){
        families.forEach(async (family) => {
            const idx = family.usuariosAssociados.indexOf(req.params.id);
            family.usuariosAssociados.splice(idx, 1);
            await family.save({validateBeforeSave: false});
        })
    }

    await User.findByIdAndDelete(req.params.id);

    res.status(200).json({
        status: 'success',
        message: 'Usuário deletado com sucesso!'
    })
});

exports.alteraPerguntaSeguranca = asyncErrorHandler(async (req, res, next) => {

    let user;

    const novaPerguntaSeguranca = req.body.novaPerguntaSeguranca;
    const novaRespostaSeguranca = req.body.novaRespostaSeguranca;
    const respostaSegurancaAtual = req.body.respostaSegurancaAtual;

    if(req.body.id){
        user = await User.findById(req.body.id).select('+perguntaSeguranca +respostaSeguranca');

        user.perguntaSeguranca = novaPerguntaSeguranca;
        user.respostaSeguranca = novaRespostaSeguranca;

        await user.save({validateModifiedOnly: true});
    }
    else{

        user = await User.findById(req.user._id).select('+perguntaSeguranca +respostaSeguranca');

        if(!respostaSegurancaAtual || !(await user.verificaSenha(respostaSegurancaAtual, user.respostaSeguranca))){
            throw new CustomError('Resposta de seguraça atual incorreta!', 400);
        }

        user.perguntaSeguranca = novaPerguntaSeguranca;
        user.respostaSeguranca = novaRespostaSeguranca;

        await user.save({validateModifiedOnly: true});
    }

    res.status(200).json({
        status: 'success',
        message: 'Pergunta de seguraça alterada com sucesso!'
    });
});