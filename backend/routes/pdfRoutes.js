const router = require("express").Router();

const upload = require("../middleware/upload");

const authMiddleware = require("../middleware/auth");

const {
  uploadPdf,
  getAdminPdfs,
  getUserPdfs,
  deletePdf,
  updateVisibility,
} = require("../controllers/pdfController");

router.post(
  "/upload",
  authMiddleware,
  upload.single("pdf"),
  uploadPdf,
);

router.get(
  "/admin",
  authMiddleware,
  getAdminPdfs,
);

router.get(
  "/user",
  authMiddleware,
  getUserPdfs,
);

router.delete(
  "/:id",
  authMiddleware,
  deletePdf,
);

router.patch(
  "/:id/visibility",
  authMiddleware,
  updateVisibility,
);

module.exports = router;