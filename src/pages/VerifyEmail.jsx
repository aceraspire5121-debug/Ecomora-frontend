import {
  TextField,
  Button,
  Box,
  Typography,
  Alert,
  CircularProgress,
  Paper,
  Snackbar,
  InputAdornment,
} from "@mui/material";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router-dom";
import MailOutlineIcon from "@mui/icons-material/MailOutline";

/* ── inject styles once ── */
const styleTag = document.createElement("style");
styleTag.textContent = `
  @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,400;0,600;1,400&family=DM+Sans:wght@300;400;500&display=swap');

  .ecm-verify-root {
    min-height: 100vh;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 2rem 1rem;
    background: #faf6f0;
    background-image:
      radial-gradient(ellipse 80% 60% at 20% 0%, rgba(20,184,166,0.07) 0%, transparent 60%),
      radial-gradient(ellipse 60% 50% at 80% 100%, rgba(245,158,11,0.07) 0%, transparent 60%);
    position: relative;
    overflow: hidden;
  }

  .ecm-verify-root::before,
  .ecm-verify-root::after {
    content: '';
    position: absolute;
    width: 260px;
    height: 260px;
    border: 1px solid rgba(20,184,166,0.12);
    border-radius: 50%;
    pointer-events: none;
  }
  .ecm-verify-root::before { top: -100px; left: -100px; }
  .ecm-verify-root::after  { bottom: -120px; right: -120px; }

  .ecm-card2 {
    animation: ecmFadeUp2 .55s cubic-bezier(.22,.68,0,1.2) both;
  }
  @keyframes ecmFadeUp2 {
    from { opacity: 0; transform: translateY(28px) scale(0.98); }
    to   { opacity: 1; transform: translateY(0)   scale(1);    }
  }

  .ecm-field2 input {
    font-family: 'DM Sans', sans-serif !important;
    font-size: 0.9rem !important;
    color: #1c1917 !important;
  }
  .ecm-field2 label {
    font-family: 'DM Sans', sans-serif !important;
    font-size: 0.85rem !important;
  }

  .ecm-submit-btn2 {
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
  .ecm-submit-btn2:hover:not(:disabled) {
    box-shadow: 0 8px 28px rgba(15,118,110,0.38) !important;
    transform: translateY(-1px) !important;
  }
  .ecm-submit-btn2:active {
    transform: translateY(0) !important;
  }
`;
if (!document.head.querySelector("[data-ecm-verify]")) {
  styleTag.setAttribute("data-ecm-verify", "1");
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

const VerifyEmailPage = () => {
  const {
    register,
    handleSubmit,
    setError,
    clearErrors, 
    formState: { errors, isSubmitting },
  } = useForm();

  const [msg, setmsg] = useState("");
  const [open, setopen] = useState(false);
  const [severity, setseverity] = useState("");

  const showSnackbar = (message, type = "success") => {
    setmsg(message);
    setseverity(type);
    setopen(true);
  };

  const navigate = useNavigate();

  const onSubmit = async (values) => {
    try {
        console.log("hii")
        const res=await fetch(`${import.meta.env.VITE_API_URL}/api/email/sendverficationemail`,
            {
                method:"POST",
          headers: { "Content-Type": "application/json" },
            body: JSON.stringify(values),
            }
        )
        const data=await res.json();

        if(!res?.ok)
          {
            console.log(data);
            setError("MyError",{type:"manual",message:data.message});
            return;
          }
      showSnackbar("Verification link sent! Check your inbox.", "info");
    } catch (error) {
      setError("MyError", { type: "manual", message: "Something went wrong. Try again." });
    }
  };

  return (
    <Box className="ecm-verify-root">
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
        onSubmit={handleSubmit(onSubmit)}
        style={{ width: "100%", maxWidth: 420 }}
      >
        <Paper
          className="ecm-card2"
          elevation={0}
          sx={{
            p: { xs: "28px 24px", sm: "40px 36px" },
            borderRadius: "20px",
            border: "1px solid rgba(15,118,110,0.13)",
            background: "rgba(255,252,248,0.96)",
            backdropFilter: "blur(16px)",
            boxShadow:
              "0 2px 0 rgba(255,255,255,0.8) inset, 0 32px 64px -24px rgba(15,23,42,0.14), 0 0 0 1px rgba(255,255,255,0.5)",
          }}
        >
          <Box sx={{ mb: 3, textAlign: "center" }}>
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
                fontSize: "2rem",
                fontWeight: 600,
                color: "#1c1917",
                lineHeight: 1.15,
                letterSpacing: "0.01em",
              }}
            >
              Verify Your Email
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
              Enter your email to receive a verification link
            </Typography>
          </Box>

          <Box display="flex" flexDirection="column" gap={1.8}>
            <TextField
              className="ecm-field2"
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

            {errors.MyError && ( //myerror me submit function ke andar catch block me set kar raha hu aur koi error hua to use yaha display kar raha hu
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

            <Button
              type="submit"
              variant="contained"
              size="large"
              fullWidth
              className="ecm-submit-btn2"
              disabled={isSubmitting}
              sx={{ mt: 0.5 }}
            >
              {isSubmitting ? (
                <CircularProgress size={20} color="inherit" />
              ) : (
                "Send Verification Link"
              )}
            </Button>

            <Typography
              textAlign="center"
              sx={{
                fontFamily: "'DM Sans', sans-serif",
                fontSize: "0.84rem",
                color: "#78716c",
              }}
            >
              <Link
                to="/login"
                style={{
                  color: "#0f766e",
                  fontWeight: 600,
                  textDecoration: "none",
                  letterSpacing: "0.02em",
                }}
              >
                ← Back to Login
              </Link>
            </Typography>
          </Box>
        </Paper>
      </form>

      <Snackbar
        open={open}
        autoHideDuration={2000}
        onClose={() => setopen(false)}
        anchorOrigin={{ vertical: "top", horizontal: "right" }}
      >
        <Alert severity={severity} variant="filled" onClose={() => setopen(false)}>
          {msg}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default VerifyEmailPage;