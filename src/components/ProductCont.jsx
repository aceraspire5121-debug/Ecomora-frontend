import React from "react";
import ProductCard from "./Card";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { getUserFromToken } from "../utils/auth";
import { Button, Box, Typography,Snackbar,Alert } from "@mui/material";

const ProductHeader = () => {
  const user = getUserFromToken();
  const [products, setproducts] = useState([]);
  const [total, settotal] = useState(0)
  const [page, setpage] = useState(1)
  const [open, setopen] = useState(false)
  const [open2, setopen2] = useState(false)
  const navigate = useNavigate()
  let totalpages;

    const gettingProducts = async () => {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/products/getProducts?page=${page}&limit=8`);
      const data = await res.json();
      setproducts(data.products);
      console.log(data.totalDocuments)
      settotal(data.totalDocuments)
    };

  useEffect(() => {
    gettingProducts();
  }, [page]);

  totalpages=Math.ceil(total/8);
  console.log(totalpages)

  //   useEffect(() => {
  //   console.log(products)
  // }, [products]);

 

  const handleDelete = (id) => {
    setproducts((prev) => prev.filter((prod) => prod._id !== id)) // prev me peeche ke sare products, fir un products ki id se comparison
  }

  const handleShowMessage=()=>{
   setopen(true)
  }

  const handleShowMessage2=()=>{
    setopen2(true)
  }

  return (
    <div className="w-[min(1120px,98%)] mx-auto">
      <div className="relative overflow-hidden rounded-3xl border border-teal-900/10 bg-white/90 shadow-[0_20px_50px_-24px_rgba(15,118,110,0.25)] backdrop-blur-sm">
        <div
          className="pointer-events-none absolute inset-0 opacity-[0.35]"
          style={{
            background:
              "radial-gradient(ellipse 80% 50% at 0% -20%, rgba(45,212,191,0.35), transparent), radial-gradient(ellipse 60% 40% at 100% 0%, rgba(13,148,136,0.2), transparent)",
          }}
        />

        <div className="relative p-5 md:p-8">
          <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
            <div>
              <p className="text-xs font-semibold uppercase tracking-widest text-teal-700/80">
                Browse catalog
              </p>
              <h1 className="mt-1 text-2xl font-bold tracking-tight text-stone-900 md:text-3xl">
                Products
              </h1>
              <p className="mt-1 max-w-md text-sm text-stone-500">
                Discover items with clear pricing and live stock status.
              </p>
            </div>

            <div className="flex w-full flex-col gap-3 sm:flex-row sm:items-center md:w-auto">
              <div className="relative w-full sm:max-w-xs md:w-80">
                <input
                  type="text"
                  placeholder="Search product..."
                  className="w-full rounded-2xl border border-stone-200 bg-white/80 py-2.5 pl-11 pr-4 text-sm text-stone-800 shadow-sm outline-none transition placeholder:text-stone-400 focus:border-teal-500/50 focus:ring-2 focus:ring-teal-500/20"
                />
                <svg
                  className="absolute left-3.5 top-1/2 h-5 w-5 -translate-y-1/2 text-stone-400"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M21 21l-4.35-4.35m1.35-5.15a7 7 0 11-14 0 7 7 0 0114 0z"
                  />
                </svg>
              </div>

              {user?.role === "admin" && (
                <button
                  type="button"
                  onClick={() => navigate("/admin/products/newProduct")}
                  className="inline-flex shrink-0 items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-teal-700 to-teal-600 px-5 py-2.5 text-sm font-semibold text-white shadow-lg shadow-teal-900/25 transition hover:from-teal-800 hover:to-teal-700"
                >
                  <svg className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
                  </svg>
                  Add New Product
                </button>
              )}
            </div>
          </div>

          <div className="mt-8 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {products.map((p) => (
              <ProductCard key={p._id} product={p} onDelete={handleDelete} onFetch={gettingProducts} onShowMessage={handleShowMessage} onShowMessage2={handleShowMessage2} />
            ))}
          </div>
          <Box
            sx={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              gap: 2,
              mt: 4,
            }}
          >
            <Button
              variant="outlined"
              disabled={page === 1}
              onClick={() => setpage(page - 1)}
              sx={{
                textTransform: "none",
                borderRadius: 2,
                px: 2.5,
              }}
            >
              Prev
            </Button>

            <Typography
              sx={{
                fontWeight: 600,
                px: 2,
                py: 0.5,
                borderRadius: 2,
                bgcolor: "rgba(13, 148, 136, 0.1)",
                color: "teal.800",
              }}
            >
              Page {page}
            </Typography>

            <Button
              variant="contained"
              onClick={() => setpage(page + 1)}
              disabled={page===totalpages}
              sx={{
                textTransform: "none",
                borderRadius: 2,
                px: 2.5,
              }}
            >
              Next
            </Button>
          </Box>
        </div>
      </div>
      <Snackbar
        open={open}
        autoHideDuration={2000}
        onClose={() => setopen(false)} // jab ye band hoga to jate jate ye setopen ko false kar dega aur iski bajah se, snackbar jo ki open the open={true} par bo open=false hone par fir close ho jayega, to ek tareeke se ye apne aap ko ui se hi hide kar raha hai onclose par
        anchorOrigin={{ vertical: "top", horizontal: "right" }} // position lagayi hai uski
      >
        <Alert
          severity="success"
          variant="filled"
          onClose={() => setopen(false)}
        >
          Product deleted successfully
        </Alert>
      </Snackbar>
      <Snackbar
        open={open2}
        autoHideDuration={2000}
        onClose={() => setopen2(false)} // jab ye band hoga to jate jate ye setopen ko false kar dega aur iski bajah se, snackbar jo ki open the open={true} par bo open=false hone par fir close ho jayega, to ek tareeke se ye apne aap ko ui se hi hide kar raha hai onclose par
        anchorOrigin={{ vertical: "top", horizontal: "right" }} // position lagayi hai uski
      >
        <Alert
          severity="success"
          variant="filled"
          onClose={() => setopen2(false)}
        >
          Added to Cart Successfully
        </Alert>
      </Snackbar>
    </div>
  );
};

export default ProductHeader;



// import React from "react";
// import ProductCard from "./Card";
// import { useState, useEffect } from "react";
// import { useNavigate } from "react-router-dom";
// import { getUserFromToken } from "../utils/auth";
// import { Snackbar, Alert } from "@mui/material";

// // ─── theme tokens (shared across all components) ──────────────────────────────
// const T = {
//   cream: "#FAF8F5",
//   parchment: "#F3EFE8",
//   ink: "#1C1410",
//   inkLight: "#6B5B4E",
//   inkFaint: "#A0917F",
//   accent: "#B8622A",
//   border: "rgba(60,40,20,0.08)",
//   borderMid: "rgba(60,40,20,0.12)",
//   teal: "#0f766e",
//   tealLight: "rgba(13,148,136,0.08)",
//   tealBorder: "rgba(13,148,136,0.18)",
//   shadow: "0 4px 32px -8px rgba(28,20,16,0.08)",
// };

// const ProductHeader = () => {
//   const user = getUserFromToken();
//   const isAdmin = user?.role === "admin";
//   const [products, setproducts] = useState([]);
//   const [total, settotal] = useState(0);
//   const [page, setpage] = useState(1);
//   const [open, setopen] = useState(false);
//   const [open2, setopen2] = useState(false);
//   const navigate = useNavigate();

//   const gettingProducts = async () => {
//     const res = await fetch(
//       `${import.meta.env.VITE_API_URL}/api/products/getProducts?page=${page}&limit=8`
//     );
//     const data = await res.json();
//     setproducts(data.products);
//     settotal(data.totalDocuments);
//   };

//   useEffect(() => {
//     gettingProducts();
//   }, [page]);

//   const totalpages = Math.ceil(total / 8);

//   const handleDelete = (id) =>
//     setproducts((prev) => prev.filter((prod) => prod._id !== id));

//   const handleShowMessage = () => setopen(true);
//   const handleShowMessage2 = () => setopen2(true);

//   // ── shared button base ────────────────────────────────────────────────────
//   const pagBtnBase = {
//     height: 36,
//     padding: "0 18px",
//     borderRadius: 8,
//     fontFamily: "'DM Sans', sans-serif",
//     fontSize: 13,
//     fontWeight: 600,
//     cursor: "pointer",
//     transition: "all 0.15s",
//     border: `1px solid ${T.borderMid}`,
//     background: "transparent",
//     color: T.inkLight,
//   };

//   return (
//     <div style={{ width: "min(1120px, 98%)", margin: "0 auto" }}>

//       {/* ── Outer shell ── */}
//       <div style={{
//         background: "#FFFFFF",
//         borderRadius: 20,
//         border: `1px solid ${T.border}`,
//         boxShadow: T.shadow,
//         overflow: "hidden",
//       }}>

//         {/* ── Header band ── */}
//         <div style={{
//           background: T.cream,
//           borderBottom: `1px solid rgba(60,40,20,0.07)`,
//           padding: "28px 32px 24px",
//         }}>
//           {/* Title row */}
//           <p style={{
//             fontFamily: "'DM Sans', sans-serif",
//             fontSize: 10.5, fontWeight: 600,
//             textTransform: "uppercase", letterSpacing: "0.12em",
//             color: T.teal, marginBottom: 6,
//           }}>
//             Browse catalog
//           </p>
//           <h1 style={{
//             fontFamily: "'Cormorant Garamond', serif",
//             fontWeight: 700, fontSize: "2rem",
//             letterSpacing: "-0.02em", color: T.ink,
//             lineHeight: 1, marginBottom: 5,
//           }}>
//             Products
//           </h1>
//           <p style={{
//             fontFamily: "'DM Sans', sans-serif",
//             fontSize: 13, color: T.inkFaint,
//           }}>
//             Discover items with clear pricing and live stock status.
//           </p>

//           {/* Controls row */}
//           <div style={{
//             display: "flex", gap: 10,
//             alignItems: "center", flexWrap: "wrap",
//             marginTop: 20,
//           }}>
//             {/* Search */}
//             <div style={{ position: "relative", flex: 1, minWidth: 200, maxWidth: 320 }}>
//               <span style={{
//                 position: "absolute", left: 11,
//                 top: "50%", transform: "translateY(-50%)",
//                 color: T.inkFaint, display: "flex",
//               }}>
//                 <svg width="15" height="15" viewBox="0 0 24 24" fill="none"
//                   stroke="currentColor" strokeWidth="2.2"
//                   strokeLinecap="round" strokeLinejoin="round">
//                   <circle cx="11" cy="11" r="8"/>
//                   <path d="M21 21l-4.35-4.35"/>
//                 </svg>
//               </span>
//               <input
//                 type="text"
//                 placeholder="Search products…"
//                 style={{
//                   width: "100%", height: 38,
//                   padding: "0 14px 0 38px",
//                   border: `1px solid ${T.borderMid}`,
//                   borderRadius: 10,
//                   background: "#FFFFFF",
//                   fontFamily: "'DM Sans', sans-serif",
//                   fontSize: 13, color: T.ink,
//                   outline: "none",
//                 }}
//                 onFocus={e => {
//                   e.target.style.borderColor = "rgba(13,148,136,0.35)";
//                   e.target.style.boxShadow = "0 0 0 3px rgba(13,148,136,0.08)";
//                 }}
//                 onBlur={e => {
//                   e.target.style.borderColor = T.borderMid;
//                   e.target.style.boxShadow = "none";
//                 }}
//               />
//             </div>

//             {/* Add product (admin only) */}
//             {isAdmin && (
//               <button
//                 onClick={() => navigate("/admin/products/newProduct")}
//                 style={{
//                   display: "inline-flex", alignItems: "center", gap: 7,
//                   padding: "0 18px", height: 38,
//                   borderRadius: 10,
//                   background: T.ink, border: "none",
//                   color: T.cream,
//                   fontFamily: "'DM Sans', sans-serif",
//                   fontSize: 13, fontWeight: 600,
//                   cursor: "pointer", letterSpacing: "0.01em",
//                   transition: "all 0.18s", whiteSpace: "nowrap",
//                 }}
//                 onMouseEnter={e => {
//                   e.currentTarget.style.background = T.accent;
//                   e.currentTarget.style.boxShadow = "0 4px 16px rgba(184,98,42,0.3)";
//                 }}
//                 onMouseLeave={e => {
//                   e.currentTarget.style.background = T.ink;
//                   e.currentTarget.style.boxShadow = "none";
//                 }}
//               >
//                 <svg width="13" height="13" viewBox="0 0 24 24" fill="none"
//                   stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
//                   <path d="M12 4v16m8-8H4"/>
//                 </svg>
//                 Add New Product
//               </button>
//             )}
//           </div>
//         </div>

//         {/* ── Product grid ── */}
//         <div style={{ padding: "24px 32px 28px" }}>
//           <div style={{
//             display: "grid",
//             gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))",
//             gap: 16,
//           }}>
//             {products.map((p) => (
//               <ProductCard
//                 key={p._id}
//                 product={p}
//                 onDelete={handleDelete}
//                 onFetch={gettingProducts}
//                 onShowMessage={handleShowMessage}
//                 onShowMessage2={handleShowMessage2}
//               />
//             ))}
//           </div>
//         </div>

//         {/* ── Divider ── */}
//         <div style={{ height: 1, background: "rgba(60,40,20,0.06)", margin: "0 32px" }} />

//         {/* ── Pagination ── */}
//         <div style={{
//           display: "flex", alignItems: "center",
//           justifyContent: "center", gap: 8,
//           padding: "20px 32px 28px",
//         }}>
//           <button
//             style={{
//               ...pagBtnBase,
//               opacity: page === 1 ? 0.38 : 1,
//               cursor: page === 1 ? "not-allowed" : "pointer",
//             }}
//             disabled={page === 1}
//             onClick={() => setpage(page - 1)}
//             onMouseEnter={e => {
//               if (page !== 1) {
//                 e.target.style.borderColor = T.tealBorder;
//                 e.target.style.background = T.tealLight;
//                 e.target.style.color = T.teal;
//               }
//             }}
//             onMouseLeave={e => {
//               e.target.style.borderColor = T.borderMid;
//               e.target.style.background = "transparent";
//               e.target.style.color = T.inkLight;
//             }}
//           >
//             ← Prev
//           </button>

//           <span style={{
//             height: 36, padding: "0 20px",
//             display: "inline-flex", alignItems: "center",
//             borderRadius: 8,
//             background: T.tealLight,
//             border: `1px solid ${T.tealBorder}`,
//             color: T.teal,
//             fontFamily: "'Cormorant Garamond', serif",
//             fontSize: "1rem", fontWeight: 700,
//             letterSpacing: "0.01em",
//           }}>
//             Page {page}
//           </span>

//           <button
//             style={{
//               ...pagBtnBase,
//               opacity: page === totalpages ? 0.38 : 1,
//               cursor: page === totalpages ? "not-allowed" : "pointer",
//             }}
//             disabled={page === totalpages}
//             onClick={() => setpage(page + 1)}
//             onMouseEnter={e => {
//               if (page !== totalpages) {
//                 e.target.style.borderColor = T.tealBorder;
//                 e.target.style.background = T.tealLight;
//                 e.target.style.color = T.teal;
//               }
//             }}
//             onMouseLeave={e => {
//               e.target.style.borderColor = T.borderMid;
//               e.target.style.background = "transparent";
//               e.target.style.color = T.inkLight;
//             }}
//           >
//             Next →
//           </button>
//         </div>
//       </div>

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
//           Product deleted successfully
//         </Alert>
//       </Snackbar>

//       <Snackbar
//         open={open2}
//         autoHideDuration={2000}
//         onClose={() => setopen2(false)}
//         anchorOrigin={{ vertical: "top", horizontal: "right" }}
//       >
//         <Alert
//           severity="success"
//           variant="filled"
//           onClose={() => setopen2(false)}
//           sx={{
//             bgcolor: T.teal,
//             fontFamily: "'DM Sans', sans-serif",
//             "& .MuiAlert-icon": { color: "#fff" },
//           }}
//         >
//           Added to cart successfully
//         </Alert>
//       </Snackbar>
//     </div>
//   );
// };

// export default ProductHeader;