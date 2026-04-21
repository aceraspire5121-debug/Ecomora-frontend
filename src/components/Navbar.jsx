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
    color: "secondary.main",
    fontWeight: 600,
    fontSize: "0.875rem",
    px: 1.25,
    py: 0.5,
    minWidth: "auto",
    borderRadius: 2,
    ...(active
      ? { color: "primary.main", bgcolor: "rgba(13, 148, 136, 0.1)" }
      : {}),
    "&:hover": { bgcolor: "rgba(13, 148, 136, 0.08)", color: "primary.dark" },
  });

  return (
    <AppBar
      elevation={0}
      position="sticky"
      sx={{
        top: 12,
        background: "rgba(255, 255, 255, 0.82)",
        backdropFilter: "blur(12px)",
        color: "#1c1917",
        borderRadius: 3,
        width: "min(1120px, 98%)",
        mx: "auto",
        border: "1px solid rgba(15, 118, 110, 0.12)",
        boxShadow: "0 4px 24px -8px rgba(15, 23, 42, 0.12)",
      }}
    >
      <Toolbar sx={{ py: 0.5, gap: 2, flexWrap: "wrap" }}>
        <Box
          sx={{ display: "flex", alignItems: "center", gap: 1.25, cursor: "pointer" }}
          onClick={() => navigate("/user/products")}
        >
          <Box component="img" src={logo} alt="" sx={{ width: 36, height: 36 }} />
          <Typography
            variant="h6"
            sx={{
              fontWeight: 800,
              letterSpacing: "-0.03em",
              background: "linear-gradient(135deg, #0f766e 0%, #0d9488 50%, #14b8a6 100%)",
              backgroundClip: "text",
              WebkitTextFillColor: "transparent",
            }}
          >
            Ecomora
          </Typography>
        </Box>

        <Box sx={{ flexGrow: 1 }} />

        <Box display="flex" flexWrap="wrap" gap={0.5} alignItems="center">
          {isAdmin && (
            <>
              <Button>
                Dashboard
              </Button>
              <Button sx={navBtn(false)} disabled>
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
            sx={navBtn(location.pathname === "/user/products" || location.pathname === "/admin/products" )}
            onClick={() => navigate("/user/products")}
          >
            Products
          </Button>

          {user?.role === "user" && (
            <>
              <Button sx={navBtn(location.pathname==="/users/cart")}
              onClick={()=>navigate("/users/cart")} >
                Cart
              </Button>
              <Button sx={navBtn(location.pathname==="/users/orders")} 
              onClick={()=>navigate("/users/orders")} >
                Purchases
              </Button>
            </>
          )}

          <Button
            variant="contained"
            color="primary"
            size="small"
            onClick={handleLogout}
            sx={{ ml: { xs: 0, sm: 1 }, px: 2 }}
          >
            Logout
          </Button>
        </Box>
      </Toolbar>
    </AppBar>
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
