/**
 * Slack App Setting
 * Enable Socket Mode
 * Enable Event Subscriptions
 * OAuth & Permissions: app_mentions:read, chat:write
 * @slack/bolt requires at least NodeJs version 12.13.0
 */
const { App } = require("@slack/bolt");
const config = require("./config");
const { cache, openAIApi } = require("./openai/configurations");
const OpenAICommand = require("./openai/OpenAICommand");
const logger = require("./logger").getLogger("app");

const app = new App({
  token: config.slack.botToken,
  signingSecret: config.slack.signingSecret,
  socketMode: true,
  appToken: config.slack.appToken,
  // Socket Mode doesn't listen on a port, but in case you want your app to respond to OAuth,
  // you still need to listen on some port!
  port: config.port,
});
const openAICommand = new OpenAICommand(openAIApi, cache, config.openAI);

app.event("app_mention", async ({ event, say }) => {
  logger.debug("app_mention", event);

  try {
    const id = `${event.channel}_${event.user}`;
    const answer = await openAICommand.chat(id, event.text, {
      user: id,
    });

    await say({
      text: answer,
      blocks: [
        {
          type: "section",
          text: {
            type: "mrkdwn",
            text: `<@${event.user}> ${answer}`,
          },
        },
      ],
    });

    logger.debug("app_mention completed");
  } catch (error) {
    logger.error(error);

    await say("Oops, something went wrong 😭. Please try again later.");
  }
});

app.message(async ({ event, say }) => {
  logger.debug("message", event);

  try {
    const id = event.user;
    const answer = await openAICommand.chat(id, event.text, {
      user: id,
    });

    await say(answer);

    logger.debug("message completed");
  } catch (error) {
    logger.error(error);

    await say("Oops, something went wrong 😭. Please try again later.");
  }
});

app.command("/fate", async ({ command, ack, say }) => {
  logger.debug("/fate", command);

  try {
    await ack(); // Acknowledge command request
    const answer = await openAICommand.tellMeMyFate();

    await say({
      blocks: [
        {
          type: "section",
          text: {
            type: "mrkdwn",
            text: `<@${command.user_id}> ${answer}`,
          },
        },
      ],
    });

    logger.debug("/fate completed");
  } catch (error) {
    logger.error(error);

    await say("Oops, something went wrong 😭. Please try again later.");
  }
});

app.command("/gen_image", async ({ command, ack, say }) => {
  logger.debug("/gen_image", command);

  try {
    await ack(); // Acknowledge command request
    const base64Str = await openAICommand.generateImage(command.text);
    const buffer = Buffer.from(base64Str, "base64");
    await say({
      blocks: [
        {
          type: "section",
          text: {
            type: "mrkdwn",
            text: `<@${command.user_id}> ${command.text}`,
          },
        },
      ],
    });
    await app.client.files.upload({
      channels: command.channel_id,
      file: buffer,
      filename: "image.png",
      filetype: "auto",
      title: command.text,
    });

    logger.debug("/gen_image completed");
  } catch (error) {
    logger.error(error);

    await say("Oops, something went wrong 😭. Please try again later.");
  }
});

async function shutdown() {
  const timeout = setTimeout(() => {
    logger.error("Stop server timed out, force exit");
    process.exit(1);
  }, 3000);
  logger.log("Stopping server ...");
  await app.stop();
  clearTimeout(timeout);
  process.exit(0);
}

process.on("SIGTERM", shutdown);
process.on("SIGINT", shutdown);
process.on("SIGBREAK", shutdown);
process.on("unhandledRejection", (error) => {
  logger.error("Unhandled rejection: ", error);
  process.exit(1);
});

(async () => {
  // Start your app
  await app.start();

  logger.log("⚡️ Bolt app is running!");
  logger.log("log level: ", logger.level);
})();
