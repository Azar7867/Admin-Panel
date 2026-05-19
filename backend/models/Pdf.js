const mongoose = require("mongoose");

const pdfSchema = new mongoose.Schema(
  {
    title: String,

    pdfUrl: String,

    assignedUsers: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],

    uploadedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },

    isVisible: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  },
);

module.exports = mongoose.model(
  "Pdf",
  pdfSchema,
);