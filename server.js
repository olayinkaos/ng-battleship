var express = require('express');
var bodyParser = require('body-parser');
const path = require('path');
var Pusher = require('pusher');
const crypto = require("crypto");

var app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

// to serve our JavaScript, CSS and index.html
app.use(express.static('./dist/'));

app.all('/*', function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "*");
  next();
 });


var pusher = new Pusher({
    appId: 'YOUR_APP_ID',
    key: 'YOUR_APP_KEY',
    secret: 'YOUR_APP_SECRET',
    cluster: 'YOUR_APP_CLUSTER',
    encrypted: true
});

app.post('/pusher/auth', function(req, res) {
  var socketId = req.body.socket_id;
  var channel = req.body.channel_name;
  var presenceData = {
    user_id: crypto.randomBytes(16).toString("hex")
  };
  var auth = pusher.authenticate(socketId, channel, presenceData);
  res.send(auth);
});

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'dist/index.html'));
});

var port = process.env.PORT || 3000;
app.listen(port, () => console.log('Listening at http://localhost:3000'));
