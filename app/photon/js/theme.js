function setTheme(theme) {
    localStorage.setItem('theme', theme);
    let lightBtn = document.getElementById('theme-btn-light');
    let darkBtn = document.getElementById('theme-btn-dark');
    if (theme === 'dark') {
        document.body.classList.add('dark-theme');
        if (darkBtn) {
            darkBtn.classList.add('active');
        }
        if (lightBtn) {
            lightBtn.classList.remove('active');
        }
    } else {
        document.body.classList.remove('dark-theme');
        if (darkBtn) {
            darkBtn.classList.remove('active');
        }
        if (lightBtn) {
            lightBtn.classList.add('active');
        }
    }
}

function handleThemeChange(e) {
    if (e.key === 'theme') {
        setTheme(e.newValue);
    }
}

const theme = localStorage.getItem('theme') || 'dark';
setTheme(theme);
window.addEventListener('storage', handleThemeChange);