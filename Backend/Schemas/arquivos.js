const mongoose = require('mongoose');


const arquivosSchema = mongoose.Schema({

    descicao: {
        type: String
    },
    caminhoArquivo: {
        type: String
    },
    extensao: {
        type: string
    },
    timeStamp: {
        type: Date
    },
    ultimaEdicao: {
        type: Date
    }
});


module.exports = arquivosSchema;