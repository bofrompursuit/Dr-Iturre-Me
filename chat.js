/**
 * Chatbot Logic for Dr. Iturre Website
 * Powered by Gemini API with Mock Fallback
 */

const toggle = document.getElementById('chatbot-toggle');
const windowClone = document.getElementById('chatbot-window');
const closeBtn = document.getElementById('chatbot-close');
const sendBtn = document.getElementById('chatbot-send');
const inputField = document.getElementById('chatbot-input-field');
const messagesContainer = document.getElementById('chatbot-messages');

const API_KEY = import.meta.env.VITE_GEMINI_API_KEY;
const API_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${API_KEY}`;

const suggestionsContainer = document.getElementById('chatbot-suggestions');

const chatbotConfig = {
    es: {
        suggestions: ["Servicios", "Ubicación", "Citas", "Precios"],
        responses: {
            services: "Ofrecemos consulta general, especialidades (cardiología, dermatología), análisis clínicos y vacunación. ¿Te interesa algún servicio en específico?",
            location: "Nuestra clínica se encuentra en Av. Principal #123, Ciudad. Atendemos de Lunes a Sábado de 8:00 AM a 8:00 PM.",
            contact: "Puedes llamarnos al +52 123 456 7890 o enviarnos un WhatsApp directamente desde el botón verde arriba.",
            booking: "Para agendar tu cita, puedes usar el Navegador del Paciente (icono de brújula) o decirme qué día y hora prefieres.",
            prices: "Los precios varían según el servicio. Las consultas generales inician desde $450 MXN. ¿Quieres ver el detalle de algún paquete?",
            thanks: "¡De nada! Estoy aquí para ayudarte. Si tienes más dudas, solo escribe.",
            default: "Soy el asistente virtual de la clínica del Dr. Iturre. Puedo darte información sobre servicios, ubicación, citas y precios. ¿Qué necesitas saber?"
        }
    },
    en: {
        suggestions: ["Services", "Location", "Appointments", "Prices"],
        responses: {
            services: "We offer general consultation, specialties (cardiology, dermatology), clinical analysis, and vaccination. Are you interested in a specific service?",
            location: "Our clinic is located at 123 Main Ave, City. We are open Monday to Saturday from 8:00 AM to 8:00 PM.",
            contact: "You can call us at +52 123 456 7890 or send us a WhatsApp message using the green button above.",
            booking: "To schedule an appointment, you can use the Patient Navigator (compass icon) or tell me your preferred date and time.",
            prices: "Prices vary by service. General consultations start at $30 USD. Would you like to see details for a specific package?",
            thanks: "You're welcome! I'm here to help. If you have more questions, just ask.",
            default: "I am Dr. Iturre's virtual assistant. I can provide info about services, location, appointments, and prices. What do you need to know?"
        }
    }
};

function initSuggestions() {
    const lang = document.documentElement.lang || 'es';
    const config = chatbotConfig[lang] || chatbotConfig['es'];

    suggestionsContainer.innerHTML = config.suggestions.map(s => `
        <button class="suggestion-chip">${s}</button>
    `).join('');

    suggestionsContainer.querySelectorAll('.suggestion-chip').forEach(chip => {
        chip.addEventListener('click', () => {
            inputField.value = chip.innerText;
            sendMessage();
        });
    });
}

function getMockResponse(text) {
    const lang = document.documentElement.lang || 'es';
    const config = chatbotConfig[lang] || chatbotConfig['es'];
    const input = text.toLowerCase();

    if (input.includes('servici') || input.includes('service')) return config.responses.services;
    if (input.includes('ubicaci') || input.includes('donde') || input.includes('location') || input.includes('where')) return config.responses.location;
    if (input.includes('cita') || input.includes('reserv') || input.includes('appointment') || input.includes('book')) return config.responses.booking;
    if (input.includes('preci') || input.includes('costo') || input.includes('price') || input.includes('cost')) return config.responses.prices;
    if (input.includes('gracia') || input.includes('thank')) return config.responses.thanks;
    if (input.includes('hola') || input.includes('hi ') || input.includes('hello')) return config.responses.default;

    return config.responses.default;
}

async function sendMessage() {
    const text = inputField.value.trim();
    if (!text) return;

    addMessage(text, 'user');
    inputField.value = '';

    // Hide suggestions during chat
    suggestionsContainer.style.display = 'none';

    // Show typing indicator
    const typingId = showTypingIndicator();

    // Try Gemini API first
    if (API_KEY && API_KEY.startsWith('AIza')) {
        try {
            const response = await fetch(API_URL, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    contents: [{
                        parts: [{
                            text: `Brief assistant for Dr. Iturre clinic. Lang: ${document.documentElement.lang}. User: ${text}`
                        }]
                    }]
                })
            });

            if (response.ok) {
                const data = await response.json();
                removeMessage(typingId);
                addMessage(data.candidates[0].content.parts[0].text, 'bot');
                return;
            }
        } catch (e) {
            console.warn("Gemini API Error, using mock:", e);
        }
    }

    // Fallback to Mock
    await new Promise(r => setTimeout(r, 1000));
    removeMessage(typingId);
    addMessage(getMockResponse(text), 'bot');
}

function showTypingIndicator() {
    const id = Date.now();
    const indicator = document.createElement('div');
    indicator.className = 'message message--bot typing-indicator';
    indicator.id = `typing-${id}`;
    indicator.innerHTML = `<span></span><span></span><span></span>`;
    messagesContainer.appendChild(indicator);
    messagesContainer.scrollTop = messagesContainer.scrollHeight;
    return id;
}

function addMessage(text, sender) {
    const msg = document.createElement('div');
    msg.className = `message message--${sender}`;
    msg.innerText = text;
    messagesContainer.appendChild(msg);
    messagesContainer.scrollTop = messagesContainer.scrollHeight;
}

function removeMessage(id) {
    const msg = document.getElementById(`typing-${id}`);
    if (msg) msg.remove();
}

toggle.addEventListener('click', () => {
    const navWindow = document.getElementById('navigator-window');
    if (navWindow) navWindow.classList.add('chatbot-window--hidden');

    const isHidden = windowClone.classList.contains('chatbot-window--hidden');
    windowClone.classList.toggle('chatbot-window--hidden');

    if (isHidden) {
        suggestionsContainer.style.display = 'flex';
        initSuggestions();
    }
});

closeBtn.addEventListener('click', () => {
    windowClone.classList.add('chatbot-window--hidden');
});

sendBtn.addEventListener('click', sendMessage);
inputField.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') sendMessage();
});

document.getElementById('language-select').addEventListener('change', () => {
    if (!windowClone.classList.contains('chatbot-window--hidden')) {
        initSuggestions();
    }
});
