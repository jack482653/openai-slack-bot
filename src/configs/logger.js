const log4js = require("log4js");
const env = require("./env");

log4js.configure({
  appenders: {
    console: { type: "console" },
  },
  categories: {
    default: {
      appenders: ["console"],
      level: env.logLevel,
    },
  },
});

module.exports = { log4js, appLogger: log4js.getLogger("app") };
