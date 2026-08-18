// ========== CARRUSEL SINCRONIZADO (todos cambian al mismo tiempo) ==========
document.addEventListener('DOMContentLoaded', function () {
    // Seleccionar todos los carruseles de la página
    const carruseles = document.querySelectorAll('.hero-carrusel');

    if (carruseles.length === 0) return;

    // Variable compartida para el índice actual (todos los carruseles usan el mismo)
    let currentSlide = 0;
    let slideInterval;
    let isPlaying = true;
    const INTERVAL_TIME = 5000; // 5 segundos

    // Array para guardar los slides y dots de cada carrusel
    const todosLosSlides = [];
    const todosLosDots = [];

    // Inicializar cada carrusel
    carruseles.forEach((carrusel, index) => {
        const slides = carrusel.querySelectorAll('.slide');
        const dots = carrusel.querySelectorAll('.dot');
        const prevBtn = carrusel.querySelector('.slider-btn.prev');
        const nextBtn = carrusel.querySelector('.slider-btn.next');

        if (slides.length === 0) return;

        // Guardar referencias
        todosLosSlides.push(slides);
        todosLosDots.push(dots);

        // Eventos de los botones para este carrusel
        if (prevBtn) {
            prevBtn.addEventListener('click', () => {
                goToSlide(currentSlide - 1);
                resetAutoPlay();
            });
        }

        if (nextBtn) {
            nextBtn.addEventListener('click', () => {
                goToSlide(currentSlide + 1);
                resetAutoPlay();
            });
        }

        // Eventos de los dots para este carrusel
        dots.forEach((dot, dotIndex) => {
            dot.addEventListener('click', () => {
                goToSlide(dotIndex);
                resetAutoPlay();
            });
        });

        // Pausar al hacer hover en CUALQUIER carrusel
        carrusel.addEventListener('mouseenter', () => {
            stopAutoPlay();
        });

        carrusel.addEventListener('mouseleave', () => {
            if (!isPlaying) {
                startAutoPlay();
            }
        });
    });

    // Función para ir a un slide específico (actualiza TODOS los carruseles)
    function goToSlide(index) {
        const totalSlides = todosLosSlides[0] ? todosLosSlides[0].length : 0;

        // Validar índice
        if (index < 0) {
            currentSlide = totalSlides - 1;
        } else if (index >= totalSlides) {
            currentSlide = 0;
        } else {
            currentSlide = index;
        }

        // Actualizar TODOS los carruseles
        todosLosSlides.forEach(slides => {
            slides.forEach((slide, i) => {
                slide.classList.toggle('active', i === currentSlide);
            });
        });

        // Actualizar TODOS los dots
        todosLosDots.forEach(dots => {
            dots.forEach((dot, i) => {
                dot.classList.toggle('active', i === currentSlide);
            });
        });
    }

    // Siguiente slide (avanza en TODOS)
    function nextSlide() {
        goToSlide(currentSlide + 1);
    }

    // Slide anterior (retrocede en TODOS)
    function prevSlide() {
        goToSlide(currentSlide - 1);
    }

    // Iniciar auto-reproducción
    function startAutoPlay() {
        if (slideInterval) clearInterval(slideInterval);
        slideInterval = setInterval(() => {
            nextSlide();
            console.log('Cambio sincronizado - Slide', currentSlide + 1);
        }, INTERVAL_TIME);
        isPlaying = true;
    }

    // Detener auto-reproducción
    function stopAutoPlay() {
        if (slideInterval) {
            clearInterval(slideInterval);
            slideInterval = null;
            isPlaying = false;
        }
    }

    // Reiniciar auto-reproducción
    function resetAutoPlay() {
        if (isPlaying) {
            stopAutoPlay();
            startAutoPlay();
        }
    }

    // INICIAR AUTO-REPRODUCCIÓN SINCRONIZADA
    startAutoPlay();

    console.log(`Carrusel sincronizado iniciado - ${carruseles.length} carruseles, ${todosLosSlides[0] ? todosLosSlides[0].length : 0} slides cada uno`);
});