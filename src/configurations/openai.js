const { Configuration, OpenAIApi } = require("openai");
const cache = require("./cache");
const OpenAICommand = require("../models/OpenAICommand");
const env = require("./env");

const configuration = new Configuration({
  apiKey: env.openAI.apiKey,
  basePath: "https://oai.hconeai.com/v1",
});
const openAIApi = new OpenAIApi(configuration);
const openAICommand = new OpenAICommand(openAIApi, cache, env.openAI);

module.exports = openAICommand;
