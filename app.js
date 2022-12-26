/**
 * Slack App Setting
 * Enable Socket Mode
 * Enable Event Subscriptions
 * OAuth & Permissions: app_mentions:read, chat:write
 * @slack/bolt requires at least NodeJs version 12.13.0
 */
const { App } = require("@slack/bolt");
const request = require("request");
require("dotenv").config();
const OPENAI_API_KEY = process.env.OPENAI_API_KEY;
const app = new App({
  token: process.env.SLACK_BOT_TOKEN,
  signingSecret: process.env.SLACK_SIGNING_SECRET,
  socketMode: true,
  appToken: process.env.SLACK_APP_TOKEN,
  // Socket Mode doesn't listen on a port, but in case you want your app to respond to OAuth,
  // you still need to listen on some port!
  port: process.env.PORT || 3000,
});

function callOpenAi(message) {
  return new Promise((resolve, reject) => {
    request.post(
      {
        url: "https://api.openai.com/v1/completions",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${OPENAI_API_KEY}`,
        },
        json: {
          model: "text-davinci-003",
          prompt: message,
          temperature: 0.7,
          max_tokens: 1000,
          top_p: 1,
          frequency_penalty: 0,
          presence_penalty: 0,
        },
      },
      (error, response, body) => {
        if (error) {
          reject(error);
        } else {
          const answer = body.choices[0].text;
          resolve(answer);
        }
      }
    );
  });
}

app.event("app_mention", async ({ event, context, client, say }) => {
  try {
    let answer = await callOpenAi(event.text);
    await say({
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
    console.error(error);
  }
});

(async () => {
  // Start your app
  await app.start();

  console.log("⚡️ Bolt app is running!");
})();
