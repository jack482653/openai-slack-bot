const { expect } = require("chai");
const Cache = require("./Cache");

describe("Cache", () => {
  describe("get", () => {
    it("should return null when key is undefined", () => {
      const cache = new Cache();
      const key = undefined;
      const value = cache.get(key);

      expect(value).to.be.null;
    });

    it("should return null when key is null", () => {
      const cache = new Cache();
      const key = null;
      const value = cache.get(key);

      expect(value).to.be.null;
    });
  });

  describe("set", () => {
    it("should not throw error when key is undefined", () => {
      const cache = new Cache();
      const key = undefined;
      const value = "value";

      expect(() => cache.set(key, value)).to.not.throw();
    });

    it("should not throw error when key is null", () => {
      const cache = new Cache();
      const key = null;
      const value = "value";

      expect(() => cache.set(key, value)).to.not.throw();
    });

    it("should set value when key is string", () => {
      const cache = new Cache();
      const key = "key";
      const value = "value";

      cache.set(key, value);

      expect(cache.get(key)).to.equal(value);
    });
  });
});
