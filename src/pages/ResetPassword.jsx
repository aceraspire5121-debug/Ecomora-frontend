import { Box, Typography, Paper, TextField, Button, CircularProgress, InputAdornment } from '@mui/material'
import React from 'react'
import { useForm } from 'react-hook-form'
import { Link } from 'react-router-dom'
import MailOutlineIcon from "@mui/icons-material/MailOutline";
import MarkEmailReadOutlinedIcon from "@mui/icons-material/MarkEmailReadOutlined";

/* ── inject styles once ── */
const styleTag = document.createElement("style");
styleTag.textContent = `
  @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,400;0,600;1,400&family=DM+Sans:wght@300;400;500&display=swap');

  .ecm-reset-root {
    min-height: 100vh;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 2rem 1rem;
    background: #faf6f0;
    background-image:
      radial-gradient(ellipse 65% 55% at 50% -10%, rgba(20,184,166,0.09) 0%, transparent 60%),
      radial-gradient(ellipse 55% 45% at 50% 110%, rgba(245,158,11,0.07) 0%, transparent 60%);
    position: relative;
    overflow: hidden;
  }

  .ecm-reset-root::before,
  .ecm-reset-root::after {
    content: '';
    position: absolute;
    border-radius: 50%;
    pointer-events: none;
    border: 1px solid rgba(20,184,166,0.1);
  }
  .ecm-reset-root::before { width: 240px; height: 240px; top: -100px; right: -80px; }
  .ecm-reset-root::after  { width: 200px; height: 200px; bottom: -90px; left: -80px; }

  .ecm-reset-card {
    animation: ecmResetUp .55s cubic-bezier(.22,.68,0,1.2) both;
  }
  @keyframes ecmResetUp {
    from { opacity: 0; transform: translateY(28px) scale(0.98); }
    to   { opacity: 1; transform: translateY(0)   scale(1);    }
  }

  .ecm-reset-field input {
    font-family: 'DM Sans', sans-serif !important;
    font-size: 0.9rem !important;
    color: #1c1917 !important;
  }
  .ecm-reset-field label {
    font-family: 'DM Sans', sans-serif !important;
    font-size: 0.85rem !important;
  }

  .ecm-reset-btn {
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
  .ecm-reset-btn:hover:not(:disabled) {
    box-shadow: 0 8px 28px rgba(15,118,110,0.38) !important;
    transform: translateY(-1px) !important;
  }
  .ecm-reset-btn:active { transform: translateY(0) !important; }
`;
if (!document.head.querySelector("[data-ecm-reset]")) {
  styleTag.setAttribute("data-ecm-reset", "1");
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

const ResetPassword = () => {
  const {
    register,
    handleSubmit,
    clearErrors,
    formState: { errors, isSubmitting },
  } = useForm()

  const submitting = async (e) => {
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/reset/checkemail`, {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ email: e.email })
      })
      const result = await res.json()
      if (!res.ok) {
        alert(result.message)
        return;
      }
      console.log("success")
      alert(result.message)
    } catch (error) {
      console.log(error)
    }
  }

  return (
    <Box className="ecm-reset-root">

      {/* wordmark */}
      <Box sx={{
        position: "absolute", top: 24, left: 32,
        fontFamily: "'Cormorant Garamond', serif",
        fontSize: "1.35rem", fontWeight: 600,
        color: "#0f766e", letterSpacing: "0.04em",
        display: { xs: "none", sm: "block" },
      }}>
        Ecomora
      </Box>

      <form onSubmit={handleSubmit(submitting)} style={{ width: "100%", maxWidth: 420 }} noValidate>
        <Paper
          className="ecm-reset-card"
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
            {/* icon bubble */}
            <Box sx={{
              width: 52, height: 52, borderRadius: "14px",
              background: "linear-gradient(135deg, rgba(15,118,110,0.1), rgba(245,158,11,0.08))",
              border: "1px solid rgba(15,118,110,0.15)",
              display: "flex", alignItems: "center", justifyContent: "center",
              mx: "auto", mb: 2,
            }}>
              <MarkEmailReadOutlinedIcon sx={{ fontSize: 24, color: "#0f766e" }} />
            </Box>

            <Typography sx={{
              fontFamily: "'Cormorant Garamond', serif",
              fontSize: "2rem", fontWeight: 600,
              color: "#1c1917", lineHeight: 1.15, letterSpacing: "0.01em",
            }}>
              Reset Password
            </Typography>
            <Typography sx={{
              fontFamily: "'DM Sans', sans-serif",
              fontSize: "0.82rem", color: "#78716c",
              mt: 0.6, fontWeight: 300, letterSpacing: "0.03em",
            }}>
              Enter your email to receive a reset link
            </Typography>
          </Box>

          <Box display="flex" flexDirection="column" gap={1.8}>

            {/* Email */}
            <TextField
              className="ecm-reset-field"
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
                  message: "Enter a valid email address"
                }
              })}
              error={!!errors.email}
              helperText={errors.email?.message}
            />

            {/* submit */}
            <Button
              type="submit"
              variant="contained"
              size="large"
              fullWidth
              className="ecm-reset-btn"
              disabled={isSubmitting}
              sx={{ mt: 0.5 }}
            >
              {isSubmitting
                ? <CircularProgress size={20} color="inherit" />
                : "Send Reset Link"
              }
            </Button>

            {/* back to login */}
            <Typography textAlign="center" sx={{
              fontFamily: "'DM Sans', sans-serif",
              fontSize: "0.84rem", color: "#78716c",
            }}>
              <Link to="/login" style={{
                color: "#0f766e", fontWeight: 600,
                textDecoration: "none", letterSpacing: "0.02em"
              }}>
                ← Back to Sign In
              </Link>
            </Typography>

          </Box>
        </Paper>
      </form>
    </Box>
  )
}

export default ResetPassword