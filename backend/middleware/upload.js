// const multer = require("multer");
// const { CloudinaryStorage } = require("multer-storage-cloudinary");
// const cloudinary = require("../config/cloudinary");

// const storage = new CloudinaryStorage({
//   cloudinary,
//   params: {
//     folder: "blog_images",
//     allowed_formats: ["jpg", "png", "jpeg"],
//   },
// });

// const upload = multer({ storage });

// module.exports = upload;
const multer = require("multer");

const {
  CloudinaryStorage,
} = require("multer-storage-cloudinary");

const cloudinary = require("../config/cloudinary");

const storage = new CloudinaryStorage({
  cloudinary,

  params: async (req, file) => {
    const isPdf =
      file.mimetype === "application/pdf";

    return {
      folder: isPdf
        ? "pdf_uploads"
        : "blog_images",

      resource_type: isPdf
        ? "raw"
        : "image",

      allowed_formats: isPdf
        ? ["pdf"]
        : ["jpg", "png", "jpeg"],

      public_id:
        Date.now() +
        "-" +
        file.originalname.split(".")[0],
    };
  },
});

const upload = multer({
  storage,
});

module.exports = upload;