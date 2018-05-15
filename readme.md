Siga os passos abaixo para realizar a instalação e execução do código nos respectivos ambientes.<br>

*Instalação do robô em canal do Slack <br>
1 - Acesse https://ash-python.glitch.me/ <br>
2 - Clique no botão "Add to Slack" <br>
3 - Realize o procedimento de autorização solicitado pelo slack <br>
4 - O robô será instalado no seu ambiente slack <br>
5 - Uma mensagem inicial de instruções será enviada pelo robô <br>
6 - Escreva algo diretamente para o robô <br>
7 - O robô solicitará algumas informações de configuração <br>
8 - Informe os dados solicitados para o robô <br>
9 - Pronto! O robô está instalado, configurado e pronto para uso <br>


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
