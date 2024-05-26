const multer = require("multer");

const storage = multer.memoryStorage();

const upload = multer({ storage }).array("files");

module.exports = upload;
