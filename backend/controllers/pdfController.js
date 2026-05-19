const Pdf = require("../models/Pdf");

exports.uploadPdf = async (req, res) => {
  try {
    const { title, assignedUsers } =
      req.body;

    if (!req.file) {
      return res.status(400).json({
        message: "PDF file required",
      });
    }

    const pdf = await Pdf.create({
      title,

      pdfUrl: req.file.path,

      assignedUsers: JSON.parse(
        assignedUsers,
      ),

      uploadedBy: req.user.id,
    });

    res.json({
      message: "PDF Uploaded Successfully",

      pdf,
    });
  } catch (err) {
    console.log(err);

    res.status(500).json({
      message: err.message,
    });
  }
};

exports.getAdminPdfs = async (req, res) => {
  try {
    const pdfs = await Pdf.find()
      .populate(
        "assignedUsers",
        "name email",
      )
      .sort({ createdAt: -1 });

    res.json(pdfs);
  } catch (err) {
    res.status(500).json({
      message: err.message,
    });
  }
};

exports.getUserPdfs = async (
  req,
  res,
) => {
  try {
    const pdfs = await Pdf.find({
      assignedUsers: req.user.id,

      isVisible: true,
    });

    res.json(pdfs);
  } catch (err) {
    res.status(500).json({
      message: err.message,
    });
  }
};

exports.deletePdf = async (req, res) => {
  try {
    await Pdf.findByIdAndDelete(
      req.params.id,
    );

    res.json({
      message: "PDF Deleted Successfully",
    });
  } catch (err) {
    res.status(500).json({
      message: err.message,
    });
  }
};
exports.updateVisibility = async (
  req,
  res,
) => {
  try {
    const { isVisible } = req.body;

    const pdf =
      await Pdf.findByIdAndUpdate(
        req.params.id,
        {
          isVisible,
        },
        {
          new: true,
        },
      );

    res.json(pdf);
  } catch (err) {
    res.status(500).json({
      message: err.message,
    });
  }
};