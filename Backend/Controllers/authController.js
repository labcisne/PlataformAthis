const prisma = require('../Utils/prisma');
const jwt = require('jsonwebtoken');
const util = require('node:util');
const crypto = require('node:crypto');
const asyncErrorHandler = require('../Utils/asyncErrorHandler');
const CustomError = require('../Utils/customError');

const {
    hashSenha,
    hashRespostaSeguranca,
    verificaSenha,
    mudouSenhaRecentemente,
    geraTokenResetSenha
} = require('../Utils/userHelpers');

const {
    mapUserTypeToPrisma,
    mapSecurityQuestionToPrisma,
    mapSecurityQuestionFromPrisma,
    formatUser
} = require('../Utils/mapper');

function signToken(id, role){
    return jwt.sign({id, role}, process.env.SECRET_STR, {
        expiresIn: process.env.LOGIN_EXPIRES
    });
}

exports.criarUsuario = asyncErrorHandler(async (req, res, next) => {
    const { login, senha, confirmarSenha, tipoUsuario, nome, email, perguntaSeguranca, respostaSeguranca } = req.body;

    if (!login || !senha || !confirmarSenha || !tipoUsuario || !nome || !perguntaSeguranca || !respostaSeguranca) {
        throw new CustomError('Campos obrigatórios ausentes!', 400);
    }
    if (senha !== confirmarSenha) {
        throw new CustomError('As senhas não são iguais.', 400);
    }
    if (senha.length < 8) {
        throw new CustomError('A senha precisa ter, ao menos, 8 caracteres.', 400);
    }

    const hashedSenha = await hashSenha(senha);
    const hashedRespostaSeguranca = await hashRespostaSeguranca(respostaSeguranca);

    const newUser = await prisma.user.create({
        data: {
            login,
            senha: hashedSenha,
            tipoUsuario: mapUserTypeToPrisma(tipoUsuario),
            nome,
            email: email || null,
            perguntaSeguranca: mapSecurityQuestionToPrisma(perguntaSeguranca),
            respostaSeguranca: hashedRespostaSeguranca
        }
    });

    res.status(201).json({
        status: 'success',
        data: {
            newUser: formatUser(newUser)
        }
    });
});

exports.primeiroAcesso = asyncErrorHandler(async (req, res, next) => {
    const userCount = await prisma.user.count();

    res.status(200).json({
        status: "success",
        length: userCount
    });
});

exports.login = asyncErrorHandler(async (req, res, next) => {
    const { login, senha } = req.body;

    if(!login || !senha){
        throw new CustomError('Entre com as credenciais do usuário!', 400);
    }

    const user = await prisma.user.findUnique({
        where: { login },
        include: {
            memberships: true
        }
    });

    if(!user || !(await verificaSenha(senha, user.senha))){
        throw new CustomError('Login ou senha incorreto!', 401);
    }

    // Apenas Administrador e Entrevistador têm acesso ao sistema
    if (user.tipoUsuario !== 'Administrador' && user.tipoUsuario !== 'Entrevistador') {
        throw new CustomError('Acesso negado para este tipo de usuário!', 403);
    }

    const token = signToken(user.id, user.tipoUsuario);

    res.cookie("authToken", token, {
        httpOnly: true,
        secure: false, //em produção bota pra true com um HTTPS
        sameSite: "strict",
    });

    res.status(200).json({
        status: 'success',
        user: formatUser(user),
        token
    });
});

exports.verificaLogin = asyncErrorHandler(async (req, res, next) => {
    const token = req.cookies.authToken;

    if(!token){
        throw new CustomError('Faça login para continuar!', 401);
    }

    const decodedToken = await util.promisify(jwt.verify)(token, process.env.SECRET_STR);

    const user = await prisma.user.findUnique({
        where: { id: decodedToken.id },
        include: {
            memberships: true
        }
    });

    if(!user){
        throw new CustomError('Usuário não existe!', 401);
    }

    if (user.tipoUsuario !== 'Administrador' && user.tipoUsuario !== 'Entrevistador') {
        throw new CustomError('Acesso negado para este tipo de usuário!', 403);
    }

    if(mudouSenhaRecentemente(user.senhaAlteradaEm, decodedToken.iat)){
        throw new CustomError('Senha alterada recentemente. Faça login para continuar.', 401);
    }

    res.status(200).json({
        status:'success',
        user: formatUser(user)
    });
}); 

exports.verificaAcesso = asyncErrorHandler(async (req, res, next) => {
    const token = req.cookies.authToken;

    if(!token){
        throw new CustomError('Faça login para continuar!', 401);
    }

    const decodedToken = await util.promisify(jwt.verify)(token, process.env.SECRET_STR);

    const user = await prisma.user.findUnique({
        where: { id: decodedToken.id },
        include: {
            memberships: true
        }
    });

    if(!user){
        throw new CustomError('Usuário não existe!', 401);
    }

    if (user.tipoUsuario !== 'Administrador' && user.tipoUsuario !== 'Entrevistador') {
        throw new CustomError('Acesso negado para este tipo de usuário!', 403);
    }

    if(mudouSenhaRecentemente(user.senhaAlteradaEm, decodedToken.iat)){
        throw new CustomError('Senha alterada recentemente. Faça login para continuar.', 401);
    }

    req.user = formatUser(user);
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
    const queryData = { ...req.body };
    if (queryData.tipoUsuario) queryData.tipoUsuario = mapUserTypeToPrisma(queryData.tipoUsuario);
    if (queryData.perguntaSeguranca) queryData.perguntaSeguranca = mapSecurityQuestionToPrisma(queryData.perguntaSeguranca);

    const user = await prisma.user.findFirst({
        where: queryData
    });

    if(!user){
        throw new CustomError('Usuário não existe!', 404);
    }

    res.status(200).json({
        status: 'success',
        link: `http://localhost:3000/esqueciMinhaSenha/usuario/${user.id}`
    })
});

exports.getPerguntaSeguranca = asyncErrorHandler(async (req, res, next) => {
    const user = await prisma.user.findUnique({
        where: { id: req.params.id }
    });

    if(!user){
        throw new CustomError('Usuário não encontrado', 404);
    }

    res.status(200).json({
        status: 'success',
        perguntaSeguranca: mapSecurityQuestionFromPrisma(user.perguntaSeguranca)
    });
});

exports.esqueciMinhaSenha = asyncErrorHandler(async (req, res, next) => {
    const user = await prisma.user.findUnique({
        where: { id: req.params.id }
    });

    if(!user){
        throw new CustomError('Usuário não encontrado', 404);
    }

    if(!(await verificaSenha(req.body.respostaSeguranca, user.respostaSeguranca))){
        throw new CustomError('Resposta de segurança incorreta', 400);
    }

    const { resetToken, tokenResetSenha, tokenResetSenhaExpira } = geraTokenResetSenha();

    await prisma.user.update({
        where: { id: user.id },
        data: {
            tokenResetSenha,
            tokenResetSenhaExpira
        }
    });

    res.status(200).json({
        status: 'success',
        message: 'O token abaixo irá expirar em 10 minutos!',
        link: `http://localhost:3000/resetaSenha/${resetToken}`
    });
});

exports.resetaSenha = asyncErrorHandler(async (req, res, next) => {
    const token = crypto.createHash('sha256').update(req.params.resetToken).digest('hex');
    const user = await prisma.user.findFirst({
        where: {
            tokenResetSenha: token,
            tokenResetSenhaExpira: {
                gt: new Date()
            }
        }
    });

    if(!user){
        throw new CustomError('Token para troca de senha invalido!', 401);
    }

    if (req.body.novaSenha !== req.body.confirmarNovaSenha) {
        throw new CustomError('As senhas não são iguais.', 400);
    }
    if (req.body.novaSenha.length < 8) {
        throw new CustomError('A senha precisa ter, ao menos, 8 caracteres.', 400);
    }

    const hashedSenha = await hashSenha(req.body.novaSenha);

    await prisma.user.update({
        where: { id: user.id },
        data: {
            senha: hashedSenha,
            tokenResetSenha: null,
            tokenResetSenhaExpira: null,
            senhaAlteradaEm: new Date()
        }
    });

    res.status(200).json({
        status: 'success',
        message: 'Senha modificada!'
    });
});

exports.alterarSenha = asyncErrorHandler(async (req, res, next) => {
    let user;

    if(req.body.id){
        user = await prisma.user.findUnique({
            where: { id: req.body.id }
        });
        if(!user) throw new CustomError('Usuário não encontrado', 404);

        if (req.body.novaSenha !== req.body.confirmarNovaSenha) {
            throw new CustomError('As senhas não são iguais.', 400);
        }
        if (req.body.novaSenha.length < 8) {
            throw new CustomError('A senha precisa ter, ao menos, 8 caracteres.', 400);
        }

        const hashedSenha = await hashSenha(req.body.novaSenha);

        await prisma.user.update({
            where: { id: user.id },
            data: {
                senha: hashedSenha,
                senhaAlteradaEm: new Date()
            }
        });
    }
    else{
        user = await prisma.user.findUnique({
            where: { id: req.user._id }
        });
        if(!user) throw new CustomError('Usuário não encontrado', 404);

        const senhaAtual = req.body.senhaAtual;
    
        if(!senhaAtual || !(await verificaSenha(senhaAtual, user.senha))){
            throw new CustomError('Senha atual incorreta!', 400);
        }
    
        if (req.body.novaSenha !== req.body.confirmarNovaSenha) {
            throw new CustomError('As senhas não são iguais.', 400);
        }
        if (req.body.novaSenha.length < 8) {
            throw new CustomError('A senha precisa ter, ao menos, 8 caracteres.', 400);
        }

        const hashedSenha = await hashSenha(req.body.novaSenha);

        await prisma.user.update({
            where: { id: user.id },
            data: {
                senha: hashedSenha,
                senhaAlteradaEm: new Date()
            }
        });
    }

    res.status(200).json({
        status: 'success',
        message: 'Senha alterada com sucesso!'
    });
});

exports.alterarDadosPessoais = asyncErrorHandler (async (req, res, next) => {
    let updatedUser;
    const targetId = req.body.id || req.user._id;
    const updateData = req.body.id ? req.body.obj : req.body;

    const dataToUpdate = {};
    if (updateData.nome !== undefined) dataToUpdate.nome = updateData.nome;
    if (updateData.email !== undefined) dataToUpdate.email = updateData.email;
    if (updateData.login !== undefined) dataToUpdate.login = updateData.login;

    dataToUpdate.ultimaModificacao = new Date();

    updatedUser = await prisma.user.update({
        where: { id: targetId },
        data: dataToUpdate,
        include: {
            memberships: true
        }
    });

    if(!updatedUser){
        throw new CustomError('Usuario nao encontrado', 404);
    }

    res.status(200).json({
        status: 'success',
        message: 'Dados pessoais alterados com sucesso!',
        updatedUser: formatUser(updatedUser)
    });
});

exports.getUsuarios = asyncErrorHandler(async (req, res, next) => {
    const users = await prisma.user.findMany({
        where: {
            id: {
                not: req.user._id
            }
        },
        include: {
            memberships: true
        }
    });

    res.status(200).json({
        status: 'success',
        users: users.map(user => formatUser(user))
    });
});

exports.getUsuariosParaAssociar = asyncErrorHandler(async (req, res, next) => {
    const users = await prisma.user.findMany({
        where: {
            tipoUsuario: {
                in: [
                    mapUserTypeToPrisma("Entrevistador"),
                    mapUserTypeToPrisma("Lider Comunitario")
                ]
            },
            memberships: {
                none: {
                    familyId: req.query.familiaId
                }
            }
        },
        include: {
            memberships: true
        }
    });
    
    res.status(200).json({
        status: 'success',
        users: users.map(user => formatUser(user))
    });
});

exports.getUsuario = asyncErrorHandler(async (req, res, next) => {
    const user = await prisma.user.findUnique({
        where: { id: req.params.id },
        include: {
            memberships: true
        }
    });

    if(!user){
        throw new CustomError('Usuario não encontrado', 404);
    }

    res.status(200).json({
        status: 'success',
        user: formatUser(user)
    });
});

exports.deletaUsuario = asyncErrorHandler(async(req, res, next) => {
    const userToDelete = await prisma.user.findUnique({
        where: { id: req.params.id }
    });

    if(!userToDelete){
        throw new CustomError('Usuario não encontrado', 404);
    }

    // A deleção cascade no banco de dados cuidará das associações na tabela family_memberships.
    await prisma.user.delete({
        where: { id: req.params.id }
    });

    res.status(200).json({
        status: 'success',
        message: 'Usuário deletado com sucesso!'
    })
});

exports.alteraPerguntaSeguranca = asyncErrorHandler(async (req, res, next) => {
    let user;

    const { novaPerguntaSeguranca, novaRespostaSeguranca, respostaSegurancaAtual } = req.body;
    const hashedRespostaSeguranca = await hashRespostaSeguranca(novaRespostaSeguranca);

    if(req.body.id){
        user = await prisma.user.findUnique({
            where: { id: req.body.id }
        });
        if(!user) throw new CustomError('Usuário não encontrado', 404);

        await prisma.user.update({
            where: { id: user.id },
            data: {
                perguntaSeguranca: mapSecurityQuestionToPrisma(novaPerguntaSeguranca),
                respostaSeguranca: hashedRespostaSeguranca
            }
        });
    }
    else{
        user = await prisma.user.findUnique({
            where: { id: req.user._id }
        });
        if(!user) throw new CustomError('Usuário não encontrado', 404);

        if(!respostaSegurancaAtual || !(await verificaSenha(respostaSegurancaAtual, user.respostaSeguranca))){
            throw new CustomError('Resposta de seguraça atual incorreta!', 400);
        }

        await prisma.user.update({
            where: { id: user.id },
            data: {
                perguntaSeguranca: mapSecurityQuestionToPrisma(novaPerguntaSeguranca),
                respostaSeguranca: hashedRespostaSeguranca
            }
        });
    }

    res.status(200).json({
        status: 'success',
        message: 'Pergunta de seguraça alterada com sucesso!'
    });
});