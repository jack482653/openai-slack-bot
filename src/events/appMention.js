const env = require("@configs/env");
const app = require("@configs/app");
const openAICommand = require("@configs/openai");
const { appLogger: logger } = require("@configs/logger");

app.event("app_mention", async ({ event, say }) => {
  logger.debug("app_mention", event);

  try {
    const id = `${event.channel}_${event.user}`;
    const answer = await openAICommand.chat(id, event.text, {
      user: id,
    });
    const userTextWithQuote = event.text
      .split("\n")
      .map((w) => `>${w}`)
      .join("\n");
    const answerText = env.slack.appMention.quoteUserMessage
      ? `<@${event.user}>\n${userTextWithQuote}\n${answer}`
      : `<@${event.user}> ${answer}`;

    await say({
      text: answer,
      blocks: [
        {
          type: "section",
          text: {
            type: "mrkdwn",
            text: answerText,
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
