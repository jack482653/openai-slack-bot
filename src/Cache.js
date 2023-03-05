const NodeCache = require("node-cache");

class Cache {
  constructor(options) {
    this.cache = new NodeCache(options);
  }

  get(key) {
    return this.cache.get(key);
  }

  set(key, value, ttl) {
    this.cache.set(key, value, ttl);
  }
}

module.exports = Cache;
