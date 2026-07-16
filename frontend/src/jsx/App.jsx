import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Home from "./homes/Home";
import Login from "./Login";
import Register from "./Register";
import HomeStudent from "./homes/HomeStudent";
import HomeTeacher from "./homes/HomeTeacher";
import Teacheradd from "./homes/Teacheradd";
import HomeAdmin from "./homes/HomeAdmin";
import From1 from './froms/From1';
import From2 from './froms/From2';
import From3 from './froms/From3';
import PdfPreview from "./pdf/generatePDF"; 

function App() {
  const role = localStorage.getItem("role"); // ✅ ดึง role ของผู้ใช้ (เช่น "student", "teacher", "admin")
  
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        <Route path="/student-home" element={<HomeStudent/>} />
        <Route path="/teacher-home" element={<HomeTeacher/>} />
        <Route path="/admin-home" element={<HomeAdmin/>} />
        <Route path="/add-teacher" element={role === "อาจารย์" ? <Teacheradd /> : <Navigate to="/" />} />

        {/* ✅ Block นักเรียนเท่านั้นที่เข้าถึง From */}
        {role === "นักศึกษา" ? (
          <>
            <Route path="/from1" element={<From1 />} />
            <Route path="/from2" element={<From2 />} />
            <Route path="/from3" element={<From3 />} />
          </>
        ) : (
          <>
            <Route path="/from1" element={<Navigate to="/" />} />
            <Route path="/from2" element={<Navigate to="/" />} />
            <Route path="/from3" element={<Navigate to="/" />} />
          </>
        )}

        {/* ✅ ให้ทุก role เข้าถึงหน้า PDF ได้ */}
        <Route path="/pdf-preview" element={<PdfPreview />} />
      </Routes>
    </Router>
  );
}

export default App;
