const Family = require("../Models/familyModel");
const User = require("../Models/userModel");
const asyncErrorHandler = require('../Utils/asyncErrorHandler');
const CustomError = require('../Utils/customError');


const criaNovoMorador = (dadosFamilia, id) => {

    //geração de login
    const nomeMorador = dadosFamilia.nomeMorador.split(' ')[0].toLowerCase();
    const documento = dadosFamilia.documentoResponsavel.slice(-4);
    const login = `${nomeMorador}${documento}`;

    //geração da senha
    const numAleatorio = Math.random().toString(36).slice(-4);
    const senha = `${nomeMorador}${numAleatorio}`;

    const obj = {
        login,
        senha,
        confirmarSenha: senha,
        tipoUsuario: 'Morador',
        nome: 'Novo morador',
        familiasAssociadas: [id],
        perguntaSeguranca: "Qual é o nome do seu animal de estimação?",
        respostaSeguranca: "gato"
    }
    
    return obj;
}

exports.criaFamilia = asyncErrorHandler(async (req, res, next) => {

    const newFamily = await Family.create({dadosFamilia: req.body});

    //cria um usuário para o morador
    const novoMorador = criaNovoMorador(req.body, newFamily._id);
    await User.create(novoMorador);

    //salvando o id da familia no entrevistador que criou ela
    if(req.user.tipoUsuario === 'Entrevistador'){
        req.user.familiasAssociadas.push(newFamily._id);
        await req.user.save({validateBeforeSave: false});
    }

    res.status(201).json({
        status: 'success',
        data: {
            newFamily: newFamily.dadosFamilia,
            loginUsuario: novoMorador.login,
            senhaUsuario: novoMorador.senha
        }
    });
});


exports.listarFamilias = asyncErrorHandler(async (req, res, next) => {

    let familias = [];

    //verificando qual o tipo de usuário e listando as familias
    if(req.user.tipoUsuario === 'Administrador'){
        //retorna todas as familias
        familias = await Family.find();
    }
    else{
        //retorna as familias associadas a ele
        familias = await Family.find({_id: {$in: req.user.familiasAssociadas}});
    }

    res.status(200).json({
        status: 'success',
        length: familias.length,
        familias
    });
});

exports.getFamilia = asyncErrorHandler(async (req, res, next) => {

    const familia = await Family.findById(req.params.id);

    if(!familia){
        throw new CustomError('Familia não existe!', 404);
    }

    res.status(200).json({
        status: 'success',
        familia
    })
});


exports.associaFamilia = asyncErrorHandler(async(req, res, next) => {

    const user = await User.findById(req.body.userId);

    if(!user){
        throw new CustomError('Usuário não existe!', 404);
    }

    if(user.familiasAssociadas.includes(req.params.id)){
        throw new CustomError('Usuário já está associado a essa familia!', 400);
    }

    user.familiasAssociadas.push(req.params.id);
    await user.save({validateBeforeSave:false})

    res.status(200).json({
        status: 'success',
    })
});