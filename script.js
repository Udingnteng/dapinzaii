document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('feedback-form');
    const responseMessage = document.getElementById('response-message');
    const thankYouMessage = document.getElementById('thank-you-message');

    form.addEventListener('submit', async (e) => {
        e.preventDefault();

        const name = document.getElementById('name').value;
        const message = document.getElementById('message').value;
        const userAgent = navigator.userAgent;
        let locationInfo = 'Lokasi tidak tersedia';

        // Attempt to get the user's location
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(async (position) => {
                const lat = position.coords.latitude;
                const lon = position.coords.longitude;
                locationInfo = await getLocationName(lat, lon);
                sendFeedback();
            }, () => {
                sendFeedback();
            });
        } else {
            sendFeedback();
        }

        async function getLocationName(lat, lon) {
            try {
                const response = await fetch(`https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lon}&format=json`);
                const data = await response.json();
                const address = data.address || {};
                const city = address.city || address.town || address.village || 'Unknown';
                const state = address.state || 'Unknown';
                const country = address.country_code ? address.country_code.toUpperCase() : 'Unknown';
                return `${city}, ${state}, ${country}`;
            } catch (error) {
                console.error('Error getting location name:', error);
                return 'Lokasi tidak tersedia';
            }
        }

        async function sendFeedback() {
            const payload = {
                content: `**Nama:** ${name}\n**Pesan:** ${message}\n**Perangkat:** ${userAgent}\n**Lokasi:** ${locationInfo}`
            };

            try {
                const response = await fetch('https://discord.com/api/webhooks/1250487185451389038/vr2gBs7BKLWW9mrVl5jLduoTqbj0lvjNhS2k6q5lT3rsz0sbBovuCTAw3OPDScypUzso', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(payload)
                });

                if (response.ok) {
                    responseMessage.classList.add('hidden');
                    thankYouMessage.classList.remove('hidden');

                    // Smoothly hide the thank you message after 15 seconds
                    setTimeout(() => {
                        thankYouMessage.classList.add('fadeOut');
                    }, 15000);
                } else {
                    const errorDetails = await response.text();
                    responseMessage.textContent = `Terjadi kesalahan: ${errorDetails}`;
                    responseMessage.classList.remove('hidden');
                    thankYouMessage.classList.add('hidden');
                }
            } catch (error) {
                responseMessage.textContent = `Terjadi kesalahan: ${error.message}`;
                responseMessage.classList.remove('hidden');
                thankYouMessage.classList.add('hidden');
            }
        }
    });

    // Log Instagram username on page load (if provided in URL)
    const urlParams = new URLSearchParams(window.location.search);
    const instagramUsername = urlParams.get('rrrrdap.1'); // Adjust 'username' to match the actual query parameter

    if (instagramUsername) {
        logInstagramUsername(instagramUsername);
    }

    async function logInstagramUsername(username) {
        try {
            // Log username to backend
            await fetch('https://rizqanaldafin.my.id', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ username })
            });

            // Log username to Discord
            await fetch('https://discord.com/api/webhooks/1250487187489947851/wDyA2tTG6aqE8JKpQ2CvImu7LOzIbx08Vqm_6Z3G5Uw68I9qwFyMums9vNrPfUIml3iw', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    content: `**Instagram Username:** ${username}`
                })
            });

        } catch (error) {
            console.error('Error logging Instagram username:', error);
        }
    }
});
