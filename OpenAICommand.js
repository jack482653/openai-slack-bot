const { Configuration, OpenAIApi } = require("openai");
require("dotenv").config();

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});
const openAIApi = new OpenAIApi(configuration);

class OpenAICommand {
  constructor(openAIApi) {
    this.openAIApi = openAIApi;
  }

  async createCompletion(prompt) {
    const completion = await this.openAIApi.createCompletion({
      model: "text-davinci-003",
      prompt: prompt,
      temperature: 0.7,
      max_tokens: 1000,
      top_p: 1,
      frequency_penalty: 0,
      presence_penalty: 0,
    });

    return completion.data.choices[0].text;
  }

  async generateImage(prompt) {
    const res = await this.openAIApi.createImage({
      prompt: prompt,
      n: 1,
      size: "512x512",
      response_format: "b64_json",
    });

    return res.data.data[0].b64_json;
  }
}

module.exports = {
  openAIApi,
  OpenAICommand,
};
