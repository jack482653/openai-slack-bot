const Enum = require("@5x/enumjs");
require("dotenv").config();

const roles = new Enum();
roles.defineEnumProperty("USER", "user");
roles.defineEnumProperty("SYSTEM", "system");
roles.defineEnumProperty("ASSISTANT", "assistant");

module.exports = roles;
