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
        thinking_text: "Analizando tu caso...",
        whatsapp_text: "Hablar con un especialista",
        book_now: "Reservar ahora",
        categories: [
            { id: 'general', label: 'Consulta General / Chequeo', keywords: ['chequeo', 'general', 'dolor', 'malestar', 'fiebre'] },
            { id: 'specialty', label: 'Especialidades Médicas', keywords: ['corazon', 'cardiologia', 'huesos', 'piel', 'especialista'] },
            { id: 'analysis', label: 'Análisis y Laboratorio', keywords: ['sangre', 'analisis', 'laboratorio', 'estudio', 'examen'] },
            { id: 'vaccine', label: 'Vacunación y Prevención', keywords: ['vacuna', 'covid', 'gripe', 'niños', 'prevencion'] }
        ],
        solutions: {
            general: [
                { title: 'Paquete Family Health', desc: 'Chequeo completo para 4 personas.', price: '$2,500 MXN', tag: 'Popular' },
                { title: 'Consulta Express', desc: 'Atención inmediata para malestares leves.', price: '$450 MXN', tag: 'Rápido' }
            ],
            specialty: [
                { title: 'Valoración Cardiológica', desc: 'Electrocardiograma y consulta con especialista.', price: '$1,200 MXN', tag: 'Recomendado' },
                { title: 'Dermatología Médica', desc: 'Diagnóstico de lesiones cutáneas.', price: '$800 MXN', tag: 'NUEVO' }
            ],
            analysis: [
                { title: 'Check-up Básico', desc: 'Química sanguínea de 12 elementos.', price: '$650 MXN', tag: 'Oferta' },
                { title: 'Perfil Hormonal', desc: 'Estudio detallado de 6 hormonas clave.', price: '$1,100 MXN', tag: '' }
            ],
            vaccine: [
                { title: 'Refuerzo Estacional', desc: 'Influenza y protección respiratoria.', price: '$350 MXN', tag: 'Temporada' },
                { title: 'Esquema Infantil', desc: 'Seguimiento completo de cartilla nacional.', price: '$950 MXN', tag: 'Vital' }
            ]
        }
    },
    en: {
        step1_text: "Welcome to the Patient Navigator. What is your case today?",
        step2_text: "Based on your case, these are the best options for you:",
        thinking_text: "Analyzing your case...",
        whatsapp_text: "Speak with a specialist",
        book_now: "Book now",
        categories: [
            { id: 'general', label: 'General Consultation / Checkup', keywords: ['checkup', 'general', 'pain', 'discomfort', 'fever'] },
            { id: 'specialty', label: 'Medical Specialties', keywords: ['heart', 'cardiology', 'bones', 'skin', 'specialist'] },
            { id: 'analysis', label: 'Analysis and Laboratory', keywords: ['blood', 'analysis', 'laboratory', 'study', 'exam'] },
            { id: 'vaccine', label: 'Vaccination and Prevention', keywords: ['vaccine', 'covid', 'flu', 'kids', 'prevention'] }
        ],
        solutions: {
            general: [
                { title: 'Family Health Package', desc: 'Complete checkup for 4 people.', price: '$150 USD', tag: 'Popular' },
                { title: 'Express Consultation', desc: 'Immediate care for minor symptoms.', price: '$30 USD', tag: 'Fast' }
            ],
            specialty: [
                { title: 'Cardiology Assessment', desc: 'ECG and specialist consultation.', price: '$80 USD', tag: 'Recommended' },
                { title: 'Medical Dermatology', desc: 'Diagnosis of skin lesions.', price: '$55 USD', tag: 'NEW' }
            ],
            analysis: [
                { title: 'Basic Check-up', desc: '12-element blood chemistry.', price: '$45 USD', tag: 'Sale' },
                { title: 'Hormonal Profile', desc: 'Detailed study of 6 key hormones.', price: '$75 USD', tag: '' }
            ],
            vaccine: [
                { title: 'Seasonal Booster', desc: 'Influenza and respiratory protection.', price: '$25 USD', tag: 'Season' },
                { title: 'Childhood Scheme', desc: 'Full national chart follow-up.', price: '$65 USD', tag: 'Vital' }
            ]
        }
    }
};

function getTranslation(key) {
    const lang = document.documentElement.lang || 'es';
    const current = config[lang] || config['es'];
    const fallback = config['en'];
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

    contentContainer.querySelectorAll('.nav-option-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            const categoryId = btn.getAttribute('data-id');
            const label = btn.innerText;
            showStep2(categoryId, label);
        });
    });
}

function showTypingIndicator() {
    const indicator = document.createElement('div');
    indicator.className = 'message message--bot typing-indicator';
    indicator.id = 'typing-indicator';
    indicator.innerHTML = `<span></span><span></span><span></span>`;
    contentContainer.appendChild(indicator);
    contentContainer.scrollTop = contentContainer.scrollHeight;
}

function removeTypingIndicator() {
    const indicator = document.getElementById('typing-indicator');
    if (indicator) indicator.remove();
}

async function showStep2(categoryId, userChoice) {
    // Add user message
    const userMsg = document.createElement('div');
    userMsg.className = 'message message--user';
    userMsg.innerText = userChoice;
    contentContainer.appendChild(userMsg);
    contentContainer.scrollTop = contentContainer.scrollHeight;

    // Show thinking state
    setTimeout(async () => {
        showTypingIndicator();

        // Simulate delay
        await new Promise(resolve => setTimeout(resolve, 1500));

        removeTypingIndicator();

        const lang = document.documentElement.lang || 'es';
        const langConfig = config[lang] || config['es'];
        const solutions = langConfig.solutions[categoryId] || langConfig.solutions['general'];

        const botResponse = document.createElement('div');
        botResponse.className = 'message message--bot';
        botResponse.innerText = getTranslation('step2_text');
        contentContainer.appendChild(botResponse);

        const solutionsDiv = document.createElement('div');
        solutionsDiv.className = 'navigator-solutions-container';
        solutionsDiv.innerHTML = solutions.map(sol => `
            <div class="solution-card">
                ${sol.tag ? `<span class="solution-card__tag">${sol.tag}</span>` : ''}
                <div class="solution-card__title">${sol.title}</div>
                <div class="solution-card__text">${sol.desc}</div>
                <div class="solution-card__footer">
                    <span class="solution-card__price">${sol.price}</span>
                    <button class="btn btn--dark btn--sm">${getTranslation('book_now')}</button>
                </div>
            </div>
        `).join('');

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
    }, 300);
}

function matchCategory(text) {
    const lang = document.documentElement.lang || 'es';
    const langConfig = config[lang] || config['es'];
    const normalizedText = text.toLowerCase();

    for (const cat of langConfig.categories) {
        if (cat.keywords.some(kw => normalizedText.includes(kw))) {
            return cat;
        }
    }
    return null;
}

function handleUserInput() {
    const text = inputField.value.trim();
    if (!text) return;

    inputField.value = '';
    const matched = matchCategory(text);
    if (matched) {
        showStep2(matched.id, text);
    } else {
        showStep2('general', text);
    }
}

toggle.addEventListener('click', () => {
    const chatWindow = document.getElementById('chatbot-window');
    if (chatWindow) chatWindow.classList.add('chatbot-window--hidden');
    windowClone.classList.toggle('chatbot-window--hidden');
    if (!windowClone.classList.contains('chatbot-window--hidden')) {
        contentContainer.innerHTML = '';
        initStep1();
    }
});

closeBtn.addEventListener('click', () => {
    windowClone.classList.add('chatbot-window--hidden');
});

sendBtn.addEventListener('click', handleUserInput);
inputField.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') handleUserInput();
});

document.getElementById('language-select').addEventListener('change', () => {
    if (!windowClone.classList.contains('chatbot-window--hidden')) {
        contentContainer.innerHTML = '';
        initStep1();
    }
});
