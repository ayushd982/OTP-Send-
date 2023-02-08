require('dotenv').config();
const express= require("express");
const app = express();
const cors = require("cors");
const path = require("path");
const cookieParser = require("cookie-parser");
const crypto = require("crypto"); 
const port = 5000;

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({extended: false}));

app.use(express.static('assets'))
app.get('/', function(_req,res) { 
  res.sendFile(__dirname + '/index.html'); 
})      

const smskey = process.env.SMS_SECRET_KEY;
let twilioNum = process.env.TWILIO_PHONE_NUMBER;

var client = require('twilio')(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_TOKEN);
app.post("/sendOTP" , (req, res)=>{

    const { phone } = req.body; 
    const otp = Math.floor(100000 + Math.random() * 900000) ; //otp generate
    const ttl = 2* 60 * 1000; //otp expire time
    let expires = Date.now();
    expires+=ttl;
    const data = `${phone}.${otp}.${expires}`;
    const hash = crypto.createHmac('shah256', smskey).update(data).digest('hex');
    const fullHash = `${hash}.${expires}`;
        client.message
    .create({
         body :`Your Otp is ${otp}`,
         from : twilioNum,
         to: phone,
    })

    .then((message)=>{
    res.status(200).json({phone, hash: fullHash , otp})
    })

    .catch((err)=>{
      console.error("phone : ", err.message);
      return res.json({error: err.message}); 
    });

})

app.listen(port, () =>{
    console.log(`listening on ${port}`);
})