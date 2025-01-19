const OpenAI = require("openai");
const axios = require("./axios");
const cache = require("./cache");
const env = require("./env");
const { log4js } = require("./logger");
const OpenAICommand = require("#models/OpenAICommand");
const providers = require("#models/providers");
const models = require("#models/models");
const modelTypes = require("#models/modelTypes");
const OpenAIChatPlainContentBuilder = require("#models/OpenAIChatPlainContentBuilder");
const OpenAIChatMultiContentBuilder = require("#models/OpenAIChatMultiContentBuilder");

const logger = log4js.getLogger("openai");

const getConfig = (provider, auth) => {
  switch (provider) {
    case providers.AZURE:
      return {
        apiKey: auth.apiKey,
        baseURL: auth.basePath,
        defaultHeaders: { "api-key": auth.apiKey },
        defaultQuery: {
          "api-version": auth.apiVersion,
        },
      };
    case providers.OPENAI:
      return {
        apiKey: auth.apiKey,
        baseURL: auth.basePath,
      };
    default:
      return {
        apiKey: auth.apiKey,
      };
  }
};

const getChatContentBuilder = (openAIConfig) => {
  // Only use multi content builder if
  // 1. multi is enabled and
  // 2. the model is a vision model
  const isMulti =
    openAIConfig.chat.enableMulti &&
    models.isMatchType(openAIConfig.chat.model, modelTypes.VISION);

  isMulti && logger.log("Enable Multimodal chat");

  return () => {
    if (isMulti) {
      return new OpenAIChatMultiContentBuilder({ httpClient: axios });
    }

    return new OpenAIChatPlainContentBuilder();
  };
};

const openAIApi = new OpenAI(getConfig(env.openAI.provider, env.openAI.auth));

const openAICommand = new OpenAICommand(openAIApi, cache, env.openAI);

module.exports = {
  openAICommand,
  getContentBuilderInstance: getChatContentBuilder(env.openAI),
};
