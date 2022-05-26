import path from 'path';
import log4js from "log4js";
log4js.configure({
  appenders: { 
    api: { 
      type: "file", filename: path.join(process.cwd(), "db/api.log")
    }
  },
  categories: { 
    default: { 
      appenders: ["api"],
      level: "info"
    },
    development: { 
      appenders: ["api"], 
      level: "debug" 
    }
  }
});

const logger = log4js.getLogger("api");
logger.level = "debug";

export default logger;
