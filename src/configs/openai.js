const { Configuration, OpenAIApi } = require("openai");
const cache = require("./cache");
const env = require("./env");
const OpenAICommand = require("@models/OpenAICommand");

const configuration = new Configuration({
  apiKey: env.openAI.apiKey,
  basePath: "https://oai.hconeai.com/v1",
});
const openAIApi = new OpenAIApi(configuration);
const openAICommand = new OpenAICommand(openAIApi, cache, env.openAI);

module.exports = openAICommand;
