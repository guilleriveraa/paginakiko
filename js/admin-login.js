/**
 * admin-login.js
 * Lógica para el login del panel de administración
 */

document.addEventListener('DOMContentLoaded', function() {

    const form = document.getElementById('adminLoginForm');
    const passwordInput = document.getElementById('password');
    const toggleBtn = document.getElementById('togglePassword');
    const errorDiv = document.getElementById('loginError');

    // =============================================
    // 1. CONTRASEÑA CORRECTA
    // =============================================
    const CORRECT_PASSWORD = 'Ki11ko02';

    // =============================================
    // 2. MOSTRAR/OCULTAR CONTRASEÑA
    // =============================================
    if (toggleBtn) {
        toggleBtn.addEventListener('click', function() {
            const type = passwordInput.getAttribute('type') === 'password' ? 'text' : 'password';
            passwordInput.setAttribute('type', type);
            this.innerHTML = type === 'password' ? '<i class="fas fa-eye"></i>' : '<i class="fas fa-eye-slash"></i>';
        });
    }

    // =============================================
    // 3. VALIDAR LOGIN
    // =============================================
    if (form) {
        form.addEventListener('submit', function(e) {
            e.preventDefault();

            const password = passwordInput.value.trim();

            if (password === CORRECT_PASSWORD) {
                // Guardar sesión en localStorage
                localStorage.setItem('adminLoggedIn', 'true');
                localStorage.setItem('adminLoginTime', new Date().toISOString());

                // Redirigir al panel
                window.location.href = 'admin.html';
            } else {
                // Mostrar error
                errorDiv.style.display = 'flex';
                passwordInput.style.borderColor = '#f44336';

                // Ocultar error después de 3 segundos
                setTimeout(function() {
                    errorDiv.style.display = 'none';
                    passwordInput.style.borderColor = '#ddd';
                }, 3000);

                // Limpiar campo
                passwordInput.value = '';
                passwordInput.focus();
            }
        });
    }

    // =============================================
    // 4. REDIRECCIONAR SI YA ESTÁ LOGUEADO
    // =============================================
    if (localStorage.getItem('adminLoggedIn') === 'true') {
        window.location.href = 'admin.html';
    }

});