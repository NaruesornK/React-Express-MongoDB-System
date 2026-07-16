const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/User");

// ✅ ฟังก์ชัน Register (สมัครสมาชิก)
const register = async (req, res) => {
  const { username, email, password, role } = req.body;

  try {
    const existingUser = await User.findOne({ username });
    const existingEmail = await User.findOne({ email });

    if (existingUser) {
      return res.status(400).json({ error: "❌ Username นี้ถูกใช้งานแล้ว" });
    }

    if (existingEmail) {
      return res.status(400).json({ error: "❌ Email นี้ถูกใช้งานแล้ว" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({ username, email, password: hashedPassword, role });
    await newUser.save();

    res.json({ message: "✅ สมัครสมาชิกสำเร็จ" });
  } catch (error) {
    console.error("❌ Error Registering User:", error);
    res.status(500).json({ error: "❌ เกิดข้อผิดพลาดในระบบ" });
  }
};

// ✅ ฟังก์ชัน Login (เข้าสู่ระบบ)
const login = async (req, res) => {
  const { identifier, password } = req.body; // ✅ ใช้ identifier รับ Email หรือ Username

  try {
    // ค้นหาผู้ใช้จากอีเมลหรือยูสเซอร์เนม
    const user = await User.findOne({
        $or: [{ email: identifier }, { username: identifier }]
    });

    if (!user) {
        return res.status(400).json({ error: "ไม่พบบัญชีผู้ใช้" });
    }

    // ตรวจสอบรหัสผ่าน
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
        return res.status(400).json({ error: "รหัสผ่านไม่ถูกต้อง" });
    }

    // สร้าง Token
    const token = jwt.sign({ id: user._id }, "YOUR_SECRET_KEY", { expiresIn: "1h" });

    // ✅ ส่งค่า role กลับไปให้ Frontend ด้วย
    res.json({
        success: true,
        token,
        username: user.username,
        role: user.role, // <-- เพิ่ม role ตรงนี้
        email: user.email,
    });
} catch (err) {
    res.status(500).json({ error: "เกิดข้อผิดพลาดภายในเซิร์ฟเวอร์" });
}
};

// ✅ ต้องใส่ module.exports ข้างล่างสุดของไฟล์
module.exports = { register, login };
