import multer from "multer";

export const fileValidation = {
  image: ["image/jpg", "image/png", "image/jpeg", "image/gifs"],
  file: ["application/pdf", "application/xlsm"],
};

export function fileUpload(CustomValidation = []) {
  const storage = multer.diskStorage({});

  function fileFilter(req, file, cb) {
    if (CustomValidation.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb("IN_Valid Format", false);
    }
  }
  const upload = multer({ fileFilter, storage });
  return upload;
}
