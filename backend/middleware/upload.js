/**
 * Secure file upload middleware (multer).
 *
 * Designed for the planned UPI payment-proof upload flow. Enforces:
 *   - MIME type by extension AND content (magic bytes) — never trust extension alone
 *   - Max file size
 *   - Storage outside the web root (uploads/ sits one level above client/)
 *   - Randomized, non-original filenames (prevents overwrite & path traversal)
 *   - Files are stored with no executable extension and served only via a
 *     controlled proxy that forces Content-Type: image/*
 *
 * Environment variables:
 *   UPLOAD_MAX_SIZE_MB   default 5
 *   UPLOAD_DIR           default ../uploads (outside web root)
 */

const multer = require('multer');
const path = require('path');
const fs = require('fs');

const MAX_SIZE_MB = parseInt(process.env.UPLOAD_MAX_SIZE_MB || '5', 10);
const UPLOAD_DIR = path.resolve(__dirname, process.env.UPLOAD_DIR || '../uploads');

// Ensure upload directory exists outside the web root
if (!fs.existsSync(UPLOAD_DIR)) {
  fs.mkdirSync(UPLOAD_DIR, { recursive: true });
}

// Allowed image MIME types and their magic-byte signatures (first bytes)
const ALLOWED = {
  'image/jpeg': [0xff, 0xd8, 0xff],
  'image/png': [0x89, 0x50, 0x4e, 0x47],
};
const ALLOWED_EXTENSIONS = ['.jpg', '.jpeg', '.png'];

/**
 * Validate file content by inspecting magic bytes. Rejects files whose
 * actual content signature does not match a supported image format.
 */
function hasValidImageSignature(buffer) {
  if (!buffer || buffer.length < 4) return false;
  const sig = Array.from(buffer.slice(0, 4));
  return Object.values(ALLOWED).some(expected =>
    expected.every((b, i) => sig[i] === b)
  );
}

const storage = multer.diskStorage({
  destination: UPLOAD_DIR,
  filename: (req, file, cb) => {
    // Randomized name: original extension preserved but never the user's filename
    const ext = path.extname(file.originalname).toLowerCase();
    const rand = require('crypto').randomBytes(16).toString('hex');
    cb(null, `${rand}${ext}`);
  },
});

const fileFilter = (req, file, cb) => {
  const ext = path.extname(file.originalname).toLowerCase();
  const mimeOk = ALLOWED_EXTENSIONS.includes(ext) &&
    (file.mimetype === 'image/jpeg' || file.mimetype === 'image/png');
  if (!mimeOk) {
    return cb(new Error('Only JPG and PNG images are allowed'), false);
  }
  cb(null, true);
};

const upload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: MAX_SIZE_MB * 1024 * 1024,
    files: 1,
  },
});

/**
 * Single-file upload middleware. Field name expected: 'proof'.
 * After multer stores the file, we additionally verify magic bytes and
 * delete the file if the content signature is invalid.
 */
function uploadProof(req, res, next) {
  upload.single('proof')(req, res, (err) => {
    if (err) {
      if (err.code === 'LIMIT_FILE_SIZE') {
        return res.status(400).json({
          success: false,
          message: `File too large. Maximum ${MAX_SIZE_MB}MB.`,
        });
      }
      return res.status(400).json({ success: false, message: err.message || 'Upload failed' });
    }
    if (!req.file) {
      return res.status(400).json({ success: false, message: 'No file uploaded' });
    }
    // Content validation: magic bytes
    const fs = require('fs');
    const buffer = fs.readFileSync(req.file.path);
    if (!hasValidImageSignature(buffer)) {
      fs.unlinkSync(req.file.path);
      return res.status(400).json({
        success: false,
        message: 'File content is not a valid image.',
      });
    }
    next();
  });
}

module.exports = { upload, uploadProof, UPLOAD_DIR };
