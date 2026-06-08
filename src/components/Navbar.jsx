import { AppBar, Toolbar, Typography, Button, Box, Menu, MenuItem } from "@mui/material";
import { useNavigate, useLocation } from "react-router-dom";
import logo from "../images/cart.svg";
import { getUserFromToken } from "../utils/auth";
import { useState } from "react";

const getInitials = (name = "") => name.split(" ").slice(0, 2).map(w => w[0]).join("").toUpperCase();

const Navbar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const user = getUserFromToken();
  const isAdmin = user?.role === "admin";
  const [anchorEl, setAnchorEl] = useState(null);

  const handleOpen = (event) => { // event conatins many details
    setAnchorEl(event.currentTarget) // we are setting the value of anchor from null to the element which was clicked i.e that Box as a whole
  }
  const handleClose = () => {
    setAnchorEl(null)
  }

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
            minHeight: "58px !important",
            px: { xs: 1.5, sm: 2 },
            // Two-row layout on mobile: row1 = brand+avatar, row2 = nav links
            flexWrap: "wrap",
            gap: 0,
          }}
        >
          {/* ══════════════════════════════════════════
              ROW 1 — Brand (left) + Avatar (right)
              This row never wraps — brand and avatar
              always stay on the same line.
          ══════════════════════════════════════════ */}
          <Box sx={{
            display: "flex",
            alignItems: "center",
            width: "100%",           // full width so it forms its own row
            py: 0.75,
          }}>

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
                  width: 36, height: 36,
                  borderRadius: "11px",
                  background: "linear-gradient(135deg, #0f766e 0%, #14b8a6 100%)",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  boxShadow: "0 4px 12px rgba(13,148,136,0.28)",
                  transition: "transform 0.25s cubic-bezier(0.34,1.56,0.64,1)",
                  flexShrink: 0,
                }}
              >
                <Box
                  component="img" src={logo} alt=""
                  sx={{ width: 20, height: 20, filter: "brightness(0) invert(1)" }}
                />
              </Box>

              <Box>
                <Typography sx={{
                  fontFamily: "'Outfit', sans-serif",
                  fontWeight: 800, fontSize: "1.1rem",
                  letterSpacing: "-0.04em", lineHeight: 1,
                  background: "linear-gradient(135deg, #0f766e 0%, #0d9488 60%, #14b8a6 100%)",
                  backgroundClip: "text", WebkitTextFillColor: "transparent",
                }}>
                  Ecomora
                </Typography>
                {isAdmin && (
                  <Typography sx={{
                    fontFamily: "'Outfit', sans-serif",
                    fontSize: "0.55rem", fontWeight: 600,
                    letterSpacing: "0.12em", textTransform: "uppercase",
                    color: "#94a3b8", lineHeight: 1, mt: 0.25,
                  }}>
                    Admin Console
                  </Typography>
                )}
              </Box>
            </Box>

            {/* ── Spacer ── pushes avatar to far right ── */}
            <Box sx={{ flexGrow: 1 }} />

            {/* ── Avatar — always right end of row 1 ── */}
            <Box
              onClick={handleOpen} // no parenthesis means call this function after the click happens
              sx={{
                width: 34, height: 34,
                borderRadius: "50%",
                display: "flex", alignItems: "center", justifyContent: "center",
                fontFamily: "'Outfit', sans-serif",
                fontSize: "11px", fontWeight: 700,
                letterSpacing: "0.03em",
                flexShrink: 0,
                userSelect: "none", cursor: "pointer",
                background: "linear-gradient(135deg, #0f766e 0%, #14b8a6 100%)",
                color: "#ffffff",
                boxShadow: "0 2px 10px rgba(13,148,136,0.35)",
                transition: "transform 0.22s cubic-bezier(0.34,1.56,0.64,1), box-shadow 0.2s",
                "&:hover": {
                  transform: "scale(1.08)",
                  boxShadow: "0 4px 16px rgba(13,148,136,0.5)",
                },
                "&:active": { transform: "scale(0.95)" },
              }}
            >
              {getInitials(user?.name)}
            </Box>

          </Box>{/* end row 1 */}

          {/* ══════════════════════════════════════════
              ROW 2 — Nav links
              On desktop (sm+) this row collapses and
              links float inline via the row-1 spacer.
              On mobile it sits as its own second row.
          ══════════════════════════════════════════ */}
          <Box
            display="flex"
            flexWrap="wrap"
            gap={0.5}
            alignItems="center"
            sx={{
              // desktop: shrink row-1 width so links fit on same line
              // mobile: full-width second row
              width: { xs: "100%", md: "auto" },
              // on desktop pull this row UP next to brand by making row-1 not full-width
              // We handle this by switching the outer Toolbar back to single-row on md+
              pb: { xs: 0.75, md: 0 },
              borderTop: { xs: "1px solid rgba(226,232,240,0.6)", md: "none" },
              pt: { xs: 0.5, md: 0 },
            }}
          >
            {isAdmin && (
              <>
                <Button sx={navBtn(location.pathname === "/admin/dashboard")} onClick={() => navigate("/admin/dashboard")}>
                  Dashboard
                </Button>
                <Button sx={navBtn(location.pathname === "/admin/customers")} onClick={() => navigate("/admin/customers")}>
                  Customers
                </Button>
                <Button sx={navBtn(false)} disabled>Analytics</Button>
                <Button sx={navBtn(false)} disabled>Settings</Button>
              </>
            )}

            <Button
              sx={navBtn(location.pathname === "/user/products" || location.pathname === "/admin/products")}
              onClick={() => navigate("/user/products")}
            >
              Products
            </Button>

            {user?.role === "user" && (
              <>
                <Button sx={navBtn(location.pathname === "/users/cart")} onClick={() => navigate("/users/cart")}>
                  Cart
                </Button>
              </>
            )}
          </Box>

          {/* ── Dropdown Menu ── */}
          <Menu
            anchorEl={anchorEl} // for menu to appear, it needs a element with which respect it can appear so when we click the avatar, that avatar box element is stored in anchorEl which is provided as a position to this menu
            open={Boolean(anchorEl)} // when anchorEl is null then Boolean(null)=false hence open false, but when anchorEl is <Box>..</Box> then Boolean(.) is true hence open true so it opens
            onClose={handleClose} // whenever user presses esc or clicks anywhere it runs handleClose that handleClose set anchorEl as null which make open false hence it get closed
            transformOrigin={{ horizontal: "right", vertical: "top" }}
            anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
            PaperProps={{
              elevation: 0,
              sx: {
                mt: 1, minWidth: 220,
                borderRadius: "14px",
                border: "1px solid rgba(226,232,240,0.9)",
                boxShadow: "0 8px 32px -8px rgba(15,23,42,0.14), 0 2px 8px -2px rgba(15,23,42,0.06)",
                overflow: "visible",
                fontFamily: "'Outfit', sans-serif",
                // arrow tip pointing up toward avatar
                "&::before": {
                  content: '""',
                  display: "block", position: "absolute",
                  top: -6, right: 18, width: 12, height: 12,
                  bgcolor: "background.paper",
                  border: "1px solid rgba(226,232,240,0.9)",
                  borderBottom: "none", borderRight: "none",
                  transform: "rotate(45deg)", zIndex: 0,
                },
              },
            }}
          >
            {/* ── User info header ── */}
            <Box sx={{
              px: 2, pt: 2, pb: 1.5,
              borderBottom: "1px solid rgba(226,232,240,0.8)",
              display: "flex", alignItems: "center", gap: 1.5,
            }}>
              <Box sx={{
                width: 38, height: 38, borderRadius: "50%",
                background: "linear-gradient(135deg, #0f766e 0%, #14b8a6 100%)",
                boxShadow: "0 2px 10px rgba(13,148,136,0.3)",
                display: "flex", alignItems: "center", justifyContent: "center",
                color: "#fff", fontFamily: "'Outfit',sans-serif",
                fontSize: "0.8rem", fontWeight: 700, flexShrink: 0,
              }}>
                {getInitials(user?.name)}
              </Box>
              <Box sx={{ minWidth: 0 }}>
                <Typography sx={{
                  fontFamily: "'Outfit',sans-serif", fontWeight: 700,
                  fontSize: "0.825rem", color: "#0f172a",
                  whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis",
                }}>
                  {user?.name}
                </Typography>
                <Typography sx={{
                  fontFamily: "'Outfit',sans-serif", fontWeight: 400,
                  fontSize: "0.72rem", color: "#94a3b8",
                }}>
                  {user?.role === "admin" ? "Administrator" : "Customer"}
                </Typography>
              </Box>
            </Box>

            {/* ── Menu items (user only, not shown for admin) ── */}
            {!isAdmin && [
              {
                icon: (
                  <svg width="15" height="15" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
                    <circle cx="12" cy="8" r="4" /><path d="M4 20c0-4 3.6-7 8-7s8 3 8 7" />
                  </svg>
                ),
                label: "Profile",
                onClick: () => { navigate("/profile"); handleClose(); },
              },
              {
                icon: (
                  <svg width="15" height="15" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
                    <path d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2" /><rect x="9" y="3" width="6" height="4" rx="1" />
                  </svg>
                ),
                label: "My Orders",
                onClick: () => { navigate("/users/orders"); handleClose(); },
              },
            ].map(({ icon, label, onClick }) => (
              <MenuItem
                key={label}
                onClick={onClick}
                sx={{
                  mx: 1, my: 0.5, borderRadius: "9px",
                  px: 1.5, py: 1,
                  fontFamily: "'Outfit',sans-serif",
                  fontSize: "0.825rem", fontWeight: 500, color: "#334155",
                  display: "flex", alignItems: "center", gap: 1.25,
                  transition: "background 0.15s, color 0.15s",
                  "&:hover": { background: "rgba(13,148,136,0.07)", color: "#0d9488" },
                }}
              >
                <Box sx={{ color: "inherit", display: "flex", opacity: 0.7 }}>{icon}</Box>
                {label}
              </MenuItem>
            ))}

            {/* ── Divider + Logout ── */}
            <Box sx={{ mx: 1, my: 0.5, height: "1px", bgcolor: "rgba(226,232,240,0.8)" }} />

            <MenuItem
              onClick={() => { handleLogout(); handleClose(); }}
              sx={{
                mx: 1, my: 0.5, mb: 1, borderRadius: "9px",
                px: 1.5, py: 1,
                fontFamily: "'Outfit',sans-serif",
                fontSize: "0.825rem", fontWeight: 600, color: "#ef4444",
                display: "flex", alignItems: "center", gap: 1.25,
                transition: "background 0.15s",
                "&:hover": { background: "rgba(239,68,68,0.07)" },
              }}
            >
              <Box sx={{ display: "flex", opacity: 0.8 }}>
                <svg width="15" height="15" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
                  <path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4" /><polyline points="16 17 21 12 16 7" /><line x1="21" y1="12" x2="9" y2="12" />
                </svg>
              </Box>
              Logout
            </MenuItem>
          </Menu>

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
