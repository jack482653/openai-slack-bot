const axios = require("axios");
const env = require("./env");

const instance = axios.create({
  headers: { Authorization: `Bearer ${env.slack.botToken}` },
});

module.exports = instance;
