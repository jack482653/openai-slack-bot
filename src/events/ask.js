const app = require("../configurations/app");
const cache = require("../configurations/cache");
const openAICommand = require("../configurations/openai");
const { appLogger: logger } = require("../configurations/logger");
const { getThreadMessages } = require("../helpers/slack");

app.shortcut("ask", async ({ shortcut, ack, client }) => {
  logger.debug("/ask", shortcut);

  const channelId = shortcut.channel.id;
  const threadTs = shortcut.message.thread_ts ?? shortcut.message.ts;
  const privateMetadata = JSON.stringify({ channelId, threadTs });

  try {
    // Acknowledge shortcut request
    await ack();

    // Call the views.open method using one of the built-in WebClients
    await client.views.open({
      trigger_id: shortcut.trigger_id,
      view: {
        type: "modal",
        callback_id: "ask_submission",
        private_metadata: privateMetadata,
        title: {
          type: "plain_text",
          text: "Ask",
        },
        blocks: [
          {
            type: "input",
            block_id: "ask-input",
            element: {
              type: "plain_text_input",
              multiline: true,
              action_id: "ask-input-action",
            },
            label: {
              type: "plain_text",
              text: "Ask a question about the thread:",
              emoji: true,
            },
          },
          {
            type: "input",
            block_id: "select-lang-input",
            element: {
              type: "radio_buttons",
              options: [
                {
                  text: {
                    type: "plain_text",
                    text: "Traditional Chinese",
                    emoji: true,
                  },
                  value: "zh-TW",
                },
                {
                  text: {
                    type: "plain_text",
                    text: "English",
                    emoji: true,
                  },
                  value: "en",
                },
              ],
              action_id: "select-lang-action",
            },
            label: {
              type: "plain_text",
              text: "Select response in which language:",
              emoji: true,
            },
          },
        ],
        submit: {
          type: "plain_text",
          text: "Submit",
        },
      },
    });
  } catch (error) {
    logger.error(error);

    await client.chat.postMessage({
      channel: channelId,
      text: "Oops, something went wrong to summarize thread 😭. Please try again later.",
    });
  }
});

app.view("ask_submission", async ({ ack, body, client }) => {
  logger.debug("ask_submission", body);

  const { private_metadata, state } = body.view;
  const { channelId, threadTs } = JSON.parse(private_metadata);
  const question = state.values["ask-input"]["ask-input-action"].value;
  const locale =
    state.values["select-lang-input"]["select-lang-action"].selected_option
      .value;

  try {
    await ack();
    const messages = await getThreadMessages(channelId, threadTs, {
      client,
      cache,
    });
    const answer = await openAICommand.askQuestionInTheThread(
      locale,
      question,
      messages
    );
    const { permalink } = await client.chat.getPermalink({
      channel: channelId,
      message_ts: threadTs,
    });
    await client.chat.postMessage({
      channel: channelId,
      text: `Question: ${question}\nAnswer: ${answer}`,
      blocks: [
        {
          type: "section",
          text: {
            type: "mrkdwn",
            text: `Question: ${question}\nAnswer: ${answer}\n\n*<${permalink}|Go to original thread>*`,
          },
        },
      ],
    });

    logger.debug("/summarize completed");
  } catch (error) {
    logger.error(error);

    await client.chat.postMessage({
      channel: channelId,
      text: "Oops, something went wrong to summarize thread 😭. Please try again later.",
    });
  }
});
