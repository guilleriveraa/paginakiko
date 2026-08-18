document.addEventListener('DOMContentLoaded', function () {
    const banner = document.getElementById('cookieBanner');
    const settingsPanel = document.getElementById('cookieSettings');

    // Comprobar si ya se ha dado consentimiento
    if (!localStorage.getItem('cookiePreferences')) {
        banner.style.display = 'block';
    }

    // Función para guardar preferencias
    function savePreferences(prefs) {
        localStorage.setItem('cookiePreferences', JSON.stringify(prefs));
        banner.style.display = 'none';
        settingsPanel.style.display = 'none';

        // Aquí aplicarías las preferencias en la práctica
        if (prefs.functional) {
            console.log("Cookies funcionales activadas");
            // Ejecutar script de preferencias de idioma, etc.
        }
        if (prefs.analytics) {
            console.log("Cookies analíticas activadas");
            // Aquí cargarías el script de Google Analytics
        }
        // Si no hay consentimiento, no se cargan los scripts
    }

    // Aceptar todas
    document.getElementById('acceptCookiesBtn')?.addEventListener('click', () => {
        savePreferences({ functional: true, analytics: true });
    });

    // Rechazar todas no esenciales
    document.getElementById('rejectCookiesBtn')?.addEventListener('click', () => {
        savePreferences({ functional: false, analytics: false });
    });

    // Abrir panel de configuración
    document.getElementById('configCookiesBtn')?.addEventListener('click', () => {
        settingsPanel.style.display = 'block';
    });

    // Guardar preferencias personalizadas
    document.getElementById('savePreferencesBtn')?.addEventListener('click', () => {
        const prefs = {
            functional: document.getElementById('functionalCookies').checked,
            analytics: document.getElementById('analyticsCookies').checked
        };
        savePreferences(prefs);
    });

    // Cerrar panel de configuración sin guardar
    document.getElementById('closeSettingsBtn')?.addEventListener('click', () => {
        settingsPanel.style.display = 'none';
    });
});