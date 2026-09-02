const prisma = require('./Utils/prisma');
const seedQuestions = require('./Utils/seedQuestions');
const dotenv = require('dotenv');
dotenv.config({path: './config.env'});

const app = require('./app');

// Test connection to PostgreSQL via Prisma
prisma.$connect()
.then(async () => {
    console.log('PostgreSQL database connection via Prisma successful!');
    try {
        await seedQuestions();
    } catch (err) {
        console.error('Error seeding questions/migrating data:', err.message);
    }
})
.catch((error) => {
    console.error('Error connecting to database via Prisma:', error.message);
});

const port = process.env.PORT || 3000;
const server = app.listen(port, () => {
    console.log('Server started!');
});