import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Snackbar, Alert } from "@mui/material";

// ─── Font injection ────────────────────────────────────────────────────────────
if (!document.getElementById("orp-fonts")) {
  const link = document.createElement("link");
  link.id = "orp-fonts";
  link.rel = "stylesheet";
  link.href = "https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@600;700&family=DM+Sans:wght@300;400;500;600&display=swap";
  document.head.appendChild(link);
}

// ─── Responsive CSS ────────────────────────────────────────────────────────────
if (!document.getElementById("orp-styles")) {
  const el = document.createElement("style");
  el.id = "orp-styles";
  el.textContent = `
    .orp-stats { grid-template-columns: repeat(4, minmax(0,1fr)); gap: 12px; }
    @media (max-width: 640px) {
      .orp-stats { grid-template-columns: 1fr 1fr; gap: 10px; }
      .orp-hband { padding: 20px 16px 18px !important; }
      .orp-body  { padding: 14px 16px 24px !important; }
    }
    .orp-reveal {
      opacity: 0; transform: translateX(8px); pointer-events: none;
      transition: opacity .2s ease, transform .2s ease, background .15s, color .15s, border-color .15s;
    }
    @media (hover: hover) {
      .orp-card:hover .orp-reveal {
        opacity: 1; transform: translateX(0); pointer-events: auto;
      }
      .orp-card:hover {
        box-shadow: 0 10px 32px -12px rgba(15,118,110,0.2) !important;
        border-color: rgba(13,148,136,0.2) !important;
        transform: translateY(-1px);
      }
    }
    @media (hover: none) {
      .orp-reveal { opacity: 1; transform: none; pointer-events: auto; width: 100%; }
      .orp-foot   { flex-wrap: wrap; }
    }
    .orp-chip:hover   { background: rgba(13,148,136,0.08); color: #0f766e; border-color: rgba(13,148,136,0.18); }
    .orp-head:active  { background: #F3EFE8 !important; }
    .orp-reveal:hover { background: rgba(13,148,136,0.08) !important; color: #0f766e !important; border-color: rgba(13,148,136,0.18) !important; }
    .orp-back:hover   { background: #1C1410 !important; color: #FAF8F5 !important; }
    .orp-filters::-webkit-scrollbar { display: none; }
  `;
  document.head.appendChild(el);
}

// ─── Tokens ────────────────────────────────────────────────────────────────────
const T = { // we take T object so that without writing color:#123 we can write T.teal etc..                                              
  cream: "#FAF8F5", parchment: "#F3EFE8",
  ink: "#1C1410", inkLight: "#6B5B4E", inkFaint: "#A0917F",
  accent: "#B8622A", border: "rgba(60,40,20,0.08)", borderMid: "rgba(60,40,20,0.12)",
  teal: "#0f766e", tealLight: "rgba(13,148,136,0.08)", tealBorder: "rgba(13,148,136,0.18)",
  shadow: "0 4px 32px -8px rgba(28,20,16,0.08)",
};

const STATUS = {
  paid:    { dot: "#0f766e", bg: "#F0FDF8", color: "#0a6057", border: "rgba(13,148,136,0.2)",  label: "Paid" },
  pending: { dot: "#BA7517", bg: "#FAEEDA", color: "#633806", border: "rgba(186,117,23,0.22)", label: "Pending" },
  failed:  { dot: "#E24B4A", bg: "#FCEBEB", color: "#791F1F", border: "rgba(226,75,74,0.18)",  label: "Failed" },
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
      fontFamily: "'DM Sans', sans-serif", whiteSpace: "nowrap",
    }}>
      <span style={{ width: 5, height: 5, borderRadius: "50%", background: s.dot, flexShrink: 0 }} />
      {s.label}
    </span>
  );
};

// ─── Order Card ────────────────────────────────────────────────────────────────
const OrderCard = ({ order }) => {
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();

  const isPaid    = order.status === "paid";
  const isPending = order.status === "pending";

  // Show your custom orderId — NOT Razorpay's internal "order_xxx" ID
  // Your schema has orderId field like "ORD-2025-00142"
  // If backend is saving Razorpay's ID in orderId field, fix that on backend
  // This is a safe display fallback:
  const displayId = order.orderId?.startsWith("order_")
    ? `Order #${order.orderId.slice(-6).toUpperCase()}`
    : `#${order.orderId}`;

  const footerLeft = isPaid
    ? { line1: `Payment ID: ${order.paymentId}`, line2: `Paid ${fmtDate(order.paidAt)}`, color: T.inkFaint }
    : isPending
    ? { line1: "Awaiting payment confirmation", line2: null, color: "#BA7517" }
    : { line1: "Payment failed — transaction declined", line2: null, color: "#E24B4A" };

  const btnLabel = isPaid ? "View receipt →" : isPending ? "Complete payment →" : "Retry payment →";

  const handleBtn = () => {
    if (isPaid) navigate(`/users/receipt/${order._id}`);
    
  };

  return (
    <div
      className="orp-card"
      style={{
        background: "#fff", border: `1px solid ${T.border}`,
        borderRadius: 14, marginBottom: 10, overflow: "hidden",
        transition: "box-shadow 0.25s, border-color 0.25s, transform 0.25s",
      }}
    >
      {/* ── Header ── */}
      <div
        className="orp-head"
        onClick={() => setOpen(o => !o)}
        style={{
          padding: "15px 18px", display: "flex", alignItems: "center",
          gap: 10, cursor: "pointer", background: "#FAFAF9",
          borderBottom: `1px solid rgba(60,40,20,0.06)`,
          minHeight: 60, WebkitTapHighlightColor: "transparent", userSelect: "none",
        }}
      >
        <div style={{ flex: 1, minWidth: 0 }}>
          <p style={{
            fontFamily: "'DM Sans', sans-serif", fontSize: 13, fontWeight: 600, color: T.ink,
            overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap",
          }}>
            {displayId}
          </p>
          <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 11.5, color: T.inkFaint, marginTop: 2 }}>
            {fmtDate(order.createdAt)} · {order.items.length} item{order.items.length !== 1 ? "s" : ""}
          </p>
        </div>

        <StatusBadge status={order.status} />

        <span style={{
          fontFamily: "'Cormorant Garamond', serif", fontWeight: 700,
          fontSize: "1.2rem", color: T.ink, flexShrink: 0, marginLeft: "auto", paddingLeft: 8,
        }}>
          {fmtAmt(order.amount)}
        </span>

        <svg width="14" height="14" viewBox="0 0 24 24" fill="none"
          stroke={T.inkFaint} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"
          style={{ flexShrink: 0, marginLeft: 6, transition: "transform 0.25s", transform: open ? "rotate(180deg)" : "none" }}>
          <path d="M6 9l6 6 6-6" />
        </svg>
      </div>

      {/* ── Expanded items ── */}
      {open && (
        <div style={{ padding: "12px 18px 6px" }}>
          {order.items.map((item, idx) => (
            <div key={item.product} style={{
              display: "flex", alignItems: "center", gap: 12, padding: "10px 0",
              borderBottom: idx < order.items.length - 1 ? `1px solid rgba(60,40,20,0.05)` : "none",
            }}>
              <div style={{
                width: 46, height: 46, borderRadius: 8, flexShrink: 0,
                background: T.parchment,
                display: "flex", alignItems: "center", justifyContent: "center", overflow: "hidden",
              }}>
                <img src={item.image} alt={item.name} loading="lazy"
                  style={{ width: "100%", height: "100%", objectFit: "contain", padding: 5 }} />
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <p style={{
                  fontFamily: "'Cormorant Garamond', serif", fontWeight: 700,
                  fontSize: 15, color: T.ink,
                  overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap",
                }}>
                  {item.name}
                </p>
                <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 11.5, color: T.inkFaint, marginTop: 1 }}>
                  Qty {item.quantity}
                </p>
              </div>
              <span style={{
                fontFamily: "'Cormorant Garamond', serif", fontWeight: 700,
                fontSize: "1rem", color: T.ink, flexShrink: 0, paddingLeft: 8,
              }}>
                {fmtAmt(item.price * item.quantity)}
              </span>
            </div>
          ))}
        </div>
      )}

      {/* ── Footer ── */}
      <div
        className="orp-foot"
        style={{
          padding: "11px 18px", display: "flex",
          alignItems: "center", justifyContent: "space-between", gap: 12,
          background: "#FAFAF9", borderTop: `1px solid rgba(60,40,20,0.06)`,
        }}
      >
        <div style={{ minWidth: 0, flex: 1 }}>
          <p style={{
            fontFamily: "'DM Sans', sans-serif", fontSize: 11.5, color: footerLeft.color,
            overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap",
          }}>
            {footerLeft.line1}
          </p>
          {footerLeft.line2 && (
            <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 11, color: T.inkFaint, marginTop: 2 }}>
              {footerLeft.line2}
            </p>
          )}
        </div>

        {/* Hover-reveal CTA */}
        <button
          className="orp-reveal"
          onClick={handleBtn}
          style={{
            flexShrink: 0, height: 36, padding: "0 16px", borderRadius: 8,
            border: `1px solid ${T.borderMid}`, background: "transparent",
            color: T.inkLight, fontFamily: "'DM Sans', sans-serif",
            fontSize: 12, fontWeight: 600, cursor: "pointer", whiteSpace: "nowrap",
            WebkitTapHighlightColor: "transparent",
          }}
        >
          {btnLabel}
        </button>
      </div>
    </div>
  );
};

// ─── Main Page ─────────────────────────────────────────────────────────────────
const OrdersPage = () => {
  const [orders, setOrders]   = useState([]);
  const [filter, setFilter]   = useState("all");
  const [loading, setLoading] = useState(true);
  const [error, setError]     = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    (async () => {
      try {
        const token = localStorage.getItem("CommerceToken");
        const res = await fetch(`${import.meta.env.VITE_API_URL}/api/orders/getOrders`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await res.json();
        if (!res.ok) console.error("Orders fetch failed:", data);
        setOrders(data.order || []);
      } catch (err) {
        console.error(err);
        setError(true);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const filtered = filter === "all" ? orders : orders.filter(o => o.status === filter);

  const stats = {
    total:   orders.length,
    paid:    orders.filter(o => o.status === "paid").length,
    pending: orders.filter(o => o.status === "pending").length,
    spent:   orders.filter(o => o.status === "paid").reduce((s, o) => s + o.amount, 0),
  };

  return (
    <div style={{ width: "min(1120px, 98%)", margin: "0 auto" }}>
      <div style={{
        background: "#fff", borderRadius: 20,
        border: `1px solid ${T.border}`, boxShadow: T.shadow, overflow: "hidden",
      }}>

        {/* ── Header band ── */}
        <div
          className="orp-hband"
          style={{ background: T.cream, borderBottom: `1px solid rgba(60,40,20,0.07)`, padding: "28px 32px 24px" }}
        >
          {/* Title row + back button */}
          <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 12, flexWrap: "wrap" }}>
            <div>
              <p style={{ fontFamily: "'DM Sans',sans-serif", fontSize: 10.5, fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.12em", color: T.teal, marginBottom: 6 }}>
                Your account
              </p>
              <h1 style={{ fontFamily: "'Cormorant Garamond',serif", fontWeight: 700, fontSize: "1.9rem", letterSpacing: "-0.02em", color: T.ink, lineHeight: 1, marginBottom: 5 }}>
                My Orders
              </h1>
              <p style={{ fontFamily: "'DM Sans',sans-serif", fontSize: 13, color: T.inkFaint }}>
                Track and review your past purchases.
              </p>
            </div>

            {/* Back to products button */}
            <button
              className="orp-back"
              onClick={() => navigate("/user/products")}
              style={{
                display: "inline-flex", alignItems: "center", gap: 7,
                padding: "0 18px", height: 38, borderRadius: 10,
                border: `1px solid ${T.borderMid}`, background: "transparent",
                color: T.inkLight, fontFamily: "'DM Sans',sans-serif",
                fontSize: 13, fontWeight: 600, cursor: "pointer",
                transition: "all 0.18s", flexShrink: 0,
                WebkitTapHighlightColor: "transparent",
              }}
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none"
                stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M19 12H5M12 5l-7 7 7 7" />
              </svg>
              Browse products
            </button>
          </div>

          {/* Stats */}
          <div className="orp-stats" style={{ display: "grid", marginTop: 20 }}>
            {[
              { label: "Total orders", val: stats.total,                                   color: T.ink },
              { label: "Paid",         val: stats.paid,                                    color: T.teal },
              { label: "Pending",      val: stats.pending,                                 color: "#BA7517" },
              { label: "Total spent",  val: `₹${stats.spent.toLocaleString("en-IN")}`,    color: T.ink },
            ].map(({ label, val, color }) => (
              <div key={label} style={{ background: T.parchment, borderRadius: 10, padding: "12px 16px" }}>
                <p style={{ fontFamily: "'DM Sans',sans-serif", fontSize: 10, fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.07em", color: T.inkFaint, marginBottom: 4 }}>
                  {label}
                </p>
                <p style={{ fontFamily: "'Cormorant Garamond',serif", fontWeight: 700, fontSize: "1.45rem", color }}>
                  {val}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* ── Body ── */}
        <div className="orp-body" style={{ padding: "20px 32px 28px" }}>

          {/* Filter chips */}
          <div
            className="orp-filters"
            style={{
              display: "flex", gap: 8, marginBottom: 18,
              overflowX: "auto", scrollbarWidth: "none",
              WebkitOverflowScrolling: "touch", paddingBottom: 2,
            }}
          >
            {["all", "paid", "pending", "failed"].map(f => (
              <button
                key={f}
                className="orp-chip"
                onClick={() => setFilter(f)}
                style={{
                  padding: "5px 16px", borderRadius: 20, fontSize: 12, fontWeight: 600,
                  cursor: "pointer", flexShrink: 0, minHeight: 34,
                  fontFamily: "'DM Sans',sans-serif", textTransform: "capitalize",
                  border: filter === f ? `1px solid ${T.tealBorder}` : `1px solid ${T.borderMid}`,
                  background: filter === f ? T.tealLight : "transparent",
                  color: filter === f ? T.teal : T.inkLight,
                  transition: "all 0.15s", WebkitTapHighlightColor: "transparent",
                }}
              >
                {f}
              </button>
            ))}
          </div>

          {/* Loading */}
          {loading && (
            <div style={{ textAlign: "center", padding: "60px 0" }}>
              <p style={{ fontFamily: "'DM Sans',sans-serif", fontSize: 13, color: T.inkFaint }}>
                Loading your orders…
              </p>
            </div>
          )}

          {/* Empty */}
          {!loading && filtered.length === 0 && (
            <div style={{ textAlign: "center", padding: "60px 0" }}>
              <p style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: "1.4rem", color: T.inkFaint, marginBottom: 6 }}>
                No orders found
              </p>
              <p style={{ fontFamily: "'DM Sans',sans-serif", fontSize: 13, color: T.inkFaint }}>
                {filter === "all" ? "You haven't placed any orders yet." : `No ${filter} orders.`}
              </p>
            </div>
          )}

          {/* Cards */}
          {!loading && filtered.map(order => (
            <OrderCard key={order._id} order={order} /> // har order ke liye ordercard bana rahe hai
          ))}
        </div>
      </div>

      <Snackbar open={error} autoHideDuration={3000} onClose={() => setError(false)}
        anchorOrigin={{ vertical: "top", horizontal: "right" }}>
        <Alert severity="error" variant="filled" onClose={() => setError(false)}
          sx={{ fontFamily: "'DM Sans',sans-serif" }}>
          Failed to load orders
        </Alert>
      </Snackbar>
    </div>
  );
};

export default OrdersPage;