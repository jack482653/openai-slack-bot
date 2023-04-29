class ModelTypeNotMatchedError extends Error {
  constructor(configName, correctType, currentModel) {
    super(
      `${configName} must be a ${correctType} model. Current model: ${currentModel}.`
    );
    this.name = "ModelTypeNotMatchedError";
  }
}

module.exports = ModelTypeNotMatchedError;
