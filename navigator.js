/**
 * Interactive Patient Navigator Logic
 * Guides users to the specific package or department they need.
 */

const toggle = document.getElementById('navigator-toggle');
const windowClone = document.getElementById('navigator-window');
const closeBtn = document.getElementById('navigator-close');
const contentContainer = document.getElementById('navigator-content');
const inputField = document.getElementById('navigator-input-field');
const sendBtn = document.getElementById('navigator-send');

const config = {
    es: {
        step1_text: "Bienvenido al Navegador del Paciente. ¿Cuál es tu caso hoy?",
        step2_text: "Basado en tu caso, estas son las mejores opciones para ti:",
        whatsapp_text: "Conectar con WhatsApp para más información",
        categories: [
            { id: 'general', label: 'Consulta General / Chequeo' },
            { id: 'specialty', label: 'Especialidades Médicas' },
            { id: 'analysis', label: 'Análisis y Laboratorio' },
            { id: 'vaccine', label: 'Vacunación y Prevención' }
        ],
        solutions: {
            general: [
                { title: 'Paquete de Salud Familiar', desc: 'Chequeo completo para todos los integrantes.' },
                { title: 'Consulta de Seguimiento', desc: 'Atención personalizada para pacientes recurrentes.' }
            ],
            specialty: [
                { title: 'Diagnóstico Avanzado', desc: 'Acceso a especialistas en cardiología y más.' },
                { title: 'Tratamientos Crónicos', desc: 'Planes de salud a largo plazo.' }
            ],
            analysis: [
                { title: 'Perfil de Laboratorio Pro', desc: 'Resultados en menos de 24 horas.' },
                { title: 'Pruebas Especializadas', desc: 'Detección temprana y prevención.' }
            ],
            vaccine: [
                { title: 'Esquema de Vacunación Infantil', desc: 'Protección para los más pequeños.' },
                { title: 'Vacunación Estacional', desc: 'Prevención contra gripe y otros virus.' }
            ]
        }
    },
    en: {
        step1_text: "Welcome to the Patient Navigator. What is your case today?",
        step2_text: "Based on your case, these are the best options for you:",
        whatsapp_text: "Connect via WhatsApp for more information",
        categories: [
            { id: 'general', label: 'General Consultation / Checkup' },
            { id: 'specialty', label: 'Medical Specialties' },
            { id: 'analysis', label: 'Analysis and Laboratory' },
            { id: 'vaccine', label: 'Vaccination and Prevention' }
        ],
        solutions: {
            general: [
                { title: 'Family Health Package', desc: 'Complete checkup for all members.' },
                { title: 'Follow-up Consultation', desc: 'Personalized care for regular patients.' }
            ],
            specialty: [
                { title: 'Advanced Diagnosis', desc: 'Access to specialists in cardiology and more.' },
                { title: 'Chronic Treatments', desc: 'Long-term health plans.' }
            ],
            analysis: [
                { title: 'Pro Laboratory Profile', desc: 'Results in less than 24 hours.' },
                { title: 'Specialized Tests', desc: 'Early detection and prevention.' }
            ],
            vaccine: [
                { title: 'Child Vaccination Scheme', desc: 'Protection for the little ones.' },
                { title: 'Seasonal Vaccination', desc: 'Prevention against flu and other viruses.' }
            ]
        }
    }
    // Other languages can be added similarly or fall back to ES/EN
};

function getTranslation(key) {
    const lang = document.documentElement.lang || 'es';
    const fallback = config['en'];
    const current = config[lang] || config['es'];
    return current[key] || fallback[key];
}

function initStep1() {
    const lang = document.documentElement.lang || 'es';
    const langConfig = config[lang] || config['es'];

    contentContainer.innerHTML = `
        <div class="message message--bot">${getTranslation('step1_text')}</div>
        <div class="navigator-options">
            ${langConfig.categories.map(cat => `
                <button class="nav-option-btn" data-id="${cat.id}">${cat.label}</button>
            `).join('')}
        </div>
    `;

    // Add listeners to buttons
    contentContainer.querySelectorAll('.nav-option-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            const categoryId = btn.getAttribute('data-id');
            const label = btn.innerText;
            showStep2(categoryId, label);
        });
    });
}

function showStep2(categoryId, userChoice) {
    const lang = document.documentElement.lang || 'es';
    const langConfig = config[lang] || config['es'];
    const solutions = langConfig.solutions[categoryId] || langConfig.solutions['general'];

    // Add user message
    const userMsg = document.createElement('div');
    userMsg.className = 'message message--user';
    userMsg.innerText = userChoice;
    contentContainer.appendChild(userMsg);

    // Add bot thinking
    const botResponse = document.createElement('div');
    botResponse.className = 'message message--bot';
    botResponse.innerText = getTranslation('step2_text');
    contentContainer.appendChild(botResponse);

    const solutionsDiv = document.createElement('div');
    solutionsDiv.className = 'navigator-options';
    solutionsDiv.innerHTML = solutions.map(sol => `
        <div class="solution-card">
            <div class="solution-card__title">${sol.title}</div>
            <div class="solution-card__text">${sol.desc}</div>
        </div>
    `).join('');

    // Add WhatsApp link
    const waLink = document.createElement('a');
    waLink.href = "https://wa.me/your-number";
    waLink.className = "whatsapp-link";
    waLink.target = "_blank";
    waLink.innerHTML = `
        <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
            <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-4.821 7.604c-1.914 0-3.793-.514-5.432-1.487l-.389-.231-4.041 1.06 1.079-3.937-.253-.403C2.593 15.45 2.001 13.266 2.001 11c0-4.963 4.037-9 9-9s9 4.037 9 9-4.037 9-9 9m0-20C5.373 2 0 7.373 0 14c0 2.123.553 4.12 1.519 5.86l-1.614 5.895 6.035-1.583C7.514 24.135 9.534 24.667 11.651 24.667c6.627 0 12-5.373 12-12s-5.373-12-12-12" />
        </svg>
        ${getTranslation('whatsapp_text')}
    `;

    solutionsDiv.appendChild(waLink);
    contentContainer.appendChild(solutionsDiv);
    contentContainer.scrollTop = contentContainer.scrollHeight;
}

// Toggle window visibility
toggle.addEventListener('click', () => {
    const chatWindow = document.getElementById('chatbot-window');
    if (chatWindow) chatWindow.classList.add('chatbot-window--hidden');
    windowClone.classList.toggle('chatbot-window--hidden');
    if (!windowClone.classList.contains('chatbot-window--hidden')) {
        initStep1();
    }
});

closeBtn.addEventListener('click', () => {
    windowClone.classList.add('chatbot-window--hidden');
});

function handleUserInput() {
    const text = inputField.value.trim();
    if (!text) return;

    inputField.value = '';
    showStep2('general', text); // Default to general for custom text input
}

sendBtn.addEventListener('click', handleUserInput);
inputField.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') handleUserInput();
});

// Re-initialize if language changes
document.getElementById('language-select').addEventListener('change', () => {
    if (!windowClone.classList.contains('chatbot-window--hidden')) {
        initStep1();
    }
});
