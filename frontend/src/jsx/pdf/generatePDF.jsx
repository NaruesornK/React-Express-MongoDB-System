import React, { useState, useEffect } from "react";
import { Box, Button, CircularProgress } from "@mui/material";
import { PDFDocument, rgb, StandardFonts } from "pdf-lib";
import fontkit from "@pdf-lib/fontkit";

const PdfPreview = () => {
  const [pdfUrl, setPdfUrl] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const generatePDF = async () => {
      try {
        console.log("📢 เริ่มต้นสร้าง PDF...");

        setLoading(true);

        // ✅ โหลดข้อมูลจาก localStorage
        const form1Data = JSON.parse(localStorage.getItem("form1Data") || "{}");
        const form2Data = JSON.parse(localStorage.getItem("form2Data") || "{}");

        if (Object.keys(form1Data).length === 0 || Object.keys(form2Data).length === 0) {
          alert("❌ ไม่มีข้อมูล กรุณากรอกแบบฟอร์มก่อน!");
          setLoading(false);
          return;
        }

        // ✅ โหลด PDF ต้นฉบับ
        console.log("📢 กำลังโหลดไฟล์ PDF...");
        const pdfPath = "/test.pdf"; // ต้องอยู่ใน public/
        const response = await fetch(pdfPath);

        if (!response.ok) {
          throw new Error("❌ ไม่พบไฟล์ PDF!");
        }
      

        console.log("✅ ปรับขนาดเป็น A4");

        const existingPdfBytes = await response.arrayBuffer();
        console.log("✅ โหลดไฟล์ PDF สำเร็จ!");

        const pdfDoc = await PDFDocument.load(existingPdfBytes);
        console.log("✅ โหลด PDFDocument สำเร็จ!");const pages = pdfDoc.getPages();

        // ตรวจสอบว่ามีหน้าพอไหม ถ้าไม่มีให้เพิ่มหน้าใหม่
       
        
        // ดึงหน้าที่ต้องการ
        const page = pages[0]; // หน้าแรก
        const page1 = pages[1]; // หน้าที่สอง
        // กำหนดขนาดให้ทั้งสองหน้า
        page.setSize(595, 842);
        page1.setSize(595, 842);
        
        console.log("✅ กำหนดขนาดหน้า PDF เรียบร้อยแล้ว!");
        

        // ✅ ใช้ฟอนต์
        // ✅ โหลดฟอนต์จาก public/fonts
        pdfDoc.registerFontkit(fontkit);

        // ✅ โหลดฟอนต์ภาษาไทยจาก public/fonts
        const fontUrl = "./THSarabunNew.ttf"; 
        const fontBytes = await fetch(fontUrl).then((res) => res.arrayBuffer());
    
        // ✅ ฝังฟอนต์ภาษาไทยลงใน PDF
        const font = await pdfDoc.embedFont(fontBytes);

  // 🎯 **เติมข้อมูลลงไปตามตำแหน่ง**
  page.drawText(form1Data.clubName || "", { x: 150, y: 774, size: 15, font, color: rgb(0, 0, 0) });
  page.drawText(form1Data.center || "", { x: 360, y: 774, size: 15, font, color: rgb(0, 0, 0) });
  page.drawText(form1Data.date || "", { x: 345, y: 692, size: 15, font, color: rgb(0, 0, 0) });
  page.drawText(form1Data.month || "", { x: 394, y: 692, size: 15, font, color: rgb(0, 0, 0) });
  page.drawText(form1Data.year || "", { x: 476, y: 692, size: 15, font, color: rgb(0, 0, 0) });

  page.drawText(form1Data.clubName || "", { x: 260, y: 666, size: 15, font, color: rgb(0, 0, 0) });
  page.drawText(form1Data.fullName || "", { x: 200, y: 617, size: 15, font, color: rgb(0, 0, 0) });
  page.drawText(form1Data.studentId || "", { x: 460, y: 617, size: 15, font, color: rgb(0, 0, 0) });
  page.drawText(form1Data.branch || "", { x: 120, y: 596, size: 15, font, color: rgb(0, 0, 0) });
  page.drawText(form1Data.yearLevel || "", { x: 250, y: 596, size: 15, font, color: rgb(0, 0, 0) });
  page.drawText(form1Data.faculty || "", { x: 380, y: 596, size: 15, font, color: rgb(0, 0, 0) });
  page.drawText(form1Data.phone || "", { x: 140, y: 575, size: 15, font, color: rgb(0, 0, 0) });
  page.drawText(form1Data.email || "", { x: 330, y: 575, size: 15, font, color: rgb(0, 0, 0) });

  // ✅ รายชื่อสมาชิก (สูงสุด 10 คน)
  form1Data.members?.forEach((member, index) => {
    page.drawText(member || "", { x: 180, y: 532 - index * 21.2, size: 15, font, color: rgb(0, 0, 0) });
  });
  page.drawText(form1Data.clubName || "", { x: 230, y: 320, size: 15, font, color: rgb(0, 0, 0) });

    if (form1Data.renewalOptions.option1) {
      page.drawText("/", { x: 188, y: 255, size: 25, font, color: rgb(0, 0, 0) });
      page.drawText("/", { x: 151, y: 277, size: 25, font, color: rgb(0, 0, 0) });
    };

    if (form1Data.renewalOptions.option2) {
      page.drawText("/", { x: 188, y: 235, size: 25, font, color: rgb(0, 0, 0) });
      page.drawText("/", { x: 151, y: 277, size: 25, font, color: rgb(0, 0, 0) });
    };



    if (form1Data.newClubOptions.กิจกรรมวิชาการ) {
      page.drawText("/", { x: 188, y: 170, size: 25, font, color: rgb(0, 0, 0) });
      page.drawText("/", { x: 151, y: 213, size: 25, font, color: rgb(0, 0, 0) });
    };

    if (form1Data.newClubOptions.กิจกรรมกีฬา) {
      page.drawText("/", { x: 188, y: 150, size: 25, font, color: rgb(0, 0, 0) });
      page.drawText("/", { x: 151, y: 213, size: 25, font, color: rgb(0, 0, 0) });
    };

    if (form1Data.newClubOptions.กิจกรรมบำเพ็ญประโยชน์) {
      page.drawText("/", { x: 188, y: 130, size: 25, font, color: rgb(0, 0, 0) });
      page.drawText("/", { x: 151, y: 213, size: 25, font, color: rgb(0, 0, 0) });
    };

    if (form1Data.newClubOptions.กิจกรรมคุณธรรม) {
      page.drawText("/", { x: 188, y: 109, size: 25, font, color: rgb(0, 0, 0) });
      page.drawText("/", { x: 151, y: 213, size: 25, font, color: rgb(0, 0, 0) });
    };


    if (form1Data.newClubOptions.กิจกรรมศิลปะ) {
      page.drawText("/", { x: 188, y: 86, size: 25, font, color: rgb(0, 0, 0) });
      page.drawText("/", { x: 151, y: 213, size: 25, font, color: rgb(0, 0, 0) });
    };

    if (form1Data.newClubOptions.กิจกรรมประชาธิปไตย) {
      page.drawText("/", { x: 188, y: 66, size: 25, font, color: rgb(0, 0, 0) });
      page.drawText("/", { x: 151, y: 213, size: 25, font, color: rgb(0, 0, 0) });
    };


    if (form1Data.newClubOptions.กิจกรรมป้องกันยาเสพติด) {
      page.drawText("/", { x: 188, y: 46, size: 25, font, color: rgb(0, 0, 0) });
      page.drawText("/", { x: 151, y: 213, size: 25, font, color: rgb(0, 0, 0) });
    };


  // ✅ วัตถุประสงค์
  form2Data.objectives?.forEach((objective, index) => {
    page1.drawText(objective || "", { x: 210, y: 775 - index * 20, size: 15, font, color: rgb(0, 0, 0) });
  });

  // ✅ อาจารย์ที่ปรึกษา
  form2Data.advisors?.forEach((advisor, index) => {
    page1.drawText(advisor || "", { x: 240, y: 690 - index * 20, size: 15, font, color: rgb(0, 0, 0) });
  });


  /// ตาราง
  form2Data.activities?.forEach((activity, index) => {
    page1.drawText(activity.name || "", { x: 140, y: 590 - index * 21.5, size: 15, font, color: rgb(0, 0, 0) });
    page1.drawText(activity.budget || "", { x: 320, y: 590 - index * 21.5, size: 15, font, color: rgb(0, 0, 0) });
    page1.drawText(activity.date || "", { x: 410, y: 590 - index * 21.5, size: 15, font, color: rgb(0, 0, 0) });
    page1.drawText(activity.location || "", { x: 490, y: 590 - index * 21.5, size: 15, font, color: rgb(0, 0, 0) });
  });  




  // ✅ สถานที่ตั้งชมรม
  page1.drawText(form2Data.clubAddress || "", { x: 230, y: 423, size: 15, font, color: rgb(0, 0, 0) });
  page1.drawText(form2Data.clubPhone || "", { x: 480, y: 423, size: 15, font, color: rgb(0, 0, 0) });
  page1.drawText(form2Data.clubPresident || "", { x: 130, y: 335, size: 15, font, color: rgb(0, 0, 0) });
  page1.drawText(form2Data.clubAdvisor || "", { x: 370, y: 335, size: 15, font, color: rgb(0, 0, 0) });
  page1.drawText(form1Data.clubName || "", { x: 170, y: 313, size: 15, font, color: rgb(0, 0, 0) });
  page1.drawText(form1Data.clubName || "", { x: 400, y: 313, size: 15, font, color: rgb(0, 0, 0) });

        console.log("✅ เพิ่มข้อมูลลง PDF สำเร็จ!");

        // ✅ บันทึก PDF ใหม่
        console.log("📢 กำลังบันทึก PDF...");
        const pdfBytes = await pdfDoc.save();
        console.log("✅ บันทึก PDF สำเร็จ!");

        const pdfBlob = new Blob([pdfBytes], { type: "application/pdf" });
        const newPdfUrl = URL.createObjectURL(pdfBlob);

        console.log("✅ PDF พร้อมใช้งาน:", newPdfUrl);
        setPdfUrl(newPdfUrl);
      } catch (error) {
        console.error("❌ Error:", error);
        alert("เกิดข้อผิดพลาดในการสร้าง PDF!");
      } finally {
        setLoading(false);
      }
    };

    generatePDF(); // ✅ เรียกฟังก์ชันที่ใช้ async/await ภายใน useEffect()
  }, []); // ✅ ทำงานแค่ครั้งเดียวเมื่อ Component โหลด

  return (
    <Box textAlign="center">
      <h2>แสดงตัวอย่าง PDF</h2>
      {loading ? (
        <CircularProgress />
      ) : pdfUrl ? (
        <>
          <iframe src={pdfUrl} width="100%" height="500px"></iframe>
          <Button variant="contained" color="success" sx={{ mt: 2 }} onClick={() => window.open(pdfUrl)}>
            ⬇️ เปิดเต็มจอ PDF
          </Button>
        </>
      ) : (
        <p>ไม่สามารถโหลด PDF ได้</p>
      )}
    </Box>
  );
};

export default PdfPreview;
