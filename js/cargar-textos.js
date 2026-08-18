/**
 * cargar-textos.js
 * Carga los textos desde el servidor para las páginas públicas
 */

(function() {
    'use strict';

    // =============================================
    // 1. FUNCIÓN PARA EXTRAER DATOS (maneja el anidamiento)
    // =============================================
    function extraerDatos(data) {
        // Verificar que data existe
        if (!data || typeof data !== 'object') {
            console.warn('⚠️ Datos inválidos:', data);
            return null;
        }

        // 🔍 Caso 1: Los datos están en la propiedad 'result'
        if (data.result) {
            // Si es un objeto, usarlo directamente
            if (typeof data.result === 'object') {
                console.log('✅ Datos extraídos de data.result (objeto)');
                return data.result;
            }
            // Si es un string, intentar parsearlo
            if (typeof data.result === 'string') {
                try {
                    // Puede estar anidado varias veces (JSON.stringify repetido)
                    let parsed = data.result;
                    // Intentar parsear hasta que sea un objeto
                    let attempts = 0;
                    while (typeof parsed === 'string' && attempts < 5) {
                        try {
                            parsed = JSON.parse(parsed);
                            attempts++;
                        } catch (e) {
                            break;
                        }
                    }
                    if (parsed && typeof parsed === 'object') {
                        console.log('✅ Datos extraídos de data.result (string parseado)');
                        return parsed;
                    }
                } catch (e) {
                    console.warn('❌ No se pudo parsear data.result:', e);
                }
            }
        }

        // 🔍 Caso 2: Los datos ya son el objeto directamente
        if (data.header && data.index && data.nav) {
            console.log('✅ Datos extraídos directamente');
            return data;
        }

        // 🔍 Caso 3: Intentar buscar en cualquier propiedad que parezca contener los datos
        for (const key in data) {
            if (typeof data[key] === 'object' && data[key] && data[key].header && data[key].index) {
                console.log('✅ Datos encontrados en la propiedad:', key);
                return data[key];
            }
        }

        console.warn('⚠️ No se pudo extraer los datos correctamente:', data);
        return null;
    }

    // =============================================
    // 2. CARGAR TEXTOS DESDE EL SERVIDOR
    // =============================================
    function cargarTextos() {
        console.log('🔄 Cargando textos...');

        // Intentar desde localStorage primero
        let stored = localStorage.getItem('adminTextos');
        if (stored) {
            try {
                const data = JSON.parse(stored);
                const textos = extraerDatos(data);
                if (textos && textos.index && textos.index.btn_presupuesto) {
                    console.log('✅ Textos cargados desde localStorage');
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
                        .catch(err => console.warn('⚠️ Error actualizando textos:', err));
                    return;
                }
            } catch (e) {
                console.warn('⚠️ Error al leer localStorage:', e);
            }
        }

        // Si no hay en localStorage, cargar del servidor
        fetch('/api/obtener-textos.php')
            .then(response => {
                if (!response.ok) throw new Error('Error al cargar: ' + response.status);
                return response.json();
            })
            .then(data => {
                console.log('📦 Datos recibidos de la API:', data);
                const textos = extraerDatos(data);
                if (textos && textos.index && textos.index.btn_presupuesto) {
                    localStorage.setItem('adminTextos', JSON.stringify(textos));
                    aplicarTextos(textos);
                    console.log('✅ Textos aplicados correctamente');
                } else {
                    console.warn('⚠️ Datos incompletos recibidos:', textos);
                    throw new Error('Estructura de datos incorrecta');
                }
            })
            .catch(error => {
                console.warn('⚠️ No se pudieron cargar los textos del servidor:', error);
                // Intentar usar datos por defecto
                cargarTextosDefault();
            });
    }

    // =============================================
    // 3. DATOS POR DEFECTO (si falla la API)
    // =============================================
    function cargarTextosDefault() {
        const defaultTextos = {
            header: {
                logo_texto: 'Cerrajeria y Aluminio Francisco Rivera',
                logo_sub: 'e Hijo'
            },
            nav: {
                inicio: 'Inicio',
                servicios: 'Servicios',
                productos: 'Productos',
                galeria: 'Galería',
                contacto: 'Contacto',
                presupuesto: 'Presupuesto'
            },
            index: {
                hero_titulo: 'Cerrajería Francisco Rivera e Hijo',
                hero_descripcion: 'Más de 30 años de experiencia en el sector',
                btn_presupuesto: 'Solicitar presupuesto',
                btn_productos: 'Ver productos',
                seccion_titulo: 'Nuestra esencia',
                seccion_subtitulo: 'Más de 30 años de tradición y calidad',
                valor1_titulo: 'Experiencia',
                valor1_desc: 'Tres décadas de trabajo en el sector de la cerrajería y la metalurgia.',
                valor2_titulo: 'Calidad',
                valor2_desc: 'Utilizamos los mejores materiales y procesos para garantizar productos duraderos.',
                valor3_titulo: 'Confianza',
                valor3_desc: 'Fabricamos para clientes de toda la provincia, ofreciendo un trato cercano.'
            },
            servicios: {
                titulo: 'Servicios de cerrajería y fabricación',
                descripcion: 'Más de 30 años de experiencia ofreciendo soluciones metálicas de calidad',
                cerrajeria_titulo: 'Cerrajería en general',
                cerrajeria_desc: 'Instalación y reparación de puertas metálicas, cerraduras, rejas, barandillas y estructuras metálicas.',
                herramientas_titulo: 'Herramientas agrícolas',
                herramientas_desc: 'Fabricamos herramientas manuales de alta calidad para el sector agrícola.',
                medida_titulo: 'Trabajos a medida',
                medida_desc: 'Diseñamos y fabricamos piezas y estructuras metálicas personalizadas.',
                proceso_titulo: '¿Cómo trabajamos?',
                proceso_desc: 'Un proceso sencillo y transparente',
                paso1: 'Cuéntanos tu idea',
                paso1_desc: 'Nos reunimos para conocer tus necesidades y requerimientos.',
                paso2: 'Diseñamos la solución',
                paso2_desc: 'Te preparamos un presupuesto detallado sin compromiso.',
                paso3: 'Fabricación',
                paso3_desc: 'Realizamos el trabajo con los mejores materiales y procesos.',
                paso4: 'Instalación y entrega',
                paso4_desc: 'Instalamos o entregamos el producto final con total garantía.'
            },
            productos: {
                titulo: 'Productos de cerrajería y metalistería',
                descripcion: 'Fabricación propia de productos metálicos con la máxima calidad',
                cerrajeria_titulo: 'Cerrajería',
                cerrajeria_desc: 'Puertas metálicas, rejas, cerraduras y forja artesanal.',
                aluminio_titulo: 'Aluminio',
                aluminio_desc: 'Ventanas, puertas y estructuras de aluminio.',
                muebles_titulo: 'Muebles de Hierro',
                muebles_desc: 'Mesas, sillas, estanterías y mobiliario a medida.',
                barandillas_titulo: 'Barandillas',
                barandillas_desc: 'Barandillas, pasamanos y protecciones para escaleras.',
                motorizadas_titulo: 'Puertas Motorizadas',
                motorizadas_desc: 'Puertas automáticas para garajes y naves industriales.',
                varios_titulo: 'Varios',
                varios_desc: 'Estructuras especiales, reparaciones y proyectos personalizados.'
            },
            galeria: {
                titulo: 'Galería de imágenes',
                descripcion: 'Explora nuestros trabajos de cerrajería, aluminio, muebles de hierro, barandillas y más.',
                cerrajeria: 'Cerrajería',
                cerrajeria_desc: 'Puertas, rejas, cerraduras y trabajos de forja',
                aluminio: 'Aluminio',
                aluminio_desc: 'Ventanas, puertas y estructuras de aluminio',
                muebles: 'Muebles de Hierro',
                muebles_desc: 'Mesas, sillas, estanterías y mobiliario',
                barandillas: 'Barandillas',
                barandillas_desc: 'Barandillas, pasamanos y protecciones',
                varios: 'Varios',
                varios_desc: 'Estructuras especiales y piezas únicas'
            },
            contacto: {
                titulo: '¿Necesitas un presupuesto?',
                descripcion: 'Cuéntanos lo que necesitas y te asesoraremos sin compromiso.',
                telefono: '653 67 66 71',
                email: 'fco.riveraehijo@hotmail.com',
                direccion: 'Polígono Industrial, C. Cobalto, 61',
                ciudad: '10810 Montehermoso, Cáceres',
                formulario_titulo: 'Envíanos un mensaje'
            },
            footer: {
                texto: 'Cerrajería y Aluminio Francisco Rivera',
                aviso_legal: 'Aviso legal',
                cookies: 'Política de cookies'
            }
        };

        console.log('📝 Usando datos por defecto');
        localStorage.setItem('adminTextos', JSON.stringify(defaultTextos));
        aplicarTextos(defaultTextos);
    }

    // =============================================
    // 4. APLICAR TEXTOS A LA PÁGINA
    // =============================================
    function aplicarTextos(textos) {
        if (!textos || typeof textos !== 'object') {
            console.error('❌ Textos inválidos:', textos);
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

    // =============================================
    // 5. APLICAR HEADER
    // =============================================
    function aplicarHeader(textos) {
        // Logo
        const logoText = document.querySelector('.logo-texto');
        if (logoText && textos.header) {
            logoText.innerHTML = (textos.header.logo_texto || 'Cerrajeria y Aluminio Francisco Rivera') + 
                ' <span class="logo-sub">' + (textos.header.logo_sub || 'e Hijo') + '</span>';
            console.log('🔄 Logo actualizado:', textos.header.logo_texto);
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

    // =============================================
    // 6. APLICAR INDEX
    // =============================================
    function aplicarIndex(textos) {
        console.log('📝 Aplicando textos a la página de inicio...');

        // Hero
        const heroTitle = document.querySelector('.hero-title');
        const heroDesc = document.querySelector('.hero-desc');
        if (heroTitle && textos.index && textos.index.hero_titulo) {
            heroTitle.textContent = textos.index.hero_titulo;
            console.log('🔄 Título actualizado:', textos.index.hero_titulo);
        }
        if (heroDesc && textos.index && textos.index.hero_descripcion) {
            heroDesc.textContent = textos.index.hero_descripcion;
            console.log('🔄 Descripción actualizada:', textos.index.hero_descripcion);
        }

        // Botones
        const btnPresupuesto = document.querySelector('.hero-buttons .btn:first-child');
        const btnProductos = document.querySelector('.hero-buttons .btn:last-child');
        if (btnPresupuesto && textos.index && textos.index.btn_presupuesto) {
            btnPresupuesto.textContent = textos.index.btn_presupuesto;
            console.log('🔄 Botón presupuesto actualizado:', textos.index.btn_presupuesto);
        }
        if (btnProductos && textos.index && textos.index.btn_productos) {
            btnProductos.textContent = textos.index.btn_productos;
            console.log('🔄 Botón productos actualizado:', textos.index.btn_productos);
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

    // =============================================
    // 7. APLICAR SERVICIOS
    // =============================================
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

    // =============================================
    // 8. APLICAR PRODUCTOS
    // =============================================
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

    // =============================================
    // 9. APLICAR GALERÍA
    // =============================================
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

    // =============================================
    // 10. APLICAR CONTACTO
    // =============================================
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

    // =============================================
    // 11. APLICAR FOOTER
    // =============================================
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

    // =============================================
    // 12. INICIAR
    // =============================================
    document.addEventListener('DOMContentLoaded', cargarTextos);
    console.log('✅ cargar-textos.js cargado correctamente');

})();