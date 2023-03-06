const Enum = require("@5x/enumjs");

const roles = new Enum();
roles.defineEnumProperty("USER", "user");
roles.defineEnumProperty("SYSTEM", "system");
roles.defineEnumProperty("ASSISTANT", "assistant");

module.exports = roles;
