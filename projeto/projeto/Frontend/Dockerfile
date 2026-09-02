FROM node:20-alpine

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .

EXPOSE 5173

# Inicia o Vite escutando em todas as interfaces para permitir o acesso externo do host
CMD ["npm", "run", "dev", "--", "--host"]
