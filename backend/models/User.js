const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  name: String,
  email: String,
  password: String,

  role: {
    type: String,
    enum: ["admin", "user"],
    default: "user",
  },

  fullAccess: {
    type: Boolean,
    default: false,
  },

  permissions: {
    type: [String],
    default: [],
  },
});

module.exports = mongoose.model("User", userSchema);
