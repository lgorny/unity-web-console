var express = require('express');
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var bodyParser = require('body-parser');

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

http.listen(8080, function(){
  console.log('listening on *:8080');
});
