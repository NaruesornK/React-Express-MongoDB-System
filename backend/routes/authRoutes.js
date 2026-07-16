const express = require("express");
const { register, login } = require("../controllers/authController"); // ✅ Import Controller

const router = express.Router();

router.post("/register", register); // ✅ Route สำหรับสมัครสมาชิก
router.post("/login", login); // ✅ Route สำหรับเข้าสู่ระบบ

module.exports = router;
