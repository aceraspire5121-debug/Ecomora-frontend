import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Snackbar, Alert } from "@mui/material";
import Navbar from "../components/Navbar";

// ─── Font injection ────────────────────────────────────────────────────────────
if (!document.getElementById("orp-fonts")) {
  const link = document.createElement("link");
  link.id = "orp-fonts";
  link.rel = "stylesheet";
  link.href =
    "https://fonts.googleapis.com/css2?family=Outfit:wght@400;500;600;700;800&family=Lora:wght@600;700&display=swap";
  document.head.appendChild(link);
}

if (!document.getElementById("orp-styles")) {
  const el = document.createElement("style");
  el.id = "orp-styles";
  el.textContent = `
    /* ── Reset / base ── */
    *, *::before, *::after { box-sizing: border-box; }

    /* ── Outer wrapper ── */
    .orp-root {
      width: min(1140px, 94%);
      margin: 0 auto;
    }
    @media (max-width: 480px) {
      .orp-root { width: 100%; padding: 0 10px; }
    }

    /* ── Shell card ── */
    .orp-shell {
      margin-top: 20px;
      background: #fff;
      border-radius: 22px;
      border: 1px solid rgba(226,232,240,0.9);
      box-shadow: 0 4px 32px -8px rgba(15,23,42,0.08);
      overflow: hidden;
    }

    /* ── Header band ── */
    .orp-hband {
      background: #fafafa;
      border-bottom: 1px solid rgba(226,232,240,0.9);
      padding: 28px 32px 24px;
    }
    @media (max-width: 600px) {
      .orp-hband { padding: 20px 16px 18px; }
    }

    /* ── Title row ── */
    .orp-title-row {
      display: flex;
      align-items: flex-start;
      justify-content: space-between;
      gap: 12px;
      flex-wrap: wrap;
    }

    /* ── Back button ── */
    .orp-back {
      display: inline-flex;
      align-items: center;
      gap: 7px;
      padding: 0 16px;
      height: 36px;
      border-radius: 10px;
      border: 1px solid rgba(203,213,225,0.9);
      background: transparent;
      color: #64748b;
      font-family: 'Outfit', sans-serif;
      font-size: 12.5px;
      font-weight: 600;
      cursor: pointer;
      flex-shrink: 0;
      transition: all 0.18s;
      -webkit-tap-highlight-color: transparent;
    }
    .orp-back:hover { background: #0f172a; color: #fff; border-color: #0f172a; }

    /* ── Stats grid ── */
    .orp-stats-grid {
      display: grid;
      grid-template-columns: repeat(4, 1fr);
      gap: 12px;
      margin-top: 20px;
    }
    @media (max-width: 700px) {
      .orp-stats-grid { grid-template-columns: 1fr 1fr; gap: 10px; }
    }
    @media (max-width: 380px) {
      .orp-stats-grid { grid-template-columns: 1fr 1fr; gap: 8px; }
    }

    .orp-stat-tile {
      background: rgba(248,250,252,0.8);
      border: 1px solid rgba(226,232,240,0.9);
      border-radius: 13px;
      padding: 12px 16px;
    }
    @media (max-width: 480px) {
      .orp-stat-tile { padding: 10px 12px; border-radius: 10px; }
    }

    /* ── Body ── */
    .orp-body {
      padding: 20px 32px 28px;
    }
    @media (max-width: 600px) {
      .orp-body { padding: 16px 14px 24px; }
    }

    /* ── Filter chips ── */
    .orp-filters {
      display: flex;
      gap: 8px;
      margin-bottom: 18px;
      overflow-x: auto;
      scrollbar-width: none;
      -webkit-overflow-scrolling: touch;
      padding-bottom: 4px;
    }
    .orp-filters::-webkit-scrollbar { display: none; }

    .orp-chip {
      padding: 6px 18px;
      border-radius: 20px;
      font-size: 12px;
      font-weight: 600;
      cursor: pointer;
      flex-shrink: 0;
      min-height: 34px;
      font-family: 'Outfit', sans-serif;
      text-transform: capitalize;
      transition: all 0.15s;
      -webkit-tap-highlight-color: transparent;
    }
    .orp-chip:hover { background: rgba(13,148,136,0.07) !important; color: #0d9488 !important; border-color: rgba(13,148,136,0.22) !important; }

    /* ── Order card ── */
    .orp-card {
      background: #fff;
      border: 1px solid rgba(226,232,240,0.9);
      border-radius: 16px;
      margin-bottom: 10px;
      overflow: hidden;
      transition: box-shadow 0.25s, border-color 0.25s, transform 0.25s cubic-bezier(0.34,1.56,0.64,1);
    }
    .orp-card:hover {
      box-shadow: 0 12px 36px -14px rgba(13,148,136,0.22);
      border-color: rgba(13,148,136,0.25);
      transform: translateY(-2px);
    }

    /* ── Card header ── */
    .orp-head {
      padding: 12px 16px;
      display: flex;
      align-items: center;
      gap: 8px;
      cursor: pointer;
      background: #fafafa;
      user-select: none;
      -webkit-tap-highlight-color: transparent;
      transition: background 0.15s;
      min-height: 58px;
    }
    .orp-head:active { background: #f0fdfa; }

    .orp-order-id {
      font-family: 'Outfit', sans-serif;
      font-size: 13px;
      font-weight: 700;
      color: #0f172a;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
      margin: 0;
    }
    .orp-order-meta {
      font-family: 'Outfit', sans-serif;
      font-size: 11.5px;
      color: #94a3b8;
      margin: 2px 0 0;
    }
    .orp-amount {
      font-family: 'Lora', serif;
      font-weight: 700;
      font-size: 1.1rem;
      color: #0f172a;
      flex-shrink: 0;
      padding-left: 6px;
      white-space: nowrap;
    }
    @media (max-width: 400px) {
      .orp-amount { font-size: 0.95rem; padding-left: 4px; }
      .orp-order-id { font-size: 12px; }
    }

    /* ── Card footer ── */
    .orp-foot {
      padding: 10px 16px;
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 10px;
      background: #fafafa;
      border-top: 1px solid rgba(226,232,240,0.9);
      flex-wrap: nowrap;
    }
    @media (max-width: 480px) {
      .orp-foot { flex-wrap: wrap; gap: 8px; }
      .orp-foot > div { flex: 1 1 100%; }
      .orp-foot .orp-reveal { width: 100%; justify-content: center; }
    }

    /* ── Reveal button ── */
    .orp-reveal {
      flex-shrink: 0;
      height: 34px;
      padding: 0 14px;
      border-radius: 9px;
      border: 1px solid rgba(203,213,225,0.9);
      background: transparent;
      color: #64748b;
      font-family: 'Outfit', sans-serif;
      font-size: 12px;
      font-weight: 600;
      cursor: pointer;
      white-space: nowrap;
      transition: all 0.18s;
      -webkit-tap-highlight-color: transparent;
      /* visible on touch, hover-only on pointer devices */
      opacity: 1;
    }
    @media (hover: hover) {
      .orp-reveal {
        opacity: 0;
        transform: translateX(8px);
        pointer-events: none;
      }
      .orp-card:hover .orp-reveal {
        opacity: 1;
        transform: translateX(0);
        pointer-events: auto;
      }
    }
    .orp-reveal:hover { background: rgba(13,148,136,0.07); color: #0d9488; border-color: rgba(13,148,136,0.22); }

    /* ── Pagination ── */
    .orp-pagination {
      display: flex;
      justify-content: center;
      align-items: center;
      gap: 10px;
      margin-top: 32px;
    }
    .orp-page-btn {
      font-family: 'Outfit', sans-serif;
      font-size: 0.8rem;
      font-weight: 600;
      padding: 9px 20px;
      border-radius: 12px;
      border: 1px solid rgba(226,232,240,0.9);
      background: #ffffff;
      color: #475569;
      cursor: pointer;
      transition: all 0.18s ease;
      letter-spacing: 0.01em;
      box-shadow: 0 1px 4px rgba(15,23,42,0.05);
    }
    .orp-page-btn:hover:not(:disabled) {
      border-color: rgba(13,148,136,0.3);
      color: #0d9488;
      background: #f0fdfa;
      box-shadow: 0 4px 12px -4px rgba(13,148,136,0.18);
    }
    .orp-page-btn:disabled { opacity: 0.38; cursor: not-allowed; }
    .orp-page-indicator {
      font-family: 'Outfit', sans-serif;
      font-size: 0.8rem;
      font-weight: 600;
      padding: 9px 18px;
      border-radius: 12px;
      background: rgba(13,148,136,0.07);
      border: 1px solid rgba(13,148,136,0.18);
      color: #0f766e;
      min-width: 90px;
      text-align: center;
      letter-spacing: 0.01em;
    }
    @media (max-width: 400px) {
      .orp-page-btn { padding: 8px 14px; font-size: 0.75rem; }
      .orp-page-indicator { min-width: 72px; padding: 8px 10px; font-size: 0.75rem; }
    }
  `;
  document.head.appendChild(el);
}

// ─── Tokens ────────────────────────────────────────────────────────────────────
const T = {
  ink: "#0f172a", inkLight: "#64748b", inkFaint: "#94a3b8",
  teal: "#0d9488", tealLight: "rgba(13,148,136,0.07)", tealBorder: "rgba(13,148,136,0.22)",
  border: "rgba(226,232,240,0.9)", borderMid: "rgba(203,213,225,0.9)",
};

const STATUS = {
  paid:    { dot: "#0d9488", bg: "#f0fdfa",  color: "#0f766e", border: "rgba(13,148,136,0.2)",  label: "Paid" },
  pending: { dot: "#d97706", bg: "#fffbeb",  color: "#92400e", border: "rgba(217,119,6,0.2)",   label: "Pending" },
  failed:  { dot: "#ef4444", bg: "#fff1f2",  color: "#be123c", border: "rgba(239,68,68,0.18)",  label: "Failed" },
};

const fmtDate = (d) =>
  new Date(d).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" });
const fmtAmt = (n) => `₹${Number(n).toLocaleString("en-IN")}`;

// ─── Status Badge ──────────────────────────────────────────────────────────────
const StatusBadge = ({ status }) => {
  const s = STATUS[status] || STATUS.pending;
  return (
    <span style={{
      display: "inline-flex", alignItems: "center", gap: 5, flexShrink: 0,
      padding: "3px 10px", borderRadius: 20, fontSize: 11, fontWeight: 600,
      background: s.bg, color: s.color, border: `1px solid ${s.border}`,
      fontFamily: "'Outfit', sans-serif", whiteSpace: "nowrap",
    }}>
      <span style={{ width: 5, height: 5, borderRadius: "50%", background: s.dot, flexShrink: 0 }} />
      {s.label}
    </span>
  );
};

// ─── Order Card ────────────────────────────────────────────────────────────────
const OrderCard = ({ order }) => {
  const [open, setOpen] = useState(false);
  const [snackOpen, setSnackOpen] = useState(false);
  const [severity, setSeverity] = useState("");
  const [msg, setMsg] = useState("");
  const navigate = useNavigate();

  const isPaid    = order.status === "paid";
  const isPending = order.status === "pending";

  const showSnackbar = (message, type = "success") => {
    setMsg(message); setSeverity(type); setSnackOpen(true);
  };

  const displayId = order.orderId?.startsWith("order_")
    ? `Order #${order.orderId.slice(-6).toUpperCase()}`
    : `#${order.orderId}`;

  const footerLeft = isPaid
    ? { line1: `Payment ID: ${order.paymentId}`, line2: `Paid ${fmtDate(order.paidAt)}`, color: T.inkFaint }
    : isPending
    ? { line1: "Awaiting payment confirmation", line2: null, color: "#d97706" }
    : { line1: "Payment failed — transaction declined", line2: null, color: "#ef4444" };

  const btnLabel = isPaid ? "View receipt →" : isPending ? "Complete payment →" : "Retry payment →";

  const handleBtn = () => {
    if (isPaid) { navigate(`/users/receipt/${order._id}`); return; }
    try {
      const options = {
        key: "rzp_test_Seeukkl8eo0TXu",
        amount: order.amount,
        currency: "INR",
        name: "Ecomora",
        description: "Test Transaction",
        order_id: order.orderId,
        method: { upi: false, card: true, netbanking: true, wallet: true },
        handler: async function (response) {
          try {
            const token = localStorage.getItem("CommerceToken");
            if (!token) { alert("Please login again"); return; }
            const res = await fetch(`${import.meta.env.VITE_API_URL}/api/payments/verify-payment`, {
              method: "POST",
              headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
              body: JSON.stringify(response),
            });
            const result = await res.json();
            if (!res.ok) { showSnackbar("Unable to place order. Please try again", "error"); return; }
            showSnackbar("Order placed successfully", "success");
            setTimeout(() => navigate(`/users/receipt/${result.order._id}`), 2000);
          } catch (error) { alert("Something went wrong"); }
        },
      };
      const rzp = new window.Razorpay(options);
      rzp.open();
    } catch (error) { console.log(error); }
  };

  return (
    <div className="orp-card">
      {/* ── Header row ── */}
      <div
        className="orp-head"
        onClick={() => setOpen((o) => !o)}
        style={{ borderBottom: open ? `1px solid ${T.border}` : "1px solid transparent" }}
      >
        {/* Left: id + meta */}
        <div style={{ flex: 1, minWidth: 0 }}>
          <p className="orp-order-id">{displayId}</p>
          <p className="orp-order-meta">
            {fmtDate(order.createdAt)} · {order.items.length} item{order.items.length !== 1 ? "s" : ""}
          </p>
        </div>

        <StatusBadge status={order.status} />

        <span className="orp-amount">{fmtAmt(order.amount)}</span>

        <svg
          width="14" height="14" viewBox="0 0 24 24" fill="none"
          stroke={T.inkFaint} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"
          style={{ flexShrink: 0, marginLeft: 2, transition: "transform 0.25s", transform: open ? "rotate(180deg)" : "none" }}
        >
          <path d="M6 9l6 6 6-6" />
        </svg>
      </div>

      {/* ── Expanded items ── */}
      {open && (
        <div style={{ padding: "10px 16px 4px" }}>
          {order.items.map((item, idx) => (
            <div
              key={item.product}
              style={{
                display: "flex", alignItems: "center", gap: 12,
                padding: "10px 0",
                borderBottom: idx < order.items.length - 1 ? `1px solid ${T.border}` : "none",
              }}
            >
              <div style={{
                width: 44, height: 44, borderRadius: 10, flexShrink: 0,
                background: "linear-gradient(145deg, #f8fafa, #f0fdfa)",
                border: `1px solid ${T.border}`,
                display: "flex", alignItems: "center", justifyContent: "center", overflow: "hidden",
              }}>
                <img
                  src={item.image} alt={item.name} loading="lazy"
                  style={{ width: "100%", height: "100%", objectFit: "contain", padding: 5 }}
                />
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <p style={{
                  fontFamily: "'Lora', serif", fontWeight: 600, fontSize: 14,
                  color: T.ink, margin: 0,
                  whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis",
                }}>
                  {item.name}
                </p>
                <p style={{
                  fontFamily: "'Outfit', sans-serif", fontSize: 11.5,
                  color: T.inkFaint, margin: "2px 0 0",
                }}>
                  Qty {item.quantity}
                </p>
              </div>
              <span style={{
                fontFamily: "'Lora', serif", fontWeight: 700,
                fontSize: "1rem", color: T.ink, flexShrink: 0, paddingLeft: 8,
              }}>
                {fmtAmt(item.price * item.quantity)}
              </span>
            </div>
          ))}
        </div>
      )}

      {/* ── Footer ── */}
      <div className="orp-foot">
        <div style={{ minWidth: 0, flex: 1 }}>
          <p style={{
            fontFamily: "'Outfit', sans-serif", fontSize: 11.5,
            color: footerLeft.color, margin: 0,
            whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis",
          }}>
            {footerLeft.line1}
          </p>
          {footerLeft.line2 && (
            <p style={{ fontFamily: "'Outfit', sans-serif", fontSize: 11, color: T.inkFaint, margin: "2px 0 0" }}>
              {footerLeft.line2}
            </p>
          )}
        </div>
        <button className="orp-reveal" onClick={handleBtn}>
          {btnLabel}
        </button>
      </div>

      <Snackbar open={snackOpen} autoHideDuration={2000} onClose={() => setSnackOpen(false)}
        anchorOrigin={{ vertical: "top", horizontal: "right" }}>
        <Alert severity={severity} variant="filled" onClose={() => setSnackOpen(false)}>
          {msg}
        </Alert>
      </Snackbar>
    </div>
  );
};

// ─── Main Page ─────────────────────────────────────────────────────────────────
const OrdersPage = () => {
  const [orders, setOrders]     = useState([]);
  const [stats, setstats]       = useState({});
  const [filter, setFilter]     = useState("all");
  const [loading, setLoading]   = useState(true);
  const [error, setError]       = useState(false);
  const [customer, setCustomer] = useState({});
  const [total, settotal]       = useState(0);
  const [page, setpage]         = useState(1);
  const navigate   = useNavigate();
  const { userid } = useParams();
  const isAdminView = !!userid;
  const per_page = 5;

  useEffect(() => {
    if (!userid) return;
    (async () => {
      try {
        const res = await fetch(`${import.meta.env.VITE_API_URL}/api/customers/${userid}?page=${page}&limit=${per_page}&filter=${filter}`);
        const result = await res.json();
        if (!res?.ok) { console.log(result.message); return; }
        setCustomer(result.user);
        setOrders(result.user.userorders);
        settotal(result.totalDocuments);
        setstats(result.stats);
      } catch (error) { console.log(error); }
      finally { setLoading(false); }
    })();
  }, [userid, page, filter]);

  useEffect(() => {
    if (userid) return;
    (async () => {
      try {
        const token = localStorage.getItem("CommerceToken");
        const res = await fetch(`${import.meta.env.VITE_API_URL}/api/orders/getOrders?page=${page}&limit=${per_page}&filter=${filter}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await res.json();
        if (!res.ok) console.error("Orders fetch failed:", data);
        setOrders(data.order || []);
        settotal(data.totalorders);
        setstats(data.stats);
      } catch (err) { console.error(err); setError(true); }
      finally { setLoading(false); }
    })();
  }, [page, filter]);

  const filtered = filter === "all" ? orders : orders.filter((o) => o.status === filter);
  const totalpages = Math.ceil(total / per_page);

  return (
    <div className="orp-root">
      <Navbar />

      <div className="orp-shell">
        {/* ── Header band ── */}
        <div className="orp-hband">
          {/* Title + back */}
          <div className="orp-title-row">
            <div>
              <p style={{
                fontFamily: "'Outfit', sans-serif", fontSize: 10.5, fontWeight: 700,
                textTransform: "uppercase", letterSpacing: "0.12em", color: T.teal,
                margin: "0 0 7px", display: "flex", alignItems: "center", gap: 7,
              }}>
                <span style={{ width: 20, height: 1, background: "linear-gradient(90deg,#14b8a6,transparent)", display: "inline-block" }} />
                {isAdminView ? `${customer?.name || "Customer"} Account` : "Your Account"}
              </p>
              <h1 style={{
                fontFamily: "'Lora', serif", fontWeight: 700,
                fontSize: "clamp(1.4rem, 4vw, 1.85rem)", letterSpacing: "-0.03em",
                color: T.ink, lineHeight: 1.1, margin: "0 0 5px",
              }}>
                {isAdminView ? "Customer Orders" : "My Orders"}
              </h1>
              <p style={{ fontFamily: "'Outfit', sans-serif", fontSize: 13, color: T.inkFaint, margin: 0 }}>
                {isAdminView
                  ? "View and review this customer's order history."
                  : "Track and review your past purchases."}
              </p>
            </div>

            <button
              className="orp-back"
              onClick={isAdminView ? () => navigate(-1) : () => navigate("/user/products")}
            >
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none"
                stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M19 12H5M12 5l-7 7 7 7" />
              </svg>
              {isAdminView ? "Back" : "Browse Products"}
            </button>
          </div>

          {/* Stats */}
          <div className="orp-stats-grid">
            {[
              { label: "Total orders", val: stats?.totalorders || 0,                                color: T.ink },
              { label: "Paid",         val: stats?.paidorders || 0,                                 color: T.teal },
              { label: "Pending",      val: stats?.pendingorders || 0,                              color: "#d97706" },
              { label: "Total spent",  val: `₹${(stats?.totalspent || 0).toLocaleString("en-IN")}`, color: T.ink },
            ].map(({ label, val, color }) => (
              <div key={label} className="orp-stat-tile">
                <p style={{
                  fontFamily: "'Outfit', sans-serif", fontSize: 10, fontWeight: 600,
                  textTransform: "uppercase", letterSpacing: "0.07em",
                  color: T.inkFaint, margin: "0 0 5px",
                }}>
                  {label}
                </p>
                <p style={{
                  fontFamily: "'Lora', serif", fontWeight: 700,
                  fontSize: "clamp(1.1rem, 3vw, 1.4rem)", color, margin: 0,
                }}>
                  {val}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* ── Body ── */}
        <div className="orp-body">
          {/* Filter chips */}
          <div className="orp-filters">
            {["all", "paid", "pending"].map((f) => (
              <button
                key={f}
                className="orp-chip"
                onClick={() => { setFilter(f); setpage(1); }}
                style={{
                  border: filter === f ? `1px solid ${T.tealBorder}` : `1px solid ${T.borderMid}`,
                  background: filter === f ? T.tealLight : "transparent",
                  color: filter === f ? T.teal : T.inkLight,
                }}
              >
                {f}
              </button>
            ))}
          </div>

          {/* Loading */}
          {loading && (
            <div style={{ textAlign: "center", padding: "60px 0" }}>
              <p style={{ fontFamily: "'Outfit', sans-serif", fontSize: 13, color: T.inkFaint }}>
                Loading orders…
              </p>
            </div>
          )}

          {/* Empty */}
          {!loading && filtered.length === 0 && (
            <div style={{ textAlign: "center", padding: "60px 0" }}>
              <p style={{ fontFamily: "'Lora', serif", fontSize: "1.35rem", color: T.inkFaint, margin: "0 0 6px" }}>
                No orders found
              </p>
              <p style={{ fontFamily: "'Outfit', sans-serif", fontSize: 13, color: T.inkFaint, margin: 0 }}>
                {filter === "all" ? "No orders placed yet." : `No ${filter} orders.`}
              </p>
            </div>
          )}

          {/* Cards */}
          {!loading && filtered.map((order) => (
            <OrderCard key={order._id} order={order} />
          ))}

          {/* Pagination */}
          <div className="orp-pagination">
            <button
              className="orp-page-btn"
              disabled={page === 1}
              onClick={() => setpage(page - 1)}
            >
              ← Prev
            </button>
            <span className="orp-page-indicator">
              Page {page} / {totalpages || 1}
            </span>
            <button
              className="orp-page-btn"
              disabled={page === totalpages}
              onClick={() => setpage(page + 1)}
            >
              Next →
            </button>
          </div>
        </div>
      </div>

      <Snackbar open={error} autoHideDuration={3000} onClose={() => setError(false)}
        anchorOrigin={{ vertical: "top", horizontal: "right" }}>
        <Alert severity="error" variant="filled" onClose={() => setError(false)}>
          Failed to load orders
        </Alert>
      </Snackbar>
    </div>
  );
};

export default OrdersPage;