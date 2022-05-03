import apiServer from './src/api/server';
import { sessionParser } from './src/api/configure';
import { WebSocketServer } from 'ws';
import http from 'http';

try {
    require('dotenv').config();
} catch {
    console.log('[production mode]');
}

const server = http.createServer(apiServer);

const map = new Map();

const wss = new WebSocketServer({
    // port: 8080,
    clientTracking: false,
    noServer: true,

    perMessageDeflate: {
        zlibDeflateOptions: {
            // See zlib defaults.
            chunkSize: 1024,
            memLevel: 7,
            level: 3
        },
        zlibInflateOptions: {
            chunkSize: 10 * 1024
        },
        // Other options settable:
        clientNoContextTakeover: true, // Defaults to negotiated value.
        serverNoContextTakeover: true, // Defaults to negotiated value.
        serverMaxWindowBits: 10, // Defaults to negotiated value.
        // Below options specified as default values.
        concurrencyLimit: 10, // Limits zlib concurrency for perf.
        threshold: 1024 // Size (in bytes) below which messages
        // should not be compressed if context takeover is disabled.
    }

});

server.on('upgrade', function (request: any, socket, head) {
    // console.log('Parsing session from request');
    let response: any = {};
    sessionParser(request, response, () => {
        if (!request.session.userId) {
            socket.write('HTTP://1.1 401 Unauthorized\r\n\r\n');
            socket.destroy();
            return;
        }
        console.log(`${request.session.username} => upgrade`);
        wss.handleUpgrade(request, socket, head, function (ws) {
            wss.emit('connection', ws, request);
        });
    });
});

function broadcastGlobal(ws:any, message:string) {
    for (let sessionId of map.keys()) {
        let socket = map.get(sessionId);
        if (!socket) {
            return
        }
        if (socket !== ws) {
            socket.send(message);
        } else {
            socket.send("ok");
        }
    }
}

wss.on('connection', function (ws, request: any) {
    // we can now use session parameters
    const userId = request.session.userId;
    const username = request.session.username;

    map.set(userId, ws);

    ws.on('message', function (message) {
        let text = message.toString();
        switch (text) {
            case "MainPage":
                console.log(`${username} -> /app `);
                // ws.send(`hello ${username}`);
                broadcastGlobal(ws, `welcome ${username}`)
                break;
            default:
                console.log(`${username} -> ${text}`);
                break;
        }
    });

    ws.on('close', function () {
        map.delete(userId);
    });

});

server.listen(8080, function () {
    console.log('listening @ http://127.0.0.1:8080')
});
