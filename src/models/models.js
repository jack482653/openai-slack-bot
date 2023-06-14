const Enum = require("@5x/enumjs");
const apiTypes = require("./apiTypes");

const models = new Enum();
// /v1/chat/completions:
// gpt-4, gpt-4-0314, gpt-4-0613
// gpt-4-32k, gpt-4-32k-0314, gpt-4-32k-0613
// gpt-3.5-turbo, gpt-3.5-turbo-0301, gpt-3.5-turbo-0613
// gpt-3.5-turbo-16k, gpt-3.5-turbo-16k-0613
models.defineEnumProperty("GPT_4", "gpt-4", { types: [apiTypes.CHAT] });
// Discontinued date: 2023/09/13
models.defineEnumProperty("GPT_4_0314", "gpt-4-0314", {
  types: [apiTypes.CHAT],
});
models.defineEnumProperty("GPT_4_0613", "gpt-4-0613", {
  types: [apiTypes.CHAT],
});
models.defineEnumProperty("GPT_4_32K", "gpt-4-32k", { types: [apiTypes.CHAT] });
// Discontinued date: 2023/09/13
models.defineEnumProperty("GPT_4_32K_0314", "gpt-4-32k-0314", {
  types: [apiTypes.CHAT],
});
models.defineEnumProperty("GPT_4_32K_0613", "gpt-4-32k-0613", {
  types: [apiTypes.CHAT],
});
models.defineEnumProperty("GPT_3_5_TURBO", "gpt-3.5-turbo", {
  types: [apiTypes.CHAT],
});
// Discontinued date: 2023/09/13
models.defineEnumProperty("GPT_3_5_TURBO_0301", "gpt-3.5-turbo-0301", {
  types: [apiTypes.CHAT],
});
models.defineEnumProperty("GPT_3_5_TURBO_0613", "gpt-3.5-turbo-0613", {
  types: [apiTypes.CHAT],
});
models.defineEnumProperty("GPT_3_5_TURBO_16K", "gpt-3.5-turbo-16k", {
  types: [apiTypes.CHAT],
});
models.defineEnumProperty("GPT_3_5_TURBO_16K_0613", "gpt-3.5-turbo-16k-0613", {
  types: [apiTypes.CHAT],
});
// text-davinci-003, text-davinci-002, text-curie-001, text-babbage-001, text-ada-001
models.defineEnumProperty("TEXT_DAVINCI_003", "text-davinci-003", {
  types: [apiTypes.COMPLETION],
});
models.defineEnumProperty("TEXT_DAVINCI_002", "text-davinci-002", {
  types: [apiTypes.COMPLETION],
});
models.defineEnumProperty("TEXT_CURIE_001", "text-curie-001", {
  types: [apiTypes.COMPLETION],
});
models.defineEnumProperty("TEXT_BABBAGE_001", "text-babbage-001", {
  types: [apiTypes.COMPLETION],
});
models.defineEnumProperty("TEXT_ADA_001", "text-ada-001", {
  types: [apiTypes.COMPLETION],
});
// /v1/edits:
// text-davinci-edit-001, code-davinci-edit-001
models.defineEnumProperty("TEXT_DAVINCI_EDIT_001", "text-davinci-edit-001", {
  types: [apiTypes.EDITS],
});
models.defineEnumProperty("CODE_DAVINCI_EDIT_001", "code-davinci-edit-001", {
  types: [apiTypes.EDITS],
});
// /v1/audio/transcriptions and /v1/audio/translations:
// whisper-1
models.defineEnumProperty("WHISPER_1", "whisper-1", {
  types: [apiTypes.TRANSCRIPTIONS, apiTypes.TRANSLATIONS],
});
// /v1/fine-tunes:
// davinci, curie, babbage, ada
models.defineEnumProperty("DAVINCI", "davinci", {
  types: [apiTypes.FINE_TUNES],
});
models.defineEnumProperty("CURIE", "curie", { types: [apiTypes.FINE_TUNES] });
models.defineEnumProperty("BABBAGE", "babbage", {
  types: [apiTypes.FINE_TUNES],
});
models.defineEnumProperty("ADA", "ada", { types: [apiTypes.FINE_TUNES] });
// /v1/embeddings:
// text-embedding-ada-002, text-search-ada-doc-001
models.defineEnumProperty("TEXT_EMBEDDING_ADA_002", "text-embedding-ada-002", {
  types: [apiTypes.EMBEDDINGS],
});
models.defineEnumProperty(
  "TEXT_SEARCH_ADA_DOC_001",
  "text-search-ada-doc-001",
  { types: [apiTypes.EMBEDDINGS] }
);
// /v1/moderations:
// text-moderation-stable, text-moderation-latest
models.defineEnumProperty("TEXT_MODERATION_STABLE", "text-moderation-stable", {
  types: [apiTypes.MODERATIONS],
});
models.defineEnumProperty("TEXT_MODERATION_LATEST", "text-moderation-latest", {
  types: [apiTypes.MODERATIONS],
});

const isValidModel = (model) => {
  return models.values().includes(model);
};

const isMatchType = (model, type) => {
  const props = models.getProp(model);
  const types = props?.types ?? [];

  return types.includes(type);
};

module.exports = models;
module.exports.isValidModel = isValidModel;
module.exports.isMatchType = isMatchType;
