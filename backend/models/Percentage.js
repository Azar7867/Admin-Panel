const mongoose = require("mongoose");

const percentageSchema = new mongoose.Schema(
  {
    value: {
      type: Number,
      required: true,
    },
  },
  { timestamps: true },
);

module.exports = mongoose.model("Percentage", percentageSchema);
