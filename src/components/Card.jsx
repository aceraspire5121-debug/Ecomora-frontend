import React, { useState } from "react";
import { getUserFromToken } from "../utils/auth";
import AddShoppingCartIcon from "@mui/icons-material/AddShoppingCart";
import { IconButton } from "@mui/material";
import { useNavigate } from "react-router-dom";

const ProductCard = ({ product, onDelete, onFetch, onShowMessage, onShowMessage2 }) => {
  const user = getUserFromToken();
  const isAdmin = user?.role === "admin";
  const [loading, setloading] = useState(false);
  const navigate = useNavigate();

  const addToCart = async () => {
    try {
      const token = localStorage.getItem("CommerceToken");
      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/cart/${product._id}`, {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (res.ok) {
        onShowMessage2("Added to Cart");
      } else {
        onShowMessage2(data.message, "error");
        console.error(data.message);
      }
    } catch (err) {
      console.error("Error:", err);
    }
  };

  const deleteProduct = async () => {
    try {
      setloading(true);
      const token = localStorage.getItem("CommerceToken");
      const id = product._id;
      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/products/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) {
        onDelete(product._id);
        onShowMessage();
        onFetch();
      }
    } catch (error) {
      console.log(error);
    } finally {
      setloading(false);
    }
  };

  const inStock = product.stock > 0;

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Outfit:wght@400;500;600;700;800&family=Lora:wght@500;600;700&display=swap');

        .pc-root {
          position: relative;
          display: flex;
          flex-direction: column;
          border-radius: 20px;
          background: #ffffff;
          border: 1px solid rgba(226, 232, 240, 0.9);
          box-shadow: 0 2px 12px -4px rgba(15, 23, 42, 0.07), 0 1px 2px rgba(15,23,42,0.04);
          overflow: hidden;
          transition: transform 0.28s cubic-bezier(0.34, 1.56, 0.64, 1),
                      box-shadow 0.28s cubic-bezier(0.4, 0, 0.2, 1),
                      border-color 0.2s ease;
        }
        .pc-root:hover {
          transform: translateY(-4px);
          box-shadow: 0 20px 48px -16px rgba(13, 148, 136, 0.28), 0 4px 12px -4px rgba(15,23,42,0.08);
          border-color: rgba(13, 148, 136, 0.3);
        }

        /* image zone */
        .pc-img-wrap {
          position: relative;
          overflow: hidden;
          background: linear-gradient(145deg, #f8fafa, #f0fdfa);
          height: 185px;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        .pc-img-wrap::after {
          content: '';
          position: absolute;
          inset: 0;
          background: linear-gradient(to bottom, transparent 60%, rgba(255,255,255,0.18));
          pointer-events: none;
        }
        .pc-img {
          width: 100%;
          height: 100%;
          object-fit: contain;
          padding: 14px;
          transition: transform 0.5s cubic-bezier(0.4, 0, 0.2, 1);
        }
        .pc-root:hover .pc-img {
          transform: scale(1.05);
        }

        /* category pill */
        .pc-cat {
          display: inline-flex;
          align-items: center;
          gap: 5px;
          font-family: 'Outfit', sans-serif;
          font-size: 10.5px;
          font-weight: 600;
          letter-spacing: 0.1em;
          text-transform: uppercase;
          color: #0d9488;
          margin-bottom: 5px;
        }
        .pc-cat-dot {
          width: 5px; height: 5px;
          border-radius: 50%;
          background: #14b8a6;
          flex-shrink: 0;
        }

        /* name */
        .pc-name {
          font-family: 'Lora', serif;
          font-weight: 600;
          font-size: 0.97rem;
          line-height: 1.3;
          color: #0f172a;
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
          margin-bottom: 5px;
        }

        /* desc */
        .pc-desc {
          font-family: 'Outfit', sans-serif;
          font-size: 0.76rem;
          color: #94a3b8;
          line-height: 1.55;
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
          margin-bottom: 12px;
          flex: 1;
        }

        /* price */
        .pc-price {
          font-family: 'Lora', serif;
          font-weight: 700;
          font-size: 1.25rem;
          color: #0f172a;
          letter-spacing: -0.02em;
          margin-bottom: 10px;
        }
        .pc-price span {
          font-size: 0.8rem;
          font-weight: 500;
          color: #64748b;
          margin-right: 1px;
          font-family: 'Outfit', sans-serif;
        }

        /* stock badge */
        .pc-stock {
          display: inline-flex;
          align-items: center;
          gap: 5px;
          font-family: 'Outfit', sans-serif;
          font-size: 11px;
          font-weight: 600;
          padding: 4px 10px;
          border-radius: 20px;
          width: fit-content;
        }
        .pc-stock.in {
          background: #f0fdfa;
          color: #0f766e;
          border: 1px solid rgba(13,148,136,0.2);
        }
        .pc-stock.out {
          background: #fff1f2;
          color: #be123c;
          border: 1px solid rgba(190,18,60,0.18);
        }
        .pc-stock-dot {
          width: 5px; height: 5px;
          border-radius: 50%;
          flex-shrink: 0;
        }

        /* cart button */
        .pc-cart-btn {
          position: absolute !important;
          bottom: 14px;
          right: 14px;
          opacity: 0;
          transform: translateY(6px) scale(0.92);
          pointer-events: none;
          transition: opacity 0.25s ease, transform 0.28s cubic-bezier(0.34,1.56,0.64,1) !important;
        }
        .pc-root:hover .pc-cart-btn {
          opacity: 1;
          transform: translateY(0) scale(1);
          pointer-events: auto;
        }
        @media (max-width: 768px) {
          .pc-cart-btn {
            opacity: 1 !important;
            transform: none !important;
            pointer-events: auto !important;
          }
        }

        /* admin footer */
        .pc-admin-footer {
          display: flex;
          gap: 8px;
          padding: 10px 16px 14px;
          border-top: 1px solid rgba(226, 232, 240, 0.8);
          margin-top: auto;
        }
        .pc-btn-edit, .pc-btn-delete {
          flex: 1;
          border-radius: 10px;
          font-family: 'Outfit', sans-serif;
          font-size: 0.775rem;
          font-weight: 600;
          padding: 8px 0;
          cursor: pointer;
          transition: all 0.18s ease;
          letter-spacing: 0.01em;
        }
        .pc-btn-edit {
          border: 1px solid rgba(203,213,225,0.8);
          background: transparent;
          color: #475569;
        }
        .pc-btn-edit:hover {
          background: #f0fdfa;
          border-color: rgba(13,148,136,0.3);
          color: #0d9488;
        }
        .pc-btn-delete {
          border: 1px solid rgba(254,202,202,0.9);
          background: transparent;
          color: #dc2626;
        }
        .pc-btn-delete:hover:not(:disabled) {
          background: #dc2626;
          border-color: #dc2626;
          color: #fff;
          box-shadow: 0 4px 14px -4px rgba(220,38,38,0.4);
        }
        .pc-btn-delete:disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }
      `}</style>

      <article className="pc-root">
        {/* Image */}
        <div className="pc-img-wrap">
          <img
            src={product.images[0]?.url}
            alt={product.name}
            className="pc-img"
          />
        </div>

        {/* Body */}
        <div style={{ padding: "14px 16px 16px", display: "flex", flexDirection: "column", flex: 1 }}>
          <p className="pc-cat">
            <span className="pc-cat-dot" />
            {product.category}
          </p>

          <h2 className="pc-name">{product.name}</h2>
          <p className="pc-desc">{product.description}</p>

          <p className="pc-price">
            <span>₹</span>{product.price.toLocaleString("en-IN")}
          </p>

          <span className={`pc-stock ${inStock ? "in" : "out"}`}>
            <span
              className="pc-stock-dot"
              style={{ background: inStock ? "#0d9488" : "#dc2626" }}
            />
            {inStock ? `In Stock (${product.stock})` : "Out of Stock"}
          </span>
        </div>

        {/* User: floating cart */}
        {!isAdmin && (
          <IconButton
            className="pc-cart-btn"
            size="small"
            onClick={addToCart}
            sx={{
              width: 38,
              height: 38,
              borderRadius: "11px",
              color: "#0f766e",
              backgroundColor: "#ffffff",
              border: "1px solid rgba(13,148,136,0.22)",
              boxShadow: "0 8px 20px -8px rgba(15,118,110,0.45)",
              "&:hover": {
                backgroundColor: "#f0fdfa",
                borderColor: "rgba(13,148,136,0.45)",
                boxShadow: "0 12px 28px -10px rgba(15,118,110,0.55)",
              },
            }}
          >
            <AddShoppingCartIcon sx={{ fontSize: 17 }} />
          </IconButton>
        )}

        {/* Admin: edit / delete */}
        {isAdmin && (
          <div className="pc-admin-footer">
            <button
              type="button"
              className="pc-btn-edit"
              onClick={() =>
                navigate(`/admin/products/editProduct/${product._id}`, {
                  state: { product },
                })
              }
            >
              Edit
            </button>
            <button
              type="button"
              className="pc-btn-delete"
              onClick={deleteProduct}
              disabled={loading}
            >
              {loading ? "Deleting…" : "Delete"}
            </button>
          </div>
        )}
      </article>
    </>
  );
};

export default ProductCard;





////////


// import React, { useState } from "react";
// import { getUserFromToken } from "../utils/auth";
// import { IconButton } from "@mui/material";
// import { useNavigate } from "react-router-dom";

// // Cart icon inline (avoids MUI icon bundle if preferred, swap back if needed)
// const CartIcon = () => (
//   <svg width="15" height="15" viewBox="0 0 24 24" fill="none"
//     stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
//     <circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/>
//     <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"/>
//   </svg>
// );

// const T = {
//   ink: "#1C1410",
//   inkFaint: "#A0917F",
//   teal: "#0f766e",
//   tealLight: "rgba(13,148,136,0.08)",
//   tealBorder: "rgba(13,148,136,0.22)",
//   border: "rgba(60,40,20,0.08)",
//   parchment: "#F3EFE8",
//   red: "#C0392B",
//   redLight: "rgba(192,57,43,0.08)",
//   redBorder: "rgba(192,57,43,0.2)",
// };

// const ProductCard = ({ product, onDelete, onFetch, onShowMessage, onShowMessage2 }) => {
//   const user = getUserFromToken();
//   const isAdmin = user?.role === "admin";
//   const [loading, setLoading] = useState(false);
//   const navigate = useNavigate();

//   const addToCart = async () => {
//     try {
//       const token = localStorage.getItem("CommerceToken");
//       const res = await fetch(`${import.meta.env.VITE_API_URL}/api/cart/${product._id}`, {
//         method: "POST",
//         headers: { Authorization: `Bearer ${token}` },
//       });
//       const data = await res.json();
//       if (res.ok) { onShowMessage2(); }
//       else { console.error(data.message); }
//     } catch (err) { console.error("Error:", err); }
//   };

//   const deleteProduct = async () => {
//     try {
//       setLoading(true);
//       const token = localStorage.getItem("CommerceToken");
//       const res = await fetch(`${import.meta.env.VITE_API_URL}/api/products/${product._id}`, {
//         method: "DELETE",
//         headers: { Authorization: `Bearer ${token}` },
//       });
//       if (res.ok) {
//         onDelete(product._id);
//         onShowMessage();
//         onFetch();
//       }
//     } catch (error) { console.log(error); }
//     finally { setLoading(false); }
//   };

//   const inStock = product.stock > 0;

//   return (
//     <article className="group relative flex flex-col rounded-2xl bg-white overflow-hidden transition duration-300 hover:-translate-y-0.5"
//       style={{
//         border: `1px solid ${T.border}`,
//         boxShadow: "0 2px 16px rgba(28,20,16,0.05)",
//       }}
//       onMouseEnter={e => {
//         e.currentTarget.style.boxShadow = "0 12px 36px -16px rgba(15,118,110,0.28)";
//         e.currentTarget.style.borderColor = T.tealBorder;
//       }}
//       onMouseLeave={e => {
//         e.currentTarget.style.boxShadow = "0 2px 16px rgba(28,20,16,0.05)";
//         e.currentTarget.style.borderColor = T.border;
//       }}
//     >
//       {/* Image */}
//       <div className="relative overflow-hidden flex items-center justify-center"
//         style={{ background: `linear-gradient(145deg, #F8F5F0, ${T.parchment})`, height: 180, padding: 16 }}>
//         <img
//           src={product.images[0]?.url}
//           alt={product.name}
//           className="w-full h-full object-contain transition duration-500 group-hover:scale-[1.04]"
//         />
//       </div>

//       {/* Body */}
//       <div className="flex flex-col flex-1 p-4">
//         <span style={{
//           fontSize: 10.5, fontWeight: 600, textTransform: "uppercase",
//           letterSpacing: "0.1em", color: T.teal, marginBottom: 4,
//           fontFamily: "'DM Sans', sans-serif",
//         }}>
//           {product.category}
//         </span>

//         <h2 style={{
//           fontFamily: "'Cormorant Garamond', serif",
//           fontWeight: 700, fontSize: "1.1rem", lineHeight: 1.25,
//           color: T.ink, marginBottom: 5,
//           display: "-webkit-box", WebkitLineClamp: 2,
//           WebkitBoxOrient: "vertical", overflow: "hidden",
//         }}>
//           {product.name}
//         </h2>

//         <p style={{
//           fontSize: 12, color: T.inkFaint, lineHeight: 1.55, marginBottom: 12,
//           display: "-webkit-box", WebkitLineClamp: 2,
//           WebkitBoxOrient: "vertical", overflow: "hidden",
//           fontFamily: "'DM Sans', sans-serif",
//         }}>
//           {product.description}
//         </p>

//         <p style={{
//           fontFamily: "'Cormorant Garamond', serif",
//           fontWeight: 700, fontSize: "1.35rem", color: T.ink, marginBottom: 10,
//         }}>
//           ₹{product.price}
//         </p>

//         {/* Stock badge */}
//         <span style={{
//           display: "inline-flex", alignItems: "center", gap: 6,
//           padding: "4px 10px", borderRadius: 20, fontSize: 10.5, fontWeight: 600,
//           fontFamily: "'DM Sans', sans-serif",
//           ...(inStock
//             ? { background: "#F0FDF8", color: T.teal, border: `1px solid rgba(13,148,136,0.2)` }
//             : { background: T.redLight, color: T.red, border: `1px solid ${T.redBorder}` }
//           ),
//         }}>
//           <span style={{
//             width: 5, height: 5, borderRadius: "50%",
//             background: inStock ? T.teal : T.red,
//           }} />
//           {inStock ? `In Stock (${product.stock})` : "Out of Stock"}
//         </span>
//       </div>

//       {/* User: floating cart button */}
//       {!isAdmin && (
//         <IconButton
//           className="opacity-0 translate-y-2 scale-95 pointer-events-none group-hover:opacity-100 group-hover:translate-y-0 group-hover:scale-100 group-hover:pointer-events-auto transition-all duration-300 ease-out"
//           size="small"
//           onClick={addToCart}
//           sx={{
//             position: "absolute", bottom: 14, right: 14,
//             width: 36, height: 36, borderRadius: "10px",
//             color: T.teal, backgroundColor: "#fff",
//             border: `1px solid ${T.tealBorder}`,
//             boxShadow: "0 6px 18px -8px rgba(15,118,110,0.45)",
//             transition: "all 0.2s ease",
//             "&:hover": {
//               backgroundColor: T.tealLight,
//               borderColor: "rgba(13,148,136,0.45)",
//               boxShadow: "0 10px 24px -10px rgba(15,118,110,0.55)",
//               transform: "translateY(-1px) scale(1.05)",
//             },
//           }}
//         >
//           <CartIcon />
//         </IconButton>
//       )}

//       {/* Admin: edit/delete footer */}
//       {isAdmin && (
//         <div style={{
//           display: "flex", gap: 8, padding: "10px 16px 14px",
//           borderTop: `1px solid rgba(60,40,20,0.07)`,
//         }}>
//           <button
//             onClick={() => navigate(`/admin/products/editProduct/${product._id}`, { state: { product } })}
//             style={{
//               flex: 1, borderRadius: 8, border: `1px solid rgba(60,40,20,0.14)`,
//               background: "transparent", color: "#6B5B4E",
//               fontFamily: "'DM Sans', sans-serif", fontSize: 12, fontWeight: 600,
//               padding: "8px 0", cursor: "pointer", transition: "all 0.15s",
//             }}
//             onMouseEnter={e => { e.target.style.background = T.tealLight; e.target.style.color = T.teal; e.target.style.borderColor = T.tealBorder; }}
//             onMouseLeave={e => { e.target.style.background = "transparent"; e.target.style.color = "#6B5B4E"; e.target.style.borderColor = "rgba(60,40,20,0.14)"; }}
//           >
//             Edit
//           </button>
//           <button
//             onClick={deleteProduct}
//             disabled={loading}
//             style={{
//               flex: 1, borderRadius: 8, border: `1px solid ${T.redBorder}`,
//               background: "transparent", color: T.red,
//               fontFamily: "'DM Sans', sans-serif", fontSize: 12, fontWeight: 600,
//               padding: "8px 0", cursor: loading ? "not-allowed" : "pointer",
//               transition: "all 0.15s", opacity: loading ? 0.65 : 1,
//             }}
//             onMouseEnter={e => { if (!loading) { e.target.style.background = T.red; e.target.style.color = "#fff"; } }}
//             onMouseLeave={e => { e.target.style.background = "transparent"; e.target.style.color = T.red; }}
//           >
//             {loading ? "Deleting…" : "Delete"}
//           </button>
//         </div>
//       )}
//     </article>
//   );
// };

// export default ProductCard;