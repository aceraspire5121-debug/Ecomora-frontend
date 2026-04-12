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
              <Button sx={navBtn(false)} disabled>
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
