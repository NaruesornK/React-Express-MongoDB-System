const express = require("express");
const connectDB = require("./config/db");
const cors = require("cors");
const dotenv = require("dotenv");

dotenv.config();
const app = express();

app.use(cors());
app.use(express.json());

// ✅ เชื่อมต่อกับ MongoDB
connectDB();

const teacherRoutes = require("./routes/teacherRoutes");
app.use("/api", teacherRoutes);



const documents = require("./routes/formRoutes");
app.use("/api",documents);

// ✅ Import Routes
const authRoutes = require("./routes/authRoutes"); 
// ✅ ใช้ API Routes
app.use("/api/auth", authRoutes); // ✅ ใช้ Route ของ Auth









// ✅ เปิดเซิร์ฟเวอร์
app.listen(4000, () => console.log("🚀 Backend running on port 4000"));
