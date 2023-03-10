const roles = require("./roles");
const logger = require("../logger").getLogger("OpenAICommand");

class OpenAICommand {
  constructor(openAIApi, cache, config) {
    this.openAIApi = openAIApi;
    this.cache = cache;
    this.config = config;
  }

  async chat(id, message, options) {
    // get last messages from cache
    let lastMessages = this.cache.get(id) ?? [];
    // If chat is enabled and there are enough messages to summarize, summarize the last messages
    if (
      this.config.chat.enableSummarize &&
      lastMessages.length >= this.getNumOfMessages()
    ) {
      const summary = await this.summarizeMessages(lastMessages);
      lastMessages = [{ role: roles.SYSTEM, content: summary }];
    }
    // Add the user's message to the array of messages
    lastMessages = [...lastMessages, { role: roles.USER, content: message }];
    // Consider response from OpenAI, we keep only the last N - 1 messages
    lastMessages = lastMessages.slice(-this.getNumOfMessages() + 1);

    const predefinedSystemMessages = this.config.chat.systemMessage
      ? [
          {
            role: roles.SYSTEM,
            content: this.config.chat.systemMessage,
          },
        ]
      : [];

    const res = await this.createChatCompletion(
      [...predefinedSystemMessages, ...lastMessages],
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

  async summarizeMessages(messages) {
    return await this.createChatCompletion(
      [
        {
          role: roles.USER,
          content: `summarize the following messages shortly: ${JSON.stringify(
            messages
          )}`,
        },
      ],
      { temperature: 0.0 }
    );
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

  async tellMeMyFate() {
    const now = new Date();
    return await this.createSingleChatCompletion(
      roles.USER,
      `
      zh-TW: ????????????????????????????????????????????????????????????????????????????????????????????????
      ???????????? ${now.toLocaleDateString()} ????????????????????????????????????????????????????????????????????????????????????????????????????????????
      ?????????????????????????????????hotfix?????????????????????code review????????????????????????????????????????????????

      ???????????????
      `
    );
  }

  async createSingleChatCompletion(role, message, options) {
    return await this.createChatCompletion(
      [{ role, content: message }],
      options
    );
  }

  async createCompletion(prompt, options) {
    logger.debug("Create completion parameters: ", prompt, options);

    const res = await this.openAIApi.createCompletion({
      model: "text-davinci-003",
      prompt: prompt,
      temperature: 0.7,
      max_tokens: 1000,
      top_p: 1,
      frequency_penalty: 0,
      presence_penalty: 0,
      ...options,
    });

    logger.debug("Create completion response: ", res);

    return res.data.choices[0].text;
  }

  async createChatCompletion(messages, options) {
    logger.debug("Create chat completion parameters: ", messages, options);

    const res = await this.openAIApi.createChatCompletion({
      model: "gpt-3.5-turbo",
      messages,
      ...options,
    });

    logger.debug("Create chat completion response: ", res);

    return res.data.choices[0].message.content;
  }

  async generateImage(prompt) {
    logger.debug("Create image parameters: ", prompt);

    const res = await this.openAIApi.createImage({
      prompt: prompt,
      n: 1,
      size: "512x512",
      response_format: "b64_json",
    });

    logger.debug("Create image response: ", res);

    return res.data.data[0].b64_json;
  }
}

module.exports = OpenAICommand;
