import { TextField, Button, Box, Typography, Alert, CircularProgress, Paper } from "@mui/material";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router-dom";
// import LoginPage from "./login";

const RegisterPage = () => {
    const {
        register,
        handleSubmit,
        setError,
        watch,
        clearErrors,
        formState: { errors, isSubmitting },
    } = useForm()

    const navigate = useNavigate()
    // handle submit
    const onSubmit = async (credentials) => {
        try {
            console.log("hii")
            const data = await fetch(`${import.meta.env.VITE_API_URL}/api/users/register`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(credentials),
            })
            const newdata = await data.json()
            if (!data.ok) {
                setError("MyError", {
                    type: "manual",
                    message: newdata.message
                })
                return;
            }

            //   data.ok kya check karta hai?
            //   true → status 200–299
            // false → error (400, 500 etc.)

            console.log(newdata.message)
            alert("Check your gmail to verify your email");
            navigate("/login")
        } catch (error) {
            console.log("Netword Error", error)
        }
    };

    return (
        <Box
            className="auth-bg-pattern"
            sx={{
                minHeight: "100%",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                py: 4,
                px: 2,
            }}
        >
            <form onSubmit={handleSubmit(onSubmit)} style={{ width: "100%", maxWidth: 400 }}>
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
                            Register
                        </Typography>
                        <Typography variant="body2" textAlign="center" color="text.secondary" sx={{ mb: -0.5 }}>
                            Create your Ecomora account
                        </Typography>

                        <TextField
                            label="Full Name"
                            fullWidth
                            sx={{ "& .MuiOutlinedInput-root": { borderRadius: 2 } }}
                            {...register("name", { required: "Name is required" })}
                            error={!!errors.name} // errors.name is undefined means false,!false=true then !true=false so !!undefined=false, if errors.name consists a object then errors.name=true, !errors.name=false, !!errors.name=true
                            helperText={errors.name?.message}
                        />

                        {/* error- controls ui style, if true then border becomes red, red label */}
                        {/* helperText- displays the message */}


                        <TextField
                            label="Phone Number"
                            fullWidth
                            sx={{ "& .MuiOutlinedInput-root": { borderRadius: 2 } }}
                            {...register("phoneNumber", {
                                required: "Phone Number is reuired",
                                onChange: () => clearErrors("MyError"),
                                pattern: {
                                    value: /^[0-9]{10}$/,
                                    message: "Enter a valid 10-digit phone number"
                                }
                            })}
                            error={!!errors.phoneNumber}
                            helperText={errors.phoneNumber?.message}
                        />

                        <TextField
                            label="Email"
                            type="email"

                            fullWidth
                            sx={{ "& .MuiOutlinedInput-root": { borderRadius: 2 } }}
                            {...register("email", {
                                required: "Email is required",
                                onChange: () => clearErrors("MyError"), // 👈 add this
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
                                required: "Password is required", minLength: { value: 6, message: "Password should be of minimum 6 characters" }, maxLength: { value: 15, message: "Password should be of maximum 15 characters" },
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
                        <Button type="submit" variant="contained" size="large" fullWidth disabled={isSubmitting}>
                            {isSubmitting ? (<CircularProgress size={24} color="inherit" />) : ("Register")}
                        </Button>

                        <Typography textAlign="center" variant="body2" color="text.secondary">
                            Already have an account?{" "}
                            <Link to="/login" style={{ color: "#0f766e", fontWeight: 700, textDecoration: "none" }}>
                                Login
                            </Link>
                        </Typography>
                    </Box>
                </Paper>
            </form>
        </Box>
    );
};

export default RegisterPage;
