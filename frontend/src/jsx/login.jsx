import { useEffect, useState } from "react";
import axios from "axios";
import { TextField, Button, Container, Typography, Box } from "@mui/material";
import { Link, useNavigate } from "react-router-dom"; // ✅ ใช้ Link และ navigate

const Login = () => {
  const [identifier, setIdentifier] = useState(""); // ✅ ใช้ตัวแปรเดียวเก็บ Email หรือ Username
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("");
  const [message, setMessage] = useState("");
  const navigate = useNavigate();
  
  const [checkingAuth, setCheckingAuth] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      navigate("/"); // Redirect ไปหน้า Home ถ้า Login แล้ว
    }
    setCheckingAuth(false); // เสร็จสิ้นการตรวจสอบ
  }, [navigate]);
  
  
  const handleLogin = async () => {
    try {
      const res = await axios.post("http://localhost:4000/api/auth/login", {
        identifier,
        password,
      });
  
      console.log("✅ Response Data:", res.data); // ✅ Debug ดูค่าจาก API
  
      localStorage.setItem("token", res.data.token);
      localStorage.setItem("username", res.data.username);
      localStorage.setItem("role", res.data.role);
      localStorage.setItem("email", res.data.email);
  
      setMessage("✅ ล็อกอินสำเร็จ! กำลังนำทางไปหน้า Home...");
      setTimeout(() => navigate("/"), 2000);
    } catch (err) {
      console.error("❌ Login Error:", err.response?.data); // ✅ Debug ดู Error
      setMessage("❌ " + (err.response?.data?.error || "เกิดข้อผิดพลาด"));
    }
  };

  return (
    <Container maxWidth="sm">
      {/* ✅ Header: ปุ่ม Home (ซ้าย) */}
      <Box sx={{ display: "flex", justifyContent: "flex-end", p: 2 }}>
        <Button component={Link} to="/" variant="text" color="primary">
          🏠 Home
        </Button>
      </Box>

      {/* ✅ Form Login */}
      <Box sx={{ textAlign: "center", mt: 3 }}>
        <Typography variant="h4">เข้าสู่ระบบ</Typography>

        {/* ✅ ช่องกรอก Email หรือ Username */}
        <TextField
          fullWidth
          label="Email หรือ Username"
          variant="outlined"
          margin="normal"
          onChange={(e) => setIdentifier(e.target.value)}
        />

        <TextField
          fullWidth
          label="Password"
          type="password"
          variant="outlined"
          margin="normal"
          onChange={(e) => setPassword(e.target.value)}
        />

        {/* ✅ ปุ่มเข้าสู่ระบบ */}
        <Button
          variant="contained"
          color="success"
          onClick={handleLogin}
          sx={{ mt: 2 }}
        >
          เข้าสู่ระบบ
        </Button>

        {/* ✅ ปุ่มลงทะเบียนอยู่ข้างล่าง */}
        <Box sx={{ mt: 2 }}>
          <Button component={Link} to="/register" variant="outlined" color="primary">
            ลงทะเบียน
          </Button>
        </Box>

        {/* ✅ แสดงข้อความแจ้งเตือน */}
        <Typography variant="body1" color="error.main" sx={{ mt: 2 }}>
          {message}
        </Typography>
      </Box>
    </Container>
  );
};

export default Login;
