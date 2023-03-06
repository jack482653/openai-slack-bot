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
  } catch (error) {
    logger.error(error);
  }
});

app.message(async ({ event, say }) => {
  try {
    const id = event.user;
    const answer = await openAICommand.chat(id, event.text, {
      user: id,
    });

    await say(answer);
  } catch (error) {
    logger.error(error);
  }
});

app.command("/fate", async ({ command, ack, say }) => {
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
  } catch (error) {
    logger.error(error);
  }
});

app.command("/gen_image", async ({ command, ack, say }) => {
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
  } catch (error) {
    logger.error(error);
  }
});

(async () => {
  // Start your app
  await app.start();

  logger.log("⚡️ Bolt app is running!");
})();
