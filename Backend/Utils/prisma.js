const path = require('node:path');
const dotenv = require('dotenv');

// Scripts Node e o servidor precisam usar o mesmo arquivo de configuração.
// O Prisma CLI continua podendo carregar .env normalmente.
dotenv.config({ path: path.resolve(__dirname, '../config.env') });

const { PrismaClient } = require('@prisma/client');
const prisma = global.prisma || new PrismaClient();

if (process.env.NODE_ENV !== 'production') {
  global.prisma = prisma;
}

module.exports = prisma;
