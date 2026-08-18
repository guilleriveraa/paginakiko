/**
 * admin.js
 * Lógica del panel de administración
 */

document.addEventListener('DOMContentLoaded', function() {

    // =============================================
    // 1. VERIFICAR SESIÓN
    // =============================================
    function checkSession() {
        const isLoggedIn = localStorage.getItem('adminLoggedIn');

        if (isLoggedIn !== 'true') {
            window.location.href = 'admin-login.html';
            return false;
        }
        return true;
    }

    if (!checkSession()) return;

    // =============================================
    // 2. CERRAR SESIÓN
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
    // 3. CONTADORES (estadísticas)
    // =============================================
    function updateStats() {
        // Total de imágenes (estimado)
        const totalImages = document.querySelectorAll('.detalle-item, .galeria-item').length || 24;
        document.getElementById('totalImages').textContent = totalImages;

        // Total de páginas
        const pages = ['index', 'servicios', 'productos', 'galeria', 'contacto'];
        document.getElementById('totalPages').textContent = pages.length;

        // Total de categorías
        const categories = ['Cerrajería', 'Aluminio', 'Muebles', 'Barandillas', 'Varios'];
        document.getElementById('totalCategories').textContent = categories.length;
    }

    updateStats();

    // =============================================
    // 4. PREVENIR CIERRE ACCIDENTAL
    // =============================================
    window.addEventListener('beforeunload', function(e) {
        // Solo mostrar advertencia si hay cambios sin guardar
        // (funcionalidad para implementar en futuras versiones)
    });

    console.log('✅ Panel de administración cargado correctamente');
    console.log('🔐 Sesión iniciada:', localStorage.getItem('adminLoginTime'));

});