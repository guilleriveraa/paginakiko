/**
 * admin-textos.js
 * Panel de administración - VERSIÓN PARA VERCEL CON UPASTASH REDIS
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
    // 2. CARGAR TEXTOS DESDE EL SERVIDOR
    // =============================================
    function cargarTextos() {
        fetch('/api/obtener-textos.php')
            .then(response => {
                if (!response.ok) throw new Error('Error al cargar');
                return response.json();
            })
            .then(data => {
                textos = data;
                localStorage.setItem('adminTextos', JSON.stringify(textos));
                renderEditor();
                console.log('✅ Textos cargados desde Upstash Redis');
            })
            .catch(error => {
                console.error('Error cargando textos:', error);
                // Intentar desde localStorage
                const stored = localStorage.getItem('adminTextos');
                if (stored) {
                    try {
                        textos = JSON.parse(stored);
                        renderEditor();
                    } catch {
                        alert('Error al cargar los textos. Intenta recargar la página.');
                    }
                }
            });
    }

    // =============================================
    // 3. GUARDAR TEXTOS EN EL SERVIDOR
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
    // 4. RENDERIZAR EDITOR
    // =============================================
    function renderEditor() {
        const container = document.getElementById('textosEditor');
        if (!container) return;

        // Aquí va el HTML del editor (puedes copiarlo de la versión anterior)
        // ... (todo el HTML del editor)

        initTextosEvents();
    }

    // =============================================
    // 5. GUARDAR TODOS LOS TEXTOS
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
                showSaveMessage('✅ Textos guardados en Upstash Redis');
            })
            .catch(error => {
                showSaveMessage('⚠️ Error al guardar: ' + error.message);
                localStorage.setItem('adminTextos', JSON.stringify(data));
                textos = data;
            });
    }

    // =============================================
    // 6. FUNCIONES AUXILIARES
    // =============================================
    function escapeHtml(text) {
        if (!text) return '';
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }

    function initTextosEvents() {
        const saveBtn = document.getElementById('saveAllTextosBtn');
        if (saveBtn) {
            saveBtn.addEventListener('click', guardarTodosLosTextos);
        }
    }

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
    // 7. CERRAR SESIÓN
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
    // 8. INICIALIZAR
    // =============================================
    cargarTextos();
    console.log('✅ Editor de textos cargado con Upstash Redis');

});