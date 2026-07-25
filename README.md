# Gold Teknik - Web Sitesi + Yönetim Paneli

Bu proje üç parçadan oluşur:
- **Web sitesi** (`/`) — ziyaretçilerin gördüğü tanıtım sitesi ve teklif formu
- **Yönetim paneli** (`/admin`) — şifreyle korunan, gelen teklif taleplerinin listelendiği panel
- **API sunucusu** (`server/`) — teklif taleplerini saklayan, JWT ile korunan Express sunucusu

## Öne çıkan özellikler

- 🔒 Şifre düz metin değil **hash'lenmiş** olarak tutulur, girişte **JWT oturum token'ı** verilir (12 saat geçerli)
- 🛡️ Giriş denemelerine ve form gönderimine **rate limiting** (hız sınırı) uygulanır
- 🤖 Form, görünmez bir **honeypot** alanıyla bot/spam kayıtlarını sessizce eler
- 💬 Sağ altta gerçek numaranıza yönlenen **WhatsApp** butonu
- 📧 SMTP bilgisi girildiğinde yeni talep geldiğinde **otomatik e-posta bildirimi**
- 💾 Veriler dosyaya **atomik olarak** yazılır (yarıda kesilme/veri bozulması riski yok)
- ⚙️ Tüm hassas ayarlar kod içine gömülü değil, **`.env`** dosyasından okunur

## Yerelde çalıştırma

Gereksinim: [Node.js](https://nodejs.org) (v18 veya üzeri).

1. Klasöre girin:
   ```
   cd akim-teknik-app
   ```

2. Bağımlılıkları kurun:
   ```
   npm install
   ```

3. `.env` dosyası hazır geliyor (test için). Kendi bilgilerinizle güncellemek isterseniz
   `.env.example` dosyasını referans alın.

4. Hem API sunucusunu hem de web sitesini birlikte başlatın:
   ```
   npm run dev
   ```

   Bu komut iki süreci aynı anda çalıştırır:
   - API sunucusu → `http://localhost:3001`
   - Web sitesi → `http://localhost:5173` (otomatik açılır)

   İsterseniz ikisini ayrı terminallerde de çalıştırabilirsiniz:
   ```
   npm run server   # sadece API
   npm run client   # sadece site
   ```

## Yönetim paneline giriş

Tarayıcıda `http://localhost:5173/admin` adresine gidin (site footer'ında da "Yönetici Girişi" linki var).

**Varsayılan şifre:** `goldteknik2026`

Şifreyi ve diğer ayarları değiştirmek için proje kök klasöründeki **`.env`** dosyasını düzenleyin:
```
ADMIN_PASSWORD=gizli-sifreniz
JWT_SECRET=uzun-rastgele-bir-metin
```
`.env` dosyasını değiştirdikten sonra sunucuyu yeniden başlatmanız gerekir.

Panelde yapabilecekleriniz:
- Gelen tüm teklif taleplerini görüntüleme (ad, e-posta, telefon, hizmet, mesaj, tarih)
- Durum güncelleme: **Yeni → Aranıyor → Tamamlandı**
- Duruma göre filtreleme
- Talep silme
- Yenile butonu ile anlık güncelleme

## E-posta bildirimlerini açma

`.env` dosyasına SMTP bilgilerinizi girin:
```
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=siz@gmail.com
SMTP_PASS=uygulama-sifreniz
NOTIFY_EMAIL=info@goldteknik.com
```
Gmail kullanıyorsanız normal şifreniz değil, Google hesap ayarlarından oluşturacağınız
bir "Uygulama Şifresi" (App Password) gerekir. Bu alanlar boş bırakılırsa e-posta
bildirimi devre dışı kalır, site ve form normal çalışmaya devam eder.

## WhatsApp numarasını değiştirme

`src/pages/Site.jsx` dosyasının en üstünde:
```js
const WHATSAPP_NUMBER = "905345618680"; // başında + olmadan, ülke koduyla
const WHATSAPP_MESSAGE = "Merhaba, Gold Teknik'ten teklif almak istiyorum.";
```

## Verilerin saklandığı yer

Gelen tüm teklif talepleri `server/data/quotes.json` dosyasında saklanır. Bu basit dosya tabanlı
bir depolamadır — küçük/orta trafikli bir site için yeterlidir. Siteyi gerçek bir sunucuya
taşırken bu dosyanın silinmemesine dikkat edin, ya da ileride bir veritabanına (PostgreSQL,
SQLite vb.) geçirebilirsiniz.

## Vercel'e dağıtım (production)

Bu proje Vercel'de tek parça olarak çalışacak şekilde hazırlandı: site statik olarak,
API ise `/api` klasöründeki serverless function üzerinden yayınlanır, veriler Vercel
Postgres'te saklanır.

### 1. Projeyi Vercel'e bağlayın

- [vercel.com](https://vercel.com) üzerinden GitHub/GitLab reposu olarak içe aktarın,
  **veya** yerelden CLI ile:
  ```
  npm install -g vercel
  vercel
  ```
- Framework olarak "Vite" otomatik algılanır; `vercel.json` zaten build ayarlarını içeriyor.

### 2. Postgres veritabanı ekleyin (ücretsiz — Neon üzerinden)

Vercel proje panelinde **Storage → Create Database** yolunu izleyin. Vercel artık
Postgres'i **Neon** entegrasyonu üzerinden sunuyor — "Marketplace Database Providers"
listesinden **Neon (Serverless Postgres)** seçin, ücretsiz plan ile oluşturup projenize
bağlayın. Bu adımda Vercel, **`DATABASE_URL`** ortam değişkenini **otomatik olarak** ekler —
başka hiçbir şey yapmanıza gerek yok. Kod, `DATABASE_URL` (veya eski `POSTGRES_URL`) varsa
otomatik olarak Postgres'i kullanır; yoksa (yerelde olduğu gibi) dosyaya yazmaya devam eder.

İlk istek geldiğinde `quotes` tablosu kendiliğinden oluşturulur (elle SQL çalıştırmanıza gerek yok).

**Önemli:** Veritabanını bağladıktan sonra **mutlaka yeniden deploy edin** (Deployments →
en son deployment → ⋯ → Redeploy). Ortam değişkeni ancak yeni bir deploy ile devreye girer.

### 3. Ortam değişkenlerini ayarlayın

Vercel proje panelinde **Settings → Environment Variables** kısmına şunları ekleyin:

| Değişken | Açıklama |
|---|---|
| `ADMIN_PASSWORD` | Yönetim paneli şifreniz (güçlü bir şifre seçin) |
| `JWT_SECRET` | Rastgele, uzun bir metin (`openssl rand -hex 32` ile üretebilirsiniz) |
| `SMTP_HOST`, `SMTP_PORT`, `SMTP_USER`, `SMTP_PASS`, `NOTIFY_EMAIL` | (opsiyonel) e-posta bildirimleri için |

`DATABASE_URL` değişkenini siz eklemezsiniz — 2. adımda Neon/Vercel otomatik ekler.

### 4. Yeniden dağıtın

Ortam değişkenlerini ekledikten sonra **Deployments** sekmesinden son dağıtımı yeniden
tetikleyin (redeploy) ki yeni değerler devreye girsin.

Bundan sonra siteniz `https://proje-adiniz.vercel.app` gibi bir adreste, `/admin` paneli
de aynı domain altında `https://proje-adiniz.vercel.app/admin` olarak yayında olacak.

### Bilinmesi gerekenler

- Rate limiting (hız sınırlama) her "soğuk başlangıç"ta sıfırlanabilir; serverless
  ortamının doğası gereği dosya/bellek tabanlı sınırlamalar tek bir sunucudaki kadar
  kesin değildir. Yoğun trafik beklenen bir site için Vercel'in kendi güvenlik
  duvarı/CAPTCHA çözümleri ek katman olarak düşünülebilir.
- Kendi domain'inizi bağlamak için Vercel panelinde **Settings → Domains** kısmını kullanın.


## Dosya yapısı

```
akim-teknik-app/
├── .env                    # Yerel ayarlar (şifre, JWT anahtarı, SMTP — git'e dahil değil)
├── .env.example             # Hangi ayarların olduğunu gösteren şablon
├── vercel.json               # Vercel build ve yönlendirme ayarları
├── api/
│   └── index.js               # Vercel serverless function girişi (Express app'i sarar)
├── server/
│   ├── app.js                # Express uygulaması: rotalar, auth, rate limit, honeypot
│   ├── index.js                # Yerel geliştirme girişi (app.listen ile port açar)
│   ├── db.js                   # Depolama katmanı: Postgres varsa o, yoksa yerel dosya
│   └── data/quotes.json        # (yerel mod) Teklif taleplerinin saklandığı dosya
├── src/
│   ├── theme.jsx               # Ortak renkler, yazı tipleri, tekrar kullanılan bileşenler
│   ├── App.jsx                  # Sayfa yönlendirme (/  ve  /admin)
│   ├── main.jsx                   # React giriş noktası
│   └── pages/
│       ├── Site.jsx                # Herkese açık tanıtım sitesi + WhatsApp butonu
│       └── Admin.jsx               # Giriş ekranı + yönetim paneli
├── index.html
├── vite.config.js                  # Yerel geliştirmede /api isteklerini 3001'e yönlendiren proxy
└── package.json
```

## İçeriği düzenleme

Placeholder içerikleri (hizmetler, istatistikler, projeler) `src/pages/Site.jsx` dosyasının
üst kısmındaki `services`, `stats`, `projects`, `categories` dizilerinden değiştirebilirsiniz.
