const models = require("#models/models");
const providers = require("#models/providers");

const getInt = (key, defaultValue) => {
  const value = process.env[key];
  if (value === undefined) {
    return defaultValue;
  }
  return parseInt(value);
};

const getOpenAIAuth = (provider) => {
  switch (provider) {
    case providers.AZURE:
      return {
        apiType: "azure",
        basePath: `${process.env.OPENAI_AZURE_AUTH_API_BASE}/openai/deployments/${process.env.OPENAI_AZURE_AUTH_DEPLOYMENT_NAME}`,
        apiVersion: process.env.OPENAI_AZURE_AUTH_API_VERSION,
        apiKey: process.env.OPENAI_AZURE_AUTH_API_KEY,
      };
    case providers.OPENAI:
      return {
        basePath:
          process.env.OPENAI_OPENAI_AUTH_BASE_PATH ||
          "https://api.openai.com/v1",
        apiKey: process.env.OPENAI_OPENAI_AUTH_API_KEY,
      };
    default:
      // for backward compatibility of old env settings
      return {
        apiKey: process.env.OPENAI_API_KEY,
      };
  }
};

const getEnv = (config = {}) => {
  require("dotenv").config(config);

  const provider = process.env.OPENAI_PROVIDER;

  return {
    port: getInt("PORT", 3000),
    logLevel: process.env.LOG_LEVEL || "info",
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
      provider,
      auth: getOpenAIAuth(provider),
      chat: {
        model: process.env.OPENAI_CHAT_MODEL || models.GPT_3_5_TURBO,
        enableSummarize: process.env.OPENAI_CHAT_ENABLE_SUMMARIZE === "true",
        numOfMessages: getInt("OPENAI_CHAT_NUM_OF_MESSAGES", 2),
        ttl: getInt("OPENAI_CHAT_TTL", null),
        systemMessage: process.env.OPENAI_CHAT_SYSTEM_MESSAGE,
      },
    },
  };
};

module.exports = {
  ...getEnv(),
  getEnv,
};
