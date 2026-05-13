const mongoose = require("mongoose");

const leadSchema = new mongoose.Schema(
  {
    lead_data: [
      {
        type: Object,
      },
    ],
  },
  {
    timestamps: true,
  },
);

module.exports = mongoose.model("Lead", leadSchema);
