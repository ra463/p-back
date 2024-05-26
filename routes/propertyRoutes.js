const express = require("express");
const { auth } = require("../middleware/auth");
const upload = require("../middleware/multer");
const {
  registerProperty,
  getAllProperties,
  getAllSellerProperties,
  getProperty,
  updateProperty,
  addMoreImages,
  deleteImage,
  deleteProperty,
  likeandUnlikeProperty,
  sendDetails,
} = require("../controller/propertyController");

const router = express.Router();

router.post("/register-property", auth, upload, registerProperty);
router.get("/get-all-properties", getAllProperties);
router.get("/get-all-seller-properties", auth, getAllSellerProperties);
router.get("/get-property/:id", auth, getProperty);
router.patch("/update-property/:id", auth, updateProperty);
router.post("/add-more-images/:id", auth, upload, addMoreImages);
router.patch("/delete-image/:id", auth, deleteImage);
router.delete("/delete-property/:id", auth, deleteProperty);
router.patch("/like-unlike-property/:id", auth, likeandUnlikeProperty);
router.post("/send-details/:id", auth, sendDetails);

module.exports = router;
