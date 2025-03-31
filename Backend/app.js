const express = require('express');
const authRoute = require('./Routes/authRoute');
const familyRoute = require('./Routes/familyRoute');
const optionsRoute = require('./Routes/optionsRoute');
const globalErrorHandler = require('./Controllers/errorController');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const fs = require('node:fs');
const path = require('node:path');


const app = express();

//middlewares and routes
app.use(cors({
    origin: 'http://localhost:5173',
    credentials: true
}));
app.use(express.json());
app.use(cookieParser());

app.use(authRoute);
app.use('/familia', familyRoute);
app.use('/options', optionsRoute);

const imagensPath = path.join(__dirname, "imagens");
const arquivosPath = path.join(__dirname, "arquivos");

if(!fs.existsSync(imagensPath)){
    fs.mkdirSync(imagensPath, { recursive: true })
}

if(!fs.existsSync(arquivosPath)){
    fs.mkdirSync(arquivosPath, { recursive: true })
}

app.use('/familia/dadosFamilia/arquivosGerais/imagens', express.static('imagens'));
app.use('/familia/dadosFamilia/arquivosGerais/arquivos', express.static('arquivos'));

app.use(globalErrorHandler);

module.exports = app;