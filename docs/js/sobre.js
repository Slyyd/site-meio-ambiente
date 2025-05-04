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
});