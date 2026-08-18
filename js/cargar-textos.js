/**
 * cargar-textos.js
 * Carga los textos desde el servidor para las páginas públicas
 */

(function() {
    'use strict';

    // Función para extraer los datos correctamente
    function extraerDatos(data) {
        // Si la respuesta tiene un objeto 'result' anidado, usarlo
        if (data && typeof data === 'object') {
            // Caso 1: la respuesta tiene un campo 'result' que contiene los datos
            if (data.result && typeof data.result === 'object') {
                return data.result;
            }
            // Caso 2: la respuesta tiene un campo 'result' que es un string JSON
            if (data.result && typeof data.result === 'string') {
                try {
                    const parsed = JSON.parse(data.result);
                    if (parsed && typeof parsed === 'object') {
                        return parsed;
                    }
                } catch (e) {
                    console.warn('No se pudo parsear result:', e);
                }
            }
            // Caso 3: la respuesta ya es el objeto directamente
            if (data.header && data.index && data.nav) {
                return data;
            }
        }
        return data;
    }

    function cargarTextos() {
        // Intentar desde localStorage primero
        let stored = localStorage.getItem('adminTextos');
        if (stored) {
            try {
                const data = JSON.parse(stored);
                const textos = extraerDatos(data);
                if (textos && textos.index && textos.index.btn_presupuesto) {
                    aplicarTextos(textos);
                    // Actualizar en segundo plano
                    fetch('/api/obtener-textos.php')
                        .then(res => {
                            if (!res.ok) throw new Error('Error HTTP: ' + res.status);
                            return res.json();
                        })
                        .then(nuevosDatos => {
                            const nuevosTextos = extraerDatos(nuevosDatos);
                            if (nuevosTextos && nuevosTextos.index && nuevosTextos.index.btn_presupuesto) {
                                localStorage.setItem('adminTextos', JSON.stringify(nuevosTextos));
                                aplicarTextos(nuevosTextos);
                            }
                        })
                        .catch(err => console.warn('Error actualizando textos:', err));
                    return;
                }
            } catch (e) {
                console.warn('Error al leer localStorage:', e);
            }
        }

        // Si no hay en localStorage, cargar del servidor
        fetch('/api/obtener-textos.php')
            .then(response => {
                if (!response.ok) throw new Error('Error al cargar: ' + response.status);
                return response.json();
            })
            .then(data => {
                const textos = extraerDatos(data);
                if (textos && textos.index && textos.index.btn_presupuesto) {
                    localStorage.setItem('adminTextos', JSON.stringify(textos));
                    aplicarTextos(textos);
                } else {
                    console.warn('Datos incompletos recibidos:', textos);
                    throw new Error('Estructura de datos incorrecta');
                }
            })
            .catch(error => {
                console.warn('No se pudieron cargar los textos del servidor:', error);
                // Intentar usar datos por defecto desde el servidor
                fetch('/api/obtener-textos.php?default=true')
                    .then(res => {
                        if (!res.ok) throw new Error('Error HTTP: ' + res.status);
                        return res.json();
                    })
                    .then(data => {
                        const textos = extraerDatos(data);
                        if (textos) {
                            localStorage.setItem('adminTextos', JSON.stringify(textos));
                            aplicarTextos(textos);
                        }
                    })
                    .catch(() => {
                        console.error('No se pudieron cargar los textos en absoluto');
                    });
            });
    }

    function aplicarTextos(textos) {
        // Verificar que los textos existen y tienen la estructura correcta
        if (!textos || typeof textos !== 'object') {
            console.error('Textos inválidos:', textos);
            return;
        }

        const page = document.body.dataset.page || '';

        // Asegurar que las secciones existen
        if (!textos.index) textos.index = {};
        if (!textos.servicios) textos.servicios = {};
        if (!textos.productos) textos.productos = {};
        if (!textos.galeria) textos.galeria = {};
        if (!textos.contacto) textos.contacto = {};
        if (!textos.header) textos.header = {};
        if (!textos.nav) textos.nav = {};
        if (!textos.footer) textos.footer = {};

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
        if (logoText && textos.header) {
            logoText.innerHTML = (textos.header.logo_texto || 'Cerrajeria y Aluminio Francisco Rivera') + 
                ' <span class="logo-sub">' + (textos.header.logo_sub || 'e Hijo') + '</span>';
        }

        // Navegación
        const navLinks = document.querySelectorAll('.nav-links a');
        const navTexts = ['inicio', 'servicios', 'productos', 'galeria', 'contacto'];
        if (textos.nav) {
            navLinks.forEach((link, index) => {
                if (index < navTexts.length && textos.nav[navTexts[index]]) {
                    link.textContent = textos.nav[navTexts[index]];
                }
            });
        }

        // Botón presupuesto
        const btnNav = document.querySelector('.btn-nav');
        if (btnNav && textos.nav && textos.nav.presupuesto) {
            btnNav.textContent = textos.nav.presupuesto;
        }
    }

    function aplicarIndex(textos) {
        // Hero
        const heroTitle = document.querySelector('.hero-title');
        const heroDesc = document.querySelector('.hero-desc');
        if (heroTitle && textos.index && textos.index.hero_titulo) {
            heroTitle.textContent = textos.index.hero_titulo;
        }
        if (heroDesc && textos.index && textos.index.hero_descripcion) {
            heroDesc.textContent = textos.index.hero_descripcion;
        }

        // Botones
        const btnPresupuesto = document.querySelector('.hero-buttons .btn:first-child');
        const btnProductos = document.querySelector('.hero-buttons .btn:last-child');
        if (btnPresupuesto && textos.index && textos.index.btn_presupuesto) {
            btnPresupuesto.textContent = textos.index.btn_presupuesto;
        }
        if (btnProductos && textos.index && textos.index.btn_productos) {
            btnProductos.textContent = textos.index.btn_productos;
        }

        // Sección valores
        const seccionTitulo = document.querySelector('.valores .section-subtitle');
        const seccionSubtitulo = document.querySelector('.valores h2');
        if (seccionTitulo && textos.index && textos.index.seccion_titulo) {
            seccionTitulo.textContent = textos.index.seccion_titulo;
        }
        if (seccionSubtitulo && textos.index && textos.index.seccion_subtitulo) {
            seccionSubtitulo.textContent = textos.index.seccion_subtitulo;
        }

        // Valores
        const valores = document.querySelectorAll('.valor-item');
        if (valores.length >= 3 && textos.index) {
            const v1 = valores[0];
            const v2 = valores[1];
            const v3 = valores[2];
            const v1h3 = v1.querySelector('h3');
            const v1p = v1.querySelector('p');
            const v2h3 = v2.querySelector('h3');
            const v2p = v2.querySelector('p');
            const v3h3 = v3.querySelector('h3');
            const v3p = v3.querySelector('p');
            if (v1h3 && textos.index.valor1_titulo) v1h3.textContent = textos.index.valor1_titulo;
            if (v1p && textos.index.valor1_desc) v1p.textContent = textos.index.valor1_desc;
            if (v2h3 && textos.index.valor2_titulo) v2h3.textContent = textos.index.valor2_titulo;
            if (v2p && textos.index.valor2_desc) v2p.textContent = textos.index.valor2_desc;
            if (v3h3 && textos.index.valor3_titulo) v3h3.textContent = textos.index.valor3_titulo;
            if (v3p && textos.index.valor3_desc) v3p.textContent = textos.index.valor3_desc;
        }
    }

    function aplicarServicios(textos) {
        const titulo = document.querySelector('.servicios-hero h1');
        const desc = document.querySelector('.servicios-hero p');
        if (titulo && textos.servicios && textos.servicios.titulo) {
            titulo.textContent = textos.servicios.titulo;
        }
        if (desc && textos.servicios && textos.servicios.descripcion) {
            desc.textContent = textos.servicios.descripcion;
        }
    }

    function aplicarProductos(textos) {
        const titulo = document.querySelector('.productos-hero h1');
        const desc = document.querySelector('.productos-hero p');
        if (titulo && textos.productos && textos.productos.titulo) {
            titulo.textContent = textos.productos.titulo;
        }
        if (desc && textos.productos && textos.productos.descripcion) {
            desc.textContent = textos.productos.descripcion;
        }
    }

    function aplicarGaleria(textos) {
        const titulo = document.querySelector('.galeria-hero h1');
        const desc = document.querySelector('.galeria-hero p');
        if (titulo && textos.galeria && textos.galeria.titulo) {
            titulo.textContent = textos.galeria.titulo;
        }
        if (desc && textos.galeria && textos.galeria.descripcion) {
            desc.textContent = textos.galeria.descripcion;
        }
    }

    function aplicarContacto(textos) {
        const titulo = document.querySelector('.contacto-hero h1');
        const desc = document.querySelector('.contacto-hero p');
        if (titulo && textos.contacto && textos.contacto.titulo) {
            titulo.textContent = textos.contacto.titulo;
        }
        if (desc && textos.contacto && textos.contacto.descripcion) {
            desc.textContent = textos.contacto.descripcion;
        }

        // Teléfono
        const telefono = document.querySelector('.info-card a[href^="tel:"]');
        if (telefono && textos.contacto && textos.contacto.telefono) {
            telefono.textContent = textos.contacto.telefono;
            telefono.href = 'tel:' + textos.contacto.telefono.replace(/\s/g, '');
        }

        // Email
        const email = document.querySelector('.info-card a[href^="mailto:"]');
        if (email && textos.contacto && textos.contacto.email) {
            email.textContent = textos.contacto.email;
            email.href = 'mailto:' + textos.contacto.email;
        }

        // Dirección
        const direccion = document.querySelector('.info-card .direccion p, .direcciones p');
        if (direccion && textos.contacto && textos.contacto.direccion) {
            direccion.innerHTML = textos.contacto.direccion + '<br>' + (textos.contacto.ciudad || '');
        }
    }

    function aplicarFooter(textos) {
        const footerText = document.querySelector('.footer-copy');
        if (footerText && textos.footer) {
            const links = footerText.querySelectorAll('a');
            const aviso = links[0];
            const cookies = links[1];
            if (aviso && textos.footer.aviso_legal) aviso.textContent = textos.footer.aviso_legal;
            if (cookies && textos.footer.cookies) cookies.textContent = textos.footer.cookies;
        }
    }

    // Iniciar
    document.addEventListener('DOMContentLoaded', cargarTextos);
})();