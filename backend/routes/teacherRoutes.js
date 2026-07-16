const express = require("express");
const router = express.Router();
const User = require("../models/User"); // Import User Model

// ดึงเฉพาะอาจารย์จาก User Collection
router.get("/teachers", async (req, res) => {
  try {
    const teachers = await User.find({ role: "อาจารย์" }, "username"); // ดึงเฉพาะ username
    res.json(teachers);
  } catch (error) {
    console.error("❌ Error fetching teachers:", error);
    res.status(500).json({ error: "Failed to fetch teachers" });
  }
});

module.exports = router;
