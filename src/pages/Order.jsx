import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Snackbar, Alert } from "@mui/material";

const T = {
  cream: "#FAF8F5", parchment: "#F3EFE8",
  ink: "#1C1410", inkLight: "#6B5B4E", inkFaint: "#A0917F",
  accent: "#B8622A", border: "rgba(60,40,20,0.08)", borderMid: "rgba(60,40,20,0.12)",
  teal: "#0f766e", tealLight: "rgba(13,148,136,0.08)", tealBorder: "rgba(13,148,136,0.18)",
  shadow: "0 4px 32px -8px rgba(28,20,16,0.08)",
};

const STATUS_STYLE = {
  paid:    { dot: "#0f766e", bg: "#F0FDF8", color: "#0a6057", border: "rgba(13,148,136,0.2)",   label: "Paid" },
  pending: { dot: "#BA7517", bg: "#FAEEDA", color: "#633806", border: "rgba(186,117,23,0.22)",  label: "Pending" },
  failed:  { dot: "#E24B4A", bg: "#FCEBEB", color: "#791F1F", border: "rgba(226,75,74,0.18)",   label: "Failed" },
};

const StatusBadge = ({ status }) => {
  const s = STATUS_STYLE[status] || STATUS_STYLE.pending;
  return (
    <span style={{
      display: "inline-flex", alignItems: "center", gap: 5, flexShrink: 0,
      padding: "3px 10px", borderRadius: 20, fontSize: 11, fontWeight: 600,
      background: s.bg, color: s.color, border: `1px solid ${s.border}`,
      fontFamily: "'DM Sans', sans-serif",
    }}>
      <span style={{ width: 5, height: 5, borderRadius: "50%", background: s.dot }} />
      {s.label}
    </span>
  );
};

const OrderCard = ({ order }) => {
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();

  const footerContent = {
    paid:    { text: `Payment ID: ${order.paymentId}  ·  Paid ${new Date(order.paidAt).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}`, color: T.inkFaint, btn: "View receipt" },
    pending: { text: "Awaiting payment confirmation", color: "#BA7517", btn: "Complete payment" },
    failed:  { text: "Payment failed — transaction declined", color: "#E24B4A", btn: "Retry payment" },
  };
  const f = footerContent[order.status] || footerContent.pending;

  return (
    <div style={{
      background: "#fff", border: `1px solid ${T.border}`,
      borderRadius: 14, marginBottom: 12, overflow: "hidden",
      transition: "box-shadow 0.2s, border-color 0.2s",
    }}
      onMouseEnter={e => { e.currentTarget.style.boxShadow = "0 8px 28px -12px rgba(15,118,110,0.2)"; e.currentTarget.style.borderColor = T.tealBorder; }}
      onMouseLeave={e => { e.currentTarget.style.boxShadow = "none"; e.currentTarget.style.borderColor = T.border; }}
    >
      {/* ── Header ── */}
      <div
        onClick={() => setOpen(!open)}
        style={{
          padding: "16px 18px", display: "flex", alignItems: "center",
          gap: 12, cursor: "pointer", background: "#FAFAF9",
          borderBottom: `1px solid rgba(60,40,20,0.06)`,
        }}
      >
        <div style={{ flex: 1, minWidth: 0 }}>
          <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 13, fontWeight: 600, color: T.ink }}>
            {order.orderId}
          </p>
          <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 11.5, color: T.inkFaint, marginTop: 2 }}>
            {new Date(order.createdAt).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}
            {" · "}{order.items.length} item{order.items.length !== 1 ? "s" : ""}
          </p>
        </div>

        <StatusBadge status={order.status} />

        <span style={{
          fontFamily: "'Cormorant Garamond', serif", fontWeight: 700,
          fontSize: "1.2rem", color: T.ink, marginLeft: "auto", marginRight: 10,
        }}>
          ₹{order.amount.toLocaleString("en-IN")}
        </span>

        {/* Chevron */}
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none"
          stroke={T.inkFaint} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"
          style={{ transition: "transform 0.22s", transform: open ? "rotate(180deg)" : "none", flexShrink: 0 }}>
          <path d="M6 9l6 6 6-6" />
        </svg>
      </div>

      {/* ── Items ── */}
      {open && (
        <div style={{ padding: "14px 18px" }}>
          {order.items.map((item, idx) => (
            <div key={item.product} style={{
              display: "flex", alignItems: "center", gap: 12, padding: "9px 0",
              borderBottom: idx < order.items.length - 1 ? `1px solid rgba(60,40,20,0.05)` : "none",
            }}>
              <div style={{
                width: 46, height: 46, borderRadius: 8, flexShrink: 0,
                background: `linear-gradient(145deg,#F8F5F0,${T.parchment})`,
                display: "flex", alignItems: "center", justifyContent: "center", overflow: "hidden",
              }}>
                <img src={item.image} alt={item.name}
                  style={{ width: "100%", height: "100%", objectFit: "contain", padding: 5 }} />
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <p style={{
                  fontFamily: "'Cormorant Garamond', serif", fontWeight: 700,
                  fontSize: 15, color: T.ink,
                  whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis",
                }}>
                  {item.name}
                </p>
                <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 11.5, color: T.inkFaint, marginTop: 1 }}>
                  Qty {item.quantity}
                </p>
              </div>
              <span style={{
                fontFamily: "'Cormorant Garamond', serif", fontWeight: 700,
                fontSize: "1rem", color: T.ink, whiteSpace: "nowrap",
              }}>
                ₹{(item.price * item.quantity).toLocaleString("en-IN")}
              </span>
            </div>
          ))}
        </div>
      )}

      {/* ── Footer ── */}
      <div style={{
        padding: "11px 18px", display: "flex",
        justifyContent: "space-between", alignItems: "center",
        background: "#FAFAF9", borderTop: `1px solid rgba(60,40,20,0.06)`,
      }}>
        <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 11.5, color: f.color }}>
          {f.text}
        </p>
        <button
          onClick={() => order.status === "paid" && navigate(`/user/orders/${order._id}`, { state: { order } })}
          style={{
            padding: "6px 16px", borderRadius: 8,
            border: `1px solid ${T.borderMid}`, background: "transparent",
            color: T.inkLight, fontFamily: "'DM Sans', sans-serif",
            fontSize: 12, fontWeight: 600, cursor: "pointer", transition: "all 0.15s",
          }}
          onMouseEnter={e => { e.target.style.borderColor = T.tealBorder; e.target.style.background = T.tealLight; e.target.style.color = T.teal; }}
          onMouseLeave={e => { e.target.style.borderColor = T.borderMid; e.target.style.background = "transparent"; e.target.style.color = T.inkLight; }}
        >
          {f.btn}
        </button>
      </div>
    </div>
  );
};

// ── Main ──────────────────────────────────────────────────────────────────────
const OrdersPage = () => {
  const [orders, setOrders] = useState([]);
  const [filter, setFilter] = useState("all");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const token = localStorage.getItem("CommerceToken");
        const res = await fetch(`${import.meta.env.VITE_API_URL}/api/orders/my`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await res.json();
        setOrders(data.orders || []);
      } catch (err) {
        setError(true);
      } finally {
        setLoading(false);
      }
    };
    fetchOrders();
  }, []);

  const filtered = filter === "all" ? orders : orders.filter(o => o.status === filter);

  const stats = {
    total: orders.length,
    paid: orders.filter(o => o.status === "paid").length,
    pending: orders.filter(o => o.status === "pending").length,
    spent: orders.filter(o => o.status === "paid").reduce((s, o) => s + o.amount, 0),
  };

  return (
    <div style={{ width: "min(1120px, 98%)", margin: "0 auto" }}>
      <div style={{ background: "#fff", borderRadius: 20, border: `1px solid ${T.border}`, boxShadow: T.shadow, overflow: "hidden" }}>

        {/* ── Header band ── */}
        <div style={{ background: T.cream, borderBottom: `1px solid rgba(60,40,20,0.07)`, padding: "28px 32px 24px" }}>
          <p style={{ fontFamily: "'DM Sans',sans-serif", fontSize: 10.5, fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.12em", color: T.teal, marginBottom: 6 }}>
            Your account
          </p>
          <h1 style={{ fontFamily: "'Cormorant Garamond',serif", fontWeight: 700, fontSize: "1.9rem", letterSpacing: "-0.02em", color: T.ink, lineHeight: 1, marginBottom: 5 }}>
            My Orders
          </h1>
          <p style={{ fontFamily: "'DM Sans',sans-serif", fontSize: 13, color: T.inkFaint }}>
            Track and review your past purchases.
          </p>

          {/* Stats */}
          <div style={{ display: "grid", gridTemplateColumns: "repeat(4, minmax(0,1fr))", gap: 12, marginTop: 20 }}>
            {[
              { label: "Total orders", val: stats.total,   color: T.ink },
              { label: "Paid",         val: stats.paid,    color: T.teal },
              { label: "Pending",      val: stats.pending, color: "#BA7517" },
              { label: "Total spent",  val: `₹${stats.spent.toLocaleString("en-IN")}`, color: T.ink },
            ].map(({ label, val, color }) => (
              <div key={label} style={{ background: T.parchment, borderRadius: 10, padding: "12px 16px" }}>
                <p style={{ fontFamily: "'DM Sans',sans-serif", fontSize: 10.5, fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.07em", color: T.inkFaint, marginBottom: 4 }}>
                  {label}
                </p>
                <p style={{ fontFamily: "'Cormorant Garamond',serif", fontWeight: 700, fontSize: "1.5rem", color }}>
                  {val}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* ── Body ── */}
        <div style={{ padding: "20px 32px 28px" }}>

          {/* Filter chips */}
          <div style={{ display: "flex", gap: 8, marginBottom: 18 }}>
            {["all", "paid", "pending", "failed"].map(f => (
              <button key={f} onClick={() => setFilter(f)} style={{
                padding: "5px 14px", borderRadius: 20, fontSize: 12, fontWeight: 600,
                cursor: "pointer", fontFamily: "'DM Sans',sans-serif", textTransform: "capitalize",
                border: filter === f ? `1px solid ${T.tealBorder}` : `1px solid ${T.borderMid}`,
                background: filter === f ? T.tealLight : "transparent",
                color: filter === f ? T.teal : T.inkLight,
                transition: "all 0.15s",
              }}>
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

          {/* Order cards */}
          {!loading && filtered.map(order => (
            <OrderCard key={order._id} order={order} />
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