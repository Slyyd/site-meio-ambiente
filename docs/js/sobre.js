// Mobile Menu
document.getElementById('menuToggle').addEventListener('click', function() {
	document.querySelector('.main-nav').classList.toggle('active');
	this.classList.toggle('active');
});

window.addEventListener('scroll', function() {
	const header = document.querySelector('.main-header');
	if (window.scrollY > 10) {
		header.classList.add('scrolled');
	} else {
		header.classList.remove('scrolled');
	}
});

// Inicializar o slideshow
let slideIndex = 1;

document.addEventListener('DOMContentLoaded', function() {
	// Preloader
	setTimeout(function() {
		document.getElementById('preloader').style.display = 'none';
	}, 1000);

	// Tabs
	const tabLinks = document.querySelectorAll('.tab-nav__list li');
	const tabContents = document.querySelectorAll('.tab-content__item');
	tabLinks.forEach(function(link) {
		link.addEventListener('click', function(e) {
			e.preventDefault();
			// Remove active class de todas as tabs
			tabLinks.forEach(function(tab) {
				tab.classList.remove('active');
			});
			// Adiciona active class à tab clicada
			this.classList.add('active');
			// Esconde o conteúdo das tabs
			tabContents.forEach(function(content) {
				content.classList.remove('active');
			});
			// Mostra o conteúdo da tab correspondente
			const tabId = this.getAttribute('data-id');
			document.getElementById(tabId).classList.add('active');
		});
	});
	// Smooth scrolling
	const scrollLinks = document.querySelectorAll('.smoothscroll');
	scrollLinks.forEach(function(link) {
		link.addEventListener('click', function(e) {
			e.preventDefault();
			const targetId = this.getAttribute('href');
			const targetElement = document.querySelector(targetId);
			window.scrollTo({
				top: targetElement.offsetTop,
				behavior: 'smooth'
			});
		});
	});
	// Animação Fade-in
	const fadeElements = document.querySelectorAll('.fade-in');
	const fadeInObserver = new IntersectionObserver(function(entries) {
		entries.forEach(function(entry) {
			if (entry.isIntersecting) {
				entry.target.classList.add('visible');
			}
		});
	}, {
		threshold: 0.2
	});
	fadeElements.forEach(function(element) {
		fadeInObserver.observe(element);
	});
	// Modal
	const modalTrigger = document.querySelector('.modal-trigger');
	if (modalTrigger) {
		modalTrigger.addEventListener('click', function() {
			alert('Estamos trabalhando para construir um futuro mais sustentável! Junte-se a nós nesse desafio.');
		});
	}
	// Partner logo efeito hover
	const partnerLogos = document.querySelectorAll('.partner-logo');
	partnerLogos.forEach(function(logo) {
		logo.addEventListener('mouseover', function() {
			this.style.filter = 'grayscale(0)';
		});
		logo.addEventListener('mouseout', function() {
			this.style.filter = 'grayscale(100%)';
		});
	});

	showSlides(slideIndex);
	// Iniciar rotação automática dos slides a cada 5 segundos
	setInterval(function() {
		plusSlides(1);
	}, 5000);
});

// Função para mostrar um slide específico
function currentSlide(n) {
	showSlides(slideIndex = n);
}

// Função principal de exibição dos slides
function showSlides(n) {
	let i;
	let slides = document.getElementsByClassName("author-slide");
	let dots = document.getElementsByClassName("dot");

	// Loop para voltar ao primeiro slide se passar do último
	if (n > slides.length) {
		slideIndex = 1
	}
	// Loop para ir ao último slide se retroceder do primeiro
	if (n < 1) {
		slideIndex = slides.length
	}

	// Esconde todos os slides
	for (i = 0; i < slides.length; i++) {
		slides[i].style.display = "none";
	}

	// Remove a classe "active" de todos os pontos
	for (i = 0; i < dots.length; i++) {
		dots[i].className = dots[i].className.replace(" active-dot", "");
	}

	// Mostra o slide atual e marca o ponto correspondente como ativo
	slides[slideIndex - 1].style.display = "block";
	dots[slideIndex - 1].className += " active-dot";
}
