import { TextField, Button, Box, Typography, CircularProgress, Alert, Paper } from "@mui/material";
import { Link,useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { useEffect } from "react";
import { getUserFromToken } from "../utils/auth";
const LoginPage = () => {
     const user=getUserFromToken()
    const navigate=useNavigate()

   useEffect(() => {
    if (user) {
        if (user.role === "admin") {
            navigate("/admin/products");
        } else {
            navigate("/user/products");
        }
    }
}, [user, navigate]);
    

    const {
        register,
        handleSubmit,
        setError,
        watch,
        clearErrors,
        formState: { errors, isSubmitting },
    } = useForm()

    // handle submit
    const onSubmiting = async (data) => {
        try {
            const res = await fetch(`${import.meta.env.VITE_API_URL}/api/users/login`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(data)
            })
            const newdata = await res.json()
            if (!res.ok) {
                setError("MyError", {
                    type: "manual",
                    message: newdata.message
                })
                return;
            }
            console.log("Success", newdata)
            localStorage.setItem("CommerceToken", newdata.token)
            if(newdata.user.role==="admin")
                navigate("/admin/products")
            else
                navigate("/user/products")

        } catch (error) {
            console.log("Network Error", error)
        }
    };

    return (
        <Box
            className="auth-bg-pattern" // isse bo square pattern aa raha hai background me
            sx={{
                minHeight: "100%",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                py: 4,
                px: 2,
            }}
        >
            <form onSubmit={handleSubmit(onSubmiting)} style={{ width: "100%", maxWidth: 400 }} noValidate>
                <Paper
                    elevation={0}
                    sx={{
                        p: { xs: 3, sm: 4 },
                        borderRadius: 3,
                        border: "1px solid rgba(15, 118, 110, 0.15)",
                        background: "rgba(255, 255, 255, 0.92)",
                        backdropFilter: "blur(10px)",
                        boxShadow: "0 25px 50px -24px rgba(15, 23, 42, 0.18)",
                    }}
                >
                    <Box display="flex" flexDirection="column" gap={2}>
                        <Typography variant="h5" textAlign="center" fontWeight={700}>
                            Welcome back
                        </Typography>
                        <Typography variant="body2" textAlign="center" color="text.secondary" sx={{ mb: -0.5 }}>
                            Sign in to your Ecomora account
                        </Typography>

                        <TextField
                            label="Email"
                            type="email"
                            fullWidth
                            sx={{ "& .MuiOutlinedInput-root": { borderRadius: 2 } }}
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

                        <TextField
                            label="Password"
                            type="password"
                            fullWidth
                            sx={{ "& .MuiOutlinedInput-root": { borderRadius: 2 } }}
                            {...register("password", {
                                required: "Password is required", minLength: { value: 6, message: "Password must be of 6 characters" }, maxLength: { value: 15, message: "Password cannot be more than 15 characters" },
                                onChange: () => clearErrors("MyError"),
                                pattern: {
                                   value: /^(?=.*[A-Za-z])(?=.*\d).{6,}$/,
                                    message: "Password must be at least 6 characters and include letters and numbers"
                                }
                            })}
                            error={!!errors.password}
                            helperText={errors.password?.message}
                        />

                        {errors.MyError && (
                            <Alert severity="error" sx={{ borderRadius: 2 }}>
                                {errors.MyError.message}
                            </Alert>
                        )}

                        <Button type="submit" variant="contained" size="large" fullWidth disabled={isSubmitting} >
                            {isSubmitting ? (<CircularProgress size={24} color="inherit" />) : ("Login")}
                        </Button>

                        <Typography textAlign="center" variant="body2" color="text.secondary">
                            Don&apos;t have an account?{" "}
                            <Link to="/" style={{ color: "#0f766e", fontWeight: 700, textDecoration: "none" }}>
                                Register
                            </Link>
                        </Typography>
                        <Typography textAlign="center" variant="body2" color="text.secondary">
                            Trouble signing in?{" "}
                            <Link to="/reset" style={{ color: "#0f766e", fontWeight: 700, textDecoration: "none" }}>
                                Reset your password
                            </Link>
                        </Typography>
                    </Box>
                </Paper>
            </form>
        </Box>
    );
};

export default LoginPage;
