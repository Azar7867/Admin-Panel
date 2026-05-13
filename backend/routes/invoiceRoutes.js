const express = require("express");

const {
  createInvoice,
  getInvoices,
  getInvoiceById,
  deleteInvoice,
} = require("../controllers/invoiceController");

const router = express.Router();

router.post("/", createInvoice);

router.get("/", getInvoices);

router.get("/:id", getInvoiceById);

router.delete("/:id", deleteInvoice);

module.exports = router;
