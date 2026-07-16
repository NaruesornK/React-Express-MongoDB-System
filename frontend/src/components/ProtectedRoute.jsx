import { Navigate, Outlet } from "react-router-dom";

const ProtectedRoute = () => {
  const token = localStorage.getItem("token"); // ดึง Token
  const role = localStorage.getItem("role"); // ดึง Role

  if (!token) {
    return <Navigate to="/login" />; // ถ้ายังไม่ได้ Login -> ไปหน้า Login
  }

  // ✅ ถ้า Login แล้ว เช็ค Role เพื่อ Redirect ไปหน้า Home ตามสิทธิ์
  if (role === "Student") return <Navigate to="/student-home" />;
  if (role === "Teacher") return <Navigate to="/teacher-home" />;
  if (role === "Admin") return <Navigate to="/admin-home" />;

  return <Outlet />; // แสดงหน้าปัจจุบันถ้าไม่มีเงื่อนไขพิเศษ
};

export default ProtectedRoute;
