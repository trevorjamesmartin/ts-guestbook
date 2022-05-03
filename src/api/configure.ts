// Middleware
import { Express, json } from 'express';
import session from 'express-session';
import cors from 'cors';
import helmet from 'helmet';
import hostValidation from 'host-validation';
import contentLength from 'express-content-length-validator';
import bodyParser from 'body-parser';
import hpp from 'hpp';
// import enforcesSSL from 'express-enforces-ssl';
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

export default function(server:Express) {
    // const server = express();
    server.use(corsMiddleware);
    server.options('*', corsMiddleware);
    // 0. allow protocol
    // server.use(enforcesSSL());
    // 0. allow origins
    server.use(hostValidation({
        hosts: [
            '127.0.0.1:3000',
            'localhost:3000',
            'localhost:3001',
            '127.0.0.1:3001',
            'localhost:8080',
            '127.0.0.1:8080',
        ]
    }));
    // 1. parse body (sort)
    server.use(bodyParser.urlencoded({extended: true}))
    // 2. http parameter pollution (guard)
    .use(hpp())
    // 3. large payload attacks (guard)
    .use(contentLength.validateMax({ max: MAX_CONTENT_LENGTH_ACCEPTED }))
    // 4. Enable All CORS Requests
    // 4.2 authorized session (optional)
    .use(json())
    .use(sessionParser)
    // // 5. Security with HTTP headers
    .use(helmet())
    return server
}

