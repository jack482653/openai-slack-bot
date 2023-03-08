const roles = require("./roles");
const logger = require("../logger").getLogger("OpenAICommand");

class OpenAICommand {
  constructor(openAIApi, cache, config) {
    this.openAIApi = openAIApi;
    this.cache = cache;
    this.config = config;
  }

  async createCompletion(prompt, options) {
    const completion = await this.openAIApi.createCompletion({
      model: "text-davinci-003",
      prompt: prompt,
      temperature: 0.7,
      max_tokens: 1000,
      top_p: 1,
      frequency_penalty: 0,
      presence_penalty: 0,
      ...options,
    });

    return completion.data.choices[0].text;
  }

  async chat(id, message, options) {
    // get last messages from cache
    let lastMessages = this.cache.get(id) ?? [];
    lastMessages = [...lastMessages, { role: roles.USER, content: message }];
    // consider response from OpenAI, we keep only the last N - 1 messages
    lastMessages = lastMessages.slice(-this.getNumOfMessages() + 1);

    const systemMessages = this.config.chat.systemMessage
      ? [
          {
            role: roles.SYSTEM,
            content: this.config.chat.systemMessage,
          },
        ]
      : [];

    const res = await this.createChatCompletion(
      [...systemMessages, ...lastMessages],
      options
    );

    // Add the assistant's response to the array of messages and update the cache
    this.cache.set(
      id,
      [...lastMessages, { role: roles.ASSISTANT, content: res }],
      this.config.chat.ttl
    );

    logger.debug("cached messages: ", this.cache.get(id));

    return res;
  }

  getNumOfMessages() {
    const numOfMessages = this.config.chat.numOfMessages;

    if (numOfMessages < 2) {
      throw new Error("OPENAI_CHAT_NUM_OF_MESSAGES must be >= 2.");
    }

    if (numOfMessages % 2 !== 0) {
      throw new Error("OPENAI_CHAT_NUM_OF_MESSAGES must be an even number.");
    }

    return numOfMessages;
  }

  async createSingleChatCompletion(role, message, options) {
    return await this.createChatCompletion(
      [{ role, content: message }],
      options
    );
  }

  async createChatCompletion(messages, options) {
    const completion = await this.openAIApi.createChatCompletion({
      model: "gpt-3.5-turbo",
      messages,
      ...options,
    });

    return completion.data.choices[0].message.content;
  }

  async tellMeMyFate() {
    const now = new Date();
    return await this.createSingleChatCompletion(
      roles.USER,
      `
      zh-TW: 現在請你扮演一名講垃圾話的工程師命理專家，當我說出「今日運勢」，
      請以日期 ${now.toLocaleDateString()} 和「那你為什麼不問問神奇海螺呢？」作為開頭，提供適合當日的開發工作運勢，
      例如今天是否適合部署、hotfix、修改程式碼、code review、開會、跟工程師吵架、上班等等。

      今日運勢？
      `
    );
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

module.exports = OpenAICommand;
