const { expect } = require("chai");
const OpenAICommand = require("./OpenAICommand");
const roles = require("./roles");

const fakeOpenAIApi = {
  createChatCompletion: () => {
    return {
      data: {
        choices: [
          {
            message: {
              content: "This is response from OpenAI.",
            },
          },
        ],
      },
    };
  },
};

class FakeCache {
  constructor() {
    this.cache = {};
  }

  get(key) {
    return this.cache[key];
  }

  set(key, value, ttl) {
    this.cache[key] = value;
  }
}

describe("OpenAICommand", () => {
  describe("getNumOfMessages", () => {
    it("should throw an error when numOfMessages is < 2", () => {
      const openAICommand = new OpenAICommand(
        fakeOpenAIApi,
        {},
        { chat: { numOfMessages: 1 } }
      );

      expect(() => openAICommand.getNumOfMessages()).to.throw(
        "OPENAI_CHAT_NUM_OF_MESSAGES must be >= 2."
      );
    });

    it("should throw an error when numOfMessages is not an even number", () => {
      const openAICommand = new OpenAICommand(
        fakeOpenAIApi,
        {},
        { chat: { numOfMessages: 3 } }
      );

      expect(() => openAICommand.getNumOfMessages()).to.throw(
        "OPENAI_CHAT_NUM_OF_MESSAGES must be an even number."
      );
    });

    it("should return numOfMessages when numOfMessages is >= 2 and an even number", () => {
      const openAICommand = new OpenAICommand(
        fakeOpenAIApi,
        {},
        { chat: { numOfMessages: 4 } }
      );

      expect(openAICommand.getNumOfMessages()).to.eq(4);
    });
  });

  describe("chat", async () => {
    it("cache should all messages when messages <= numOfMessages", async () => {
      const fakeCache = new FakeCache();
      const openAICommand = new OpenAICommand(fakeOpenAIApi, fakeCache, {
        chat: { numOfMessages: 4 },
      });

      await openAICommand.chat("id", "message 1");

      const cachedMessages = fakeCache.get("conversation-id");
      expect(cachedMessages.length).to.eq(2);
      expect(cachedMessages[0]).to.deep.eq({
        role: roles.USER,
        content: "message 1",
      });
      expect(cachedMessages[1]).to.deep.eq({
        role: roles.ASSISTANT,
        content: "This is response from OpenAI.",
      });
    });

    it("cache should only last numOfMessages when messages > numOfMessages", async () => {
      const fakeCache = new FakeCache();
      const openAICommand = new OpenAICommand(fakeOpenAIApi, fakeCache, {
        chat: { numOfMessages: 4 },
      });

      await openAICommand.chat("id", "message 1");
      await openAICommand.chat("id", "message 2");
      await openAICommand.chat("id", "message 3");

      const cachedMessages = fakeCache.get("conversation-id");
      expect(cachedMessages.length).to.eq(4);
      expect(cachedMessages[0]).to.deep.eq({
        role: roles.USER,
        content: "message 2",
      });
      expect(cachedMessages[1]).to.deep.eq({
        role: roles.ASSISTANT,
        content: "This is response from OpenAI.",
      });
      expect(cachedMessages[2]).to.deep.eq({
        role: roles.USER,
        content: "message 3",
      });
      expect(cachedMessages[3]).to.deep.eq({
        role: roles.ASSISTANT,
        content: "This is response from OpenAI.",
      });
    });
  });
});
