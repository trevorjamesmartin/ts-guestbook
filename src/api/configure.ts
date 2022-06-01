import path from 'path';
import { Express, json } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import hostValidation from 'host-validation';
import contentLength from 'express-content-length-validator';
import bodyParser from 'body-parser';
import hpp from 'hpp';
import ejs from 'ejs';
// import enforcesSSL from 'express-enforces-ssl';
import swaggerUi from 'swagger-ui-express';
import swaggerJsdoc from 'swagger-jsdoc';
import logger from './common/logger';
import log4js from 'log4js';
import favicon from 'serve-favicon';

const MAX_CONTENT_LENGTH_ACCEPTED = 8 ** 8;
const PORT = process.env.PORT || undefined;
const corsMiddleware = cors({
  origin: true,
  credentials: true,
});
// swagger
const options = {
  swaggerDefinition: {
    openapi: "3.0.0",
    info: {
      title: "Conversation API",
      version: "1.0.0",
      description: "talk amongst yourselves",
      license: {
        name: "MIT",
        url: "https://choosealicense.com/licenses/mit/"
      },
      contact: {
        name: "source code",
        url: "https://github.com/trevorjamesmartin/ts-guestbook",
      },
    },
    servers: [
      process.env.NODE_ENV === "docker" ?
      {
        url: `http://localhost${PORT ? ':' + PORT : ''}/api`,
        description: "development server",
      } :
      __filename.split('.').pop() === 'js' ?
      {
        url: `https://ts-guestbook.herokuapp.com/api`,
        description: "Heroku App",
      } :
      {
        url: `http://localhost${PORT ? ':' + PORT : ''}/api`,
        description: "development server",
      },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'apiKey',
          name: 'Authorization',
          in: 'header',
        }
      }
    },
    security: [{
      bearerAuth: []
    }]
  },
  apis: [
    __filename,
    // typescript or javascript
    path.join(process.cwd(), 'src/api/auth', `*.${__filename.split('.').pop()}`),
    path.join(process.cwd(), 'src/api/aws', `*.${__filename.split('.').pop()}`),
    path.join(process.cwd(), 'src/api/feed', `*.${__filename.split('.').pop()}`),
    path.join(process.cwd(), 'src/api/posts', `*.${__filename.split('.').pop()}`),
    path.join(process.cwd(), 'src/api/social', `*.${__filename.split('.').pop()}`),
    path.join(process.cwd(), 'src/api/users', `*.${__filename.split('.').pop()}`),
  ],
};


const openapiSpecification = swaggerJsdoc(options);


export default function configureServer(server: Express) {
  logger.debug('⚙ server');

  server.use(corsMiddleware);
  server.options('*', corsMiddleware);
  server.engine('html', ejs.renderFile);
  server.use(favicon(path.join(process.cwd(), 'src/app/build', 'favicon.ico')));
  // 1. parse body (sort)
  server.use(bodyParser.urlencoded({ extended: true }))
    // 2. http parameter pollution (guard)
    .use(hpp())
    // 3. large payload attacks (guard)
    .use(contentLength.validateMax({ max: MAX_CONTENT_LENGTH_ACCEPTED }))
    .use(json())
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
        img-src * 'self' data: https://vigilant-s3.s3.amazonaws.com;\
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
        'ts-guestbook.herokuapp.com',
        '127.0.0.1:3000',
        'localhost:3000',
        'localhost:3001',
        '127.0.0.1:3001',
        'localhost:8080',
        '127.0.0.1:8080',
        '0.0.0.0:8080',
        '0.0.0.0',
        'localhost:5000',
        '127.0.0.1:5000',
        "172.17.0.2:8080"
      ]
    }));

  // openapi
  server.use('/swagger', swaggerUi.serve, swaggerUi.setup(openapiSpecification));

  server.use(log4js.connectLogger(log4js.getLogger("http"), { level: 'auto' }));
  return server
}
