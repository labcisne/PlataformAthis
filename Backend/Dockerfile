FROM node:20-alpine

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY prisma ./prisma/
RUN npx prisma generate

COPY . .

EXPOSE 3000

# Executa as migrações pendentes e inicia o servidor de desenvolvimento
CMD ["sh", "-c", "npx prisma migrate deploy && npm run dev"]
