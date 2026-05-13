const mongoose = require("mongoose");

const fieldSchema = new mongoose.Schema(
  {
    id: {
      type: String,
      default: "",
    },

    label: {
      type: String,
      default: "",
    },

    name: {
      type: String,
      default: "",
    },

    type: {
      type: String,
      default: "",
    },

    system: {
      type: Boolean,
      default: false,
    },

    fullWidth: {
      type: Boolean,
      default: false,
    },
  },
  { _id: false },
);

const invoiceSchema = new mongoose.Schema(
  {
    fields: {
      type: [fieldSchema],
      default: [],
    },

    invoiceData: {
      type: mongoose.Schema.Types.Mixed,
      required: true,
    },

    subtotal: {
      type: Number,
      default: 0,
    },

    taxAmount: {
      type: Number,
      default: 0,
    },

    total: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  },
);

module.exports = mongoose.model("Invoice", invoiceSchema);
