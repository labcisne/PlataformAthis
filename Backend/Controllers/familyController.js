const Family = require("../Models/familyModel");
const User = require("../Models/userModel");
const asyncErrorHandler = require('../Utils/asyncErrorHandler');
const CustomError = require('../Utils/customError');
const multer = require('multer');
const path = require('node:path');
const fs = require('node:fs');


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
        nome: dadosFamilia.nomeMorador,
        familiasAssociadas: [id],
        perguntaSeguranca: "Qual é o nome do seu animal de estimação?",
        respostaSeguranca: "gato"
    }
    
    return obj;
}

exports.criaFamilia = asyncErrorHandler(async (req, res, next) => {

    const newFamily = await Family.create({
        dadosFamilia: req.body.dadosPessoais,
        localizacaoFamilia: req.body.localizacao
    });

    //cria um usuário para o morador
    const novoMorador = criaNovoMorador(req.body.dadosPessoais, newFamily._id);
    const morador = await User.create(novoMorador);

    //salvando o id da familia no entrevistador que criou ela
    if(req.user.tipoUsuario === 'Entrevistador'){
        req.user.familiasAssociadas.push(newFamily._id);
        await req.user.save({validateBeforeSave: false});
        newFamily.usuariosAssociados.push(req.user._id);
    }

    newFamily.usuariosAssociados.push(morador._id);
    await newFamily.save({validateBeforeSave:false});

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

    if(req.query.user){
        req.query.user.tipoUsuario === "Administrador" ? 
        familias = await Family.find() :
        familias = await Family.find({_id: {$in: req.query.user.familiasAssociadas}});
    }
    else{
        //verificando qual o tipo de usuário e listando as familias
        if(req.user.tipoUsuario === 'Administrador'){
            //retorna todas as familias
            familias = await Family.find();
        }
        else{
            //retorna as familias associadas a ele
            familias = await Family.find({_id: {$in: req.user.familiasAssociadas}});
        }
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
    const familia = await Family.findById(req.params.id);

    if(!user){
        throw new CustomError('Usuário não existe!', 404);
    }

    if(user.familiasAssociadas.includes(req.params.id)){
        throw new CustomError('Usuário já está associado a essa familia!', 400);
    }

    user.familiasAssociadas.push(req.params.id);
    familia.usuariosAssociados.push(user._id);
    await user.save({validateBeforeSave:false});
    await familia.save({validateBeforeSave:false});

    res.status(200).json({
        status: 'success',
    })
});


exports.deletaFamilia = asyncErrorHandler(async (req, res, next) => {
        
    if(req.body.userRole !== "Administrador" && req.body.userRole !== "Entrevistador"){
        throw new CustomError('Você não tem permissão para essa ação!', 400);
    }

    const familia = await Family.findById(req.params.id);
    const users = await User.find({_id : {$in: familia.usuariosAssociados}});
    
    users.forEach(async (user) => {
        if(user.tipoUsuario === "Morador"){
            await User.findByIdAndDelete(user._id);
        }
        else{
            const idx = user.familiasAssociadas.indexOf(req.params.id);
            user.familiasAssociadas.splice(idx, 1);
            await user.save({validateBeforeSave:false});
        }
    });

    await Family.findByIdAndDelete(req.params.id);

    res.status(200).json({
        status: 'success',
        message: 'familia deletada com sucesso'
    })
});


exports.getUsuariosAssociados = asyncErrorHandler(async (req, res, next) => {


    const users = await User.find({
        _id: { $in: req.query.usuariosAssociadosId},
    });

    if(!users) {
        throw new CustomError("Nao tem usuarios associados");
    }

    res.status(200).json({
        status: "success",
        users
    });
});


exports.editaFamilia = asyncErrorHandler(async (req, res, next) => {

    if(req.query.userRole !== "Administrador" && req.query.userRole !== "Entrevistador"){
        throw new CustomError('Você não tem permissão para essa ação!', 400);
    }

    const newFamily = await Family.findByIdAndUpdate(req.params.id, {"dadosFamilia": req.body.familiaEditada}, {
        runValidators: true,
        new: true
    })

    if(!newFamily) {
        throw new CustomError("Não foi possível editar os dados");
    }

    res.status(200).json({
        status: "success",
        newFamily: newFamily.dadosFamilia
    });
});


exports.enviaFormularioFacilities = asyncErrorHandler(async (req, res, next) => {

    if(!req.body.id){
        throw new CustomError('Id da família não enviado!', 400);
    }

    const familia = await Family.findById(req.body.id);

    if(!familia){
        throw new CustomError('Família não encontrada!', 404);
    }

    familia.tabelaSocioeconomica = req.body.obj;
    await familia.save({validadeBeforeSave:false});

    res.status(200).json({
        status: 'success',
        tabela: familia.tabelaSocioeconomica
    })
});


exports.enviaFormularioEstrutural = asyncErrorHandler(async (req, res, next) => {

    if(!req.body.id){
        throw new CustomError('Id da família não enviado!', 400);
    }
    
    const familia = await Family.findById(req.body.id);

    if(!familia){
        throw new CustomError('Família não encontrada!', 404);
    }

    familia.tabelaEstrutural = req.body.obj;
    await familia.save({validadeBeforeSave:false});

    res.status(200).json({
        status: 'success',
        tabela: familia.tabelaEstrutural
    })
});

//FUNÇÕES DE UPLOAD
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, "imagens/");
    },
    filename: (req, file, cb) => {
        cb(null, `${req.params.id}_${Date.now()}${path.extname(file.originalname)}`);
    }
});

const upload = multer({ storage });

exports.fazUpload = upload;

exports.insereNovaImagem = asyncErrorHandler(async (req, res, next) => {

    const familyId = req.params.id
    const descricao = req.body.descricao;
    const imagePath = `/imagens/${req.file.filename}`;

    const family = await Family.findById(familyId);
    if(!family){
        throw new CustomError('Família não encontrada!', 404);
    }
    
    family.imagens.push({caminho: imagePath, descricao});
    await family.save();

    res.status(200).json({
        status: 'success',
        imagens: family.imagens
    });
});

exports.deletaArquivo = asyncErrorHandler(async (req, res, next) => {

    const familyId = req.params.id;
    const caminhoArquivo = req.body.caminhoArquivo;

    const family = await Family.findById(familyId);
    if(!family){
        throw new CustomError('Família não encontrada!', 404);
    }

    const idx = family.imagens.findIndex(imagem => imagem.caminho === caminhoArquivo);
    family.imagens.splice(idx, 1);
    await family.save();

    fs.rm(`.${caminhoArquivo}`, (error) => {
        if(error){
            throw new CustomError('Erro ao remover arquivo do servidor', 400);
        }
    });

    res.status(200).json({
        status: 'success',
        imagens: family.imagens
    })
});

exports.editaDescricao = asyncErrorHandler(async (req, res, next) => {

    const familyId = req.params.id;
    const caminhoArquivo = req.body.caminhoArquivo;
    const novaDescricao = req.body.novaDescricao;

    const family = await Family.findById(familyId);
    if(!family){
        throw new CustomError('Família não encontrada!', 404);
    }

    const idx = family.imagens.findIndex(imagem => imagem.caminho === caminhoArquivo);
    family.imagens[idx].descricao = novaDescricao;
    await family.save();

    res.status(200).json({
        status: 'success',
        imagens: family.imagens
    })
});