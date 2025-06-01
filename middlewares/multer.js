const multer = require("multer");
const path = require("path");

exports.upload = multer({
  storage: multer.diskStorage({
    destination: (req, file, cb) => {
      if (file.mimetype.startsWith("video/")) {
        cb(null, "public/videos");
      } else {
        cb(null, "public/images");
      }
    },
    filename: (req, file, cb) => {
      const safeName = Buffer.from(file.originalname, "latin1").toString(
        "utf8"
      );
      const parsed = path.parse(safeName);
      cb(null, `${parsed.name}_${Date.now()}${parsed.ext}`);
    },
  }),
  limits: { fileSize: 1000 * 1024 * 1024 },
});
