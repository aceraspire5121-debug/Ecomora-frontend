import React from "react";
import { useState, useEffect, useRef } from "react";
import { Snackbar, Alert } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import RemoveIcon from "@mui/icons-material/Remove";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import { useNavigate } from "react-router-dom";

const CartCont = () => {
  const [cartItems, setcartItems] = useState([]);
  const [open, setopen] = useState(false);
  const [msg, setmsg] = useState("");
  const [severity, setseverity] = useState("");
  const requestId = useRef(0);
  const oldcart = useRef([]);
  const navigate = useNavigate();

  const showSnackbar = (message, type = "success") => {
    setmsg(message);
    setseverity(type);
    setopen(true);
  };

  const fetchCart = async () => {
    const token = localStorage.getItem("CommerceToken");
    const res = await fetch(`${import.meta.env.VITE_API_URL}/api/cart/products`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    const data = await res.json();
    setcartItems(data.cart.items);
    oldcart.current = structuredClone(data.cart.items);
  };

  useEffect(() => { fetchCart(); }, []);

  const manageQuantity = async (item, manage) => {
    const currentRequest = ++requestId.current;
    setcartItems(prev =>
      prev.map(i =>
        i.product._id === item.product._id
          ? { ...i, quantity: manage ? i.quantity + 1 : i.quantity - 1 }
          : i
      ).filter(i => i.quantity > 0)
    );
    try {
      const token = localStorage.getItem("CommerceToken");
      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/cart/${item.product._id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({ manage }),
      });
      const data = await res.json();
      if (res.ok) console.log("Quantity Updated", data);
      else console.error(data.message);
    } catch (err) {
      if (currentRequest === requestId.current) {
        showSnackbar("Failed to update", "error");
        try { await fetchCart(); }
        catch (err) {
          if (currentRequest === requestId.current) setcartItems(oldcart.current);
        }
      }
      console.error("Error:", err);
    }
  };

  const deleteFromCart = async (item) => {
    try {
      const token = localStorage.getItem("CommerceToken");
      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/cart/${item.product._id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (res.ok) showSnackbar("Removed from cart", "success");
      else console.error(data.message);
      setcartItems(data.cart.items);
      oldcart.current = structuredClone(data.cart.items);
    } catch (err) { console.error("Error:", err); }
  };

  const paymentHandle = async () => {
    try {
      const token = localStorage.getItem("CommerceToken");
      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/payments/create`, {
        method: "POST",
        headers: { "content-type": "application/json", Authorization: `Bearer ${token}` },
      });
      const result = await res.json();
      if (!res.ok) alert(result.message);

      const options = {
        key: "rzp_test_Seeukkl8eo0TXu",
        amount: result.amount,
        currency: result.currency,
        name: "Ecomora",
        description: "Test Transaction",
        order_id: result.order_id,
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
            await fetchCart();
            setTimeout(() => navigate(`/users/receipt/${result.order._id}`), 2000);
          } catch (error) { alert("Something went wrong"); }
        },
      };
      const rzp = new window.Razorpay(options);
      rzp.open();
    } catch (err) { console.log(err); }
  };

  const subtotal = cartItems.reduce((acc, item) => acc + item.product.price * item.quantity, 0);
  const shipping = cartItems.length > 0 ? 120 : 0;
  const total = subtotal + shipping;

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Outfit:wght@400;500;600;700;800&family=Lora:wght@600;700&display=swap');

        .cc-wrap {
          min-height: 100%;
          padding: 32px 16px 48px;
          background: linear-gradient(160deg, rgba(240,253,250,0.5) 0%, #f8fafc 50%);
        }

        .cc-inner { width: min(1100px, 100%); margin: 0 auto; }

        .cc-page-title {
          font-family: 'Lora', serif;
          font-weight: 700;
          font-size: 1.9rem;
          color: #0f172a;
          letter-spacing: -0.03em;
          margin: 0 0 4px;
        }
        .cc-page-sub {
          font-family: 'Outfit', sans-serif;
          font-size: 0.825rem;
          color: #94a3b8;
          margin: 0 0 28px;
        }

        .cc-layout {
          display: flex;
          flex-direction: column;
          gap: 20px;
          align-items: flex-start;
        }
        @media (min-width: 1024px) {
          .cc-layout { flex-direction: row; }
          .cc-items-col { flex: 1.65; }
          .cc-summary-col { flex: 1; position: sticky; top: 24px; }
        }
        .cc-items-col, .cc-summary-col { width: 100%; }

        /* ── Item card ── */
        .cc-item-card {
          background: #ffffff;
          border: 1px solid rgba(226,232,240,0.9);
          border-radius: 18px;
          padding: 16px;
          margin-bottom: 12px;
          box-shadow: 0 2px 12px -4px rgba(15,23,42,0.06);
          transition: border-color 0.2s, box-shadow 0.2s, transform 0.25s cubic-bezier(0.34,1.56,0.64,1);
        }
        .cc-item-card:hover {
          border-color: rgba(13,148,136,0.25);
          box-shadow: 0 10px 32px -12px rgba(13,148,136,0.2);
          transform: translateY(-2px);
        }
        .cc-item-inner { display: flex; gap: 16px; }

        .cc-item-img {
          width: 90px;
          height: 90px;
          border-radius: 13px;
          object-fit: contain;
          border: 1px solid rgba(226,232,240,0.8);
          background: linear-gradient(145deg, #f8fafa, #f0fdfa);
          padding: 6px;
          flex-shrink: 0;
        }

        .cc-item-body { flex: 1; min-width: 0; display: flex; flex-direction: column; }

        .cc-item-name {
          font-family: 'Lora', serif;
          font-weight: 600;
          font-size: 0.95rem;
          color: #0f172a;
          line-height: 1.3;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
          margin: 0 0 2px;
        }
        .cc-item-cat {
          font-family: 'Outfit', sans-serif;
          font-size: 0.72rem;
          font-weight: 600;
          color: #0d9488;
          letter-spacing: 0.08em;
          text-transform: uppercase;
          margin: 0 0 12px;
        }

        .cc-item-footer {
          display: flex;
          align-items: center;
          justify-content: space-between;
          flex-wrap: wrap;
          gap: 10px;
          margin-top: auto;
        }

        /* qty stepper */
        .cc-qty-wrap {
          display: inline-flex;
          align-items: center;
          gap: 2px;
          background: #f8fafc;
          border: 1px solid rgba(226,232,240,0.9);
          border-radius: 12px;
          padding: 3px;
        }
        .cc-qty-btn {
          width: 30px; height: 30px;
          border-radius: 9px;
          border: none;
          background: transparent;
          color: #475569;
          cursor: pointer;
          display: flex; align-items: center; justify-content: center;
          transition: background 0.15s, color 0.15s;
          font-size: 16px;
        }
        .cc-qty-btn:hover { background: #fff; color: #0d9488; }
        .cc-qty-val {
          font-family: 'Outfit', sans-serif;
          font-weight: 700;
          font-size: 0.875rem;
          color: #0f172a;
          min-width: 28px;
          text-align: center;
        }

        .cc-item-right { display: flex; align-items: center; gap: 12px; }
        .cc-item-price {
          font-family: 'Lora', serif;
          font-weight: 700;
          font-size: 1.1rem;
          color: #0f172a;
          letter-spacing: -0.02em;
        }
        .cc-delete-btn {
          width: 32px; height: 32px;
          border-radius: 9px;
          border: 1px solid rgba(254,202,202,0.8);
          background: rgba(254,226,226,0.4);
          color: #ef4444;
          cursor: pointer;
          display: flex; align-items: center; justify-content: center;
          transition: all 0.18s;
          flex-shrink: 0;
        }
        .cc-delete-btn:hover {
          background: #ef4444;
          border-color: #ef4444;
          color: #fff;
          box-shadow: 0 4px 12px -4px rgba(239,68,68,0.45);
        }

        /* ── Summary card ── */
        .cc-summary {
          background: #ffffff;
          border: 1px solid rgba(226,232,240,0.9);
          border-radius: 20px;
          padding: 22px 22px 20px;
          box-shadow: 0 4px 24px -8px rgba(13,148,136,0.12);
        }
        .cc-summary-title {
          font-family: 'Lora', serif;
          font-weight: 700;
          font-size: 1.2rem;
          color: #0f172a;
          letter-spacing: -0.02em;
          margin: 0 0 18px;
        }
        .cc-summary-row {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 11px;
        }
        .cc-summary-label {
          font-family: 'Outfit', sans-serif;
          font-size: 0.825rem;
          color: #64748b;
        }
        .cc-summary-val {
          font-family: 'Outfit', sans-serif;
          font-size: 0.825rem;
          font-weight: 700;
          color: #0f172a;
        }
        .cc-summary-val.green { color: #059669; }

        .cc-divider {
          height: 1px;
          background: rgba(226,232,240,0.8);
          margin: 14px 0;
        }

        .cc-total-row {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 18px;
        }
        .cc-total-label {
          font-family: 'Outfit', sans-serif;
          font-weight: 700;
          font-size: 0.925rem;
          color: #0f172a;
        }
        .cc-total-val {
          font-family: 'Lora', serif;
          font-weight: 700;
          font-size: 1.35rem;
          color: #0f172a;
          letter-spacing: -0.02em;
        }

        /* coupon input */
        .cc-coupon-wrap {
          position: relative;
          margin-bottom: 14px;
        }
        .cc-coupon {
          width: 100%;
          border-radius: 13px;
          border: 1px solid rgba(226,232,240,0.9);
          background: #f8fafc;
          padding: 10px 14px;
          font-family: 'Outfit', sans-serif;
          font-size: 0.825rem;
          color: #334155;
          outline: none;
          box-sizing: border-box;
          transition: border-color 0.18s, box-shadow 0.18s;
        }
        .cc-coupon::placeholder { color: #cbd5e1; }
        .cc-coupon:focus {
          border-color: rgba(13,148,136,0.4);
          box-shadow: 0 0 0 3px rgba(13,148,136,0.1);
          background: #fff;
        }

        /* checkout btn */
        .cc-checkout-btn {
          width: 100%;
          padding: 13px 0;
          border-radius: 14px;
          border: none;
          background: linear-gradient(135deg, #0f766e 0%, #0d9488 60%, #14b8a6 100%);
          color: #fff;
          font-family: 'Outfit', sans-serif;
          font-weight: 700;
          font-size: 0.9rem;
          letter-spacing: 0.02em;
          cursor: pointer;
          box-shadow: 0 4px 18px -4px rgba(13,148,136,0.45);
          transition: all 0.22s cubic-bezier(0.4,0,0.2,1);
          margin-bottom: 10px;
        }
        .cc-checkout-btn:hover {
          transform: translateY(-2px);
          box-shadow: 0 8px 28px -6px rgba(13,148,136,0.55);
        }
        .cc-checkout-btn:active { transform: translateY(0); }

        .cc-continue-btn {
          width: 100%;
          padding: 11px 0;
          border-radius: 14px;
          border: 1px solid rgba(226,232,240,0.9);
          background: transparent;
          color: #64748b;
          font-family: 'Outfit', sans-serif;
          font-weight: 600;
          font-size: 0.85rem;
          cursor: pointer;
          transition: all 0.18s;
        }
        .cc-continue-btn:hover {
          background: #f8fafc;
          border-color: rgba(13,148,136,0.25);
          color: #0d9488;
        }
          
        .cc-checkout-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.cc-checkout-btn:disabled {
  background: #999;
  color: #ddd;
  cursor: not-allowed;
  opacity: 0.6;
}

        /* trust badges */
        .cc-trust {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 14px;
          margin-top: 14px;
          flex-wrap: wrap;
        }
        .cc-trust-item {
          display: flex;
          align-items: center;
          gap: 4px;
          font-family: 'Outfit', sans-serif;
          font-size: 10.5px;
          color: #94a3b8;
          font-weight: 500;
        }
      `}</style>

      <div className="cc-wrap">
        <div className="cc-inner">
          {/* Page heading */}
          <p className="cc-page-title">My Cart</p>
          <p className="cc-page-sub">Review your selected items and place your order.</p>

          <div className="cc-layout">
            {/* ── Items column ── */}
            <div className="cc-items-col">
              {cartItems.map((item) => (
                <div key={item.product._id} className="cc-item-card">
                  <div className="cc-item-inner">
                    <img
                      src={item.product.images?.[0]?.url || "https://via.placeholder.com/150"}
                      alt={item.product.name}
                      className="cc-item-img"
                    />
                    <div className="cc-item-body">
                      <h3 className="cc-item-name">{item.product.name}</h3>
                      <p className="cc-item-cat">{item.product.category}</p>
                      <div className="cc-item-footer">
                        {/* Qty stepper */}
                        <div className="cc-qty-wrap">
                          <button className="cc-qty-btn" onClick={() => manageQuantity(item, false)}>
                            <RemoveIcon sx={{ fontSize: 14 }} />
                          </button>
                          <span className="cc-qty-val">{item.quantity}</span>
                          <button className="cc-qty-btn" onClick={() => manageQuantity(item, true)}>
                            <AddIcon sx={{ fontSize: 14 }} />
                          </button>
                        </div>

                        <div className="cc-item-right">
                          <span className="cc-item-price">
                            ₹{(item.product.price * item.quantity).toLocaleString("en-IN")}
                          </span>
                          <button className="cc-delete-btn" onClick={() => deleteFromCart(item)}>
                            <DeleteOutlineIcon sx={{ fontSize: 16 }} />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}

              {cartItems.length === 0 && (
                <div style={{
                  textAlign: "center", padding: "60px 20px",
                  background: "#fff", borderRadius: 18,
                  border: "1px dashed rgba(226,232,240,0.9)",
                }}>
                  <p style={{ fontFamily: "'Lora',serif", fontSize: "1.2rem", color: "#94a3b8", margin: "0 0 6px" }}>
                    Your cart is empty
                  </p>
                  <p style={{ fontFamily: "'Outfit',sans-serif", fontSize: "0.8rem", color: "#cbd5e1", margin: 0 }}>
                    Add some products to get started
                  </p>
                </div>
              )}
            </div>

            {/* ── Summary column ── */}
            <div className="cc-summary-col">
              <div className="cc-summary">
                <p className="cc-summary-title">Order Summary</p>

                <div className="cc-summary-row">
                  <span className="cc-summary-label">Subtotal ({cartItems.length} items)</span>
                  <span className="cc-summary-val">₹{subtotal.toLocaleString("en-IN")}</span>
                </div>
                <div className="cc-summary-row">
                  <span className="cc-summary-label">Shipping</span>
                  <span className="cc-summary-val">₹{shipping}</span>
                </div>
                <div className="cc-summary-row">
                  <span className="cc-summary-label">Discount</span>
                  <span className="cc-summary-val green">−₹0</span>
                </div>

                <div className="cc-divider" />

                <div className="cc-total-row">
                  <span className="cc-total-label">Total</span>
                  <span className="cc-total-val">₹{total.toLocaleString("en-IN")}</span>
                </div>

                <div className="cc-coupon-wrap">
                  <input type="text" placeholder="Coupon code" className="cc-coupon" />
                </div>

                <button className="cc-checkout-btn" onClick={paymentHandle} disabled={cartItems.length===0} >
                  Checkout →
                </button>
                <button className="cc-continue-btn" onClick={() => navigate("/user/products")}>
                  Continue Shopping
                </button>

                {/* Trust badges */}
                <div className="cc-trust">
                  {[
                    { icon: "🔒", text: "Secure checkout" },
                    { icon: "↩", text: "Easy returns" },
                    { icon: "🚚", text: "Fast delivery" },
                  ].map(({ icon, text }) => (
                    <span key={text} className="cc-trust-item">
                      {icon}&nbsp;{text}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        <Snackbar
          open={open}
          autoHideDuration={2000}
          onClose={() => setopen(false)}
          anchorOrigin={{ vertical: "top", horizontal: "right" }}
        >
          <Alert severity={severity} variant="filled" onClose={() => setopen(false)}>
            {msg}
          </Alert>
        </Snackbar>
      </div>
    </>
  );
};

export default CartCont;


///////////

// import React from "react";
// import { useState, useEffect, useRef } from "react";
// import {
//   Box,
//   Button,
//   Paper,
//   Stack,
//   TextField,
//   Typography,
//   Divider,
//   IconButton,
//   Snackbar,
//   Alert,
//   Chip,
// } from "@mui/material";
// import AddIcon from "@mui/icons-material/Add";
// import RemoveIcon from "@mui/icons-material/Remove";
// import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
// import LocalShippingOutlinedIcon from "@mui/icons-material/LocalShippingOutlined";
// import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
// import ArrowForwardIcon from "@mui/icons-material/ArrowForward";

// // ─── font injection ────────────────────────────────────────────────────────────
// const fontLink = document.createElement("link");
// fontLink.rel = "stylesheet";
// fontLink.href =
//   "https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@400;500;600;700&family=DM+Sans:wght@300;400;500;600&display=swap";
// document.head.appendChild(fontLink);

// // ─── theme tokens ──────────────────────────────────────────────────────────────
// const T = {
//   cream: "#FAF8F5",
//   parchment: "#F3EFE8",
//   border: "rgba(60,40,20,0.10)",
//   borderStrong: "rgba(60,40,20,0.18)",
//   ink: "#1C1410",
//   inkLight: "#6B5B4E",
//   inkFaint: "#A0917F",
//   accent: "#B8622A",
//   accentLight: "rgba(184,98,42,0.08)",
//   accentDark: "#8E4A1C",
//   green: "#2A7A4B",
//   red: "#C0392B",
//   redLight: "rgba(192,57,43,0.08)",
//   shadow: "0 2px 24px rgba(28,20,16,0.07)",
//   shadowHover: "0 8px 40px rgba(28,20,16,0.12)",
// };

// // ─── styled helpers ────────────────────────────────────────────────────────────
// const cardSx = {
//   p: 0,
//   borderRadius: "12px",
//   border: `1px solid ${T.border}`,
//   boxShadow: T.shadow,
//   bgcolor: "#fff",
//   overflow: "hidden",
//   transition: "box-shadow 0.25s ease, border-color 0.25s ease",
//   "&:hover": {
//     boxShadow: T.shadowHover,
//     borderColor: T.borderStrong,
//   },
// };

// const qtyBtnSx = {
//   width: 30,
//   height: 30,
//   borderRadius: "8px",
//   border: `1px solid ${T.border}`,
//   bgcolor: T.parchment,
//   color: T.ink,
//   transition: "all 0.15s ease",
//   "&:hover": {
//     bgcolor: T.ink,
//     color: "#fff",
//     borderColor: T.ink,
//   },
// };

// const CartCont = () => {
//   const [cartItems, setcartItems] = useState([]);
//   const [open, setopen] = useState(false);
//   const [open2, setopen2] = useState(false);
//   const requestId = useRef(0);
//   const oldcart = useRef([]);

//   const fetchCart = async () => {
//     const token = localStorage.getItem("CommerceToken");
//     const res = await fetch(
//       `${import.meta.env.VITE_API_URL}/api/cart/products`,
//       { headers: { Authorization: `Bearer ${token}` } }
//     );
//     const data = await res.json();
//     setcartItems(data.cart.items);
//     oldcart.current = structuredClone(data.cart.items);
//   };

//   useEffect(() => {
//     fetchCart();
//   }, []);

//   const manageQuantity = async (item, manage) => {
//     const currentRequest = ++requestId.current;
//     setcartItems((prev) =>
//       prev
//         .map((i) =>
//           i.product._id === item.product._id
//             ? { ...i, quantity: manage ? i.quantity + 1 : i.quantity - 1 }
//             : i
//         )
//         .filter((i) => i.quantity > 0)
//     );
//     try {
//       const token = localStorage.getItem("CommerceToken");
//       const res = await fetch(
//         `${import.meta.env.VITE_API_URL}/api/cart/${item.product._id}`,
//         {
//           method: "PUT",
//           headers: {
//             "Content-Type": "application/json",
//             Authorization: `Bearer ${token}`,
//           },
//           body: JSON.stringify({ manage }),
//         }
//       );
//       const data = await res.json();
//       if (res.ok) {
//         console.log("Quantity Updated", data);
//       } else {
//         console.error(data.message);
//       }
//     } catch (err) {
//       if (currentRequest === requestId.current) {
//         setopen2(true);
//         try {
//           await fetchCart();
//         } catch (err) {
//           if (currentRequest === requestId.current)
//             setcartItems(oldcart.current);
//           console.log(err);
//         }
//       }
//       console.error("Error:", err);
//     }
//   };

//   const deleteFromCart = async (item) => {
//     try {
//       const token = localStorage.getItem("CommerceToken");
//       const res = await fetch(
//         `${import.meta.env.VITE_API_URL}/api/cart/${item.product._id}`,
//         {
//           method: "DELETE",
//           headers: { Authorization: `Bearer ${token}` },
//         }
//       );
//       const data = await res.json();
//       if (res.ok) {
//         console.log(data.message);
//         setopen(true);
//       } else {
//         console.error(data.message);
//       }
//       setcartItems(data.cart.items);
//     } catch (err) {
//       console.error("Error:", err);
//     }
//   };

//   const subtotal = cartItems.reduce(
//     (acc, item) => acc + item.product.price * item.quantity,
//     0
//   );
//   const shipping = cartItems.length > 0 ? 120 : 0;
//   const total = subtotal + shipping;

//   return (
//     <Box
//       sx={{
//         minHeight: "100%",
//         py: { xs: 4, md: 6 },
//         px: { xs: 2, md: 3 },
//         bgcolor: T.cream,
//         fontFamily: "'DM Sans', sans-serif",
//       }}
//     >
//       <Box sx={{ width: "min(1140px, 100%)", mx: "auto" }}>
//         {/* ── Header ── */}
//         <Box sx={{ mb: 5 }}>
//           <Stack direction="row" alignItems="baseline" spacing={2} sx={{ mb: 0.5 }}>
//             <Typography
//               sx={{
//                 fontFamily: "'Cormorant Garamond', serif",
//                 fontWeight: 700,
//                 fontSize: { xs: "2rem", md: "2.75rem" },
//                 letterSpacing: "-0.01em",
//                 color: T.ink,
//                 lineHeight: 1,
//               }}
//             >
//               Shopping Cart
//             </Typography>
//             {cartItems.length > 0 && (
//               <Chip
//                 label={`${cartItems.length} item${cartItems.length > 1 ? "s" : ""}`}
//                 size="small"
//                 sx={{
//                   bgcolor: T.accentLight,
//                   color: T.accent,
//                   fontWeight: 600,
//                   fontSize: "0.7rem",
//                   height: 22,
//                   border: `1px solid rgba(184,98,42,0.2)`,
//                   fontFamily: "'DM Sans', sans-serif",
//                 }}
//               />
//             )}
//           </Stack>
//           <Box
//             sx={{
//               width: 48,
//               height: 2,
//               bgcolor: T.accent,
//               mt: 1.5,
//               borderRadius: 1,
//             }}
//           />
//         </Box>

//         <Stack
//           direction={{ xs: "column", lg: "row" }}
//           spacing={3}
//           alignItems="flex-start"
//         >
//           {/* ── Left: Cart Items ── */}
//           <Stack spacing={2} sx={{ flex: 1.65 }}>
//             {cartItems.length === 0 && (
//               <Box
//                 sx={{
//                   textAlign: "center",
//                   py: 10,
//                   border: `1.5px dashed ${T.border}`,
//                   borderRadius: "12px",
//                 }}
//               >
//                 <Typography
//                   sx={{
//                     fontFamily: "'Cormorant Garamond', serif",
//                     fontSize: "1.5rem",
//                     color: T.inkFaint,
//                     mb: 1,
//                   }}
//                 >
//                   Your cart is empty
//                 </Typography>
//                 <Typography
//                   sx={{ fontSize: "0.85rem", color: T.inkFaint }}
//                 >
//                   Add items to get started
//                 </Typography>
//               </Box>
//             )}

//             {cartItems.map((item, idx) => (
//               <Paper key={item.product._id} elevation={0} sx={cardSx}>
//                 <Stack direction="row" spacing={0}>
//                   {/* Image block */}
//                   <Box
//                     sx={{
//                       width: { xs: 110, sm: 130 },
//                       flexShrink: 0,
//                       bgcolor: T.parchment,
//                       display: "flex",
//                       alignItems: "center",
//                       justifyContent: "center",
//                       p: 2,
//                     }}
//                   >
//                     <Box
//                       component="img"
//                       src={
//                         item.product.images?.[0]?.url ||
//                         "https://via.placeholder.com/150"
//                       }
//                       alt={item.product.name}
//                       sx={{
//                         width: "100%",
//                         maxWidth: 90,
//                         height: 90,
//                         objectFit: "contain",
//                       }}
//                     />
//                   </Box>

//                   {/* Content block */}
//                   <Box
//                     sx={{
//                       flex: 1,
//                       p: { xs: 2, sm: 2.5 },
//                       display: "flex",
//                       flexDirection: "column",
//                       justifyContent: "space-between",
//                       minWidth: 0,
//                     }}
//                   >
//                     {/* Top row */}
//                     <Stack
//                       direction="row"
//                       justifyContent="space-between"
//                       alignItems="flex-start"
//                     >
//                       <Box sx={{ flex: 1, minWidth: 0, pr: 1 }}>
//                         <Typography
//                           sx={{
//                             fontFamily: "'Cormorant Garamond', serif",
//                             fontWeight: 600,
//                             fontSize: { xs: "1rem", sm: "1.15rem" },
//                             color: T.ink,
//                             lineHeight: 1.25,
//                             mb: 0.4,
//                           }}
//                         >
//                           {item.product.name}
//                         </Typography>
//                         <Typography
//                           sx={{
//                             fontSize: "0.75rem",
//                             color: T.inkFaint,
//                             textTransform: "uppercase",
//                             letterSpacing: "0.08em",
//                             fontWeight: 500,
//                           }}
//                         >
//                           {item.product.category}
//                         </Typography>
//                       </Box>

//                       {/* Delete */}
//                       <IconButton
//                         size="small"
//                         onClick={() => deleteFromCart(item)}
//                         sx={{
//                           color: T.inkFaint,
//                           width: 30,
//                           height: 30,
//                           transition: "all 0.15s ease",
//                           "&:hover": {
//                             color: T.red,
//                             bgcolor: T.redLight,
//                           },
//                         }}
//                       >
//                         <DeleteOutlineIcon sx={{ fontSize: 17 }} />
//                       </IconButton>
//                     </Stack>

//                     {/* Bottom row */}
//                     <Stack
//                       direction="row"
//                       justifyContent="space-between"
//                       alignItems="center"
//                       sx={{ mt: 2 }}
//                     >
//                       {/* Qty control */}
//                       <Stack direction="row" alignItems="center" spacing={0.5}>
//                         <IconButton
//                           size="small"
//                           sx={qtyBtnSx}
//                           onClick={() => manageQuantity(item, false)}
//                         >
//                           <RemoveIcon sx={{ fontSize: 13 }} />
//                         </IconButton>

//                         <Box
//                           sx={{
//                             width: 36,
//                             textAlign: "center",
//                             fontWeight: 700,
//                             fontSize: "0.9rem",
//                             color: T.ink,
//                             fontFamily: "'DM Sans', sans-serif",
//                           }}
//                         >
//                           {item.quantity}
//                         </Box>

//                         <IconButton
//                           size="small"
//                           sx={qtyBtnSx}
//                           onClick={() => manageQuantity(item, true)}
//                         >
//                           <AddIcon sx={{ fontSize: 13 }} />
//                         </IconButton>
//                       </Stack>

//                       {/* Price */}
//                       <Stack direction="row" alignItems="baseline" spacing={0.5}>
//                         {item.quantity > 1 && (
//                           <Typography
//                             sx={{
//                               fontSize: "0.73rem",
//                               color: T.inkFaint,
//                               fontFamily: "'DM Sans', sans-serif",
//                             }}
//                           >
//                             ₹{item.product.price} ×{item.quantity}
//                           </Typography>
//                         )}
//                         <Typography
//                           sx={{
//                             fontFamily: "'Cormorant Garamond', serif",
//                             fontWeight: 700,
//                             fontSize: "1.2rem",
//                             color: T.ink,
//                           }}
//                         >
//                           ₹{item.product.price * item.quantity}
//                         </Typography>
//                       </Stack>
//                     </Stack>
//                   </Box>
//                 </Stack>
//               </Paper>
//             ))}
//           </Stack>

//           {/* ── Right: Summary ── */}
//           <Paper
//             elevation={0}
//             sx={{
//               ...cardSx,
//               flex: 1,
//               width: { xs: "100%", lg: "auto" },
//               position: { lg: "sticky" },
//               top: 24,
//               p: 3,
//               "&:hover": undefined, // disable card hover on summary
//               boxShadow: T.shadow,
//               border: `1px solid ${T.border}`,
//             }}
//           >
//             <Typography
//               sx={{
//                 fontFamily: "'Cormorant Garamond', serif",
//                 fontWeight: 700,
//                 fontSize: "1.45rem",
//                 color: T.ink,
//                 mb: 2.5,
//               }}
//             >
//               Order Summary
//             </Typography>

//             {/* Line items */}
//             <Stack spacing={1.5}>
//               {[
//                 { label: "Subtotal", value: `₹${subtotal}` },
//                 { label: "Shipping", value: cartItems.length > 0 ? "₹120" : "₹0" },
//               ].map(({ label, value }) => (
//                 <Stack
//                   key={label}
//                   direction="row"
//                   justifyContent="space-between"
//                   alignItems="center"
//                 >
//                   <Typography
//                     sx={{
//                       fontSize: "0.85rem",
//                       color: T.inkLight,
//                       fontFamily: "'DM Sans', sans-serif",
//                     }}
//                   >
//                     {label}
//                   </Typography>
//                   <Typography
//                     sx={{
//                       fontSize: "0.85rem",
//                       fontWeight: 600,
//                       color: T.ink,
//                       fontFamily: "'DM Sans', sans-serif",
//                     }}
//                   >
//                     {value}
//                   </Typography>
//                 </Stack>
//               ))}

//               <Stack direction="row" justifyContent="space-between" alignItems="center">
//                 <Typography
//                   sx={{
//                     fontSize: "0.85rem",
//                     color: T.inkLight,
//                     fontFamily: "'DM Sans', sans-serif",
//                   }}
//                 >
//                   Discount
//                 </Typography>
//                 <Typography
//                   sx={{
//                     fontSize: "0.85rem",
//                     fontWeight: 600,
//                     color: T.green,
//                     fontFamily: "'DM Sans', sans-serif",
//                   }}
//                 >
//                   −₹0
//                 </Typography>
//               </Stack>
//             </Stack>

//             <Box
//               sx={{
//                 my: 2.5,
//                 height: 1,
//                 bgcolor: T.border,
//               }}
//             />

//             {/* Total */}
//             <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 3 }}>
//               <Typography
//                 sx={{
//                   fontFamily: "'Cormorant Garamond', serif",
//                   fontWeight: 700,
//                   fontSize: "1.1rem",
//                   color: T.ink,
//                 }}
//               >
//                 Total
//               </Typography>
//               <Typography
//                 sx={{
//                   fontFamily: "'Cormorant Garamond', serif",
//                   fontWeight: 700,
//                   fontSize: "1.5rem",
//                   color: T.ink,
//                 }}
//               >
//                 ₹{total}
//               </Typography>
//             </Stack>

//             {/* Coupon */}
//             <Stack direction="row" spacing={1} sx={{ mb: 2.5 }}>
//               <TextField
//                 size="small"
//                 fullWidth
//                 placeholder="Coupon code"
//                 sx={{
//                   "& .MuiOutlinedInput-root": {
//                     borderRadius: "8px",
//                     fontSize: "0.82rem",
//                     fontFamily: "'DM Sans', sans-serif",
//                     bgcolor: T.parchment,
//                     "& fieldset": { borderColor: T.border },
//                     "&:hover fieldset": { borderColor: T.borderStrong },
//                     "&.Mui-focused fieldset": { borderColor: T.accent },
//                   },
//                   "& input::placeholder": { color: T.inkFaint },
//                 }}
//               />
//               <Button
//                 variant="outlined"
//                 sx={{
//                   px: 2,
//                   flexShrink: 0,
//                   borderRadius: "8px",
//                   borderColor: T.border,
//                   color: T.inkLight,
//                   fontSize: "0.78rem",
//                   fontWeight: 600,
//                   fontFamily: "'DM Sans', sans-serif",
//                   whiteSpace: "nowrap",
//                   "&:hover": {
//                     borderColor: T.ink,
//                     bgcolor: "transparent",
//                     color: T.ink,
//                   },
//                 }}
//               >
//                 Apply
//               </Button>
//             </Stack>

//             {/* Checkout button */}
//             <Button
//               fullWidth
//               variant="contained"
//               endIcon={<ArrowForwardIcon sx={{ fontSize: "16px !important" }} />}
//               sx={{
//                 py: 1.4,
//                 borderRadius: "10px",
//                 fontWeight: 600,
//                 fontSize: "0.88rem",
//                 fontFamily: "'DM Sans', sans-serif",
//                 letterSpacing: "0.04em",
//                 bgcolor: T.ink,
//                 color: "#fff",
//                 boxShadow: "none",
//                 transition: "all 0.2s ease",
//                 "&:hover": {
//                   bgcolor: T.accent,
//                   boxShadow: `0 4px 20px rgba(184,98,42,0.35)`,
//                 },
//               }}
//             >
//               Proceed to Checkout
//             </Button>

//             {/* Continue shopping */}
//             <Button
//               fullWidth
//               variant="text"
//               sx={{
//                 mt: 1,
//                 py: 1,
//                 fontWeight: 500,
//                 fontSize: "0.82rem",
//                 color: T.inkFaint,
//                 fontFamily: "'DM Sans', sans-serif",
//                 "&:hover": { color: T.ink, bgcolor: "transparent" },
//               }}
//             >
//               Continue Shopping
//             </Button>

//             {/* Trust badges */}
//             <Box
//               sx={{
//                 mt: 2.5,
//                 pt: 2.5,
//                 borderTop: `1px solid ${T.border}`,
//               }}
//             >
//               <Stack direction="row" spacing={2} justifyContent="center">
//                 {[
//                   { icon: <LockOutlinedIcon sx={{ fontSize: 14 }} />, label: "Secure checkout" },
//                   { icon: <LocalShippingOutlinedIcon sx={{ fontSize: 14 }} />, label: "Fast delivery" },
//                 ].map(({ icon, label }) => (
//                   <Stack
//                     key={label}
//                     direction="row"
//                     spacing={0.5}
//                     alignItems="center"
//                   >
//                     <Box sx={{ color: T.inkFaint, display: "flex" }}>{icon}</Box>
//                     <Typography
//                       sx={{
//                         fontSize: "0.7rem",
//                         color: T.inkFaint,
//                         fontFamily: "'DM Sans', sans-serif",
//                         fontWeight: 500,
//                       }}
//                     >
//                       {label}
//                     </Typography>
//                   </Stack>
//                 ))}
//               </Stack>
//             </Box>
//           </Paper>
//         </Stack>
//       </Box>

//       {/* ── Snackbars ── */}
//       <Snackbar
//         open={open}
//         autoHideDuration={2000}
//         onClose={() => setopen(false)}
//         anchorOrigin={{ vertical: "top", horizontal: "right" }}
//       >
//         <Alert
//           severity="success"
//           variant="filled"
//           onClose={() => setopen(false)}
//           sx={{
//             bgcolor: T.ink,
//             fontFamily: "'DM Sans', sans-serif",
//             "& .MuiAlert-icon": { color: "#fff" },
//           }}
//         >
//           Removed from cart
//         </Alert>
//       </Snackbar>

//       <Snackbar
//         open={open2}
//         autoHideDuration={2000}
//         onClose={() => setopen2(false)}
//         anchorOrigin={{ vertical: "top", horizontal: "right" }}
//       >
//         <Alert
//           severity="error"
//           variant="filled"
//           onClose={() => setopen2(false)}
//           sx={{ fontFamily: "'DM Sans', sans-serif" }}
//         >
//           Failed to update
//         </Alert>
//       </Snackbar>
//     </Box>
//   );
// };

// export default CartCont;