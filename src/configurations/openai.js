const OpenAI = require("openai");
const cache = require("./cache");
const env = require("./env");
const OpenAICommand = require("#models/OpenAICommand");
const providers = require("#models/providers");

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

const openAIApi = new OpenAI(getConfig(env.openAI.provider, env.openAI.auth));

const openAICommand = new OpenAICommand(openAIApi, cache, env.openAI);

module.exports = openAICommand;
