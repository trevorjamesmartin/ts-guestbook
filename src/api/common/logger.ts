import path from 'path';
import log4js from "log4js";

// function parseRedisURL() {
//   let n = process.env?.REDIS_URL?.split('://').pop()?.split(':').length;
//   let REDIS_HOST: any;
//   let REDIS_PASSWORD: any;
//   let REDIS_PORT = Number(process.env?.REDIS_URL?.split(':').pop() || '6379');
//   switch (n) {
//     case 2:
//       REDIS_HOST = process.env?.REDIS_URL?.split('://').pop()?.split(':').shift();
//       break;
//     case 3:
//       try {
//         let [a, b]: any = process.env?.REDIS_URL?.split('://')?.pop()?.split(':')[1]?.split('@');
//         REDIS_PASSWORD = a;
//         REDIS_HOST = b;
//       } catch (e) {
//         console.log(e);
//         REDIS_HOST = process.env?.REDIS_URL?.split('://')?.pop();
//       }
//       return { REDIS_HOST, REDIS_PORT, REDIS_PASSWORD }

//     default:
//       break;
//   }
//   return { REDIS_HOST, REDIS_PORT }
// };

// const { REDIS_HOST, REDIS_PORT, REDIS_PASSWORD } = parseRedisURL();


log4js.configure({
  appenders: {
    out: {
      type: "stdout",
      layout: {
        type: 'pattern',
        // api[INFO]: message
        pattern: '%[%c%]%[[%p]:%] %[ %m %] '
      }
    },
    api: {
      type: "file", filename: path.join(process.cwd(), "db/api.log")
    },
    // rINFO: {
    //   type: '@log4js-node/redis', channel: `${process.env.REDIS_KEY}/var/log`,
    //   host: REDIS_HOST, port: REDIS_PORT, pass: REDIS_PASSWORD
    // },
    // rDEBUG: {
    //   type: '@log4js-node/redis', channel: `${process.env.REDIS_KEY}/var/log/debug`,
    //   host: REDIS_HOST, port: REDIS_PORT, pass: REDIS_PASSWORD
    // }
  },
  categories: {
    default: {
      appenders: ["api", "out"],
      level: "info"
    },
    development: {
      appenders: ["api", "out"],
      level: "debug"
    }
  }
});

const logger = log4js.getLogger("api");
logger.level = "debug";

export default logger;
