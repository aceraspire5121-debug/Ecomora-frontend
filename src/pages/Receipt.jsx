import React from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useState,useEffect } from "react";

const T = {
  cream: "#FAF8F5",
  parchment: "#F3EFE8",
  ink: "#1C1410",
  inkLight: "#6B5B4E",
  inkFaint: "#A0917F",
  accent: "#B8622A",
  border: "rgba(60,40,20,0.08)",
  borderMid: "rgba(60,40,20,0.12)",
  teal: "#0f766e",
  tealLight: "rgba(13,148,136,0.08)",
  tealBorder: "rgba(13,148,136,0.18)",
  shadow: "0 4px 32px -8px rgba(28,20,16,0.08)",
};

const OrderSuccess = () => {
  const {id}=useParams();
  const navigate = useNavigate();
  const [order, setorder] = useState({})
  const [loading, setloading] = useState(true)

  const fetchdata=async()=>{
    try {
      const token=localStorage.getItem("CommerceToken");
      if (!token) {
  alert("Please login again");
  return;
}
      const res=await fetch(`${import.meta.env.VITE_API_URL}/api/orders/${id}`,{
     method: "GET",
  headers: {
    Authorization: `Bearer ${token}`
  }
      });
      const result=await res.json();
      if(!res.ok)
      {
        console.log("order not found",result)
        alert("order not found");
        return;
      }
      console.log("success",result)
     setorder(result.order)
    } catch (error) {
      console.log(error)
    }
  }

 useEffect(() => {
    const fetchDataWrapper = async () => {
    await fetchdata();
    setloading(false);
  };
  fetchDataWrapper();
 }, [id])

 if (loading) return <p>Loading...</p>; // dekho jabtk data nhi aayega loading false hoga jiski bajah se yahi par return kar jayega aur loading ... dikhane lagega neeche ka code render hi nhi hoga return hone ki bajah se , jab setorder se state change hota hai data aane par tab re render hota hai aur tabtk loading false bhi ho gaya hota hai isliye poora render karta hai
 



  const subtotal = order.items.reduce((s, i) => s + i.price * i.quantity, 0);
  const shipping = 120;

  return (
    <div style={{ width: "min(680px, 98%)", margin: "0 auto" }}>
      <div style={{
        background: "#fff", borderRadius: 20,
        border: `1px solid ${T.border}`, boxShadow: T.shadow, overflow: "hidden",
      }}>

        {/* ── Success header ── */}
        <div style={{
          background: T.cream, padding: "36px 32px 28px",
          textAlign: "center", borderBottom: `1px solid rgba(60,40,20,0.07)`,
        }}>
          <div style={{
            width: 56, height: 56, borderRadius: "50%",
            background: "#F0FDF8", border: `1px solid rgba(13,148,136,0.2)`,
            display: "flex", alignItems: "center", justifyContent: "center",
            margin: "0 auto 16px",
          }}>
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none"
              stroke="#0f766e" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M20 6L9 17l-5-5" />
            </svg>
          </div>

          <h1 style={{
            fontFamily: "'Cormorant Garamond', serif", fontWeight: 700,
            fontSize: "1.9rem", color: T.ink, marginBottom: 6,
          }}>
            Order placed!
          </h1>
          <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 13, color: T.inkFaint }}>
            Your payment was successful. We'll get this shipped soon.
          </p>
          <div style={{ display: "flex", justifyContent: "center", marginTop: 14 }}>
            <span style={{
              display: "inline-flex", alignItems: "center", gap: 5,
              padding: "4px 12px", borderRadius: 20,
              fontSize: 11, fontWeight: 600, fontFamily: "'DM Sans', sans-serif",
              background: "#F0FDF8", color: "#0a6057", border: `1px solid rgba(13,148,136,0.2)`,
            }}>
              <span style={{ width: 5, height: 5, borderRadius: "50%", background: T.teal }} />
              Payment confirmed
            </span>
          </div>
        </div>

        {/* ── Order meta grid ── */}
        <div style={{ padding: "24px 32px 0" }}>
          <div style={{
            display: "grid", gridTemplateColumns: "1fr 1fr",
            gap: 1, background: "rgba(60,40,20,0.07)",
            border: `1px solid rgba(60,40,20,0.07)`,
            borderRadius: 12, overflow: "hidden", marginBottom: 20,
          }}>
            {[
              { label: "Order ID",    val: order.orderId, mono: true },
              { label: "Placed on",   val: new Date(order.createdAt).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" }) },
              { label: "Payment ID",  val: order.paymentId, mono: true },
              { label: "Status",      val: "Paid", highlight: true },
            ].map(({ label, val, mono, highlight }) => (
              <div key={label} style={{ background: T.cream, padding: "13px 16px" }}>
                <p style={{
                  fontFamily: "'DM Sans', sans-serif", fontSize: 10.5, fontWeight: 600,
                  textTransform: "uppercase", letterSpacing: "0.08em",
                  color: T.inkFaint, marginBottom: 4,
                }}>
                  {label}
                </p>
                <p style={{
                  fontFamily: mono ? "'DM Sans', sans-serif" : "'Cormorant Garamond', serif",
                  fontWeight: 700,
                  fontSize: mono ? 12 : "1.05rem",
                  color: highlight ? T.teal : mono ? T.inkLight : T.ink,
                }}>
                  {val}
                </p>
              </div>
            ))}
          </div>

          {/* ── Items ── */}
          <p style={{
            fontFamily: "'DM Sans', sans-serif", fontSize: 10.5, fontWeight: 600,
            textTransform: "uppercase", letterSpacing: "0.1em",
            color: T.inkFaint, marginBottom: 12,
          }}>
            Items ordered
          </p>

          {order.items.map((item, idx) => (
            <div key={item.product} style={{
              display: "flex", alignItems: "center", gap: 12,
              padding: "10px 0",
              borderBottom: idx < order.items.length - 1
                ? `1px solid rgba(60,40,20,0.06)` : "none",
            }}>
              <div style={{
                width: 46, height: 46, borderRadius: 8, flexShrink: 0,
                background: `linear-gradient(145deg, #F8F5F0, ${T.parchment})`,
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

          {/* ── Totals ── */}
          <div style={{ height: 1, background: "rgba(60,40,20,0.07)", margin: "16px 0" }} />
          {[
            { label: "Subtotal", val: `₹${subtotal.toLocaleString("en-IN")}` },
            { label: "Shipping", val: `₹${shipping}` },
            { label: "Discount", val: "−₹0", green: true },
          ].map(({ label, val, green }) => (
            <div key={label} style={{ display: "flex", justifyContent: "space-between", padding: "4px 0" }}>
              <span style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 13, color: T.inkFaint }}>{label}</span>
              <span style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 13, fontWeight: 600, color: green ? "#2A7A4B" : T.inkLight }}>{val}</span>
            </div>
          ))}
          <div style={{ height: 1, background: "rgba(60,40,20,0.07)", margin: "16px 0" }} />
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "6px 0" }}>
            <span style={{ fontFamily: "'Cormorant Garamond', serif", fontWeight: 700, fontSize: "1.1rem", color: T.ink }}>Total paid</span>
            <span style={{ fontFamily: "'Cormorant Garamond', serif", fontWeight: 700, fontSize: "1.5rem", color: T.ink }}>
              ₹{(subtotal + shipping).toLocaleString("en-IN")}
            </span>
          </div>
        </div>

        {/* ── Actions ── */}
        <div style={{ padding: "20px 32px 28px", display: "flex", gap: 10 }}>
          <button
            onClick={() => navigate("/user/products")}
            style={{
              flex: 1, height: 42, borderRadius: 10,
              background: "transparent", border: `1px solid ${T.borderMid}`,
              color: T.inkLight, fontFamily: "'DM Sans', sans-serif",
              fontSize: 13, fontWeight: 600, cursor: "pointer", transition: "all 0.15s",
            }}
            onMouseEnter={e => { e.target.style.borderColor = T.tealBorder; e.target.style.background = T.tealLight; e.target.style.color = T.teal; }}
            onMouseLeave={e => { e.target.style.borderColor = T.borderMid; e.target.style.background = "transparent"; e.target.style.color = T.inkLight; }}
          >
            Browse products
          </button>
          <button
            onClick={() => navigate("/user/orders")}
            style={{
              flex: 1, height: 42, borderRadius: 10,
              background: T.ink, border: "none",
              color: T.cream, fontFamily: "'DM Sans', sans-serif",
              fontSize: 13, fontWeight: 600, cursor: "pointer", transition: "all 0.18s",
            }}
            onMouseEnter={e => { e.target.style.background = T.accent; e.target.style.boxShadow = "0 4px 16px rgba(184,98,42,0.28)"; }}
            onMouseLeave={e => { e.target.style.background = T.ink; e.target.style.boxShadow = "none"; }}
          >
            View all orders →
          </button>
        </div>
      </div>
    </div>
  );
};

export default OrderSuccess;