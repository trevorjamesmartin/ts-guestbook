import path from 'path';
import express from 'express';
import { authRouter, authMiddleware } from './auth'
import { usersRouter, profileRouter } from './users'
import { postsRouter } from './posts';
import { connectRouter, friendsRouter } from './social';
import { feedRouter } from './feed';
import awsRouter from './aws/router';

const REACTION = '../app/build';

export default function(server:express.Express) {

    server.use('/auth', authRouter);
    server.use('/api', authMiddleware);
    server.use('/api/users', usersRouter);
    server.use('/api/profile', profileRouter);
    server.use('/api/posts', postsRouter);
    server.use('/api/connect', connectRouter);
    server.use('/api/friends', friendsRouter);
    server.use('/api/feed', feedRouter);
    server.use('/api/aws', awsRouter);
    server.use('/socket.io', function(_, __, next) {next()})
    server.use('/', express.static(path.join(__dirname, REACTION)));
    server.get("*", (_, res) => {
        res.sendFile(path.join(__dirname, REACTION, "index.html"));
    });
    return server;
}
