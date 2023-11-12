const Enum = require("@5x/enumjs");

const apiTypes = new Enum();
apiTypes.defineEnumProperty("CHAT", "chat");
apiTypes.defineEnumProperty("COMPLETION", "completion");
apiTypes.defineEnumProperty("EDITS", "edits");
apiTypes.defineEnumProperty("TRANSCRIPTIONS", "transcriptions");
apiTypes.defineEnumProperty("TRANSLATIONS", "translations");
apiTypes.defineEnumProperty("FINE_TUNES", "fine-tunes");
apiTypes.defineEnumProperty("EMBEDDINGS", "embeddings");
apiTypes.defineEnumProperty("MODERATIONS", "moderations");
apiTypes.defineEnumProperty("IMAGES", "images");
apiTypes.defineEnumProperty("TTS", "tts");

module.exports = apiTypes;
