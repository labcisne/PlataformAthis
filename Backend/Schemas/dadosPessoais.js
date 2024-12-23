const mongoose = require('mongoose');


const dadosPessoais = new mongoose.Schema({

    nomeMorador: {
        type: String,
        required: true
    },
    documentoResponsavel: {
        type: String
    },
    opcaoSelecionada: { //CPF ou RG
        type: String
    },
    endereco: {
        type: String
    },
    numeroCasa: {
        type: String
    },
    cidade: {
        type: String
    },
    regiao: {
        type: String
    },
    telefone: {
        type: String
    },
    donoTelefone: {
        type: String
    }

});


module.exports = dadosPessoais;