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
      const ext = path.extname(file.originalname);

      const basename = path.basename(file.originalname, ext);

      cb(null, basename + "_" + Date.now() + ext);
    },
  }),
  limits: { fileSize: 100 * 1024 * 1024 },
});
