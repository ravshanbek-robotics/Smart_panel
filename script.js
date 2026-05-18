// 1. Elementlarni tanitib olamiz
const vazifaMatni = document.getElementById('vazifa-matni');
const qoshishTugmasi = document.getElementById("qo'shish-tugmasi");
const vazifalarRoyxati = document.getElementById("vazifalar-ro'yxati");
const rejimTugmasi = document.getElementById('rejim-tugmasi');

// =================================================================
// 2. BACKEND (API) BILAN GAPLASHISH MANTIQI
// =================================================================

// A. Serverdan barcha vazifalarni yuklab olish funksiyasi (GET so'rovi)
function vazifalarniYuklash() {
    // fetch() — bu Frontendning Backendga yuboradigan pochtachisi
    fetch('/api/vazifalar')
        .then(javob => javob.json()) // Kelgan javobni JSON formatiga o'giramiz
        .then(vazifalar => {
            vazifalarRoyxati.innerHTML = ""; // Ro'yxatni tozalaymiz
            
            // Serverdan kelgan har bitta vazifa uchun ekranda <li> yaratamiz
            vazifalar.forEach(vazifa => {
                const li = document.createElement('li');
                li.textContent = vazifa.matn;
                
                // Har bir vazifaning yoniga o'chirish tugmasini qo'shamiz
                const ochirishBtn = document.createElement('button');
                ochirishBtn.textContent = "❌";
                ochirishBtn.style.float = "right";
                ochirishBtn.style.padding = "2px 5px";
                ochirishBtn.style.backgroundColor = "red";
                
                // O'chirish tugmasi bosilganda API'ga DELETE so'rovi ketadi
                ochirishBtn.onclick = function() {
                    vazifaniOchirish(vazifa.id);
                };
                
                li.appendChild(ochirishBtn);
                vazifalarRoyxati.appendChild(li);
            });
        });
}

// B. Yangi vazifa qo'shish funksiyasi (POST so'rovi)
qoshishTugmasi.addEventListener('click', function() {
    const matn = vazifaMatni.value;

    if (matn !== "") {
        // Backendga JSON paket tayyorlab yuboramiz
        fetch('/api/vazifalar', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ matn: matn }) // JSON matnga aylantirish
        })
        .then(javob => javob.json())
        .then(() => {
            vazifalarniYuklash(); // Ro'yxatni yangilash
            vazifaMatni.value = ""; // Oynani tozalash
        });
    } else {
        alert("Iltimos, matn kiriting!");
    }
});

// D. Vazifani o'chirish funksiyasi (DELETE so'rovi)
function vazifaniOchirish(id) {
    fetch(`/api/vazifalar/${id}`, {
        method: 'DELETE'
    })
    .then(javob => javob.json())
    .then(() => {
        vazifalarniYuklash(); // Ro'yxatni qayta yangilash
    });
}

// Sayt birinchi marta ochilganda bazadagi ma'lumotlarni ekranga chiqarish
vazifalarniYuklash();


// =================================================================
// 3. TUNGI REJIM (Buni LocalStorage'da qoldiramiz, chunki bu dizayn sozlamasi)
// =================================================================
if (localStorage.getItem('sayt_rejimi') === 'dark') {
    document.body.classList.add('dark-mode');
    rejimTugmasi.textContent = "☀️ Kunduzgi rejim";
}

rejimTugmasi.addEventListener('click', function() {
    document.body.classList.toggle('dark-mode');
    if (document.body.classList.contains('dark-mode')) {
        rejimTugmasi.textContent = "☀️ Kunduzgi rejim";
        localStorage.setItem('sayt_rejimi', 'dark');
    } else {
        rejimTugmasi.textContent = "🌙 Tungi rejim";
        localStorage.setItem('sayt_rejimi', 'light');
    }
});