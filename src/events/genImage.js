const app = require("#configs/app");
const { openAICommand } = require("#configs/openai");
const { appLogger: logger } = require("#configs/logger");

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
