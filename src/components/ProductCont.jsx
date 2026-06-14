// import React, { useState, useEffect } from "react";
// import ProductCard from "./Card";
// import { useNavigate } from "react-router-dom";
// import { getUserFromToken } from "../utils/auth";
// import { Snackbar, Alert } from "@mui/material";


// const ProductHeader = () => {
//   const user = getUserFromToken();
//   const [products, setproducts] = useState([]);
//   const [total, settotal] = useState(0);
//   const [page, setpage] = useState(1);
//   const [open, setopen] = useState(false);
//   const [message, setmessage] = useState("");
//   const [severity, setseverity] = useState("");
//  const [debouncedsearch, setdebouncedsearch] = useState("")
//   const [search, setsearch] = useState("");
//   const navigate = useNavigate();

//   const gettingProducts = async () => {
//     const res = await fetch(
//       `${import.meta.env.VITE_API_URL}/api/products/getProducts?page=${page}&limit=8&keyword=${debouncedsearch}`
//     );
//     const data = await res.json();
//     setproducts(data.products);
//     settotal(data.totalDocuments);
//   };


//   // ok so return is basically the cleanup function, if you mention return then the cleanup function will run otherwise not, and whatever you will write with the return is the action that will be performed in the name of cleanup function

// useEffect(() => {
  
//  const timer= setTimeout(() => {
//     setdebouncedsearch(search)
//   }, 500);

//   return () => {
//     clearTimeout(timer) // this is the callback function, it is needed to implement debouncing i.e instead of request at every letter, we are using debounced search which will set the debouncedsearch after 0.5 seconds the user stops typing so now search will take place after 0.5s after user stops typing not on i,ip,iph,ipho,iphon,iphone

//     // when we type i, this useeffect runs, a timeout is created with a cleanup function as return, react will always call the cleanup function before running the useeffect again if the cleanup function is present
//     //now we type ip, so the cleaup function is called and the previous timeout is cleaned using its id saved in timer
//     // this similar process continues till the user took a break of 0.5 seconds at this break the debouncedsearch is set and search took place
//   }
// }, [search])


//   useEffect(() => {
//     gettingProducts();
//   }, [page,debouncedsearch]);

//   const totalpages = Math.ceil(total / 8);

//   const handleDelete = (id) => {
//     setproducts((prev) => prev.filter((prod) => prod._id !== id));
//   };

//   const handleShowMessage = () => {
//     setseverity("success");
//     setmessage("Product deleted successfully");
//     setopen(true);
//   };

//   const handleShowMessage2 = (msg, type = "success") => {
//     setseverity(type);
//     setmessage(msg);
//     setopen(true);
//   };

//   return (
//     <>
//       <style>{`
//         @import url('https://fonts.googleapis.com/css2?family=Outfit:wght@400;500;600;700;800&family=Lora:wght@600;700&display=swap');

//         .ph-wrap {
//           width: min(1140px, 97%);
//           margin: 0 auto;
//         }

//         .ph-shell {
//           position: relative;
//           border-radius: 24px;
//           background: rgba(255,255,255,0.92);
//           border: 1px solid rgba(226,232,240,0.9);
//           box-shadow:
//             0 1px 2px rgba(15,23,42,0.04),
//             0 16px 48px -20px rgba(13,148,136,0.18);
//           backdrop-filter: blur(16px);
//           overflow: hidden;
//         }

//         /* subtle mesh glow */
//         .ph-shell::before {
//           content: '';
//           position: absolute;
//           top: -60px; left: -60px;
//           width: 340px; height: 240px;
//           background: radial-gradient(ellipse, rgba(20,184,166,0.12) 0%, transparent 70%);
//           pointer-events: none;
//         }
//         .ph-shell::after {
//           content: '';
//           position: absolute;
//           top: 0; right: -40px;
//           width: 260px; height: 180px;
//           background: radial-gradient(ellipse, rgba(13,148,136,0.08) 0%, transparent 70%);
//           pointer-events: none;
//         }

//         .ph-inner {
//           position: relative;
//           z-index: 1;
//           padding: 28px 28px 32px;
//         }

//         /* header row */
//         .ph-header {
//           display: flex;
//           flex-direction: column;
//           gap: 20px;
//           margin-bottom: 28px;
//         }
//         @media (min-width: 768px) {
//           .ph-header { flex-direction: row; align-items: flex-end; justify-content: space-between; }
//         }

//         .ph-eyebrow {
//           font-family: 'Outfit', sans-serif;
//           font-size: 10.5px;
//           font-weight: 700;
//           letter-spacing: 0.13em;
//           text-transform: uppercase;
//           color: #0d9488;
//           display: flex;
//           align-items: center;
//           gap: 7px;
//           margin-bottom: 6px;
//         }
//         .ph-eyebrow-line {
//           height: 1px;
//           width: 28px;
//           background: linear-gradient(90deg, #14b8a6, transparent);
//         }

//         .ph-title {
//           font-family: 'Lora', serif;
//           font-weight: 700;
//           font-size: 1.75rem;
//           color: #0f172a;
//           letter-spacing: -0.03em;
//           line-height: 1.15;
//           margin: 0 0 5px;
//         }
//         @media (min-width: 768px) { .ph-title { font-size: 2rem; } }

//         .ph-subtitle {
//           font-family: 'Outfit', sans-serif;
//           font-size: 0.825rem;
//           color: #94a3b8;
//           margin: 0;
//           line-height: 1.5;
//         }

//         /* controls row */
//         .ph-controls {
//           display: flex;
//           flex-direction: column;
//           gap: 10px;
//           width: 100%;
//         }
//         @media (min-width: 640px) {
//           .ph-controls { flex-direction: row; align-items: center; width: auto; }
//         }

//         /* search */
//         .ph-search-wrap {
//           position: relative;
//           width: 100%;
//         }
//         @media (min-width: 640px) { .ph-search-wrap { width: 240px; } }
//         @media (min-width: 1024px) { .ph-search-wrap { width: 290px; } }

//         .ph-search {
//           width: 100%;
//           border-radius: 14px;
//           border: 1px solid rgba(226,232,240,0.9);
//           background: rgba(248,250,252,0.8);
//           padding: 10px 14px 10px 40px;
//           font-family: 'Outfit', sans-serif;
//           font-size: 0.82rem;
//           color: #334155;
//           outline: none;
//           box-shadow: 0 1px 4px rgba(15,23,42,0.04);
//           transition: border-color 0.18s, box-shadow 0.18s, background 0.18s;
//           box-sizing: border-box;
//         }
//         .ph-search::placeholder { color: #cbd5e1; }
//         .ph-search:focus {
//           border-color: rgba(13,148,136,0.45);
//           background: #ffffff;
//           box-shadow: 0 0 0 3px rgba(13,148,136,0.1), 0 1px 4px rgba(15,23,42,0.04);
//         }
//         .ph-search-icon {
//           position: absolute;
//           left: 12px;
//           top: 50%;
//           transform: translateY(-50%);
//           color: #94a3b8;
//           width: 16px; height: 16px;
//           pointer-events: none;
//         }

//         /* add button */
//         .ph-add-btn {
//           display: inline-flex;
//           align-items: center;
//           justify-content: center;
//           gap: 7px;
//           font-family: 'Outfit', sans-serif;
//           font-size: 0.82rem;
//           font-weight: 600;
//           padding: 10px 18px;
//           border-radius: 14px;
//           border: none;
//           cursor: pointer;
//           white-space: nowrap;
//           background: linear-gradient(135deg, #0f766e 0%, #0d9488 60%, #14b8a6 100%);
//           color: #ffffff;
//           box-shadow: 0 4px 16px -4px rgba(13,148,136,0.45);
//           transition: all 0.22s cubic-bezier(0.4,0,0.2,1);
//           letter-spacing: 0.01em;
//         }
//         .ph-add-btn:hover {
//           transform: translateY(-2px);
//           box-shadow: 0 8px 24px -6px rgba(13,148,136,0.55);
//           background: linear-gradient(135deg, #0d6b63 0%, #0b857a 60%, #0d9488 100%);
//         }
//         .ph-add-btn:active { transform: translateY(0); }

//         /* grid */
//         .ph-grid {
//           display: grid;
//           grid-template-columns: 1fr;
//           gap: 18px;
//         }
//         @media (min-width: 560px)  { .ph-grid { grid-template-columns: repeat(2, 1fr); } }
//         @media (min-width: 900px)  { .ph-grid { grid-template-columns: repeat(3, 1fr); } }
//         @media (min-width: 1200px) { .ph-grid { grid-template-columns: repeat(4, 1fr); } }

//         /* pagination */
//         .ph-pagination {
//           display: flex;
//           justify-content: center;
//           align-items: center;
//           gap: 10px;
//           margin-top: 32px;
//         }

//         .ph-page-btn {
//           font-family: 'Outfit', sans-serif;
//           font-size: 0.8rem;
//           font-weight: 600;
//           padding: 9px 20px;
//           border-radius: 12px;
//           border: 1px solid rgba(226,232,240,0.9);
//           background: #ffffff;
//           color: #475569;
//           cursor: pointer;
//           transition: all 0.18s ease;
//           letter-spacing: 0.01em;
//           box-shadow: 0 1px 4px rgba(15,23,42,0.05);
//         }
//         .ph-page-btn:hover:not(:disabled) {
//           border-color: rgba(13,148,136,0.3);
//           color: #0d9488;
//           background: #f0fdfa;
//           box-shadow: 0 4px 12px -4px rgba(13,148,136,0.18);
//         }
//         .ph-page-btn:disabled {
//           opacity: 0.38;
//           cursor: not-allowed;
//         }

//         .ph-page-indicator {
//           font-family: 'Outfit', sans-serif;
//           font-size: 0.8rem;
//           font-weight: 600;
//           padding: 9px 18px;
//           border-radius: 12px;
//           background: rgba(13,148,136,0.07);
//           border: 1px solid rgba(13,148,136,0.18);
//           color: #0f766e;
//           min-width: 90px;
//           text-align: center;
//           letter-spacing: 0.01em;
//         }
//       `}</style>

//       <div className="ph-wrap">
//         <div className="ph-shell">
//           <div className="ph-inner">
//             {/* ── Header ── */}
//             <div className="ph-header">
//               <div>
//                 <p className="ph-eyebrow">
//                   <span className="ph-eyebrow-line" />
//                   Browse catalog
//                 </p>
//                 <h1 className="ph-title">Products</h1>
//                 <p className="ph-subtitle">
//                   Discover items with clear pricing and live stock status.
//                 </p>
//               </div>

//               <div className="ph-controls">
//                 {/* Search */}
//                 <div className="ph-search-wrap">
//                   <svg
//                     className="ph-search-icon"
//                     fill="none"
//                     stroke="currentColor"
//                     strokeWidth="2"
//                     viewBox="0 0 24 24"
//                   >
//                     <path
//                       strokeLinecap="round"
//                       strokeLinejoin="round"
//                       d="M21 21l-4.35-4.35m1.35-5.15a7 7 0 11-14 0 7 7 0 0114 0z"
//                     />
//                   </svg>
//                   <input
//                     type="text"
//                     value={search} // menas whatever you will type will become its value
//                     onChange={(e)=>setsearch(e.target.value)}// callback isliye jisse ye render hote time nhi chale balki jab change ho tabhi chale
//                     placeholder="Search products…"
//                     className="ph-search"
//                   />
//                 </div>

//                 {/* Add product (admin) */}
//                 {user?.role === "admin" && (
//                   <button
//                     type="button"
//                     className="ph-add-btn"
//                     onClick={() => navigate("/admin/products/newProduct")}
//                   >
//                     <svg
//                       width="14"
//                       height="14"
//                       fill="none"
//                       stroke="currentColor"
//                       strokeWidth="2.5"
//                       viewBox="0 0 24 24"
//                     >
//                       <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
//                     </svg>
//                     Add Product
//                   </button>
//                 )}
//               </div>
//             </div>

//             {/* ── Grid ── */}
//             <div className="ph-grid">
//               {products.map((p) => (
//                 <ProductCard
//                   key={p._id}
//                   product={p}
//                   onDelete={handleDelete}
//                   onFetch={gettingProducts}
//                   onShowMessage={handleShowMessage}
//                   onShowMessage2={handleShowMessage2}
//                 />
//               ))}
//             </div>

//             {/* ── Pagination ── */}
//             <div className="ph-pagination">
//               <button
//                 className="ph-page-btn"
//                 disabled={page === 1}
//                 onClick={() => setpage(page - 1)}
//               >
//                 ← Prev
//               </button>

//               <span className="ph-page-indicator">
//                 Page {page} / {totalpages || 1}
//               </span>

//               <button
//                 className="ph-page-btn"
//                 disabled={page === totalpages}
//                 onClick={() => setpage(page + 1)}
//               >
//                 Next →
//               </button>
//             </div>
//           </div>
//         </div>

//         {/* Toast */}
//         <Snackbar
//           open={open}
//           autoHideDuration={2000}
//           onClose={() => setopen(false)}
//           anchorOrigin={{ vertical: "top", horizontal: "right" }}
//         >
//           <Alert severity={severity} variant="filled" onClose={() => setopen(false)}>
//             {message}
//           </Alert>
//         </Snackbar>
//       </div>
//     </>
//   );
// };

// export default ProductHeader;



// // import React from "react";
// // import ProductCard from "./Card";
// // import { useState, useEffect } from "react";
// // import { useNavigate } from "react-router-dom";
// // import { getUserFromToken } from "../utils/auth";
// // import { Snackbar, Alert } from "@mui/material";

// // // ─── theme tokens (shared across all components) ──────────────────────────────
// // const T = {
// //   cream: "#FAF8F5",
// //   parchment: "#F3EFE8",
// //   ink: "#1C1410",
// //   inkLight: "#6B5B4E",
// //   inkFaint: "#A0917F",
// //   accent: "#B8622A",
// //   border: "rgba(60,40,20,0.08)",
// //   borderMid: "rgba(60,40,20,0.12)",
// //   teal: "#0f766e",
// //   tealLight: "rgba(13,148,136,0.08)",
// //   tealBorder: "rgba(13,148,136,0.18)",
// //   shadow: "0 4px 32px -8px rgba(28,20,16,0.08)",
// // };

// // const ProductHeader = () => {
// //   const user = getUserFromToken();
// //   const isAdmin = user?.role === "admin";
// //   const [products, setproducts] = useState([]);
// //   const [total, settotal] = useState(0);
// //   const [page, setpage] = useState(1);
// //   const [open, setopen] = useState(false);
// //   const [open2, setopen2] = useState(false);
// //   const navigate = useNavigate();

// //   const gettingProducts = async () => {
// //     const res = await fetch(
// //       `${import.meta.env.VITE_API_URL}/api/products/getProducts?page=${page}&limit=8`
// //     );
// //     const data = await res.json();
// //     setproducts(data.products);
// //     settotal(data.totalDocuments);
// //   };

// //   useEffect(() => {
// //     gettingProducts();
// //   }, [page]);

// //   const totalpages = Math.ceil(total / 8);

// //   const handleDelete = (id) =>
// //     setproducts((prev) => prev.filter((prod) => prod._id !== id));

// //   const handleShowMessage = () => setopen(true);
// //   const handleShowMessage2 = () => setopen2(true);

// //   // ── shared button base ────────────────────────────────────────────────────
// //   const pagBtnBase = {
// //     height: 36,
// //     padding: "0 18px",
// //     borderRadius: 8,
// //     fontFamily: "'DM Sans', sans-serif",
// //     fontSize: 13,
// //     fontWeight: 600,
// //     cursor: "pointer",
// //     transition: "all 0.15s",
// //     border: `1px solid ${T.borderMid}`,
// //     background: "transparent",
// //     color: T.inkLight,
// //   };

// //   return (
// //     <div style={{ width: "min(1120px, 98%)", margin: "0 auto" }}>

// //       {/* ── Outer shell ── */}
// //       <div style={{
// //         background: "#FFFFFF",
// //         borderRadius: 20,
// //         border: `1px solid ${T.border}`,
// //         boxShadow: T.shadow,
// //         overflow: "hidden",
// //       }}>

// //         {/* ── Header band ── */}
// //         <div style={{
// //           background: T.cream,
// //           borderBottom: `1px solid rgba(60,40,20,0.07)`,
// //           padding: "28px 32px 24px",
// //         }}>
// //           {/* Title row */}
// //           <p style={{
// //             fontFamily: "'DM Sans', sans-serif",
// //             fontSize: 10.5, fontWeight: 600,
// //             textTransform: "uppercase", letterSpacing: "0.12em",
// //             color: T.teal, marginBottom: 6,
// //           }}>
// //             Browse catalog
// //           </p>
// //           <h1 style={{
// //             fontFamily: "'Cormorant Garamond', serif",
// //             fontWeight: 700, fontSize: "2rem",
// //             letterSpacing: "-0.02em", color: T.ink,
// //             lineHeight: 1, marginBottom: 5,
// //           }}>
// //             Products
// //           </h1>
// //           <p style={{
// //             fontFamily: "'DM Sans', sans-serif",
// //             fontSize: 13, color: T.inkFaint,
// //           }}>
// //             Discover items with clear pricing and live stock status.
// //           </p>

// //           {/* Controls row */}
// //           <div style={{
// //             display: "flex", gap: 10,
// //             alignItems: "center", flexWrap: "wrap",
// //             marginTop: 20,
// //           }}>
// //             {/* Search */}
// //             <div style={{ position: "relative", flex: 1, minWidth: 200, maxWidth: 320 }}>
// //               <span style={{
// //                 position: "absolute", left: 11,
// //                 top: "50%", transform: "translateY(-50%)",
// //                 color: T.inkFaint, display: "flex",
// //               }}>
// //                 <svg width="15" height="15" viewBox="0 0 24 24" fill="none"
// //                   stroke="currentColor" strokeWidth="2.2"
// //                   strokeLinecap="round" strokeLinejoin="round">
// //                   <circle cx="11" cy="11" r="8"/>
// //                   <path d="M21 21l-4.35-4.35"/>
// //                 </svg>
// //               </span>
// //               <input
// //                 type="text"
// //                 placeholder="Search products…"
// //                 style={{
// //                   width: "100%", height: 38,
// //                   padding: "0 14px 0 38px",
// //                   border: `1px solid ${T.borderMid}`,
// //                   borderRadius: 10,
// //                   background: "#FFFFFF",
// //                   fontFamily: "'DM Sans', sans-serif",
// //                   fontSize: 13, color: T.ink,
// //                   outline: "none",
// //                 }}
// //                 onFocus={e => {
// //                   e.target.style.borderColor = "rgba(13,148,136,0.35)";
// //                   e.target.style.boxShadow = "0 0 0 3px rgba(13,148,136,0.08)";
// //                 }}
// //                 onBlur={e => {
// //                   e.target.style.borderColor = T.borderMid;
// //                   e.target.style.boxShadow = "none";
// //                 }}
// //               />
// //             </div>

// //             {/* Add product (admin only) */}
// //             {isAdmin && (
// //               <button
// //                 onClick={() => navigate("/admin/products/newProduct")}
// //                 style={{
// //                   display: "inline-flex", alignItems: "center", gap: 7,
// //                   padding: "0 18px", height: 38,
// //                   borderRadius: 10,
// //                   background: T.ink, border: "none",
// //                   color: T.cream,
// //                   fontFamily: "'DM Sans', sans-serif",
// //                   fontSize: 13, fontWeight: 600,
// //                   cursor: "pointer", letterSpacing: "0.01em",
// //                   transition: "all 0.18s", whiteSpace: "nowrap",
// //                 }}
// //                 onMouseEnter={e => {
// //                   e.currentTarget.style.background = T.accent;
// //                   e.currentTarget.style.boxShadow = "0 4px 16px rgba(184,98,42,0.3)";
// //                 }}
// //                 onMouseLeave={e => {
// //                   e.currentTarget.style.background = T.ink;
// //                   e.currentTarget.style.boxShadow = "none";
// //                 }}
// //               >
// //                 <svg width="13" height="13" viewBox="0 0 24 24" fill="none"
// //                   stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
// //                   <path d="M12 4v16m8-8H4"/>
// //                 </svg>
// //                 Add New Product
// //               </button>
// //             )}
// //           </div>
// //         </div>

// //         {/* ── Product grid ── */}
// //         <div style={{ padding: "24px 32px 28px" }}>
// //           <div style={{
// //             display: "grid",
// //             gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))",
// //             gap: 16,
// //           }}>
// //             {products.map((p) => (
// //               <ProductCard
// //                 key={p._id}
// //                 product={p}
// //                 onDelete={handleDelete}
// //                 onFetch={gettingProducts}
// //                 onShowMessage={handleShowMessage}
// //                 onShowMessage2={handleShowMessage2}
// //               />
// //             ))}
// //           </div>
// //         </div>

// //         {/* ── Divider ── */}
// //         <div style={{ height: 1, background: "rgba(60,40,20,0.06)", margin: "0 32px" }} />

// //         {/* ── Pagination ── */}
// //         <div style={{
// //           display: "flex", alignItems: "center",
// //           justifyContent: "center", gap: 8,
// //           padding: "20px 32px 28px",
// //         }}>
// //           <button
// //             style={{
// //               ...pagBtnBase,
// //               opacity: page === 1 ? 0.38 : 1,
// //               cursor: page === 1 ? "not-allowed" : "pointer",
// //             }}
// //             disabled={page === 1}
// //             onClick={() => setpage(page - 1)}
// //             onMouseEnter={e => {
// //               if (page !== 1) {
// //                 e.target.style.borderColor = T.tealBorder;
// //                 e.target.style.background = T.tealLight;
// //                 e.target.style.color = T.teal;
// //               }
// //             }}
// //             onMouseLeave={e => {
// //               e.target.style.borderColor = T.borderMid;
// //               e.target.style.background = "transparent";
// //               e.target.style.color = T.inkLight;
// //             }}
// //           >
// //             ← Prev
// //           </button>

// //           <span style={{
// //             height: 36, padding: "0 20px",
// //             display: "inline-flex", alignItems: "center",
// //             borderRadius: 8,
// //             background: T.tealLight,
// //             border: `1px solid ${T.tealBorder}`,
// //             color: T.teal,
// //             fontFamily: "'Cormorant Garamond', serif",
// //             fontSize: "1rem", fontWeight: 700,
// //             letterSpacing: "0.01em",
// //           }}>
// //             Page {page}
// //           </span>

// //           <button
// //             style={{
// //               ...pagBtnBase,
// //               opacity: page === totalpages ? 0.38 : 1,
// //               cursor: page === totalpages ? "not-allowed" : "pointer",
// //             }}
// //             disabled={page === totalpages}
// //             onClick={() => setpage(page + 1)}
// //             onMouseEnter={e => {
// //               if (page !== totalpages) {
// //                 e.target.style.borderColor = T.tealBorder;
// //                 e.target.style.background = T.tealLight;
// //                 e.target.style.color = T.teal;
// //               }
// //             }}
// //             onMouseLeave={e => {
// //               e.target.style.borderColor = T.borderMid;
// //               e.target.style.background = "transparent";
// //               e.target.style.color = T.inkLight;
// //             }}
// //           >
// //             Next →
// //           </button>
// //         </div>
// //       </div>

// //       {/* ── Snackbars ── */}
// //       <Snackbar
// //         open={open}
// //         autoHideDuration={2000}
// //         onClose={() => setopen(false)}
// //         anchorOrigin={{ vertical: "top", horizontal: "right" }}
// //       >
// //         <Alert
// //           severity="success"
// //           variant="filled"
// //           onClose={() => setopen(false)}
// //           sx={{
// //             bgcolor: T.ink,
// //             fontFamily: "'DM Sans', sans-serif",
// //             "& .MuiAlert-icon": { color: "#fff" },
// //           }}
// //         >
// //           Product deleted successfully
// //         </Alert>
// //       </Snackbar>

// //       <Snackbar
// //         open={open2}
// //         autoHideDuration={2000}
// //         onClose={() => setopen2(false)}
// //         anchorOrigin={{ vertical: "top", horizontal: "right" }}
// //       >
// //         <Alert
// //           severity="success"
// //           variant="filled"
// //           onClose={() => setopen2(false)}
// //           sx={{
// //             bgcolor: T.teal,
// //             fontFamily: "'DM Sans', sans-serif",
// //             "& .MuiAlert-icon": { color: "#fff" },
// //           }}
// //         >
// //           Added to cart successfully
// //         </Alert>
// //       </Snackbar>
// //     </div>
// //   );
// // };

// // export default ProductHeader;