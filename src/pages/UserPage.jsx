import React, { useState, useEffect } from "react";
import Navbar from "../components/Navbar";
import { useNavigate } from "react-router-dom";

// ─── Font + Style Injection ────────────────────────────────────────────────────
if (!document.getElementById("cust-fonts")) {
    const link = document.createElement("link");
    link.id = "cust-fonts";
    link.rel = "stylesheet";
    link.href =
        "https://fonts.googleapis.com/css2?family=Outfit:wght@400;500;600;700;800&family=Lora:wght@600;700&display=swap";
    document.head.appendChild(link);
}

if (!document.getElementById("cust-styles")) {
    const el = document.createElement("style");
    el.id = "cust-styles";
    el.textContent = `
    * { box-sizing: border-box; }
    .cust-root { font-family: 'Outfit', sans-serif; }

    /* ── Stats Grid ── */
    .cust-stats-grid {
      display: grid;
      grid-template-columns: repeat(4, 1fr);
      gap: 14px;
      margin-bottom: 20px;
    }
    @media (max-width: 900px) { .cust-stats-grid { grid-template-columns: repeat(2, 1fr); } }
    @media (max-width: 520px) { .cust-stats-grid { grid-template-columns: repeat(2, 1fr); gap: 10px; } }

    /* ── Stat Card ── */
    .cust-stat {
      background: #fff;
      border-radius: 18px;
      padding: 20px 20px 16px;
      border: 1px solid rgba(226,232,240,0.9);
      box-shadow: 0 2px 12px -4px rgba(15,23,42,0.06);
      position: relative;
      overflow: hidden;
      transition: box-shadow 0.25s cubic-bezier(0.4,0,0.2,1), transform 0.25s cubic-bezier(0.34,1.56,0.64,1);
      -webkit-tap-highlight-color: transparent;
    }
    .cust-stat:hover { box-shadow: 0 12px 32px -10px rgba(15,23,42,0.12); transform: translateY(-3px); }
    /* Accent bar moved to left edge for consistency with AdminDashboard */
    .cust-stat::after {
      content: '';
      position: absolute; left: 0; top: 0; bottom: 0;
      width: 3px;
      border-radius: 18px 0 0 18px;
    }
    .cust-stat.teal::after  { background: linear-gradient(180deg,#14b8a6,#0f766e); }
    .cust-stat.amber::after { background: linear-gradient(180deg,#fbbf24,#d97706); }
    .cust-stat.blue::after  { background: linear-gradient(180deg,#60a5fa,#2563eb); }
    .cust-stat.rose::after  { background: linear-gradient(180deg,#fb7185,#e11d48); }

    /* ── Panel ── */
    .cust-panel {
      background: #fff;
      border-radius: 18px;
      border: 1px solid rgba(226,232,240,0.9);
      box-shadow: 0 2px 12px -4px rgba(15,23,42,0.05);
      overflow: hidden;
    }
    .cust-panel-header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 14px 20px;
      border-bottom: 1px solid rgba(226,232,240,0.8);
      background: #fafafa;
      flex-wrap: wrap;
      gap: 10px;
    }

    /* ── Search + Filter bar ── */
    .cust-search-wrap {
      display: flex;
      align-items: center;
      gap: 8px;
      flex-wrap: wrap;
    }
    .cust-search {
      display: flex;
      align-items: center;
      gap: 8px;
      background: #f8fafc;
      border: 1px solid rgba(226,232,240,0.9);
      border-radius: 11px;
      padding: 7px 13px;
      min-width: 210px;
      transition: border-color 0.18s, box-shadow 0.18s;
    }
    .cust-search:focus-within {
      border-color: rgba(13,148,136,0.4);
      box-shadow: 0 0 0 3px rgba(13,148,136,0.1);
      background: #fff;
    }
    .cust-search input {
      border: none;
      outline: none;
      background: transparent;
      font-family: 'Outfit', sans-serif;
      font-size: 12.5px;
      color: #0f172a;
      width: 100%;
    }
    .cust-search input::placeholder { color: #94a3b8; }

    .cust-filter-btn {
      display: flex;
      align-items: center;
      gap: 5px;
      padding: 7px 14px;
      border-radius: 10px;
      border: 1px solid rgba(226,232,240,0.9);
      background: #f8fafc;
      font-family: 'Outfit', sans-serif;
      font-size: 12px;
      font-weight: 500;
      color: #64748b;
      cursor: pointer;
      transition: background 0.15s, color 0.15s, border-color 0.15s;
      -webkit-tap-highlight-color: transparent;
    }
    .cust-filter-btn:hover  { background: #f0fdfa; color: #0d9488; border-color: rgba(13,148,136,0.25); }
    .cust-filter-btn.active { background: rgba(13,148,136,0.08); color: #0d9488; border-color: rgba(13,148,136,0.3); font-weight: 600; }

    /* ── Table ── */
    .cust-table-wrap { overflow-x: auto; }
    .cust-table {
      width: 100%;
      border-collapse: collapse;
      min-width: 680px;
    }
    .cust-table th {
      font-family: 'Outfit', sans-serif;
      font-size: 10px;
      font-weight: 700;
      color: #94a3b8;
      letter-spacing: 0.09em;
      text-transform: uppercase;
      padding: 10px 20px;
      text-align: left;
      background: #fafafa;
      border-bottom: 1px solid rgba(226,232,240,0.8);
    }
    .cust-table td {
      padding: 13px 20px;
      border-bottom: 1px solid rgba(226,232,240,0.5);
      vertical-align: middle;
    }
    .cust-table tr:last-child td { border-bottom: none; }
    .cust-table tbody tr {
      cursor: pointer;
      transition: background 0.14s;
    }
    .cust-table tbody tr:hover { background: rgba(240,253,250,0.6); }

    /* ── Avatar ── */
    .cust-avatar {
      width: 36px; height: 36px;
      border-radius: 50%;
      display: flex; align-items: center; justify-content: center;
      font-family: 'Outfit', sans-serif;
      font-size: 12px; font-weight: 700;
      flex-shrink: 0;
      user-select: none;
    }

    /* ── Tier Badge ── */
    .cust-tier {
      display: inline-flex;
      align-items: center;
      gap: 4px;
      font-family: 'Outfit', sans-serif;
      font-size: 10.5px;
      font-weight: 700;
      letter-spacing: 0.05em;
      padding: 3px 9px;
      border-radius: 20px;
    }

    /* ── Status dot ── */
    .cust-status {
      display: inline-flex;
      align-items: center;
      gap: 5px;
      font-family: 'Outfit', sans-serif;
      font-size: 11px;
      font-weight: 600;
      padding: 3px 10px;
      border-radius: 20px;
    }

    /* ── Drawer overlay ── */
    .cust-overlay {
      position: fixed;
      inset: 0; // iski bajah se blurr poori screen par aa raha hai
      background: rgba(15,23,42,0.3);
      backdrop-filter: blur(3px);
      z-index: 10000;
      opacity: 0;
      transition: opacity 0.25s;
      pointer-events: none;
    }
    .cust-overlay.open { opacity: 1; pointer-events: auto; }

    /* ── Drawer ── */
    .cust-drawer {
      position: fixed;
      top: 0;
      right: 0;
      bottom: 0;
      width: 100%;
      max-width: 420px;
      background: #ffffff;
      border-left: 1px solid rgba(226,232,240,0.9);
      box-shadow: -16px 0 60px rgba(15,23,42,0.12);
      z-index: 10000;
      overflow-y: auto;
      transform: translateX(100%); // ye drawer ko screen ke bahar bhej raha hai
      transition: transform 0.3s cubic-bezier(0.22, 1, 0.36, 1);
    }
    @media (max-width: 640px) {
      .cust-drawer { max-width: 100%; }
    }

    .cust-drawer.open { transform: translateX(0); } /*  jaise hi open class add ho rahi hai open true hone ki bajah se, to ham us element par jispr cust-drawer class bhi hai aur open class bhi hai uspr ye property apply kar rahe hai, to pahle upar bali property lagti hai par jaise hi open class bhi add ho jati hai to ye .cust-drawer.open upar bale .cust-drawer ki properties ko overwrite kar deti hai aur ye apply ho jati hai*/

    .cust-drawer-header {
      padding: 22px 24px 18px;
      border-bottom: 1px solid rgba(226,232,240,0.8);
      background: #fafafa;
      display: flex;
      align-items: flex-start;
      justify-content: space-between;
      gap: 12px;
    }
    .cust-drawer-close {
      width: 32px; height: 32px;
      border-radius: 50%;
      border: 1px solid rgba(226,232,240,0.9);
      background: #fff;
      cursor: pointer;
      display: flex; align-items: center; justify-content: center;
      font-size: 14px;
      color: #64748b;
      flex-shrink: 0;
      transition: background 0.15s, color 0.15s, border-color 0.15s;
    }
    .cust-drawer-close:hover { background: #f1f5f9; color: #0f172a; border-color: rgba(203,213,225,0.9); }

    .cust-drawer-section {
      padding: 18px 24px;
      border-bottom: 1px solid rgba(226,232,240,0.7);
    }
    .cust-drawer-section:last-child { border-bottom: none; }

    .cust-mini-order {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 10px 13px;
      border-radius: 11px;
      background: #f8fafc;
      border: 1px solid rgba(226,232,240,0.8);
      margin-bottom: 8px;
      gap: 10px;
      transition: border-color 0.15s, background 0.15s;
    }
    .cust-mini-order:last-child { margin-bottom: 0; }
    .cust-mini-order:hover { background: #f0fdfa; border-color: rgba(13,148,136,0.2); }

    /* ── Pagination ── */
    .cust-pagination {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 12px 20px;
      border-top: 1px solid rgba(226,232,240,0.8);
      background: #fafafa;
      flex-wrap: wrap;
      gap: 8px;
    }
    .cust-pg-btn {
      padding: 6px 14px;
      border-radius: 10px;
      border: 1px solid rgba(226,232,240,0.9);
      background: #fff;
      font-family: 'Outfit', sans-serif;
      font-size: 12px;
      font-weight: 600;
      color: #64748b;
      cursor: pointer;
      transition: all 0.15s;
    }
    .cust-pg-btn:hover:not(:disabled) { background: #f0fdfa; color: #0d9488; border-color: rgba(13,148,136,0.25); }
    .cust-pg-btn:disabled { opacity: 0.38; cursor: default; }
    .cust-pg-num {
      display: flex;
      gap: 4px;
    }
    .cust-pg-num button {
      width: 30px; height: 30px;
      border-radius: 9px;
      border: 1px solid rgba(226,232,240,0.9);
      background: #fff;
      font-family: 'Outfit', sans-serif;
      font-size: 12px;
      cursor: pointer;
      color: #64748b;
      transition: all 0.15s;
    }
    .cust-pg-num button.active { background: rgba(13,148,136,0.08); color: #0d9488; border-color: rgba(13,148,136,0.3); font-weight: 700; }
    .cust-pg-num button:hover:not(.active) { background: #f0fdfa; color: #0d9488; }
  `;
    document.head.appendChild(el);
}

// ─── Tokens ───────────────────────────────────────────────────────────────────
const T = {
    bg: "#f1f5f9",
    text: "#0f172a",
    sub: "#64748b",
    faint: "#94a3b8",
    teal: "#0d9488",
};

// ─── Helpers ──────────────────────────────────────────────────────────────────
const AVATAR_COLORS = [
    { bg: "#dcfce7", color: "#14532d" },
    { bg: "#fee2e2", color: "#7f1d1d" },
    { bg: "#dbeafe", color: "#1e3a5f" },
    { bg: "#fef9c3", color: "#713f12" },
    { bg: "#ede9fe", color: "#3b0764" },
    { bg: "#fce7f3", color: "#831843" },
];
const getAvatarColor = (name = "") => AVATAR_COLORS[name.charCodeAt(0) % AVATAR_COLORS.length];
const getInitials = (name = "") => name.split(" ").slice(0, 2).map(w => w[0]).join("").toUpperCase();
const fmtAmount = (n) => `₹${Number(n).toLocaleString("en-IN")}`;
const fmtDate = (d) => new Date(d).toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" });

// ─── Tier Config ─────────────────────────────────────────────────────────────
const TIER_CONFIG = {
    Bronze:   { bg: "#fef3c7", color: "#92400e",  icon: "🥉" },
    Silver:   { bg: "#f1f5f9", color: "#475569",  icon: "🥈" },
    Gold:     { bg: "#fefce8", color: "#854d0e",  icon: "🥇" },
    Platinum: { bg: "#f0fdfa", color: "#0f766e",  icon: "💎" },
};

const STATUS_CONFIG = {
    Active:   { bg: "#f0fdfa", color: "#0f766e", dot: "#0d9488", border: "rgba(13,148,136,0.2)" },
    Inactive: { bg: "#f8fafc", color: "#64748b", dot: "#94a3b8", border: "rgba(148,163,184,0.25)" },
};

// ─── Stat Icon BG ─────────────────────────────────────────────────────────────
const STAT_ICON_BG = { teal: "#f0fdfa", amber: "#fffbeb", blue: "#eff6ff", rose: "#fff1f2" };

// ─── Stat Card ────────────────────────────────────────────────────────────────
const StatCard = ({ icon, title, value, sub, accent }) => (
    <div className={`cust-stat ${accent}`}>
        <div style={{
            width: 36, height: 36, borderRadius: 11,
            background: STAT_ICON_BG[accent] || "#f8fafc",
            display: "flex", alignItems: "center", justifyContent: "center",
            fontSize: 17, marginBottom: 14,
        }}>
            {icon}
        </div>
        <p style={{
            fontFamily: "'Outfit', sans-serif",
            fontSize: 10, color: T.faint, letterSpacing: "0.09em",
            textTransform: "uppercase", fontWeight: 700, marginBottom: 4,
        }}>
            {title}
        </p>
        <h2 style={{
            fontFamily: "'Lora', serif",
            fontSize: 28, fontWeight: 700, color: T.text,
            lineHeight: 1, marginBottom: 5, letterSpacing: "-0.03em",
        }}>
            {value}
        </h2>
        <p style={{ fontFamily: "'Outfit', sans-serif", fontSize: 11.5, color: T.sub }}>{sub}</p>
    </div>
);

// ─── Customer Drawer ───────────────────────────────────────────────────────────
const CustomerDrawer = ({ customer, onClose }) => {
    const open = Boolean(customer);
    const navigate = useNavigate();

    const avatarStyle = customer ? getAvatarColor(customer.name || "") : {};
    const tier   = customer ? (TIER_CONFIG[customer.tier]   || TIER_CONFIG.Bronze)   : {};
    const status = customer ? (STATUS_CONFIG[customer.status] || STATUS_CONFIG.Inactive) : {};
    const { bg, color } = avatarStyle;

    const ORDER_STATUS = {
        Paid:    { bg: "#f0fdfa", color: "#0f766e", dot: "#0d9488" },
        Pending: { bg: "#fffbeb", color: "#92400e", dot: "#d97706" },
        Failed:  { bg: "#fff1f2", color: "#be123c", dot: "#ef4444" },
    };

    return (
        <>
            <div className={`cust-overlay ${open ? "open" : ""}`} onClick={onClose} /> {/** screen par kahi bhi click karo onclose ko trigger kardo jo ki selected ko null kar dega, jisse customer prop null ho jayega and usse open false ho jayega jisse hamari .open class hat jayegi aur kebal .cust-drawer class apply hogi jisse translateX(100%) ho jayega jisse drawer screen ke bahar chala jayega */}
            <div className={`cust-drawer ${open ? "open" : ""}`}>
                {open && (
                    <>
                        {/* Header */}
                        <div className="cust-drawer-header">
                            <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
                                <div className="cust-avatar" style={{ background: bg, color, width: 52, height: 52, fontSize: 18 }}>
                                    {getInitials(customer.name)}
                                </div>
                                <div>
                                    <h2 style={{
                                        fontFamily: "'Lora', serif",
                                        fontSize: 20, fontWeight: 700, color: T.text, lineHeight: 1.15,
                                        margin: 0,
                                    }}>
                                        {customer.name}
                                    </h2>
                                    <p style={{
                                        fontFamily: "'Outfit', sans-serif",
                                        fontSize: 12, color: T.sub, marginTop: 3, marginBottom: 0,
                                    }}>
                                        {customer.email}
                                    </p>
                                    <div style={{ display: "flex", gap: 6, marginTop: 8, flexWrap: "wrap" }}>
                                        <span className="cust-tier" style={{ background: tier.bg, color: tier.color }}>
                                            {tier.icon} {customer.tier}
                                        </span>
                                        <span className="cust-status" style={{ background: status.bg, color: status.color, border: `1px solid ${status.border}` }}>
                                            <span style={{ width: 5, height: 5, borderRadius: "50%", background: status.dot }} />
                                            {customer.status}
                                        </span>
                                    </div>
                                </div>
                            </div>
                            <button className="cust-drawer-close" onClick={onClose}>✕</button>
                        </div>

                        {/* Info */}
                        <div className="cust-drawer-section">
                            <p style={{
                                fontFamily: "'Outfit', sans-serif",
                                fontSize: 10, color: T.faint, letterSpacing: "0.09em",
                                textTransform: "uppercase", fontWeight: 700, marginBottom: 12,
                            }}>
                                Contact & Info
                            </p>
                            {[
                                ["📱", "Phone",       customer.phoneNumber],
                                ["📍", "City",        customer.city],
                                ["📅", "Joined",      fmtDate(customer.createdAt)],
                                ["🕐", "Last Active", fmtDate(customer.lastActivity)],
                            ].map(([icon, label, val]) => (
                                <div key={label} style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 10 }}>
                                    <span style={{ fontSize: 14, width: 20, textAlign: "center" }}>{icon}</span>
                                    <span style={{
                                        fontFamily: "'Outfit', sans-serif",
                                        fontSize: 11.5, color: T.faint, width: 82, flexShrink: 0,
                                    }}>
                                        {label}
                                    </span>
                                    <span style={{
                                        fontFamily: "'Outfit', sans-serif",
                                        fontSize: 12.5, fontWeight: 600, color: T.text,
                                    }}>
                                        {val}
                                    </span>
                                </div>
                            ))}
                        </div>

                        {/* Spend Summary */}
                        <div className="cust-drawer-section">
                            <p style={{
                                fontFamily: "'Outfit', sans-serif",
                                fontSize: 10, color: T.faint, letterSpacing: "0.09em",
                                textTransform: "uppercase", fontWeight: 700, marginBottom: 12,
                            }}>
                                Spend Summary
                            </p>
                            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
                                {[
                                    ["Total Spend",   fmtAmount(customer.totalSpent)],
                                    ["Total Orders",  customer.totalOrders],
                                    ["Avg Order",     fmtAmount(customer.avgOrder)],
                                    ["Tier",          customer.tier],
                                ].map(([label, val]) => (
                                    <div
                                        key={label}
                                        onClick={label === "Total Orders" ? () => navigate(`/admin/${customer._id}/orders`) : undefined}
                                        style={{
                                            background: "#f8fafc",
                                            border: "1px solid rgba(226,232,240,0.9)",
                                            borderRadius: 12, padding: "12px 14px",
                                            cursor: label === "Total Orders" ? "pointer" : "default",
                                            transition: "border-color 0.15s, background 0.15s",
                                        }}
                                        onMouseEnter={e => {
                                            if (label === "Total Orders") {
                                                e.currentTarget.style.borderColor = "rgba(13,148,136,0.3)";
                                                e.currentTarget.style.background = "#f0fdfa";
                                            }
                                        }}
                                        onMouseLeave={e => {
                                            e.currentTarget.style.borderColor = "rgba(226,232,240,0.9)";
                                            e.currentTarget.style.background = "#f8fafc";
                                        }}
                                    >
                                        <p style={{
                                            fontFamily: "'Outfit', sans-serif",
                                            fontSize: 10, color: T.faint, letterSpacing: "0.07em",
                                            textTransform: "uppercase", fontWeight: 600, marginBottom: 5,
                                        }}>
                                            {label}
                                        </p>
                                        <p style={{
                                            fontFamily: "'Lora', serif",
                                            fontSize: 19, fontWeight: 700, color: T.text, lineHeight: 1,
                                            margin: 0,
                                        }}>
                                            {val}
                                        </p>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Recent Orders */}
                        <div className="cust-drawer-section">
                            <p style={{
                                fontFamily: "'Outfit', sans-serif",
                                fontSize: 10, color: T.faint, letterSpacing: "0.09em",
                                textTransform: "uppercase", fontWeight: 700, marginBottom: 12,
                            }}>
                                Recent Orders
                            </p>
                            {(customer.recentOrders || []).map((o) => {
                                const os = ORDER_STATUS[o.status] || ORDER_STATUS.Pending;
                                return (
                                    <div key={o.id} className="cust-mini-order">
                                        <div>
                                            <p style={{
                                                fontFamily: "'Outfit', sans-serif",
                                                fontSize: 12.5, fontWeight: 600, color: T.text, margin: 0,
                                            }}>
                                                {o.id}
                                            </p>
                                            <p style={{
                                                fontFamily: "'Outfit', sans-serif",
                                                fontSize: 11, color: T.faint, marginTop: 2, marginBottom: 0,
                                            }}>
                                                {o.date}
                                            </p>
                                        </div>
                                        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                                            <span style={{
                                                fontFamily: "'Outfit', sans-serif",
                                                fontSize: 10.5, fontWeight: 600,
                                                padding: "2px 9px", borderRadius: 20,
                                                background: os.bg, color: os.color,
                                                display: "inline-flex", alignItems: "center", gap: 4,
                                            }}>
                                                <span style={{ width: 4, height: 4, borderRadius: "50%", background: os.dot }} />
                                                {o.status}
                                            </span>
                                            <p style={{
                                                fontFamily: "'Lora', serif",
                                                fontWeight: 700, fontSize: "1rem", color: T.text,
                                                whiteSpace: "nowrap", margin: 0,
                                            }}>
                                                {fmtAmount(o.amount)}
                                            </p>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>

                        {/* Actions */}
                        <div className="cust-drawer-section">
                            <p style={{
                                fontFamily: "'Outfit', sans-serif",
                                fontSize: 10, color: T.faint, letterSpacing: "0.09em",
                                textTransform: "uppercase", fontWeight: 700, marginBottom: 12,
                            }}>
                                Actions
                            </p>
                            <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                                {[
                                    { label: "✉️ Send Email",   bg: "#eff6ff", color: "#1d4ed8" },
                                    { label: "🚫 Deactivate",   bg: "#fff1f2", color: "#be123c" },
                                    { label: "🔝 Upgrade Tier", bg: "#f0fdfa", color: "#0f766e" },
                                ].map(({ label, bg: btnBg, color: btnColor }) => (
                                    <button
                                        key={label}
                                        onClick={() => { }}
                                        style={{
                                            padding: "8px 16px",
                                            borderRadius: 10,
                                            border: "none",
                                            background: btnBg,
                                            color: btnColor,
                                            fontFamily: "'Outfit', sans-serif",
                                            fontSize: 12,
                                            fontWeight: 600,
                                            cursor: "pointer",
                                            transition: "opacity 0.15s, transform 0.15s",
                                        }}
                                        onMouseEnter={e => { e.target.style.opacity = 0.75; e.target.style.transform = "translateY(-1px)"; }}
                                        onMouseLeave={e => { e.target.style.opacity = 1; e.target.style.transform = "none"; }}
                                    >
                                        {label}
                                    </button>
                                ))}
                            </div>
                        </div>
                    </>
                )}
            </div>
        </>
    );
};

// ─── Main Component ────────────────────────────────────────────────────────────
const CustomersPage = () => {
    const [customers, setcustomers] = useState([])
    const [loading, setloading] = useState(true)
    const [search, setSearch] = useState("");
    const [total, settotal] = useState(0)
    const [filterStatus, setFilterStatus] = useState("All");
    const [filterTier, setFilterTier] = useState("All");
    const [totalActive, settotalActive] = useState(0)
    const [avgOrder, setavgOrder] = useState(0)
    const [neww, setneww] = useState(0)
    const [selected, setSelected] = useState(null);
    const [page, setPage] = useState(1);
    const PER_PAGE = 5;

    useEffect(() => {
        if (selected) {
            document.body.style.overflow = "hidden";
        } else {
            document.body.style.overflow = "auto";
        }

        return () => {
            document.body.style.overflow = "auto"; // effect jo changes karta hai return un changes ko reset karta hai
        };
    }, [selected]);

    const fetchCustomers = async () => {
        try {
            const token = localStorage.getItem("CommerceToken")
            const res = await fetch(`${import.meta.env.VITE_API_URL}/api/customers/getAllCustomers?page=${page}&limit=${PER_PAGE}&status=${filterStatus}&tier=${filterTier}`, {
                headers: {
                    Authorization: `Bearer ${token}`, // 🔥 important
                },
            })
            const result = await res.json() // json string me convert hokar network par send hota hai isliye ham yaha .json me dubara convert karte hai jisse bo stringified json se usable json object me convert ho jaye
            if (!res.ok) {
                console.log(result.message)
            }
            console.log("success", result)
            setcustomers(result.customers)
            settotal(result.totalcustomers)
            settotalActive(result.totalActive)
            setneww(result.newThisMonth)
            const totalamount = result.avgOrder[0].totalamount
            const totalOrder = result.avgOrder[0].totalOrder
            const avg = totalOrder > 0 ? Math.ceil(totalamount / totalOrder) : 0
            setavgOrder(avg)

        } catch (error) {
            console.log(error)
        } finally {
            setloading(false)
        }
    }

    useEffect(() => {
        fetchCustomers()
    }, [page, filterStatus, filterTier])

    // Filtered
    //  const filtered=customers.filter(c=>
    //  {
    //     const matchStatus=filterStatus==="All"|| c.status==filterStatus
    //     const matchTier=filterTier==="All"|| c.tier==filterTier
    //     return matchStatus && matchTier // customer include hoga kebal tab hi jab status match kare plus tier bhi match kare, jaise manlo maine inactive par click kara to active bana status me reject ho gaya par tier(kyoki tier tab all hoga) me paas ho gaya but because of && bo overall last me reject ho gaya
    //  }
    //  )
    const totalPages = Math.ceil(total / PER_PAGE);
    //   const paginated = filtered.slice((page - 1) * PER_PAGE, page * PER_PAGE);

    const handleFilter = (type, val) => {
        if (type === "status") setFilterStatus(val);
        else setFilterTier(val);
        setPage(1)
    };

    return (
        <div style={{ background: T.bg, minHeight: "100vh" }}>
            {/* Navbar wrapper */}
            <div style={{
                background: "linear-gradient(160deg, rgba(240,253,250,0.55) 0%, #f1f5f9 60%)",
                paddingTop: 16, paddingBottom: 4,
            }}>
                <Navbar />
            </div>

            <div
                className="cust-root mx-auto"
                style={{ maxWidth: 1560, padding: "20px 20px 40px" }}
            >
                {/* ── Page heading ── */}
                <div style={{ marginBottom: 20 }}>
                    <p style={{
                        fontFamily: "'Outfit', sans-serif",
                        fontSize: 10.5, fontWeight: 700, letterSpacing: "0.12em",
                        textTransform: "uppercase", color: T.teal,
                        margin: "0 0 5px",
                        display: "flex", alignItems: "center", gap: 7,
                    }}>
                        <span style={{ width: 22, height: 1, background: "linear-gradient(90deg,#14b8a6,transparent)", display: "inline-block" }} />
                        Ecomora Admin
                    </p>
                    <h1 style={{
                        fontFamily: "'Lora', serif",
                        fontWeight: 700, fontSize: "2rem",
                        color: T.text, letterSpacing: "-0.03em",
                        lineHeight: 1, margin: 0,
                    }}>
                        Customers
                    </h1>
                </div>

                {/* Stats */}
                <div className="cust-stats-grid">
                    <StatCard accent="teal"  icon="👥" title="Total Customers"  value={total}       sub={`${totalActive} active`} />
                    <StatCard accent="amber" icon="✅" title="Active"           value={totalActive} sub="currently active" />
                    <StatCard accent="blue"  icon="🆕" title="New This Month"   value={neww}        sub="joined recently" />
                    <StatCard accent="rose"  icon="📊" title="Avg Order Value"  value={avgOrder}    sub="across all orders" />
                </div>

                {/* Table Panel */}
                <div className="cust-panel">
                    {/* Panel Header */}
                    <div className="cust-panel-header">
                        <span style={{
                            fontFamily: "'Lora', serif",
                            fontSize: 17, fontWeight: 700, color: T.text,
                        }}>
                            All Customers
                        </span>

                        <div className="cust-search-wrap">
                            {/* Search */}
                            <div className="cust-search">
                                <svg width="14" height="14" fill="none" stroke="#94a3b8" strokeWidth="2" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-4.35-4.35m1.35-5.15a7 7 0 11-14 0 7 7 0 0114 0z" />
                                </svg>
                                <input
                                    placeholder="Search name, email, city…"
                                    value={search}
                                    onChange={e => { setSearch(e.target.value); setPage(1); }}
                                />
                                {search && (
                                    <span style={{ cursor: "pointer", color: T.faint, fontSize: 12 }} onClick={() => setSearch("")}>✕</span>
                                )}
                            </div>

                            {/* Status filters */}
                            {["All", "Active", "Inactive"].map(v => (
                                <button key={v} className={`cust-filter-btn ${filterStatus === v ? "active" : ""}`} onClick={() => handleFilter("status", v)}>
                                    {v}
                                </button>
                            ))}

                            {/* Tier filter */}
                            <select
                                value={filterTier}
                                onChange={e => handleFilter("tier", e.target.value)}
                                style={{
                                    padding: "7px 13px",
                                    borderRadius: 10,
                                    border: "1px solid rgba(226,232,240,0.9)",
                                    background: "#f8fafc",
                                    fontFamily: "'Outfit', sans-serif",
                                    fontSize: 12,
                                    fontWeight: 500,
                                    color: T.sub,
                                    cursor: "pointer",
                                    outline: "none",
                                }}
                            >
                                {["All", "Bronze", "Silver", "Gold", "Platinum"].map(t => (
                                    <option key={t} value={t}>{t === "All" ? "All Tiers" : t}</option>
                                ))}
                            </select>
                        </div>
                    </div>

                    {/* Table */}
                    <div className="cust-table-wrap">
                        <table className="cust-table">
                            <thead>
                                <tr>
                                    <th>Customer</th>
                                    <th>City</th>
                                    <th>Tier</th>
                                    <th>Orders</th>
                                    <th>Total Spend</th>
                                    <th>Last Active</th>
                                    <th>Status</th>
                                </tr>
                            </thead>
                            <tbody>
                                {customers.length === 0
                                    ? <tr>
                                        <td colSpan="100%" style={{
                                            textAlign: "center", padding: "48px",
                                            fontFamily: "'Outfit', sans-serif",
                                            fontSize: 13, color: T.faint,
                                        }}>
                                            No customers to display at the moment.
                                        </td>
                                    </tr>
                                    : customers.map((c) => { // empty array par hamara map allowed hota hai , isliye array me koi issue nhi aata
                                        const { bg, color } = getAvatarColor(c.name || "");
                                        const tier   = TIER_CONFIG[c.tier]   || { bg: "#fef3c7", color: "#92400e", icon: "🥉" }; // ye object se value access kar rahe hai by giving key TIER_CONFIG["Gold"], gold as a key paas kardi TIER_CONFIG OBJECT ME, key kyoki dynamic hai to hame ye notation use karna padega dot notation ki jagah
                                        const status = STATUS_CONFIG[c.status] || STATUS_CONFIG.Inactive;
                                        return (
                                            <tr key={c._id} onClick={() => setSelected(c)}>  {/** ispr click karne se selected ke andar customer dal de rahe hai */}
                                                <td>
                                                    <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                                                        <div className="cust-avatar" style={{ background: bg, color }}>{getInitials(c.name)}</div>
                                                        <div>
                                                            <p style={{
                                                                fontFamily: "'Outfit', sans-serif",
                                                                fontSize: 13, fontWeight: 600, color: T.text, margin: 0,
                                                            }}>
                                                                {c.name}
                                                            </p>
                                                            <p style={{
                                                                fontFamily: "'Outfit', sans-serif",
                                                                fontSize: 11, color: T.faint, marginTop: 1, marginBottom: 0,
                                                            }}>
                                                                {c.email}
                                                            </p>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td style={{ fontFamily: "'Outfit', sans-serif", fontSize: 13, color: T.sub }}>{c.city}</td>
                                                <td>
                                                    {c.tier
                                                        ? <span className="cust-tier" style={{ background: tier.bg, color: tier.color }}>{tier.icon} {c.tier}</span>
                                                        : <span style={{ fontSize: 12, color: T.faint }}>—</span>
                                                    }
                                                </td>
                                                <td style={{
                                                    fontFamily: "'Lora', serif",
                                                    fontSize: 18, fontWeight: 700, color: T.text,
                                                }}>
                                                    {c.totalOrders ?? "—"}
                                                </td>
                                                <td style={{
                                                    fontFamily: "'Lora', serif",
                                                    fontSize: 18, fontWeight: 700, color: T.text,
                                                }}>
                                                    {c.totalSpent != null ? fmtAmount(c.totalSpent) : "—"}
                                                </td>
                                                <td style={{ fontFamily: "'Outfit', sans-serif", fontSize: 12, color: T.sub }}>
                                                    {c.lastActivity ? fmtDate(c.lastActivity) : "—"}
                                                </td>
                                                <td>
                                                    <span className="cust-status" style={{ background: status.bg, color: status.color, border: `1px solid ${status.border}` }}>
                                                        <span style={{ width: 5, height: 5, borderRadius: "50%", background: status.dot }} />
                                                        {c.status || "—"}
                                                    </span>
                                                </td>
                                            </tr>
                                        );
                                    })
                                }
                            </tbody>
                        </table>
                    </div>

                    {/* Pagination */}
                    <div className="cust-pagination">
                        <span style={{
                            fontFamily: "'Outfit', sans-serif",
                            fontSize: 12, color: T.faint,
                        }}>
                            Showing {(page - 1) * PER_PAGE + 1}–{Math.min(page * PER_PAGE, total)} of {total} customers
                        </span>
                        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                            <button className="cust-pg-btn" disabled={page === 1} onClick={() => setPage(p => p - 1)}>← Prev</button>
                            <div className="cust-pg-num">
                                {Array.from({ length: totalPages }, (_, i) => i + 1).map(n => (
                                    <button key={n} className={page === n ? "active" : ""} onClick={() => setPage(n)}>{n}</button>
                                ))}
                            </div>
                            <button className="cust-pg-btn" disabled={page === totalPages || totalPages === 0} onClick={() => setPage(p => p + 1)}>Next →</button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Customer Detail Drawer */}
            <CustomerDrawer customer={selected} onClose={() => setSelected(null)} /> {/** ye hamesha mounted hai aur isme 2 props pass ho rahe hai */}
        </div>
    );
};

export default CustomersPage;