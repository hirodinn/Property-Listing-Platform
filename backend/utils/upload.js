import multer from "multer";
import path from "path";

const storage = multer.memoryStorage();

const checkFileType = (file, cb) => {
  const filetypes = /jpg|jpeg|png|webp/;
  const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
  const mimetype = filetypes.test(file.mimetype);

  if (extname && mimetype) {
    return cb(null, true);
  } else {
    cb(new Error("Images only!"), false);
  }
};

const upload = multer({
  storage,
  limits: { fileSize: 6000000 }, // 6MB
  fileFilter: function (req, file, cb) {
    checkFileType(file, cb);
  },
});

export default upload;
