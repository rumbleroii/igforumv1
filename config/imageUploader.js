const multer = require('multer');
const path = require('path');

const fileStorageEngine = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(__dirname, '/../images/'));
  },

  filename: (req, file, cb) => {
    cb(null, Date.now() + "--" + file.originalname)
  }
})


const upload = multer({ storage: fileStorageEngine });

module.exports = upload;
