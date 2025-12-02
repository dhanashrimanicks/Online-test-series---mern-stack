const multer = require("multer");
const path = require("path");
const fs = require("fs");

// Determine storage folder based on URL path
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    let folder = "uploads/others"; // fallback

    if (req.baseUrl.includes("student")) {
      folder = "uploads/studentAvatars";
    } else if (req.baseUrl.includes("faculty")) {
      folder = "uploads/facultyAvatars";
    } else if (req.baseUrl.includes("admin")) {
      folder = "uploads/adminAvatars";
    }

    // Ensure the folder exists
    fs.mkdirSync(folder, { recursive: true });

    cb(null, folder);
  },

  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    const extname = path.extname(file.originalname);
    cb(null, file.fieldname + "-" + uniqueSuffix + extname);
  },
});

// Accept only image files
const fileFilter = (req, file, cb) => {
  const filetypes = /jpeg|jpg|png|gif/;
  const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
  const mimetype = filetypes.test(file.mimetype);

  if (extname && mimetype) {
    return cb(null, true);
  } else {
    cb(new Error("Only image files are allowed!"), false);
  }
};

const upload = multer({
  storage,
  limits: { fileSize: 2 * 1024 * 1024 }, // 2MB max
  fileFilter,
});

module.exports = upload;
