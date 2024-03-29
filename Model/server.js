const express = require('express');
const nodemailer = require('nodemailer');
const cors = require('cors');
const mongoose = require('mongoose');

const uri = "mongodb+srv://admin:admin123@cluster0.yrh4ica.mongodb.net/WildfireAlerts";
const app = express();
const port = 3000;
app.use(cors())
mongoose.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true }).then(() => console.log('Connected to MongoDB'));
const historySchema = new mongoose.Schema({lat: Number, long: Number, time: Date});
const History = mongoose.model('History', historySchema);
function sendMail(target, lat, long, message) {
 const transporter = nodemailer.createTransport({
    service: "hotmail",
    auth: {
      user: "dodobird126@hotmail.com",
      pass: "dodoroomba@156",
    },
 });

 message = message ? `${message}<p>Latitude: ${lat}</p><p>Longitude: ${long}</p>` : `Wildfire Alert! Latitude: ${lat} Longitude: ${long}`;

 const mailOptions = {
    from: "dodobird126@hotmail.com",
    to: target,
    subject: "Wildfire Alert!",
    html: message
 };

 transporter.sendMail(mailOptions, function (err, info) {
    if (err) {
      console.log(err);
      return;
    }
    console.log("Sent: " + info.response);
 });
}

app.use(express.json());
app.get('/', (req, res) => { res.send('Hello World!'); });

app.post('/send-email', (req, res) => {
 const { target, lat, long, message } = req.body;
 const history = new History({ lat, long, time: new Date()});
  history.save().then(() => console.log('History saved'));
 if (target && lat && long) {
    sendMail(target, lat, long, message);
    res.status(200).json({ "message": 'Email sent successfully!' });
 } else {
    res.status(400).json({ "error": 'Email address, latitude, and longitude are required' });
 }
});

 
app.listen(port, () => {
 console.log(`Server running at http://localhost:${port}`);
});
