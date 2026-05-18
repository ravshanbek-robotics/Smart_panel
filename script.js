// 1. Elementlarni tanib olish
const vazifaMatni = document.getElementById('vazifa-matni');
const qoshishTugmasi = document.getElementById("qo'shish-tugmasi");
const vazifalarRoyxati = document.getElementById("vazifalar-ro'yxati");
const rejimTugmasi = document.getElementById('rejim-tugmasi');

// LocalStorage'dan eski vazifalarni o'qish (agar bo'lsa)
let vazifalarMassivi = JSON.parse(localStorage.getItem('vazifalar_keshi')) || [];

// 2. Vazifalarni ekranga chiqarish funksiyasi
function chizish() {
    vazifalarRoyxati.innerHTML = "";
    vazifalarMassivi.forEach((vazifa, indeks) => {
        const li = document.createElement('li');
        li.textContent = vazifa;

        const ochirishBtn = document.createElement('button');
        ochirishBtn.textContent = "❌";
        ochirishBtn.style.float = "right";
        ochirishBtn.style.padding = "2px 5px";
        ochirishBtn.style.backgroundColor = "red";
        ochirishBtn.style.width = "auto";
        ochirishBtn.style.cursor = "pointer";

        ochirishBtn.onclick = function() {
            vazifalarMassivi.splice(indeks, 1);
            localStorage.setItem('vazifalar_keshi', JSON.stringify(vazifalarMassivi));
            chizish();
        };

        li.appendChild(ochirishBtn);
        vazifalarRoyxati.appendChild(li);
    });
}

// 3. Qo'shish tugmasi hodisasi
qoshishTugmasi.addEventListener('click', function() {
    const matn = vazifaMatni.value.trim();
    if (matn !== "") {
        vazifalarMassivi.push(matn);
        localStorage.setItem('vazifalar_keshi', JSON.stringify(vazifalarMassivi));
        chizish();
        vazifaMatni.value = "";
    } else {
        alert("Iltimos, matn kiriting!");
    }
});

// Birinchi marta yuklanganda chizish
chizish();

// 4. Tungi rejim sozlamasi
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
