/**
 * galeria.js
 * Funcionalidad para la página de galería
 * Filtros por categoría y animación de carga
 */

document.addEventListener('DOMContentLoaded', function() {

    // =============================================
    // 1. MENÚ MÓVIL (toggle)
    // =============================================
    const menuToggle = document.querySelector('.menu-toggle');
    const navLinks = document.querySelector('.nav-links');

    if (menuToggle && navLinks) {
        menuToggle.addEventListener('click', function() {
            navLinks.classList.toggle('active');
        });
    }

    // =============================================
    // 2. FILTROS DE GALERÍA
    // =============================================
    const filtros = document.querySelectorAll('.filtro-btn');
    const items = document.querySelectorAll('.galeria-item');

    if (filtros.length > 0 && items.length > 0) {

        filtros.forEach(function(btn) {
            btn.addEventListener('click', function() {

                // Quitar clase active de todos los botones
                filtros.forEach(function(b) {
                    b.classList.remove('active');
                });
                // Añadir clase active al botón clickado
                btn.classList.add('active');

                const filtro = btn.dataset.filtro;

                items.forEach(function(item) {
                    if (filtro === 'todos' || item.dataset.categoria === filtro) {
                        item.style.display = 'block';
                        // Animación suave al aparecer
                        item.style.opacity = '0';
                        item.style.transform = 'scale(0.95)';
                        setTimeout(function() {
                            item.style.transition = 'opacity 0.4s ease, transform 0.4s ease';
                            item.style.opacity = '1';
                            item.style.transform = 'scale(1)';
                        }, 50);
                    } else {
                        item.style.display = 'none';
                    }
                });
            });
        });
    }

    // =============================================
    // 3. ANIMACIÓN DE CARGA (entrada escalonada)
    // =============================================
    items.forEach(function(item, index) {
        // Ocultar inicialmente
        item.style.opacity = '0';
        item.style.transform = 'translateY(20px)';

        setTimeout(function() {
            item.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
            item.style.opacity = '1';
            item.style.transform = 'translateY(0)';
        }, 150 + index * 80);
    });

    // =============================================
    // 4. EFECTO DE CARGA DE IMÁGENES (placeholder)
    // =============================================
    const imagenes = document.querySelectorAll('.galeria-item img');

    imagenes.forEach(function(img) {
        // Si la imagen no está cargada, mostrar un color de fondo
        img.addEventListener('error', function() {
            this.style.display = 'none';
            // Añadir un placeholder visual
            const parent = this.parentElement;
            const placeholder = document.createElement('div');
            placeholder.style.cssText = `
                        width: 100%;
                        height: 100%;
                        background: #e8e4e0;
                        display: flex;
                        align-items: center;
                        justify-content: center;
                        color: #8a7a6a;
                        font-size: 3rem;
                        font-family: 'Playfair Display', serif;
                    `;
            placeholder.textContent = '🔧';
            parent.appendChild(placeholder);
        });
    });

    console.log('✅ Galería cargada correctamente');

});