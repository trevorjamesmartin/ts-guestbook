import apiServer from './src/api/server';
import { sessionParser } from './src/api/configure';
// import { WebSocketServer } from 'ws';
import { Server } from "socket.io";
import http from 'http';

try {
    require('dotenv').config();
} catch {
    console.log('[production mode]');
}

const httpServer = http.createServer(apiServer);

const io = new Server(httpServer, {
    // options
});

const map = new Map();

httpServer.on('upgrade', function (request: any, socket, head) {
    let response: any = {};
    sessionParser(request, response, () => {
        console.log('CHECK')
        if (!request.session.userId) {
            console.log("session errror, HTTP://1.1 401 Unauthorized");
            socket.write('HTTP://1.1 401 Unauthorized\r\n\r\n');
            socket.destroy();
            return;
        }
        console.log(`${request.session.username} => upgrade`);
        
        io.on("connection", (socket) => {
            console.log('a user connected',request.session.username, socket.id);
            map.set(request.session.userId, socket);
            socket.on('disconnect', () => {
                map.delete(request.session.userId);
                console.log('user disconnected', request.session.username, socket.id);
            });
            console.log(map.keys())
        });
    });
});

const PORT = process.env.PORT || 8080
httpServer.listen(process.env.PORT, function () {
    console.log(`-- listening on ${PORT}`);
});

// const wss = new WebSocketServer({
//     // port: 8080,
//     clientTracking: false,
//     noServer: true,

//     perMessageDeflate: {
//         zlibDeflateOptions: {
//             // See zlib defaults.
//             chunkSize: 1024,
//             memLevel: 7,
//             level: 3
//         },
//         zlibInflateOptions: {
//             chunkSize: 10 * 1024
//         },
//         // Other options settable:
//         clientNoContextTakeover: true, // Defaults to negotiated value.
//         serverNoContextTakeover: true, // Defaults to negotiated value.
//         serverMaxWindowBits: 10, // Defaults to negotiated value.
//         // Below options specified as default values.
//         concurrencyLimit: 10, // Limits zlib concurrency for perf.
//         threshold: 1024 // Size (in bytes) below which messages
//         // should not be compressed if context takeover is disabled.
//     }

// });


// server.on('upgrade', function (request: any, socket, head) {
//     // console.log('Parsing session from request');
//     let response: any = {};
//     sessionParser(request, response, () => {
//         if (!request.session.userId) {
//             socket.write('HTTP://1.1 401 Unauthorized\r\n\r\n');
//             socket.destroy();
//             return;
//         }
//         console.log(`${request.session.username} => upgrade`);
//         wss.handleUpgrade(request, socket, head, function (ws) {
//             wss.emit('connection', ws, request);
//         });
//     });
// });

// function broadcastGlobal(ws:any, message:string) {
//     for (let sessionId of map.keys()) {
//         let socket = map.get(sessionId);
//         socket.send(message);
//     }
// }

// wss.on('connection', function (ws, request: any) {
//     // we can now use session parameters
//     const userId = request.session.userId;
//     const username = request.session.username;

//     map.set(userId, ws);

//     ws.on('message', function (message) {
//         let text = message.toString();
//         switch (text) {
//             case "MainPage":
//                 console.log(`${username} -> /app `);
//                 ws.send(`hello ${username}`);
//                 broadcastGlobal(ws, `${username} CONNECTED`)
//                 break;
//             default:
//                 console.log(`${username} -> ${text}`);
//                 break;
//         }
//     });

//     ws.on('close', function () {
//         map.delete(userId);
//     });

// });

// TODO: socket.io or setup pingback

// setInterval(() => {
//     wss.clients?.forEach((client) => {
//       client.send(new Date().toTimeString());
//     });
// }, 1000);
