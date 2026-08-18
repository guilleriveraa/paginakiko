/**
 * nav.js
 * Navegación: menú móvil, scroll, enlace activo
 */

document.addEventListener('DOMContentLoaded', function() {

    // =============================================
    // 1. MENÚ MÓVIL
    // =============================================
    const menuToggle = document.querySelector('.menu-toggle');
    const navLinks = document.querySelector('.nav-links');

    if (menuToggle && navLinks) {
        menuToggle.addEventListener('click', function() {
            this.classList.toggle('active');
            navLinks.classList.toggle('active');
        });

        navLinks.querySelectorAll('a').forEach(function(link) {
            link.addEventListener('click', function() {
                menuToggle.classList.remove('active');
                navLinks.classList.remove('active');
            });
        });
    }

    // =============================================
    // 2. EFECTO SCROLL
    // =============================================
    const header = document.querySelector('header');

    if (header) {
        window.addEventListener('scroll', function() {
            if (window.scrollY > 50) {
                header.classList.add('scrolled');
            } else {
                header.classList.remove('scrolled');
            }
        });
    }

    // =============================================
    // 3. ENLACE ACTIVO
    // =============================================
    const currentPage = window.location.pathname.split('/').pop() || 'index.html';
    const navLinksAll = document.querySelectorAll('.nav-links a');

    navLinksAll.forEach(function(link) {
        const href = link.getAttribute('href');
        if (href === currentPage) {
            link.classList.add('active');
        }
    });

});