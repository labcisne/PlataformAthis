const mongoose = require("mongoose");

const fileSchema = new mongoose.Schema({
    
    caminho: {
        type: String
    },
    descricao: {
        type: String
    }
});


module.exports = fileSchema;