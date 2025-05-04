document.addEventListener('DOMContentLoaded', () => {
	const carousel = document.getElementById('carousel');
	const prevBtn = document.querySelector('.prev');
	const nextBtn = document.querySelector('.next');
	const indicatorsContainer = document.getElementById('indicators');
	const prevPageBtn = document.getElementById('prevPageBtn');
	const nextPageBtn = document.getElementById('nextPageBtn');
	const pageInfo = document.getElementById('pageInfo');

	// Controles do carrossel e paginação
	let currentIndex = 0; // Índice atual no carrossel
	let newsData = []; // Dados das notícias
	let allNewsData = []; // Todas as notícias obtidas
	let currentPage = 1; // Página atual
	const totalPages = 3; // Total de páginas (3 conjuntos de 3 cards = 9 cards)
	const cardsPerPage = 3; // Número de cards por página

	// Formata a data para o formato brasileiro
	function formatDate(dateString) {
		const options = {
			year: 'numeric',
			month: 'long',
			day: 'numeric'
		};
		return new Date(dateString).toLocaleDateString('pt-BR', options);
	}

	// Determina quantos slides são visíveis com base no tamanho da tela
	function getVisibleSlides() {
		if (window.innerWidth < 768) return 1;
		if (window.innerWidth < 992) return 2;
		return 3; // Máximo de 3 cards visíveis
	}

	// Cria os cards de notícias para exibição
	function createNewsCards(articles) {
		carousel.innerHTML = '';
		indicatorsContainer.innerHTML = '';

		if (!articles || articles.length === 0) {
			carousel.innerHTML = '<div class="error-message">Nenhuma notícia encontrada.</div>';
			return;
		}

		newsData = articles;
		const visibleSlides = getVisibleSlides();

		// Cria indicadores para navegação
		const totalGroups = Math.ceil(newsData.length / visibleSlides);
		for (let i = 0; i < totalGroups; i++) {
			const indicator = document.createElement('div');
			indicator.className = `indicator ${i === 0 ? 'active' : ''}`;
			indicator.addEventListener('click', () => goToSlide(i * visibleSlides));
			indicatorsContainer.appendChild(indicator);
		}

		// Cria os cards de notícias
		newsData.forEach((article, index) => {
			const card = document.createElement('div');
			card.className = 'card';

			// Usa uma imagem de placeholder se a imagem da notícia não estiver disponível
			const imageUrl = article.image || 'https://via.placeholder.com/600x400?text=Sem+Imagem';
			const description = article.description || 'Sem descrição disponível.';

			card.innerHTML = `
                <div class="card-img">
                    <img src="${imageUrl}" alt="${article.title}" onerror="this.src='https://via.placeholder.com/600x400?text=Imagem+indisponível'">
                </div>
                <div class="card-content">
                    <div>
                        <h2 class="card-title">${article.title}</h2>
                        <p class="card-desc">${description}</p>
                    </div>
                    <div>
                        <p class="card-date">${formatDate(article.publishedAt)}</p>
                        <a href="${article.url}" target="_blank" class="card-link" rel="noopener noreferrer">Ler mais</a>
                    </div>
                </div>
            `;
			carousel.appendChild(card);
		});

		updateCarousel();
	}

	// Atualiza a posição do carrossel e os indicadores
	function updateCarousel() {
		const cards = carousel.querySelectorAll('.card');
		if (!cards.length) return;

		// Calcula a largura do card com margem
		const cardWidth = cards[0].offsetWidth + parseInt(getComputedStyle(cards[0]).marginLeft) +
			parseInt(getComputedStyle(cards[0]).marginRight);

		// Aplica a transformação para mover o carrossel
		carousel.style.transform = `translateX(-${currentIndex * cardWidth}px)`;

		// Atualiza os indicadores
		const visibleSlides = getVisibleSlides();
		const indicatorIndex = Math.floor(currentIndex / visibleSlides);

		document.querySelectorAll('.indicator').forEach((indicator, index) => {
			indicator.classList.toggle('active', index === indicatorIndex);
		});
	}

	// Vai para um slide específico
	function goToSlide(index) {
		currentIndex = index;
		updateCarousel();
	}

	// Avança para o próximo slide
	function nextSlide() {
		const maxIndex = Math.max(0, newsData.length - getVisibleSlides());
		if (currentIndex < maxIndex) {
			currentIndex++;
			updateCarousel();
		}
	}

	// Volta para o slide anterior
	function prevSlide() {
		if (currentIndex > 0) {
			currentIndex--;
			updateCarousel();
		}
	}

	// Manipuladores de eventos para navegação
	prevBtn.addEventListener('click', prevSlide);
	nextBtn.addEventListener('click', nextSlide);

	// Navegação com teclado
	document.addEventListener('keydown', (e) => {
		if (e.key === 'ArrowRight') nextSlide();
		if (e.key === 'ArrowLeft') prevSlide();
	});

	// Paginação - botão anterior
	prevPageBtn.addEventListener('click', () => {
		if (currentPage > 1) {
			currentPage--;
			updatePageInfo();
			displayPageContent();
		}
	});

	// Paginação - próximo botão
	nextPageBtn.addEventListener('click', () => {
		if (currentPage < totalPages) {
			currentPage++;
			updatePageInfo();
			displayPageContent();
		}
	});

	// Atualiza os botões de paginação e informação da página
	function updatePageInfo() {
		pageInfo.textContent = `Página ${currentPage} de ${totalPages}`;
		prevPageBtn.disabled = currentPage === 1;
		nextPageBtn.disabled = currentPage === totalPages;
	}

	// Exibe o conteúdo da página atual
	function displayPageContent() {
		currentIndex = 0; // Reinicia a posição do carrossel

		// Calcula o índice inicial e final para os cards desta página
		const startIndex = (currentPage - 1) * cardsPerPage;
		const endIndex = startIndex + cardsPerPage;

		// Exibe os cards para esta página
		createNewsCards(allNewsData.slice(startIndex, endIndex));
	}

	// Busca as notícias da API
	async function fetchNews() {
		try {
			const apiKey = '8f9885ac8345476a7b4647411ed1a1e4';
			const query = 'meio ambiente OR clima OR preservação';
			const maxResults = 9; // 3 páginas com 3 cards cada = 9 total
			const url = `https://gnews.io/api/v4/search?q=${encodeURIComponent(query)}&lang=pt&max=${maxResults}&token=${apiKey}`;

			carousel.innerHTML = '<div class="loading">Carregando notícias...</div>';
			indicatorsContainer.innerHTML = '';

			const response = await fetch(url);

			if (!response.ok) throw new Error(`Erro HTTP: ${response.status}`);

			const data = await response.json();

			if (!data.articles || !Array.isArray(data.articles) || data.articles.length === 0) {
				carousel.innerHTML = '<div class="error-message">Nenhuma notícia encontrada.</div>';
				return;
			}

			// Armazena todas as notícias
			allNewsData = data.articles;

			// Inicializa com a primeira página
			currentPage = 1;
			updatePageInfo();
			displayPageContent();

		} catch (err) {
			console.error('Erro ao carregar as notícias:', err);
			carousel.innerHTML = '<div class="error-message">Erro ao carregar as notícias. Tente novamente mais tarde.</div>';
		}
	}

	// Atualiza o carrossel quando a janela é redimensionada
	window.addEventListener('resize', () => {
		if (newsData.length > 0) {
			currentIndex = 0; // Reseta para o primeiro card quando redimensiona
			updateCarousel();
		}
	});

	// Inicializa buscando as notícias
	fetchNews();
});