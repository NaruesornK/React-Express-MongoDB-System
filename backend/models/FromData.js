const mongoose = require("mongoose");

const FormSchema = new mongoose.Schema({
  form1Data: Object,
  form2Data: Object,
  studentName: String,
  selectedTeacher: String,
  signature: String, // ✅ เพิ่มช่องเก็บลายเซ็น (Base64)
  status: String, 
}, { timestamps: true });

module.exports = mongoose.model("FormData", FormSchema);
