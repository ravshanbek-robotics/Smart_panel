// 1. Kerakli global kutubxonalarni chaqirib olamiz
const express = require('express');
const sqlite3 = require('sqlite3'); // Shunchaki .verbose() qismini olib tashladik
const path = require('path');

const app = express();
const PORT = 3000; // Serverimiz ishlaydigan port (manzil)

// Server tushunishi uchun: Kelayotgan JSON paketlarni avtomatik o'qishni yoqamiz
app.use(express.json());

// Frontend fayllarimiz (HTML, CSS) joylashgan papkani serverga ulaymiz
app.use(express.static(path.join(__dirname)));

// =================================================================
// 2. MA'LUMOTLAR BAZASI BILAN ISHLASH (SQLite)
// =================================================================
// Kompyuterda 'vazifalar.db' degan fayl ko'rinishidagi bazani ochamiz (yoki yaratamiz)
const db = new sqlite3.Database('./vazifalar.db', (err) => {
    if (err) {
        console.error("Bazaga ulanishda xato:", err.message);
    } else {
        console.log("SQLite ma'lumotlar bazasiga muvaffaqiyatli ulandik!");
    }
});

// Baza ichida 'vazifalar' jadvalini (Table) yaratamiz (Agar oldin yaratilmagan bo'lsa)
// Bu xuddi Data Science'dagi jadvallarga o'xshaydi: id (ustun) va matn (ustun)
db.run(`CREATE TABLE IF NOT EXISTS vazifalar (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    matn TEXT NOT NULL
)`);


// =================================================================
// 3. API MARSHRUTLARINI TUZAMIZ (REST API & JSON)
// =================================================================

// A. GET So'rovi: Bazadagi barcha vazifalarni olib kelib Frontendga JSON ko'rinishida beradi
app.get('/api/vazifalar', (req, res) => {
    const sql = "SELECT * FROM vazifalar";
    
    db.all(sql, [], (err, qatorlar) => {
        if (err) {
            res.status(500).json({ xato: err.message });
            return;
        }
        // Frontendga ma'lumotni toza JSON (massiv) holatida qaytaramiz
        res.json(qatorlar);
    });
});

// B. POST So'rovi: Frontenddan kelgan yangi vazifani qabul qilib, bazaga yozadi
app.post('/api/vazifalar', (req, res) => {
    const kelganMatn = req.body.matn; // JSON ichidagi 'matn' kalitini o'qiymiz

    if (!kelganMatn) {
        res.status(400).json({ xato: "Matn kiritish majburiy!" });
        return;
    }

    const sql = "INSERT INTO vazifalar (matn) VALUES (?)";
    db.run(sql, [kelganMatn], function(err) {
        if (err) {
            res.status(500).json({ xato: err.message });
            return;
        }
        // Yangi qo'shilgan vazifani ID raqami bilan birga JSON qilib qaytaramiz
        res.json({ id: this.lastID, matn: kelganMatn });
    });
});

// D. DELETE So'rovi: ID raqami berilgan vazifani bazadan o'chirib tashlaydi
app.delete('/api/vazifalar/:id', (req, res) => {
    const ocharId = req.params.id; // URL'dan ID'ni sug'urib olamiz

    const sql = "DELETE FROM vazifalar WHERE id = ?";
    db.run(sql, ocharId, function(err) {
        if (err) {
            res.status(500).json({ xato: err.message });
            return;
        }
        res.json({ xabar: "Vazifa muvaffaqiyatli o'chirildi", ocharId: ocharId });
    });
});


// =================================================================
// 4. SERVERNI ISHGA TUSHIRISH
// =================================================================
app.listen(PORT, () => {
    console.log(`Serverimiz ishga tushdi: http://localhost:${PORT}`);
});