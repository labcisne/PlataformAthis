const mongoose = require('mongoose');
const dadosPessoais = require('../Schemas/dadosPessoais');
const localizacao = require('../Schemas/localizacao.js');

const familySchema = mongoose.Schema({

    dadosFamilia: {
        type: dadosPessoais,
        required: true
    },
    usuariosAssociados: {
        type: [String],
        default: []
    },
    localizacaoFamilia: {
        type: localizacao,
        required: true
    }
});


const Family = mongoose.model('Familia', familySchema);


module.exports = Family;