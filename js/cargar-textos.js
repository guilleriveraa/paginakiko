/**
 * cargar-textos.js
 * Carga los textos desde el servidor para las páginas públicas
 */

(function() {
    'use strict';

    function cargarTextos() {
        // Intentar desde localStorage primero
        let textos = localStorage.getItem('adminTextos');
        if (textos) {
            try {
                aplicarTextos(JSON.parse(textos));
                // Actualizar en segundo plano
                fetch('/api/obtener-textos.php')
                    .then(res => res.json())
                    .then(data => {
                        localStorage.setItem('adminTextos', JSON.stringify(data));
                        aplicarTextos(data);
                    })
                    .catch(() => {});
                return;
            } catch {}
        }

        // Si no hay en localStorage, cargar del servidor
        fetch('/api/obtener-textos.php')
            .then(response => response.json())
            .then(data => {
                localStorage.setItem('adminTextos', JSON.stringify(data));
                aplicarTextos(data);
            })
            .catch(error => {
                console.warn('No se pudieron cargar los textos del servidor:', error);
            });
    }

    function aplicarTextos(textos) {
        const page = document.body.dataset.page || '';

        // Aplicar según la página
        if (page === 'index' || page === '') {
            aplicarIndex(textos);
        }
        if (page === 'servicios') {
            aplicarServicios(textos);
        }
        if (page === 'productos') {
            aplicarProductos(textos);
        }
        if (page === 'galeria') {
            aplicarGaleria(textos);
        }
        if (page === 'contacto') {
            aplicarContacto(textos);
        }

        // Siempre aplicar header y footer
        aplicarHeader(textos);
        aplicarFooter(textos);

        console.log('✅ Textos aplicados en la página:', page);
    }

    function aplicarHeader(textos) {
        // Logo
        const logoText = document.querySelector('.logo-texto');
        if (logoText) {
            logoText.innerHTML = textos.header.logo_texto + ' <span class="logo-sub">' + textos.header.logo_sub + '</span>';
        }

        // Navegación
        const navLinks = document.querySelectorAll('.nav-links a');
        const navTexts = ['inicio', 'servicios', 'productos', 'galeria', 'contacto'];
        navLinks.forEach((link, index) => {
            if (index < navTexts.length) {
                link.textContent = textos.nav[navTexts[index]] || link.textContent;
            }
        });

        // Botón presupuesto
        const btnNav = document.querySelector('.btn-nav');
        if (btnNav) btnNav.textContent = textos.nav.presupuesto || btnNav.textContent;
    }

    function aplicarIndex(textos) {
        // Hero
        const heroTitle = document.querySelector('.hero-title');
        const heroDesc = document.querySelector('.hero-desc');
        if (heroTitle) heroTitle.textContent = textos.index.hero_titulo;
        if (heroDesc) heroDesc.textContent = textos.index.hero_descripcion;

        // Botones
        const btnPresupuesto = document.querySelector('.hero-buttons .btn:first-child');
        const btnProductos = document.querySelector('.hero-buttons .btn:last-child');
        if (btnPresupuesto) btnPresupuesto.textContent = textos.index.btn_presupuesto;
        if (btnProductos) btnProductos.textContent = textos.index.btn_productos;

        // Sección valores
        const seccionTitulo = document.querySelector('.valores .section-subtitle');
        const seccionSubtitulo = document.querySelector('.valores h2');
        if (seccionTitulo) seccionTitulo.textContent = textos.index.seccion_titulo;
        if (seccionSubtitulo) seccionSubtitulo.textContent = textos.index.seccion_subtitulo;

        // Valores
        const valores = document.querySelectorAll('.valor-item');
        if (valores.length >= 3) {
            const v1 = valores[0];
            const v2 = valores[1];
            const v3 = valores[2];
            const v1h3 = v1.querySelector('h3');
            const v1p = v1.querySelector('p');
            const v2h3 = v2.querySelector('h3');
            const v2p = v2.querySelector('p');
            const v3h3 = v3.querySelector('h3');
            const v3p = v3.querySelector('p');
            if (v1h3) v1h3.textContent = textos.index.valor1_titulo;
            if (v1p) v1p.textContent = textos.index.valor1_desc;
            if (v2h3) v2h3.textContent = textos.index.valor2_titulo;
            if (v2p) v2p.textContent = textos.index.valor2_desc;
            if (v3h3) v3h3.textContent = textos.index.valor3_titulo;
            if (v3p) v3p.textContent = textos.index.valor3_desc;
        }
    }

    function aplicarServicios(textos) {
        // Implementar según la estructura de servicios.html
        const titulo = document.querySelector('.servicios-hero h1');
        const desc = document.querySelector('.servicios-hero p');
        if (titulo) titulo.textContent = textos.servicios.titulo;
        if (desc) desc.textContent = textos.servicios.descripcion;
    }

    function aplicarProductos(textos) {
        // Implementar según la estructura de productos.html
        const titulo = document.querySelector('.productos-hero h1');
        const desc = document.querySelector('.productos-hero p');
        if (titulo) titulo.textContent = textos.productos.titulo;
        if (desc) desc.textContent = textos.productos.descripcion;
    }

    function aplicarGaleria(textos) {
        const titulo = document.querySelector('.galeria-hero h1');
        const desc = document.querySelector('.galeria-hero p');
        if (titulo) titulo.textContent = textos.galeria.titulo;
        if (desc) desc.textContent = textos.galeria.descripcion;
    }

    function aplicarContacto(textos) {
        const titulo = document.querySelector('.contacto-hero h1');
        const desc = document.querySelector('.contacto-hero p');
        if (titulo) titulo.textContent = textos.contacto.titulo;
        if (desc) desc.textContent = textos.contacto.descripcion;

        // Teléfono
        const telefono = document.querySelector('.info-card a[href^="tel:"]');
        if (telefono) {
            telefono.textContent = textos.contacto.telefono;
            telefono.href = 'tel:' + textos.contacto.telefono.replace(/\s/g, '');
        }

        // Email
        const email = document.querySelector('.info-card a[href^="mailto:"]');
        if (email) {
            email.textContent = textos.contacto.email;
            email.href = 'mailto:' + textos.contacto.email;
        }

        // Dirección
        const direccion = document.querySelector('.info-card .direccion p, .direcciones p');
        if (direccion) {
            direccion.innerHTML = textos.contacto.direccion + '<br>' + textos.contacto.ciudad;
        }
    }

    function aplicarFooter(textos) {
        const footerText = document.querySelector('.footer-copy');
        if (footerText) {
            const links = footerText.querySelectorAll('a');
            const aviso = links[0];
            const cookies = links[1];
            if (aviso) aviso.textContent = textos.footer.aviso_legal;
            if (cookies) cookies.textContent = textos.footer.cookies;
        }
    }

    // Iniciar
    document.addEventListener('DOMContentLoaded', cargarTextos);

})();