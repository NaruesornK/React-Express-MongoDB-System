import React, { useState, useEffect, useRef } from "react";
import { Container, Typography, Box, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Button, Tabs, Tab ,CircularProgress} from "@mui/material";
import { useNavigate } from "react-router-dom";
//import PdfPreview from "../pdf/PdfPreview"; // ปรับเส้นทางตามที่อยู่ไฟล์ของคุณ
import axios from "axios";

const HomeTeacher = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [selectedMenu, setSelectedMenu] = useState("home");
  const sigCanvas = useRef(null);

  useEffect(() => {
    const token = localStorage.getItem("token");
    const role = localStorage.getItem("role");
    const username = localStorage.getItem("username");
    const email = localStorage.getItem("email");
    if (role === "อาจารย์") {
      setUser({ username, email, role });
    } else {
      navigate("/student-home");
    }
  }, [navigate]);




  
  const DocumentList = () => {
    const [documents, setDocuments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedDocId, setSelectedDocId] = useState(null);
    const username = localStorage.getItem("username");

    useEffect(() => {
      if (selectedDocId) {
        const selectedDoc = documents.find(doc => doc._id === selectedDocId )  ;
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
          const filteredDocuments = res.data.filter(doc => doc.selectedTeacher  === username && doc.status === "รออาจารย์เซ็น");
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
          รายการเอกสารที่นักศึกษาส่ง
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
                  <TableCell sx={{ color: "white", fontWeight: "bold" }}>ชื่อนักศึกษา</TableCell>
                  <TableCell sx={{ color: "white", fontWeight: "bold" }}>สถานะ</TableCell>
                  <TableCell sx={{ color: "white", fontWeight: "bold", textAlign: "center" }}>เซ็นเอกสาร</TableCell>
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
                      <TableCell>{doc.studentName}</TableCell>
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
                              localStorage.setItem("selectedDocId", doc._id); // ✅ เก็บ doc._id 
                              setSelectedDocId(doc._id); // กำหนดค่าใหม่หลังจากตั้งค่า localStorage
                              navigate("/add-teacher")
                            }, 50);

                          }}
                        >
                          เซ็นเอกสาร
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
    navigate("/");
  };

  const documents = [
    { id: 1, name: "Club Registration", student: "Student A", status: "Pending" },
    { id: 2, name: "Annual Report", student: "Student B", status: "Pending" }
  ];

  const submitSignedDocument = async (docId, docName, student) => {
    const signatureData = sigCanvas.current.toDataURL("image/png");
    const pdf = new jsPDF();
    pdf.text(`Document: ${docName}`, 10, 10);
    pdf.text(`Student: ${student}`, 10, 20);
    pdf.addImage(signatureData, "PNG", 10, 30, 100, 40);
    const pdfBlob = pdf.output("blob");

    const formData = new FormData();
    formData.append("document", pdfBlob, `${docName}_signed.pdf`);
    formData.append("docId", docId);

    try {
      const response = await fetch("http://localhost:4000/api/submit-signed-document", {
        method: "POST",
        body: formData
      });
      const data = await response.json();
      if (data.success) {
        alert("Document submitted to Admin successfully!");
        navigate("/teacher");
      } else {
        alert("Failed to submit document");
      }
    } catch (error) {
      console.error("Error submitting document:", error);
    }
  };







  

  return (
    <Box sx={{ minHeight: "100vh", display: "flex", flexDirection: "column" }}>
      {/* ✅ Header */}
      <Box sx={{ display: "flex", justifyContent: "space-between", p: 2, borderBottom: "1px solid #ddd" }}>
        <Typography variant="h5">👨‍🏫 ระบบตรวจสอบเอกสารอาจารย์</Typography>
        <Button variant="contained" color="error" onClick={handleLogout}>
          ออกจากระบบ
        </Button>
      </Box>

      {/* ✅ ถ้าไม่ได้ล็อกอิน ให้กลับไปล็อกอิน */}
      {!user ? (
        <Container maxWidth="md" sx={{ textAlign: "center", mt: 5 }}>
          <Typography variant="h4">🔒 กรุณาล็อกอิน</Typography>
          <Typography sx={{ mt: 2 }}>คุณต้องเข้าสู่ระบบก่อนจึงจะใช้งานได้</Typography>
          <Button variant="contained" color="success" onClick={() => navigate("/login")} sx={{ mt: 3 }}>
            เข้าสู่ระบบ
          </Button>
        </Container>
      ) : (
        <Container maxWidth="md" sx={{ flexGrow: 1, mt: 2 }}>
          <Tabs value={selectedMenu} onChange={(_, newValue) => setSelectedMenu(newValue)} centered>
            <Tab label="🏠 หน้าหลัก" value="home" />
            <Tab label="👤 ข้อมูลส่วนตัว" value="profile" />
            <Tab label="📄 บันทึกเอกสาร" value="documents" />
          </Tabs>

          <Box sx={{ mt: 3 }}>
            {selectedMenu === "home" && (
              <>
                <DocumentList/>
              </>
            )}


       {  selectedMenu === "profile" && (
              <>
                <Typography variant="h4">👤 ข้อมูลส่วนตัว</Typography>
                <Typography sx={{ mt: 2 }}>Username: {user.username}</Typography>
                <Typography>Email: {user.email}</Typography>
                <Typography>Role: {user.role}</Typography>
              </>
            )}
            
            {selectedMenu === "documents" && (
              <>
        
              </>
            )}
          </Box>
        </Container>
      )}
    </Box>
  );
};

export default HomeTeacher;
