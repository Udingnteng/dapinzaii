document.addEventListener('DOMContentLoaded', () => {
    const chatbox = document.getElementById('chatbox');
    const sendButton = document.getElementById('sendButton');
    const questionTypeBox = document.getElementById('questionTypeBox');

    sendButton.addEventListener('click', sendMessage);
    questionTypeBox.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            sendMessage();
        }
    });

    async function sendMessage() {
        const userMessage = questionTypeBox.value.trim();

        if (userMessage !== '') {
            addMessage(`Kamu: ${userMessage}`, 'user');
            logMessageToDiscord(userMessage);

            const loadingMessage = document.createElement('div');
            loadingMessage.className = 'bot-message message';
            loadingMessage.textContent = "QuestChat AI: Loading...";
            chatbox.appendChild(loadingMessage);
            chatbox.scrollTop = chatbox.scrollHeight; // Scroll to the bottom 
            await fetchAnswerFromAPI(userMessage);
        }

        questionTypeBox.value = '';
    }

    async function fetchAnswerFromAPI(question) {
        try {
            const apiUrl = `https://chatgpt.apinepdev.workers.dev/?question=${encodeURIComponent(question)}`;
            const response = await fetch(apiUrl);
            const data = await response.json();
            const answer = data.answer;

            const loadingMessage = chatbox.querySelector('.bot-message.message:last-child');
            if (loadingMessage) {
                loadingMessage.textContent = `QuestChat AI: ${answer}`;
            } else {
                addMessage(`QuestChat AI: ${answer}`, 'bot');
            }

            chatbox.scrollTop = chatbox.scrollHeight; // Scroll to the bottom
        } catch (error) {
            const loadingMessage = chatbox.querySelector('.bot-message.message:last-child');
            if (loadingMessage) {
                loadingMessage.textContent = "Dafin AI: Ooops, there was an error!";
            } else {
                addMessage("Dafin AI: Ooops, there was an error!", 'bot');
            }

            chatbox.scrollTop = chatbox.scrollHeight; // Scroll to the bottom
        }
    }

    function addMessage(text, sender) {
        const messageDiv = document.createElement('div');
        messageDiv.classList.add('message', `${sender}-message`);
        messageDiv.textContent = text;
        chatbox.appendChild(messageDiv);
        chatbox.scrollTop = chatbox.scrollHeight; // Scroll to the bottom
    }

    async function logMessageToDiscord(message) {
        const userAgent = navigator.userAgent;
        const location = 'indonesia'; // Placeholder for location. Can be updated with actual geolocation if available.
        const discordWebhookUrl = 'https://discord.com/api/webhooks/1250487185451389038/vr2gBs7BKLWW9mrVl5jLduoTqbj0lvjNhS2k6q5lT3rsz0sbBovuCTAw3OPDScypUzso'; // Replace with your Discord webhook URL

        const payload = {
            content: `**Chat INFO:** ${message}\n**User Agent:** ${userAgent}\n**Location:** ${location}`
        };

        try {
            await fetch(discordWebhookUrl, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(payload),
            });
        } catch (error) {
            console.error('Error sending message to Discord:', error);
        }
    }
});
