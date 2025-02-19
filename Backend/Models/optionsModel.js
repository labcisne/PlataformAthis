const mongoose = require('mongoose');

const optionsSchema = mongoose.Schema({

    nome: {
        type: String,
        unique: true,
        required: true
    },
    opcoes: {
        type: [String],
        default: []
    }
});

const Option = mongoose.model('Option', optionsSchema);

module.exports = Option;