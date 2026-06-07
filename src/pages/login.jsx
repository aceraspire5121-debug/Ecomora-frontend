import {
  TextField,
  Button,
  Box,
  Typography,
  CircularProgress,
  Alert,
  Paper,
  InputAdornment,
} from "@mui/material";
import { Link, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { useEffect } from "react";
import { getUserFromToken } from "../utils/auth";
import MailOutlineIcon from "@mui/icons-material/MailOutline";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";

/* ── inject styles once ── */
const styleTag = document.createElement("style");
styleTag.textContent = `
  @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,400;0,600;1,400&family=DM+Sans:wght@300;400;500&display=swap');

  .ecm-login-root {
    min-height: 100vh;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 2rem 1rem;
    background: #faf6f0;
    background-image:
      radial-gradient(ellipse 80% 60% at 80% 0%, rgba(20,184,166,0.07) 0%, transparent 60%),
      radial-gradient(ellipse 60% 50% at 20% 100%, rgba(245,158,11,0.07) 0%, transparent 60%);
    position: relative;
    overflow: hidden;
  }

  .ecm-login-root::before,
  .ecm-login-root::after {
    content: '';
    position: absolute;
    width: 300px;
    height: 300px;
    border: 1px solid rgba(20,184,166,0.1);
    border-radius: 50%;
    pointer-events: none;
  }
  .ecm-login-root::before { top: -130px; right: -130px; }
  .ecm-login-root::after  { bottom: -140px; left: -140px; }

  .ecm-login-card {
    animation: ecmLoginUp .55s cubic-bezier(.22,.68,0,1.2) both;
  }
  @keyframes ecmLoginUp {
    from { opacity: 0; transform: translateY(28px) scale(0.98); }
    to   { opacity: 1; transform: translateY(0)   scale(1);    }
  }

  .ecm-login-field input {
    font-family: 'DM Sans', sans-serif !important;
    font-size: 0.9rem !important;
    color: #1c1917 !important;
  }
  .ecm-login-field label {
    font-family: 'DM Sans', sans-serif !important;
    font-size: 0.85rem !important;
  }

  .ecm-login-btn {
    font-family: 'DM Sans', sans-serif !important;
    letter-spacing: 0.12em !important;
    font-weight: 500 !important;
    font-size: 0.82rem !important;
    text-transform: uppercase !important;
    background: linear-gradient(135deg, #0f766e 0%, #0d9488 100%) !important;
    box-shadow: 0 4px 20px rgba(15,118,110,0.28) !important;
    border-radius: 10px !important;
    padding: 13px !important;
    transition: box-shadow .25s, transform .2s !important;
  }
  .ecm-login-btn:hover:not(:disabled) {
    box-shadow: 0 8px 28px rgba(15,118,110,0.38) !important;
    transform: translateY(-1px) !important;
  }
  .ecm-login-btn:active { transform: translateY(0) !important; }

  .ecm-login-divider {
    display: flex;
    align-items: center;
    gap: 10px;
    color: #a8a29e;
    font-family: 'DM Sans', sans-serif;
    font-size: 0.75rem;
    letter-spacing: 0.08em;
  }
  .ecm-login-divider::before, .ecm-login-divider::after {
    content: '';
    flex: 1;
    height: 1px;
    background: rgba(15,118,110,0.15);
  }
`;
if (!document.head.querySelector("[data-ecm-login]")) {
  styleTag.setAttribute("data-ecm-login", "1");
  document.head.appendChild(styleTag);
}

const fieldSx = {
  "& .MuiOutlinedInput-root": {
    borderRadius: "10px",
    background: "rgba(255,255,255,0.7)",
    "& fieldset": { borderColor: "rgba(15,118,110,0.2)" },
    "&:hover fieldset": { borderColor: "rgba(15,118,110,0.45)" },
    "&.Mui-focused fieldset": { borderColor: "#0f766e", borderWidth: "1.5px" },
  },
  "& .MuiInputLabel-root.Mui-focused": { color: "#0f766e" },
  "& .MuiFormHelperText-root": {
    fontFamily: "'DM Sans', sans-serif",
    fontSize: "0.75rem",
  },
};

const LoginPage = () => {
  const user = getUserFromToken();
  const navigate = useNavigate();

  useEffect(() => {
    if (user) {
      if (user.role === "admin") navigate("/admin/products");
      else navigate("/user/products");
    }
  }, [user, navigate]);

  const {
    register,
    handleSubmit,
    setError,
    clearErrors,
    formState: { errors, isSubmitting },
  } = useForm();

  const onSubmiting = async (data) => {
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/users/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      const newdata = await res.json();
      if (!res.ok) {
        setError("MyError", { type: "manual", message: newdata.message });
        return;
      }
      console.log("Success", newdata);
      localStorage.setItem("CommerceToken", newdata.token);
      if (newdata.user.role === "admin") navigate("/admin/products");
      else navigate("/user/products");
    } catch (error) {
      console.log("Network Error", error);
    }
  };

  return (
    <Box className="ecm-login-root">
      {/* wordmark */}
      <Box
        sx={{
          position: "absolute",
          top: 24,
          left: 32,
          fontFamily: "'Cormorant Garamond', serif",
          fontSize: "1.35rem",
          fontWeight: 600,
          color: "#0f766e",
          letterSpacing: "0.04em",
          display: { xs: "none", sm: "block" },
        }}
      >
        Ecomora
      </Box>

      <form
        onSubmit={handleSubmit(onSubmiting)}
        style={{ width: "100%", maxWidth: 420 }}
        noValidate
      >
        <Paper
          className="ecm-login-card"
          elevation={0}
          sx={{
            p: { xs: "28px 24px", sm: "44px 36px" },
            borderRadius: "20px",
            border: "1px solid rgba(15,118,110,0.13)",
            background: "rgba(255,252,248,0.96)",
            backdropFilter: "blur(16px)",
            boxShadow:
              "0 2px 0 rgba(255,255,255,0.8) inset, 0 32px 64px -24px rgba(15,23,42,0.14), 0 0 0 1px rgba(255,255,255,0.5)",
          }}
        >
          {/* header */}
          <Box sx={{ mb: 3.5, textAlign: "center" }}>
            <Box
              sx={{
                width: 36,
                height: 3,
                borderRadius: 2,
                background: "linear-gradient(90deg,#0f766e,#f59e0b)",
                mx: "auto",
                mb: 2,
              }}
            />
            <Typography
              sx={{
                fontFamily: "'Cormorant Garamond', serif",
                fontSize: "2.1rem",
                fontWeight: 600,
                color: "#1c1917",
                lineHeight: 1.15,
                letterSpacing: "0.01em",
              }}
            >
              Welcome back
            </Typography>
            <Typography
              sx={{
                fontFamily: "'DM Sans', sans-serif",
                fontSize: "0.82rem",
                color: "#78716c",
                mt: 0.6,
                fontWeight: 300,
                letterSpacing: "0.03em",
              }}
            >
              Sign in to your Ecomora account
            </Typography>
          </Box>

          <Box display="flex" flexDirection="column" gap={1.8}>
            {/* Email */}
            <TextField
              className="ecm-login-field"
              label="Email"
              type="email"
              fullWidth
              size="small"
              sx={fieldSx}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <MailOutlineIcon sx={{ fontSize: 18, color: "#a8a29e" }} />
                  </InputAdornment>
                ),
              }}
              {...register("email", {
                required: "Email is required",
                onChange: () => clearErrors("MyError"),
                pattern: {
                  value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                  message: "Enter a valid email address",
                },
              })}
              error={!!errors.email}
              helperText={errors.email?.message}
            />

            {/* Password */}
            <TextField
              className="ecm-login-field"
              label="Password"
              type="password"
              fullWidth
              size="small"
              sx={fieldSx}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <LockOutlinedIcon sx={{ fontSize: 18, color: "#a8a29e" }} />
                  </InputAdornment>
                ),
              }}
              {...register("password", {
                required: "Password is required",
                minLength: { value: 6, message: "Password must be of 6 characters" },
                maxLength: { value: 15, message: "Password cannot be more than 15 characters" },
                onChange: () => clearErrors("MyError"),
                pattern: {
                  value: /^(?=.*[A-Za-z])(?=.*\d).{6,}$/,
                  message: "Password must be at least 6 characters and include letters and numbers",
                },
              })}
              error={!!errors.password}
              helperText={errors.password?.message}
            />

            {/* Forgot password — subtle, right-aligned */}
            <Box sx={{ textAlign: "right", mt: -0.8 }}>
              <Link
                to="/reset"
                style={{
                  fontFamily: "'DM Sans', sans-serif",
                  fontSize: "0.78rem",
                  color: "#0f766e",
                  textDecoration: "none",
                  fontWeight: 400,
                  opacity: 0.85,
                }}
              >
                Forgot password?
              </Link>
            </Box>

            {/* server error */}
            {errors.MyError && (
              <Alert
                severity="error"
                sx={{
                  borderRadius: "10px",
                  fontFamily: "'DM Sans', sans-serif",
                  fontSize: "0.82rem",
                  py: 0.5,
                }}
              >
                {errors.MyError.message}
              </Alert>
            )}

            {/* submit */}
            <Button
              type="submit"
              variant="contained"
              size="large"
              fullWidth
              className="ecm-login-btn"
              disabled={isSubmitting}
              sx={{ mt: 0.5 }}
            >
              {isSubmitting ? (
                <CircularProgress size={20} color="inherit" />
              ) : (
                "Sign In"
              )}
            </Button>

            {/* divider */}
            <Box className="ecm-login-divider">new to ecomora?</Box>

            {/* register link */}
            <Typography
              textAlign="center"
              sx={{
                fontFamily: "'DM Sans', sans-serif",
                fontSize: "0.84rem",
                color: "#78716c",
                mt: -0.5,
              }}
            >
              <Link
                to="/"
                style={{
                  color: "#0f766e",
                  fontWeight: 600,
                  textDecoration: "none",
                  letterSpacing: "0.02em",
                }}
              >
                Create an account →
              </Link>
            </Typography>
          </Box>
        </Paper>
      </form>
    </Box>
  );
};

export default LoginPage;