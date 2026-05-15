const mongoose = require("mongoose");

const graphSchema = new mongoose.Schema(
  {
    month: {
      type: String,
      required: true,
    },

    sales: {
      type: Number,
      required: true,
    },

    users: {
      type: Number,
      required: true,
    },

    revenue: {
      type: Number,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("GraphData", graphSchema);