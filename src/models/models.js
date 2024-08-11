const Enum = require("@5x/enumjs");
const modelTypes = require("./modelTypes");

const models = new Enum();
// /v1/chat/completions:
// GPT-4o:
// * gpt-4o
// * gpt-4o-2024-05-13
// * gpt-4o-2024-08-06
models.defineEnumProperty("GPT_4O", "gpt-4o", {
  types: [modelTypes.CHAT, modelTypes.VISION],
});
models.defineEnumProperty("GPT_4O_2024_05_13", "gpt-4o-2024-05-13", {
  types: [modelTypes.CHAT, modelTypes.VISION],
});
models.defineEnumProperty("GPT_4O_2024_08_06", "gpt-4o-2024-08-06", {
  types: [modelTypes.CHAT, modelTypes.VISION],
});

// GPT-4o mini
// * gpt-4o-mini
// * gpt-4o-mini-2024-07-18
models.defineEnumProperty("GPT_4O_MINI", "gpt-4o-mini", {
  types: [modelTypes.CHAT, modelTypes.VISION],
});
models.defineEnumProperty("GPT_4O_MINI_2024_07_18", "gpt-4o-mini-2024-07-18", {
  types: [modelTypes.CHAT, modelTypes.VISION],
});

// GPT-4 Turbo and GPT-4
// * gpt-4-turbo
// * gpt-4-turbo-2024-04-09
// * gpt-4-turbo-preview
// * gpt-4-0125-preview
// * gpt-4-1106-preview
// * gpt-4
// * gpt-4-0613
// * gpt-4-0314
models.defineEnumProperty("GPT_4_TURBO", "gpt-4-turbo", {
  types: [modelTypes.CHAT],
});
models.defineEnumProperty("GPT_4_TURBO_2024_04_09", "gpt-4-turbo-2024-04-09", {
  types: [modelTypes.CHAT],
});
models.defineEnumProperty("GPT_4_TURBO_PREVIEW", "gpt-4-turbo-preview", {
  types: [modelTypes.CHAT],
});
models.defineEnumProperty("GPT_4_0125_PREVIEW", "gpt-4-0125-preview", {
  types: [modelTypes.CHAT],
});
models.defineEnumProperty("GPT_4_1106_PREVIEW", "gpt-4-1106-preview", {
  types: [modelTypes.CHAT],
});
models.defineEnumProperty("GPT_4", "gpt-4", { types: [modelTypes.CHAT] });
models.defineEnumProperty("GPT_4_0613", "gpt-4-0613", {
  types: [modelTypes.CHAT],
});
models.defineEnumProperty("GPT_4_0314", "gpt-4-0314", {
  types: [modelTypes.CHAT],
});
// GPT-3.5 Turbo
// * gpt-3.5-turbo-0125
// * gpt-3.5-turbo
// * gpt-3.5-turbo-1106
// * gpt-3.5-turbo-instruct
models.defineEnumProperty("GPT_3_5_TURBO_0125", "gpt-3.5-turbo-0125", {
  types: [modelTypes.CHAT],
});
models.defineEnumProperty("GPT_3_5_TURBO", "gpt-3.5-turbo", {
  types: [modelTypes.CHAT],
});
models.defineEnumProperty("GPT_3_5_TURBO_1106", "gpt-3.5-turbo-1106", {
  types: [modelTypes.CHAT],
});
models.defineEnumProperty("GPT_3_5_TURBO_INSTRUCT", "gpt-3.5-turbo-instruct", {
  types: [modelTypes.CHAT],
});

// /v1/images:
// * dall-e-3
// * dall-e-2
models.defineEnumProperty("DALL_E_3", "dall-e-3", {
  types: [modelTypes.IMAGES],
});
models.defineEnumProperty("DALL_E_2", "dall-e-2", {
  types: [modelTypes.IMAGES],
});

// /v1/audio/speech:
// * tts-1
// * tts-1-hd
models.defineEnumProperty("TTS_1", "tts-1", { types: [modelTypes.TTS] });
models.defineEnumProperty("TTS_1_HD", "tts-1-hd", { types: [modelTypes.TTS] });

// /v1/audio/transcriptions and /v1/audio/translations:
// whisper-1
models.defineEnumProperty("WHISPER_1", "whisper-1", {
  types: [modelTypes.TRANSCRIPTIONS, modelTypes.TRANSLATIONS],
});

// /v1/embeddings:
// * text-embedding-3-large
// * text-embedding-3-small
// * text-embedding-ada-002
models.defineEnumProperty("TEXT_EMBEDDING_3_LARGE", "text-embedding-3-large", {
  types: [modelTypes.EMBEDDINGS],
});
models.defineEnumProperty("TEXT_EMBEDDING_3_SMALL", "text-embedding-3-small", {
  types: [modelTypes.EMBEDDINGS],
});
models.defineEnumProperty("TEXT_EMBEDDING_ADA_002", "text-embedding-ada-002", {
  types: [modelTypes.EMBEDDINGS],
});

// /v1/moderations:
// * text-moderation-stable
// * text-moderation-latest
// * text-moderation-007
models.defineEnumProperty("TEXT_MODERATION_STABLE", "text-moderation-stable", {
  types: [modelTypes.MODERATIONS],
});
models.defineEnumProperty("TEXT_MODERATION_LATEST", "text-moderation-latest", {
  types: [modelTypes.MODERATIONS],
});
models.defineEnumProperty("TEXT_MODERATION_007", "text-moderation-007", {
  types: [modelTypes.MODERATIONS],
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
