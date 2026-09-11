# 📹 Transcript Çevirici - Kurulum Rehberi

Basit ve hızlı kurulum (API key gerekmiyor!)

## ✅ Gereklilikler

- Python 3.8+
- Node.js 16+ (React için)
- pip

---

## 🚀 1. BACKEND KURULUMU (Python Flask)

### Adım 1: Dizin oluştur ve git clone yap
```bash
cd ~/projects  # veya istediğin yere
git clone <repo-link>
cd transcript-cevirici
```

### Adım 2: Python virtual environment kur
```bash
python3 -m venv venv
source venv/bin/activate  # Linux/Mac
# veya
venv\Scripts\activate  # Windows
```

### Adım 3: Paketleri yükle
```bash
pip install -r requirements.txt
```

### Adım 4: Backend'i çalıştır
```bash
python app.py
```

**Çıktı şöyle görünmeli:**
```
 * Running on http://127.0.0.1:5000
 * Press CTRL+C to quit
```

---

## 🎨 2. FRONTEND KURULUMU (React + Vite)

**Yeni terminal açarak** (backend ayakta kalmalı):

### Adım 1: React projesi oluştur
```bash
npm create vite@latest transcript-frontend -- --template react
cd transcript-frontend
npm install
```

### Adım 2: React bileşenini kopyala
Frontend dosyasını (`transcript_app.jsx`) `src/` klasörüne kopyala ve `App.jsx` dosyasını değiştir.

### Adım 3: Development server'ı çalıştır
```bash
npm run dev
```

**Çıktı şöyle görünmeli:**
```
  VITE v4.x.x  ready in 123 ms
  ➜  Local:   http://localhost:5173/
```

---

## 🎉 3. KULLAN

Tarayıcıda aç: **http://localhost:5173/**

1. YouTube video URL'ini yapıştır
2. "Transcript Çek" butonuna tıkla
3. Dil seç ve "Çevir" butonuna tıkla
4. Kopyala veya İndir

---

## ⚠️ Sorun Giderilmesi

### "CORS hatası" alıyorum
- Backend'in `http://localhost:5000` adresinde çalışıyor mu kontrol et
- Eğer farklı porta çalışıyorsa `transcript_app.jsx`'de URL'i düzelt

### "youtube-transcript-api hatası"
- Video açık transcript'e sahip mi? (Bazı videolar gizli transcript'i vardır)
- Video kaldırılmış mı kontrol et

### "google-trans-new çeviri yapmıyor"
- İnternet bağlantısını kontrol et
- Çok sık istek gönderiyorsan Google limit koyabilir (1-2 dakika bekle)

### Backend başlamıyor
```bash
pip install -r requirements.txt  # Tekrar yükle
python app.py
```

---

## 📦 Deployment (İsteğe Bağlı)

### Vercel (React Frontend)
```bash
npm run build
vercel deploy
```

### Heroku / Railway (Python Backend)
```bash
# Heroku
heroku login
heroku create my-app
git push heroku main

# Ya da Railway.app (daha kolay)
railway up
```

---

## 🎯 Temel Dosyalar

```
transcript-cevirici/
├── app.py                 # Flask backend
├── requirements.txt       # Python dependencies
├── KURULUM.md            # Bu dosya
└── transcript-frontend/
    ├── src/
    │   ├── App.jsx       # Main React component
    │   └── main.jsx
    ├── package.json
    └── vite.config.js
```

---

## 🆘 Hızlı Komutlar

**Backend çalıştır:**
```bash
source venv/bin/activate && python app.py
```

**Frontend çalıştır:**
```bash
cd transcript-frontend && npm run dev
```

**İkisini birden (farklı terminallerde):**
```
Terminal 1: python app.py
Terminal 2: npm run dev
```

---

İşlem tamamlandı! 🎉

Sorularınız varsa sor, ben yanındayım!
