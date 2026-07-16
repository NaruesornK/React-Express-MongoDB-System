const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");

// โมเดลสำหรับเก็บข้อมูล Form
const FormData = mongoose.model(
  "FormData",
  new mongoose.Schema({
    form1Data: Object,
    form2Data: Object,
    studentName: String,
    selectedTeacher: String,
    signature: String,
    status: String,
    createdAt: { type: Date, default: Date.now },
  })
);

// ✅ บันทึกข้อมูล Form
router.post("/save-form", async (req, res) => {
  try {
    const { form1Data, form2Data, studentName, selectedTeacher,status } = req.body;
    const newForm = new FormData({ form1Data, form2Data, studentName, selectedTeacher,status, });
    await newForm.save();
    res.json({ success: true, message: "บันทึกข้อมูลสำเร็จ!" });
  } catch (error) {
    console.error("❌ Error saving form:", error);
    res.status(500).json({ success: false, error: "บันทึกข้อมูลไม่สำเร็จ" });
  }
});

/////////////////// ดึงข้อมูลทั้งหมด จาก MongoDB
router.get("/documents", async (req, res) => {
  try {
    const documents = await FormData.find().sort({ createdAt: -1 }); // เรียงลำดับจากใหม่ → เก่า
    res.json(documents);
  } catch (error) {
    console.error("❌ Error fetching documents:", error);
    res.status(500).json({ success: false, error: "ไม่สามารถดึงข้อมูลได้" });
  }
});

///////////////////////////////////// ลายเซ็น
router.post("/save-signature", async (req, res) => {
  try {
    console.log("🟢 รับข้อมูลจาก Frontend:", req.body); // ✅ Debug ค่าที่รับมา

    const { docId, signature } = req.body;

    if (!docId || !signature) {
      return res.status(400).json({ success: false, error: "ข้อมูลไม่ครบ" });
    }

    const updatedDoc = await FormData.findByIdAndUpdate(docId, { signature }, { new: true });

    if (!updatedDoc) {
      return res.status(404).json({ success: false, error: "ไม่พบเอกสาร" });
    }

    res.json({ success: true, message: "บันทึกลายเซ็นสำเร็จ!", data: updatedDoc });
  } catch (error) {
    console.error("❌ Error saving signature:", error);
    res.status(500).json({ success: false, error: "เกิดข้อผิดพลาด" });
  }
});




module.exports = router;
