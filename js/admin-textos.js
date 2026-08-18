/**
 * admin-textos.js
 * Panel de administración - EDITOR COMPLETO
 */

document.addEventListener('DOMContentLoaded', function() {

    // =============================================
    // 1. VERIFICAR SESIÓN
    // =============================================
    if (localStorage.getItem('adminLoggedIn') !== 'true') {
        window.location.href = 'admin-login.html';
        return;
    }

    let textos = {};

    // =============================================
    // 2. DATOS POR DEFECTO (por si falla la carga)
    // =============================================
    const DEFAULT_TEXTOS = {
        "header": {
            "logo_texto": "Cerrajeria y Aluminio Francisco Rivera",
            "logo_sub": "e Hijo"
        },
        "nav": {
            "inicio": "Inicio",
            "servicios": "Servicios",
            "productos": "Productos",
            "galeria": "Galería",
            "contacto": "Contacto",
            "presupuesto": "Presupuesto"
        },
        "index": {
            "hero_titulo": "Cerrajería Francisco Rivera e Hijo",
            "hero_descripcion": "Más de 30 años de experiencia en el sector",
            "btn_presupuesto": "Solicitar presupuesto",
            "btn_productos": "Ver productos",
            "seccion_titulo": "Nuestra esencia",
            "seccion_subtitulo": "Más de 30 años de tradición y calidad",
            "valor1_titulo": "Experiencia",
            "valor1_desc": "Tres décadas de trabajo en el sector de la cerrajería y la metalurgia.",
            "valor2_titulo": "Calidad",
            "valor2_desc": "Utilizamos los mejores materiales y procesos para garantizar productos duraderos.",
            "valor3_titulo": "Confianza",
            "valor3_desc": "Fabricamos para clientes de toda la provincia, ofreciendo un trato cercano."
        },
        "servicios": {
            "titulo": "Servicios de cerrajería y fabricación",
            "descripcion": "Más de 30 años de experiencia ofreciendo soluciones metálicas de calidad",
            "cerrajeria_titulo": "Cerrajería en general",
            "cerrajeria_desc": "Instalación y reparación de puertas metálicas, cerraduras, rejas, barandillas y estructuras metálicas.",
            "herramientas_titulo": "Herramientas agrícolas",
            "herramientas_desc": "Fabricamos herramientas manuales de alta calidad para el sector agrícola.",
            "medida_titulo": "Trabajos a medida",
            "medida_desc": "Diseñamos y fabricamos piezas y estructuras metálicas personalizadas.",
            "proceso_titulo": "¿Cómo trabajamos?",
            "proceso_desc": "Un proceso sencillo y transparente",
            "paso1": "Cuéntanos tu idea",
            "paso1_desc": "Nos reunimos para conocer tus necesidades y requerimientos.",
            "paso2": "Diseñamos la solución",
            "paso2_desc": "Te preparamos un presupuesto detallado sin compromiso.",
            "paso3": "Fabricación",
            "paso3_desc": "Realizamos el trabajo con los mejores materiales y procesos.",
            "paso4": "Instalación y entrega",
            "paso4_desc": "Instalamos o entregamos el producto final con total garantía."
        },
        "productos": {
            "titulo": "Productos de cerrajería y metalistería",
            "descripcion": "Fabricación propia de productos metálicos con la máxima calidad",
            "cerrajeria_titulo": "Cerrajería",
            "cerrajeria_desc": "Puertas metálicas, rejas, cerraduras y forja artesanal.",
            "aluminio_titulo": "Aluminio",
            "aluminio_desc": "Ventanas, puertas y estructuras de aluminio.",
            "muebles_titulo": "Muebles de Hierro",
            "muebles_desc": "Mesas, sillas, estanterías y mobiliario a medida.",
            "barandillas_titulo": "Barandillas",
            "barandillas_desc": "Barandillas, pasamanos y protecciones para escaleras.",
            "motorizadas_titulo": "Puertas Motorizadas",
            "motorizadas_desc": "Puertas automáticas para garajes y naves industriales.",
            "varios_titulo": "Varios",
            "varios_desc": "Estructuras especiales, reparaciones y proyectos personalizados."
        },
        "galeria": {
            "titulo": "Galería de imágenes",
            "descripcion": "Explora nuestros trabajos de cerrajería, aluminio, muebles de hierro, barandillas y más.",
            "cerrajeria": "Cerrajería",
            "cerrajeria_desc": "Puertas, rejas, cerraduras y trabajos de forja",
            "aluminio": "Aluminio",
            "aluminio_desc": "Ventanas, puertas y estructuras de aluminio",
            "muebles": "Muebles de Hierro",
            "muebles_desc": "Mesas, sillas, estanterías y mobiliario",
            "barandillas": "Barandillas",
            "barandillas_desc": "Barandillas, pasamanos y protecciones",
            "varios": "Varios",
            "varios_desc": "Estructuras especiales y piezas únicas"
        },
        "contacto": {
            "titulo": "¿Necesitas un presupuesto?",
            "descripcion": "Cuéntanos lo que necesitas y te asesoraremos sin compromiso.",
            "telefono": "653 67 66 71",
            "email": "fco.riveraehijo@hotmail.com",
            "direccion": "Polígono Industrial, C. Cobalto, 61",
            "ciudad": "10810 Montehermoso, Cáceres",
            "formulario_titulo": "Envíanos un mensaje"
        },
        "footer": {
            "texto": "Cerrajería y Aluminio Francisco Rivera",
            "aviso_legal": "Aviso legal",
            "cookies": "Política de cookies"
        }
    };

    // =============================================
    // 3. CARGAR TEXTOS
    // =============================================
    function cargarTextos() {
        // Intentar desde localStorage primero
        const stored = localStorage.getItem('adminTextos');
        if (stored) {
            try {
                textos = JSON.parse(stored);
                renderEditor();
                return;
            } catch {}
        }

        // Si no hay en localStorage, cargar desde el servidor
        fetch('/api/obtener-textos.php')
            .then(response => {
                if (!response.ok) throw new Error('Error al cargar');
                return response.json();
            })
            .then(data => {
                textos = data;
                localStorage.setItem('adminTextos', JSON.stringify(textos));
                renderEditor();
                console.log('✅ Textos cargados desde el servidor');
            })
            .catch(error => {
                console.error('Error cargando textos:', error);
                // Usar datos por defecto
                textos = DEFAULT_TEXTOS;
                localStorage.setItem('adminTextos', JSON.stringify(textos));
                renderEditor();
                showSaveMessage('⚠️ Usando datos locales (falló la conexión)');
            });
    }

    // =============================================
    // 4. GUARDAR TEXTOS
    // =============================================
    function guardarTextos(data) {
        return fetch('/api/guardar-textos.php', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data)
        })
        .then(response => response.json())
        .then(result => {
            if (result.success) {
                localStorage.setItem('adminTextos', JSON.stringify(data));
                return result;
            } else {
                throw new Error(result.error || 'Error al guardar');
            }
        });
    }

    // =============================================
    // 5. ESCAPE HTML
    // =============================================
    function escapeHtml(text) {
        if (!text) return '';
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }

    // =============================================
    // 6. RENDERIZAR EDITOR (COMPLETO)
    // =============================================
    function renderEditor() {
        const container = document.getElementById('textosEditor');
        if (!container) {
            console.error('No se encontró el contenedor #textosEditor');
            return;
        }

        // Asegurar que textos tenga todas las propiedades
        if (!textos.header) textos.header = DEFAULT_TEXTOS.header;
        if (!textos.nav) textos.nav = DEFAULT_TEXTOS.nav;
        if (!textos.index) textos.index = DEFAULT_TEXTOS.index;
        if (!textos.servicios) textos.servicios = DEFAULT_TEXTOS.servicios;
        if (!textos.productos) textos.productos = DEFAULT_TEXTOS.productos;
        if (!textos.galeria) textos.galeria = DEFAULT_TEXTOS.galeria;
        if (!textos.contacto) textos.contacto = DEFAULT_TEXTOS.contacto;
        if (!textos.footer) textos.footer = DEFAULT_TEXTOS.footer;

        let html = '';

        // ===== SECCIÓN: HEADER =====
        html += `
            <div class="seccion-editor">
                <h3><i class="fas fa-header"></i> Header / Logo</h3>
                <div class="campo">
                    <label>Texto del logo</label>
                    <input type="text" id="header_logo_texto" value="${escapeHtml(textos.header.logo_texto || '')}">
                </div>
                <div class="campo">
                    <label>Subtexto del logo</label>
                    <input type="text" id="header_logo_sub" value="${escapeHtml(textos.header.logo_sub || '')}">
                </div>
            </div>
        `;

        // ===== SECCIÓN: NAV =====
        html += `
            <div class="seccion-editor">
                <h3><i class="fas fa-bars"></i> Navegación</h3>
                <div class="campo">
                    <label>Inicio</label>
                    <input type="text" id="nav_inicio" value="${escapeHtml(textos.nav.inicio || '')}">
                </div>
                <div class="campo">
                    <label>Servicios</label>
                    <input type="text" id="nav_servicios" value="${escapeHtml(textos.nav.servicios || '')}">
                </div>
                <div class="campo">
                    <label>Productos</label>
                    <input type="text" id="nav_productos" value="${escapeHtml(textos.nav.productos || '')}">
                </div>
                <div class="campo">
                    <label>Galería</label>
                    <input type="text" id="nav_galeria" value="${escapeHtml(textos.nav.galeria || '')}">
                </div>
                <div class="campo">
                    <label>Contacto</label>
                    <input type="text" id="nav_contacto" value="${escapeHtml(textos.nav.contacto || '')}">
                </div>
                <div class="campo">
                    <label>Botón Presupuesto</label>
                    <input type="text" id="nav_presupuesto" value="${escapeHtml(textos.nav.presupuesto || '')}">
                </div>
            </div>
        `;

        // ===== SECCIÓN: INDEX =====
        html += `
            <div class="seccion-editor">
                <h3><i class="fas fa-home"></i> Página Principal (Index)</h3>
                <div class="campo">
                    <label>Título del Hero</label>
                    <input type="text" id="index_hero_titulo" value="${escapeHtml(textos.index.hero_titulo || '')}">
                </div>
                <div class="campo">
                    <label>Descripción del Hero</label>
                    <input type="text" id="index_hero_descripcion" value="${escapeHtml(textos.index.hero_descripcion || '')}">
                </div>
                <div class="campo">
                    <label>Botón Presupuesto</label>
                    <input type="text" id="index_btn_presupuesto" value="${escapeHtml(textos.index.btn_presupuesto || '')}">
                </div>
                <div class="campo">
                    <label>Botón Productos</label>
                    <input type="text" id="index_btn_productos" value="${escapeHtml(textos.index.btn_productos || '')}">
                </div>
                <div class="campo">
                    <label>Sección - Título</label>
                    <input type="text" id="index_seccion_titulo" value="${escapeHtml(textos.index.seccion_titulo || '')}">
                </div>
                <div class="campo">
                    <label>Sección - Subtítulo</label>
                    <input type="text" id="index_seccion_subtitulo" value="${escapeHtml(textos.index.seccion_subtitulo || '')}">
                </div>
                <div class="campo">
                    <label>Valor 1 - Título</label>
                    <input type="text" id="index_valor1_titulo" value="${escapeHtml(textos.index.valor1_titulo || '')}">
                </div>
                <div class="campo">
                    <label>Valor 1 - Descripción</label>
                    <textarea id="index_valor1_desc" rows="2">${escapeHtml(textos.index.valor1_desc || '')}</textarea>
                </div>
                <div class="campo">
                    <label>Valor 2 - Título</label>
                    <input type="text" id="index_valor2_titulo" value="${escapeHtml(textos.index.valor2_titulo || '')}">
                </div>
                <div class="campo">
                    <label>Valor 2 - Descripción</label>
                    <textarea id="index_valor2_desc" rows="2">${escapeHtml(textos.index.valor2_desc || '')}</textarea>
                </div>
                <div class="campo">
                    <label>Valor 3 - Título</label>
                    <input type="text" id="index_valor3_titulo" value="${escapeHtml(textos.index.valor3_titulo || '')}">
                </div>
                <div class="campo">
                    <label>Valor 3 - Descripción</label>
                    <textarea id="index_valor3_desc" rows="2">${escapeHtml(textos.index.valor3_desc || '')}</textarea>
                </div>
            </div>
        `;

        // ===== SECCIÓN: SERVICIOS =====
        html += `
            <div class="seccion-editor">
                <h3><i class="fas fa-tools"></i> Servicios</h3>
                <div class="campo">
                    <label>Título de la página</label>
                    <input type="text" id="servicios_titulo" value="${escapeHtml(textos.servicios.titulo || '')}">
                </div>
                <div class="campo">
                    <label>Descripción de la página</label>
                    <textarea id="servicios_descripcion" rows="2">${escapeHtml(textos.servicios.descripcion || '')}</textarea>
                </div>
                <div class="campo">
                    <label>Cerrajería - Título</label>
                    <input type="text" id="servicios_cerrajeria_titulo" value="${escapeHtml(textos.servicios.cerrajeria_titulo || '')}">
                </div>
                <div class="campo">
                    <label>Cerrajería - Descripción</label>
                    <textarea id="servicios_cerrajeria_desc" rows="2">${escapeHtml(textos.servicios.cerrajeria_desc || '')}</textarea>
                </div>
                <div class="campo">
                    <label>Herramientas - Título</label>
                    <input type="text" id="servicios_herramientas_titulo" value="${escapeHtml(textos.servicios.herramientas_titulo || '')}">
                </div>
                <div class="campo">
                    <label>Herramientas - Descripción</label>
                    <textarea id="servicios_herramientas_desc" rows="2">${escapeHtml(textos.servicios.herramientas_desc || '')}</textarea>
                </div>
                <div class="campo">
                    <label>Trabajos a medida - Título</label>
                    <input type="text" id="servicios_medida_titulo" value="${escapeHtml(textos.servicios.medida_titulo || '')}">
                </div>
                <div class="campo">
                    <label>Trabajos a medida - Descripción</label>
                    <textarea id="servicios_medida_desc" rows="2">${escapeHtml(textos.servicios.medida_desc || '')}</textarea>
                </div>
                <div class="campo">
                    <label>Proceso - Título</label>
                    <input type="text" id="servicios_proceso_titulo" value="${escapeHtml(textos.servicios.proceso_titulo || '')}">
                </div>
                <div class="campo">
                    <label>Proceso - Descripción</label>
                    <input type="text" id="servicios_proceso_desc" value="${escapeHtml(textos.servicios.proceso_desc || '')}">
                </div>
                <div class="campo">
                    <label>Paso 1</label>
                    <input type="text" id="servicios_paso1" value="${escapeHtml(textos.servicios.paso1 || '')}">
                </div>
                <div class="campo">
                    <label>Paso 1 - Descripción</label>
                    <input type="text" id="servicios_paso1_desc" value="${escapeHtml(textos.servicios.paso1_desc || '')}">
                </div>
                <div class="campo">
                    <label>Paso 2</label>
                    <input type="text" id="servicios_paso2" value="${escapeHtml(textos.servicios.paso2 || '')}">
                </div>
                <div class="campo">
                    <label>Paso 2 - Descripción</label>
                    <input type="text" id="servicios_paso2_desc" value="${escapeHtml(textos.servicios.paso2_desc || '')}">
                </div>
                <div class="campo">
                    <label>Paso 3</label>
                    <input type="text" id="servicios_paso3" value="${escapeHtml(textos.servicios.paso3 || '')}">
                </div>
                <div class="campo">
                    <label>Paso 3 - Descripción</label>
                    <input type="text" id="servicios_paso3_desc" value="${escapeHtml(textos.servicios.paso3_desc || '')}">
                </div>
                <div class="campo">
                    <label>Paso 4</label>
                    <input type="text" id="servicios_paso4" value="${escapeHtml(textos.servicios.paso4 || '')}">
                </div>
                <div class="campo">
                    <label>Paso 4 - Descripción</label>
                    <input type="text" id="servicios_paso4_desc" value="${escapeHtml(textos.servicios.paso4_desc || '')}">
                </div>
            </div>
        `;

        // ===== SECCIÓN: PRODUCTOS =====
        html += `
            <div class="seccion-editor">
                <h3><i class="fas fa-box"></i> Productos</h3>
                <div class="campo">
                    <label>Título de la página</label>
                    <input type="text" id="productos_titulo" value="${escapeHtml(textos.productos.titulo || '')}">
                </div>
                <div class="campo">
                    <label>Descripción de la página</label>
                    <textarea id="productos_descripcion" rows="2">${escapeHtml(textos.productos.descripcion || '')}</textarea>
                </div>
                <div class="campo">
                    <label>Cerrajería - Título</label>
                    <input type="text" id="productos_cerrajeria_titulo" value="${escapeHtml(textos.productos.cerrajeria_titulo || '')}">
                </div>
                <div class="campo">
                    <label>Cerrajería - Descripción</label>
                    <textarea id="productos_cerrajeria_desc" rows="2">${escapeHtml(textos.productos.cerrajeria_desc || '')}</textarea>
                </div>
                <div class="campo">
                    <label>Aluminio - Título</label>
                    <input type="text" id="productos_aluminio_titulo" value="${escapeHtml(textos.productos.aluminio_titulo || '')}">
                </div>
                <div class="campo">
                    <label>Aluminio - Descripción</label>
                    <textarea id="productos_aluminio_desc" rows="2">${escapeHtml(textos.productos.aluminio_desc || '')}</textarea>
                </div>
                <div class="campo">
                    <label>Muebles de Hierro - Título</label>
                    <input type="text" id="productos_muebles_titulo" value="${escapeHtml(textos.productos.muebles_titulo || '')}">
                </div>
                <div class="campo">
                    <label>Muebles de Hierro - Descripción</label>
                    <textarea id="productos_muebles_desc" rows="2">${escapeHtml(textos.productos.muebles_desc || '')}</textarea>
                </div>
                <div class="campo">
                    <label>Barandillas - Título</label>
                    <input type="text" id="productos_barandillas_titulo" value="${escapeHtml(textos.productos.barandillas_titulo || '')}">
                </div>
                <div class="campo">
                    <label>Barandillas - Descripción</label>
                    <textarea id="productos_barandillas_desc" rows="2">${escapeHtml(textos.productos.barandillas_desc || '')}</textarea>
                </div>
                <div class="campo">
                    <label>Puertas Motorizadas - Título</label>
                    <input type="text" id="productos_motorizadas_titulo" value="${escapeHtml(textos.productos.motorizadas_titulo || '')}">
                </div>
                <div class="campo">
                    <label>Puertas Motorizadas - Descripción</label>
                    <textarea id="productos_motorizadas_desc" rows="2">${escapeHtml(textos.productos.motorizadas_desc || '')}</textarea>
                </div>
                <div class="campo">
                    <label>Varios - Título</label>
                    <input type="text" id="productos_varios_titulo" value="${escapeHtml(textos.productos.varios_titulo || '')}">
                </div>
                <div class="campo">
                    <label>Varios - Descripción</label>
                    <textarea id="productos_varios_desc" rows="2">${escapeHtml(textos.productos.varios_desc || '')}</textarea>
                </div>
            </div>
        `;

        // ===== SECCIÓN: GALERÍA =====
        html += `
            <div class="seccion-editor">
                <h3><i class="fas fa-images"></i> Galería</h3>
                <div class="campo">
                    <label>Título de la página</label>
                    <input type="text" id="galeria_titulo" value="${escapeHtml(textos.galeria.titulo || '')}">
                </div>
                <div class="campo">
                    <label>Descripción de la página</label>
                    <textarea id="galeria_descripcion" rows="2">${escapeHtml(textos.galeria.descripcion || '')}</textarea>
                </div>
                <div class="campo">
                    <label>Cerrajería - Nombre</label>
                    <input type="text" id="galeria_cerrajeria" value="${escapeHtml(textos.galeria.cerrajeria || '')}">
                </div>
                <div class="campo">
                    <label>Cerrajería - Descripción corta</label>
                    <input type="text" id="galeria_cerrajeria_desc" value="${escapeHtml(textos.galeria.cerrajeria_desc || '')}">
                </div>
                <div class="campo">
                    <label>Aluminio - Nombre</label>
                    <input type="text" id="galeria_aluminio" value="${escapeHtml(textos.galeria.aluminio || '')}">
                </div>
                <div class="campo">
                    <label>Aluminio - Descripción corta</label>
                    <input type="text" id="galeria_aluminio_desc" value="${escapeHtml(textos.galeria.aluminio_desc || '')}">
                </div>
                <div class="campo">
                    <label>Muebles de Hierro - Nombre</label>
                    <input type="text" id="galeria_muebles" value="${escapeHtml(textos.galeria.muebles || '')}">
                </div>
                <div class="campo">
                    <label>Muebles de Hierro - Descripción corta</label>
                    <input type="text" id="galeria_muebles_desc" value="${escapeHtml(textos.galeria.muebles_desc || '')}">
                </div>
                <div class="campo">
                    <label>Barandillas - Nombre</label>
                    <input type="text" id="galeria_barandillas" value="${escapeHtml(textos.galeria.barandillas || '')}">
                </div>
                <div class="campo">
                    <label>Barandillas - Descripción corta</label>
                    <input type="text" id="galeria_barandillas_desc" value="${escapeHtml(textos.galeria.barandillas_desc || '')}">
                </div>
                <div class="campo">
                    <label>Varios - Nombre</label>
                    <input type="text" id="galeria_varios" value="${escapeHtml(textos.galeria.varios || '')}">
                </div>
                <div class="campo">
                    <label>Varios - Descripción corta</label>
                    <input type="text" id="galeria_varios_desc" value="${escapeHtml(textos.galeria.varios_desc || '')}">
                </div>
            </div>
        `;

        // ===== SECCIÓN: CONTACTO =====
        html += `
            <div class="seccion-editor">
                <h3><i class="fas fa-envelope"></i> Contacto</h3>
                <div class="campo">
                    <label>Título de la página</label>
                    <input type="text" id="contacto_titulo" value="${escapeHtml(textos.contacto.titulo || '')}">
                </div>
                <div class="campo">
                    <label>Descripción de la página</label>
                    <textarea id="contacto_descripcion" rows="2">${escapeHtml(textos.contacto.descripcion || '')}</textarea>
                </div>
                <div class="campo">
                    <label>Teléfono</label>
                    <input type="text" id="contacto_telefono" value="${escapeHtml(textos.contacto.telefono || '')}">
                </div>
                <div class="campo">
                    <label>Email</label>
                    <input type="text" id="contacto_email" value="${escapeHtml(textos.contacto.email || '')}">
                </div>
                <div class="campo">
                    <label>Dirección</label>
                    <input type="text" id="contacto_direccion" value="${escapeHtml(textos.contacto.direccion || '')}">
                </div>
                <div class="campo">
                    <label>Ciudad</label>
                    <input type="text" id="contacto_ciudad" value="${escapeHtml(textos.contacto.ciudad || '')}">
                </div>
                <div class="campo">
                    <label>Título del formulario</label>
                    <input type="text" id="contacto_formulario_titulo" value="${escapeHtml(textos.contacto.formulario_titulo || '')}">
                </div>
            </div>
        `;

        // ===== SECCIÓN: FOOTER =====
        html += `
            <div class="seccion-editor">
                <h3><i class="fas fa-copyright"></i> Footer</h3>
                <div class="campo">
                    <label>Texto del footer</label>
                    <input type="text" id="footer_texto" value="${escapeHtml(textos.footer.texto || '')}">
                </div>
                <div class="campo">
                    <label>Aviso legal</label>
                    <input type="text" id="footer_aviso_legal" value="${escapeHtml(textos.footer.aviso_legal || '')}">
                </div>
                <div class="campo">
                    <label>Política de cookies</label>
                    <input type="text" id="footer_cookies" value="${escapeHtml(textos.footer.cookies || '')}">
                </div>
            </div>
        `;

        // ===== BOTÓN GUARDAR =====
        html += `
            <div style="text-align: center; margin-top: 2rem; padding: 1rem; border-top: 1px solid #e8e4e0;">
                <button id="saveAllTextosBtn" class="btn-save-all" style="padding: 14px 40px; font-size: 1rem; background: #8a7a6a; color: #fff; border: none; border-radius: 6px; cursor: pointer;">
                    <i class="fas fa-save"></i> Guardar todos los cambios
                </button>
            </div>
        `;

        container.innerHTML = html;
        initTextosEvents();
    }

    // =============================================
    // 7. GUARDAR TODOS LOS TEXTOS
    // =============================================
    function guardarTodosLosTextos() {
        const inputs = document.querySelectorAll('#textosEditor input, #textosEditor textarea');
        const data = JSON.parse(JSON.stringify(textos));

        inputs.forEach(function(input) {
            const id = input.id;
            if (!id) return;
            const partes = id.split('_');
            const seccion = partes[0];
            const campo = partes.slice(1).join('_');
            if (data[seccion] && data[seccion][campo] !== undefined) {
                data[seccion][campo] = input.value;
            }
        });

        guardarTextos(data)
            .then(result => {
                textos = data;
                showSaveMessage('✅ Textos guardados correctamente');
            })
            .catch(error => {
                showSaveMessage('⚠️ Error al guardar: ' + error.message);
                localStorage.setItem('adminTextos', JSON.stringify(data));
                textos = data;
            });
    }

    // =============================================
    // 8. INICIALIZAR EVENTOS
    // =============================================
    function initTextosEvents() {
        const saveBtn = document.getElementById('saveAllTextosBtn');
        if (saveBtn) {
            saveBtn.addEventListener('click', guardarTodosLosTextos);
        }
    }

    // =============================================
    // 9. MOSTRAR MENSAJE
    // =============================================
    function showSaveMessage(text) {
        let message = document.getElementById('saveMessage');
        if (!message) {
            message = document.createElement('div');
            message.id = 'saveMessage';
            message.className = 'save-message';
            const editor = document.querySelector('.admin-editor');
            if (editor) editor.prepend(message);
        }
        message.innerHTML = `<span>${text}</span>`;
        message.style.display = 'flex';
        setTimeout(() => message.style.display = 'none', 4000);
    }

    // =============================================
    // 10. CERRAR SESIÓN
    // =============================================
    const logoutBtn = document.getElementById('logoutBtn');
    if (logoutBtn) {
        logoutBtn.addEventListener('click', function(e) {
            e.preventDefault();
            localStorage.removeItem('adminLoggedIn');
            localStorage.removeItem('adminLoginTime');
            window.location.href = 'admin-login.html';
        });
    }

    // =============================================
    // 11. INICIALIZAR
    // =============================================
    cargarTextos();
    console.log('✅ Editor de textos cargado correctamente');

});