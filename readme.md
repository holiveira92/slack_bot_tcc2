Siga os passos abaixo para realizar a instalação e execução do código nos respectivos ambientes.<br>

*Deploy do robô em canal do Slack <br>
a) Na página da API do Slack(https://api.slack.com/apps/) , crie um novo aplicativo e obtenha o ID do cliente,
token de acesso do usuário e o token de acesso da aplicação fornecido pelo
Slack.
b) Realizar o clone do projeto no GitHub.
c) Abra o arquivo .env na raiz do projeto clonado e insira os dados obtidos no
passo ‘a)’ nas variáveis correspondentes.
d) Faça login no Botkit Studio(https://studio.botkit.ai/) . Na página inicial, acesse o botão ‘New Bot’ e siga
os passos para criação de uma aplicação. Após a criação do robô você será
redirecionado para sua página do Glitch, plataforma que o Slack e o Botkit
Framework utilizam para hospedagem de aplicativos.
e) Clone os arquivos: bot.js e functions.js do projeto baixado pelo GitHub para a
raiz da hospedagem aberta no Glitch.
f) Nas configurações do robô no Botkit Studio, copie os endereços ‘Oauth URL’ e
‘Webhook Endpoint’ e insira na página de configuração do seu robô criado no
Slack API em ‘Interactive Components’, ‘Event Subscriptions’ e ‘OAuth &
Permissions’ respectivamente.
g) Após seguir estes passos, basta adicionar o robô criado em seu canal no Slack.
h) Ao instalar o robô em seu canal do Slack, ele irá solicitar algumas informações
sobre os canais de usuários e de robôs, como foi proposto nos subtópicos acima.
Converse com o robô e forneça as informações que ele solicitar. Quando
completamente configurado, o robô assistente irá informar que já está pronto
para uso e já poderá receber chamadas e atuar nos canais do Slack.

*Testes em Ambiente local: <br>
1 - Crie uma pasta para o projeto <br>
2 - Baixe e instale o NodeJS(https://nodejs.org/en/) no diretório criado <br>
3 - Dentro da pasta node_modules criada pela instalação do NodeJs, clone o projeto do Botkit Framework(https://github.com/howdyai/botkit) e cole a pasta principal neste diretório com o nome de "botkit" <br>
4 - Ainda dentro da pasta node_modules, clone o projeto do MomentJs(https://github.com/moment/moment/), biblioteca necessária para tratamento de datas do robô <br>
5 - Clone o projeto do robô(https://github.com/holiveira92/tcc2) para a pasta principal do projeto <br>
6 - Acesse o seu Slack e crie um aplicativo(Custom Integration) neste link https://my.slack.com/services/new/bot <br>
7 - Realize os procedimentos solicitados na página e ao final do processo copie o token de acesso gerado <br>
7 - Abra o arquivo localBot.js <br>
8 - Na linha 26, cole o token de acesso gerado no passo 7 <br>
9 - Via linha de comando execute o robô com o node: node localBot.js <br>
10 - O robô estará online, escutando o canal do slack de forma local. <br>
