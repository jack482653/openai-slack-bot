const roles = require("./roles");
const apiTypes = require("./apiTypes");
const models = require("./models");
const InvalidModelError = require("#errors/InvalidModelError");
const ModelTypeNotMatchedError = require("#errors/ModelTypeNotMatchedError");
const { log4js } = require("#configs/logger");
const logger = log4js.getLogger("OpenAICommand");

class OpenAICommand {
  constructor(openAIApi, cache, config) {
    this.openAIApi = openAIApi;
    this.cache = cache;
    this.config = config;

    if (!models.isValidModel(this.config.chat.model)) {
      throw new InvalidModelError("OPENAI_CHAT_MODEL", this.config.chat.model);
    }
    if (!models.isMatchType(this.config.chat.model, apiTypes.CHAT)) {
      throw new ModelTypeNotMatchedError(
        "OPENAI_CHAT_MODEL",
        apiTypes.CHAT,
        this.config.chat.model
      );
    }
  }

  async chat(id, message, options) {
    // get last messages from cache
    let lastMessages = this.cache.get(`conversation-${id}`) ?? [];
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
    if (!this.config.chat.enableSummarize) {
      // Consider response from OpenAI, we keep only the last N - 1 messages
      lastMessages = lastMessages.slice(-this.getNumOfMessages() + 1);
    }

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
      `conversation-${id}`,
      [...lastMessages, { role: roles.ASSISTANT, content: res }],
      this.config.chat.ttl
    );

    logger.debug("cached messages: ", this.cache.get(`conversation-${id}`));

    return res;
  }

  async askQuestionInTheThread(locale, question, conversations) {
    logger.debug("Locale: ", locale);
    logger.debug("Question: ", question);
    logger.debug("Conversations: ", conversations.join("\n"));

    return await this.createChatCompletion(
      [
        {
          role: roles.USER,
          content:
            `#lang:${locale} Answer the question based on the following conversation:\n` +
            `[conversation start]\n${conversations.join(
              "\n"
            )}\n[conversation end]\n` +
            `Question: ${question}`,
        },
      ],
      { temperature: 0.0 }
    );
  }

  async summarizeConversations(locale, conversations) {
    logger.debug("Locale: ", locale);
    logger.debug("Conversations: ", conversations.join("\n"));

    return await this.createChatCompletion(
      [
        {
          role: roles.USER,
          content:
            `#lang:${locale} ` +
            "Summarize the following text very shortly, " +
            "with the most unique and helpful points: \n" +
            conversations.join("\n"),
        },
      ],
      { temperature: 0.0 }
    );
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
      zh-TW: 現在請你扮演一名講垃圾話的工程師命理專家，當我說出「今日運勢」，
      請以日期 ${now.toLocaleDateString()} 和「那你為什麼不問問神奇海螺呢？」作為開頭，提供適合當日的開發工作運勢，
      例如今天是否適合部署、hotfix、修改程式碼、code review、開會、跟工程師吵架、上班等等。

      今日運勢？
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

    const res = await this.openAIApi.completions.create({
      model: models.TEXT_DAVINCI_003,
      prompt: prompt,
      temperature: 0.7,
      max_tokens: 1000,
      top_p: 1,
      frequency_penalty: 0,
      presence_penalty: 0,
      ...options,
    });

    logger.debug("Create completion response: ", res);

    return res.choices[0].text;
  }

  async createChatCompletion(messages, options) {
    logger.debug("Create chat completion parameters: ", messages, options);

    const res = await this.openAIApi.chat.completions.create({
      model: this.config.chat.model,
      messages,
      ...options,
    });

    logger.debug("Create chat completion response: ", res);

    return res.choices[0].message.content;
  }

  async generateImage(prompt) {
    logger.debug("Create image parameters: ", prompt);

    const res = await this.openAIApi.images.generate({
      prompt: prompt,
      n: 1,
      size: "512x512",
      response_format: "b64_json",
    });

    logger.debug("Create image response: ", res);

    return res.data[0].b64_json;
  }
}

module.exports = OpenAICommand;
