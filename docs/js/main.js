document.addEventListener('DOMContentLoaded', function() {
    // Mobile menu
    const menuToggle = document.getElementById('menuToggle');
    const mainNav = document.getElementById('mainNav');
    const menuOverlay = document.getElementById('menuOverlay');

    menuToggle.addEventListener('click', function() {
        mainNav.classList.toggle('active');
        menuOverlay.classList.toggle('active');
        // Previne o scroll quando o menu está aberto
        document.body.style.overflow = mainNav.classList.contains('active') ? 'hidden' : '';
    });

    menuOverlay.addEventListener('click', function() {
        mainNav.classList.remove('active');
        menuOverlay.classList.remove('active');
        document.body.style.overflow = '';
    });

    // Fecha o menu quando é clicado no link
    const navLinks = document.querySelectorAll('nav ul li a');
    navLinks.forEach(link => {
        link.addEventListener('click', function() {
            mainNav.classList.remove('active');
            menuOverlay.classList.remove('active');
            document.body.style.overflow = '';
        });
    });

    // Funcionalidade do botão de vídeo
    const playButton = document.getElementById('playVideo');
    playButton.addEventListener('click', function() {
        alert('Video');
    });

    // Funcionalidade da Pagination
    const dots = document.querySelectorAll('.dot');
    dots.forEach((dot, index) => {
        dot.addEventListener('click', function() {
            // Remove as classes ativas do dots
            dots.forEach(d => d.classList.remove('active'));
            // Adiciona classes ativas do dot clicado
            this.classList.add('active');

            // Muda a numeração das páginas
            const pageNumber = document.querySelector('.page-number span:first-child');
            pageNumber.textContent = (index + 1).toString().padStart(2, '0');

            // Muda o conteúdo dos slides das páginas
            //ATENÇÃO: NÃO ESQUECER DE ALTERAR NO HTML TAMBÉM!!!!
            const slideTexts = [
                "Textos aqui",
                "A desflorestação ameaça a biodiversidade e contribui para as alterações climáticas. Junte-se aos nossos esforços para combater ao contrabando de árvores e promover a gestão sustentável das florestas.",
                "A conservação de base comunitária permite que as populações locais protejam as suas florestas, apoiando simultaneamente meios de subsistência sustentáveis.",
                "A educação e a sensibilização são fundamentais para a preservação das florestas. Saiba como pequenas mudanças nos seus hábitos diários podem fazer uma grande diferença."
            ];

            const slideTitles = ["Texto", "PROTEJA", "COMUNIDADE", "EDUQUE-SE"];

            document.querySelector('.description').textContent = slideTexts[index];
            document.querySelector('.section-title').textContent = slideTitles[index];
        });
    });

    // Muda o tamanho da página em um resize
    function handleResize() {
        if (window.innerWidth > 768 && mainNav.classList.contains('active')) {
            mainNav.classList.remove('active');
            menuOverlay.classList.remove('active');
            document.body.style.overflow = '';
        }
    }

    window.addEventListener('resize', handleResize);
});