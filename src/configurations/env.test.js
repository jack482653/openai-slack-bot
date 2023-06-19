const path = require("path");
const { expect } = require("chai");
const sinon = require("sinon");
const { getEnv } = require("./env");

const sandbox = sinon.createSandbox();

describe("env", () => {
  beforeEach(() => {
    // stub out the `hello` method
    sandbox.stub(process, "env").value({});
  });

  afterEach(() => {
    // completely restore all fakes created through the sandbox
    sandbox.restore();
  });

  context("Azure provider", () => {
    it("should load azure OpenAI auth", () => {
      const env = getEnv({
        path: path.join(__dirname, "./fixtures/azure-env"),
      });

      expect(env.openAI.auth.apiType).to.eq("azure");
      expect(env.openAI.auth.basePath).to.eq(
        "https://test.openai.azure.com/openai/deployments/TEST"
      );
      expect(env.openAI.auth.apiVersion).to.eq("2023-05-15");
      expect(env.openAI.auth.apiKey).to.eq("AZURE_TEST_KEY");
    });
  });

  context("OpenAI provider", () => {
    it("should use default base path when base path is not specified", () => {
      const env = getEnv({
        path: path.join(__dirname, "./fixtures/openai-env-without-bash-path"),
      });

      expect(env.openAI.auth.basePath).to.eq("https://api.openai.com/v1");
      expect(env.openAI.auth.apiKey).to.eq("OPENAI_TEST_KEY");
    });

    it("should load custom base path", () => {
      const env = getEnv({
        path: path.join(__dirname, "./fixtures/openai-env"),
      });

      expect(env.openAI.auth.basePath).to.eq("https://custom.path");
      expect(env.openAI.auth.apiKey).to.eq("OPENAI_TEST_KEY");
    });
  });

  context("Provider is not specified (Backward compatibility)", () => {
    it("should load old OpenAI auth", () => {
      const env = getEnv({
        path: path.join(__dirname, "./fixtures/old-env"),
      });
      console.log(process.env);

      expect(env.openAI.auth.apiKey).to.eq("OLD_TEST_KEY");
    });
  });
});
