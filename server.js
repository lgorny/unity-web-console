const config = require("./config");

const express = require('express');
const app = express();
const http = require('http').Server(app);
const io = require('socket.io')(http);
const bodyParser = require('body-parser');

app.use(express.static('public_html'));
app.use(bodyParser.urlencoded({ extended: true })); // for parsing application/x-www-form-urlencoded

app.post('/log', onNewLog);

io.on('connection', function(socket){
  console.log('a user connected');
});

function onNewLog(req, res)
{
  console.log(req.body);
  io.emit("log", JSON.stringify(req.body));
  res.sendStatus(200);
}

http.listen(config.SERVER_PORT, config.SERVER_IP, function(){
  console.log( "Listening on " + config.SERVER_IP + ":" + config.SERVER_PORT );
});
