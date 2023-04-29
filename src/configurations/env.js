require("dotenv").config();

const getInt = (key, defaultValue) => {
  const value = process.env[key];
  if (value === undefined) {
    return defaultValue;
  }
  return parseInt(value);
};

module.exports = {
  port: getInt("PORT", 3000),
  slack: {
    botToken: process.env.SLACK_BOT_TOKEN,
    signingSecret: process.env.SLACK_SIGNING_SECRET,
    appToken: process.env.SLACK_APP_TOKEN,
    appMention: {
      quoteUserMessage:
        process.env.SLACK_APP_MENTION_QUOTE_USER_MESSAGE === "true",
    },
  },
  openAI: {
    apiKey: process.env.OPENAI_API_KEY,
    chat: {
      model: process.env.OPENAI_CHAT_MODEL,
      enableSummarize: process.env.OPENAI_CHAT_ENABLE_SUMMARIZE === "true",
      numOfMessages: getInt("OPENAI_CHAT_NUM_OF_MESSAGES", 2),
      ttl: getInt("OPENAI_CHAT_TTL", null),
      systemMessage: process.env.OPENAI_CHAT_SYSTEM_MESSAGE,
    },
  },
};
