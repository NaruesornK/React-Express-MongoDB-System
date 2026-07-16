import React, { useEffect } from "react";
import { Button, Container, Typography, Box } from "@mui/material";
import { Link } from "react-router-dom";

const Home = () => {
  useEffect(() => {
    // ✅ ตรวจสอบ role และเปลี่ยนเส้นทาง
    const token = localStorage.getItem("token");
    const role = localStorage.getItem("role");

    if (token && role) {
      if (role === "นักศึกษา") window.location.href = "/student-home";
      if (role === "อาจารย์") window.location.href = "/teacher-home";
      if (role === "Admin") window.location.href = "/admin-home";
    }
  }, []);

  return (
    <Container maxWidth="md" sx={{ textAlign: "center", mt: 10 }}>
      <Typography variant="h3">🏠 ระบบลงทะเบียนชมรม</Typography>
      <Typography variant="h5" sx={{ mt: 2, color: "gray" }}>
        โปรดเข้าสู่ระบบเพื่อใช้งานระบบ
      </Typography>

      {/* ✅ ปุ่ม Login & Register */}
      <Box sx={{ mt: 4 }}>
        <Button component={Link} to="/login" variant="contained" color="success" sx={{ mr: 2 }}>
          เข้าสู่ระบบ
        </Button>
        <Button component={Link} to="/register" variant="contained" color="primary">
          ลงทะเบียน
        </Button>
      </Box>
    </Container>
  );
};

export default Home;
