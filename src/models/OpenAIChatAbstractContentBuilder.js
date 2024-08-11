class OpenAIChatAbstractContentBuilder {
  constructor(option = {}) {
    this.option = option;
  }

  setText(text) {
    this.text = text;
    return this;
  }

  setFiles(files) {
    this.files = files;
    return this;
  }

  async build() {
    throw new Error("Method 'build()' must be implemented.");
  }
}

module.exports = OpenAIChatAbstractContentBuilder;
