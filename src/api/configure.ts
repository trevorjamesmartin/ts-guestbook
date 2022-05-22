import { Express, json } from 'express';
// import session from 'express-session';
import cors from 'cors';
import helmet from 'helmet';
import hostValidation from 'host-validation';
import contentLength from 'express-content-length-validator';
import bodyParser from 'body-parser';
import hpp from 'hpp';
import ejs from 'ejs';
// import enforcesSSL from 'express-enforces-ssl';

import { session, sessionConfig } from './auth/session'
export const sessionParser = session(sessionConfig);

const MAX_CONTENT_LENGTH_ACCEPTED = 8 ** 8;

const corsMiddleware = cors({
  origin: true,
  credentials: true,
});



export default function configureServer(server: Express) {
  server.use(corsMiddleware);
  server.options('*', corsMiddleware);
  server.engine('html', ejs.renderFile);
  // 1. parse body (sort)
  server.use(bodyParser.urlencoded({ extended: true }))
    // 2. http parameter pollution (guard)
    .use(hpp())
    // 3. large payload attacks (guard)
    .use(contentLength.validateMax({ max: MAX_CONTENT_LENGTH_ACCEPTED }))
    .use(json())
    .use(sessionParser)
    .use(helmet({
      contentSecurityPolicy: false,
      crossOriginEmbedderPolicy: false,
      crossOriginOpenerPolicy: false
    }))

    // Content Security Policy (WARN)
    .use(function (req, res, next) {
      res.setHeader(
        'Content-Security-Policy-Report-Only',
        (process.env.NODE_ENV !== "development" ?

        "default-src 'self';\
        script-src 'report-sample' 'self';\
        style-src 'report-sample' 'self' https://fonts.googleapis.com;\
        object-src 'none';\
        base-uri 'self';\
        connect-src 'self' https://vigilant-s3.s3.amazonaws.com;\
        font-src 'self' https://fonts.gstatic.com;\
        frame-src 'self';\
        img-src 'self' https://vigilant-s3.s3.amazonaws.com;\
        manifest-src 'self';\
        media-src 'self';\
        worker-src 'none';" :

        "default-src http: https: wss:; \
        img-src 'self' data: https:; \
        script-src http: https: 'unsafe-inline'; \
        style-src http https: 'unsafe-inline'; \
        style-src-elem http: https: wss: ws:; \
        connect-src http: https: wss: ws:")
        
      );
      next();
    })

    // origins
    .use(hostValidation({
      hosts: [
        'vigilant-cloud.herokuapp.com',
        '127.0.0.1:3000',
        'localhost:3000',
        'localhost:3001',
        '127.0.0.1:3001',
        'localhost:8080',
        '127.0.0.1:8080',
        'localhost:5000',
        '127.0.0.1:5000',
      ]
    }));
  return server
}
