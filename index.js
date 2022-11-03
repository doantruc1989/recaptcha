const express = require("express");
const bodyParser = require('body-parser');
const fetch = require('node-fetch');
const { stringify } = require('querystring');
const app = express();

app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.get('/', (req, res) => res.sendFile(__dirname + '/index.html'));

app.post('/subscribe', async (req, res) => {
    if (!req.body.captcha) {
        return res.json({ success: false, msg: 'Please select captcha' });
    }
    const secretKey = '6Lf049UiAAAAACl7eNAtKWVAqqGNI3lPYyarTzJ_';
    const query = stringify({
        secret: secretKey,
        response: req.body.captcha,
        remoteip: req.socket.remoteAddress
    });
    console.log(query)
    const verifyURL = `https://google.com/recaptcha/api/siteverify?${query}`;
    const body = await fetch(verifyURL).then(res => res.json());
    if (body.success !== undefined && !body.success) {
        return res.json({ success: false, msg: 'Failed captcha verification' });
    } else {
        return res.json({ success: true, msg: 'Captcha passed' });
    }
});

app.listen(3000, () => console.log('Server started on port 3000'));