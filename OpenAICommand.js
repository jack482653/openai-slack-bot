const { Configuration, OpenAIApi } = require("openai");
require("dotenv").config();

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});
export const openAIApi = new OpenAIApi(configuration);

export class OpenAICommand extends Command {
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

    return completion.choices[0].text;
  }
}
