import React, { useEffect, useState, useCallback } from "react";
import { Link } from "react-router-dom";
import { Lock, LogOut, RefreshCw, Trash2, Phone, Mail, Calendar, ArrowLeft, Inbox, AlertCircle } from "lucide-react";
import { TOKENS, GridBG, globalStyles } from "../theme.jsx";

const STORAGE_KEY = "goldteknik_admin_token";

const STATUS_OPTIONS = [
  { value: "yeni", label: "Yeni", color: TOKENS.copper },
  { value: "araniyor", label: "Aranıyor", color: TOKENS.blueprint },
  { value: "tamamlandi", label: "Tamamlandı", color: TOKENS.cyan },
];

function StatusBadge({ status }) {
  const opt = STATUS_OPTIONS.find((o) => o.value === status) || STATUS_OPTIONS[0];
  return (
    <span
      className="akm-mono"
      style={{
        display: "inline-block",
        fontSize: 11,
        letterSpacing: "0.04em",
        padding: "4px 10px",
        borderRadius: 3,
        color: "#fff",
        background: opt.color,
        whiteSpace: "nowrap",
      }}
    >
      {opt.label.toUpperCase()}
    </span>
  );
}

function LoginScreen({ onLogin }) {
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const submit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Giriş başarısız.");
      onLogin(data.token);
    } catch (err) {
      setError(err.message || "Sunucuya bağlanılamadı. API sunucusu (npm run server) çalışıyor mu?");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ minHeight: "100vh", background: `linear-gradient(135deg, ${TOKENS.blueprint} 0%, ${TOKENS.blueprintDeep} 100%)`, display: "flex", alignItems: "center", justifyContent: "center", position: "relative", overflow: "hidden", padding: 24 }}>
      <style>{globalStyles}</style>
      <GridBG dark />
      <div style={{ position: "relative", zIndex: 2, width: "100%", maxWidth: 380 }}>
        <Link to="/" style={{ display: "flex", alignItems: "center", gap: 6, color: "rgba(255,255,255,0.6)", textDecoration: "none", fontSize: 13, marginBottom: 24 }}>
          <ArrowLeft size={14} /> Siteye dön
        </Link>
        <div style={{ background: "#fff", padding: "36px 32px", boxShadow: "0 20px 50px rgba(0,0,0,0.25)" }}>
          <div style={{ width: 46, height: 46, borderRadius: "50%", background: TOKENS.copper, display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 18 }}>
            <Lock size={20} color="#fff" />
          </div>
          <h1 className="akm-h2" style={{ fontSize: 22, fontWeight: 700, marginBottom: 6 }}>Yönetici Girişi</h1>
          <p style={{ fontSize: 13, color: "rgba(27,31,36,0.6)", marginBottom: 24 }}>Gold Teknik teklif taleplerini görüntülemek için şifrenizi girin.</p>

          <form onSubmit={submit} style={{ display: "flex", flexDirection: "column", gap: 14 }}>
            <input
              type="password"
              placeholder="Şifre"
              value={password}
              autoFocus
              onChange={(e) => setPassword(e.target.value)}
              style={{ width: "100%", padding: "12px 14px", border: "1px solid rgba(27,31,36,0.15)", fontSize: 14, outline: "none" }}
            />
            {error && (
              <div style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 13, color: TOKENS.danger }}>
                <AlertCircle size={15} /> {error}
              </div>
            )}
            <button type="submit" disabled={loading} className="akm-btn" style={{ background: TOKENS.copper, color: "#fff", border: "none", padding: "13px 20px", fontSize: 14, fontWeight: 500 }}>
              {loading ? "Kontrol ediliyor..." : "Giriş Yap"}
            </button>
          </form>
          <p className="akm-mono" style={{ fontSize: 10.5, color: "rgba(27,31,36,0.35)", marginTop: 20, lineHeight: 1.6 }}>
            Şifre ".env" dosyasındaki ADMIN_PASSWORD değeridir. Üretimde mutlaka değiştirin.
          </p>
        </div>
      </div>
    </div>
  );
}

function Dashboard({ token, onLogout }) {
  const [quotes, setQuotes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [filter, setFilter] = useState("hepsi");

  const load = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/quotes", { headers: { Authorization: `Bearer ${token}` } });
      if (res.status === 401) throw new Error("__unauthorized__");
      if (!res.ok) throw new Error("Kayıtlar alınamadı.");
      setQuotes(await res.json());
    } catch (err) {
      if (err.message === "__unauthorized__") {
        onLogout();
        return;
      }
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [token, onLogout]);

  useEffect(() => {
    load();
  }, [load]);

  const updateStatus = async (id, statusValue) => {
    setQuotes((qs) => qs.map((q) => (q.id === id ? { ...q, status: statusValue } : q)));
    await fetch(`/api/quotes/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
      body: JSON.stringify({ status: statusValue }),
    });
  };

  const remove = async (id) => {
    if (!window.confirm("Bu talebi silmek istediğinize emin misiniz?")) return;
    setQuotes((qs) => qs.filter((q) => q.id !== id));
    await fetch(`/api/quotes/${id}`, { method: "DELETE", headers: { Authorization: `Bearer ${token}` } });
  };

  const filtered = filter === "hepsi" ? quotes : quotes.filter((q) => q.status === filter);
  const counts = {
    hepsi: quotes.length,
    yeni: quotes.filter((q) => q.status === "yeni").length,
    araniyor: quotes.filter((q) => q.status === "araniyor").length,
    tamamlandi: quotes.filter((q) => q.status === "tamamlandi").length,
  };

  const fmtDate = (iso) => {
    try {
      return new Date(iso).toLocaleString("tr-TR", { day: "2-digit", month: "2-digit", year: "numeric", hour: "2-digit", minute: "2-digit" });
    } catch {
      return iso;
    }
  };

  return (
    <div style={{ fontFamily: "'Inter', sans-serif", color: TOKENS.ink, background: TOKENS.paper, minHeight: "100vh" }}>
      <style>{globalStyles}</style>

      <header style={{ background: TOKENS.graphite, color: TOKENS.paper }}>
        <div style={{ maxWidth: 1200, margin: "0 auto", padding: "0 24px", display: "flex", alignItems: "center", justifyContent: "space-between", height: 68 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <svg width="28" height="28" viewBox="0 0 34 34" aria-hidden="true">
              <circle cx="17" cy="17" r="15.5" fill="none" stroke={TOKENS.copper} strokeWidth="1.4" />
              <path d="M18.5 6 L11 19 H16 L14.5 28 L23 15 H18 Z" fill={TOKENS.copper} />
            </svg>
            <div className="akm-h3" style={{ fontSize: 16, fontWeight: 700 }}>GOLD TEKNİK <span style={{ color: "rgba(255,255,255,0.4)", fontWeight: 500 }}>/ Yönetim Paneli</span></div>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
            <Link to="/" style={{ color: "rgba(255,255,255,0.7)", fontSize: 13, textDecoration: "none" }}>Siteyi Görüntüle</Link>
            <button onClick={onLogout} className="akm-btn" style={{ background: "transparent", border: "1px solid rgba(255,255,255,0.25)", color: TOKENS.paper, padding: "8px 14px", fontSize: 13, display: "flex", alignItems: "center", gap: 6 }}>
              <LogOut size={14} /> Çıkış
            </button>
          </div>
        </div>
      </header>

      <div style={{ maxWidth: 1200, margin: "0 auto", padding: "32px 24px" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", flexWrap: "wrap", gap: 16, marginBottom: 24 }}>
          <div>
            <div className="akm-mono" style={{ color: TOKENS.copper, fontSize: 12, letterSpacing: "0.14em", marginBottom: 6 }}>TEKLİF TALEPLERİ</div>
            <h1 className="akm-h2" style={{ fontSize: 26, fontWeight: 700 }}>Gelen Talepler</h1>
          </div>
          <button onClick={load} className="akm-btn" style={{ background: "#fff", border: `1px solid rgba(27,31,36,0.15)`, padding: "10px 16px", fontSize: 13, display: "flex", alignItems: "center", gap: 8 }}>
            <RefreshCw size={14} /> Yenile
          </button>
        </div>

        {/* Stat cards */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))", gap: 14, marginBottom: 28 }}>
          {[
            { key: "hepsi", label: "Toplam Talep", color: TOKENS.graphite },
            { key: "yeni", label: "Yeni", color: TOKENS.copper },
            { key: "araniyor", label: "Aranıyor", color: TOKENS.blueprint },
            { key: "tamamlandi", label: "Tamamlandı", color: TOKENS.cyan },
          ].map((c) => (
            <button
              key={c.key}
              onClick={() => setFilter(c.key)}
              className="akm-btn"
              style={{
                textAlign: "left",
                background: "#fff",
                border: filter === c.key ? `2px solid ${c.color}` : "1px solid rgba(27,31,36,0.1)",
                padding: "16px 18px",
              }}
            >
              <div className="akm-mono" style={{ fontSize: 26, fontWeight: 500, color: c.color }}>{counts[c.key]}</div>
              <div style={{ fontSize: 12.5, color: "rgba(27,31,36,0.6)", marginTop: 2 }}>{c.label}</div>
            </button>
          ))}
        </div>

        {error && (
          <div style={{ padding: 16, border: `1px solid ${TOKENS.danger}`, background: "rgba(198,59,59,0.06)", color: TOKENS.danger, fontSize: 14, marginBottom: 20, display: "flex", alignItems: "center", gap: 8 }}>
            <AlertCircle size={16} /> {error}
          </div>
        )}

        {loading ? (
          <div style={{ padding: 60, textAlign: "center", color: "rgba(27,31,36,0.5)", fontSize: 14 }}>Yükleniyor...</div>
        ) : filtered.length === 0 ? (
          <div style={{ padding: 60, textAlign: "center", background: "#fff", border: "1px solid rgba(27,31,36,0.1)" }}>
            <Inbox size={32} color="rgba(27,31,36,0.25)" style={{ marginBottom: 10 }} />
            <div style={{ fontSize: 14, color: "rgba(27,31,36,0.55)" }}>Bu kategoride kayıt bulunmuyor.</div>
          </div>
        ) : (
          <div style={{ background: "#fff", border: "1px solid rgba(27,31,36,0.1)", overflowX: "auto" }}>
            <table style={{ width: "100%", fontSize: 13.5 }}>
              <thead>
                <tr style={{ background: TOKENS.paper, borderBottom: "1px solid rgba(27,31,36,0.1)" }}>
                  {["Tarih", "Ad Soyad", "İletişim", "Hizmet", "Mesaj", "Durum", ""].map((h) => (
                    <th key={h} className="akm-mono" style={{ textAlign: "left", padding: "12px 16px", fontSize: 11, letterSpacing: "0.06em", color: "rgba(27,31,36,0.5)", whiteSpace: "nowrap" }}>
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filtered.map((q) => (
                  <tr key={q.id} style={{ borderBottom: "1px solid rgba(27,31,36,0.06)", verticalAlign: "top" }}>
                    <td className="akm-mono" style={{ padding: "14px 16px", color: "rgba(27,31,36,0.55)", fontSize: 12, whiteSpace: "nowrap" }}>
                      <div style={{ display: "flex", alignItems: "center", gap: 6 }}><Calendar size={12} /> {fmtDate(q.createdAt)}</div>
                    </td>
                    <td style={{ padding: "14px 16px", fontWeight: 600, whiteSpace: "nowrap" }}>{q.name}</td>
                    <td style={{ padding: "14px 16px", minWidth: 190 }}>
                      <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 4 }}><Mail size={12} color={TOKENS.copper} /> {q.email}</div>
                      {q.phone && <div style={{ display: "flex", alignItems: "center", gap: 6 }}><Phone size={12} color={TOKENS.copper} /> {q.phone}</div>}
                    </td>
                    <td style={{ padding: "14px 16px", maxWidth: 180 }}>{q.service || "—"}</td>
                    <td style={{ padding: "14px 16px", maxWidth: 260, color: "rgba(27,31,36,0.7)" }}>{q.message || "—"}</td>
                    <td style={{ padding: "14px 16px" }}>
                      <select
                        value={q.status}
                        onChange={(e) => updateStatus(q.id, e.target.value)}
                        style={{ fontSize: 12, padding: "6px 8px", border: "1px solid rgba(27,31,36,0.15)", background: "#fff" }}
                      >
                        {STATUS_OPTIONS.map((o) => (
                          <option key={o.value} value={o.value}>{o.label}</option>
                        ))}
                      </select>
                      <div style={{ marginTop: 6 }}><StatusBadge status={q.status} /></div>
                    </td>
                    <td style={{ padding: "14px 16px" }}>
                      <button onClick={() => remove(q.id)} className="akm-btn" style={{ background: "none", border: "none", color: TOKENS.danger, padding: 6 }} aria-label="Sil">
                        <Trash2 size={16} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

export default function Admin() {
  const [token, setToken] = useState(() => sessionStorage.getItem(STORAGE_KEY) || "");

  const handleLogin = (newToken) => {
    sessionStorage.setItem(STORAGE_KEY, newToken);
    setToken(newToken);
  };

  const handleLogout = () => {
    sessionStorage.removeItem(STORAGE_KEY);
    setToken("");
  };

  if (!token) return <LoginScreen onLogin={handleLogin} />;
  return <Dashboard token={token} onLogout={handleLogout} />;
}
