const { Configuration, OpenAIApi } = require("openai");
const Cache = require("../Cache");
const config = require("../config");

const configuration = new Configuration({
  apiKey: config.openAI.apiKey,
});
const openAIApi = new OpenAIApi(configuration);
const cache = new Cache();

module.exports = {
  cache,
  openAIApi,
};
