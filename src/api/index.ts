import path from 'path';
// ExpressJS
import express from 'express';

// Middleware
import session from 'express-session';
import cors from 'cors';
import helmet from 'helmet';
import hostValidation from 'host-validation';
import contentLength from 'express-content-length-validator';
import bodyParser from 'body-parser';
import hpp from 'hpp';
// import enforcesSSL from 'express-enforces-ssl';

// Local Routes
import { usersRouter, profileRouter } from './users'

// authorized sessions
import { sessionConfig, authRouter, authMiddleware } from './auth-session'
const MAX_CONTENT_LENGTH_ACCEPTED = 9999; 
const corsConfig = {
    origin: true,
    credentials: true,
};

export const sessionParser = session(sessionConfig);

const corsMiddleware = cors(corsConfig);
// (init)
const app = express();
app.use(corsMiddleware);
app.options('*', corsMiddleware);

// 0. allow protocol
// app.use(enforcesSSL());
// 0. allow origins
app.use(hostValidation({
    hosts: [
        '127.0.0.1:3000',
        'localhost:3000',
        'localhost:3001',
        '127.0.0.1:3001',
        'localhost:8080',
        '127.0.0.1:8080',
    ]
}))
// 1. parse body (sort)
.use(bodyParser.urlencoded({extended: true}))
// 2. http parameter pollution (guard)
.use(hpp())
// 3. large payload attacks (guard)
.use(contentLength.validateMax({ max: MAX_CONTENT_LENGTH_ACCEPTED }))
// 4. Enable All CORS Requests
// 4.2 authorized session (optional)
.use(express.json())
.use(sessionParser)
// // 5. Security with HTTP headers
.use(helmet())
// 6. Routes
// .use('/', webRoutes)
.use('/auth', authRouter)
.use('/api', authMiddleware)
.use('/api/users', usersRouter)
.use('/api/profile', profileRouter)
// HTML renders SPA from here, (app-wide cache settings)
.use('/', express.static(path.join(__dirname, "../app/build")));
app.get("*", (req, res) => {
    // * catch-all, reformat as search-params & redirect to SPA
    res.redirect(`/?${req.path}`);
});
export default app;
