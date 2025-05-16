const express = require("express");
const router = express.Router();
const authController = require("../controllers/authController");

// Route for checking if a user ID is already taken
router.post("/check-id", authController.checkIdDuplicate);

// Route for registering a new user
router.post("/register", authController.register);

module.exports = router;
