const mongoose = require("mongoose");

const loginHourSchema = new mongoose.Schema(
  {
    staff: {
      type: String,
      default: "Mohamed Azardeen",
    },

    start: {
      type: Date,
    },

    end: {
      type: Date,
      default: null,
    },

    duration: {
      type: Number,
      default: 0,
    },

    status: {
      type: String,
      default: "Active",
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model(
  "LoginHour",
  loginHourSchema
);