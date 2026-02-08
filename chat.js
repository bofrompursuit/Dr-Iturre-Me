/**
 * Chatbot Logic for Dr. Iturre Website
 * Powered by Gemini API
 */

const toggle = document.getElementById('chatbot-toggle');
const windowClone = document.getElementById('chatbot-window'); // window is a reserved word
const closeBtn = document.getElementById('chatbot-close');
const sendBtn = document.getElementById('chatbot-send');
const inputField = document.getElementById('chatbot-input-field');
const messagesContainer = document.getElementById('chatbot-messages');

const API_KEY = import.meta.env.VITE_GEMINI_API_KEY;
const API_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${API_KEY}`;

// Toggle window visibility
toggle.addEventListener('click', () => {
    windowClone.classList.toggle('chatbot-window--hidden');
});

closeBtn.addEventListener('click', () => {
    windowClone.classList.add('chatbot-window--hidden');
});

// Send message logic
async function sendMessage() {
    const text = inputField.value.trim();
    if (!text) return;

    // Add user message to UI
    addMessage(text, 'user');
    inputField.value = '';

    // Show typing indicator (simple)
    const typingId = addMessage('...', 'bot');

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
                        If you don't know the answer, suggest contacting the clinic via WhatsApp.
                        Current user language: ${document.documentElement.lang || 'es'}.
                        User message: ${text}`
                    }]
                }]
            })
        });

        const data = await response.json();
        const botResponse = data.candidates[0].content.parts[0].text;
        
        // Remove typing indicator and add bot response
        removeMessage(typingId);
        addMessage(botResponse, 'bot');
    } catch (error) {
        console.error('Error calling Gemini API:', error);
        removeMessage(typingId);
        addMessage('Lo siento, hubo un error al procesar tu mensaje. Por favor intenta más tarde o contáctanos por WhatsApp.', 'bot');
    }
}

function addMessage(text, sender) {
    const messageDiv = document.createElement('div');
    messageDiv.className = `message message--${sender}`;
    messageDiv.innerText = text;
    messagesContainer.appendChild(messageDiv);
    messagesContainer.scrollTop = messagesContainer.scrollHeight;
    
    // Return a unique ID if we need to remove it later (e.g., typing indicator)
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
