const express = require('express');
const authRoute = require('./Routes/authRoute');
const familyRoute = require('./Routes/familyRoute');
const optionsRoute = require('./Routes/optionsRoute');
const globalErrorHandler = require('./Controllers/errorController');
const cors = require('cors');
const cookieParser = require('cookie-parser');


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

app.use('/familia/dadosFamilia/arquivosGerais/imagens', express.static('imagens'));
app.use('/familia/dadosFamilia/arquivosGerais/arquivos', express.static('arquivos'));

app.use(globalErrorHandler);

module.exports = app;