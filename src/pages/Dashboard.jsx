import React from "react";
import { useState, useEffect } from "react";
import Navbar from "../components/Navbar";

// ─── Font injection ────────────────────────────────────────────────────────────
if (!document.getElementById("adm-fonts")) {
  const link = document.createElement("link");
  link.id = "adm-fonts";
  link.rel = "stylesheet";
  link.href =
    "https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@600;700&family=DM+Sans:wght@300;400;500;600&display=swap";
  document.head.appendChild(link);
}

// ─── Responsive Styles ────────────────────────────────────────────────────────
if (!document.getElementById("adm-styles")) {
  const el = document.createElement("style");
  el.id = "adm-styles";
  el.textContent = `
    * { box-sizing: border-box; }
    .adm-root { font-family: 'DM Sans', sans-serif; }

    .adm-stats-grid {
      display: grid;
      grid-template-columns: repeat(4, minmax(0, 1fr));
      gap: 14px;
      margin-bottom: 18px;
    }
    .adm-main-grid {
      display: grid;
      grid-template-columns: 2fr 1fr;
      gap: 16px;
      margin-bottom: 18px;
    }
    .adm-users-grid {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 10px;
    }

    @media (max-width: 900px) {
      .adm-stats-grid { grid-template-columns: repeat(2, 1fr); }
      .adm-main-grid  { grid-template-columns: 1fr; }
    }
    @media (max-width: 560px) {
      .adm-stats-grid { grid-template-columns: repeat(2, 1fr); gap: 10px; }
      .adm-users-grid { grid-template-columns: 1fr; }
      .adm-root       { padding: 14px !important; }
    }

    /* ── Stat Card ── */
    .adm-stat-card {
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
    /* hover on desktop, active on mobile — both work */
    .adm-stat-card:hover,
    .adm-stat-card:active {
      box-shadow: 0 10px 32px -8px rgba(28,20,16,0.14);
      transform: translateY(-2px);
    }
    .adm-stat-card::after {
      content: '';
      position: absolute;
      right: 0; top: 0; bottom: 0;
      width: 4px;
      border-radius: 0 16px 16px 0;
    }
    .adm-stat-card.teal::after   { background: #0f766e; }
    .adm-stat-card.amber::after  { background: #C0841A; }
    .adm-stat-card.blue::after   { background: #378ADD; }
    .adm-stat-card.red::after    { background: #DC2626; }

    /* ── Panel ── */
    .adm-panel {
      background: #fff;
      border-radius: 16px;
      border: 1px solid rgba(60,40,20,0.08);
      box-shadow: 0 4px 24px -6px rgba(28,20,16,0.06);
      overflow: hidden;
    }
    .adm-panel-header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 15px 20px;
      border-bottom: 1px solid rgba(60,40,20,0.06);
      background: #FAFAF9;
    }

    /* ── Order Row ── */
    .adm-order-row {
      display: flex;
      align-items: center;
      padding: 13px 20px;
      border-bottom: 1px solid rgba(60,40,20,0.05);
      gap: 10px;
      cursor: pointer;
      transition: background 0.14s;
      -webkit-tap-highlight-color: transparent;
    }
    .adm-order-row:last-child { border-bottom: none; }
    /* hover (desktop) + active (mobile touch) */
    .adm-order-row:hover,
    .adm-order-row:active { background: #F3EFE8; }

    /* ── Stock Row ── */
    .adm-stock-row {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 12px 20px;
      border-bottom: 1px solid rgba(60,40,20,0.05);
      gap: 10px;
      cursor: pointer;
      transition: background 0.14s;
      -webkit-tap-highlight-color: transparent;
    }
    .adm-stock-row:last-child { border-bottom: none; }
    .adm-stock-row:hover,
    .adm-stock-row:active { background: #F3EFE8; }

    /* ── User Card ── */
    .adm-user-card {
      padding: 14px;
      border-radius: 12px;
      background: #FAFAF9;
      border: 1px solid rgba(60,40,20,0.06);
      display: flex;
      justify-content: space-between;
      align-items: center;
      gap: 8px;
      cursor: pointer;
      transition: box-shadow 0.16s, background 0.16s;
      -webkit-tap-highlight-color: transparent;
    }
    .adm-user-card:hover,
    .adm-user-card:active {
      background: #F3EFE8;
      box-shadow: 0 4px 16px -6px rgba(28,20,16,0.12);
    }

    /* ── Avatar ── */
    .adm-avatar {
      width: 36px; height: 36px;
      border-radius: 50%;
      display: flex; align-items: center; justify-content: center;
      font-size: 13px; font-weight: 600;
      flex-shrink: 0;
      user-select: none;
    }
  `;
  document.head.appendChild(el);
}

// ─── Tokens ───────────────────────────────────────────────────────────────────
const T = {
  bg: "#F5F3EF",
  card: "#FFFFFF",
  border: "rgba(60,40,20,0.08)",
  text: "#1C1410",
  sub: "#7A6E63",
  faint: "#A09180",
  teal: "#0f766e",
  parchment: "#F3EFE8",
};

const AVATAR_COLORS = [
  { bg: "#E1F5EE", color: "#085041" },
  { bg: "#FAECE7", color: "#712B13" },
  { bg: "#E6F1FB", color: "#0C447C" },
  { bg: "#FAEEDA", color: "#633806" },
  { bg: "#EEEDFE", color: "#3C3489" },
  { bg: "#FBEAF0", color: "#72243E" },
];
const getAvatarColor = (name = "") => AVATAR_COLORS[name.charCodeAt(0) % AVATAR_COLORS.length];
const getInitials    = (name = "") => name.split(" ").slice(0, 2).map(w => w[0]).join("").toUpperCase();

// ─── Stat Card ────────────────────────────────────────────────────────────────
const StatCard = ({ title, value, change, accent, icon }) => (
  <div className={`adm-stat-card ${accent}`}>
    <div style={{ width: 34, height: 34, borderRadius: 10, background: T.parchment, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 16, marginBottom: 12 }}>
      {icon}
    </div>
    <p style={{ fontSize: 10, color: T.faint, letterSpacing: "0.08em", textTransform: "uppercase", fontWeight: 600, marginBottom: 4 }}>
      {title}
    </p>
    <h2 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 28, fontWeight: 700, color: T.text, lineHeight: 1, marginBottom: 5 }}>
      {value}
    </h2>
    <p style={{ fontSize: 12, color: T.sub }}>{change}</p>
  </div>
);

// ─── Order Row ────────────────────────────────────────────────────────────────
const OrderRow = ({ name, orderId, date, status, amount }) => {
  const STATUS_STYLE = {
    Paid:    { bg: "#F0FDF8", color: "#0a6057", dot: "#0f766e", border: "rgba(13,148,136,0.2)" },
    Pending: { bg: "#FAEEDA", color: "#633806", dot: "#BA7517", border: "rgba(186,117,23,0.22)" },
    Failed:  { bg: "#FCEBEB", color: "#791F1F", dot: "#E24B4A", border: "rgba(226,75,74,0.18)" },
  };
  const s = STATUS_STYLE[status] || STATUS_STYLE.Pending;
  const { bg, color } = getAvatarColor(name);
  return (
    <div className="adm-order-row">
      <div className="adm-avatar" style={{ background: bg, color }}>{getInitials(name)}</div>
      <div style={{ flex: 1, minWidth: 0 }}>
        <p style={{ fontSize: 13, fontWeight: 600, color: T.text, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{name}</p>
        <p style={{ fontSize: 11, color: T.faint, marginTop: 1 }}>{orderId} · {date}</p>
      </div>
      <span style={{ fontSize: 11, fontWeight: 600, padding: "3px 10px", borderRadius: 20, flexShrink: 0, background: s.bg, color: s.color, border: `1px solid ${s.border}`, display: "inline-flex", alignItems: "center", gap: 5 }}>
        <span style={{ width: 5, height: 5, borderRadius: "50%", background: s.dot }} />
        {status}
      </span>
      <p style={{ fontFamily: "'Cormorant Garamond', serif", fontWeight: 700, fontSize: "1.1rem", color: T.text, flexShrink: 0, paddingLeft: 4 }}>{amount}</p>
    </div>
  );
};

// ─── Stock Row ────────────────────────────────────────────────────────────────
const StockRow = ({ name, category, stock, maxStock = 20 }) => {
  const pct        = Math.max(5, Math.min(100, (stock / maxStock) * 100));
  const barColor   = stock <= 2 ? "#DC2626" : stock <= 5 ? "#EF9F27" : "#0f766e";
  const countColor = stock <= 2 ? "#DC2626" : stock <= 5 ? "#B7791F" : "#0f766e";
  return (
    <div className="adm-stock-row">
      <div>
        <p style={{ fontSize: 13, fontWeight: 600, color: T.text }}>{name}</p>
        <p style={{ fontSize: 11, color: T.faint, marginTop: 1 }}>{category}</p>
      </div>
      <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
        <div style={{ width: 52, height: 4, borderRadius: 2, background: T.parchment }}>
          <div style={{ width: `${pct}%`, height: "100%", borderRadius: 2, background: barColor }} />
        </div>
        <span style={{ fontSize: 12, fontWeight: 600, color: countColor, whiteSpace: "nowrap" }}>{stock} left</span>
      </div>
    </div>
  );
};

// ─── Main Dashboard ───────────────────────────────────────────────────────────
const AdminDashboard = () => {
  const [loading, setloading] = useState(false);

  const fetchdata= async()=>{
    try {
        const [res1,res2,res3]=await Promise.all([ // it wants only one argument thats why we need to pass array which will contain our different api calls and promise.all can iterate over all the api calls throgh array

        ])
    } catch (error) {
        
    }
  }

  useEffect(() => {
    fetchdata()
  }, []);

  const today = new Date().toLocaleDateString("en-IN", {
    weekday: "short", day: "2-digit", month: "short", year: "numeric",
  });

  return (
<div>

 <div className="min-h-full bg-gradient-to-b from-teal-50/40 via-stone-50 to-stone-100 pt-4 pb-3">
    <Navbar/> </div>

    <div className="adm-root mx-auto max-w-[1600px] px-3 sm:px-5" style={{ background: T.bg, minHeight: "100vh"}}>   
      {/* ─── Header ─── */}
      {/* <div style={{ background: T.card, borderRadius: 20, padding: "22px 28px", marginBottom: 18, border: `1px solid ${T.border}`, boxShadow: "0 4px 24px -6px rgba(28,20,16,0.08)" }}>
        <p style={{ fontSize: 10, color: T.teal, letterSpacing: "0.1em", fontWeight: 600, textTransform: "uppercase", marginBottom: 4 }}>
          Ecomora Admin
        </p>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 10 }}>
          <h1 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 34, fontWeight: 700, color: T.text, lineHeight: 1 }}>
            Dashboard
          </h1>
          <div style={{ display: "flex", alignItems: "center", gap: 12, flexWrap: "wrap" }}>
            <span style={{ fontSize: 13, color: T.sub }}>{today}</span>
            <span style={{ background: "#F0FDF8", padding: "6px 14px", borderRadius: 20, fontSize: 12, fontWeight: 600, color: "#0a6057", border: "1px solid rgba(13,148,136,0.2)", display: "inline-flex", alignItems: "center", gap: 6 }}>
              <span style={{ width: 6, height: 6, borderRadius: "50%", background: "#0f766e" }} />
              Admin
            </span>
          </div>
        </div>
      </div> */}

      {/* ─── Stats ─── */}
      <div className="adm-stats-grid">
        <StatCard accent="teal"  icon="👥" title="Total Users"  value="1,284" change="+24 this week"   />
        <StatCard accent="amber" icon="🛍️" title="Total Orders" value="3,741" change="+112 this week"  />
        <StatCard accent="blue"  icon="₹"  title="Revenue"      value="₹8.4L" change="+₹42k this week" />
        <StatCard accent="red"   icon="⚠"  title="Low Stock"    value="7"     change="needs restock"   />
      </div>

      {/* ─── Main Grid ─── */}
      <div className="adm-main-grid">
        <div className="adm-panel">
          <div className="adm-panel-header">
            <span style={{ fontSize: 14, fontWeight: 600, color: T.text }}>Recent Orders</span>
            <span style={{ fontSize: 11, fontWeight: 600, padding: "3px 10px", borderRadius: 20, background: "#F0FDF8", color: "#0a6057", border: "1px solid rgba(13,148,136,0.2)" }}>Live</span>
          </div>
          <OrderRow name="Rahul Sharma" orderId="#ORD-2025-00391" date="22 Apr" status="Paid"    amount="₹6,299"  />
          <OrderRow name="Priya Verma"  orderId="#ORD-2025-00390" date="22 Apr" status="Pending" amount="₹2,817"  />
          <OrderRow name="Arjun Kumar"  orderId="#ORD-2025-00389" date="21 Apr" status="Paid"    amount="₹12,450" />
          <OrderRow name="Neha Mishra"  orderId="#ORD-2025-00388" date="21 Apr" status="Failed"  amount="₹4,299"  />
        </div>

        <div className="adm-panel">
          <div className="adm-panel-header">
            <span style={{ fontSize: 14, fontWeight: 600, color: T.text }}>Low Stock</span>
            <span style={{ fontSize: 11, fontWeight: 600, padding: "3px 10px", borderRadius: 20, background: "#FCEBEB", color: "#A32D2D", border: "1px solid rgba(226,75,74,0.18)" }}>7 items</span>
          </div>
          <StockRow name="Smart Watch Series X"  category="Electronics" stock={1} />
          <StockRow name="Minimalist Writer Set" category="Accessories"  stock={2} />
          <StockRow name="Urban Runner Pro"       category="Footwear"    stock={4} />
          <StockRow name="Amber Oud Parfum"       category="Beauty"      stock={5} />
          <StockRow name="Canvas Tote Essential"  category="Bags"        stock={6} />
        </div>
      </div>

      {/* ─── Users Section ─── */}
      <div className="adm-panel">
        <div className="adm-panel-header">
          <span style={{ fontSize: 14, fontWeight: 600, color: T.text }}>Recent Users</span>
          <span style={{ fontSize: 11, fontWeight: 600, padding: "3px 10px", borderRadius: 20, background: "#E6F1FB", color: "#0C447C", border: "1px solid rgba(55,138,221,0.2)" }}>1,284 total</span>
        </div>
        <div style={{ padding: 16 }}>
          <div className="adm-users-grid">
            {[
              { name: "Rahul Sharma",  email: "rahul.sharma@gmail.com", orders: 8,  amount: "₹42,180" },
              { name: "Neha Mishra",   email: "nehamis@gmail.com",       orders: 5,  amount: "₹18,940" },
              { name: "Priya Verma",   email: "priya.v@outlook.com",     orders: 3,  amount: "₹9,251"  },
              { name: "Sushant Yadav", email: "sushant.y@gmail.com",     orders: 2,  amount: "₹12,244" },
              { name: "Arjun Kumar",   email: "arjunkumar99@yahoo.com",  orders: 12, amount: "₹78,320" },
              { name: "Deepika Gupta", email: "deepika.g@hotmail.com",   orders: 7,  amount: "₹31,600" },
            ].map((user) => {
              const { bg, color } = getAvatarColor(user.name);
              return (
                <div key={user.name} className="adm-user-card">
                  <div style={{ display: "flex", alignItems: "center", gap: 10, minWidth: 0 }}>
                    <div className="adm-avatar" style={{ background: bg, color }}>{getInitials(user.name)}</div>
                    <div style={{ minWidth: 0 }}>
                      <p style={{ fontSize: 13, fontWeight: 600, color: T.text }}>{user.name}</p>
                      <p style={{ fontSize: 11, color: T.faint, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{user.email}</p>
                    </div>
                  </div>
                  <div style={{ textAlign: "right", flexShrink: 0 }}>
                    <p style={{ fontSize: 12, fontWeight: 600, color: "#185FA5" }}>{user.orders} orders</p>
                    <p style={{ fontFamily: "'Cormorant Garamond',serif", fontWeight: 700, fontSize: "1rem", color: T.text }}>{user.amount}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

    </div>
    </div>
  );
};

export default AdminDashboard;