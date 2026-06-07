import React, { useState, useEffect } from "react";
import Navbar from "../components/Navbar";

// ─── Font injection ────────────────────────────────────────────────────────────
if (!document.getElementById("adm-fonts")) {
  const link = document.createElement("link");
  link.id = "adm-fonts";
  link.rel = "stylesheet";
  link.href =
    "https://fonts.googleapis.com/css2?family=Outfit:wght@400;500;600;700;800&family=Lora:wght@600;700&display=swap";
  document.head.appendChild(link);
}

if (!document.getElementById("adm-styles")) {
  const el = document.createElement("style");
  el.id = "adm-styles";
  el.textContent = `
    * { box-sizing: border-box; }
    .adm-root { font-family: 'Outfit', sans-serif; }

    /* ── Grids ── */
    .adm-stats-grid {
      display: grid;
      grid-template-columns: repeat(4, minmax(0, 1fr));
      gap: 14px;
      margin-bottom: 16px;
    }
    .adm-main-grid {
      display: grid;
      grid-template-columns: 2fr 1fr;
      gap: 14px;
      margin-bottom: 16px;
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
      .adm-root       { padding: 12px !important; }
    }

    /* ── Stat card ── */
    .adm-stat-card {
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
    .adm-stat-card:hover { box-shadow: 0 12px 32px -10px rgba(15,23,42,0.12); transform: translateY(-3px); }
    /* Accent bar */
    .adm-stat-card::after {
      content: '';
      position: absolute;
      left: 0; top: 0; bottom: 0;
      width: 3px;
      border-radius: 18px 0 0 18px;
    }
    .adm-stat-card.teal::after  { background: linear-gradient(180deg,#14b8a6,#0f766e); }
    .adm-stat-card.amber::after { background: linear-gradient(180deg,#fbbf24,#d97706); }
    .adm-stat-card.blue::after  { background: linear-gradient(180deg,#60a5fa,#2563eb); }
    .adm-stat-card.red::after   { background: linear-gradient(180deg,#f87171,#dc2626); }

    /* ── Panel ── */
    .adm-panel {
      background: #fff;
      border-radius: 18px;
      border: 1px solid rgba(226,232,240,0.9);
      box-shadow: 0 2px 12px -4px rgba(15,23,42,0.05);
      overflow: hidden;
    }
    .adm-panel-header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 14px 20px;
      border-bottom: 1px solid rgba(226,232,240,0.8);
      background: #fafafa;
    }

    /* ── Order row ── */
    .adm-order-row {
      display: flex;
      align-items: center;
      padding: 12px 20px;
      border-bottom: 1px solid rgba(226,232,240,0.6);
      gap: 10px;
      cursor: pointer;
      transition: background 0.14s;
      -webkit-tap-highlight-color: transparent;
    }
    .adm-order-row:last-child { border-bottom: none; }
    .adm-order-row:hover { background: rgba(240,253,250,0.7); }
    .adm-order-row:active { background: #f0fdfa; }

    /* ── Stock row ── */
    .adm-stock-row {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 11px 20px;
      border-bottom: 1px solid rgba(226,232,240,0.6);
      gap: 10px;
      cursor: pointer;
      transition: background 0.14s;
      -webkit-tap-highlight-color: transparent;
    }
    .adm-stock-row:last-child { border-bottom: none; }
    .adm-stock-row:hover  { background: rgba(240,253,250,0.7); }
    .adm-stock-row:active { background: #f0fdfa; }

    /* ── User card ── */
    .adm-user-card {
      padding: 13px 14px;
      border-radius: 13px;
      background: #fafafa;
      border: 1px solid rgba(226,232,240,0.9);
      display: flex;
      justify-content: space-between;
      align-items: center;
      gap: 8px;
      cursor: pointer;
      transition: box-shadow 0.2s, border-color 0.2s, background 0.15s,
                  transform 0.22s cubic-bezier(0.34,1.56,0.64,1);
      -webkit-tap-highlight-color: transparent;
    }
    .adm-user-card:hover {
      background: #fff;
      border-color: rgba(13,148,136,0.25);
      box-shadow: 0 6px 20px -8px rgba(13,148,136,0.2);
      transform: translateY(-1px);
    }

    /* ── Avatar ── */
    .adm-avatar {
      width: 36px; height: 36px;
      border-radius: 50%;
      display: flex; align-items: center; justify-content: center;
      font-family: 'Outfit', sans-serif;
      font-size: 12px; font-weight: 700;
      flex-shrink: 0;
      user-select: none;
    }
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
  border: "rgba(226,232,240,0.9)",
};

const AVATAR_COLORS = [
  { bg: "#dcfce7", color: "#14532d" },
  { bg: "#fee2e2", color: "#7f1d1d" },
  { bg: "#dbeafe", color: "#1e3a5f" },
  { bg: "#fef9c3", color: "#713f12" },
  { bg: "#ede9fe", color: "#3b0764" },
  { bg: "#fce7f3", color: "#831843" },
];
const getAvatarColor = (name = "") => AVATAR_COLORS[name.charCodeAt(0) % AVATAR_COLORS.length];
const getInitials    = (name = "") => name.split(" ").slice(0, 2).map(w => w[0]).join("").toUpperCase();

// ─── Stat Card ────────────────────────────────────────────────────────────────
const STAT_ICON_BG = { teal: "#f0fdfa", amber: "#fffbeb", blue: "#eff6ff", red: "#fff1f2" };

const StatCard = ({ title, value, change, accent, icon }) => (
  <div className={`adm-stat-card ${accent}`}>
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
    <p style={{ fontFamily: "'Outfit', sans-serif", fontSize: 11.5, color: T.sub }}>{change}</p>
  </div>
);

// ─── Order Row ────────────────────────────────────────────────────────────────
const STATUS_STYLE = {
  Paid:    { bg: "#f0fdfa", color: "#0f766e", dot: "#0d9488", border: "rgba(13,148,136,0.2)" },
  Pending: { bg: "#fffbeb", color: "#92400e", dot: "#d97706", border: "rgba(217,119,6,0.2)" },
  Failed:  { bg: "#fff1f2", color: "#be123c", dot: "#ef4444", border: "rgba(239,68,68,0.18)" },
};

const OrderRow = ({ name, orderId, date, status, amount }) => {
  const s = STATUS_STYLE[status] || STATUS_STYLE.Pending;
  const { bg, color } = getAvatarColor(name);

  return (
    <div className="adm-order-row">
      <div className="adm-avatar" style={{ background: bg, color }}>{getInitials(name)}</div>

      <div style={{ flex: 1, minWidth: 0 }}>
        <p style={{
          fontFamily: "'Outfit', sans-serif",
          fontSize: 13, fontWeight: 600, color: T.text,
          overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", margin: 0,
        }}>
          {name}
        </p>
        <p style={{ fontFamily: "'Outfit', sans-serif", fontSize: 11, color: T.faint, margin: "2px 0 0" }}>
          {orderId} · {date}
        </p>
      </div>

      <div style={{
        display: "flex", alignItems: "center", gap: 10,
        flexShrink: 0, minWidth: 160, justifyContent: "flex-end",
      }}>
        <span style={{
          fontFamily: "'Outfit', sans-serif",
          fontSize: 11, fontWeight: 600,
          padding: "3px 10px", borderRadius: 20,
          background: s.bg, color: s.color, border: `1px solid ${s.border}`,
          display: "inline-flex", alignItems: "center", gap: 5,
          whiteSpace: "nowrap", minWidth: 68, justifyContent: "center",
        }}>
          <span style={{ width: 5, height: 5, borderRadius: "50%", background: s.dot, flexShrink: 0 }} />
          {status}
        </span>

        <p style={{
          fontFamily: "'Lora', serif",
          fontWeight: 700, fontSize: "1.05rem", color: T.text,
          minWidth: 70, textAlign: "right", whiteSpace: "nowrap", margin: 0,
        }}>
          {amount}
        </p>
      </div>
    </div>
  );
};

// ─── Stock Row ────────────────────────────────────────────────────────────────
const StockRow = ({ name, category, stock, maxStock = 20 }) => {
  const pct       = Math.max(5, Math.min(100, (stock / maxStock) * 100));
  const barColor  = stock <= 2 ? "#ef4444" : stock <= 5 ? "#f59e0b" : "#0d9488";
  const countColor = stock <= 2 ? "#dc2626" : stock <= 5 ? "#b45309" : "#0d9488";

  return (
    <div className="adm-stock-row">
      <div style={{ minWidth: 0 }}>
        <p style={{
          fontFamily: "'Outfit', sans-serif",
          fontSize: 13, fontWeight: 600, color: T.text,
          margin: 0, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis",
        }}>
          {name}
        </p>
        <p style={{ fontFamily: "'Outfit', sans-serif", fontSize: 11, color: T.faint, margin: "2px 0 0" }}>
          {category}
        </p>
      </div>

      <div style={{ display: "flex", alignItems: "center", gap: 9, flexShrink: 0 }}>
        {/* Progress bar */}
        <div style={{ width: 56, height: 5, borderRadius: 3, background: "rgba(226,232,240,0.9)", overflow: "hidden" }}>
          <div style={{
            width: `${pct}%`, height: "100%", borderRadius: 3,
            background: barColor,
            transition: "width 0.4s ease",
          }} />
        </div>
        <span style={{
          fontFamily: "'Outfit', sans-serif",
          fontSize: 12, fontWeight: 700, color: countColor, whiteSpace: "nowrap",
        }}>
          {stock} left
        </span>
      </div>
    </div>
  );
};

// ─── Main Dashboard ───────────────────────────────────────────────────────────
const AdminDashboard = () => {
  const [loading, setloading] = useState(false);
  const [data, setdata] = useState({});

  const fetchdata = async () => {
    try {
      const token = localStorage.getItem("CommerceToken");
      if (!token) { console.log("No token found"); return; }
      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/dashboard/fetchData`, {
        method: "GET",
        headers: { Authorization: `Bearer ${token}` },
      });
      const result = await res.json();
      if (!res.ok) { console.log("failed to fetch", result); return; }
      setdata(result);
    } catch (error) {
      console.log(error);
    } finally {
      setloading(true);
    }
  };

  useEffect(() => { fetchdata(); }, []);

  const today = new Date().toLocaleDateString("en-IN", {
    weekday: "short", day: "2-digit", month: "short", year: "numeric",
  });

  const formatDate   = (d) => new Date(d).toLocaleDateString("en-IN", { day: "2-digit", month: "short", timeZone: "Asia/Kolkata" });
  const formatStatus = (s) => s.charAt(0).toUpperCase() + s.slice(1);
  const formatAmount = (n) => `₹${Number(n).toLocaleString("en-IN")}`;
  const formatOrderId = (id = "") => id ? `#ORD-${id.slice(-6).toUpperCase()}` : "#ORD-XXXX";

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
        className="adm-root mx-auto"
        style={{ maxWidth: 1560, padding: "20px 20px 40px" }}
      >
        {/* ── Page heading ── */}
        <div style={{ marginBottom: 20, display: "flex", alignItems: "flex-end", justifyContent: "space-between", flexWrap: "wrap", gap: 10 }}>
          <div>
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
              Dashboard
            </h1>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <span style={{
              fontFamily: "'Outfit', sans-serif",
              fontSize: 12.5, color: T.sub,
            }}>
              {today}
            </span>
            <span style={{
              display: "inline-flex", alignItems: "center", gap: 5,
              padding: "5px 12px", borderRadius: 20,
              background: "#f0fdfa", color: "#0f766e",
              border: "1px solid rgba(13,148,136,0.2)",
              fontFamily: "'Outfit', sans-serif",
              fontSize: 11.5, fontWeight: 600,
            }}>
              <span style={{ width: 6, height: 6, borderRadius: "50%", background: "#0d9488" }} />
              Admin
            </span>
          </div>
        </div>

        {/* ── Stats ── */}
        <div className="adm-stats-grid">
          <StatCard accent="teal"  icon="👥" title="Total Users"   value={data.totalUsers}   change={`+${data.usersthisweek} this week`} />
          <StatCard accent="amber" icon="🛍️" title="Total Orders"  value={data.totalOrders}  change={`+${data.ordersthisweek} this week`} />
          <StatCard accent="blue"  icon="₹"  title="Revenue"       value={data.totalrevenue} change={`+₹${data.weeklyrevenue} this week`} />
          <StatCard accent="red"   icon="⚠"  title="Low Stock"     value={data.lowStockCount} change="needs restock" />
        </div>

        {/* ── Main grid ── */}
        <div className="adm-main-grid">
          {/* Recent Orders */}
          <div className="adm-panel">
            <div className="adm-panel-header">
              <span style={{ fontFamily: "'Outfit', sans-serif", fontSize: 13.5, fontWeight: 700, color: T.text }}>
                Recent Orders
              </span>
              <span style={{
                fontFamily: "'Outfit', sans-serif",
                fontSize: 11, fontWeight: 600,
                padding: "3px 10px", borderRadius: 20,
                background: "#f0fdfa", color: "#0f766e",
                border: "1px solid rgba(13,148,136,0.2)",
                display: "inline-flex", alignItems: "center", gap: 5,
              }}>
                <span style={{ width: 5, height: 5, borderRadius: "50%", background: "#0d9488", animation: "none" }} />
                Live
              </span>
            </div>
            {loading && data.recentOrders?.map((i) => (
              <OrderRow
                key={i._id}
                name={i.user.name}
                orderId={formatOrderId(i.orderId)}
                date={formatDate(i.paidAt)}
                status={formatStatus(i.status)}
                amount={formatAmount(i.amount)}
              />
            ))}
          </div>

          {/* Low Stock */}
          <div className="adm-panel">
            <div className="adm-panel-header">
              <span style={{ fontFamily: "'Outfit', sans-serif", fontSize: 13.5, fontWeight: 700, color: T.text }}>
                Low Stock
              </span>
              <span style={{
                fontFamily: "'Outfit', sans-serif",
                fontSize: 11, fontWeight: 600,
                padding: "3px 10px", borderRadius: 20,
                background: "#fff1f2", color: "#be123c",
                border: "1px solid rgba(239,68,68,0.18)",
              }}>
                {data.lowStockCount}
              </span>
            </div>
            {loading && data.lowStock?.map((i) => (
              <StockRow key={i._id} name={i.name} category={i.category} stock={i.stock} />
            ))}
          </div>
        </div>

        {/* ── Recent Users ── */}
        <div className="adm-panel">
          <div className="adm-panel-header">
            <span style={{ fontFamily: "'Outfit', sans-serif", fontSize: 13.5, fontWeight: 700, color: T.text }}>
              Recent Users
            </span>
            <span style={{
              fontFamily: "'Outfit', sans-serif",
              fontSize: 11, fontWeight: 600,
              padding: "3px 10px", borderRadius: 20,
              background: "#eff6ff", color: "#1d4ed8",
              border: "1px solid rgba(59,130,246,0.2)",
            }}>
              {data.totalUsers}
            </span>
          </div>
          <div style={{ padding: 14 }}>
            <div className="adm-users-grid">
              {loading && data.recent?.map((i) => {
                const { bg, color } = getAvatarColor(i.user.name);
                return (
                  <div key={i.user._id} className="adm-user-card">
                    <div style={{ display: "flex", alignItems: "center", gap: 10, minWidth: 0 }}>
                      <div className="adm-avatar" style={{ background: bg, color }}>
                        {getInitials(i.user.name)}
                      </div>
                      <div style={{ minWidth: 0 }}>
                        <p style={{
                          fontFamily: "'Outfit', sans-serif",
                          fontSize: 13, fontWeight: 600, color: T.text, margin: 0,
                        }}>
                          {i.user.name}
                        </p>
                        <p style={{
                          fontFamily: "'Outfit', sans-serif",
                          fontSize: 11, color: T.faint, margin: "1px 0 0",
                          overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap",
                        }}>
                          {i.user.email}
                        </p>
                      </div>
                    </div>
                    <div style={{ textAlign: "right", flexShrink: 0 }}>
                      <p style={{
                        fontFamily: "'Outfit', sans-serif",
                        fontSize: 12, fontWeight: 600, color: "#2563eb", margin: 0,
                      }}>
                        {i.count} orders
                      </p>
                      <p style={{
                        fontFamily: "'Lora', serif",
                        fontWeight: 700, fontSize: "0.975rem", color: T.text, margin: "2px 0 0",
                      }}>
                        {formatAmount(i.amount)}
                      </p>
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