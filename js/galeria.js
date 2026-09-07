/**
 * galeria.js
 * Funcionalidad para la página de galería: filtros, animación de carga y lightbox
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
    // 2. FILTROS DE GALERÍA (solo en galeria.html)
    // =============================================
    const filtros = document.querySelectorAll('.filtro-btn');
    const items = document.querySelectorAll('.galeria-item');

    if (filtros.length > 0 && items.length > 0) {

        filtros.forEach(function(btn) {
            btn.addEventListener('click', function() {

                filtros.forEach(function(b) {
                    b.classList.remove('active');
                });
                btn.classList.add('active');

                const filtro = btn.dataset.filtro;

                items.forEach(function(item) {
                    if (filtro === 'todos' || item.dataset.categoria === filtro) {
                        item.style.display = 'block';
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
    // 3. ANIMACIÓN DE CARGA (solo en galeria.html)
    // =============================================
    items.forEach(function(item, index) {
        item.style.opacity = '0';
        item.style.transform = 'translateY(20px)';

        setTimeout(function() {
            item.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
            item.style.opacity = '1';
            item.style.transform = 'translateY(0)';
        }, 150 + index * 80);
    });

    // =============================================
    // 4. LIGHTBOX (para páginas de detalle: galeria-cerrajeria.html, etc.)
    // =============================================
    const lightbox = document.getElementById('lightbox');
    const lightboxImg = document.getElementById('lightboxImg');
    const lightboxCaption = document.getElementById('lightboxCaption');
    const closeBtn = document.querySelector('.lightbox-close');

    // Obtener todas las imágenes de la galería de detalle
    const images = document.querySelectorAll('.detalle-item img');

    if (images.length > 0) {
        console.log('📸 Imágenes encontradas para lightbox:', images.length);

        // Abrir lightbox al hacer clic
        images.forEach(function(img) {
            img.style.cursor = 'pointer';
            img.addEventListener('click', function() {
                const src = this.getAttribute('src');
                const alt = this.getAttribute('alt') || 'Imagen';
                const overlay = this.closest('.detalle-item').querySelector('.detalle-overlay p');

                lightboxImg.src = src;
                lightboxCaption.textContent = overlay ? overlay.textContent : alt;
                lightbox.style.display = 'block';
                document.body.style.overflow = 'hidden';
            });
        });

        // Cerrar lightbox
        function closeLightbox() {
            lightbox.style.display = 'none';
            document.body.style.overflow = 'auto';
        }

        // Botón cerrar
        if (closeBtn) {
            closeBtn.addEventListener('click', closeLightbox);
        }

        // Clic fuera de la imagen
        lightbox.addEventListener('click', function(e) {
            if (e.target === this) {
                closeLightbox();
            }
        });

        // Tecla ESC
        document.addEventListener('keydown', function(e) {
            if (e.key === 'Escape' && lightbox.style.display === 'block') {
                closeLightbox();
            }
        });

        console.log('✅ Lightbox inicializado correctamente');
    } else {
        console.log('ℹ️ No hay imágenes de detalle en esta página (lightbox no activado)');
    }

    console.log('✅ Galería cargada correctamente');

});