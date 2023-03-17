const app = require("../configurations/app");
const { openAICommand } = require("../configurations/openai");
const { appLogger: logger } = require("../configurations/logger");

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
