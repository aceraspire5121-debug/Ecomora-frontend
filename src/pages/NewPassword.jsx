import { Box, Typography, Paper, TextField, Button, InputAdornment, CircularProgress } from '@mui/material'
import React from 'react'
import { useForm } from 'react-hook-form'
import { useParams, Link } from 'react-router-dom'
import { useNavigate } from 'react-router-dom'
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import LockResetOutlinedIcon from "@mui/icons-material/LockResetOutlined";

/* ── inject styles once ── */
const styleTag = document.createElement("style");
styleTag.textContent = `
  @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,400;0,600;1,400&family=DM+Sans:wght@300;400;500&display=swap');

  .ecm-newpw-root {
    min-height: 100vh;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 2rem 1rem;
    background: #faf6f0;
    background-image:
      radial-gradient(ellipse 70% 55% at 15% 15%, rgba(20,184,166,0.07) 0%, transparent 60%),
      radial-gradient(ellipse 60% 50% at 85% 85%, rgba(245,158,11,0.07) 0%, transparent 60%);
    position: relative;
    overflow: hidden;
  }

  .ecm-newpw-root::before,
  .ecm-newpw-root::after {
    content: '';
    position: absolute;
    border-radius: 50%;
    pointer-events: none;
    border: 1px solid rgba(20,184,166,0.1);
  }
  .ecm-newpw-root::before { width: 280px; height: 280px; top: -120px; left: -120px; }
  .ecm-newpw-root::after  { width: 220px; height: 220px; bottom: -100px; right: -100px; }

  .ecm-newpw-card {
    animation: ecmNewPwUp .55s cubic-bezier(.22,.68,0,1.2) both;
  }
  @keyframes ecmNewPwUp {
    from { opacity: 0; transform: translateY(28px) scale(0.98); }
    to   { opacity: 1; transform: translateY(0)   scale(1);    }
  }

  .ecm-newpw-field input {
    font-family: 'DM Sans', sans-serif !important;
    font-size: 0.9rem !important;
    color: #1c1917 !important;
  }
  .ecm-newpw-field label {
    font-family: 'DM Sans', sans-serif !important;
    font-size: 0.85rem !important;
  }

  .ecm-newpw-btn {
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
  .ecm-newpw-btn:hover:not(:disabled) {
    box-shadow: 0 8px 28px rgba(15,118,110,0.38) !important;
    transform: translateY(-1px) !important;
  }
  .ecm-newpw-btn:active { transform: translateY(0) !important; }
`;
if (!document.head.querySelector("[data-ecm-newpw]")) {
  styleTag.setAttribute("data-ecm-newpw", "1");
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

const NewPassword = () => {
  const { token } = useParams()
  const navigate = useNavigate()
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isSubmitting },
  } = useForm()

  const password = watch("password")

  const submitting = async (data) => {
    try {
      if (!token) {
        alert("Invalid or missing token")
        return;
      }
      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/reset-password/${token}`, {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ password: data.password })
      })
      const result = await res.json();
      if (!res.ok) {
        alert(result.message)
        return;
      }
      alert(result.message)
      setTimeout(() => { navigate("/login") }, 1000);
    } catch (error) {
      console.log(error)
      alert("Something went wrong. Please try again.")
    }
  }

  return (
    <Box className="ecm-newpw-root">

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
          className="ecm-newpw-card"
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
              <LockResetOutlinedIcon sx={{ fontSize: 24, color: "#0f766e" }} />
            </Box>

            <Typography sx={{
              fontFamily: "'Cormorant Garamond', serif",
              fontSize: "2rem", fontWeight: 600,
              color: "#1c1917", lineHeight: 1.15, letterSpacing: "0.01em",
            }}>
              New Password
            </Typography>
            <Typography sx={{
              fontFamily: "'DM Sans', sans-serif",
              fontSize: "0.82rem", color: "#78716c",
              mt: 0.6, fontWeight: 300, letterSpacing: "0.03em",
            }}>
              Enter and confirm your new password below
            </Typography>
          </Box>

          <Box display="flex" flexDirection="column" gap={1.8}>

            {/* New Password */}
            <TextField
              className="ecm-newpw-field"
              label="New Password"
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
                minLength: { value: 6, message: "Password should be of minimum 6 characters" },
                maxLength: { value: 15, message: "Password should be of maximum 15 characters" },
                pattern: {
                  value: /^(?=.*[A-Za-z])(?=.*\d).{6,}$/,
                  message: "Password must be at least 6 characters and include letters and numbers"
                }
              })}
              error={!!errors.password}
              helperText={errors.password?.message}
            />

            {/* Confirm Password */}
            <TextField
              className="ecm-newpw-field"
              label="Confirm Password"
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
              {...register("confirmPassword", {
                required: "Please confirm your password",
                validate: (value) => value === password || "Passwords do not match"
              })}
              error={!!errors.confirmPassword}
              helperText={errors.confirmPassword?.message}
            />

            {/* submit */}
            <Button
              type="submit"
              variant="contained"
              size="large"
              fullWidth
              className="ecm-newpw-btn"
              disabled={isSubmitting}
              sx={{ mt: 0.5 }}
            >
              {isSubmitting
                ? <CircularProgress size={20} color="inherit" />
                : "Reset Password"
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

export default NewPassword