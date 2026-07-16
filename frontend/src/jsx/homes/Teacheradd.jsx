import React, { useRef, useState } from "react";
import axios from "axios";
import SignatureCanvas from "react-signature-canvas";
import { Container, Typography, Box, Paper, Button } from "@mui/material";
import { useNavigate } from "react-router-dom";
import PdfPreview from "../pdf/PdfPreview"; // ปรับเส้นทางให้ตรง

const storedDocId = localStorage.getItem("selectedDocId");

const TeacherAdd = () => {
  const navigate = useNavigate();
  const sigCanvas = useRef(null);
  const [signed, setSigned] = useState(false);
  const [docId, setDocId] = useState(storedDocId);

  // ✅ ฟังก์ชันบันทึกลายเซ็นลง Database
  const saveSignatureToDB = async () => {
    const signatureDataUrl = sigCanvas.current.toDataURL("image/png");
    try {
      const res = await axios.post("http://localhost:4000/api/save-signature", {
        docId,
        signature: signatureDataUrl,
      });
      axios.patch("http://localhost:4000/api/documents", {
        status: "รอแอดมินยืนยัน",
      });
      
      localStorage.removeItem("savedSignature");
      if (res.data.success) {
        alert("บันทึกลายเซ็นสำเร็จ!");
      }
    } catch (error) {
      console.error("❌ Error saving signature:", error);
      alert("เกิดข้อผิดพลาดในการบันทึกลายเซ็น");
    }
  };

  // ✅ ฟังก์ชัน "ดูลายเซ็น" (เก็บลายเซ็นลง Local Storage)
  const handleSaveToLocal = () => {
    if (!signed) {
      alert("กรุณาเซ็นก่อนบันทึกลง Local Storage!");
      return;
    }
    const signatureDataUrl = sigCanvas.current.toDataURL("image/png");
    localStorage.setItem("savedSignature", signatureDataUrl);
    window.location.reload();
  };

  return (
    <Box sx={{ minHeight: "100vh", display: "flex", flexDirection: "column" }}>
      {/* ✅ Header */}
      <Box sx={{ display: "flex", justifyContent: "space-between", p: 2, borderBottom: "1px solid #ddd" }}>
        <Typography variant="h5">👨‍🏫 ระบบตรวจสอบเอกสารอาจารย์</Typography>
        <Button 
  variant="outlined" 
  onClick={() => {
    localStorage.removeItem("savedSignature")
    navigate("/teacher-home"); // ⏪ กลับไปที่หน้า Home
  }}
>
  กลับ Home
</Button>
      </Box>

      <Container maxWidth="sm">
        <PdfPreview />
        <Paper elevation={3} sx={{ p: 3, mt: 4, textAlign: "center" }}>
          <Typography variant="h5" gutterBottom>
            ✍️ เซ็นเอกสารออนไลน์
          </Typography>

          {/* ✅ กล่องเซ็นลายเซ็น */}
          <Box
            sx={{
              border: "2px dashed #1976D2",
              borderRadius: "8px",
              width: "100%",
              height: "150px",
              mb: 2,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              backgroundColor: "#f9f9f9",
            }}
          >
            <SignatureCanvas
              ref={sigCanvas}
              penColor="black"
              canvasProps={{
                width: 400,
                height: 150,
                className: "sigCanvas",
              }}
              onEnd={() => setSigned(true)}
            />
          </Box>

          {/* ✅ ปุ่ม */}
          <Box display="flex" justifyContent="space-between" mt={2}>
            <Button
              variant="outlined"
              color="error"
              onClick={() => {
                sigCanvas.current.clear();
                setSigned(false);
                localStorage.removeItem("savedSignature"); // ล้าง LocalStorage ถ้าล้างลายเซ็น
              }}
            >
              ล้างลายเซ็น
            </Button>

            {/* ✅ ปุ่ม "ดูลายเซ็น" (เก็บเข้า Local Storage) */}
            <Button variant="contained" color="secondary" onClick={handleSaveToLocal}>
              ดูลายเซ็น
            </Button>

            <Button variant="contained" color="primary" onClick={() => {
    saveSignatureToDB();
    navigate("/teacher-home"); // ⏪ กลับไปที่หน้า Home
  }} >
              บันทึกลายเซ็น
            </Button>
          </Box>
        </Paper>
      </Container>
    </Box>
  );
};

export default TeacherAdd;
