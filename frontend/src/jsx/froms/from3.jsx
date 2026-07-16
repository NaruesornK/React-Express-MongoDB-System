import React, { useState, useEffect } from "react";
import axios from "axios";
import GeneratePDF from "../pdf/generatePDF"; // ✅ เพิ่มหน้าสำหรับแสดง PDF
import { useNavigate } from "react-router-dom";
import {
  Container,
  Typography,
  Button,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Paper,
  Box,
} from "@mui/material";

const From3 = () => {
  const [teachers, setTeachers] = useState([]); // รายชื่ออาจารย์
  const [selectedTeacher, setSelectedTeacher] = useState(""); // อาจารย์ที่เลือก
  const navigate = useNavigate();

  useEffect(() => {
    // ดึงรายชื่ออาจารย์จาก MongoDB
    axios
      .get("http://localhost:4000/api/teachers")
      .then((res) => setTeachers(res.data))
      .catch((err) => console.error("Error fetching teachers:", err));
  }, []);

  const handleSave = () => {
    const form1Data = JSON.parse(localStorage.getItem("form1Data") || "{}");
    const form2Data = JSON.parse(localStorage.getItem("form2Data") || "{}");
    const studentName = localStorage.getItem("username") || "ไม่ทราบชื่อ";
    const status = "รออาจารย์เซ็น" ;
    
    if (!selectedTeacher) {
      alert("กรุณาเลือกอาจารย์");
      return;
    }
  
    // ✅ ส่งข้อมูลไป MongoDB
    axios
      .post("http://localhost:4000/api/save-form", {
        form1Data,
        form2Data,
        studentName,
        selectedTeacher,
        status,
      })
      .then(() => {
        // ล้าง localStorage
        localStorage.removeItem("form1Data");
        localStorage.removeItem("form2Data");
        localStorage.removeItem("studentName");
  
        alert("บันทึกสำเร็จ!");
        navigate("/student-home"); // กลับไปหน้า Home
      })
      .catch((err) => console.error("❌ Error saving data:", err));
  };

  return (
    <Container maxWidth="md">
      <Paper elevation={3} sx={{ p: 3, mt: 4 }}>
        <Typography variant="h5" gutterBottom>
          เลือกอาจารย์ที่ปรึกษา
        </Typography>

        <Box mt={3}>
          <FormControl fullWidth>
            <InputLabel>เลือกอาจารย์</InputLabel>
            <Select value={selectedTeacher} onChange={(e) => setSelectedTeacher(e.target.value)}>
              <MenuItem value="">-- เลือกอาจารย์ --</MenuItem>
              {teachers.map((teacher) => (
                <MenuItem key={teacher._id} value={teacher.username}>
                  {teacher.username} {/* ใช้ username แทน name */}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Box>

        <Box mt={3} display="flex" justifyContent="space-between">
          <Button variant="contained" color="primary" onClick={() => navigate("/from2")}>
            ย้อนกลับ
          </Button>
          <Button variant="contained" color="secondary" onClick={handleSave}>
            บันทึก
          </Button>
        </Box>

        {/* ✅ ปุ่มไปหน้า Preview PDF */}
              


      </Paper>
      <GeneratePDF/>
    </Container>
  );
};

export default From3;
