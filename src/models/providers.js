const Enum = require("@5x/enumjs");

const providers = new Enum();
providers.defineEnumProperty("AZURE", "azure");
providers.defineEnumProperty("OPENAI", "openai");

module.exports = providers;
