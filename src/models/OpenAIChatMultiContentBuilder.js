const OpenAIChatAbstractContentBuilder = require("./OpenAIChatAbstractContentBuilder");

class OpenAIChatMultiContentBuilder extends OpenAIChatAbstractContentBuilder {
  async build() {
    const filteredFiles =
      this.files?.filter((file) => ["png", "jpg"].includes(file.filetype)) ??
      [];

    const formattedFiles = await Promise.all(
      filteredFiles.map((file) => this.#toFileObject(file))
    );

    if (formattedFiles) {
      return [
        {
          type: "text",
          text: this.text,
        },
        ...formattedFiles,
      ];
    } else {
      return this.text;
    }
  }

  async #toFileObject(file) {
    const image = await this.option.httpClient.get(file.thumb_360, {
      responseType: "arraybuffer",
    });
    const imageBase64 = Buffer.from(image.data).toString("base64");
    console.debug("imageBase64", imageBase64);
    return {
      type: "image_url",
      image_url: {
        url: `data:${file.mimetype};base64,${imageBase64}`,
      },
    };
  }
}

module.exports = OpenAIChatMultiContentBuilder;
