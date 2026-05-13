const mongoose = require("mongoose");

const blogSchema = new mongoose.Schema({
  name: String,
  image: String,
  rate: String,
  description: [String],
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Blog", blogSchema);
