# Plataforma Athis

## Sobre o projeto
A plataforma consiste em uma aplicação web onde é possível fazer o levantamento e o diagnóstico de habitações sociais.

## Instrução de instalação (Tudo foi testado no sistema operacional linux)
### Pré-requisitos:
* Node.js <a href=https://nodejs.org/en/download>clique aqui para fazer o download.</a>
* npm (ao realizar o download do node, marque a opção de utilizar o npm como gerenciador de pacotes)
* mongoDB <a href=https://www.mongodb.com/try/download/community>clique aqui para fazer o download</a>

Para verificar se a instalação foi feita corretamente, basta digitar os seguintes comando no terminal:
```bash
node --version
npm --version
mongod --version
```
### Passos pós instalação dos pré-requisitos:
* Clonar este repositório
* Na raiz do projeto, entrar no diretório Frontend e instalar as dependências do projeto com o npm:
```bash
cd ./Frontend
npm install
```
* Mudar para o diretório Backend e instalar as dependências com o npm:
```bash
cd ../Backend
npm install
```
* Dentro do diretório Backend, crie um arquivo config.env para configurar variáveis de ambiente. Este arquivo deve conter as seguintes informações:
```bash
PORT=3000 (em qual porta será executado o servidor)
CONN_STR=mongodb://localhost:27017/arquitetura (conectando com um banco de dados local vazio)
SECRET_STR=asg7-hnkenf-53jje7-63hdkk-72ggdjjd (uma string para gerar um jwt. Aqui pode ser posto qualquer string, essa é apenas um exemplo)
LOGIN_EXPIRES=1000000 (tempo que o login irá durar em milisegundos)
```
* Agora é necessário ativar ativar o mongoDB para ser possível utilizá-lo. Para fazer isso, basta abrir um terminal e digitar o seguinte comando:
```bash
sudo systemctl start mongod
```
Toda vez que seu sistema for reiniciado, será necessário fazer essa ativação novamente. Para que ela já seja feita automáticamente, sem precisar digitar o comando toda hora, basta habilitar o banco de dados da seguinte maneira:
```bash
sudo systemctl enable mongod
```
## Inicializando a aplicação localmente
* Com todas as dependências instaladas e o banco de dados ativado, basta abrir um terminal no diretório Frontend e outro terminal no diretório Backend. Em ambos os terminais, rode o seguinte comando:
```bash
npm run dev
```
* Abra seu navegador e vá para a página <a href=http://localhost:5173/ >http://localhost:5173/</a>.
* No seu primeiro acesso ao sistema, será pedido que crie o primeiro usuário. Ele será um administrador, que possui acesso a todo o sistema e pode criar novos usuários.
* Fique livre para testar o sistema da maneira que quiser.