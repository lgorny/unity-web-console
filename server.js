const config = require("./config");

const express = require('express');
const app = express();
const http = require('http').Server(app);
const io = require('socket.io')(http);
const bodyParser = require('body-parser');
const url = require('url');

app.use(express.static('public_html'));
app.use(bodyParser.urlencoded({
    extended: true
})); // for parsing application/x-www-form-urlencoded

app.post('/log', onNewLog);
app.get('/session/:id', function (req, res) {
    console.log(req.params.id);
    res.sendFile(__dirname + '/public_html/index.html');
});

io.on('connection', function (socket) {
    var u = url.parse(socket.handshake.headers.referer);
    var path = u.pathname.split("/");
    path = cleanArray(path);

    if (path.length == 2) {
        if (path[0] == "session") {
            socket.join(path[1].toLowerCase());
            return;
        }
    }

    socket.disconnect(true);
});

function onNewLog(req, res) {
    io.to(req.body.id.toLowerCase()).emit("log", JSON.stringify(req.body));
    res.sendStatus(200);
}

http.listen(config.SERVER_PORT, config.SERVER_IP, function () {
    console.log("Listening on " + config.SERVER_IP + ":" + config.SERVER_PORT);
});

function cleanArray(actual) {
    var newArray = new Array();
    for (var i = 0; i < actual.length; i++) {
        if (actual[i]) {
            newArray.push(actual[i]);
        }
    }
    return newArray;
}
