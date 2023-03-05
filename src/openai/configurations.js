const { Configuration, OpenAIApi } = require("openai");
const Cache = require("../Cache");
require("dotenv").config();

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});
const openAIApi = new OpenAIApi(configuration);
const cache = new Cache();

module.exports = {
  cache,
  openAIApi,
};
