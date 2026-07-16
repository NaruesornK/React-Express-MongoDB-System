import React, { useState, useEffect } from "react";
import { Button, Container, Typography, Box, Tabs, Tab, Snackbar } from "@mui/material";
import { useNavigate } from "react-router-dom";

const HomeAdmin = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [selectedMenu, setSelectedMenu] = useState("home");
  const [documents, setDocuments] = useState([
    { id: 1, name: "Club Registration", student: "Student A", status: "รอยืนยัน" },
    { id: 2, name: "Annual Report", student: "Student B", status: "รอยืนยัน" },
  ]);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");

  useEffect(() => {
    const token = localStorage.getItem("token");
    const role = localStorage.getItem("role");
    const username = localStorage.getItem("username");
    const email = localStorage.getItem("email");

    if (!token || role !== "Admin") {
      navigate("/"); // ถ้าไม่ได้เป็น Admin ให้กลับไปหน้า Home
    } else {
      setUser({ username,email, role });
    }
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("role");
   localStorage.removeItem("username");
   localStorage.removeItem("email");
    setUser(null);
    navigate("/");
  };

  const approveDocument = (docId) => {
    setDocuments((prevDocs) =>
      prevDocs.map((doc) => (doc.id === docId ? { ...doc, status: "✅ อนุมัติแล้ว" } : doc))
    );
    setSnackbarMessage("✅ อนุมัติเอกสารเรียบร้อย!");
    setSnackbarOpen(true);
  };

  return (
    <Box sx={{ minHeight: "100vh", display: "flex", flexDirection: "column" }}>
      {/* ✅ Header */}
      <Box sx={{ display: "flex", justifyContent: "space-between", p: 2, borderBottom: "1px solid #ddd" }}>
        <Typography variant="h5">🔧 ระบบจัดการเอกสาร (Admin)</Typography>
        <Button variant="contained" color="error" onClick={handleLogout}>
          ออกจากระบบ
        </Button>
      </Box>

      {/* ✅ เนื้อหาหลัก */}
      <Container maxWidth="md" sx={{ flexGrow: 1, mt: 2 }}>
        <Tabs value={selectedMenu} onChange={(_, newValue) => setSelectedMenu(newValue)} centered>
          <Tab label="🏠 หน้าหลัก" value="home" />
          <Tab label="👤 ข้อมูลส่วนตัว" value="profile" />
          <Tab label="📄 รายการเอกสาร" value="documents" />
        </Tabs>

        <Box sx={{ mt: 3 }}>
          {selectedMenu === "home" && <Typography variant="h4">📌 หน้าหลัก (Admin)</Typography>}
            {selectedMenu === "profile" && (
                        <>
                          <Typography variant="h4">👤 ข้อมูลส่วนตัว</Typography>
                          <Typography sx={{ mt: 2 }}>Username: {user.username}</Typography>
                          <Typography>Email: {user.email}</Typography>
                          <Typography>Role: {user.role}</Typography>
                        </>
                      )}



          {selectedMenu === "documents" && (
            <>
              <Typography variant="h4">📄 รายการเอกสาร</Typography>
              {documents.map((doc) => (
                <Box key={doc.id} sx={{ border: "1px solid #ddd", borderRadius: 2, p: 2, mt: 2 }}>
                  <Typography>
                    {doc.name} จาก {doc.student} - Status: <strong>{doc.status}</strong>
                  </Typography>
                  {doc.status === "รอยืนยัน" && (
                    <Button
                      variant="contained"
                      color="success"
                      onClick={() => approveDocument(doc.id)}
                      sx={{ mt: 2 }}
                    >
                      ✅ ยืนยันเอกสาร
                    </Button>
                  )}
                </Box>
              ))}
            </>
          )}
        </Box>
      </Container>

      {/* ✅ Snackbar แจ้งเตือน */}
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={3000}
        onClose={() => setSnackbarOpen(false)}
        message={snackbarMessage}
      />
    </Box>
  );
};

export default HomeAdmin;
