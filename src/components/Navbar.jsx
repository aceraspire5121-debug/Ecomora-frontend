import { AppBar, Toolbar, Typography, Button, Box } from "@mui/material";
import { useNavigate, useLocation } from "react-router-dom";
import logo from "../images/cart.svg";
import { getUserFromToken } from "../utils/auth";

const Navbar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const user = getUserFromToken();
  const isAdmin = user?.role === "admin";

  const handleLogout = () => {
    localStorage.removeItem("CommerceToken");
    navigate("/login");
  };

  const navBtn = (active) => ({
    position: "relative",
    color: active ? "#0d9488" : "#64748b",
    fontFamily: "'Outfit', sans-serif",
    fontWeight: active ? 600 : 450,
    fontSize: "0.825rem",
    px: 1.5,
    py: 0.625,
    minWidth: "auto",
    borderRadius: "10px",
    letterSpacing: "0.01em",
    bgcolor: active ? "rgba(13, 148, 136, 0.07)" : "transparent",
    border: active ? "1px solid rgba(13, 148, 136, 0.2)" : "1px solid transparent",
    transition: "all 0.18s cubic-bezier(0.4, 0, 0.2, 1)",
    "&::after": active
      ? {
          content: '""',
          position: "absolute",
          bottom: 4,
          left: "50%",
          transform: "translateX(-50%)",
          width: "16px",
          height: "2px",
          borderRadius: "2px",
          bgcolor: "#0d9488",
        }
      : {},
    "&:hover": {
      bgcolor: "rgba(13, 148, 136, 0.06)",
      color: "#0d9488",
      border: "1px solid rgba(13, 148, 136, 0.18)",
      transform: "translateY(-1px)",
    },
    "&.Mui-disabled": {
      color: "#cbd5e1",
      opacity: 0.6,
    },
  });

  return (
    <>
      {/* Google Fonts import — drop this into your index.html if preferred */}
      <style>{`@import url('https://fonts.googleapis.com/css2?family=Outfit:wght@400;500;600;700;800&display=swap');`}</style>

      <AppBar
        elevation={0}
        position="sticky"
        sx={{
          top: 10,
          background: "rgba(255, 255, 255, 0.78)",
          backdropFilter: "blur(20px) saturate(180%)",
          WebkitBackdropFilter: "blur(20px) saturate(180%)",
          color: "#0f172a",
          borderRadius: "16px",
          width: "min(1140px, 97%)",
          mx: "auto",
          border: "1px solid rgba(226, 232, 240, 0.8)",
          boxShadow:
            "0 1px 2px rgba(15,23,42,0.04), 0 8px 32px -8px rgba(15,23,42,0.10), inset 0 1px 0 rgba(255,255,255,0.9)",
        }}
      >
        <Toolbar
          sx={{
            py: 0.75,
            gap: 1.5,
            flexWrap: "wrap",
            minHeight: "58px !important",
            px: { xs: 1.5, sm: 2 },
          }}
        >
          {/* ── Brand ── */}
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              gap: 1.25,
              cursor: "pointer",
              userSelect: "none",
              "&:hover .brand-icon": { transform: "rotate(-8deg) scale(1.05)" },
            }}
            onClick={() => navigate("/user/products")}
          >
            <Box
              className="brand-icon"
              sx={{
                width: 36,
                height: 36,
                borderRadius: "11px",
                background: "linear-gradient(135deg, #0f766e 0%, #14b8a6 100%)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                boxShadow: "0 4px 12px rgba(13,148,136,0.28)",
                transition: "transform 0.25s cubic-bezier(0.34,1.56,0.64,1)",
                flexShrink: 0,
              }}
            >
              <Box
                component="img"
                src={logo}
                alt=""
                sx={{ width: 20, height: 20, filter: "brightness(0) invert(1)" }}
              />
            </Box>

            <Box>
              <Typography
                sx={{
                  fontFamily: "'Outfit', sans-serif",
                  fontWeight: 800,
                  fontSize: "1.1rem",
                  letterSpacing: "-0.04em",
                  lineHeight: 1,
                  background:
                    "linear-gradient(135deg, #0f766e 0%, #0d9488 60%, #14b8a6 100%)",
                  backgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                }}
              >
                Ecomora
              </Typography>
              {isAdmin && (
                <Typography
                  sx={{
                    fontFamily: "'Outfit', sans-serif",
                    fontSize: "0.55rem",
                    fontWeight: 600,
                    letterSpacing: "0.12em",
                    textTransform: "uppercase",
                    color: "#94a3b8",
                    lineHeight: 1,
                    mt: 0.25,
                  }}
                >
                  Admin Console
                </Typography>
              )}
            </Box>
          </Box>

          {/* ── Divider ── */}
          <Box
            sx={{
              width: "1px",
              height: 20,
              bgcolor: "rgba(148, 163, 184, 0.3)",
              display: { xs: "none", sm: "block" },
            }}
          />

          <Box sx={{ flexGrow: 1 }} />

          {/* ── Nav Links ── */}
          <Box display="flex" flexWrap="wrap" gap={0.5} alignItems="center">
            {isAdmin && (
              <>
                <Button
                  sx={navBtn(location.pathname === "/admin/dashboard")}
                  onClick={() => navigate("/admin/dashboard")}
                >
                  Dashboard
                </Button>
                <Button
                  sx={navBtn(location.pathname === "/admin/customers")}
                  onClick={() => navigate("/admin/customers")}
                >
                  Customers
                </Button>
                <Button sx={navBtn(false)} disabled>
                  Analytics
                </Button>
                <Button sx={navBtn(false)} disabled>
                  Settings
                </Button>
              </>
            )}

            <Button
              sx={navBtn(
                location.pathname === "/user/products" ||
                  location.pathname === "/admin/products"
              )}
              onClick={() => navigate("/user/products")}
            >
              Products
            </Button>

            {user?.role === "user" && (
              <>
                <Button
                  sx={navBtn(location.pathname === "/users/cart")}
                  onClick={() => navigate("/users/cart")}
                >
                  Cart
                </Button>
                <Button
                  sx={navBtn(location.pathname === "/users/orders")}
                  onClick={() => navigate("/users/orders")}
                >
                  Purchases
                </Button>
              </>
            )}

            {/* ── Separator ── */}
            <Box
              sx={{
                width: "1px",
                height: 20,
                bgcolor: "rgba(148, 163, 184, 0.3)",
                mx: 0.5,
                display: { xs: "none", sm: "block" },
              }}
            />

            {/* ── Logout ── */}
            <Button
              size="small"
              onClick={handleLogout}
              sx={{
                fontFamily: "'Outfit', sans-serif",
                fontWeight: 600,
                fontSize: "0.8rem",
                letterSpacing: "0.01em",
                px: 2,
                py: 0.75,
                borderRadius: "10px",
                background: "linear-gradient(135deg, #0f766e 0%, #0d9488 100%)",
                color: "#fff",
                boxShadow: "0 2px 10px rgba(13,148,136,0.25)",
                border: "none",
                transition: "all 0.2s cubic-bezier(0.4, 0, 0.2, 1)",
                "&:hover": {
                  background: "linear-gradient(135deg, #0d6b63 0%, #0b857a 100%)",
                  boxShadow: "0 4px 16px rgba(13,148,136,0.38)",
                  transform: "translateY(-1px)",
                },
                "&:active": { transform: "translateY(0)" },
              }}
            >
              Logout
            </Button>
          </Box>
        </Toolbar>
      </AppBar>
    </>
  );
};

export default Navbar;



///////

// import { AppBar, Toolbar, Typography, Button, Box, Chip } from "@mui/material";
// import { useNavigate, useLocation } from "react-router-dom";
// import logo from "../images/cart.svg";
// import { getUserFromToken } from "../utils/auth";

// // ─── theme tokens (mirrors CartCont) ──────────────────────────────────────────
// const T = {
//   cream: "#FAF8F5",
//   ink: "#1C1410",
//   inkLight: "#6B5B4E",
//   inkFaint: "#A0917F",
//   accent: "#B8622A",
//   accentLight: "rgba(184,98,42,0.08)",
//   border: "rgba(60,40,20,0.10)",
//   teal: "#0f766e",
//   tealLight: "rgba(13,148,136,0.08)",
//   tealBorder: "rgba(13,148,136,0.18)",
// };

// const Navbar = () => {
//   const navigate = useNavigate();
//   const location = useLocation();
//   const user = getUserFromToken();
//   const isAdmin = user?.role === "admin";

//   const handleLogout = () => {
//     localStorage.removeItem("CommerceToken");
//     navigate("/login");
//   };

//   const navBtn = (active) => ({
//     color: active ? T.teal : T.inkLight,
//     fontFamily: "'DM Sans', sans-serif",
//     fontWeight: active ? 600 : 500,
//     fontSize: "0.82rem",
//     px: 1.75,
//     py: 0.75,
//     minWidth: "auto",
//     borderRadius: "8px",
//     letterSpacing: "0.01em",
//     border: active ? `1px solid ${T.tealBorder}` : "1px solid transparent",
//     bgcolor: active ? T.tealLight : "transparent",
//     transition: "all 0.15s ease",
//     "&:hover": {
//       bgcolor: T.tealLight,
//       color: T.teal,
//       border: `1px solid ${T.tealBorder}`,
//     },
//     "&.Mui-disabled": {
//       color: T.inkFaint,
//       opacity: 0.5,
//     },
//   });

//   return (
//     <AppBar
//       elevation={0}
//       position="sticky"
//       sx={{
//         top: 12,
//         background: "rgba(250, 248, 245, 0.88)",
//         backdropFilter: "blur(14px)",
//         color: T.ink,
//         borderRadius: "16px",
//         width: "min(1120px, 96%)",
//         mx: "auto",
//         border: `1px solid ${T.border}`,
//         boxShadow: "0 2px 20px rgba(28,20,16,0.07)",
//       }}
//     >
//       <Toolbar sx={{ py: 0.75, gap: 1, flexWrap: "wrap", minHeight: "60px !important" }}>
//         {/* Brand */}
//         <Box
//           sx={{ display: "flex", alignItems: "center", gap: 1.25, cursor: "pointer" }}
//           onClick={() => navigate("/user/products")}
//         >
//           <Box
//             sx={{
//               width: 36,
//               height: 36,
//               borderRadius: "10px",
//               bgcolor: "rgba(15,118,110,0.10)",
//               display: "flex",
//               alignItems: "center",
//               justifyContent: "center",
//             }}
//           >
//             <Box component="img" src={logo} alt="" sx={{ width: 20, height: 20 }} />
//           </Box>
//           <Typography
//             sx={{
//               fontFamily: "'Cormorant Garamond', serif",
//               fontWeight: 700,
//               fontSize: "1.4rem",
//               letterSpacing: "-0.02em",
//               background: "linear-gradient(135deg, #0f766e 0%, #14b8a6 100%)",
//               backgroundClip: "text",
//               WebkitTextFillColor: "transparent",
//             }}
//           >
//             Ecomora
//           </Typography>
//         </Box>

//         {/* Admin badge */}
//         {isAdmin && (
//           <Chip
//             label="Admin"
//             size="small"
//             sx={{
//               bgcolor: T.accentLight,
//               color: T.accent,
//               fontFamily: "'DM Sans', sans-serif",
//               fontWeight: 600,
//               fontSize: "0.65rem",
//               letterSpacing: "0.07em",
//               height: 20,
//               border: `1px solid rgba(184,98,42,0.18)`,
//               textTransform: "uppercase",
//             }}
//           />
//         )}

//         <Box sx={{ flexGrow: 1 }} />

//         <Box display="flex" flexWrap="wrap" gap={0.5} alignItems="center">
//           {isAdmin && (
//             <>
//               <Button sx={navBtn(location.pathname.includes("dashboard"))}>
//                 Dashboard
//               </Button>
//               <Button sx={navBtn(false)} disabled>Customers</Button>
//               <Button sx={navBtn(false)} disabled>Analytics</Button>
//               <Button sx={navBtn(false)} disabled>Settings</Button>
//             </>
//           )}

//           <Button
//             sx={navBtn(
//               location.pathname === "/user/products" ||
//               location.pathname === "/admin/products"
//             )}
//             onClick={() => navigate("/user/products")}
//           >
//             Products
//           </Button>

//           {user?.role === "user" && (
//             <>
//               <Button
//                 sx={navBtn(location.pathname === "/users/cart")}
//                 onClick={() => navigate("/users/cart")}
//               >
//                 Cart
//               </Button>
//               <Button sx={navBtn(false)} disabled>Purchases</Button>
//             </>
//           )}

//           {/* Divider */}
//           <Box sx={{ width: "1px", height: 20, bgcolor: T.border, mx: 0.75 }} />

//           <Button
//             variant="contained"
//             size="small"
//             onClick={handleLogout}
//             sx={{
//               fontFamily: "'DM Sans', sans-serif",
//               fontWeight: 600,
//               fontSize: "0.82rem",
//               bgcolor: T.ink,
//               color: T.cream,
//               px: 2,
//               py: 0.875,
//               borderRadius: "8px",
//               boxShadow: "none",
//               letterSpacing: "0.02em",
//               transition: "all 0.2s ease",
//               "&:hover": {
//                 bgcolor: T.accent,
//                 boxShadow: "0 4px 16px rgba(184,98,42,0.3)",
//               },
//             }}
//           >
//             Logout
//           </Button>
//         </Box>
//       </Toolbar>
//     </AppBar>
//   );
// };

// export default Navbar;
