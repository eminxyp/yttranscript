# 🚀 GitHub Pages + Cloudflare Workers Kurulum

**5 dakika = site canlı olur!**

---

## 📋 Ne Yapacağız?

- Frontend: GitHub Pages (`USERNAME.github.io/ytttranscript`)
- Backend: Cloudflare Workers (YouTube API + Çeviri)
- Sonuç: https://username.github.io/ytttranscript (canlı!)

---

## ✅ ADIM 1: GitHub Repo Oluştur

1. https://github.com/new aç
2. **Repository name**: `ytttranscript`
3. ✅ Repo'yu oluştur

---

## ✅ ADIM 2: Dosyaları GitHub'a Push Et

Komut satırında:

```bash
# Repo'yu clone et (SENIN_USERNAME'ini değiştir!)
git clone https://github.com/SENIN_USERNAME/ytttranscript.git
cd ytttranscript

# Dosyaları kopyala
# (index.html, wrangler.toml, src/index.js)

# Git'e ekle
git add .
git commit -m "İlk commit: Transcript çevirici"
git push origin main
```

---

## ✅ ADIM 3: GitHub Pages Aç

1. GitHub repo sayfasında **Settings** tıkla
2. Sol menüde **Pages** seç
3. **Branch**: `main` seç
4. **Folder**: `/root` seç
5. ✅ **Save** tıkla

**Sitesin URL'si**: `https://SENIN_USERNAME.github.io/ytttranscript`

---

## ✅ ADIM 4: Cloudflare Worker Deploy Et

### A. Cloudflare'ye Kaydol
https://dash.cloudflare.com/sign-up

### B. Wrangler Kur (Terminal'de)

```bash
npm install -g wrangler
```

### C. Login Ol

```bash
wrangler login
```

(Tarayıcıda açılacak, authorize et)

### D. Worker'ı Deploy Et

```bash
# ytttranscript klasöründe
wrangler publish
```

**Çıktı:**
```
✓ Successfully published your Worker
https://ytttranscript.RANDOM.workers.dev
```

**Bu URL'yi kaydet!**

---

## ✅ ADIM 5: Frontend'i Güncelle

`index.html` dosyasında şu satırı bul:

```javascript
const API_URL = 'https://ytttranscript.YOUR_WORKERS_DOMAIN.workers.dev';
```

Şunu değiştir:

```javascript
const API_URL = 'https://ytttranscript.RANDOM.workers.dev';
```

(RANDOM kısmını, Cloudflare'nin verdiği URL'den kopyala)

### GitHub'a Push Et

```bash
git add index.html
git commit -m "API URL güncellendi"
git push origin main
```

---

## ✅ ADIM 6: TEST ET 🎉

Tarayıcında aç:
```
https://SENIN_USERNAME.github.io/ytttranscript
```

Test et:
1. YouTube URL yapıştır
2. "Transcript Çek" tıkla
3. Dil seç ve "Çevir" tıkla
4. Kopyala/İndir test et

---

## 🆘 Sorun Giderilmesi

### "API_URL undefined hatası"
- `index.html` dosyasında `const API_URL` değerini kontrol et
- Cloudflare Worker URL'sini doğru yazmış mı?

### CORS hatası
- Cloudflare Worker'da CORS headers ekli mi? (Var)
- Doğru URL'i mi kullanıyorsun?

### YouTube Transcript Hatası
- Video'nun transcript'i açık mı?
- İnternet bağlantısı var mı?

### Port zaten kullanımda
- GitHub Pages'ta bu sorun yok (otomatik kurulur)

---

## 📱 Mobil Uyumlu
- Siteyi mobilde açabilirsin
- Responsive tasarım: ✓

---

## 🔄 Güncellemeler

Frontend güncellemek:
```bash
# index.html'de değişiklik yap
git add .
git commit -m "Açıklama"
git push origin main
```

Backend güncellemek:
```bash
# src/index.js'de değişiklik yap
wrangler publish
```

---

## 📊 Dosya Yapısı

```
ytttranscript/
├── index.html          # Frontend (GitHub Pages)
├── wrangler.toml       # Worker config
├── src/
│   └── index.js        # Worker code (Cloudflare)
└── README.md
```

---

## 🎯 Özet

| Görev | Platform | URL |
|-------|----------|-----|
| Frontend | GitHub Pages | `username.github.io/ytttranscript` |
| Backend | Cloudflare Workers | `ytttranscript.random.workers.dev` |

---

**Tamamlandı!** Siteni başkasına linkini gönderebilirsin. 🚀

Sorun yaşarsan sor!
