const app = require("../configurations/app");
const { openAICommand } = require("../configurations/openai");
const { appLogger: logger } = require("../configurations/logger");

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
