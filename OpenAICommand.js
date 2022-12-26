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
    const response = await this.openAIApi.createImage({
      prompt: prompt,
      n: 1,
      size: "512x512",
    });

    return response.data.data[0].url;
  }
}

module.exports = {
  openAIApi,
  OpenAICommand,
};
