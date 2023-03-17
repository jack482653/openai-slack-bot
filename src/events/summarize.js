const app = require("../configurations/app");
const { openAICommand } = require("../configurations/openai");
const { appLogger: logger } = require("../configurations/logger");
const { pagination } = require("../helpers/slack");

app.shortcut("summarize", async ({ shortcut, ack, client }) => {
  logger.debug("/summarize", shortcut);

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
        callback_id: "summarize_submission",
        private_metadata: privateMetadata,
        title: {
          type: "plain_text",
          text: "Summarize",
        },
        blocks: [
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
              text: "Select summarizing in which language:",
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

app.view("summarize_submission", async ({ ack, body, client }) => {
  logger.debug("summarize_submission", body);

  const { private_metadata, state } = body.view;
  const { channelId, threadTs } = JSON.parse(private_metadata);
  const locale =
    state.values["select-lang-input"]["select-lang-action"].selected_option
      .value;

  try {
    await ack();
    // TODO: Too many implementations exposed at app.js, need to refactor
    // Get all replies in the thread
    const replies = await pagination(
      client.conversations.replies,
      {
        channel: channelId,
        ts: threadTs,
      },
      "messages"
    );
    // Construct messages to summarize
    const messages = await Promise.all(
      replies.map(async (message) => {
        // TODO: cache user info to reuse
        const user = await client.users.info({
          user: message.user,
        });
        return `${user.user.profile.real_name}: ${message.text}`;
      })
    );

    const answer = await openAICommand.summarizeConversations(locale, messages);
    const { permalink } = await client.chat.getPermalink({
      channel: channelId,
      message_ts: threadTs,
    });
    await client.chat.postMessage({
      channel: channelId,
      text: `Summary: ${answer}`,
      blocks: [
        {
          type: "section",
          text: {
            type: "mrkdwn",
            text: `Summary: ${answer}\n\n*<${permalink}|Go to original thread>*`,
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
