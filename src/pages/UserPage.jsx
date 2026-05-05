import React, { useState,useEffect } from "react";
import Navbar from "../components/Navbar";

// ─── Font + Style Injection ────────────────────────────────────────────────────
if (!document.getElementById("cust-fonts")) {
  const link = document.createElement("link");
  link.id = "cust-fonts";
  link.rel = "stylesheet";
  link.href =
    "https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@500;600;700&family=DM+Sans:wght@300;400;500;600&display=swap";
  document.head.appendChild(link);
}

if (!document.getElementById("cust-styles")) {
  const el = document.createElement("style");
  el.id = "cust-styles";
  el.textContent = `
    * { box-sizing: border-box; }
    .cust-root { font-family: 'DM Sans', sans-serif; }

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
      border-radius: 16px;
      padding: 18px 20px;
      border: 1px solid rgba(60,40,20,0.08);
      box-shadow: 0 4px 24px -6px rgba(28,20,16,0.08);
      position: relative;
      overflow: hidden;
      transition: box-shadow 0.22s, transform 0.22s;
      -webkit-tap-highlight-color: transparent;
    }
    .cust-stat:hover { box-shadow: 0 10px 32px -8px rgba(28,20,16,0.14); transform: translateY(-2px); }
    .cust-stat::after {
      content: '';
      position: absolute; right: 0; top: 0; bottom: 0;
      width: 4px;
      border-radius: 0 16px 16px 0;
    }
    .cust-stat.teal::after  { background: #0f766e; }
    .cust-stat.amber::after { background: #C0841A; }
    .cust-stat.blue::after  { background: #378ADD; }
    .cust-stat.rose::after  { background: #BE4B72; }

    /* ── Panel ── */
    .cust-panel {
      background: #fff;
      border-radius: 16px;
      border: 1px solid rgba(60,40,20,0.08);
      box-shadow: 0 4px 24px -6px rgba(28,20,16,0.06);
      overflow: hidden;
    }
    .cust-panel-header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 15px 20px;
      border-bottom: 1px solid rgba(60,40,20,0.06);
      background: #FAFAF9;
      flex-wrap: wrap;
      gap: 10px;
    }

    /* ── Search + Filter bar ── */
    .cust-search-wrap {
      display: flex;
      align-items: center;
      gap: 10px;
      flex-wrap: wrap;
    }
    .cust-search {
      display: flex;
      align-items: center;
      gap: 8px;
      background: #F5F3EF;
      border: 1px solid rgba(60,40,20,0.1);
      border-radius: 10px;
      padding: 7px 14px;
      min-width: 220px;
    }
    .cust-search input {
      border: none;
      outline: none;
      background: transparent;
      font-family: 'DM Sans', sans-serif;
      font-size: 13px;
      color: #1C1410;
      width: 100%;
    }
    .cust-search input::placeholder { color: #A09180; }

    .cust-filter-btn {
      display: flex;
      align-items: center;
      gap: 6px;
      padding: 7px 14px;
      border-radius: 10px;
      border: 1px solid rgba(60,40,20,0.1);
      background: #F5F3EF;
      font-family: 'DM Sans', sans-serif;
      font-size: 12px;
      font-weight: 500;
      color: #7A6E63;
      cursor: pointer;
      transition: background 0.15s, color 0.15s;
      -webkit-tap-highlight-color: transparent;
    }
    .cust-filter-btn:hover  { background: #EDE9E1; color: #1C1410; }
    .cust-filter-btn.active { background: #0f766e; color: #fff; border-color: #0f766e; }

    /* ── Table ── */
    .cust-table-wrap { overflow-x: auto; }
    .cust-table {
      width: 100%;
      border-collapse: collapse;
      min-width: 680px;
    }
    .cust-table th {
      font-size: 10px;
      font-weight: 600;
      color: #A09180;
      letter-spacing: 0.08em;
      text-transform: uppercase;
      padding: 10px 20px;
      text-align: left;
      background: #FAFAF9;
      border-bottom: 1px solid rgba(60,40,20,0.06);
    }
    .cust-table td {
      padding: 13px 20px;
      border-bottom: 1px solid rgba(60,40,20,0.05);
      vertical-align: middle;
    }
    .cust-table tr:last-child td { border-bottom: none; }
    .cust-table tbody tr {
      cursor: pointer;
      transition: background 0.14s;
    }
    .cust-table tbody tr:hover { background: #F7F4EF; }

    /* ── Avatar ── */
    .cust-avatar {
      width: 36px; height: 36px;
      border-radius: 50%;
      display: flex; align-items: center; justify-content: center;
      font-size: 12px; font-weight: 700;
      flex-shrink: 0;
      user-select: none;
    }

    /* ── Tier Badge ── */
    .cust-tier {
      display: inline-flex;
      align-items: center;
      gap: 4px;
      font-size: 10px;
      font-weight: 700;
      letter-spacing: 0.06em;
      padding: 3px 9px;
      border-radius: 20px;
    }

    /* ── Status dot ── */
    .cust-status {
      display: inline-flex;
      align-items: center;
      gap: 5px;
      font-size: 11px;
      font-weight: 600;
      padding: 3px 10px;
      border-radius: 20px;
    }

    /* ── Drawer overlay ── */
    .cust-overlay {
      position: fixed;
      inset: 0;
      background: rgba(28,20,16,0.35);
      backdrop-filter: blur(2px);
      z-index: 100;
      opacity: 0;
      transition: opacity 0.25s;
      pointer-events: none;
    }
    .cust-overlay.open { opacity: 1; pointer-events: auto; }

    /* ── Drawer ── */
    .cust-drawer {
      position: fixed;
      top: 0; right: 0; bottom: 0;
      width: min(420px, 100vw);
      background: #FEFCF9;
      border-left: 1px solid rgba(60,40,20,0.1);
      box-shadow: -12px 0 60px rgba(28,20,16,0.14);
      z-index: 101;
      overflow-y: auto;
      transform: translateX(100%);
      transition: transform 0.3s cubic-bezier(0.22, 1, 0.36, 1);
    }
    .cust-drawer.open { transform: translateX(0); }

    .cust-drawer-header {
      padding: 22px 24px 18px;
      border-bottom: 1px solid rgba(60,40,20,0.07);
      background: #F5F3EF;
      display: flex;
      align-items: flex-start;
      justify-content: space-between;
      gap: 12px;
    }
    .cust-drawer-close {
      width: 32px; height: 32px;
      border-radius: 50%;
      border: 1px solid rgba(60,40,20,0.12);
      background: #fff;
      cursor: pointer;
      display: flex; align-items: center; justify-content: center;
      font-size: 16px;
      color: #7A6E63;
      flex-shrink: 0;
      transition: background 0.15s;
    }
    .cust-drawer-close:hover { background: #EDE9E1; color: #1C1410; }

    .cust-drawer-section {
      padding: 18px 24px;
      border-bottom: 1px solid rgba(60,40,20,0.06);
    }
    .cust-drawer-section:last-child { border-bottom: none; }

    .cust-mini-order {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 10px 14px;
      border-radius: 10px;
      background: #F5F3EF;
      margin-bottom: 8px;
      gap: 10px;
    }
    .cust-mini-order:last-child { margin-bottom: 0; }

    /* ── Pagination ── */
    .cust-pagination {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 12px 20px;
      border-top: 1px solid rgba(60,40,20,0.06);
      background: #FAFAF9;
      flex-wrap: wrap;
      gap: 8px;
    }
    .cust-pg-btn {
      padding: 5px 14px;
      border-radius: 8px;
      border: 1px solid rgba(60,40,20,0.1);
      background: #fff;
      font-family: 'DM Sans', sans-serif;
      font-size: 12px;
      font-weight: 500;
      color: #7A6E63;
      cursor: pointer;
      transition: background 0.14s;
    }
    .cust-pg-btn:hover:not(:disabled) { background: #F3EFE8; color: #1C1410; }
    .cust-pg-btn:disabled { opacity: 0.4; cursor: default; }
    .cust-pg-num {
      display: flex;
      gap: 4px;
    }
    .cust-pg-num button {
      width: 30px; height: 30px;
      border-radius: 8px;
      border: 1px solid rgba(60,40,20,0.1);
      background: #fff;
      font-family: 'DM Sans', sans-serif;
      font-size: 12px;
      cursor: pointer;
      color: #7A6E63;
      transition: background 0.14s;
    }
    .cust-pg-num button.active { background: #0f766e; color: #fff; border-color: #0f766e; font-weight: 600; }
    .cust-pg-num button:hover:not(.active) { background: #F3EFE8; }
  `;
  document.head.appendChild(el);
}

// ─── Tokens ───────────────────────────────────────────────────────────────────
const T = {
  bg: "#F5F3EF",
  text: "#1C1410",
  sub: "#7A6E63",
  faint: "#A09180",
  parchment: "#F3EFE8",
  teal: "#0f766e",
};

// ─── Demo Data ─────────────────────────────────────────────────────────────────
const DEMO_CUSTOMERS = [
  { _id: "1", name: "Aanya Sharma",    email: "aanya@gmail.com",       phone: "+91 98200 11234", city: "Mumbai",    joined: "2024-01-14", lastActive: "2025-06-28", status: "Active",   tier: "Gold",     orders: 18, spend: 42800, recentOrders: [{ id: "#ORD-A8F1C2", date: "28 Jun", amount: 3200, status: "Paid" },{ id: "#ORD-B3D7E1", date: "15 Jun", amount: 1850, status: "Paid" },{ id: "#ORD-C9A2F4", date: "01 Jun", amount: 5400, status: "Paid" }] },
  { _id: "2", name: "Rohan Mehta",     email: "rohan.m@outlook.com",   phone: "+91 91234 56789", city: "Delhi",     joined: "2024-03-02", lastActive: "2025-06-25", status: "Active",   tier: "Platinum", orders: 34, spend: 98500, recentOrders: [{ id: "#ORD-D2B8A1", date: "25 Jun", amount: 7800, status: "Paid" },{ id: "#ORD-E5C3F9", date: "18 Jun", amount: 3100, status: "Paid" }] },
  { _id: "3", name: "Priya Nair",      email: "priya.nair@yahoo.com",  phone: "+91 87654 32100", city: "Kochi",     joined: "2024-05-18", lastActive: "2025-06-01", status: "Inactive", tier: "Silver",   orders: 6,  spend: 12300, recentOrders: [{ id: "#ORD-F1D4B6", date: "01 Jun", amount: 2200, status: "Pending" }] },
  { _id: "4", name: "Karan Bhatia",    email: "karanbhatia@icloud.com",phone: "+91 99887 76655", city: "Bangalore", joined: "2023-11-05", lastActive: "2025-06-29", status: "Active",   tier: "Platinum", orders: 52, spend: 187400, recentOrders: [{ id: "#ORD-G7E2C8", date: "29 Jun", amount: 12000, status: "Paid" },{ id: "#ORD-H4A9D1", date: "22 Jun", amount: 8500, status: "Paid" },{ id: "#ORD-I6B3F7", date: "10 Jun", amount: 4200, status: "Paid" }] },
  { _id: "5", name: "Sneha Kulkarni",  email: "sneha.k@gmail.com",     phone: "+91 82345 67890", city: "Pune",      joined: "2024-07-22", lastActive: "2025-05-30", status: "Inactive", tier: "Bronze",   orders: 3,  spend: 4750,  recentOrders: [{ id: "#ORD-J2C5E9", date: "30 May", amount: 1900, status: "Paid" }] },
  { _id: "6", name: "Arjun Reddy",     email: "arjun.reddy@gmail.com", phone: "+91 73456 78901", city: "Hyderabad", joined: "2024-02-10", lastActive: "2025-06-27", status: "Active",   tier: "Gold",     orders: 21, spend: 56200, recentOrders: [{ id: "#ORD-K8D1A4", date: "27 Jun", amount: 4500, status: "Paid" },{ id: "#ORD-L3F7B2", date: "19 Jun", amount: 2800, status: "Failed" }] },
  { _id: "7", name: "Meera Iyer",      email: "meera.iyer@hotmail.com",phone: "+91 96321 09876", city: "Chennai",   joined: "2023-09-14", lastActive: "2025-06-20", status: "Active",   tier: "Gold",     orders: 15, spend: 38900, recentOrders: [{ id: "#ORD-M5A8C3", date: "20 Jun", amount: 3600, status: "Paid" }] },
  { _id: "8", name: "Vikram Singh",    email: "vikram.s@gmail.com",    phone: "+91 85432 10987", city: "Jaipur",    joined: "2024-09-03", lastActive: "2025-04-15", status: "Inactive", tier: "Silver",   orders: 8,  spend: 19600, recentOrders: [{ id: "#ORD-N7B2D6", date: "15 Apr", amount: 2100, status: "Pending" }] },
  { _id: "9", name: "Ishaan Chopra",   email: "ishaan.c@gmail.com",    phone: "+91 78901 23456", city: "Gurgaon",   joined: "2025-01-18", lastActive: "2025-06-30", status: "Active",   tier: "Bronze",   orders: 2,  spend: 3200,  recentOrders: [{ id: "#ORD-O1C9E4", date: "30 Jun", amount: 1600, status: "Paid" }] },
  { _id: "10", name: "Divya Menon",    email: "divya.m@gmail.com",     phone: "+91 90123 45678", city: "Trivandrum",joined: "2024-04-07", lastActive: "2025-06-22", status: "Active",   tier: "Silver",   orders: 11, spend: 27400, recentOrders: [{ id: "#ORD-P4D7A1", date: "22 Jun", amount: 2900, status: "Paid" },{ id: "#ORD-Q6E2C5", date: "08 Jun", amount: 1750, status: "Paid" }] },
];

// ─── Helpers ──────────────────────────────────────────────────────────────────
const AVATAR_COLORS = [
  { bg: "#E1F5EE", color: "#085041" },
  { bg: "#FAECE7", color: "#712B13" },
  { bg: "#E6F1FB", color: "#0C447C" },
  { bg: "#FAEEDA", color: "#633806" },
  { bg: "#EEEDFE", color: "#3C3489" },
  { bg: "#FBEAF0", color: "#72243E" },
];
const getAvatarColor = (name = "") => AVATAR_COLORS[name.charCodeAt(0) % AVATAR_COLORS.length];
const getInitials = (name = "") => name.split(" ").slice(0, 2).map(w => w[0]).join("").toUpperCase();
const fmtAmount = (n) => `₹${Number(n).toLocaleString("en-IN")}`;
const fmtDate = (d) => new Date(d).toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" });

// ─── Tier Config ─────────────────────────────────────────────────────────────
const TIER_CONFIG = {
  Bronze:   { bg: "#F5EDE4", color: "#7A4520", icon: "🥉" },
  Silver:   { bg: "#EEEDF2", color: "#4A4760", icon: "🥈" },
  Gold:     { bg: "#FDF3D8", color: "#7A5A08", icon: "🥇" },
  Platinum: { bg: "#E8F4F2", color: "#0A5246", icon: "💎" },
};

const STATUS_CONFIG = {
  Active:   { bg: "#F0FDF8", color: "#0a6057", dot: "#0f766e", border: "rgba(13,148,136,0.2)" },
  Inactive: { bg: "#F5F5F5", color: "#6B6B6B", dot: "#9CA3AF", border: "rgba(100,100,100,0.18)" },
};

// ─── Stat Card ────────────────────────────────────────────────────────────────
const StatCard = ({ icon, title, value, sub, accent }) => (
  <div className={`cust-stat ${accent}`}>
    <div style={{ width: 34, height: 34, borderRadius: 10, background: T.parchment, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 16, marginBottom: 12 }}>
      {icon}
    </div>
    <p style={{ fontSize: 10, color: T.faint, letterSpacing: "0.08em", textTransform: "uppercase", fontWeight: 600, marginBottom: 4 }}>{title}</p>
    <h2 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 28, fontWeight: 700, color: T.text, lineHeight: 1, marginBottom: 5 }}>{value}</h2>
    <p style={{ fontSize: 12, color: T.sub }}>{sub}</p>
  </div>
);

// ─── Customer Drawer ───────────────────────────────────────────────────────────
const CustomerDrawer = ({ customer, onClose }) => {
  const open = Boolean(customer);

  const avatarStyle = customer ? getAvatarColor(customer.name || "") : {};
  const tier        = customer ? (TIER_CONFIG[customer.tier]    || TIER_CONFIG.Bronze)    : {};
  const status      = customer ? (STATUS_CONFIG[customer.status] || STATUS_CONFIG.Inactive) : {};
  const { bg, color } = avatarStyle;

  const ORDER_STATUS = {
    Paid:    { bg: "#F0FDF8", color: "#0a6057", dot: "#0f766e" },
    Pending: { bg: "#FAEEDA", color: "#633806", dot: "#BA7517" },
    Failed:  { bg: "#FCEBEB", color: "#791F1F", dot: "#E24B4A" },
  };

  return (
    <>
      <div className={`cust-overlay ${open ? "open" : ""}`} onClick={onClose} />
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
                  <h2 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 22, fontWeight: 700, color: T.text, lineHeight: 1.1 }}>
                    {customer.name}
                  </h2>
                  <p style={{ fontSize: 12, color: T.sub, marginTop: 4 }}>{customer.email}</p>
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
              <p style={{ fontSize: 10, color: T.faint, letterSpacing: "0.08em", textTransform: "uppercase", fontWeight: 600, marginBottom: 12 }}>Contact & Info</p>
              {[
                ["📱", "Phone", customer.phone],
                ["📍", "City", customer.city],
                ["📅", "Joined", fmtDate(customer.joined)],
                ["🕐", "Last Active", fmtDate(customer.lastActive)],
              ].map(([icon, label, val]) => (
                <div key={label} style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 10 }}>
                  <span style={{ fontSize: 14, width: 20, textAlign: "center" }}>{icon}</span>
                  <span style={{ fontSize: 12, color: T.faint, width: 80, flexShrink: 0 }}>{label}</span>
                  <span style={{ fontSize: 13, fontWeight: 500, color: T.text }}>{val}</span>
                </div>
              ))}
            </div>

            {/* Spend Summary */}
            <div className="cust-drawer-section">
              <p style={{ fontSize: 10, color: T.faint, letterSpacing: "0.08em", textTransform: "uppercase", fontWeight: 600, marginBottom: 12 }}>Spend Summary</p>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
                {[
                  ["Total Spend", fmtAmount(customer.spend)],
                  ["Total Orders", customer.orders],
                  ["Avg Order", fmtAmount(Math.round(customer.spend / customer.orders))],
                  ["Tier", customer.tier],
                ].map(([label, val]) => (
                  <div key={label} style={{ background: T.parchment, borderRadius: 10, padding: "12px 14px" }}>
                    <p style={{ fontSize: 10, color: T.faint, letterSpacing: "0.06em", textTransform: "uppercase", fontWeight: 600, marginBottom: 4 }}>{label}</p>
                    <p style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 20, fontWeight: 700, color: T.text, lineHeight: 1 }}>{val}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Recent Orders */}
            <div className="cust-drawer-section">
              <p style={{ fontSize: 10, color: T.faint, letterSpacing: "0.08em", textTransform: "uppercase", fontWeight: 600, marginBottom: 12 }}>Recent Orders</p>
              {(customer.recentOrders || []).map((o) => {
                const os = ORDER_STATUS[o.status] || ORDER_STATUS.Pending;
                return (
                  <div key={o.id} className="cust-mini-order">
                    <div>
                      <p style={{ fontSize: 12, fontWeight: 600, color: T.text }}>{o.id}</p>
                      <p style={{ fontSize: 11, color: T.faint, marginTop: 2 }}>{o.date}</p>
                    </div>
                    <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                      <span style={{ fontSize: 10, fontWeight: 600, padding: "2px 8px", borderRadius: 20, background: os.bg, color: os.color, display: "inline-flex", alignItems: "center", gap: 4 }}>
                        <span style={{ width: 4, height: 4, borderRadius: "50%", background: os.dot }} />
                        {o.status}
                      </span>
                      <p style={{ fontFamily: "'Cormorant Garamond', serif", fontWeight: 700, fontSize: "1rem", color: T.text, whiteSpace: "nowrap" }}>
                        {fmtAmount(o.amount)}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Actions */}
            <div className="cust-drawer-section">
              <p style={{ fontSize: 10, color: T.faint, letterSpacing: "0.08em", textTransform: "uppercase", fontWeight: 600, marginBottom: 12 }}>Actions</p>
              <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                {[
                  { label: "✉️ Send Email",   bg: "#E6F1FB", color: "#0C447C" },
                  { label: "🚫 Deactivate",   bg: "#FCEBEB", color: "#791F1F" },
                  { label: "🔝 Upgrade Tier", bg: "#F0FDF8", color: "#0a6057" },
                ].map(({ label, bg: btnBg, color: btnColor }) => (
                  <button
                    key={label}
                    onClick={() => {}}
                    style={{
                      padding: "8px 16px",
                      borderRadius: 10,
                      border: "none",
                      background: btnBg,
                      color: btnColor,
                      fontFamily: "'DM Sans', sans-serif",
                      fontSize: 12,
                      fontWeight: 600,
                      cursor: "pointer",
                      transition: "opacity 0.15s",
                    }}
                    onMouseEnter={e => (e.target.style.opacity = 0.75)}
                    onMouseLeave={e => (e.target.style.opacity = 1)}
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
  const [filterStatus, setFilterStatus] = useState("All");
  const [filterTier, setFilterTier] = useState("All");
  const [selected, setSelected] = useState(null);
  const [page, setPage] = useState(1);
  const PER_PAGE = 7;


  const fetchCustomers=async ()=>{
    try {
        const token=localStorage.getItem("CommerceToken")
        const res=await fetch(`${import.meta.env.VITE_API_URL}/api/customers/getAllCustomers`,{
            headers: {
          Authorization: `Bearer ${token}`, // 🔥 important
        },
        })
        const result=await res.json() // json string me convert hokar network par send hota hai isliye ham yaha .json me dubara convert karte hai jisse bo stringified json se usable json object me convert ho jaye
        if(!res.ok)
        {
            console.log(result.message)
        }
        console.log("success",result)
        setcustomers(result.totalcustomers)

    } catch (error) {
        console.log(error)
    } finally{
        setloading(false)
    }
  }

  useEffect(() => {
    fetchCustomers()
  }, [])
  

  // Computed stats
  const totalSpend = customers.reduce((s, c) => s + c.totalSpent, 0);
  const activeCount = customers.filter(c => c.status === "Active").length;
  const newThisMonth = customers.filter(c => {
    const j = new Date(c.createdAt);
    const now = new Date();
    return j.getMonth() === now.getMonth() && j.getFullYear() === now.getFullYear(); // true hoga to include agar false hoga to exclude
  }).length;
  const avgOrderValue = Math.round(totalSpend / customers.reduce((s, c) => s + c.totalOrders, 0));

  // Filtered
 const filtered=customers.filter(c=>
 {
    const filteredCustomers=filterStatus==="All"|| c.status==filterStatus
    return filteredCustomers
 }
 )

  const totalPages = Math.ceil(filtered.length / PER_PAGE);
  const paginated = filtered.slice((page - 1) * PER_PAGE, page * PER_PAGE);

  const handleFilter = (type, val) => {
    setPage(1);
    if (type === "status") setFilterStatus(val);
    else setFilterTier(val);
  };

  return (
    <div>
      <div className="min-h-full bg-gradient-to-b from-teal-50/40 via-stone-50 to-stone-100 pt-4 pb-3">
        <Navbar />
      </div>

      <div className="cust-root mx-auto max-w-[1600px] px-3 sm:px-5" style={{ background: T.bg, minHeight: "100vh", paddingTop: 20, paddingBottom: 40 }}>

        {/* Stats */}
        <div className="cust-stats-grid">
          <StatCard accent="teal"  icon="👥" title="Total Customers" value={customers.length}      sub={`${activeCount} active`} />
          <StatCard accent="amber" icon="✅" title="Active"          value={activeCount}           sub="currently active" />
          <StatCard accent="blue"  icon="🆕" title="New This Month"  value={newThisMonth}     sub="joined recently" />
          <StatCard accent="rose"  icon="📊" title="Avg Order Value" value={fmtAmount(avgOrderValue)} sub="across all orders" />
        </div>

        {/* Table Panel */}
        <div className="cust-panel">
          {/* Panel Header */}
          <div className="cust-panel-header">
            <span style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 18, fontWeight: 700, color: T.text }}>
              All Customers
            </span>

            <div className="cust-search-wrap">
              {/* Search */}
              <div className="cust-search">
                <span style={{ fontSize: 14, color: T.faint }}>🔍</span>
                <input
                  placeholder="Search name, email, city…"
                  value={search}
                  onChange={e => { setSearch(e.target.value); setPage(1); }}
                />
                {search && (
                  <span style={{ cursor: "pointer", color: T.faint, fontSize: 13 }} onClick={() => setSearch("")}>✕</span>
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
                value={"Gold`"}
                onChange={e => handleFilter("tier", e.target.value)}
                style={{ padding: "7px 14px", borderRadius: 10, border: "1px solid rgba(60,40,20,0.1)", background: "#F5F3EF", fontFamily: "'DM Sans', sans-serif", fontSize: 12, color: T.sub, cursor: "pointer", outline: "none" }}
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
  {!loading && filtered.map((c) => {
    const { bg, color } = getAvatarColor(c.name || "");
    const tier   = TIER_CONFIG[c.tier]   || { bg: "#F5EDE4", color: "#7A4520", icon: "🥉" }; // ye object se value access kar rahe hai by giving key TIER_CONFIG["Gold"], gold as a key paas kardi TIER_CONFIG OBJECT ME, key kyoki dynamic hai to hame ye notation use karna padega dot notation ki jagah
    const status = STATUS_CONFIG[c.status] || STATUS_CONFIG.Inactive;
    return (
      <tr key={c._id} onClick={() => setSelected(c)}>
        <td>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <div className="cust-avatar" style={{ background: bg, color }}>{getInitials(c.name)}</div>
            <div>
              <p style={{ fontSize: 13, fontWeight: 600, color: T.text }}>{c.name}</p>
              <p style={{ fontSize: 11, color: T.faint, marginTop: 1 }}>{c.email}</p>
            </div>
          </div>
        </td>
        <td style={{ fontSize: 13, color: T.sub }}>{c.city}</td>
        <td>
          {c.tier
            ? <span className="cust-tier" style={{ background: tier.bg, color: tier.color }}>{tier.icon} {c.tier}</span>
            : <span style={{ fontSize: 12, color: T.faint }}>—</span>
          }
        </td>
        <td style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 18, fontWeight: 700, color: T.text }}>
          {c.totalOrders ?? "—"}
        </td>
        <td style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 18, fontWeight: 700, color: T.text }}>
          {c.totalSpent != null ? fmtAmount(c.totalSpent) : "—"}
        </td>
        <td style={{ fontSize: 12, color: T.sub }}>
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
  })}
</tbody>
            </table>
          </div>

          {/* Pagination */}
          <div className="cust-pagination">
            <span style={{ fontSize: 12, color: T.faint }}>
              Showing {Math.min((page - 1) * PER_PAGE + 1, filtered.length)}–{Math.min(page * PER_PAGE, filtered.length)} of {filtered.length} customers
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
      <CustomerDrawer customer={selected} onClose={() => setSelected(null)} />
    </div>
  );
};

export default CustomersPage;