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
