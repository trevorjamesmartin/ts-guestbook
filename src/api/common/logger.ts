import path from 'path';
import log4js from "log4js";

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
    rINFO: {
      type: '@log4js-node/redis', channel: `${process.env.REDIS_KEY}/var/log`
    },
    rDEBUG: {
      type: '@log4js-node/redis', channel: `${process.env.REDIS_KEY}/var/log/debug`
    }
  },
  categories: { 
    default: { 
      appenders: ["api", "out", "rINFO"],
      level: "info"
    },
    development: { 
      appenders: ["api", "out", "rDEBUG"],
      level: "debug"
    }
  }
});

const logger = log4js.getLogger("api");
logger.level = "debug";

export default logger;
