// Configuração inicial do mapa
const map = L.map('map').setView([20, 0], 2); // Visão global

// Adicionar camada base do OpenStreetMap
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
	attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
}).addTo(map);

// Adicionar camada de satélite como opção
const sateliteLayer = L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}', {
	attribution: 'Imagery &copy; Esri',
	maxZoom: 19
});

// Camadas base
const baseMaps = {
	"Mapa": L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
		attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
	}),
	"Satélite": sateliteLayer
};

// Adicionar controle de camadas
L.control.layers(baseMaps).addTo(map);

// Criar um grupo de marcadores para queimadas
const queimadasLayer = L.layerGroup().addTo(map);

// Definir regiões com suas coordenadas e zoom
const regioes = {
	global: {
		centro: [20, 0],
		zoom: 2
	},
	america: {
		centro: [0, -80],
		zoom: 3
	},
	europe: {
		centro: [50, 10],
		zoom: 4
	},
	africa: {
		centro: [0, 20],
		zoom: 3
	},
	asia: {
		centro: [30, 100],
		zoom: 3
	},
	oceania: {
		centro: [-25, 135],
		zoom: 4
	}
};

async function carregarDadosQueimadas(periodo = '24h', tipo = 'todos', intensidade = 'todos', regiao = 'global') {
	// Limpar marcadores existentes
	queimadasLayer.clearLayers();

	// Configurar o período de tempo de busca com base na seleção do usuário
	let dataRange;
	switch (periodo) {
		case '48h':
			dataRange = 2;
			break;
		case '7d':
			dataRange = 7;
			break;
		case '10d':
			dataRange = 10;
			break;
		default:
			dataRange = 1; // 24h
	}

	// Formata a data atual para consulta
	const hoje = new Date();
	const dataAtual = hoje.toISOString().split('T')[0]; // Formato YYYY-MM-DD


	// Configurar os limites de busca com base na região selecionada
	let limites_regiao;
	switch (regiao) {
		case 'america':
			limites_regiao = "-170,-60,-30,80";
			break; // Américas
		case 'europe':
			limites_regiao = "-20,35,45,70";
			break; // Europa
		case 'africa':
			limites_regiao = "-20,-40,55,40";
			break; // África
		case 'asia':
			limites_regiao = "25,0,180,80";
			break; // Ásia
		case 'oceania':
			limites_regiao = "105,-50,180,-5";
			break; // Oceania
		default:
			limites_regiao = "-180,-90,180,90"; // Global
	}

	// Determinar a fonte de dados (MODIS)
	const fonte = "MODIS_NRT";

	// Chave da API NASA FIRMS
	const API_KEY = "93c17aedff4ab8221d238c996e7b609b";

	try {
		// URL da API NASA FIRMS usando o formato CSV
		const url = `https://firms.modaps.eosdis.nasa.gov/api/area/csv/${API_KEY}/${fonte}/${limites_regiao}/${dataRange}/${dataAtual}`;

		document.getElementById('totalQueimadas').innerHTML = 'Carregando dados de queimadas reais...';

		// Fazer a chamada à API
		const response = await fetch(url);

		if (!response.ok) {
			throw new Error(`Erro na API: ${response.status}`);
		}

		// Obter o texto CSV
		const csvText = await response.text();

		// Processar os dados CSV recebidos
		const queimadasFiltradas = processarCSVFIRMS(csvText, tipo, intensidade);

		if (queimadasFiltradas.length === 0) {
			document.getElementById('totalQueimadas').innerHTML = 'Nenhum dado de queimada encontrado para o período e filtros selecionados.';
			return;
		}

		// Adicionar marcadores ao mapa
		queimadasFiltradas.forEach(ponto => {
			const marker = L.circleMarker([ponto.lat, ponto.lng], {
				radius: ponto.intensidade / 20 + 3, // Ajuste para melhor visualização
				fillColor: getColor(ponto.intensidade),
				color: '#000',
				weight: 1,
				opacity: 0.8,
				fillOpacity: 0.7
			}).addTo(queimadasLayer);

			marker.bindPopup(`
                <div style="min-width: 200px;">
                    <strong style="color: #1B5E20; font-size: 16px;">Queimada Detectada</strong>
                    <div style="margin-top: 10px; border-top: 1px solid #E8F5E9; padding-top: 8px;">
                        <p><strong>Data:</strong> ${ponto.data}</p>
                        <p><strong>Intensidade:</strong> ${getNomeIntensidade(ponto.intensidade)}</p>
                        <p><strong>Tipo:</strong> ${ponto.tipo}</p>
                        <p><strong>Localização:</strong> ${ponto.localidade}</p>
                        <p><strong>Fonte:</strong> ${ponto.fonte}</p>
                        <p><strong>Confiança:</strong> ${ponto.confianca}%</p>
                    </div>
                </div>
            `);
		});

		// Atualizar estatísticas
		atualizarEstatisticas(queimadasFiltradas, regiao);

	} catch (error) {
		console.error('Erro ao carregar dados da API NASA FIRMS:', error);
		document.getElementById('totalQueimadas').innerHTML = `
            <p style="color: #EF5350;">Erro ao carregar dados da API NASA FIRMS. ${error.message}</p>
        `;
	}
}

// Função para processar os dados CSV recebidos da API NASA FIRMS
function processarCSVFIRMS(csvText, tipoFiltro, intensidadeFiltro) {
	const pontos = [];

	// Verificar se há dados
	if (!csvText || csvText.trim() === '') {
		console.warn("Nenhum dado CSV recebido da API.");
		return pontos;
	}

	// Dividir o CSV em linhas
	const linhas = csvText.split('\n');

	// Verificar se há pelo menos o cabeçalho e uma linha de dados
	if (linhas.length < 2) {
		console.warn("Dados CSV insuficientes.");
		return pontos;
	}

	// Obter os cabeçalhos
	const cabecalhos = linhas[0].split(',').map(header => header.trim());

	// Encontrar os índices das colunas relevantes
	const indiceLatitude = cabecalhos.indexOf('latitude');
	const indiceLongitude = cabecalhos.indexOf('longitude');
	const indiceBrilho = cabecalhos.findIndex(h => h === 'brightness' || h === 'bright_t31'); // MODIS usa brightness
	const indiceFRP = cabecalhos.indexOf('frp');
	const indiceData = cabecalhos.indexOf('acq_date');
	const indiceHora = cabecalhos.indexOf('acq_time');
	const indiceConfianca = cabecalhos.findIndex(h => h === 'confidence' || h === 'confidence_pct');
	const indiceSatelite = cabecalhos.indexOf('satellite');
	const indiceInstrumento = cabecalhos.indexOf('instrument');
	const indiceTipoFogo = cabecalhos.indexOf('type');
	const indiceCoberturaTerreno = cabecalhos.indexOf('land_cover');

	// Verificar se os índices essenciais foram encontrados
	if (indiceLatitude === -1 || indiceLongitude === -1) {
		console.error("CSV não possui colunas de latitude/longitude.");
		return pontos;
	}

	// Processar cada linha de dados
	for (let i = 1; i < linhas.length; i++) {
		const linha = linhas[i].trim();
		if (!linha) continue; // Pular linhas vazias

		// Dividir a linha em campos
		// Esta abordagem simples não lida com virgulas dentro de campos entre aspas
		const campos = linha.split(',').map(campo => campo.trim());

		// Verificar se temos dados suficientes
		if (campos.length <= Math.max(indiceLatitude, indiceLongitude)) continue;

		// Obter latitude e longitude
		const lat = parseFloat(campos[indiceLatitude]);
		const lng = parseFloat(campos[indiceLongitude]);

		// Verificar se as coordenadas são válidas
		if (isNaN(lat) || isNaN(lng)) continue;

		// Calcular intensidade com base nos dados disponíveis
		let intensidade;
		if (indiceFRP !== -1 && campos[indiceFRP]) {
			// Fire Radiative Power (FRP) - indica a intensidade da queimada
			intensidade = Math.min(100, Math.max(1, parseFloat(campos[indiceFRP]) * 2));
		} else if (indiceBrilho !== -1 && campos[indiceBrilho]) {
			// Brilho no canal termal (MODIS usa um range diferente do VIIRS)
			intensidade = Math.min(100, Math.max(1, (parseFloat(campos[indiceBrilho]) - 280) / 3));
		} else {
			// Valor padrão se nenhum dos anteriores estiver disponível
			intensidade = 50;
		}

		// Determinar tipo de queimada
		let tipo;
		if (indiceTipoFogo !== -1 && campos[indiceTipoFogo]) {
			// Se o CSV tem informação de tipo de fogo
			const tipoFogo = campos[indiceTipoFogo].toLowerCase();
			if (tipoFogo.includes('forest') || tipoFogo.includes('wildfire')) {
				tipo = 'Incêndios Florestais';
			} else if (tipoFogo.includes('agri') || tipoFogo.includes('crop')) {
				tipo = 'Queimadas Agrícolas';
			} else if (tipoFogo.includes('urban') || tipoFogo.includes('industrial')) {
				tipo = 'Queimadas Urbanas';
			} else {
				tipo = 'Outros Tipos';
			}
		} else if (indiceCoberturaTerreno !== -1 && campos[indiceCoberturaTerreno]) {
			// Usar cobertura do terreno como indicativo do tipo de queimada
			const cobertura = campos[indiceCoberturaTerreno].toLowerCase();
			if (cobertura.includes('forest') || cobertura.includes('tree')) {
				tipo = 'Incêndios Florestais';
			} else if (cobertura.includes('crop') || cobertura.includes('agri')) {
				tipo = 'Queimadas Agrícolas';
			} else if (cobertura.includes('urban') || cobertura.includes('built')) {
				tipo = 'Queimadas Urbanas';
			} else {
				tipo = 'Outros Tipos';
			}
		} else {
			// Classificação baseada na intensidade (para demonstração)
			if (intensidade > 70) {
				tipo = 'Incêndios Florestais';
			} else if (intensidade > 40) {
				tipo = 'Queimadas Agrícolas';
			} else {
				tipo = 'Queimadas Urbanas';
			}
		}

		// Aplicar filtros
		let incluirPonto = true;

		// Filtrar por tipo
		if (tipoFiltro !== 'todos') {
			switch (tipoFiltro) {
				case 'florestal':
					incluirPonto = tipo === 'Incêndios Florestais';
					break;
				case 'agricola':
					incluirPonto = tipo === 'Queimadas Agrícolas';
					break;
				case 'urbana':
					incluirPonto = tipo === 'Queimadas Urbanas';
					break;
			}
		}

		// Filtrar por intensidade
		if (intensidadeFiltro !== 'todos') {
			switch (intensidadeFiltro) {
				case 'baixa':
					incluirPonto = intensidade <= 20;
					break;
				case 'media':
					incluirPonto = intensidade > 20 && intensidade <= 40;
					break;
				case 'alta':
					incluirPonto = intensidade > 40 && intensidade <= 80;
					break;
				case 'extrema':
					incluirPonto = intensidade > 80;
					break;
			}
		}

		if (incluirPonto) {
			// Formatar a data
			let data = indiceData !== -1 ? campos[indiceData] : '';
			if (data && data.includes('-')) {
				// Converter de YYYY-MM-DD para DD/MM/YYYY
				const partes = data.split('-');
				data = `${partes[2]}/${partes[1]}/${partes[0]}`;
			} else {
				data = new Date().toLocaleDateString('pt-BR');
			}

			// Adicionar hora se disponível
			if (indiceHora !== -1 && campos[indiceHora]) {
				const hora = campos[indiceHora].padStart(4, '0');
				data += ` ${hora.substring(0, 2)}:${hora.substring(2, 4)}`;
			}

			// Obter informação de confiança
			let confianca = 0;
			if (indiceConfianca !== -1 && campos[indiceConfianca]) {
				confianca = parseInt(campos[indiceConfianca]);
				if (isNaN(confianca)) confianca = 50; // Valor padrão
			} else {
				confianca = Math.floor(Math.random() * 100) + 1; // Valor aleatório para demonstração
			}

			// Obter informação da fonte
			let fonte = 'NASA FIRMS - MODIS'; // Atualizado para especificar MODIS
			if (indiceSatelite !== -1 && campos[indiceSatelite]) {
				fonte = `${campos[indiceSatelite]} - MODIS`;
				if (indiceInstrumento !== -1 && campos[indiceInstrumento]) {
					fonte += ` (${campos[indiceInstrumento]})`;
				}
			}

			// Construir informação de localidade (simplificada)
			const localidade = `Lat: ${lat.toFixed(4)}, Lng: ${lng.toFixed(4)}`;

			// Adicionar ao array de pontos
			pontos.push({
				lat: lat,
				lng: lng,
				intensidade: intensidade,
				data: data,
				tipo: tipo,
				confianca: confianca,
				fonte: fonte,
				localidade: localidade
				// Para as estatísticas
			});
		}
	}

	return pontos;
}

// Função para obter nome da intensidade
function getNomeIntensidade(valor) {
	if (valor > 80) return '<span style="color: #EF5350;">Extrema</span>';
	if (valor > 60) return '<span style="color: #FFA726;">Alta</span>';
	if (valor > 40) return '<span style="color: #FFC107;">Média</span>';
	if (valor > 20) return '<span style="color: #4CAF50;">Baixa</span>';
	return '<span style="color: #66BB6A;">Muito Baixa</span>';
}

// Função para determinar a cor baseada na intensidade da queimada
function getColor(intensidade) {
	return intensidade > 80 ? '#EF5350' : // Vermelho perigo
		intensidade > 60 ? '#FFA726' : // Laranja aviso
		intensidade > 40 ? '#FFC107' : // Amarelo sol
		intensidade > 20 ? '#4CAF50' : // Verde médio
		'#66BB6A'; // Verde sucesso
}

// Função para atualizar estatísticas
function atualizarEstatisticas(dados, regiao) {
	const total = dados.length;
	const porTipo = {};
	const porIntensidade = {
		'Extrema': 0,
		'Alta': 0,
		'Média': 0,
		'Baixa': 0,
		'Muito Baixa': 0
	};

	dados.forEach(ponto => {
		// Contagem por tipo
		if (!porTipo[ponto.tipo]) {
			porTipo[ponto.tipo] = 0;
		}
		porTipo[ponto.tipo]++;

		// Contagem por intensidade
		if (ponto.intensidade > 80) porIntensidade['Extrema']++;
		else if (ponto.intensidade > 60) porIntensidade['Alta']++;
		else if (ponto.intensidade > 40) porIntensidade['Média']++;
		else if (ponto.intensidade > 20) porIntensidade['Baixa']++;
		else porIntensidade['Muito Baixa']++;
	});

	let estatisticasHTML = `<p>Total de focos de queimada (${getNomeRegiao(regiao)}): <strong>${total}</strong></p>`;

	// Distribuição por intensidade
	estatisticasHTML += '<div style="margin: 15px 0; padding: 10px; background-color: #E8F5E9; border-radius: 5px;">';
	estatisticasHTML += '<p style="font-weight: 500; margin-bottom: 8px;">Distribuição por intensidade:</p>';

	const cores = {
		'Extrema': '#EF5350',
		'Alta': '#FFA726',
		'Média': '#FFC107',
		'Baixa': '#4CAF50',
		'Muito Baixa': '#66BB6A'
	};

	for (const intensidade in porIntensidade) {
		if (porIntensidade[intensidade] > 0) {
			const percentual = ((porIntensidade[intensidade] / total) * 100).toFixed(1);
			estatisticasHTML += `
                        <div style="display: flex; align-items: center; margin-bottom: 5px;">
                            <div style="width: 15px; height: 15px; background-color: ${cores[intensidade]}; margin-right: 10px; border-radius: 50%;"></div>
                            <div style="flex-grow: 1;">${intensidade}: ${porIntensidade[intensidade]} (${percentual}%)</div>
                        </div>
                    `;
		}
	}
	estatisticasHTML += '</div>';

	// Distribuição por tipo
	estatisticasHTML += '<p style="font-weight: 500; margin-bottom: 8px;">Distribuição por tipo:</p><ul>';
	for (const tipo in porTipo) {
		const percentual = ((porTipo[tipo] / total) * 100).toFixed(1);
		estatisticasHTML += `<li>${tipo}: ${porTipo[tipo]} (${percentual}%)</li>`;
	}
	estatisticasHTML += '</ul>';

	document.getElementById('totalQueimadas').innerHTML = estatisticasHTML;
}

// Obter nome da região para exibição
function getNomeRegiao(regiao) {
	switch (regiao) {
		case 'global':
			return 'Global';
		case 'america':
			return 'Américas';
		case 'europe':
			return 'Europa';
		case 'africa':
			return 'África';
		case 'asia':
			return 'Ásia';
		case 'oceania':
			return 'Oceania';
		default:
			return 'Global';
	}
}


// Adicionar legenda ao mapa
const legend = L.control({
	position: 'bottomright'
});

legend.onAdd = function(map) {
	const div = L.DomUtil.create('div', 'legend');

	div.innerHTML = `
                <h4>Intensidade das Queimadas</h4>
                <i style="background:#EF5350"></i> Extrema (81-100)<br>
                <i style="background:#FFA726"></i> Alta (61-80)<br>
                <i style="background:#FFC107"></i> Média (41-60)<br>
                <i style="background:#4CAF50"></i> Baixa (21-40)<br>
                <i style="background:#66BB6A"></i> Muito Baixa (1-20)
            `;

	return div;
};

legend.addTo(map);

// Adicionar informações ao mapa
const info = L.control({
	position: 'topright'
});

info.onAdd = function(map) {
	const div = L.DomUtil.create('div', 'info');
	div.innerHTML = '<h4>Informações</h4>Passe o mouse sobre um ponto para ver detalhes';
	return div;
};

info.addTo(map);

// Event listeners para as abas de região
document.querySelectorAll('.region-tab').forEach(tab => {
	tab.addEventListener('click', function() {
		// Remover classe ativa de todas as abas
		document.querySelectorAll('.region-tab').forEach(t => t.classList.remove('active'));

		// Adicionar classe ativa na aba clicada
		this.classList.add('active');

		// Obter região selecionada
		const regiao = this.getAttribute('data-region');

		// Centralizar o mapa na região selecionada
		map.setView(regioes[regiao].centro, regioes[regiao].zoom);

		// Recarregar dados para a região
		const periodo = document.getElementById('periodoSelect').value;
		const tipo = document.getElementById('tipoSelect').value;
		const intensidade = document.getElementById('intensidadeSelect').value;

		carregarDadosQueimadas(periodo, tipo, intensidade, regiao);
	});
});

// Event listener para o botão de filtros
document.getElementById('aplicarFiltros').addEventListener('click', function() {
	const periodo = document.getElementById('periodoSelect').value;
	const tipo = document.getElementById('tipoSelect').value;
	const intensidade = document.getElementById('intensidadeSelect').value;

	// Obter região ativa
	const regiaoAtiva = document.querySelector('.region-tab.active').getAttribute('data-region');

	carregarDadosQueimadas(periodo, tipo, intensidade, regiaoAtiva);
});

// Inicializar com dados globais
carregarDadosQueimadas();

// Ajustar mapa ao redimensionar a janela
window.addEventListener('resize', function() {
	map.invalidateSize();
});