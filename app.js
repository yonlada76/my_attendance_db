


import express from 'express'; // นำเข้าโมดูล express
import bodyParser from 'body-parser'; // นำเข้าโมดูล body-parser
import pkg from 'pg'; // นำเข้า pg (PostgreSQL client)

const { Pool } = pkg; // สร้าง Pool จาก pg
const app = express(); // สร้างแอปพลิเคชัน Express
const port = 5001; // กำหนดพอร์ตที่จะใช้

// เชื่อมต่อกับฐานข้อมูล PostgreSQL
const pool = new Pool({
    user: 'postgres',    // แทนที่ด้วยชื่อผู้ใช้ของ PostgreSQL ของคุณ
    host: 'localhost',    // ที่อยู่เซิร์ฟเวอร์ฐานข้อมูล
    database: 'attendance_db', // ชื่อฐานข้อมูล
    password: '0994150630',   // แทนที่ด้วยรหัสผ่านของคุณ
    port: 5432            // พอร์ตที่ใช้สำหรับ PostgreSQL
});

// ตั้งค่า view engine เป็น EJS
app.set('view engine', 'ejs'); // ใช้ EJS เป็น template engine
app.set('views', './views');    // กำหนดตำแหน่งที่ตั้งของไฟล์ view

// ตั้งค่า middleware เพื่อจัดการข้อมูลที่ส่งมาในรูปแบบ URL encoded
app.use(bodyParser.urlencoded({ extended: true }));

// เส้นทางแสดงหน้าเช็คชื่อ (หน้าแรก)
app.get('/', async (req, res) => {
    const result = await pool.query('SELECT * FROM attendance'); // คิวรีข้อมูลจากตาราง attendance
    res.render('index', { students: result.rows }); // เรนเดอร์หน้า index พร้อมข้อมูลนักเรียน
});

// เส้นทางแสดงหน้าเลือกนักเรียนเพื่อตรวจสอบชื่อ
app.get('/checkin', async (req, res) => {
    res.render('checkin'); // เรนเดอร์หน้า checkin
});

// เส้นทางบันทึกสถานะการเช็คชื่อ
app.post('/checkin', async (req, res) => {
    const { student_id, student_name, status } = req.body; // ดึงข้อมูลจากฟอร์ม
    const date = new Date(); // สร้างตัวแปรวันที่

    // คิวรีเพื่อบันทึกข้อมูลการเช็คชื่อ
    await pool.query(
        'INSERT INTO attendance (student_id, student_name, status, date) VALUES ($1, $2, $3, $4)',
        [student_id, student_name, status, date] // ใช้ข้อมูลจากฟอร์ม
    );

    res.redirect('/'); // เปลี่ยนเส้นทางไปยังหน้าแรกหลังบันทึกข้อมูลเสร็จ
});

// เส้นทางสำหรับลบข้อมูล
app.post('/delete', async (req, res) => {
    const { student_id } = req.body; // ดึง student_id จากฟอร์ม

    // คิวรีเพื่อลบข้อมูลจากตาราง attendance
    await pool.query(
        'DELETE FROM attendance WHERE student_id = $1',
        [student_id] // ใช้ student_id ที่ระบุ
    );

    res.redirect('/'); // เปลี่ยนเส้นทางไปยังหน้าแรกหลังลบข้อมูลเสร็จ
});

// เริ่มเซิร์ฟเวอร์
const PORT = 5001; // หรือเลขพอร์ตอื่นๆ ที่คุณต้องการ
app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`); // แสดงข้อความเมื่อเซิร์ฟเวอร์เริ่มทำงาน
});
