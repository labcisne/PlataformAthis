const mongoose = require('mongoose');
const dotenv = require('dotenv');
dotenv.config({path: './config.env'});

const app = require('./app');


mongoose.connect(process.env.CONN_STR)
.then(() => {
    console.log('DB connection successful!');
})
.catch((error) => {
    console.log(error.message);
});


const port = process.env.PORT || 3000;
const server = app.listen(port, () => {
    console.log('Server started!');
});