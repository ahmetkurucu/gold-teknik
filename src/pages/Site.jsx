import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Zap, Settings, Wrench, Gauge, Factory, Headphones, Phone, Mail, MapPin, Clock, CheckCircle2, ArrowRight, Menu, X, ChevronRight, AlertCircle, Loader2, MessageCircle } from "lucide-react";
import { TOKENS, GridBG, globalStyles } from "../theme.jsx";

const WHATSAPP_NUMBER = "905345618680";
const WHATSAPP_MESSAGE = "Merhaba, Gold Teknik'ten teklif almak istiyorum.";

function CornerMark({ label, corner = "top-left", dark }) {
  const color = dark ? "rgba(237,232,222,0.35)" : "rgba(27,31,36,0.35)";
  const pos = {
    "top-left": { top: 16, left: 16 },
    "bottom-right": { bottom: 16, right: 16 },
  }[corner];
  return (
    <div style={{ position: "absolute", ...pos, display: "flex", alignItems: "center", gap: 6, zIndex: 2 }} aria-hidden="true">
      <svg width="14" height="14" viewBox="0 0 14 14">
        <line x1="0" y1="7" x2="14" y2="7" stroke={color} strokeWidth="1" />
        <line x1="7" y1="0" x2="7" y2="14" stroke={color} strokeWidth="1" />
      </svg>
      <span style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: 10, letterSpacing: "0.08em", color }}>{label}</span>
    </div>
  );
}

function CircuitTrace() {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 1200 400"
      preserveAspectRatio="none"
      style={{ position: "absolute", inset: 0, width: "100%", height: "100%", pointerEvents: "none", opacity: 0.5 }}
    >
      <path
        d="M -20 320 L 220 320 L 260 280 L 500 280 L 540 320 L 820 320 L 860 260 L 1100 260 L 1140 220 L 1240 220"
        fill="none"
        stroke={TOKENS.cyan}
        strokeWidth="1.5"
        strokeDasharray="6 6"
      >
        <animate attributeName="stroke-dashoffset" from="0" to="-120" dur="6s" repeatCount="indefinite" />
      </path>
      {[
        [220, 320],
        [540, 320],
        [860, 260],
        [1140, 220],
      ].map(([cx, cy], i) => (
        <circle key={i} cx={cx} cy={cy} r="4" fill={TOKENS.cyan}>
          <animate attributeName="opacity" values="0.4;1;0.4" dur="2.4s" repeatCount="indefinite" begin={`${i * 0.3}s`} />
        </circle>
      ))}
    </svg>
  );
}

function SchematicIcon({ Icon }) {
  return (
    <div
      style={{
        width: 52,
        height: 52,
        borderRadius: "50%",
        border: `1px solid ${TOKENS.copper}`,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        flexShrink: 0,
        position: "relative",
      }}
    >
      <div style={{ position: "absolute", inset: -6, borderRadius: "50%", border: `1px dashed rgba(181,84,31,0.35)` }} aria-hidden="true" />
      <Icon size={22} color={TOKENS.copper} strokeWidth={1.6} />
    </div>
  );
}

const categories = [
  {
    icon: Zap,
    title: "Elektrik Hizmetleri",
    items: ["Elektrik Panosu İmalatı", "Kompanzasyon Sistemleri", "Elektrik Tesisatı", "Arıza Tespiti ve Onarım"],
  },
  {
    icon: Settings,
    title: "Mekanik Hizmetler",
    items: ["Pompa ve Motor Bakımı", "Redüktör ve Şanzıman Bakımı", "Rulman Değişimi", "Mekanik Montaj & Söküm"],
  },
  {
    icon: Wrench,
    title: "Bakım & Onarım",
    items: ["Periyodik Bakım", "Arıza Onarım", "Revizyon", "Yerinde Teknik Servis"],
  },
  {
    icon: Factory,
    title: "Montaj & İmalat",
    items: ["Makine Montajı", "Çelik Konstrüksiyon", "Borulama Sistemleri", "Özel İmalat Çözümleri"],
  },
  {
    icon: CheckCircle2,
    title: "Danışmanlık",
    items: ["Proje Danışmanlığı", "Keşif ve Analiz", "Enerji Verimliliği", "Teknik Raporlama"],
  },
];

const services = [
  { icon: Zap, title: "Endüstriyel Elektrik Arıza ve Bakım", desc: "Elektrik panoları, kablolama, arıza tespiti ve onarım hizmetleri." },
  { icon: Settings, title: "Mekanik Bakım ve Revizyon", desc: "Makine ve ekipmanlarınızın periyodik bakım, revizyon ve onarımı." },
  { icon: Gauge, title: "Pompa Bakım ve Montajı", desc: "Her marka ve model pompa bakımı, montajı ve devreye alma hizmetleri." },
  { icon: Wrench, title: "Motor, Redüktör ve Rulman Değişimi", desc: "Motor, redüktör, rulman gibi ekipmanların değişimi ve bakım hizmetleri." },
  { icon: Factory, title: "Periyodik Fabrika Bakımı", desc: "Tesisinizin kesintisiz çalışması için periyodik bakım anlaşmaları." },
  { icon: Headphones, title: "Acil Arıza Desteği", desc: "7/24 acil teknik servis hizmeti ile arızalara hızlı çözümler." },
];

const stats = [
  { value: "12+", label: "Yıllık Deneyim" },
  { value: "480+", label: "Tamamlanan Proje" },
  { value: "24", label: "Uzman Personel" },
  { value: "%99", label: "Müşteri Memnuniyeti" },
];

const projects = [
  { title: "Elektrik Pano Montajı", tag: "PNL-014" },
  { title: "Pompa İstasyonu Kurulumu", tag: "PMP-027" },
  { title: "Redüktör Bakım ve Revizyonu", tag: "RDK-009" },
  { title: "Motor Değişim Uygulaması", tag: "MTR-033" },
  { title: "Fabrika Periyodik Bakımı", tag: "FAB-051" },
];

function ProjectGlyph({ index }) {
  const glyphs = [
    <g key="0"><rect x="18" y="14" width="24" height="32" fill="none" stroke={TOKENS.cyan} strokeWidth="1.4" /><line x1="22" y1="20" x2="38" y2="20" stroke={TOKENS.cyan} strokeWidth="1" /><line x1="22" y1="26" x2="38" y2="26" stroke={TOKENS.cyan} strokeWidth="1" /><line x1="22" y1="32" x2="34" y2="32" stroke={TOKENS.cyan} strokeWidth="1" /></g>,
    <g key="1"><circle cx="30" cy="30" r="14" fill="none" stroke={TOKENS.cyan} strokeWidth="1.4" /><circle cx="30" cy="30" r="5" fill="none" stroke={TOKENS.cyan} strokeWidth="1.2" /><line x1="30" y1="10" x2="30" y2="16" stroke={TOKENS.cyan} strokeWidth="1.2" /><line x1="30" y1="44" x2="30" y2="50" stroke={TOKENS.cyan} strokeWidth="1.2" /></g>,
    <g key="2"><rect x="16" y="24" width="28" height="12" fill="none" stroke={TOKENS.cyan} strokeWidth="1.4" /><circle cx="22" cy="36" r="4" fill="none" stroke={TOKENS.cyan} strokeWidth="1.2" /><circle cx="38" cy="36" r="4" fill="none" stroke={TOKENS.cyan} strokeWidth="1.2" /></g>,
    <g key="3"><rect x="14" y="20" width="20" height="20" fill="none" stroke={TOKENS.cyan} strokeWidth="1.4" /><line x1="34" y1="30" x2="46" y2="30" stroke={TOKENS.cyan} strokeWidth="1.2" /><circle cx="46" cy="30" r="2.5" fill={TOKENS.cyan} /></g>,
    <g key="4"><line x1="14" y1="46" x2="46" y2="46" stroke={TOKENS.cyan} strokeWidth="1.4" /><rect x="18" y="26" width="6" height="20" fill="none" stroke={TOKENS.cyan} strokeWidth="1.2" /><rect x="27" y="18" width="6" height="28" fill="none" stroke={TOKENS.cyan} strokeWidth="1.2" /><rect x="36" y="32" width="6" height="14" fill="none" stroke={TOKENS.cyan} strokeWidth="1.2" /></g>,
  ];
  return (
    <svg viewBox="0 0 60 60" width="60" height="60" aria-hidden="true">
      {glyphs[index % glyphs.length]}
    </svg>
  );
}

export default function Site() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [form, setForm] = useState({ name: "", email: "", phone: "", service: "", message: "", website: "" });
  const [status, setStatus] = useState("idle"); // idle | sending | sent | error
  const [errorMsg, setErrorMsg] = useState("");

  const navItems = ["Ana Sayfa", "Hizmetlerimiz", "Hakkımızda", "Projeler", "Blog", "İletişim"];

  const scrollToId = (id) => {
    setMenuOpen(false);
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus("sending");
    setErrorMsg("");
    try {
      const res = await fetch("/api/quotes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error || "Gönderim başarısız oldu.");
      }
      setStatus("sent");
      setForm({ name: "", email: "", phone: "", service: "", message: "", website: "" });
    } catch (err) {
      setStatus("error");
      setErrorMsg(err.message || "Bir hata oluştu. Lütfen tekrar deneyin.");
    }
  };

  return (
    <div style={{ fontFamily: "'Inter', sans-serif", color: TOKENS.ink, background: TOKENS.paper, minHeight: "100vh" }}>
      <style>{globalStyles}</style>

      {/* HEADER */}
      <header style={{ background: TOKENS.graphite, color: TOKENS.paper, position: "sticky", top: 0, zIndex: 50 }}>
        <div style={{ maxWidth: 1200, margin: "0 auto", padding: "0 24px", display: "flex", alignItems: "center", justifyContent: "space-between", height: 72 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <svg width="34" height="34" viewBox="0 0 34 34" aria-hidden="true">
              <circle cx="17" cy="17" r="15.5" fill="none" stroke={TOKENS.copper} strokeWidth="1.4" />
              <path d="M18.5 6 L11 19 H16 L14.5 28 L23 15 H18 Z" fill={TOKENS.copper} />
            </svg>
            <div>
              <div className="akm-h3" style={{ fontSize: 18, fontWeight: 700, lineHeight: 1 }}>GOLD TEKNİK</div>
              <div className="akm-mono" style={{ fontSize: 9, letterSpacing: "0.16em", color: "rgba(237,232,222,0.55)" }}>ELEKTRİK &amp; MEKANİK</div>
            </div>
          </div>

          <nav className="akm-desktop-nav akm-nav" style={{ display: "flex", gap: 32, fontSize: 14 }}>
            {navItems.map((item) => (
              <a
                key={item}
                href="#"
                onClick={(e) => {
                  e.preventDefault();
                  if (item === "Hizmetlerimiz") scrollToId("hizmetlerimiz");
                  else if (item === "İletişim") scrollToId("teklif-form");
                  else if (item === "Ana Sayfa") window.scrollTo({ top: 0, behavior: "smooth" });
                }}
                style={{ color: item === "Ana Sayfa" ? TOKENS.copperLight : "rgba(237,232,222,0.85)", textDecoration: "none" }}
              >
                {item}
              </a>
            ))}
          </nav>

          <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
            <button
              onClick={() => scrollToId("teklif-form")}
              className="akm-btn akm-desktop-nav"
              style={{ background: TOKENS.copper, color: "#fff", border: "none", padding: "10px 20px", fontSize: 13, fontWeight: 500, display: "flex", alignItems: "center", gap: 6 }}
            >
              TEKLİF AL <ArrowRight size={14} />
            </button>
            <button
              className="akm-mobile-toggle"
              onClick={() => setMenuOpen(!menuOpen)}
              style={{ display: "none", background: "none", border: "none", color: TOKENS.paper, cursor: "pointer" }}
              aria-label="Menü"
            >
              {menuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
        {menuOpen && (
          <div style={{ borderTop: "1px solid rgba(237,232,222,0.1)", padding: "16px 24px", display: "flex", flexDirection: "column", gap: 14 }}>
            {navItems.map((item) => (
              <a
                key={item}
                href="#"
                onClick={(e) => {
                  e.preventDefault();
                  if (item === "Hizmetlerimiz") scrollToId("hizmetlerimiz");
                  else if (item === "İletişim") scrollToId("teklif-form");
                  else if (item === "Ana Sayfa") { window.scrollTo({ top: 0, behavior: "smooth" }); setMenuOpen(false); }
                }}
                style={{ color: "rgba(237,232,222,0.85)", textDecoration: "none", fontSize: 14 }}
              >
                {item}
              </a>
            ))}
          </div>
        )}
      </header>

      {/* HERO */}
      <section style={{ position: "relative", background: `linear-gradient(135deg, ${TOKENS.blueprint} 0%, ${TOKENS.blueprintDeep} 100%)`, color: TOKENS.paper, overflow: "hidden", padding: "88px 24px 64px" }}>
        <GridBG dark />
        <CornerMark label="GLD-001 / REV.3" corner="top-left" dark />
        <div style={{ position: "absolute", inset: 0 }}><CircuitTrace /></div>
        <div style={{ maxWidth: 1200, margin: "0 auto", position: "relative", zIndex: 2 }}>
          <div className="akm-mono" style={{ color: TOKENS.copperLight, fontSize: 12, letterSpacing: "0.18em", marginBottom: 16 }}>
            ⚡ ENDÜSTRİYEL BAKIM &amp; ONARIM
          </div>
          <h1 className="akm-h1" style={{ fontSize: "clamp(32px, 5vw, 54px)", fontWeight: 700, lineHeight: 1.08, maxWidth: 760, margin: "0 0 20px" }}>
            Tesisiniz durmasın, biz devrede kalsın.
          </h1>
          <p style={{ fontSize: 17, lineHeight: 1.7, color: "rgba(237,232,222,0.75)", maxWidth: 560, marginBottom: 32 }}>
            Elektrik panolarından pompa istasyonlarına, redüktörden fabrika geneline kadar; deneyimli ekibimizle üretim hattınızın kesintisiz çalışmasını garanti altına alıyoruz.
          </p>

          <div style={{ display: "flex", gap: 28, flexWrap: "wrap", marginBottom: 36 }}>
            {[["7/24", "Acil Destek"], ["Sertifikalı", "Uzman Ekip"], ["Garantili", "İşçilik"]].map(([a, b]) => (
              <div key={a} style={{ display: "flex", alignItems: "center", gap: 10 }}>
                <CheckCircle2 size={18} color={TOKENS.cyan} strokeWidth={1.8} />
                <div>
                  <div style={{ fontSize: 14, fontWeight: 600 }}>{a}</div>
                  <div style={{ fontSize: 12, color: "rgba(237,232,222,0.55)" }}>{b}</div>
                </div>
              </div>
            ))}
          </div>

          <div style={{ display: "flex", gap: 14, flexWrap: "wrap", alignItems: "center" }}>
            <button onClick={() => scrollToId("teklif-form")} className="akm-btn" style={{ background: TOKENS.copper, color: "#fff", border: "none", padding: "14px 26px", fontSize: 14, fontWeight: 500, display: "flex", alignItems: "center", gap: 8 }}>
              Teklif İste <ArrowRight size={16} />
            </button>
            <button onClick={() => scrollToId("hizmetlerimiz")} className="akm-btn" style={{ background: "transparent", color: TOKENS.paper, border: "1px solid rgba(237,232,222,0.35)", padding: "14px 26px", fontSize: 14, fontWeight: 500, display: "flex", alignItems: "center", gap: 8 }}>
              Hizmetlerimiz <ChevronRight size={16} />
            </button>
            <div className="akm-mono" style={{ display: "flex", alignItems: "center", gap: 8, marginLeft: 8, color: TOKENS.cyan, fontSize: 14 }}>
              <Phone size={16} /> 0534 561 86 80
            </div>
          </div>
        </div>
      </section>

      {/* CATEGORY GRID */}
      <section style={{ padding: "0 24px", position: "relative", marginTop: -46, marginBottom: 40 }}>
        <div style={{ maxWidth: 1200, margin: "0 auto" }}>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: 16 }}>
            {categories.map((c) => (
              <div
                key={c.title}
                className="akm-card"
                style={{ background: "#fff", border: "1px solid rgba(27,31,36,0.1)", boxShadow: "0 12px 28px rgba(27,31,36,0.08)", padding: "22px 20px", display: "flex", flexDirection: "column", gap: 12 }}
              >
                <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                  <div style={{ width: 34, height: 34, borderRadius: "50%", background: TOKENS.copper, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                    <c.icon size={16} color="#fff" strokeWidth={2} />
                  </div>
                  <h3 className="akm-h3" style={{ fontSize: 14, fontWeight: 700, letterSpacing: "0.01em" }}>{c.title}</h3>
                </div>
                <ul style={{ listStyle: "none", margin: 0, padding: 0, display: "flex", flexDirection: "column", gap: 7 }}>
                  {c.items.map((it) => (
                    <li key={it} style={{ display: "flex", alignItems: "flex-start", gap: 7, fontSize: 12.5, color: "rgba(27,31,36,0.68)", lineHeight: 1.4 }}>
                      <span style={{ color: TOKENS.cyan, marginTop: 1, flexShrink: 0 }}>●</span>
                      {it}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* STATS */}
      <section style={{ background: TOKENS.copper, color: "#fff", padding: "36px 24px" }}>
        <div style={{ maxWidth: 1200, margin: "0 auto", display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))", gap: 24 }}>
          {stats.map((s) => (
            <div key={s.label} style={{ textAlign: "center", borderLeft: "1px solid rgba(255,255,255,0.25)", paddingLeft: 24 }}>
              <div className="akm-mono" style={{ fontSize: 30, fontWeight: 500, color: "#fff" }}>{s.value}</div>
              <div style={{ fontSize: 13, color: "rgba(255,255,255,0.85)", marginTop: 4 }}>{s.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* SERVICES */}
      <section id="hizmetlerimiz" style={{ padding: "72px 24px", position: "relative" }}>
        <div style={{ maxWidth: 1200, margin: "0 auto" }}>
          <div className="akm-mono" style={{ color: TOKENS.copper, fontSize: 12, letterSpacing: "0.18em", marginBottom: 10 }}>HİZMETLERİMİZ</div>
          <h2 className="akm-h2" style={{ fontSize: 32, fontWeight: 700, marginBottom: 40 }}>İhtiyacınıza uygun profesyonel çözümler</h2>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: 20 }}>
            {services.map((s) => (
              <div key={s.title} className="akm-card" style={{ background: "#fff", border: "1px solid rgba(27,31,36,0.1)", padding: 26, display: "flex", flexDirection: "column", gap: 14 }}>
                <SchematicIcon Icon={s.icon} />
                <h3 className="akm-h3" style={{ fontSize: 17, fontWeight: 600 }}>{s.title}</h3>
                <p style={{ fontSize: 14, color: "rgba(27,31,36,0.65)", lineHeight: 1.6, flex: 1 }}>{s.desc}</p>
                <a href="#" style={{ color: TOKENS.copper, fontSize: 13, fontWeight: 500, textDecoration: "none", display: "flex", alignItems: "center", gap: 4 }}>
                  Detaylar <ChevronRight size={14} />
                </a>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* PROJECTS */}
      <section style={{ padding: "72px 24px", background: `linear-gradient(135deg, ${TOKENS.blueprint} 0%, ${TOKENS.blueprintDeep} 100%)`, color: TOKENS.paper, position: "relative", overflow: "hidden" }}>
        <GridBG dark />
        <div style={{ maxWidth: 1200, margin: "0 auto", position: "relative", zIndex: 2 }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", marginBottom: 40, flexWrap: "wrap", gap: 12 }}>
            <div>
              <div className="akm-mono" style={{ color: TOKENS.copperLight, fontSize: 12, letterSpacing: "0.18em", marginBottom: 10 }}>REFERANS PROJELER</div>
              <h2 className="akm-h2" style={{ fontSize: 32, fontWeight: 700 }}>Gerçekleştirdiğimiz bazı projeler</h2>
            </div>
            <a href="#" style={{ color: "#fff", fontSize: 14, textDecoration: "none", display: "flex", alignItems: "center", gap: 6 }}>
              Tüm Projeler <ArrowRight size={14} />
            </a>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: 16 }}>
            {projects.map((p, i) => (
              <div key={p.title} className="akm-card" style={{ border: "1px solid rgba(255,255,255,0.2)", padding: 20, display: "flex", flexDirection: "column", alignItems: "flex-start", gap: 16, background: "rgba(255,255,255,0.06)" }}>
                <div style={{ width: "100%", display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                  <ProjectGlyph index={i} />
                  <span className="akm-mono" style={{ fontSize: 10, color: "rgba(255,255,255,0.55)" }}>{p.tag}</span>
                </div>
                <div style={{ fontSize: 14, fontWeight: 500 }}>{p.title}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* WHY US + FORM */}
      <section id="teklif-form" className="akm-split" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", minHeight: 0 }}>
        <div style={{ background: TOKENS.blueprint, color: TOKENS.paper, padding: "64px 40px", position: "relative", overflow: "hidden" }}>
          <GridBG dark />
          <div style={{ position: "relative", zIndex: 2, maxWidth: 460 }}>
            <div className="akm-mono" style={{ color: TOKENS.cyan, fontSize: 12, letterSpacing: "0.18em", marginBottom: 10 }}>NEDEN GOLD TEKNİK?</div>
            <h2 className="akm-h2" style={{ fontSize: 28, fontWeight: 700, marginBottom: 24 }}>Güvenilir çözümler, kesintisiz hizmet</h2>
            <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
              {[
                "Alanında uzman ve sertifikalı ekip",
                "Hızlı müdahale ve yerinde çözüm",
                "İş güvenliği ve çevreye duyarlılık",
                "Yüksek kalite standartlarında hizmet",
                "Uzun ömürlü, güvenilir çözümler",
              ].map((t) => (
                <div key={t} style={{ display: "flex", alignItems: "flex-start", gap: 10 }}>
                  <CheckCircle2 size={18} color={TOKENS.copperLight} style={{ marginTop: 2, flexShrink: 0 }} />
                  <span style={{ fontSize: 14, color: "rgba(237,232,222,0.85)" }}>{t}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div style={{ background: "#fff", padding: "64px 40px" }}>
          <div style={{ maxWidth: 460 }}>
            <div className="akm-mono" style={{ color: TOKENS.copper, fontSize: 12, letterSpacing: "0.18em", marginBottom: 10 }}>ÜCRETSİZ KEŞİF</div>
            <h2 className="akm-h2" style={{ fontSize: 26, fontWeight: 700, marginBottom: 20 }}>Teklif talep formu</h2>

            {status === "sent" ? (
              <div style={{ padding: 20, border: `1px solid ${TOKENS.cyan}`, background: "rgba(31,201,183,0.08)", fontSize: 14, display: "flex", alignItems: "center", gap: 10 }}>
                <CheckCircle2 size={20} color={TOKENS.cyan} /> Talebiniz alındı. En kısa sürede sizinle iletişime geçeceğiz.
              </div>
            ) : (
              <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: 14 }}>
                {/* Honeypot: hidden from real users, bots that auto-fill every field will trip it */}
                <input
                  type="text"
                  name="website"
                  value={form.website}
                  onChange={(e) => setForm({ ...form, website: e.target.value })}
                  tabIndex={-1}
                  autoComplete="off"
                  aria-hidden="true"
                  style={{ position: "absolute", left: "-9999px", width: 1, height: 1, opacity: 0 }}
                />
                {status === "error" && (
                  <div style={{ padding: "12px 14px", border: `1px solid ${TOKENS.danger}`, background: "rgba(198,59,59,0.06)", fontSize: 13, color: TOKENS.danger, display: "flex", alignItems: "center", gap: 8 }}>
                    <AlertCircle size={16} /> {errorMsg}
                  </div>
                )}
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
                  <input required placeholder="Ad Soyad" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} style={inputStyle} />
                  <input required type="email" placeholder="E-posta" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} style={inputStyle} />
                </div>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
                  <input placeholder="Telefon" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} style={inputStyle} />
                  <select value={form.service} onChange={(e) => setForm({ ...form, service: e.target.value })} style={inputStyle}>
                    <option value="">Hizmet Seçimi</option>
                    {services.map((s) => (
                      <option key={s.title} value={s.title}>{s.title}</option>
                    ))}
                  </select>
                </div>
                <textarea placeholder="Mesajınız" rows={4} value={form.message} onChange={(e) => setForm({ ...form, message: e.target.value })} style={{ ...inputStyle, resize: "vertical" }} />
                <button type="submit" disabled={status === "sending"} className="akm-btn" style={{ background: TOKENS.copper, color: "#fff", border: "none", padding: "14px 24px", fontSize: 14, fontWeight: 500, display: "flex", alignItems: "center", justifyContent: "center", gap: 8 }}>
                  {status === "sending" ? (<><Loader2 size={16} className="akm-spin" /> Gönderiliyor...</>) : (<>Teklif Gönder <ArrowRight size={16} /></>)}
                </button>
              </form>
            )}
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer style={{ background: TOKENS.blueprintDeep, color: "rgba(255,255,255,0.8)", padding: "56px 24px 28px", position: "relative" }}>
        <CornerMark label="ÖLÇEK 1:1" corner="bottom-right" dark />
        <div style={{ maxWidth: 1200, margin: "0 auto", display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: 32 }}>
          <div>
            <div className="akm-h3" style={{ color: TOKENS.paper, fontSize: 18, fontWeight: 700, marginBottom: 10 }}>GOLD TEKNİK</div>
            <p style={{ fontSize: 13, lineHeight: 1.7 }}>Endüstriyel elektrik ve mekanik bakım onarım alanında profesyonel çözümler üretiyor, tesislerinizin sürekliliğini sağlıyoruz.</p>
          </div>
          <div>
            <div className="akm-mono" style={{ color: TOKENS.copperLight, fontSize: 12, letterSpacing: "0.1em", marginBottom: 14 }}>HIZLI LİNKLER</div>
            {navItems.map((n) => (
              <div key={n} style={{ fontSize: 13, marginBottom: 8 }}><a href="#" style={{ color: "inherit", textDecoration: "none" }}>{n}</a></div>
            ))}
          </div>
          <div>
            <div className="akm-mono" style={{ color: TOKENS.copperLight, fontSize: 12, letterSpacing: "0.1em", marginBottom: 14 }}>HİZMETLERİMİZ</div>
            {services.slice(0, 4).map((s) => (
              <div key={s.title} style={{ fontSize: 13, marginBottom: 8 }}>{s.title}</div>
            ))}
          </div>
          <div>
            <div className="akm-mono" style={{ color: TOKENS.copperLight, fontSize: 12, letterSpacing: "0.1em", marginBottom: 14 }}>İLETİŞİM</div>
            <div style={{ fontSize: 13, marginBottom: 8, display: "flex", alignItems: "center", gap: 8 }}><Phone size={14} /> 0534 561 86 80</div>
            <div style={{ fontSize: 13, marginBottom: 8, display: "flex", alignItems: "center", gap: 8 }}><Mail size={14} /> info@goldteknik.com</div>
            <div style={{ fontSize: 13, marginBottom: 8, display: "flex", alignItems: "center", gap: 8 }}><MapPin size={14} /> Erzurum / Türkiye</div>
            <div style={{ fontSize: 13, display: "flex", alignItems: "center", gap: 8 }}><Clock size={14} /> 7/24 Destek Hattı</div>
          </div>
        </div>
        <div style={{ maxWidth: 1200, margin: "40px auto 0", borderTop: "1px solid rgba(237,232,222,0.1)", paddingTop: 20, fontSize: 12, color: "rgba(237,232,222,0.4)", display: "flex", justifyContent: "space-between", flexWrap: "wrap", gap: 10 }}>
          <span>© 2026 Gold Teknik. Tüm hakları saklıdır.</span>
          <Link to="/admin" style={{ color: "rgba(255,255,255,0.35)", textDecoration: "none" }}>Yönetici Girişi</Link>
        </div>
      </footer>

      {/* WHATSAPP FLOATING BUTTON */}
      <a
        href={`https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(WHATSAPP_MESSAGE)}`}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="WhatsApp ile iletişime geçin"
        className="akm-btn"
        style={{
          position: "fixed",
          bottom: 24,
          right: 24,
          width: 56,
          height: 56,
          borderRadius: "50%",
          background: "#25D366",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          boxShadow: "0 8px 20px rgba(37,211,102,0.45)",
          zIndex: 60,
          textDecoration: "none",
        }}
      >
        <MessageCircle size={26} color="#fff" strokeWidth={2} />
        <span
          aria-hidden="true"
          style={{ position: "absolute", inset: -4, borderRadius: "50%", border: "2px solid rgba(37,211,102,0.5)", animation: "akm-pulse 2s ease-out infinite" }}
        />
      </a>
    </div>
  );
}

const inputStyle = {
  width: "100%",
  padding: "12px 14px",
  border: "1px solid rgba(27,31,36,0.15)",
  fontSize: 14,
  fontFamily: "inherit",
  background: "#fff",
  color: TOKENS.ink,
  outline: "none",
};
