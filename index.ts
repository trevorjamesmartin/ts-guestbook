import express from 'express';
import httpServer, { io } from './src/api/server';
import { sessionParser } from './src/api/configure';

try {
    require('dotenv').config();
} catch {
    console.log('[production mode]');
}

const map = new Map();

function broadcastGlobal(message: string) {
    console.log(map.keys())
    for (let username of map.keys()) {
        let client = map.get(username);
        client.send(message);
    }
}

io.use((socket, next) => {
    let req = socket.request as express.Request;
    let res = req.res as express.Response;
    sessionParser(req, res, next as express.NextFunction);
});

io.on('connection', function (socket) {
    const req = socket.request as express.Request;
    req.session.loggedIn = true;
    req.session.save();
    map.set(req.session.username, socket);
    socket.on('disconnect', () => {
        map.delete(req.session.username);
        req.session.loggedIn = false;
        req.session.save();
        console.log(req.session.username, 'disconnected', socket.id);
    });
})

io.on('message', function (message) {
    console.log(message)
});

httpServer.on('upgrade', function (request: any, socket, head) {
    let response: any = {};
    sessionParser(request, response, () => {
        if (!request.session.userId) {
            console.log("session errror, HTTP://1.1 401 Unauthorized");
            socket.write('HTTP://1.1 401 Unauthorized\r\n\r\n');
            socket.destroy();
            return;
        }
        console.log(`${request.session.username} => upgrade`);
    });
});

const PORT = process.env.PORT || 8080
httpServer.listen(process.env.PORT, function () {
    console.log(`-- listening on ${PORT}`);
});

