const app = require("#configs/app");
const { appLogger: logger } = require("#configs/logger");
const { openAICommand, getContentBuilderInstance } = require("#configs/openai");

app.message(async ({ event, say }) => {
  try {
    const content = await getContentBuilderInstance()
      .setText(event.text)
      .setFiles(event.files)
      .build();
    logger.debug("generated content", content);

    const id = event.user;
    const answer = await openAICommand.chat(id, content, {
      user: id,
    });

    await say(answer);

    logger.debug("message completed");
  } catch (error) {
    logger.error(error);

    await say("Oops, something went wrong 😭. Please try again later.");
  }
});
