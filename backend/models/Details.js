const mongoose = require("mongoose");

const detailsSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    product: {
      type: String,
      required: true,
    },
    place: {
      type: String,
      required: true,
    },

    originalPrice: {
      type: Number,
      default: null,
    },
    percentage: {
      type: Number,
      default: null,
    },
    discountPrice: {
      type: Number,
      default: null,
    },
  },
  { timestamps: true },
);

module.exports = mongoose.model("Details", detailsSchema);
