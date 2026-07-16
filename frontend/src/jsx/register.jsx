import { useEffect, useState } from "react";
import axios from "axios";
import { TextField, Button, Container, Typography, Box, MenuItem } from "@mui/material";
import { Link, useNavigate } from "react-router-dom";

const Register = () => {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState(""); // ✅ เพิ่มช่องยืนยันรหัสผ่าน
  const [role, setRole] = useState("นักศึกษา");
  const [message, setMessage] = useState("");
  const [touched, setTouched] = useState({});
  
  const navigate = useNavigate();
  const [checkingAuth, setCheckingAuth] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      navigate("/");
    }
    setCheckingAuth(false);
  }, [navigate]);

  const isEmailValid = email.includes("@gmail.com");
  const isPasswordMatch = password === confirmPassword; // ✅ เช็กว่ารหัสผ่านตรงกันไหม
  const isDisabled = !username || !email || !password || !confirmPassword || !role || !isEmailValid || !isPasswordMatch;

  const handleRegister = async () => {
    if (!isEmailValid) {
      setMessage("❌ กรุณาใช้อีเมลที่ลงท้ายด้วย @gmail.com");
      return;
    }
    if (!isPasswordMatch) {
      setMessage("❌ รหัสผ่านไม่ตรงกัน");
      return;
    }

    try {
      console.log("📢 ส่งข้อมูลไปที่ API...");
      console.log({ username, email, password, role });

      const res = await axios.post("http://localhost:4000/api/auth/register", {
        username,
        email,
        password,
        role
      });

      setMessage("✅ ลงทะเบียนสำเร็จ! กำลังเข้าสู่หน้า Login");
      setTimeout(() => navigate("/login"), 1000);
    } catch (err) {
      console.error("🔥 Error จาก Backend:", err.response?.data?.error);
      setMessage("❌ " + (err.response?.data?.error || "เกิดข้อผิดพลาด"));
    }
  };

  const roles = [
    { value: "นักศึกษา", label: "นักศึกษา" },
    { value: "อาจารย์", label: "อาจารย์" }
  ];

  return (
    <Container maxWidth="sm">
      <Box sx={{ display: "flex", justifyContent: "flex-end", p: 2 }}>
        <Button component={Link} to="/" variant="text" color="primary">
          🏠 Home
        </Button>
        <Button component={Link} to="/login" variant="contained" color="success">
          เข้าสู่ระบบ
        </Button>
      </Box>

      <Box sx={{ textAlign: "center", mt: 5 }}>
        <Typography variant="h4" gutterBottom>
          ลงทะเบียน
        </Typography>

        <TextField
          fullWidth
          label="ชื่อ-นามสกุล"
          variant="outlined"
          margin="normal"
          onChange={(e) => setUsername(e.target.value)}
          onBlur={() => setTouched({ ...touched, username: true })}
          error={touched.username && !username}
          helperText={touched.username && !username ? "กรุณากรอกชื่อ-นามสกุล" : ""}
        />

        <TextField
          fullWidth
          label="Email"
          type="email"
          variant="outlined"
          margin="normal"
          onChange={(e) => setEmail(e.target.value)}
          onBlur={() => setTouched({ ...touched, email: true })}
          error={touched.email && (!email || !isEmailValid)}
          helperText={
            touched.email && (!email ? "กรุณากรอกอีเมล" : !isEmailValid ? "อีเมลต้องลงท้ายด้วย @gmail.com" : "")
          }
        />

        <TextField
          fullWidth
          label="รหัสผ่าน"
          type="password"
          variant="outlined"
          margin="normal"
          onChange={(e) => setPassword(e.target.value)}
          onBlur={() => setTouched({ ...touched, password: true })}
          error={touched.password && !password}
          helperText={touched.password && !password ? "กรุณากรอกรหัสผ่าน" : ""}
        />

        {/* ✅ ช่องยืนยันรหัสผ่าน */}
        <TextField
          fullWidth
          label="ยืนยันรหัสผ่าน"
          type="password"
          variant="outlined"
          margin="normal"
          onChange={(e) => setConfirmPassword(e.target.value)}
          onBlur={() => setTouched({ ...touched, confirmPassword: true })}
          error={touched.confirmPassword && !isPasswordMatch}
          helperText={touched.confirmPassword && !isPasswordMatch ? "รหัสผ่านไม่ตรงกัน" : ""}
        />

        <TextField
          fullWidth
          select
          label="โปรดเลือก"
          value={role}
          onChange={(e) => setRole(e.target.value)}
          variant="outlined"
          margin="normal"
        >
          {roles.map((option) => (
            <MenuItem key={option.value} value={option.value}>
              {option.label}
            </MenuItem>
          ))}
        </TextField>

        <Button
          variant="contained"
          color="primary"
          onClick={handleRegister}
          disabled={isDisabled}
          sx={{ mt: 2 }}
        >
          ลงทะเบียน
        </Button>

        <Typography variant="body1" color="success.main" sx={{ mt: 2 }}>
          {message}
        </Typography>
      </Box>
    </Container>
  );
};

export default Register;
