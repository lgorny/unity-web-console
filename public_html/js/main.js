var LogType = {
    Error: "/img/error.png",
    Assert: "/img/log.png",
    Warning: "/img/warning.png",
    Log: "/img/log.png",
    Exception: "/img/error.png"
};

var UnityWebConsole = {
    logs: [],
    logsCount: 0,
    maxLogsDisplayed: 1000,
    logsContainer: null,
    selectedLog: null,

    onDOMContentLoaded: function () {
        UnityWebConsole.initSocket();

        UnityWebConsole.logsContainer = document.getElementById("logs");
        UnityWebConsole.logsContainer.scrollTop = UnityWebConsole.logsContainer.scrollHeight;
    },

    initSocket: function () {
        UnityWebConsole.socket = io();
        UnityWebConsole.socket.on("log", UnityWebConsole.onLog);
    },

    addLog: function (msg, stack, type) {

        if (UnityWebConsole.logs.length >= UnityWebConsole.maxLogsDisplayed) {
            UnityWebConsole.logs.shift();
            UnityWebConsole.logsContainer.removeChild(UnityWebConsole.logsContainer.childNodes[0]);
        }

        var scrollToBottom = false;
        if (UnityWebConsole.logsContainer.scrollHeight - UnityWebConsole.logsContainer.scrollTop <= UnityWebConsole.logsContainer.clientHeight)
            scrollToBottom = true;

        var log = document.createElement("button");

        if (UnityWebConsole.logsCount % 2 == 1)
            log.className = "log second";
        else
            log.className = "log";

        var imageContainer = document.createElement("p");
        imageContainer.className = "log-icon";
        var image = document.createElement("img");
        image.src = LogType[type];
        imageContainer.appendChild(image);

        var message = document.createElement("p");
        message.innerHTML = msg + "<br>" + stack.split("\n")[0];
        message.className = "log-message";

        log.appendChild(imageContainer);
        log.appendChild(message);
        log.addEventListener("click", UnityWebConsole.onLogClick);

        UnityWebConsole.logsContainer.appendChild(log);

        UnityWebConsole.logs.push({
            m: msg,
            s: stack,
            t: type
        });

        if (scrollToBottom)
            UnityWebConsole.logsContainer.scrollTop = UnityWebConsole.logsContainer.scrollHeight;

        UnityWebConsole.logsCount++;
    },

    onLog: function (data) {
        var dataParsed = JSON.parse(data);
        UnityWebConsole.addLog(dataParsed.m, dataParsed.s, dataParsed.t);
    },

    onLogClick: function (e) {
        if (UnityWebConsole.selectedLog)
            UnityWebConsole.selectedLog.className = UnityWebConsole.selectedLog.className.replace(" select", "");

        UnityWebConsole.selectedLog = e.currentTarget;
        UnityWebConsole.selectedLog.className += " select";
    }
};

document.addEventListener("DOMContentLoaded", UnityWebConsole.onDOMContentLoaded);
