function formatUptime (uptime) {
    var unit = 'second';
    if (uptime > 60) {
        uptime = uptime / 60;
        unit = 'minute';
    }
    if (uptime > 60) {
        uptime = uptime / 60;
        unit = 'hour';
    }
    if (uptime != 1) {
        unit = unit + 's';
    }

    uptime = uptime + ' ' + unit;
    return uptime;
}

function log (text) {
	var fs = require('fs');
	fs.appendFile("C:\\Users\\Hiago\\Desktop\\log.txt", "\n" + text, function(erro) {
	    if(erro) {
	        throw erro;
	    }
	});
}

function analizeSearch (response,query,search4bot,att,dataFilter) {
    //console.log(response);
    query = query.trim();
    var str = "";
    var find = 0;
    var retQuery = false;
    var retBot = false;

    //valida o texto buscado pelo usuário nas msgs
    if(query !== ""){
        str = response.text.toString().toUpperCase();
        find = str.search(query.toUpperCase())
        //realiza teste da busca básica
        if(find != -1){
            retQuery = true;
        //caso não encontre, realiza busca nos anexos da msg
        }else if(att.text !== undefined && att.text !== ""){
            str = att.text.toString().toUpperCase();
            find = str.search(query.toUpperCase());
            if(find != -1){
                retQuery = true;
            }else{
                retQuery = false;
            }
        }
    }else{
        retQuery = 0;
    }

    //valida se o bot relativo a msg é o bot que o usuário deseja selecionar
    if(search4bot !== ""){
        if(response.username.toUpperCase() === search4bot.toUpperCase()){
            retBot = true;
        }else{
            retBot = false;
        }
    }else{
        retBot = false;
    }

    if(retQuery || retBot){
        //condição para filtrar casos
        if(retQuery && retBot){
            return true;
        }
        else{
            if(search4bot !== "" && retBot == true && query===""){
                return true;
            }else if(query !== "" && retQuery == true && search4bot==="")
                return true;
            else
                return false;
        }


    }
    else
        return false;
}

module.exports.formatUptime = formatUptime;
module.exports.log = log;
module.exports.analizeSearch = analizeSearch;