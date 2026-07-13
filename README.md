# Plataforma Athis

## Sobre o projeto
A plataforma consiste em uma aplicação web onde é possível fazer o levantamento e o diagnóstico de habitações sociais.

## Como Rodar o Sistema

O projeto está totalmente conteinerizado utilizando Docker e Docker Compose. Isso significa que você não precisa instalar o Node.js, PostgreSQL ou o Prisma localmente na sua máquina para rodar o sistema.

### Pré-requisitos:
* **Docker** instalado e rodando.
* **Docker Compose** instalado.

### Passos para rodar a aplicação:

1. **Clonar este repositório** e navegar até a pasta raiz:
   ```bash
   git clone <url-do-repositorio>
   cd PlataformAthis
   ```

2. **Configurar as variáveis de ambiente**:
   Dentro do diretório `Backend`, crie um arquivo chamado `config.env` com as seguintes variáveis de configuração:
   ```env
   PORT=3000
   DATABASE_URL=postgresql://postgres:postgres@localhost:5432/arquitetura?schema=public
   SECRET_STR=asg7-hnkenf-53jje7-63hdkk-72ggdjjd
   LOGIN_EXPIRES=1000000
   ```

3. **Subir os containers do Docker**:
   Na pasta raiz do projeto (onde está o arquivo `docker-compose.yml`), execute o comando:
   ```bash
   docker compose up --build
   ```
   *Este comando irá compilar as imagens do Frontend e Backend, iniciar o banco de dados PostgreSQL e executar automaticamente todas as migrações necessárias no banco de dados via Prisma.*

4. **Acessar a aplicação**:
   Abra seu navegador e vá para a página:
   * **Frontend**: [http://localhost:5173/](http://localhost:5173/)
   * **Backend**: [http://localhost:3000/](http://localhost:3000/)

5. **Primeiro Acesso**:
   No seu primeiro acesso ao sistema, será solicitado que crie o primeiro usuário. Ele será registrado como um Administrador (Moderador), que possui acesso completo ao sistema para cadastrar novas famílias e gerenciar usuários.