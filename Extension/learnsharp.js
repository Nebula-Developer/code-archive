const loadScriptXML = (src) => {
    return new Promise((resolve, reject) => {
        var connect = new XMLHttpRequest();
        connect.open('GET', src, true);

        connect.onload = () => {
            if (connect.status == 200) {
                resolve(connect.responseText);
                return;
            } else {
                reject(connect.statusText);
                return;
            }
        }

        connect.send();
    });
}

const loadScriptJq = (src, jQuery) => {
    return new Promise((resolve, reject) => {
        jQuery.get(src, (data) => {
            resolve(data);
            return;
        });
    });
}

function loadScripts() {
    loadScriptXML('http://localhost:8080/jquery').then((jQuery_dat) => {
        var jqF = new Function(jQuery_dat + "; return jQuery;");
        var jQuery = jqF();

        // Load socket.io
        loadScriptJq('https://cdnjs.cloudflare.com/ajax/libs/socket.io/4.5.3/socket.io.js', jQuery).then((socketio_dat) => {
            var sioF = new Function(socketio_dat + "; return io;");
            var socketIO = sioF();

            // Finally, load the main script.
            loadScriptJq('http://localhost:8080/', jQuery).then((main_dat) => {
                var mainF = new Function(main_dat + "; return init;");
                var initF = mainF();
                initF(chrome);
            });
        });
    });
}


loadScripts();