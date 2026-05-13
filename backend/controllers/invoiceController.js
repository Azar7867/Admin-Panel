const Invoice = require("../models/Invoice");

const createInvoice = async (req, res) => {
  try {
    // console.log("BODY:", req.body);

    const invoice = new Invoice({
      fields: req.body.fields,
      invoiceData: req.body.invoiceData,
      subtotal: req.body.subtotal,
      taxAmount: req.body.taxAmount,
      total: req.body.total,
    });

    const savedInvoice = await invoice.save();

    res.status(201).json({
      success: true,
      message: "Invoice Saved Successfully",
      data: savedInvoice,
    });
  } catch (error) {
    // console.log("SAVE ERROR:", error);

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

const getInvoices = async (req, res) => {
  try {
    const invoices = await Invoice.find().sort({
      createdAt: -1,
    });

    res.status(200).json({
      success: true,
      data: invoices,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

const getInvoiceById = async (req, res) => {
  try {
    const invoice = await Invoice.findById(req.params.id);

    res.status(200).json({
      success: true,
      data: invoice,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

const deleteInvoice = async (req, res) => {
  try {
    await Invoice.findByIdAndDelete(req.params.id);

    res.status(200).json({
      success: true,
      message: "Invoice Deleted Successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

module.exports = {
  createInvoice,
  getInvoices,
  getInvoiceById,
  deleteInvoice,
};
