// Smooth scroll and interface logic
document.addEventListener('DOMContentLoaded', () => {
    console.log('Dr. Iturre Medical Services site initialized');

    // Language Switching Logic
    const languageSelect = document.getElementById('language-select');

    function setLanguage(lang) {
        if (!translations[lang]) return;

        document.querySelectorAll('[data-i18n]').forEach(el => {
            const key = el.getAttribute('data-i18n');

            // Check if key is for attribute (e.g., [alt]img_consultorio)
            if (key.startsWith('[') && key.includes(']')) {
                const parts = key.split(']');
                const attr = parts[0].substring(1);
                const translationKey = parts[1];
                if (translations[lang][translationKey]) {
                    el.setAttribute(attr, translations[lang][translationKey]);
                }
            } else if (translations[lang][key]) {
                el.innerHTML = translations[lang][key];
            }
        });

        // Update html lang attribute
        document.documentElement.lang = lang;

        // Persist language
        localStorage.setItem('preferred_lang', lang);

        // Update select value if it changed from outside
        if (languageSelect.value !== lang) {
            languageSelect.value = lang;
        }
    }

    // Initialize Language
    const savedLang = localStorage.getItem('preferred_lang') || 'es';
    setLanguage(savedLang);

    languageSelect.addEventListener('change', (e) => {
        setLanguage(e.target.value);
    });

    // Sticky header shadow on scroll
    const header = document.querySelector('.header');
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            header.style.boxShadow = '0 10px 15px -3px rgba(0, 0, 0, 0.1)';
        } else {
            header.style.boxShadow = 'none';
        }
    });

    // Mobile menu logic (to be added if needed)
});
