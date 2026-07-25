import "dotenv/config";
import express from "express";
import cors from "cors";
import helmet from "helmet";
import rateLimit from "express-rate-limit";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import nodemailer from "nodemailer";
import { listQuotes, insertQuote, updateQuoteStatus, deleteQuote, storageMode } from "./db.js";

// --- Configuration (override via .env locally, or Vercel Project Settings > Environment Variables) ---
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || "goldteknik2026";
const JWT_SECRET = process.env.JWT_SECRET || "gold-teknik-dev-secret-change-me";
const ADMIN_PASSWORD_HASH = bcrypt.hashSync(ADMIN_PASSWORD, 10);

if (!process.env.JWT_SECRET) {
  console.warn("[uyari] JWT_SECRET tanimli degil, gecici bir anahtar kullaniliyor. Uretimde mutlaka ayarlayin.");
}

console.log(`[bilgi] Veri deposu: ${storageMode === "postgres" ? "Vercel Postgres" : "yerel dosya (server/data/quotes.json)"}`);

// --- Optional email notifications (only activates if SMTP_* are set) ---
let mailer = null;
if (process.env.SMTP_HOST && process.env.SMTP_USER && process.env.SMTP_PASS) {
  mailer = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: Number(process.env.SMTP_PORT || 587),
    secure: Number(process.env.SMTP_PORT) === 465,
    auth: { user: process.env.SMTP_USER, pass: process.env.SMTP_PASS },
  });
  console.log("[bilgi] E-posta bildirimleri aktif ->", process.env.NOTIFY_EMAIL || process.env.SMTP_USER);
} else {
  console.log("[bilgi] E-posta bildirimleri kapali. Aktif etmek icin SMTP_* degerlerini girin (bkz. .env.example).");
}

async function notifyNewQuote(quote) {
  if (!mailer) return;
  const to = process.env.NOTIFY_EMAIL || process.env.SMTP_USER;
  try {
    await mailer.sendMail({
      from: `"Gold Teknik Web Sitesi" <${process.env.SMTP_USER}>`,
      to,
      subject: `Yeni teklif talebi: ${quote.name}`,
      text: [
        `Ad Soyad: ${quote.name}`,
        `E-posta: ${quote.email}`,
        `Telefon: ${quote.phone || "-"}`,
        `Hizmet: ${quote.service || "-"}`,
        `Mesaj: ${quote.message || "-"}`,
        `Tarih: ${quote.createdAt}`,
      ].join("\n"),
    });
  } catch (err) {
    console.error("[hata] Bildirim e-postasi gonderilemedi:", err.message);
  }
}

// --- App setup ---
const app = express();
app.set("trust proxy", 1);
app.use(helmet({ contentSecurityPolicy: false }));
app.use(cors());
app.use(express.json({ limit: "50kb" }));

const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 10,
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: "Çok fazla başarısız deneme. 15 dakika sonra tekrar deneyin." },
});

const quoteLimiter = rateLimit({
  windowMs: 60 * 60 * 1000,
  limit: 20,
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: "Çok fazla talep gönderildi. Lütfen daha sonra tekrar deneyin." },
});

function requireAdmin(req, res, next) {
  const auth = req.headers.authorization || "";
  const token = auth.startsWith("Bearer ") ? auth.slice(7) : null;
  if (!token) return res.status(401).json({ error: "Yetkisiz erişim." });
  try {
    req.admin = jwt.verify(token, JWT_SECRET);
    next();
  } catch {
    return res.status(401).json({ error: "Oturum geçersiz veya süresi dolmuş." });
  }
}

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// --- Public: submit a quote request ---
app.post("/api/quotes", quoteLimiter, async (req, res) => {
  const { name, email, phone, service, message, website } = req.body || {};

  // Honeypot: real users never fill this hidden field. Bots that auto-fill every
  // input will. Pretend success so the bot doesn't learn to skip the field.
  if (website) {
    return res.status(201).json({ ok: true });
  }

  if (!name || String(name).trim().length < 2) {
    return res.status(400).json({ error: "Lütfen geçerli bir ad soyad girin." });
  }
  if (!email || !EMAIL_RE.test(String(email).trim())) {
    return res.status(400).json({ error: "Lütfen geçerli bir e-posta adresi girin." });
  }

  const quote = {
    id: Date.now().toString(36) + Math.random().toString(36).slice(2, 8),
    name: String(name).trim().slice(0, 200),
    email: String(email).trim().slice(0, 200),
    phone: String(phone || "").trim().slice(0, 60),
    service: String(service || "").trim().slice(0, 200),
    message: String(message || "").trim().slice(0, 2000),
    status: "yeni",
    createdAt: new Date().toISOString(),
  };

  try {
    await insertQuote(quote);
    notifyNewQuote(quote);
    res.status(201).json({ ok: true });
  } catch (err) {
    console.error("[hata] Talep kaydedilemedi:", err.message);
    res.status(500).json({ error: "Talep kaydedilemedi. Lütfen tekrar deneyin." });
  }
});

// --- Admin: login, returns a short-lived JWT instead of the raw password ---
app.post("/api/admin/login", loginLimiter, (req, res) => {
  const { password } = req.body || {};
  if (!password || !bcrypt.compareSync(String(password), ADMIN_PASSWORD_HASH)) {
    return res.status(401).json({ error: "Hatalı şifre." });
  }
  const token = jwt.sign({ role: "admin" }, JWT_SECRET, { expiresIn: "12h" });
  res.json({ token });
});

// --- Admin: list all quotes ---
app.get("/api/quotes", requireAdmin, async (req, res) => {
  try {
    res.json(await listQuotes());
  } catch (err) {
    console.error("[hata] Kayitlar alinamadi:", err.message);
    res.status(500).json({ error: "Kayıtlar alınamadı." });
  }
});

// --- Admin: update a quote's status ---
app.patch("/api/quotes/:id", requireAdmin, async (req, res) => {
  const { status } = req.body || {};
  try {
    const updated = await updateQuoteStatus(req.params.id, status);
    if (!updated) return res.status(404).json({ error: "Kayıt bulunamadı." });
    res.json(updated);
  } catch (err) {
    console.error("[hata] Guncelleme basarisiz:", err.message);
    res.status(500).json({ error: "Güncelleme başarısız." });
  }
});

// --- Admin: delete a quote ---
app.delete("/api/quotes/:id", requireAdmin, async (req, res) => {
  try {
    await deleteQuote(req.params.id);
    res.json({ ok: true });
  } catch (err) {
    console.error("[hata] Silme basarisiz:", err.message);
    res.status(500).json({ error: "Silme başarısız." });
  }
});

export default app;
