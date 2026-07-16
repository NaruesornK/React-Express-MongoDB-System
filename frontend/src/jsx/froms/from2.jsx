import { useState, useEffect } from "react";
import { Container, Box, Button, TextField, Tabs, Tab, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, IconButton, Typography } from "@mui/material";
import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';
import { useNavigate } from "react-router-dom";

const Form2 = () => {
  const navigate = useNavigate();
  const [tabIndex, setTabIndex] = useState(0);

  // โหลดข้อมูลจาก localStorage ถ้ามี
  const getInitialFormData = () => {
    const savedData = localStorage.getItem("form2Data");
    return savedData
      ? JSON.parse(savedData)
      : {
          objectives: ["", "", ""],
          advisors: ["", ""],
          activities: [{ name: '', budget: '', date: '', location: '' }],
          clubAddress: "",
          clubPhone: "",
          clubPresident: "",
          clubAdvisor: "",
        };
  };

  const [formData, setFormData] = useState(getInitialFormData);

  // บันทึกลง localStorage เมื่อ formData เปลี่ยนแปลง
  useEffect(() => {
    localStorage.setItem("form2Data", JSON.stringify(formData));
  }, [formData]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleActivityChange = (index, field, value) => {
    const newActivities = [...formData.activities];
    newActivities[index][field] = value;
    setFormData({ ...formData, activities: newActivities });
  };

  const addActivity = () => {
    if (formData.activities.length < 5) {
      setFormData({
        ...formData,
        activities: [...formData.activities, { name: '', budget: '', date: '', location: '' }]
      });
    }
  };

  const removeActivity = (index) => {
    const newActivities = formData.activities.filter((_, i) => i !== index);
    setFormData({ ...formData, activities: newActivities });
  };

  return (
    <Container maxWidth="md">
      <h2>เอกสารหน้าสอง</h2>
    
      <Tabs value={tabIndex} onChange={(e, newValue) => setTabIndex(newValue)}>
        <Tab label="วัตถุประสงค์กับอาจารย์" />
        <Tab label="กิจกรรมที่คิดจะทำ" />
        <Tab label="ข้อมูลอื่นๆ" />
      </Tabs>
      
      {tabIndex === 0 && (
        <Box sx={{ display: "flex", flexDirection: "column", gap: 2, mt: 2 }}>
          {formData.objectives.map((obj, i) => (
            <TextField
              key={i}
              label={`วัตถุประสงค์ ${i + 1}`}
              value={obj}
              onChange={(e) => {
                const newObjectives = [...formData.objectives];
                newObjectives[i] = e.target.value;
                setFormData({ ...formData, objectives: newObjectives });
              }}
              fullWidth
            />
          ))}
          {formData.advisors.map((advisor, i) => (
            <TextField
              key={i}
              label={`อาจารย์ที่ปรึกษา ${i + 1}`}
              value={advisor}
              onChange={(e) => {
                const newAdvisors = [...formData.advisors];
                newAdvisors[i] = e.target.value;
                setFormData({ ...formData, advisors: newAdvisors });
              }}
              fullWidth
            />
          ))}
        </Box>
      )}

      {tabIndex === 1 && (
        <Box sx={{ display: "flex", flexDirection: "column", gap: 2, mt: 2 }}>
          <Typography variant="h6" gutterBottom>กิจกรรมที่คิดจะทำ</Typography>
          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>ชื่อโครงการ</TableCell>
                  <TableCell>งบประมาณ</TableCell>
                  <TableCell>วันเดือนปี</TableCell>
                  <TableCell>สถานที่</TableCell>
                  <TableCell>ลบ</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {formData.activities.map((activity, index) => (
                  <TableRow key={index}>
                    <TableCell>
                      <TextField
                        value={activity.name}
                        onChange={(e) => handleActivityChange(index, 'name', e.target.value)}
                      />
                    </TableCell>
                    <TableCell>
                      <TextField
                        value={activity.budget}
                        onChange={(e) => handleActivityChange(index, 'budget', e.target.value)}
                      />
                    </TableCell>
                    <TableCell>
                      <TextField
                        value={activity.date}
                        onChange={(e) => handleActivityChange(index, 'date', e.target.value)}
                      />
                    </TableCell>
                    <TableCell>
                      <TextField
                        value={activity.location}
                        onChange={(e) => handleActivityChange(index, 'location', e.target.value)}
                      />
                    </TableCell>
                    <TableCell>
                      <IconButton onClick={() => removeActivity(index)}>
                        <DeleteIcon />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
          <Button
            variant="contained"
            color="primary"
            onClick={addActivity}
            startIcon={<AddIcon />}
            disabled={formData.activities.length >= 5}
          >
            เพิ่มกิจกรรม
          </Button>
        </Box>
      )}

      {tabIndex === 2 && (
        <Box sx={{ mt: 2 }}>
          <TextField fullWidth label="สถานที่ตั้งชมรม" name="clubAddress" value={formData.clubAddress} onChange={handleChange} margin="normal" />
          <TextField fullWidth label="เบอร์" name="clubPhone" value={formData.clubPhone} onChange={handleChange} margin="normal" />
          <TextField fullWidth label="ชื่อประธานชมรม" name="clubPresident" value={formData.clubPresident} onChange={handleChange} margin="normal" />
          <TextField fullWidth label="ที่ปรึกษาชมรม" name="clubAdvisor" value={formData.clubAdvisor} onChange={handleChange} margin="normal" />
        </Box>
      )}

      <Box sx={{ display: "flex", justifyContent: "space-between", mt: 3 }}>
        <Button variant="contained" color="primary" onClick={() => navigate("/from1")}>ย้อนกลับ</Button>
        <Button variant="contained" color="primary" onClick={() => navigate("/from3")}>ถัดไป</Button>
      </Box>
    </Container>
  );
};

export default Form2;
