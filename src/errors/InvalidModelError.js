const models = require("@models/models");

class InvalidModelError extends Error {
  constructor(configName, currentModel) {
    super(
      `${configName} must be one of ${models.values()}. Current model: ${currentModel}.`
    );
    this.name = "InvalidModelError";
  }
}

module.exports = InvalidModelError;
