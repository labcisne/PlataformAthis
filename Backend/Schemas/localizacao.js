const mongoose = require('mongoose');


const localizacao = new mongoose.Schema({
    latitude: {
        type: Number,
    },
    longitude: {
        type: Number,
    }
});

module.exports = localizacao;