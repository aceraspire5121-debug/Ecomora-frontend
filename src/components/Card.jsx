import React from "react";
import { getUserFromToken } from "../utils/auth";
import AddShoppingCartIcon from '@mui/icons-material/AddShoppingCart';
import { Snackbar, Alert,IconButton } from "@mui/material";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

const ProductCard = ({ product,onDelete,onFetch,onShowMessage,onShowMessage2 }) => {
  const user = getUserFromToken();
  const isAdmin = user?.role === "admin";
  const [open, setopen] = useState(false)
  const [loading, setloading] = useState(false)
  const navigate=useNavigate()

  const addToCart=async ()=>{
    try{
    const token=localStorage.getItem("CommerceToken");
      const res=await fetch(`${import.meta.env.VITE_API_URL}/api/cart/${product._id}`,{
        method:"POST",
        headers:{Authorization: `Bearer ${token}`},
      })
      const data=await res.json();
      if (res.ok) {
      console.log("Added to cart:", data);
      onShowMessage2()

    } else {
      console.error(data.message);
    }
  }catch(err)
  {
    console.error("Error:", err);
  }
  }

  const deleteProduct = async () => { // ohh har function ke liye ek alag execution context banta hai jiska ek part memory space hota hai aur uski memory space me bo uske andar jo data use hota hai use store karta hai jiski bajah se jitni bar deleteProduct banega bo har bar us time avaibale product ko store kar lega jo ki bo use kar raha hai, isliye har deleteProduct ka ek alag execution context hai jiski memory me us particular card ke assosiated product store hai
    try {
      setloading(true)
      const token = localStorage.getItem("CommerceToken")
      const id = product._id
      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/products/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        }
      })
      if (res.ok) {
        setopen(true)
        onDelete(product._id)
        onShowMessage()
        onFetch()
        
      }

    } catch(error) {
       console.log(error)
     }
     finally{
      setloading(false)
     }
  }

  return (
    <article className="group relative flex flex-col rounded-2xl border border-stone-100 bg-white p-4 shadow-sm ring-1 ring-black/[0.02] transition duration-300 hover:-translate-y-0.5 hover:border-teal-200/60 hover:shadow-[0_20px_40px_-28px_rgba(15,118,110,0.35)]">
      <div className="relative mb-3 aspect-[4/3] overflow-hidden rounded-xl bg-gradient-to-br from-stone-100 to-stone-50">
        <img
          src={product.images[0]?.url}
          alt={product.name}
          className="h-full w-full object-contain transition duration-500 group-hover:scale-[1.03]"
        />
      </div>

      <span className="text-[11px] font-semibold uppercase tracking-wider text-teal-700/90">
        {product.category}
      </span>

      <h2 className="mt-1 line-clamp-2 text-sm font-bold leading-snug text-stone-900">{product.name}</h2>

      <p className="mt-1 line-clamp-2 text-xs leading-relaxed text-stone-500">{product.description}</p>

      <p className="mt-3 text-lg font-bold tabular-nums text-stone-900">₹{product.price}</p>

      <div className="mt-3">
        <span
          className={`inline-flex rounded-full px-2.5 py-1 text-[11px] font-semibold ${product.stock > 0
              ? "bg-emerald-50 text-emerald-800 ring-1 ring-emerald-200/80"
              : "bg-red-50 text-red-700 ring-1 ring-red-200/80"
            }`}
        >
          {product.stock > 0 ? `In Stock (${product.stock})` : "Out of Stock"}
        </span>
      </div>

      {!isAdmin && ( // i have given group to the parent i.e article so by this now i can apply on child whenever parent is hovered, apply group-hover.. to the child
       <IconButton
    className="opacity-0 translate-y-2 scale-95 pointer-events-none group-hover:opacity-100 group-hover:translate-y-0 group-hover:scale-100 group-hover:pointer-events-auto transition-all duration-300 ease-out"
    size="small"
    onClick={addToCart}
    sx={{
      position: "absolute",
      bottom: 14,
      right: 14,
      width: 38,
      height: 38,
      color: "#0f766e",
      backgroundColor: "#ffffff",
      border: "1px solid rgba(13, 148, 136, 0.24)",
      boxShadow: "0 10px 22px -12px rgba(15, 118, 110, 0.5)",
      transition: "all 220ms ease",
      "&:hover": {
        backgroundColor: "#f0fdfa",
        borderColor: "rgba(13, 148, 136, 0.5)",
        boxShadow: "0 14px 26px -12px rgba(15, 118, 110, 0.6)",
        transform: "translateY(-1px) scale(1.04)",
      },
    }}
  >
    <AddShoppingCartIcon sx={{ fontSize: 19 }} />
  </IconButton>
      )}

      {isAdmin && (
        <div className="mt-4 flex gap-2 border-t border-stone-100 pt-4">
          <button
            type="button"
            className="flex-1 rounded-xl border border-stone-200 py-2 text-xs font-semibold text-stone-700 transition hover:border-teal-300 hover:bg-teal-50/50 hover:text-teal-900"
            onClick={()=>navigate(`/admin/products/editProduct/${product._id}`,{
              state:{product}
            })}
          >
            Edit
          </button>
          <button
            type="button"
            className="flex-1 rounded-xl border border-red-200/80 py-2 text-xs font-semibold text-red-700 transition hover:bg-red-600 hover:text-white"
            onClick={deleteProduct}
            disabled={loading}
          >
            {loading?"Deleting...":"Delete"}
          </button>
        </div>
      )}
    </article>
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