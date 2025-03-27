const mongoose = require('mongoose');
const dadosPessoais = require('../Schemas/dadosPessoais');
const localizacao = require('../Schemas/localizacao.js');
const facilities = require('../Schemas/facilities.js');
const estrutural = require('../Schemas/estrutural.js');
const fileSchema = require('../Schemas/fileSchema.js')

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
    },
    tabelaSocioeconomica: {
        type: facilities
    },
    tabelaEstrutural: {
        type: estrutural
    },
    imagens: {
        type: [fileSchema],
        default: []
    }
});


const Family = mongoose.model('Familia', familySchema);


module.exports = Family;