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
    .orp-stats-grid { display: grid; grid-template-columns: repeat(4, minmax(0,1fr)); gap: 12px; }
    @media (max-width: 640px) {
      .orp-stats-grid { grid-template-columns: 1fr 1fr; gap: 10px; }
      .orp-hband { padding: 20px 18px 18px !important; }
      .orp-body  { padding: 16px 18px 28px !important; }
    }

    /* Card hover */
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

    /* Reveal button */
    .orp-reveal {
      opacity: 0;
      transform: translateX(8px);
      pointer-events: none;
      transition: opacity 0.2s ease, transform 0.22s ease, background 0.15s, color 0.15s, border-color 0.15s;
    }
    @media (hover: hover) {
      .orp-card:hover .orp-reveal { opacity: 1; transform: translateX(0); pointer-events: auto; }
    }
    @media (hover: none) {
      .orp-reveal { opacity: 1; transform: none; pointer-events: auto; }
      .orp-foot   { flex-wrap: wrap; }
    }
    .orp-reveal:hover { background: rgba(13,148,136,0.07) !important; color: #0d9488 !important; border-color: rgba(13,148,136,0.25) !important; }

    /* Filter chips */
    .orp-chip { transition: all 0.15s; }
    .orp-chip:hover { background: rgba(13,148,136,0.07) !important; color: #0d9488 !important; border-color: rgba(13,148,136,0.22) !important; }

    /* Back button */
    .orp-back { transition: all 0.18s; }
    .orp-back:hover { background: #0f172a !important; color: #fff !important; border-color: #0f172a !important; }

    /* Head row click */
    .orp-head { transition: background 0.15s; }
    .orp-head:active { background: #f0fdfa !important; }

    /* Scrollbar hide */
    .orp-filters::-webkit-scrollbar { display: none; }

    .ph-pagination {
          display: flex;
          justify-content: center;
          align-items: center;
          gap: 10px;
          margin-top: 32px;
        }

        .ph-page-btn {
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
        .ph-page-btn:hover:not(:disabled) {
          border-color: rgba(13,148,136,0.3);
          color: #0d9488;
          background: #f0fdfa;
          box-shadow: 0 4px 12px -4px rgba(13,148,136,0.18);
        }
        .ph-page-btn:disabled {
          opacity: 0.38;
          cursor: not-allowed;
        }

        .ph-page-indicator {
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

  `;
  document.head.appendChild(el);
}

// ─── Tokens ────────────────────────────────────────────────────────────────────
const T = {
  ink: "#0f172a", inkLight: "#64748b", inkFaint: "#94a3b8",
  teal: "#0d9488", tealLight: "rgba(13,148,136,0.07)", tealBorder: "rgba(13,148,136,0.22)",
  border: "rgba(226,232,240,0.9)", borderMid: "rgba(203,213,225,0.9)",
  bg: "#f8fafc",
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
        style={{
          padding: "14px 18px",
          display: "flex", alignItems: "center", gap: 10,
          cursor: "pointer", background: "#fafafa",
          borderBottom: open ? `1px solid ${T.border}` : "1px solid transparent",
          userSelect: "none", WebkitTapHighlightColor: "transparent",
          minHeight: 58,
        }}
      >
        <div style={{ flex: 1, minWidth: 0 }}>
          <p style={{
            fontFamily: "'Outfit', sans-serif", fontSize: 13, fontWeight: 700,
            color: T.ink, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis", margin: 0,
          }}>
            {displayId}
          </p>
          <p style={{
            fontFamily: "'Outfit', sans-serif", fontSize: 11.5, color: T.inkFaint, margin: "2px 0 0",
          }}>
            {fmtDate(order.createdAt)} · {order.items.length} item{order.items.length !== 1 ? "s" : ""}
          </p>
        </div>

        <StatusBadge status={order.status} />

        <span style={{
          fontFamily: "'Lora', serif", fontWeight: 700,
          fontSize: "1.15rem", color: T.ink, flexShrink: 0, paddingLeft: 8,
        }}>
          {fmtAmt(order.amount)}
        </span>

        <svg
          width="14" height="14" viewBox="0 0 24 24" fill="none"
          stroke={T.inkFaint} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"
          style={{ flexShrink: 0, marginLeft: 4, transition: "transform 0.25s", transform: open ? "rotate(180deg)" : "none" }}
        >
          <path d="M6 9l6 6 6-6" />
        </svg>
      </div>

      {/* ── Expanded items ── */}
      {open && (
        <div style={{ padding: "10px 18px 4px" }}>
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
                width: 46, height: 46, borderRadius: 10, flexShrink: 0,
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
                  fontFamily: "'Lora', serif", fontWeight: 600, fontSize: 14.5,
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
      <div
        className="orp-foot"
        style={{
          padding: "10px 18px", display: "flex",
          alignItems: "center", justifyContent: "space-between", gap: 12,
          background: "#fafafa", borderTop: `1px solid ${T.border}`,
        }}
      >
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
        <button
          className="orp-reveal"
          onClick={handleBtn}
          style={{
            flexShrink: 0, height: 34, padding: "0 14px", borderRadius: 9,
            border: `1px solid ${T.borderMid}`, background: "transparent",
            color: T.inkLight, fontFamily: "'Outfit', sans-serif",
            fontSize: 12, fontWeight: 600, cursor: "pointer", whiteSpace: "nowrap",
            WebkitTapHighlightColor: "transparent",
          }}
        >
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
  const [orders, setOrders]   = useState([]);
  const [filter, setFilter]   = useState("all");
  const [loading, setLoading] = useState(true);
  const [error, setError]     = useState(false);
  const [customer, setCustomer] = useState({});
  const [total, settotal] = useState(0)
  const [page, setpage] = useState(1);
  const navigate  = useNavigate();
  const { userid } = useParams();
  const isAdminView = !!userid;
  const per_page=5;

  useEffect(() => {
    if (!userid) return;
    (async () => {
      try {
        const res = await fetch(`${import.meta.env.VITE_API_URL}/api/customers/${userid}?page=${page}&limit=${per_page}&filter=${filter}`);
        const result = await res.json();
        if (!res?.ok) { console.log(result.message); return; }
        setCustomer(result.user);
        setOrders(result.user.userorders);
        settotal(result.totalDocuments)
      } catch (error) { console.log(error); }
      finally { setLoading(false); }
    })();
  }, [userid,page,filter]);

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
        settotal(data.totalorders)
      } catch (err) { console.error(err); setError(true); }
      finally { setLoading(false); }
    })();
  }, [page,filter]);


  const filtered = filter === "all" ? orders : orders.filter((o) => o.status === filter);

  const stats = {
    total:   orders.length,
    paid:    orders.filter((o) => o.status === "paid").length ,
    pending: orders.filter((o) => o.status === "pending").length,
    spent:   orders.filter((o) => o.status === "paid").reduce((s, o) => s + o.amount, 0),
  };

const totalpages=Math.ceil(total/per_page);

  return (

    <div style={{ width: "min(1140px, 97%)", margin: "0 auto" }}>
      <Navbar />

      <div style={{
        marginTop: 20,
        background: "#fff",
        borderRadius: 22,
        border: `1px solid ${T.border}`,
        boxShadow: "0 4px 32px -8px rgba(15,23,42,0.08)",
        overflow: "hidden",
      }}>
        {/* ── Header band ── */}
        <div
          className="orp-hband"
          style={{
            background: "#fafafa",
            borderBottom: `1px solid ${T.border}`,
            padding: "28px 32px 24px",
          }}
        >
          {/* Title + back */}
          <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 12, flexWrap: "wrap" }}>
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
                fontSize: "1.85rem", letterSpacing: "-0.03em",
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
              style={{
                display: "inline-flex", alignItems: "center", gap: 7,
                padding: "0 16px", height: 36, borderRadius: 10,
                border: `1px solid ${T.borderMid}`, background: "transparent",
                color: T.inkLight, fontFamily: "'Outfit', sans-serif",
                fontSize: 12.5, fontWeight: 600, cursor: "pointer", flexShrink: 0,
                WebkitTapHighlightColor: "transparent",
              }}
            >
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none"
                stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M19 12H5M12 5l-7 7 7 7" />
              </svg>
              {isAdminView ? "Back" : "Browse Products"}
            </button>
          </div>

          {/* Stats */}
          <div className="orp-stats-grid" style={{ marginTop: 20 }}>
            {[
              { label: "Total orders", val: stats.total,                                 color: T.ink },
              { label: "Paid",         val: stats.paid,                                  color: T.teal },
              { label: "Pending",      val: stats.pending,                               color: "#d97706" },
              { label: "Total spent",  val: `₹${stats.spent.toLocaleString("en-IN")}`,  color: T.ink },
            ].map(({ label, val, color }) => (
              <div key={label} style={{
                background: "rgba(248,250,252,0.8)",
                border: `1px solid ${T.border}`,
                borderRadius: 13, padding: "12px 16px",
              }}>
                <p style={{
                  fontFamily: "'Outfit', sans-serif", fontSize: 10, fontWeight: 600,
                  textTransform: "uppercase", letterSpacing: "0.07em",
                  color: T.inkFaint, margin: "0 0 5px",
                }}>
                  {label}
                </p>
                <p style={{
                  fontFamily: "'Lora', serif", fontWeight: 700,
                  fontSize: "1.4rem", color, margin: 0,
                }}>
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
            {["all", "paid", "pending"].map((f) => (
              <button
                key={f}
                className="orp-chip"
                onClick={() => {setFilter(f),setpage(1)}}
                style={{
                  padding: "5px 16px", borderRadius: 20,
                  fontSize: 12, fontWeight: 600,
                  cursor: "pointer", flexShrink: 0, minHeight: 32,
                  fontFamily: "'Outfit', sans-serif", textTransform: "capitalize",
                  border: filter === f ? `1px solid ${T.tealBorder}` : `1px solid ${T.borderMid}`,
                  background: filter === f ? T.tealLight : "transparent",
                  color: filter === f ? T.teal : T.inkLight,
                  WebkitTapHighlightColor: "transparent",
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


<div className="ph-pagination">
              <button
                className="ph-page-btn"
                disabled={page === 1}
                onClick={() => setpage(page - 1)}
              >
                ← Prev
              </button>

              <span className="ph-page-indicator">
                Page {page} / {totalpages || 1}
              </span>

              <button
                className="ph-page-btn"
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