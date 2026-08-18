/**
 * contenido-loader.js
 * Carga el contenido desde localStorage para mostrarlo en las páginas públicas
 */

(function() {
    'use strict';

    // =============================================
    // 1. OBTENER DATOS
    // =============================================
    function getContenido() {
        const stored = localStorage.getItem('adminContenido');
        if (stored) {
            try {
                return JSON.parse(stored);
            } catch {
                return null;
            }
        }
        return null;
    }

    // =============================================
    // 2. DATOS POR DEFECTO (si no hay datos guardados)
    // =============================================
    function getDefaultContenido() {
        return {
            secciones: {
                cerrajeria: {
                    titulo: 'Cerrajería',
                    descripcion: 'Trabajos de cerrajería en general: puertas metálicas, rejas de seguridad, cerraduras, forja artesanal y todo tipo de estructuras metálicas para viviendas y locales. Fabricamos piezas duraderas con los mejores materiales y acabados.',
                    imagenes: [
                        { id: 'c1', nombre: 'Puerta metálica', src: 'img/galeria/cerrajeria/1.jpg' },
                        { id: 'c2', nombre: 'Rejas de seguridad', src: 'img/galeria/cerrajeria/2.jpg' },
                        { id: 'c3', nombre: 'Forja artesanal', src: 'img/galeria/cerrajeria/3.jpg' }
                    ]
                },
                aluminio: {
                    titulo: 'Aluminio',
                    descripcion: 'Fabricación e instalación de ventanas, puertas, perfiles y estructuras de aluminio. Ofrecemos soluciones ligeras, duraderas y resistentes a la corrosión, con acabados de alta calidad y eficiencia energética.',
                    imagenes: [
                        { id: 'a1', nombre: 'Ventana de aluminio', src: 'img/galeria/aluminio/1.jpg' },
                        { id: 'a2', nombre: 'Puerta de aluminio', src: 'img/galeria/aluminio/2.jpg' },
                        { id: 'a3', nombre: 'Perfiles de aluminio', src: 'img/galeria/aluminio/3.jpg' }
                    ]
                },
                muebles: {
                    titulo: 'Muebles de Hierro',
                    descripcion: 'Diseño y fabricación de muebles en hierro forjado y metálico: mesas, sillas, estanterías, bases de lámparas, percheros y mobiliario a medida. Combinamos funcionalidad, durabilidad y estética en cada pieza.',
                    imagenes: [
                        { id: 'm1', nombre: 'Mesa de hierro forjado', src: 'img/galeria/muebles/1.jpg' },
                        { id: 'm2', nombre: 'Sillas de hierro', src: 'img/galeria/muebles/2.jpg' },
                        { id: 'm3', nombre: 'Estantería metálica', src: 'img/galeria/muebles/3.jpg' }
                    ]
                },
                barandillas: {
                    titulo: 'Barandillas',
                    descripcion: 'Fabricación e instalación de barandillas, pasamanos y protecciones para escaleras, balcones, terrazas y accesos. Diseñamos soluciones seguras y estéticas, adaptadas a cada espacio y estilo arquitectónico.',
                    imagenes: [
                        { id: 'b1', nombre: 'Barandilla de escalera', src: 'img/galeria/barandillas/1.jpg' },
                        { id: 'b2', nombre: 'Barandilla de balcón', src: 'img/galeria/barandillas/2.jpg' },
                        { id: 'b3', nombre: 'Pasamanos de hierro', src: 'img/galeria/barandillas/3.jpg' }
                    ]
                },
                varios: {
                    titulo: 'Varios',
                    descripcion: 'Otros trabajos de cerrajería y metalistería: estructuras especiales, piezas únicas, reparaciones, restauraciones y proyectos personalizados. Si tienes una idea, nosotros la hacemos realidad.',
                    imagenes: [
                        { id: 'v1', nombre: 'Estructura especial', src: 'img/galeria/varios/1.jpg' },
                        { id: 'v2', nombre: 'Pieza única', src: 'img/galeria/varios/2.jpg' },
                        { id: 'v3', nombre: 'Reparación de herramienta', src: 'img/galeria/varios/3.jpg' }
                    ]
                }
            }
        };
    }

    // =============================================
    // 3. CARGAR CONTENIDO EN LA PÁGINA
    // =============================================
    function cargarContenido() {
        let contenido = getContenido();

        // Si no hay datos guardados, usar los predeterminados
        if (!contenido) {
            contenido = getDefaultContenido();
            // Guardar los datos predeterminados en localStorage
            localStorage.setItem('adminContenido', JSON.stringify(contenido));
        }

        return contenido;
    }

    // =============================================
    // 4. RENDERIZAR EN LA PÁGINA DE GALERÍA (recuadros)
    // =============================================
    function renderGaleria() {
        const contenido = cargarContenido();
        const grid = document.querySelector('.secciones-grid');

        if (!grid) return;

        const secciones = contenido.secciones;
        const iconos = {
            cerrajeria: 'fa-tools',
            aluminio: 'fa-door-open',
            muebles: 'fa-chair',
            barandillas: 'fa-stairs',
            varios: 'fa-ellipsis-h'
        };

        const descripcionesCortas = {
            cerrajeria: 'Puertas, rejas, cerraduras y trabajos de forja',
            aluminio: 'Ventanas, puertas y estructuras de aluminio',
            muebles: 'Mesas, sillas, estanterías y mobiliario',
            barandillas: 'Barandillas, pasamanos y protecciones',
            varios: 'Estructuras especiales y piezas únicas'
        };

        let html = '';

        Object.keys(secciones).forEach(function(key) {
            const section = secciones[key];
            const icono = iconos[key] || 'fa-cog';
            const descCorta = descripcionesCortas[key] || 'Trabajos de cerrajería';

            // Obtener la primera imagen como portada
            let imagenPortada = 'img/portadas/' + key + '.jpg';
            if (section.imagenes && section.imagenes.length > 0) {
                imagenPortada = section.imagenes[0].src;
            }

            html += `
                <a href="galeria-${key}.html" class="seccion-card">
                    <div class="seccion-imagen">
                        <img src="${imagenPortada}" alt="${section.titulo}" onerror="this.src='img/placeholder.png'">
                        <div class="seccion-overlay">
                            <span class="seccion-icon"><i class="fas ${icono}"></i></span>
                        </div>
                    </div>
                    <div class="seccion-info">
                        <h3>${escapeHtml(section.titulo)}</h3>
                        <p>${escapeHtml(descCorta)}</p>
                        <span class="seccion-ver">Ver trabajos →</span>
                    </div>
                </a>
            `;
        });

        grid.innerHTML = html;
    }

    // =============================================
    // 5. RENDERIZAR EN PÁGINAS DE DETALLE
    // =============================================
    function renderDetalle(sectionKey) {
        const contenido = cargarContenido();
        const section = contenido.secciones[sectionKey];

        if (!section) return;

        // Actualizar título y descripción
        const tituloEl = document.querySelector('.galeria-detalle-hero h1');
        const descEl = document.querySelector('.galeria-detalle-hero .descripcion');

        if (tituloEl) tituloEl.textContent = section.titulo;
        if (descEl) descEl.textContent = section.descripcion;

        // Actualizar breadcrumb
        const breadcrumb = document.querySelector('.breadcrumb');
        if (breadcrumb) {
            const link = breadcrumb.querySelector('a');
            if (link) {
                breadcrumb.innerHTML = `<a href="galeria.html">Galería</a> / ${section.titulo}`;
            }
        }

        // Actualizar imágenes
        const grid = document.querySelector('.detalle-grid');
        if (!grid || !section.imagenes || section.imagenes.length === 0) {
            if (grid) {
                grid.innerHTML = `
                    <p style="grid-column: 1 / -1; text-align: center; color: #8a8a8a; padding: 3rem;">
                        No hay imágenes en esta sección
                    </p>
                `;
            }
            return;
        }

        let html = '';
        section.imagenes.forEach(function(img) {
            html += `
                <div class="detalle-item">
                    <img src="${img.src}" alt="${escapeHtml(img.nombre)}" onerror="this.src='img/placeholder.png'">
                    <div class="detalle-overlay">
                        <p>${escapeHtml(img.nombre)}</p>
                    </div>
                </div>
            `;
        });

        grid.innerHTML = html;
    }

    // =============================================
    // 6. ESCAPE HTML
    // =============================================
    function escapeHtml(text) {
        if (!text) return '';
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }

    // =============================================
    // 7. ESCUCHAR CAMBIOS EN EL ALMACENAMIENTO
    // =============================================
    // Escuchar cambios en localStorage (desde otras pestañas)
    window.addEventListener('storage', function(e) {
        if (e.key === 'adminContenido') {
            // Recargar el contenido
            recargarContenido();
        }
    });

    // Función para recargar el contenido
    function recargarContenido() {
        const pageType = document.body.dataset.pageType || '';

        if (pageType === 'galeria') {
            renderGaleria();
        } else if (pageType === 'detalle') {
            const sectionKey = document.body.dataset.section;
            if (sectionKey) {
                renderDetalle(sectionKey);
            }
        }

        console.log('🔄 Contenido recargado desde localStorage');
    }

    // =============================================
    // 8. INICIALIZAR
    // =============================================
    document.addEventListener('DOMContentLoaded', function() {
        const pageType = document.body.dataset.pageType || '';

        if (pageType === 'galeria') {
            renderGaleria();
            console.log('📸 Galería cargada desde localStorage');
        } else if (pageType === 'detalle') {
            const sectionKey = document.body.dataset.section;
            if (sectionKey) {
                renderDetalle(sectionKey);
                console.log('📄 Detalle de ' + sectionKey + ' cargado desde localStorage');
            }
        }
    });

    // =============================================
    // 9. EXPORTAR PARA USO EN OTROS SCRIPTS
    // =============================================
    window.ContenidoLoader = {
        cargarContenido: cargarContenido,
        renderGaleria: renderGaleria,
        renderDetalle: renderDetalle,
        recargarContenido: recargarContenido,
        getContenido: getContenido,
        getDefaultContenido: getDefaultContenido
    };

})();