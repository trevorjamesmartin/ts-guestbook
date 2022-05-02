import path from 'path';
// ExpressJS
import express from 'express';
import { authRouter, authMiddleware } from './auth-session'
// Local Routes
import { usersRouter, profileRouter } from './users'
import { postsRouter } from './posts';
import configureServer from './configure';

const server = configureServer(express());
// 6. Routes
server.use('/auth', authRouter);
server.use('/api', authMiddleware);
server.use('/api/users', usersRouter);
server.use('/api/profile', profileRouter);
server.use('/api/posts', postsRouter);
// HTML renders SPA from here, (app-wide cache settings)
server.use('/', express.static(path.join(__dirname, "../app/build")));

server.get("*", (req, res) => {
    // * catch-all, reformat as search-params & redirect to SPA
    res.redirect(`/?${req.path}`);
});

export default server;
