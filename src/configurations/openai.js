const { Configuration, OpenAIApi } = require("openai");
const cache = require("./cache");
const env = require("./env");
const OpenAICommand = require("#models/OpenAICommand");
const providers = require("#models/providers");

const getConfig = (provider, auth) => {
  switch (provider) {
    case providers.AZURE:
      return {
        apiKey: auth.apiKey,
        basePath: auth.basePath,
        baseOptions: {
          headers: { "api-key": auth.apiKey },
          params: {
            "api-version": auth.apiVersion,
          },
        },
      };
    case providers.OPENAI:
      return {
        apiKey: auth.apiKey,
        basePath: auth.basePath,
      };
    default:
      return {
        apiKey: auth.apiKey,
      };
  }
};

const configuration = new Configuration(
  getConfig(env.openAI.provider, env.openAI.auth)
);
const openAIApi = new OpenAIApi(configuration);
const openAICommand = new OpenAICommand(openAIApi, cache, env.openAI);

module.exports = openAICommand;
