const express = require('express');
const authRoute = require('./Routes/authRoute');
const familyRoute = require('./Routes/familyRoute');
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


app.use(globalErrorHandler);

module.exports = app;