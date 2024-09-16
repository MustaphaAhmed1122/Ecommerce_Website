// // import multer from "multer";
// // import { nanoid } from "nanoid";
// // import path from "path";
// // import { fileURLToPath } from "url";
// // import fs from "fs";
// // const __dirname = path.dirname(fileURLToPath(import.meta.url));

// // export const fileValidation = {
// //   image: ["image/jpg", "image/png", "image/jpeg", "image/gifs"],
// //   file: ["application/pdf", "application/xlsm"],
// // };

// // export function fileUpload(customPath = "general", CustomValidation = []) {
// //   const fullPathName = path.join(__dirname, `../uploads/${customPath}`);
// //   if (!fs.existsSync(fullPathName)) {
// //     fs.mkdirSync(fullPathName, { recursive: true });
// //   }
// //   const storage = multer.diskStorage({
// //     destination: (req, file, cb) => {
// //       cb(null, fullPathName);
// //     },
// //     filename: (req, file, cb) => {
// //       const uniqueSuffix = nanoid() + "_" + "Sara7a_" + file.originalname;
// //       file.dest = `uploads/${customPath}/${uniqueSuffix}`;
// //       cb(null, uniqueSuffix);
// //     },
// //   });
// //   function fileFilter(req, file, cb) {
// //     if (CustomValidation.includes(file.mimetype)) {
// //       cb(null, true);
// //     } else {
// //       cb("IN_Valid Format", false);
// //     }
// //   }
// //   const upload = multer({ dest: "/uploads", fileFilter, storage });
// //   return upload;
// }
