import React, { useState, useEffect } from "react";
import axios from "axios";
import { Container, Typography, Box, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Button, Tabs, Tab ,CircularProgress} from "@mui/material";
import { useNavigate, Link } from "react-router-dom";
import PdfPreview from "../pdf/PdfPreview"; // ปรับเส้นทางตามที่อยู่ไฟล์ของคุณ

const Home = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [selectedMenu, setSelectedMenu] = useState("home");

  useEffect(() => {
    const token = localStorage.getItem("token");
    const role = localStorage.getItem("role");
    const username = localStorage.getItem("username");
    const email = localStorage.getItem("email");

    if (!token || role !== "นักศึกษา") {
      navigate("/"); // ถ้าไม่ได้เป็น Admin ให้กลับไปหน้า Home
    } else {
      setUser({ username, email, role });
    }
  }, [navigate]);

  const DocumentList = () => {
    const [documents, setDocuments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedDocId, setSelectedDocId] = useState(null);
    const username = localStorage.getItem("username");

    useEffect(() => {
      if (selectedDocId) {
        const selectedDoc = documents.find(doc => doc._id === selectedDocId);
        if (selectedDoc) {
          console.log("📌 พบข้อมูล:", selectedDoc);
          localStorage.setItem("form1Data", JSON.stringify(selectedDoc.form1Data));
          localStorage.setItem("form2Data", JSON.stringify(selectedDoc.form2Data));
          console.log("📄 บันทึกข้อมูลลง localStorage สำเร็จ");
        } else {
          console.log("❌ ไม่พบเอกสารที่ต้องการ");
        }
      }
    }, [selectedDocId, documents]); // ทำงานเมื่อ selectedDocId หรือ documents เปลี่ยน
    
    


  
    useEffect(() => {
      const fetchDocuments = async () => {
        try {
const res = await axios.get("http://localhost:4000/api/documents");
          const filteredDocuments = res.data.filter(doc => doc.studentName === username);
          setDocuments(filteredDocuments);  
        } catch (error) {
          console.error("❌ Error fetching documents:", error);
        } finally {
          setLoading(false);
        }
      };
  
      fetchDocuments();
    }, [username]);
  
    useEffect(() => {
      if (selectedDocId) {
        console.log("✅ ID ที่เลือก:", selectedDocId);
      }
    }, [selectedDocId]);
  
    return (
      <Container maxWidth="md">
        <Typography variant="h4" align="center" gutterBottom>
          รายการเอกสารของ {username}
        </Typography>
  
        {loading ? (
          <Box display="flex" justifyContent="center" mt={4}>
            <CircularProgress />
          </Box>
        ) : (
          <TableContainer component={Paper} sx={{ mt: 3, borderRadius: "12px", boxShadow: 3 }}>
            <Table>
              <TableHead sx={{ bgcolor: "#1976D2" }}>
                <TableRow>
                  <TableCell sx={{ color: "white", fontWeight: "bold", textAlign: "center" }}>ลำดับ</TableCell>
                  <TableCell sx={{ color: "white", fontWeight: "bold" }}>ชื่ออาจารย์</TableCell>
                  <TableCell sx={{ color: "white", fontWeight: "bold" }}>สถานะ</TableCell>
                  <TableCell sx={{ color: "white", fontWeight: "bold", textAlign: "center" }}>ไฟล์</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {documents.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={4} align="center">❌ ไม่พบข้อมูล</TableCell>
                  </TableRow>
                ) : (
                  documents.map((doc, index) => (
                    <TableRow key={doc._id} sx={{ "&:nth-of-type(even)": { bgcolor: "#f5f5f5" } }}>
                      <TableCell align="center">{index + 1}</TableCell>
                      <TableCell>{doc.selectedTeacher}</TableCell>
                      <TableCell>{doc.status}</TableCell>
                      <TableCell align="center">
                      <Button
                          variant="contained"
                          color="primary"
                          onClick={() => {
                            console.log("📌 รีค่า + โหลดใหม่: ", doc._id);
                            setSelectedDocId(null); // ล้างค่าเก่าก่อน
                            setTimeout(() => {
                              localStorage.setItem("form1Data", JSON.stringify(doc.form1Data));
                              localStorage.setItem("form2Data", JSON.stringify(doc.form2Data));
                              setSelectedDocId(doc._id); // กำหนดค่าใหม่หลังจากตั้งค่า localStorage
                              const role = localStorage.getItem("role");
                            }, 50);
                          }}
                        >
                          ดู PDF
                      </Button>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </TableContainer>
        )}
  
        {selectedDocId && <PdfPreview selectedDocId={selectedDocId} />}
      </Container>
    );
  };











  

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("role");
   localStorage.removeItem("username");
     localStorage.removeItem("email");
    setUser(null);
    navigate("/"); // กลับไปหน้า Home
  };

  return (
    <Box sx={{ minHeight: "100vh", display: "flex", flexDirection: "column" }}>
      {/* ✅ Header */}
      <Box sx={{ display: "flex", justifyContent: "space-between", p: 2, borderBottom: "1px solid #ddd" }}>
        <Typography variant="h5">🏠 ระบบลงทะเบียนชมรม</Typography>
        {user ? (
          <Button variant="contained" color="error" onClick={handleLogout}>
            ออกจากระบบ
          </Button>
        ) : (
          <Box>
            <Button component={Link} to="/login" variant="contained" color="success" sx={{ mr: 1 }}>
              เข้าสู่ระบบ
            </Button>
            <Button component={Link} to="/register" variant="contained" color="primary">
              ลงทะเบียน
            </Button>
          </Box>
        )}
      </Box>

      {/* ✅ ถ้ายังไม่ล็อกอิน ให้แสดง "กรุณาล็อกอิน" */}
      {!user ? (
        <Container maxWidth="md" sx={{ textAlign: "center", mt: 5 }}>
          <Typography variant="h4">🔒 กรุณาล็อกอิน</Typography>
          <Typography sx={{ mt: 2 }}>คุณต้องเข้าสู่ระบบก่อนจึงจะสามารถใช้งานระบบได้</Typography>
          <Button component={Link} to="/login" variant="contained" color="success" sx={{ mt: 3 }}>
            เข้าสู่ระบบ
          </Button>
        </Container>
      ) : (
        // ✅ ถ้าล็อกอินแล้ว ให้แสดงเนื้อหาหลัก
        <Container maxWidth="md" sx={{ flexGrow: 1, mt: 2 }}>
          <Tabs value={selectedMenu} onChange={(_, newValue) => setSelectedMenu(newValue)} centered>
            <Tab label="🏠 หน้าหลัก" value="home" />
            <Tab label="👤 ข้อมูลส่วนตัว" value="profile" />
            <Tab label="👤 บันทึกเอกสาร" value="document" />
          </Tabs>

          <Box sx={{ mt: 3 }}>
            {selectedMenu === "home" && (
              <>
                <Typography variant="h4">📌 หน้าหลัก</Typography>
                <Button variant="contained" color="primary" onClick={() => navigate("/From1")} sx={{ mt: 2 }}>
                  ➕ เอกสารก่อตั้งชมรม
                </Button>
              </>
            )}
            {selectedMenu === "profile" && (
              <>
                <Typography variant="h4">👤 ข้อมูลส่วนตัว</Typography>
                <Typography sx={{ mt: 2 }}>Username: {user.username}</Typography>
                <Typography>Email: {user.email}</Typography>
                <Typography>Role: {user.role}</Typography>
              </>
            )}
          

          {selectedMenu === "document" && (
              <>
               <DocumentList/>
              </>
            )}


          </Box>
        </Container>
      )}
    </Box>
  );
};

export default Home;
