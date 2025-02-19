const Options = require('../Models/optionsModel');
const asyncErrorHandler = require('../Utils/asyncErrorHandler');

exports.getListaDeOpcoes = asyncErrorHandler(async (req, res, next) => {
    
    const nome = req.params.nome;
    const listaDeOpcoes = await Options.findOne({nome});

    if(!listaDeOpcoes){
        res.status(200).json({
            status: 'success',
            opcoes: []
        })
    }
    else{
        res.status(200).json({
            status: 'success',
            opcoes: listaDeOpcoes.opcoes
        })
    }

});

exports.adicionaNaListaDeOpcoes = asyncErrorHandler(async (req, res, next) => {
    
    const nome = req.params.nome;
    const listaDeOpcoes = await Options.findOne({nome});

    if(!listaDeOpcoes){
        novaLista = await Options.create({nome, opcoes: [req.body.opcao]})

        res.status(200).json({
            status: 'success',
            novaLista
        })
    }
    else{
        listaDeOpcoes.opcoes.push(req.body.opcao);
        await listaDeOpcoes.save();

        res.status(200).json({
            status: 'success',
            listaDeOpcoes
        })
    }
});