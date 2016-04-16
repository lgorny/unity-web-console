var UnityWebConsole = {
  logs: [],
  logsContainer: null,

  onDOMContentLoaded: function() {
    UnityWebConsole.initSocket();

    UnityWebConsole.logsContainer = document.getElementById("logs");
    UnityWebConsole.logsContainer.scrollTop = UnityWebConsole.logsContainer.scrollHeight;
  },

  initSocket: function() {
    UnityWebConsole.socket = io();
    UnityWebConsole.socket.on("log", UnityWebConsole.onLog);
  },

  addLog: function(msg, stack, type) {

    var scrollToBottom = false;
    if(UnityWebConsole.logsContainer.scrollHeight - UnityWebConsole.logsContainer.scrollTop <= UnityWebConsole.logsContainer.clientHeight)
      scrollToBottom = true;

    var log = document.createElement("button");

    if(UnityWebConsole.logs.length % 2 == 1)
      log.className = "log second"
    else
      log.className = "log"

    var imageContainer = document.createElement("p");
    imageContainer.className = "log-icon";
    var image = document.createElement("img");
    image.src = "img/error.png";
    imageContainer.appendChild(image);

    var message = document.createElement("p");
    message.innerHTML = msg + "<br>" + stack.split("\n")[0];
    message.className = "log-message";

    log.appendChild(imageContainer);
    log.appendChild(message);
    log.addEventListener("click", function(e){e.currentTarget.className = "log select";});
    document.getElementById('logs').appendChild(log);

    UnityWebConsole.logs.push(log);

    if(scrollToBottom)
      UnityWebConsole.logsContainer.scrollTop = UnityWebConsole.logsContainer.scrollHeight;
  },

  onLog: function(data) {
    console.log(data);

    var dataParsed = JSON.parse(data);
    UnityWebConsole.addLog(dataParsed.m, dataParsed.s, dataParsed.t);
  }
};

document.addEventListener("DOMContentLoaded", UnityWebConsole.onDOMContentLoaded);
