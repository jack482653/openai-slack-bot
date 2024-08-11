const Enum = require("@5x/enumjs");

const modelTypes = new Enum();
modelTypes.defineEnumProperty("CHAT", "chat");
modelTypes.defineEnumProperty("VISION", "vision");
modelTypes.defineEnumProperty("EDITS", "edits");
modelTypes.defineEnumProperty("TRANSCRIPTIONS", "transcriptions");
modelTypes.defineEnumProperty("TRANSLATIONS", "translations");
modelTypes.defineEnumProperty("FINE_TUNES", "fine-tunes");
modelTypes.defineEnumProperty("EMBEDDINGS", "embeddings");
modelTypes.defineEnumProperty("MODERATIONS", "moderations");
modelTypes.defineEnumProperty("IMAGES", "images");
modelTypes.defineEnumProperty("TTS", "tts");

module.exports = modelTypes;
