const { Configuration, OpenAIApi } = require("openai");
const Cache = require("../models/Cache");
const OpenAICommand = require("../models/OpenAICommand");
const env = require("./env");

const configuration = new Configuration({
  apiKey: env.openAI.apiKey,
});
const openAIApi = new OpenAIApi(configuration);
const cache = new Cache();
const openAICommand = new OpenAICommand(openAIApi, cache, env.openAI);

module.exports = {
  cache,
  openAIApi,
  openAICommand,
};
