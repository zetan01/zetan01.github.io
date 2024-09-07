var img_tropas = "https://dspt.innogamescdn.com/8.153/40020/graphic/unit/";
var gruposCarregados = false;
var carregando = true;
var aldeias = [];
var parametro = [];
var aldeiasNumero;
var informacao_mundo;
var alvoDefault = ($('#content_value > table > tbody > tr > td:nth-child(1) > table:nth-child(1) > tbody > tr:nth-child(3) > td:nth-child(2)').text() != "") ? $('#content_value > table > tbody > tr > td:nth-child(1) > table:nth-child(1) > tbody > tr:nth-child(3) > td:nth-child(2)').text():$('#menu_row2 b').text().match(/\d+\|\d+/); ;

function esconderNaoAtivo(){
	for(var i = 0; i < informacao_mundo.tropasAtivas.length; i++){
		if(informacao_mundo.tropasAtivas[i]){
			console.log(i, true)
			$('#count_' + informacao_mundo.tropasImagens[i]).attr("class", "float_center")
			$('#splited_' + informacao_mundo.tropasImagens[i]).attr("class", "float_center")
			$('#listaAldeias tr').each(function(key){
				$(this).find('.unit-item:eq(' + i + ')').attr("class", "unit-item")
			})
		}else{
			console.log(i, false)
			$('#count_' + informacao_mundo.tropasImagens[i]).attr("class", "float_center hidden")
			$('#splited_' + informacao_mundo.tropasImagens[i]).attr("class", "float_center hidden")
			$('#listaAldeias tr').each(function(key){
				$(this).find('.unit-item:eq(' + i + ')').attr("class", "unit-item hidden")
			})
		}
	}
}

function carregarInfo(){
	carregando = true;
	var info = 	configuracaoMundo();
	
	informacao_mundo = {
		alvo:{c:"", x:0, y:0},
		velocidade_jogo:Number($(info).find("config speed").text()),
		velocidade_tropas:Number($(info).find("config unit_speed").text()),
		arqueiros:Number($(info).find("game archer").text()),
		paladino:Number($(info).find("game knight").text()),
		linkTropas:"/game.php?&village="+game_data.village.id+"&type=own_home&mode=units&group=0&page=-1&screen=overview_villages",
		linkVisualizacaoGeral:"/game.php?",
		linkComando:"/game.php?",
		tropasNecessarias:[0,0,0,0,0,0,0,0,0,0,0,0],
		tropasTotais:[0,0,0,0,0,0,0,0,0,0,0,0],
		tropasSobra:[0,0,0,0,0,0,0,0,0,0,0,0],
		tropasVelocidades:[18,22,18,18,9,10,10,11,30,30,10,35],
		tropasAtivas:[true, true, true, true, true, true, true, true, true, true, true, true],
		tropasNomes:["Lanceiro","Espadachim","Viking","Arqueiro","Batedor","Cavalaria leve","Arqueiro a cavalo","Cavalaria Pesada","ArÃ­ete","Catapulta","Paladino","Nobre"],
		tropasImagens:["spear","sword","axe","archer","spy","light","marcher","heavy","ram","catapult","knight","snob"]
	}

	if(game_data.player.sitter != 0){
		informacao_mundo.linkTropas="/game.php?t=" + game_data.player.id + "&village="+game_data.village.id+"&type=own_home&mode=units&group=0&page=-1&screen=overview_villages";
		informacao_mundo.linkVisualizacaoGeral += "t=" + game_data.player.id + "&village="+game_data.village.id+"&screen=info_village&id=";
		informacao_mundo.linkComando += "t=" + game_data.player.id + "&village=";
	}
	else{	
		informacao_mundo.linkVisualizacaoGeral += "village="+game_data.village.id+"&screen=info_village&id=";
		informacao_mundo.linkComando += "village=";
	}
	
	//Retirar arqueiros de mundos sem arqueiros
	if(!informacao_mundo.arqueiros){
		archer = informacao_mundo.tropasImagens.indexOf("archer");
		informacao_mundo.tropasNecessarias.splice(archer, 1);
		informacao_mundo.tropasTotais.splice(archer, 1);
		informacao_mundo.tropasSobra.splice(archer, 1);
		informacao_mundo.tropasVelocidades.splice(archer, 1);
		informacao_mundo.tropasAtivas.splice(archer, 1);
		informacao_mundo.tropasNomes.splice(archer, 1);
		informacao_mundo.tropasImagens.splice(archer, 1);
		marcher = informacao_mundo.tropasImagens.indexOf("marcher");
		informacao_mundo.tropasNecessarias.splice(marcher, 1);
		informacao_mundo.tropasTotais.splice(marcher, 1);
		informacao_mundo.tropasSobra.splice(marcher, 1);
		informacao_mundo.tropasVelocidades.splice(marcher, 1);
		informacao_mundo.tropasAtivas.splice(marcher, 1);
		informacao_mundo.tropasNomes.splice(marcher, 1);
		informacao_mundo.tropasImagens.splice(marcher, 1);
	}
	
	//Retirar paladinos de mundos sem paladinos
	if(!informacao_mundo.paladino){
		informacao_mundo.tropasNecessarias.splice(informacao_mundo.tropasImagens.indexOf("knight"), 1);
		informacao_mundo.tropasTotais.splice(informacao_mundo.tropasImagens.indexOf("knight"), 1);
		informacao_mundo.tropasSobra.splice(informacao_mundo.tropasImagens.indexOf("knight"), 1);
		informacao_mundo.tropasVelocidades.splice(informacao_mundo.tropasImagens.indexOf("knight"), 1);
		informacao_mundo.tropasAtivas.splice(informacao_mundo.tropasImagens.indexOf("knight"), 1);
		informacao_mundo.tropasNomes.splice(informacao_mundo.tropasImagens.indexOf("knight"), 1);
		informacao_mundo.tropasImagens.splice(informacao_mundo.tropasImgens.indexOf("knight"), 1);
	}
}

function dividirTropas(){
	$("#carregamento").html("<img src='"+image_base+"throbber.gif' />");
	var count;
	var div;
	informacao_mundo.tropasSobra = informacao_mundo.tropasNecessarias.slice(0);
	for(var i = 1; i < aldeias.length; i++){
		aldeias[i].tropasEnviar = [0,0,0,0,0,0,0,0,0,0,0,0];
		aldeias[i].tropasDiferenca = aldeias[i].tropas.slice(0);
	}
	for(var i = 0; i < informacao_mundo.tropasNecessarias.length; i++){
		if(informacao_mundo.tropasAtivas[i]){
			while(informacao_mundo.tropasSobra[i]){
				var test = 0;
				count = 0;
				k = 0;
				for(var j = 1; j < aldeias.length; j++) if(aldeias[j].tropasDiferenca[i] > 0) count++;
				div = Math.floor(informacao_mundo.tropasSobra[i] / count);
				k = informacao_mundo.tropasSobra[i] % count;
				for(var j = 1; j < aldeias.length; j++){
					if(aldeias[j].tropasDiferenca[i] == 0) continue;
					if(aldeias[j].tropasDiferenca[i] > div){
						aldeias[j].tropasEnviar[i] += div;
						aldeias[j].tropasDiferenca[i] -= div;
						informacao_mundo.tropasSobra[i] -= div;
						test += div;
						if(k){
							aldeias[j].tropasEnviar[i] ++;
							aldeias[j].tropasDiferenca[i] --;
							informacao_mundo.tropasSobra[i] --;
							k--;
							test ++;
						}
					}else if(aldeias[j].tropasDiferenca[i] == div){
						aldeias[j].tropasEnviar[i] += div;
						aldeias[j].tropasDiferenca[i] -= div;
						informacao_mundo.tropasSobra[i] -= div;
						test += div;
					}else if(aldeias[j].tropasDiferenca[i] < div){
						aldeias[j].tropasEnviar[i] += aldeias[j].tropasDiferenca[i];
						informacao_mundo.tropasSobra[i] -= aldeias[j].tropasDiferenca[i];
						aldeias[j].tropasDiferenca[i] -= aldeias[j].tropasDiferenca[i];
						test += aldeias[j].tropasDiferenca[i];
					}
				}
			}
		}
	}
	atualizarTropas();
	contarTropas();
	$("#carregamento").html("");
}

function atualizarTropas(){
	$('.divididas').each(function(i){
		$(this).find('.unit-item').each(function(j){
			$(this).text(aldeias[i+1].tropasEnviar[j])
		})
	})
	$('#tropasDivididas td span').each(function(j){
		var count = 0;
		for(var i = 1; i < aldeias.length; i++){
			count += aldeias[i].tropasEnviar[j];
			if(aldeias[i].tropasEnviar[j] == aldeias[i].tropas[j]) $(this).attr('class', 'unit-item warning')
		}
		console.log(count)
		$(this).text(count)
	});
}

function injetarTabela(){
	var elem = "";
	elem += "<div class='vis vis_item' align='center' style='overflow: auto; height: 450px;' id='tabela'>";
		// Primeira Tabela begin
		elem += "<table width='100%'>";
			elem += "<tr>";
				elem += "<td width='50%'>";
					// Segunda tabela begin
					elem += "<table style='border-spacing: 3px; border-collapse: separate; table-layout: fixed;'>"; 
						//// CabeÃ§alho begin
						elem += "<tr>";
							elem += "<th>&nbspAlvo</th>"
							//elem += "<th>&nbspData</th>"
							//elem += "<th>&nbspHora</th>"
							elem += "<th>&nbspGrupo</th>"
							//elem += "<th></th>"
						elem += "</tr>" 
						//// CabeÃ§alho end
						//// Primeira linha begin
						elem += "<tr>"; 
							elem += "<td><input size=8 type='text' onchange='mudarAlvo();' value='" + alvoDefault + "' id='alvo' /></td>"
							//elem += "<td><input size=8 type='text' value='data' onchange='poprawDate(this,'.');' id='data_input'/></td>"
							//elem += "<td><input size=8 type='text' value='hora' onchange='poprawDate(this,':');' id='hora_input'/></td>"
							elem += "<td><select id='listaGrupos' onchange='mudarGrupo();'><option value='todos'>todos</select></td>"
							//elem += "<td onclick='zmienStrzalke(); if($('#escolher_tropas').is(':visible')){ $('#escolher_tropas').hide();$('#lista_tropas').show(); guardarSelecao(); return;}	else{ $('#lista_tropas').hide(); $('#escolher_tropas').show();} ' style='cursor:pointer;'><span id='strzaleczka' class='icon header arr_down' ></span></td>"
							//elem += "<td><input type='button' class='btn' value='Calcular' onclick='escolherOpcoes();' id='przycisk'></td>"
						elem += "</tr>"; 
					elem += "</table>"
					//Segunda tabela end
				elem += "</td>";
				//Throbber begin
				elem += "<td id='carregamento'><img src='https://pt59.tribalwars.com.pt/graphic/throbber.gif'>";
				//Throbber end 
			elem += "</tr>"	
			elem += "<tr>"
				elem += "<td colspan=2>"
					//Tabela Input begin
					elem += "<table style='border-spacing: 1px; border-collapse: separate; table-layout: fixed;' width='100%'>"
						elem += "<thead>";
							elem += "<tr>"
								for(i=0;i<informacao_mundo.tropasNomes.length;i++) elem += "<th style='text-align:center'><span class='float_center'><img title='"+informacao_mundo.tropasNomes[i]+"' src='" + image_base + "unit/unit_" + informacao_mundo.tropasImagens[i] + ".png'></span></th>";
								elem += "<td rowspan='2'><input width='100%' type='button' class='btn' value='Calcular' onclick='dividirTropas();'></td>"
							elem += "</tr>"
							elem += "<tr id='inputs' class='row_b'>"
								for(i=0;i<informacao_mundo.tropasNomes.length;i++) elem += "<td><input onchange='atualizarNecessario()' style='width:92% !important;' type='number' id='need_" + (informacao_mundo.tropasImagens[i]) + "' min='0' value='0'></td>";
							elem += "</tr>"	
						elem += "</thead>";
					elem += "</table>"
					//Tabela Input end	
				elem += "</td>";
			elem += "</tr>"	
			elem += "<br>"
			elem += "<tr>"
				elem += "<td colspan=2 width='100%'>"
					// Quarta tabela begin
					elem += "<table style='border-spacing: 1px; border-collapse: separate; table-layout: fixed;' width='100%'>"
						elem += "<thead>"
							elem += "<tr>"
								elem += "<th rowspan='3' width='25%'><span id='numero_possibilidades'>&nbsp;(0)</span><span class='icon header village float_right' ></span></th>";
								for(i=0;i<informacao_mundo.tropasNomes.length;i++)elem += "<th style='text-align:center'><span class='float_center'><img title='"+informacao_mundo.tropasNomes[i]+"' src='"+image_base+"unit/unit_"+informacao_mundo.tropasImagens[i]+".png'></span></th>";
							elem += "<td rowspan='3' id='botaoPrincipal'><input type='button' value='Confirmar' class='btn' onClick='comecar(); $(this).hide();'></td>"
							elem += "</tr>"
							elem += "<tr id='tropasTotais' class='row_b'>";
								for(i=0;i<informacao_mundo.tropasNomes.length;i++)elem += "<td style='text-align:center'><span class='float_center' id='count_" + (informacao_mundo.tropasImagens[i]) + "'>0</span></th>";
							elem += "<tr id='tropasDivididas' class='row_b'>";
								for(i=0;i<informacao_mundo.tropasNomes.length;i++)elem += "<td style='text-align:center'><span class='float_center' id='splited_" + (informacao_mundo.tropasImagens[i]) + "'>0</span></th>";
								//elem += "<th style='text-align:left'>&nbspHora de saÃ­da</th>"
								//elem += "<th style='text-align:center'><span class=\'icon header time\'></th>"
								//elem += "<th><b>&nbspComando</b></th>";
							elem += "</tr>"
						elem += "</thead>"
						elem += "<tbody id='listaAldeias'>"
						elem += "</tbody>"
					elem += "</table>"
					// Quarta tabela end
				elem += "</td>"
			elem += "</tr>"
		// Primeira tabela end
		elem += "</table>"
	elem += "</div>"
	$(mobile?"#mobileContent":"#inner-border > table > tbody").prepend(elem);
	//$(mobile?"#mobileContent":"#contentContainer").prepend(elem);
}

function atualizarNecessario(){
	$("#carregamento").html("<img src='"+image_base+"throbber.gif' />");
	$('#inputs input').each(function(i){
		informacao_mundo.tropasNecessarias[i] = Number($(this).val())
		if(informacao_mundo.tropasNecessarias[i]) informacao_mundo.tropasAtivas[i] = true;
		else informacao_mundo.tropasAtivas[i] = false;
	})
	esconderNaoAtivo();
	$("#carregamento").html("");
}

function contarTropas(){
	$('#tropasTotais span').each(function(i){
			var count = 0;
			for(var j = 1; j < aldeias.length; j++) count += aldeias[j].tropas[i];
			//informacao_mundo.tropasTotais[i] = count;
			$(this).text(count)
	});
}

if(!($('#tabela').length)){
	carregarInfo();
	injetarTabela();
	carregarAldeias();
}

function carregarAldeias(){	
	var r;
	r = new XMLHttpRequest();
	r.open('GET', informacao_mundo.linkTropas, true);
	console.log("A obter: " + informacao_mundo.linkTropas)
	function processResponse(){
		if (r.readyState == 4 && r.status == 200) {
			requestedBody = document.createElement("body");
			requestedBody.innerHTML = r.responseText;
			var tabela = $(requestedBody).find('#units_table').get()[0];
			
			var grupo = $(requestedBody).find('.vis_item').get()[0].getElementsByTagName(mobile?'option':'a');
			console.log(grupo)
			if(!tabela){ $("#carregamento").html("NÃ£o existem aldeias neste grupo..."); carregando = false; return;}
			for(i=1;i<tabela.rows.length;i++){
				var tropas = [];
				var tropasDiferenca = [];
				var tropasEnviar = [];
				var aldeiaVazia = 0;
				for(j=2;j<tabela.rows[i].cells.length-1;j++){
					tropas.push(Number(tabela.rows[i].cells[j].textContent));
					tropasDiferenca.push(Number(tabela.rows[i].cells[j].textContent));
					tropasEnviar.push(0);
					if(!Number(tropas[j-2])) aldeiaVazia++;
				}
				tropas.pop()
				tropasDiferenca.pop()
				tropasEnviar.pop()
				aldeias[i] = {
					id:tabela.rows[i].cells[0].getElementsByTagName('span')[0].getAttribute("data-id"),
					nome_filtrado:tabela.rows[i].cells[0].getElementsByTagName('span')[2].textContent.match(/\d+/g),
					nome:tabela.rows[i].cells[0].getElementsByTagName('span')[2].textContent,
					tropas:tropas,
					tropasDiferenca:tropasDiferenca,
					tropasEnviar:tropasEnviar,
				}
			}
			
			if(!gruposCarregados){
				for(i=0;i<grupo.length;i++){
					nome = grupo[i].textContent;
					if(mobile && grupo[i].textContent=="todos") continue;
					$("#listaGrupos").append($('<option>', {
						value: grupo[i].getAttribute(mobile?"value":"href")+"&page=-1",
						text: mobile?nome:nome.slice(1,nome.length-1)
					}));
				}
				
				gruposCarregados = true;
			}
			
			aldeiasNumero = aldeias.length - 1;
			
			$("#carregamento").html("");
			mostrarAldeias()
			carregando = false;
		};
	}
	r.onreadystatechange = processResponse;
	r.send(null);
}

function mudarGrupo(){
	$("#carregamento").html("<img src='"+image_base+"throbber.gif' />");
	aldeias = [];
	informacao_mundo.linkTropas = document.getElementById('listaGrupos').value;
	carregarAldeias();
}

function mostrarAldeias(){
	$('#listaAldeias').empty();
	for(var i = 1; i < aldeias.length; i++){
		var k = i + 1;
		var html = '';
		html += '<tr class="' + (k%2?"row_a":"row_b") +' total">'
		html += '<td rowspan="2"><a href="' + informacao_mundo.linkVisualizacaoGeral + aldeias[i].id + '">' + aldeias[i].nome.replace(/\s+/g, "\u00A0") + '</a></td>'
		for(var j = 0; j < aldeias[i].tropas.length; j++) html += '<td class="' + (aldeias[i].tropas[j]?"unit-item":"unit-item hidden") + '">' + aldeias[i].tropas[j] + '</td>'
		html += '<td rowspan="2" style="text-align:center" id="info-' + aldeias[i].id + '">&nbsp</td>'
		html += '</tr>'
		html += '<tr class="' + (k%2?"row_a":"row_b") +' divididas">'
		for(var j = 0; j < aldeias[i].tropas.length; j++) html += '<td class="' + (aldeias[i].tropas[j]?"unit-item":"unit-item hidden") + '">0</td>';
		html += '</tr>'
		$('#listaAldeias').append(html)
		contarTropas();
	}
	$('#numero_possibilidades').html("&nbsp;(" + (aldeias.length - 1) + ")")
}

function configuracaoMundo(){
	var dt;
	$.ajax({
		'async':false,
		'url':'/interface.php?func=get_config',
		'dataType':'xml',
		'success':function(data){dt=data;}
	});
	return dt;
}

function aleatorio(inferior, superior) {
    return Math.round(parseInt(inferior) + (Math.random() * (superior - inferior)));
}

function mudarAlvo(){
	temp = $('#alvo').val()
	temp = parseInt(temp.replace(/[^0-9]/g, ''));
	informacao_mundo.alvo.x = Number(String(temp).substring(0,3));
	informacao_mundo.alvo.y = Number(String(temp).substring(3,6));
	informacao_mundo.alvo.c = informacao_mundo.alvo.x + "|" + informacao_mundo.alvo.y;
	console.log(informacao_mundo.alvo)
	$('#alvo').val(informacao_mundo.alvo.c)
}

function comecar(){
	var i = 0;
	var delay = 0;
	for(let aldeia of aldeias){
		if(aldeia == undefined) continue;
		$('#info-' + aldeia.id).empty();
		$('#info-' + aldeia.id).html('<img class="float_center" src="https://dl.dropboxusercontent.com/s/0a2jq71ity91cjq/loading.gif">');
		setTimeout(function(){
			serializar(aldeia);
			i++;
			if(i >= aldeias.length-1){
				$('#botaoPrincipal').empty();
				$('#botaoPrincipal').html('<input type="button" value="Enviar" class="btn btn-confirm-yes" onclick="continuar(); $(this).hide()">');
				UI.InfoMessage('Preparado.', 2500, 'success');
			}
		}, delay * aleatorio(250, 350) + aleatorio(250, 350))
		delay++;
	}
}

function continuar(){
	var i = 0;
	var delay = 0;
	for(let aldeia of aldeias){
		if(aldeia == undefined) continue;
		$('#info-' + aldeia.id).empty();
		$('#info-' + aldeia.id).html('<img class="float_center" src="https://dl.dropboxusercontent.com/s/0a2jq71ity91cjq/loading.gif">');
		setTimeout(function(){
			enviar(aldeia);
			i++;
			if(i >= aldeias.length){
				UI.InfoMessage('Enviado!', 2500, 'success');
			}
		}, delay * aleatorio(250, 350) + aleatorio(250, 350))
		delay++;
	}
}

function serializar(aldeia){
	mudarAlvo();
	var tropasEnviar = '';
	for(var i = 0; i < aldeia.tropasEnviar.length; i++) if(aldeia.tropasEnviar[i]) tropasEnviar += "&att_" + informacao_mundo.tropasImagens[i] + "=" + aldeia.tropasEnviar[i];
	if(aldeia.tropasEnviar.reduce(function(total, num){ return total + num }) < 1){
		$('#info-' + aldeia.id).empty();
		$('#info-' + aldeia.id).html('<span>Vazia</span>');
		return;
	}
	$.ajax({
        url: informacao_mundo.linkComando + "&screen=place&ajax=command&x=" + informacao_mundo.alvo.x + "&y=" + informacao_mundo.alvo.y + "&client_time=" + Math.round(Timing.getCurrentServerTime() / 1e3),
        data: {},
		type: "GET",
		dataType: "json",
		headers: { "TribalWars-Ajax": 1 },
		success: function(data) {
			if (!data.error) {
			data_ = $(data.response.dialog);
			if (!parametro[0]) {
				parametro[0] = jQuery('input:eq(0)', data_).attr('name');
				parametro[1] = jQuery('input:eq(0)', data_).val();
			}
			console.log(data_)
			} else {
				if(data.error === "A sua sess\u00e3o expirou. Por favor, acesse novamente.") {
					$('#info-' + aldeia.id).html('<a><img class="float_center" src="' + image_base + 'error.png"></a>');
					UI.InfoMessage('A sessÃ£o expirou.', 2500, 'error');
				}
			}
		},
		error: function () {
				$('#info-' + aldeia.id).html('<a target="_blank" href="' + informacao_mundo.linkComando + aldeia.id + '&screen=place&x=' + informacao_mundo.alvo.x + '&y=' + informacao_mundo.alvo.y + '&from=simulator' + tropasEnviar + '"><img class="float_center" src="' + image_base + 'error.png"></a>');
				UI.InfoMessage('Ocurreu um erro.', 2500, 'error'); 
			}
	});
	
	let _Data = {};
	_Data[parametro[0]] = parametro[1];
	_Data.template_id = "";
	_Data.source_village = aldeia.id;
	_Data.spear = aldeia.tropasEnviar[informacao_mundo.tropasImagens.indexOf('spear')];
	_Data.sword = aldeia.tropasEnviar[informacao_mundo.tropasImagens.indexOf('sword')];
	_Data.axe = aldeia.tropasEnviar[informacao_mundo.tropasImagens.indexOf('axe')];
	if (informacao_mundo.arqueiros) { _Data.archer = aldeia.tropasEnviar[informacao_mundo.tropasImagens.indexOf('archer')]; }
	_Data.spy = aldeia.tropasEnviar[informacao_mundo.tropasImagens.indexOf('spy')];
	_Data.light = aldeia.tropasEnviar[informacao_mundo.tropasImagens.indexOf('light')];
	if (informacao_mundo.arqueiros) { _Data.marcher = aldeia.tropasEnviar[informacao_mundo.tropasImagens.indexOf('marcher')]; }
	_Data.heavy = aldeia.tropasEnviar[informacao_mundo.tropasImagens.indexOf('heavy')];
	_Data.ram = aldeia.tropasEnviar[informacao_mundo.tropasImagens.indexOf('ram')];
	_Data.catapult = aldeia.tropasEnviar[informacao_mundo.tropasImagens.indexOf('catapult')];
	if (informacao_mundo.knight) { _Data.knight = aldeia.tropasEnviar[informacao_mundo.tropasImagens.indexOf('knight')]; }
	_Data.snob = aldeia.tropasEnviar[informacao_mundo.tropasImagens.indexOf('snob')];
	_Data.x = informacao_mundo.alvo.x;
	_Data.y = informacao_mundo.alvo.y;
	_Data.input = "";
	_Data.support = 1;
	$.ajax({
		url: informacao_mundo.linkComando + "&screen=place&ajax=confirm&h=" + csrf_token + "&client_time=" + Math.round(Timing.getCurrentServerTime() / 1e3),
		data: _Data,
		type: "POST",
		dataType: "json",
		headers: { "TribalWars-Ajax": 1 },
		success: function(data) {
			if (!data.error) {
				$('#info-' + aldeia.id).empty();
				$('#info-' + aldeia.id).html('<span><a onClick="enviarId(' + aldeia.id + ')">Ready!</a></span>');
				aldeia.seriliaze = $(data.response.dialog).serialize();
				console.log(aldeia)
			} else {
				$('#info-' + aldeia.id).html('<a target="_blank" href="' + informacao_mundo.linkComando + aldeia.id + '&screen=place&x=' + informacao_mundo.alvo.x + '&y=' + informacao_mundo.alvo.y + '&from=simulator' + tropasEnviar + '"><img class="float_center" src="' + image_base + 'error.png"></a>');
				if(data.error === "A sua sess\u00e3o expirou. Por favor, acesse novamente.") {}
				console.log(data.error)
			}
		},
		error: function () {
			$('#info-' + aldeia.id).html('<a target="_blank" href="' + informacao_mundo.linkComando + aldeia.id + '.tribalwars.com.pt/game.php?village=' + aldeia.id + '&screen=place&x=' + informacao_mundo.alvo.x + '&y=' + informacao_mundo.alvo.y + '&from=simulator' + tropasEnviar + '"><img class="float_center" src="' + image_base + 'error.png"></a>');
		}
	});
}

function enviar(aldeia){
	if(aldeia.tropasEnviar.reduce(function(total, num){ return total + num }) < 1){
		$('#info-' + aldeia.id).empty();
		$('#info-' + aldeia.id).html('<span>Vazia</span>');
		return;
	}
	let i = 0;
    let delay = 0;
    let u = [ informacao_mundo.linkComando, "&screen=place&ajaxaction=popup_command&h=", csrf_token, "&client_time=", Math.round(Timing.getCurrentServerTime() / 1e3) ];
	$.ajax({
		url: u.join(''),
		data: aldeia.seriliaze,
		type: "POST",
		dataType: "json",
		headers: { "TribalWars-Ajax": 1 },
		success: function(data) {
			if (!data.error) {
				$('#info-' + aldeia.id).html('<span><img src="https://dl.dropboxusercontent.com/s/nfnxioc97yz7ykk/completed.png" alt="Sent!"></span>');
			} else {
				$('#info-' + aldeia.id).html('<a target="_blank" href="' + informacao_mundo.linkComando + aldeia.id + '&screen=place&x=' + informacao_mundo.alvo.x + '&y=' + informacao_mundo.alvo.y + '&from=simulator' + tropasEnviar + '"><img class="float_center" src="' + image_base + 'error.png"></a>');
				if(data.error === "A sua sess\u00e3o expirou. Por favor, acesse novamente.") {}
			}
		},
		error: function () {
			$('#info-' + aldeia.id).html('<a target="_blank" href="' + informacao_mundo.linkComando + aldeia.id  + '&screen=place&x=' + informacao_mundo.alvo.x + '&y=' + informacao_mundo.alvo.y + '&from=simulator' + tropasEnviar + '"><img class="float_center" src="' + image_base + 'error.png"></a>');
		}
	}); 
}

function serializarId(ids){
	aldeia = aldeias.filter(function(aldeia){return aldeia.id === ids})
	serializar(aldeia);
}

function enviarId(ids){ 
	aldeias.find(aldeia => aldeia.id === ids)
	enviar(aldeia);
}