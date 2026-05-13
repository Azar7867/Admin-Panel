const mongoose = require("mongoose");

const dynamicSchema = new mongoose.Schema({
  collectionName: {
    type: String,
    required: true,
  },
  fields: {
    type: [String],
    default: [],
  },
  data: {
    type: [mongoose.Schema.Types.Mixed],
    default: [],
  },
});

module.exports = mongoose.model("Dynamic", dynamicSchema);
