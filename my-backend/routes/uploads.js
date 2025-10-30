const express = require('express');
const multer = require('multer');
const path = require('path');

const router = express.Router();

// store uploads in ./uploads
const UPLOAD_DIR = path.join(__dirname, '..', 'uploads');
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, UPLOAD_DIR);
  },
  filename: function (req, file, cb) {
    const unique = Date.now() + '-' + Math.random().toString(36).slice(2,8);
    const ext = path.extname(file.originalname);
    cb(null, `${unique}${ext}`);
  }
});

const upload = multer({ storage });

// POST /api/uploads - single file upload (field: file)
router.post('/', upload.single('file'), (req, res) => {
  if (!req.file) return res.status(400).json({ error: 'No file uploaded' });
  // Return public path for client
  const fileUrl = `/uploads/${req.file.filename}`;
  res.json({ success: true, url: fileUrl, filename: req.file.filename });
});

module.exports = router;
