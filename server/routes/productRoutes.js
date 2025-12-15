const express = require("express");
const router = express.Router();
const multer = require("multer");
const path = require("path");
const {
  addProduct,
  getProducts,
  getProduct,
  updateProduct,
  deleteProduct,
  togglePublish,
} = require("../controllers/productController");

// Multer config
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, "uploads/"),
  filename: (req, file, cb) =>
    cb(null, file.fieldname + "-" + Date.now() + path.extname(file.originalname)),
});
const upload = multer({ storage });

// Routes
router.post("/", upload.array("images", 5), addProduct);
router.get("/", getProducts);
router.get("/:id", getProduct);
router.put("/:id", upload.array("images", 5), updateProduct);
router.delete("/:id", deleteProduct);
router.patch("/publish/:id", togglePublish);

module.exports = router;
