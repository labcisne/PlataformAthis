const prisma = require('./Utils/prisma');
const dotenv = require('dotenv');
dotenv.config({path: './config.env'});

const app = require('./app');

// Test connection to PostgreSQL via Prisma
prisma.$connect()
.then(() => {
    console.log('PostgreSQL database connection via Prisma successful!');
})
.catch((error) => {
    console.error('Error connecting to database via Prisma:', error.message);
});

const port = process.env.PORT || 3000;
const server = app.listen(port, () => {
    console.log('Server started!');
});