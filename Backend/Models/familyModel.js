const mongoose = require('mongoose');
const dadosPessoais = require('../Schemas/dadosPessoais');


const familySchema = mongoose.Schema({

    dadosFamilia: {
        type: dadosPessoais,
        required: true
    }
});


const Family = mongoose.model('Familia', familySchema);


module.exports = Family;