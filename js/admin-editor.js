/**
 * admin-editor.js
 * Panel de administración: editar secciones, imágenes y textos
 */

document.addEventListener('DOMContentLoaded', function() {

    // =============================================
    // 1. VERIFICAR SESIÓN
    // =============================================
    if (localStorage.getItem('adminLoggedIn') !== 'true') {
        window.location.href = 'admin-login.html';
        return;
    }

    // =============================================
    // 2. DATOS POR DEFECTO
    // =============================================
    const DEFAULT_DATA = {
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

    // =============================================
    // 3. CARGAR O INICIALIZAR DATOS
    // =============================================
    function getData() {
        const stored = localStorage.getItem('adminContenido');
        if (stored) {
            try {
                const data = JSON.parse(stored);
                return data;
            } catch {
                return DEFAULT_DATA;
            }
        }
        return DEFAULT_DATA;
    }

    function saveData(data) {
        localStorage.setItem('adminContenido', JSON.stringify(data));
    }

    // =============================================
    // 4. GENERAR PANEL DE EDICIÓN
    // =============================================
    let contenido = getData();
    let currentSection = 'cerrajeria';

    function renderEditor() {
        const container = document.getElementById('tabContent');
        const sections = contenido.secciones;
        let html = '';

        Object.keys(sections).forEach(function(key) {
            const section = sections[key];
            const isActive = (key === currentSection);
            const imageCount = section.imagenes ? section.imagenes.length : 0;

            html += `
                <div class="editor-panel ${isActive ? 'active' : ''}" data-section="${key}">
                    <!-- TEXTOS -->
                    <div class="editor-texts">
                        <h3><i class="fas fa-pen"></i> Textos de la sección</h3>
                        <div class="form-group">
                            <label for="titulo_${key}">Título</label>
                            <input type="text" id="titulo_${key}" value="${escapeHtml(section.titulo)}" data-field="titulo">
                        </div>
                        <div class="form-group">
                            <label for="descripcion_${key}">Descripción</label>
                            <textarea id="descripcion_${key}" rows="4" data-field="descripcion">${escapeHtml(section.descripcion)}</textarea>
                        </div>
                        <button class="btn-save-section" data-section="${key}">
                            <i class="fas fa-save"></i> Guardar textos
                        </button>
                    </div>

                    <!-- IMÁGENES -->
                    <div class="editor-images">
                        <h3><i class="fas fa-images"></i> Imágenes (${imageCount})</h3>
                        <div class="images-grid" id="grid_${key}">
                            ${renderImages(section.imagenes, key)}
                        </div>

                        <!-- Subir imagen -->
                        <div class="image-upload-area" data-section="${key}">
                            <i class="fas fa-cloud-upload-alt"></i>
                            <p>Haz clic para subir una imagen</p>
                            <input type="file" accept="image/*" multiple>
                        </div>

                        <button class="btn-save-section" data-section="${key}" style="margin-top: 1rem;">
                            <i class="fas fa-save"></i> Guardar imágenes
                        </button>
                    </div>
                </div>
            `;
        });

        container.innerHTML = html;

        // Actualizar estadísticas
        updateStats();

        // Inicializar eventos
        initEvents();
    }

    function renderImages(imagenes, sectionKey) {
        if (!imagenes || imagenes.length === 0) {
            return `<p style="color: #8a8a8a; font-size: 0.85rem; grid-column: 1 / -1;">No hay imágenes en esta sección</p>`;
        }

        return imagenes.map(function(img, index) {
            return `
                <div class="image-item" data-id="${img.id}">
                    <img src="${img.src}" alt="${escapeHtml(img.nombre)}" onerror="this.src='img/placeholder.png'">
                    <span class="image-order">#${index + 1}</span>
                    <div class="image-actions">
                        <button class="btn-image-delete" data-section="${sectionKey}" data-id="${img.id}">
                            <i class="fas fa-trash"></i>
                        </button>
                    </div>
                </div>
            `;
        }).join('');
    }

    function escapeHtml(text) {
        if (!text) return '';
        return text
            .replace(/&/g, '&amp;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;')
            .replace(/"/g, '&quot;')
            .replace(/'/g, '&#039;');
    }

    // =============================================
    // 5. INICIALIZAR EVENTOS
    // =============================================
    function initEvents() {
        // Tabs
        document.querySelectorAll('.tab-btn').forEach(function(btn) {
            btn.addEventListener('click', function() {
                document.querySelectorAll('.tab-btn').forEach(function(b) {
                    b.classList.remove('active');
                });
                this.classList.add('active');

                currentSection = this.dataset.section;

                document.querySelectorAll('.editor-panel').forEach(function(panel) {
                    panel.classList.remove('active');
                    if (panel.dataset.section === currentSection) {
                        panel.classList.add('active');
                    }
                });
            });
        });

        // Guardar textos de sección
        document.querySelectorAll('.btn-save-section').forEach(function(btn) {
            btn.addEventListener('click', function(e) {
                e.preventDefault();
                const sectionKey = this.dataset.section;
                saveSectionTexts(sectionKey);
            });
        });

        // Guardar todo
        document.getElementById('saveAllBtn').addEventListener('click', function() {
            saveAll();
        });

        // Cerrar sesión
        document.getElementById('logoutBtn').addEventListener('click', function(e) {
            e.preventDefault();
            localStorage.removeItem('adminLoggedIn');
            localStorage.removeItem('adminLoginTime');
            window.location.href = 'admin-login.html';
        });

        // Subir imágenes
        document.querySelectorAll('.image-upload-area').forEach(function(area) {
            const input = area.querySelector('input[type="file"]');
            const sectionKey = area.dataset.section;

            area.addEventListener('click', function() {
                input.click();
            });

            input.addEventListener('change', function() {
                if (this.files.length > 0) {
                    handleImageUpload(sectionKey, this.files);
                    this.value = '';
                }
            });
        });

        // Eliminar imágenes (event delegation)
        document.addEventListener('click', function(e) {
            if (e.target.closest('.btn-image-delete')) {
                const btn = e.target.closest('.btn-image-delete');
                const sectionKey = btn.dataset.section;
                const imageId = btn.dataset.id;
                deleteImage(sectionKey, imageId);
            }
        });
    }

    // =============================================
    // 6. FUNCIONES DE GUARDADO
    // =============================================
    function saveSectionTexts(sectionKey) {
        const tituloInput = document.getElementById(`titulo_${sectionKey}`);
        const descInput = document.getElementById(`descripcion_${sectionKey}`);

        if (tituloInput) {
            contenido.secciones[sectionKey].titulo = tituloInput.value.trim();
        }
        if (descInput) {
            contenido.secciones[sectionKey].descripcion = descInput.value.trim();
        }

        saveData(contenido);
        showSaveMessage('Textos guardados correctamente');
    }

    function saveAll() {
        // Guardar todos los textos
        document.querySelectorAll('.editor-panel').forEach(function(panel) {
            const sectionKey = panel.dataset.section;
            const tituloInput = document.getElementById(`titulo_${sectionKey}`);
            const descInput = document.getElementById(`descripcion_${sectionKey}`);

            if (tituloInput) {
                contenido.secciones[sectionKey].titulo = tituloInput.value.trim();
            }
            if (descInput) {
                contenido.secciones[sectionKey].descripcion = descInput.value.trim();
            }
        });

        saveData(contenido);
        showSaveMessage('Todos los cambios guardados correctamente');
        updateStats();
    }

    // =============================================
    // 7. GESTIÓN DE IMÁGENES
    // =============================================
    function handleImageUpload(sectionKey, files) {
        const section = contenido.secciones[sectionKey];
        const currentCount = section.imagenes ? section.imagenes.length : 0;

        Array.from(files).forEach(function(file, index) {
            if (file.type.startsWith('image/')) {
                const reader = new FileReader();
                reader.onload = function(e) {
                    const newId = sectionKey + '_' + Date.now() + '_' + index;

                    // Crear objeto de imagen
                    const newImage = {
                        id: newId,
                        nombre: file.name.replace(/\.[^/.]+$/, ''),
                        src: e.target.result
                    };

                    if (!section.imagenes) {
                        section.imagenes = [];
                    }
                    section.imagenes.push(newImage);

                    // Guardar y actualizar
                    saveData(contenido);
                    renderEditor();
                    showSaveMessage('Imagen subida correctamente');
                };
                reader.readAsDataURL(file);
            }
        });
    }

    function deleteImage(sectionKey, imageId) {
        if (!confirm('¿Estás seguro de que quieres eliminar esta imagen?')) return;

        const section = contenido.secciones[sectionKey];
        if (section && section.imagenes) {
            section.imagenes = section.imagenes.filter(function(img) {
                return img.id !== imageId;
            });

            saveData(contenido);
            renderEditor();
            showSaveMessage('Imagen eliminada correctamente');
        }
    }

    // =============================================
    // 8. ACTUALIZAR ESTADÍSTICAS
    // =============================================
    function updateStats() {
        const data = getData();
        let totalImages = 0;
        let totalTexts = 0;

        Object.keys(data.secciones).forEach(function(key) {
            const section = data.secciones[key];
            if (section.imagenes) {
                totalImages += section.imagenes.length;
            }
            if (section.titulo) totalTexts++;
            if (section.descripcion) totalTexts++;
        });

        document.getElementById('totalImages').textContent = totalImages;
        document.getElementById('totalTexts').textContent = totalTexts;
        document.getElementById('totalSections').textContent = Object.keys(data.secciones).length;
    }

    // =============================================
    // 9. MOSTRAR MENSAJE DE GUARDADO
    // =============================================
    function showSaveMessage(text) {
        const message = document.getElementById('saveMessage');
        const textEl = message.querySelector('span') || document.createElement('span');

        if (!message.querySelector('span')) {
            const span = document.createElement('span');
            span.textContent = text;
            message.appendChild(span);
        } else {
            message.querySelector('span').textContent = text;
        }

        message.style.display = 'flex';

        setTimeout(function() {
            message.style.display = 'none';
        }, 3000);
    }

    // =============================================
    // 10. INICIAR
    // =============================================
    renderEditor();

    console.log('✅ Panel de administración cargado correctamente');
    console.log('📊 Contenido:', contenido);

    // =============================================
    // 11. CERRAR SESIÓN POR INACTIVIDAD (30 min)
    // =============================================
    let inactivityTimer;

    function resetInactivityTimer() {
        clearTimeout(inactivityTimer);
        inactivityTimer = setTimeout(function() {
            localStorage.removeItem('adminLoggedIn');
            window.location.href = 'admin-login.html';
        }, 30 * 60 * 1000); // 30 minutos
    }

    document.addEventListener('mousemove', resetInactivityTimer);
    document.addEventListener('keydown', resetInactivityTimer);
    resetInactivityTimer();

});

// =============================================
// 12. EXPORTAR PARA USO EN OTROS SCRIPTS
// =============================================
window.getContenido = function() {
    const stored = localStorage.getItem('adminContenido');
    if (stored) {
        try {
            return JSON.parse(stored);
        } catch {
            return null;
        }
    }
    return null;
};
// =============================================
// 12. SINCRONIZAR CAMBIOS EN TIEMPO REAL
// =============================================
// Cuando se guardan cambios, notificar a otras pestañas
function notificarCambios() {
    // Disparar evento storage para que otras pestañas actualicen
    localStorage.setItem('adminContenido', JSON.stringify(contenido));
    // Forzar el evento storage manualmente
    window.dispatchEvent(new StorageEvent('storage', {
        key: 'adminContenido',
        newValue: JSON.stringify(contenido)
    }));
}

// Modificar las funciones de guardado para notificar cambios
const originalSaveSectionTexts = saveSectionTexts;
saveSectionTexts = function(sectionKey) {
    originalSaveSectionTexts(sectionKey);
    notificarCambios();
};

const originalSaveAll = saveAll;
saveAll = function() {
    originalSaveAll();
    notificarCambios();
};

const originalHandleImageUpload = handleImageUpload;
handleImageUpload = function(sectionKey, files) {
    originalHandleImageUpload(sectionKey, files);
    setTimeout(notificarCambios, 100);
};

const originalDeleteImage = deleteImage;
deleteImage = function(sectionKey, imageId) {
    originalDeleteImage(sectionKey, imageId);
    setTimeout(notificarCambios, 100);
};

window.guardarContenido = function(data) {
    localStorage.setItem('adminContenido', JSON.stringify(data));
};