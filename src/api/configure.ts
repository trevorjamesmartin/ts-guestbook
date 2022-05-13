// Middleware
import { Express, json } from 'express';
import session from 'express-session';
import cors from 'cors';
import helmet from 'helmet';
import hostValidation from 'host-validation';
import contentLength from 'express-content-length-validator';
import bodyParser from 'body-parser';
import hpp from 'hpp';
import ejs from 'ejs';
// import enforcesSSL from 'express-enforces-ssl';
// authorized sessions
import { sessionConfig } from './auth-session'
const MAX_CONTENT_LENGTH_ACCEPTED = 8 ** 8;
const corsConfig = {
  origin: true,
  credentials: true,
};

export const sessionParser = session(sessionConfig);

const corsMiddleware = cors(corsConfig);
// (init)
// const S3BUCKET_URL = 'https://vigilant-s3.s3.amazonaws.com'
// const LOCAL8080 = 'http://localhost:8080'
// const HOST = 'https://vigilant-cloud.herokuapp.com'
// const WEBSOCKET = 'ws://localhost:8080'
// const SECURE_WEBSOCKET = 'wss://vigilant-cloud.herokuapp.com'
// const WEB_RESOURCES = `${S3BUCKET_URL} ${LOCAL8080} ${HOST} ${SECURE_WEBSOCKET} ${WEBSOCKET}`
//   `default-src 'self'; font-src 'self' *; img-src 'self' ${WEB_RESOURCES}; script-src 'self' ${WEB_RESOURCES}; style-src 'self' https://fonts.googleapis.com https://cdn.jsdelivr.net/npm/bootstrap@4.5.3/dist/css/bootstrap.min.css; frame-src 'self'; connect-src ${WEB_RESOURCES}`
export default function (server: Express) {
  // const server = express();
  server.use(corsMiddleware);
  server.options('*', corsMiddleware);
  server.engine('html', ejs.renderFile);
  // 0. allow protocol
  // server.use(enforcesSSL());
  // Content Security Policy (WARN)
  server.use(function (req, res, next) {
    res.setHeader(
      'Content-Security-Policy-Report-Only',
      (process.env.NODE_ENV !== "development" ? 

      "Content-Security-Policy: \
        default-src https: wss:; \
        img-src 'self' data: https:; \
        script-src https: 'unsafe-inline'; \
        style-src https: 'unsafe-inline'; \
        style-src-elem https: wss:; \
        connect-src https: wss:" :
      
      "Content-Security-Policy: \
        default-src http: https: wss:; \
        img-src 'self' data: https:; \
        script-src http: https: 'unsafe-inline'; \
        style-src http https: 'unsafe-inline'; \
        style-src-elem http: https: wss: ws:; \
        connect-src http: https: wss: ws:")
    );
    next();
  });
  // 0. allow origins
  server.use(hostValidation({
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
  // 1. parse body (sort)
  server.use(bodyParser.urlencoded({ extended: true }))
    // 2. http parameter pollution (guard)
    .use(hpp())
    // 3. large payload attacks (guard)
    .use(contentLength.validateMax({ max: MAX_CONTENT_LENGTH_ACCEPTED }))
    // 4. Enable All CORS Requests
    // 4.2 authorized session (optional)
    .use(json())
    .use(sessionParser)
    // // 5. Security with HTTP headers
    .use(helmet({
      contentSecurityPolicy: false,
      crossOriginEmbedderPolicy: false,
      crossOriginOpenerPolicy: false
    })
    );
  return server
}

