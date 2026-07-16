import { useState, useEffect } from "react";
import { Container, Box, Button, TextField, FormControlLabel, Radio, RadioGroup, Tabs, Tab, Checkbox, FormGroup } from "@mui/material";
import { useNavigate } from "react-router-dom";

const Form1 = () => {
  const navigate = useNavigate();
  const [tabIndex, setTabIndex] = useState(0);
  const [formData, setFormData] = useState({
    clubName: "",
    center: "",
    date: "",
    month: "",
    year: "",
    fullName: "",
    studentId: "",
    branch: "",
    yearLevel: "",
    faculty: "",
    phone: "",
    email: "",
    members: [],
    clubType: "",
    renewalOptions: { option1: false, option2: false },
    newClubOptions: {
      กิจกรรมวิชาการ: false,
      กิจกรรมกีฬา: false,
      กิจกรรมบำเพ็ญประโยชน์: false,
      กิจกรรมคุณธรรม: false,
      กิจกรรมศิลปะ: false,
      กิจกรรมประชาธิปไตย: false,
      กิจกรรมป้องกันยาเสพติด: false,
    },
  });

  // โหลดข้อมูลจาก localStorage ถ้ามี
  useEffect(() => {
    const savedData = localStorage.getItem("form1Data");
    if (savedData) {
      setFormData(JSON.parse(savedData));
    }
  }, []);

  // บันทึกข้อมูลลง localStorage ทุกครั้งที่ formData เปลี่ยนแปลง
  useEffect(() => {
    localStorage.setItem("form1Data", JSON.stringify(formData));
  }, [formData]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleCheckbox = (category, option) => {
    setFormData((prev) => ({
      ...prev,
      [category]: {
        ...prev[category],
        [option]: !prev[category][option], // Toggle ค่า checked
      },
    }));
  };

  const addMember = () => {
    if (formData.members.length < 10) {
      setFormData({ ...formData, members: [...formData.members, ""] });
    }
  };

  const removeMember = (index) => {
    const updatedMembers = [...formData.members];
    updatedMembers.splice(index, 1);
    setFormData({ ...formData, members: updatedMembers });
  };

  return (
    <Container maxWidth="md">
      <h2>เอกสารหน้าแรก</h2>

      <Tabs value={tabIndex} onChange={(e, newValue) => setTabIndex(newValue)}>
        <Tab label="ข้อมูลชมรม" />
        <Tab label="ข้อมูลผู้สมัคร" />
        <Tab label="ประเภทชมรม" />
      </Tabs>

      {tabIndex === 0 && (
        <Box sx={{ display: "flex", flexDirection: "column", gap: 2, mt: 2 }}>
          <TextField label="ชื่อชมรม" name="clubName" value={formData.clubName} onChange={handleChange} fullWidth />
          <TextField label="ศูนย์" name="center" value={formData.center} onChange={handleChange} fullWidth />
          <TextField label="วันที่" name="date" value={formData.date} onChange={handleChange} fullWidth />
          <TextField label="เดือน" name="month" value={formData.month} onChange={handleChange} fullWidth />
          <TextField label="พ.ศ." name="year" value={formData.year} onChange={handleChange} fullWidth />
        </Box>
      )}

      {tabIndex === 1 && (
        <Box sx={{ display: "flex", flexDirection: "column", gap: 2, mt: 2 }}>
          <TextField label="ชื่อ-นามสกุล" name="fullName" value={formData.fullName} onChange={handleChange} fullWidth />
          <TextField label="รหัสนักศึกษา" name="studentId" value={formData.studentId} onChange={handleChange} fullWidth />
          <TextField label="สาขา" name="branch" value={formData.branch} onChange={handleChange} fullWidth />
          <TextField label="ชั้นปี" name="yearLevel" value={formData.yearLevel} onChange={handleChange} fullWidth />
          <TextField label="คณะ" name="faculty" value={formData.faculty} onChange={handleChange} fullWidth />
          <TextField label="เบอร์โทรศัพท์" name="phone" value={formData.phone} onChange={handleChange} fullWidth />
          <TextField label="E-mail" name="email" value={formData.email} onChange={handleChange} fullWidth />
          {formData.members.map((member, index) => (
            <Box key={index} sx={{ display: "flex", gap: 2, alignItems: "center" }}>
              <TextField
                label={`สมาชิก ${index + 1}`}
                value={member}
                onChange={(e) => {
                  const updatedMembers = [...formData.members];
                  updatedMembers[index] = e.target.value;
                  setFormData({ ...formData, members: updatedMembers });
                }}
                fullWidth
              />
              <Button onClick={() => removeMember(index)} variant="contained" color="error">❌</Button>
            </Box>
          ))}
          <Button onClick={addMember} disabled={formData.members.length >= 10} variant="outlined">➕ เพิ่มสมาชิก</Button>
        </Box>
      )}

      {tabIndex === 2 && (
        <Box sx={{ mt: 2 }}>
          <RadioGroup name="clubType" value={formData.clubType} onChange={handleChange}>
            <FormControlLabel value="renewal" control={<Radio />} label="ต่ออายุชมรม" />
            <FormControlLabel value="new" control={<Radio />} label="ชมรมใหม่" />
          </RadioGroup>
          {formData.clubType === "renewal" && (
            <FormGroup>
              <FormControlLabel control={<Checkbox checked={formData.renewalOptions.option1} onChange={() => handleCheckbox("renewalOptions", "option1")} />} label="ในปีที่ผ่านมามีการจัดตั้งชมรมและมีการดำเนินโครงการของชมรม" />
              <FormControlLabel control={<Checkbox checked={formData.renewalOptions.option2} onChange={() => handleCheckbox("renewalOptions", "option2")} />} label="ในปีที่ผ่านมามีการจัดตั้งชมรมแต่ไม่ได้มีการดำเนินโครงการของชมรม" />
            </FormGroup>
          )}
          {formData.clubType === "new" && (
            <FormGroup>
              {Object.keys(formData.newClubOptions).map((key) => (
                <FormControlLabel key={key} control={<Checkbox checked={formData.newClubOptions[key]} onChange={() => handleCheckbox("newClubOptions", key)} />} label={key} />
              ))}
            </FormGroup>
          )}
        </Box>
      )}

      <Box sx={{ display: "flex", justifyContent: "space-between", mt: 3 }}>
      <Button 
  variant="outlined" 
  onClick={() => {
    localStorage.removeItem("form1Data"); // 🔥 ลบข้อมูลใน localStorage
    localStorage.removeItem("form2Data")
    navigate("/student-home"); // ⏪ กลับไปที่หน้า Home
  }}
>
  กลับ Home
</Button>

        <Button variant="contained" color="primary" onClick={() => navigate("/from2")}>ถัดไป</Button>
      </Box>
    </Container>
  );
};

export default Form1;
