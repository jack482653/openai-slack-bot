const OpenAIChatAbstractContentBuilder = require("./OpenAIChatAbstractContentBuilder");

class OpenAIChatPlainContentBuilder extends OpenAIChatAbstractContentBuilder {
  async build() {
    return this.text;
  }
}

module.exports = OpenAIChatPlainContentBuilder;
