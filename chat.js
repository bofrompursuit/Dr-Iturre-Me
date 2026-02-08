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

// Mock Data for demonstration purposes
const mockResponses = {
    es: {
        services: "Ofrecemos consulta general, especialidades, análisis clínicos y vacunación. ¿Te gustaría saber más sobre alguno de estos?",
        contact: "Puedes contactarnos por teléfono al +52 123 456 7890 o visitarnos en Av. Principal #123. También puedes escribirnos por WhatsApp.",
        location: "Estamos ubicados en Av. Principal #123, Ciudad. ¡Te esperamos!",
        booking: "Para agendar una cita, puedes presionar el botón 'Reservar' en la sección de servicios o enviarnos un mensaje por WhatsApp.",
        default: "Entiendo. Soy un asistente virtual para la clínica del Dr. Iturre. ¿Cómo puedo ayudarte con nuestros servicios médicos?"
    },
    en: {
        services: "We offer general consultation, specialties, clinical analysis, and vaccination. Would you like to know more about any of these?",
        contact: "You can reach us at +52 123 456 7890 or visit us at 123 Main Ave. You can also write to us via WhatsApp.",
        location: "We are located at 123 Main Ave, City. We look forward to seeing you!",
        booking: "To schedule an appointment, you can click the 'Book Now' button in the services section or send us a WhatsApp message.",
        default: "I understand. I am a virtual assistant for Dr. Iturre's clinic. How can I help you with our medical services?"
    },
    pt: {
        services: "Oferecemos consulta geral, especialidades, análises clínicas e vacinação. Gostaria de saber mais sobre algum deles?",
        contact: "Você pode nos contatar pelo telefone +52 123 456 7890 ou nos visitar na Av. Principal #123. Você também pode nos escrever pelo WhatsApp.",
        location: "Estamos localizados na Av. Principal #123, Cidade. Esperamos por você!",
        booking: "Para agendar uma consulta, você pode clicar no botão 'Reservar' na seção de serviços ou nos enviar uma mensagem pelo WhatsApp.",
        default: "Entendo. Sou um assistente virtual para a clínica do Dr. Iturre. Como posso ajudar você com nossos serviços médicos?"
    },
    zh: {
        services: "我们提供全科咨询、专科、临床分析和疫苗接种。您想了解其中任何一项吗？",
        contact: "您可以致电 +52 123 456 7890 或前往 城市主干道 123 号 访问我们。您也可以通过 WhatsApp 联系我们。",
        location: "我们位于 城市主干道 123 号。我们期待您的光临！",
        booking: "要预约，您可以点击服务部分的“预订”按钮或向我们发送 WhatsApp 消息。",
        default: "我明白。我是 Iturre 医生诊室的虚拟助手。我能为您提供哪些医疗服务方面的帮助？"
    },
    fr: {
        services: "Nous proposons des consultations générales, des spécialités, des analyses cliniques et des vaccinations. Souhaitez-vous en savoir plus sur l'un d'entre eux ?",
        contact: "Vous pouvez nous joindre au +52 123 456 7890 ou nous rendre visite au Av. Principale #123. Vous pouvez également nous écrire via WhatsApp.",
        location: "Nous sommes situés au Av. Principale #123, Ville. Nous avons hâte de vous voir !",
        booking: "Pour prendre rendez-vous, vous pouvez cliquer sur le bouton 'Réserver' dans la section services ou nous envoyer un message WhatsApp.",
        default: "Je comprends. Je suis un assistant virtuel pour la clinique du Dr Iturre. Comment puis-je vous aider avec nos services médicaux ?"
    }
};

// Toggle window visibility
toggle.addEventListener('click', () => {
    const navWindow = document.getElementById('navigator-window');
    if (navWindow) navWindow.classList.add('chatbot-window--hidden');
    windowClone.classList.toggle('chatbot-window--hidden');
});

closeBtn.addEventListener('click', () => {
    windowClone.classList.add('chatbot-window--hidden');
});

// Get mock response based on text and language
function getMockResponse(text, lang) {
    const input = text.toLowerCase();
    const responses = mockResponses[lang] || mockResponses['es'];

    if (input.includes('servici') || input.includes('service')) return responses.services;
    if (input.includes('contact') || input.includes('teléfon') || input.includes('phone') || input.includes('whatsapp')) return responses.contact;
    if (input.includes('ubicaci') || input.includes('donde') || input.includes('location') || input.includes('where') || input.includes('direcci')) return responses.location;
    if (input.includes('cita') || input.includes('reserv') || input.includes('appointment') || input.includes('book')) return responses.booking;

    return responses.default;
}

// Send message logic
async function sendMessage() {
    const text = inputField.value.trim();
    if (!text) return;

    const currentLang = document.documentElement.lang || 'es';

    // Add user message to UI
    addMessage(text, 'user');
    inputField.value = '';

    // Show typing indicator
    const typingId = addMessage('...', 'bot');

    // Artificial delay for realism
    await new Promise(resolve => setTimeout(resolve, 1000));

    // Try Gemini API, fall back to mock if failed or no key
    if (API_KEY && !API_KEY.includes('AIzaSy')) { // Very basic check
        try {
            const response = await fetch(API_URL, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    contents: [{
                        parts: [{
                            text: `You are a helpful virtual assistant for Dr. Iturre's medical practice. 
                            Provide concise, professional, and friendly answers about medical services, consultations, and products.
                            Current user language: ${currentLang}.
                            User message: ${text}`
                        }]
                    }]
                })
            });

            if (!response.ok) throw new Error('API request failed');

            const data = await response.json();
            const botResponse = data.candidates[0].content.parts[0].text;

            removeMessage(typingId);
            addMessage(botResponse, 'bot');
            return;
        } catch (error) {
            console.warn('Falling back to mock data due to API error:', error);
        }
    }

    // Mock Fallback
    const mockMsg = getMockResponse(text, currentLang);
    removeMessage(typingId);
    addMessage(mockMsg, 'bot');
}

function addMessage(text, sender) {
    const messageDiv = document.createElement('div');
    messageDiv.className = `message message--${sender}`;
    messageDiv.innerText = text;
    messagesContainer.appendChild(messageDiv);
    messagesContainer.scrollTop = messagesContainer.scrollHeight;

    const id = Date.now() + Math.random();
    messageDiv.dataset.id = id;
    return id;
}

function removeMessage(id) {
    const msg = messagesContainer.querySelector(`[data-id="${id}"]`);
    if (msg) msg.remove();
}

sendBtn.addEventListener('click', sendMessage);
inputField.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') sendMessage();
});
