'use strict';

//importando biblioteca botkit
var Botkit = require('./node_modules/botkit/lib/Botkit.js');
var momentJs = require('./node_modules/moment/moment.js')
var fn = require('./functions.js');
var fullTeamList = [];
var fullChannelList = [];
var mr_robot_id = "";
var mr_robot_name = "mr_robot";
var users_channel = "";
var users_channel_id = "";
var bots_channel = "";
var bots_channel_id = "";
var cont = 0;
var first_time_user = true;
var first_time_bot = true;

//usando a biblioteca para criar o controlador do bot
var controller = Botkit.slackbot({
	debug: false,
});

//utilizando token autorizado pelo slack para execução do bot
var bot = controller.spawn({
	token: 'XXXXX' //bot token
}).startRTM();
  
  //busca lista de usuários
//@ https://api.slack.com/methods/users.list
bot.api.users.list({}, function (err, response) {
  if (response.hasOwnProperty('members') && response.ok) {
      var total = response.members.length;
      for (var i = 0; i < total; i++) {
        var member = response.members[i];
        if(member.is_bot){
          fullTeamList.push({name: member.name, id: member.profile.bot_id , last_posts:0});
          //detectando meu robô
          if(member.name == mr_robot_name){
            mr_robot_id = member.id;
          }
		    }
      }
  }
});
  
//busca lista de canais
//@ https://api.slack.com/methods/channels.list
bot.api.channels.list({}, function (err, response) {
  if (response.hasOwnProperty('channels') && response.ok) {
      var total = response.channels.length;
      for (var i = 0; i < total; i++) {
          var channel = response.channels[i];
		      fullChannelList.push({name: channel.name, id: channel.id, team: channel.team});
      }
  }
});
  
//Envia resposta da busca do usuário contendo o link para o post
function sendResponse (result,bot,chanel_id,msg_ts,res,message) {
	bot.api.chat.getPermalink({channel: chanel_id, message_ts: msg_ts}, function (err, r) {
		//callback para enviar as msgs com os links corretos
		if (r.ok) {
			var link = r.permalink;
			//msg com anexos
			if(res !== "" && res !== undefined){
				bot.startConversation({
					user: mr_robot_id,
					channel: users_channel,
					text: res.text
				},function(err, convo){
					var msg = {};
					msg.text = "Robô " + result.username + " Escreveu \n" +
					"Para acessar a msg original, clique aqui : " + link;
					msg.attachments = result.attachments;
					//convo.say(msg);
					bot.whisper(message, msg);
				});
				
			}
			//msg normal, sem anexos
			else{
				bot.startConversation({
					user: mr_robot_id,
					channel: users_channel,
					text: result.text
				},function(err, convo){
					/*
					convo.say( "Robô " + result.username + " Escreveu \n" +
					"Para acessar a msg original, clique aqui : " + link + "\n"
					+ result.text);
					*/
					bot.whisper(message, "Robô " + result.username + " Escreveu \n" +
					"Para acessar a msg original, clique aqui : " + link + "\n"
					+ result.text);
				});
			}
			
		}else{
			//nada ainda
		}
	});
}  

function send(response,message,bot){
	var link = response.permalink;
	for (var i = 0; i < fullTeamList.length; i++) {
		if(message.bot_id === fullTeamList[i].id && message.bot_id !== mr_robot_id){
			bot.startConversation({
				user: mr_robot_id,
				channel: users_channel,
				text: ""
			},function(err, convo){
				convo.say( "Robô " + fullTeamList[i].name + " está escrevendo muitas vezes.\n " +
				"Deve ser algo importante!Confira aqui: " + link);
			});
		}
	}
				
}
  
function configuraCanais(bot, message){

	if(users_channel_id === "" && bots_channel_id ===""){
		if(first_time_user === true){
		bot.reply(message, "Obrigado por deixar te ajudar nas suas tarefas :) \n" +
			"Ainda não fui configurado para te ajudar. \n" +
			"Para funcionar, eu preciso que você me indique qual é o seu canal de usuários e também qual o seu canal de robôs. \n" +
			"Primeiramente, escreva para mim exatamente o nome do seu canal de usuários, onde irei atuar para te auxiliar. \n");
			first_time_user = false;
		}else{
			for (var i = 0; i < fullChannelList.length; i++) {
				//detecta qual robô enviou a msg
				if(message.text === fullChannelList[i].name){
					users_channel = message.text;
					users_channel_id = fullChannelList[i].id ;
					first_time_user = false;
				}
			}
			if(users_channel ==="" && users_channel_id===""){
				bot.reply(message, "Não encontrei este canal na sua lista, por favor, escreva novamente");
			}else{
				bot.reply(message, "Entendi! Seus canal de usuários se chama: " + users_channel + "\n" +
				"Agora, escreva para mim exatamente o nome do seu canal de bots.");
				//bot.reply(message,"Agora, escreva para mim exatamente o nome do seu canal de bots.");
				first_time_bot = false;
			}
		}
		return true;
	}else if(users_channel_id !== "" && bots_channel_id ===""){
		if(first_time_bot === true){
			bot.reply(message,"Agora, escreva para mim exatamente o nome do seu canal de bots.");
			first_time_bot = false;
		}else{
			for (var i = 0; i < fullChannelList.length; i++) {
				//detecta qual robô enviou a msg
				if(message.text === fullChannelList[i].name){
					bots_channel = message.text;
					bots_channel_id = fullChannelList[i].id ;
					first_time_bot= false;
				}
			}
			if(bots_channel ==="" && bots_channel_id===""){
				bot.reply(message, "Não encontrei este canal na sua lista, por favor, escreva novamente");
			}else{
				bot.reply(message, "Entendi! Seus canal de bots se chama: " + bots_channel + "\n" +
				"Agora, é só me chamar que estarei aqui para te ajudar :)");
			}
		}
		return true;
	}else{
		return false;
	}
}

//detectando atividades frequentes de robôs
controller.on('bot_message', function(bot, message) {
	for (var i = 0; i < fullTeamList.length; i++) {
		//detecta qual robô enviou a msg
		if(message.bot_id === fullTeamList[i].id && message.bot_id !== mr_robot_id){
			fullTeamList[i].last_posts++; //aumenta o contador de msg enviadas no dia
			//detectando frequência de posts no dia
			if(fullTeamList[i].last_posts > 10){
				fullTeamList[i].last_posts = 0;
				/*
				bot.reply(message, "Robô " + fullTeamList[i].name + " está postando muitas vezes.\n " +
				+ "Deve ser algo importante, confira! ");
				*/
				bot.api.chat.getPermalink({channel: bots_channel_id, message_ts:message.ts}, function (err, r) {
					if(r.ok){
						send(r,message,bot,i);
					}
				});
			}
		}
	}
});
  
//gerar estatísticas sobre os posts de robos no dia
controller.hears(['stats'], 'direct_message,direct_mention,mention', function(bot, message) {
	var retConfigCanis  = configuraCanais(bot, message);
	//caso os canais não estejam configurados, encerra execução
	if(retConfigCanis)
		return;

	//bot.whisper(message, {as_user: false, text: " vc quer as estatisticas do dia"});
	//Buscando timestamp do dia atual
	var ts_start = momentJs(momentJs().format("YYYY-MM-DD 00:00:00"));;
	ts_start = ts_start / 1000;
	var ts_end = momentJs(momentJs().format("YYYY-MM-DD 23:59:59")); //momento atual
	ts_end = ts_end / 1000;
	//buscando histórico de msgs do dia no canal 
	//@ https://api.slack.com/methods/channels.history
	bot.api.channels.history({channel: bots_channel_id, count: 1000, oldest: ts_start, latest: ts_end }
		, function(error, response){
		var botList = [];
		botList = fullTeamList;
		if(response.messages !== undefined){
			var c = 0;
			for (var i = 0; i < botList.length; i++) {
				botList[i].countPosts = 0;
				botList[i].percPosts = 0;
				response.messages.forEach(function (result) {
					//conta posts totais dos bots no canal
					if(result.subtype === 'bot_message' && result.bot_id !== undefined){
						c++;
					}
					if(result.bot_id === botList[i].id){
							botList[i].countPosts++;
					}
				});
				//calculando % de posts de determinado robô
				if(c === 0)
					botList[i].percPosts = 0 ;
				else
					botList[i].percPosts = (botList[i].countPosts / c) * 100 ;
				
				bot.whisper(message,
					"Estes são os dados de hoje da atividade no canal de robôs \n" + 
					"Bot: " + botList[i].name +
					" Qtd de Notificações:" + botList[i].countPosts + 
					" Taxa de Notificações: " + botList[i].percPosts + "%");
			}	
			
		}
	});
});
  

  
//ajuda ao usuário
controller.hears(['help','ajuda'], 'direct_message,direct_mention,mention', function(bot, message) {
	var retConfigCanis  = configuraCanais(bot, message);
	//caso os canais não estejam configurados, encerra execução
	if(retConfigCanis)
		return;
  
  bot.whisper(message,
					"stats : Compila um relatório geral da qtde de posts e taxa de posts de cada robô no dia. \n" + 
          "qtde=X ou qtd=X : filtra os últimos X posts do canal, caso este  parâmetro seja omitido o Slack tem como padrão X=100. \n" +
          "app=github ou bot=github : filtra os posts do canal pelo no do robô , neste caso a busca retornaria apenas notificações do github para o usuario. \n" +
          "data=01/05/2018 : filtra todas as notificações do canal pela data passada por parâmetro , data no formado brasileiro DIA/MÊS/ANO. \n" +
          "filtro=error ou query=error : filtra as notificações pelo texto chave passado por parâmetro, neste caso que contenham o texto error.\n"
					);
  
});

//escutando msgs enviadas com tarefas p/ o robô
controller.hears(['.*'], 'direct_message,direct_mention,mention',function(bot, message) {
	var str = message.text;
	var res = str.split(" ");
	var data = ""; //data das msgs que o usuário deseje buscar
	var count = 100; //valor padrão para qtde de retornos da busca
	var search4bot = ""; //tipo de bot que o usuário deseje buscar especificamente
	var query = "";
	var dataFilter = false;
	var filter = message.text.split("filtro=");
	var respCount = 0;

	var retConfigCanis  = configuraCanais(bot, message);

	//caso os canais não estejam configurados, encerra execução
	if(retConfigCanis)
		return;
	
	//buscando tipos de filtros e seus respectivos valores de acordo com regra de busca
	for(var i = 0; i < res.length ; i++){
		var filtro = res[i].split("=");
		//filtro deve ser maior que 0, para mostrar que o split buscou corretamente o tipo de filtro e o valor
		if( (filtro.length > 0 && filtro[1] !== undefined) || (filter.length > 1)){
			switch(filtro[0]) {
				case "qtd":
					count = parseInt(filtro[1]);
					break;
				case "qtde":
					break;
				case "app":
					search4bot = filtro[1];
					break;
				case "bot":
					search4bot = filtro[1];
					break;
				case "data":
					data = filtro[1];
					//quando só existir o filtro por data devemos liberar todos os posts do dia
					if(res.length === 1)
						dataFilter = true;
					break;
				case "filtro":
					query = filter[1];
					break;
				case "query":
					query = filter[1];
					break;
				default:
					break;
			}

			
		}else{
			bot.whisper(message, "Não entendi o que você necessita! Me envie apenas informações relavantes para que possa te ajudar.");
			return ;
		}
	}

	//trabalhos com data, convertendo data em alto nível do usuário para timestamp utilizada pela API do Slack
	//caso o usuário selecionou filtro por data
	if(data !== ""){
		var ts_start = momentJs(momentJs(data + ' 00:00:00','DD/MM/YYYY HH:mm:ss').format("YYYY-MM-DD HH:mm:ss"));
		var data_valida = ts_start.isValid(); //detecta se a data é válida
		ts_start = ts_start / 1000;

		var ts_end = momentJs(momentJs(data + ' 23:59:59','DD/MM/YYYY HH:mm:ss').format("YYYY-MM-DD HH:mm:ss"));
		ts_end = ts_end / 1000;

		//verifica se a data é valida
		if(data_valida === false || ts_start < 0){
			ts_start = 0; //default da API do Slack = 0
			ts_end = momentJs(momentJs().format("YYYY-MM-DD HH:mm:ss")); //momento atual
			ts_end = ts_end / 1000;
			bot.whisper(message, "Formato de data Invalido!Por favor, insira uma data válida no formato DIA/MES/ANO");
			return;
		}
	}else{
		ts_start = 0; //default da API do Slack = 0
		ts_end = momentJs(momentJs().format("YYYY-MM-DD HH:mm:ss")); //momento atual
		ts_end = ts_end / 1000;
	}

	//tratando qtde inválida
	if(count === 0)
		count = 100;

	//buscando histórico de msgs no canal
	//@ https://api.slack.com/methods/channels.history
	bot.api.channels.history({channel: bots_channel_id, count: count, oldest: ts_start, latest: ts_end }
		, function(error, response){
    var erro = false;
		if(response.messages !== undefined){
			response.messages.forEach(function (result) {
				//buscar apenas em msgs de robôs
				if(result.bot_id != undefined && result.subtype == 'bot_message'){
					//caso exista anexo na msg, buscar dentro dela
					if(result.attachments != undefined){
						result.attachments.forEach(function (res) {
							var realizarBusca = fn.analizeSearch(result,query,search4bot,res,dataFilter);
							if( realizarBusca || dataFilter){
								sendResponse(result,bot,bots_channel_id,result.ts,res,message);
								respCount++;	
							}
						});
					}
					//caso não, pesquisa normalmente
					else{
						var realizarBusca = fn.analizeSearch(result,query,search4bot,"",dataFilter);
						if( realizarBusca || dataFilter){
							//enviar conteúdo postado por um robo para outro canal
							sendResponse(result,bot,bots_channel_id,result.ts,"",message);
							respCount++;
						}
					}
				}
			});

		}else{
      erro = true;
			bot.whisper(message, "Um erro ocorreu, eu não consegui processar a sua requisição :(");
			console.log("Um erro ocorreu, resposta inválida da API");
      console.log(response);
		}
		
		//envia resposta caso não encontre resultados para a busca
		if(respCount === 0 && erro === false)
			bot.whisper(message, "Não encontrei nada postado por robôs no canal com os critério que foram passados :(");
	});
});
  




