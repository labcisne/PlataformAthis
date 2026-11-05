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
   *Este comando irá compilar as imagens do Frontend e Backend e iniciar os serviços. As migrações de dados são executadas separadamente, com confirmação explícita.*

4. **Acessar a aplicação**:
   Abra seu navegador e vá para a página:
   * **Frontend**: [http://localhost:5173/](http://localhost:5173/)
   * **Backend**: [http://localhost:3000/](http://localhost:3000/)

5. **Primeiro Acesso**:
   No seu primeiro acesso ao sistema, será solicitado que crie o primeiro usuário. Ele será registrado como um Administrador (Moderador), que possui acesso completo ao sistema para cadastrar novas famílias e gerenciar usuários.

## Migrações de dados

As migrações usam as dependências da imagem do backend. Não é necessário instalar Node.js, npm, Prisma ou dependências do projeto no computador: basta ter Docker e Docker Compose.

Antes do setup, disponibilize na raiz do projeto:

* `Dados para serem migrados.xlsx`;
* `minio.license/minio.license`, com a licença AIStor válida;
* as credenciais/configurações externas usadas pelos scripts de migração, quando aplicável.

O arquivo `Backend/package-lock.json` é usado pela imagem para instalar dependências com `npm ci`. O Compose monta a planilha somente durante a execução do backend e mantém os relatórios em `Backend/migration-*.json`; eles não dependem da existência do container após a execução.

### Ubuntu ou WSL

Na raiz do projeto:

```bash
# 1. Subir todos os containers e preparar banco/schema
make start

# 2. Simular e, depois de conferir o relatório, migrar as respostas
make migrate-answers-dry-run
make migrate-answers

# 3. Simular e, depois de conferir o relatório, migrar as imagens
make migrate-images-dry-run
make migrate-images
```

Execute os três comandos na ordem indicada. A simulação e a confirmação acontecem somente nos comandos de migração correspondentes.

Comandos úteis:

```bash
make status
make logs
make down
```

### Windows PowerShell

Se o Docker Desktop estiver disponível no PowerShell nativo, execute na raiz do projeto. O script chama `npm` somente dentro do container:

```powershell
# 1. Subir todos os containers e preparar banco/schema
.\migrate.ps1 -Command Start

# 2. Simular e, depois de conferir o relatório, executar as respostas
.\migrate.ps1 -Command MigrateAnswersDryRun
.\migrate.ps1 -Command MigrateAnswers

# 3. Simular e, depois de conferir o relatório, executar as imagens
.\migrate.ps1 -Command MigrateImagesDryRun
.\migrate.ps1 -Command MigrateImages

# 4. Simular e, depois de conferir o relatório, executar as imagens das famílias
.\migrate.ps1 -Command MigrateFamilyImagesDryRun
.\migrate.ps1 -Command MigrateFamilyImages
```

Para consultar o estado, ver logs ou parar os containers sem remover volumes:

```powershell
.\migrate.ps1 -Command Status
.\migrate.ps1 -Command Logs
.\migrate.ps1 -Command Down
```

Se você estiver usando `make` em um terminal que consegue chamar o PowerShell, o primeiro comando também está disponível:

```bash
make start-powershell
make status-powershell
make logs-powershell
make down-powershell
```

Os comandos não removem volumes nem recriam o armazenamento do PostgreSQL ou do MinIO. O bucket usado pelo inicializador é `athis-images`, o mesmo configurado no backend.