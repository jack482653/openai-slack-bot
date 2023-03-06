const log4js = require("log4js");

log4js.configure({
  appenders: {
    console: { type: "console" },
  },
  categories: {
    default: { appenders: ["console"], level: "info" },
  },
});

module.exports = log4js;
