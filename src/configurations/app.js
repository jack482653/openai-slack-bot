const { App } = require("@slack/bolt");
const env = require("./env");

/**
 * Slack App Setting
 * Enable Socket Mode
 * Enable Event Subscriptions
 * OAuth & Permissions: app_mentions:read, chat:write
 * @slack/bolt requires at least NodeJs version 12.13.0
 */
const app = new App({
  token: env.slack.botToken,
  signingSecret: env.slack.signingSecret,
  socketMode: true,
  appToken: env.slack.appToken,
  // Socket Mode doesn't listen on a port, but in case you want your app to respond to OAuth,
  // you still need to listen on some port!
  port: env.port,
});

module.exports = app;
