const app = require("../configurations/app");
const openAICommand = require("../configurations/openai");
const { appLogger: logger } = require("../configurations/logger");

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
