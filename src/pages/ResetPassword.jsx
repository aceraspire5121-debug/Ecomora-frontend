import { Box, Typography, Paper, TextField, Button } from '@mui/material'
import React from 'react'
import { useForm } from 'react-hook-form'
import { Link } from 'react-router-dom'

const ResetPassword = () => {
    const {
        register,
        handleSubmit,
        setError,
        watch,
        clearErrors,
        formState: { errors, isSubmitting },
    } = useForm()

const submitting=async (e)=>{
try {
    const res=await fetch(`${import.meta.env.VITE_API_URL}/api/reset`,{
        method:"POST",
        headers:{"content-type":"application/json"},
        body:JSON.stringify({email:e.email})
    })
    const result=await res.json()
    if(!res.ok) // true:- 200 to 299, false:-400,401,404,500 etc
    {
    console.log(result.message)
    }


} catch (error) {
    console.log(error)
}
}

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
            <form onSubmit={handleSubmit(submitting)} style={{ width: "100%", maxWidth: 400 }} noValidate>
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
                        
                        {/* Heading */}
                        <Typography variant="h5" textAlign="center" fontWeight={700}>
                            Reset your password
                        </Typography>

                        {/* Subtext */}
                        <Typography
                            variant="body2"
                            textAlign="center"
                            color="text.secondary"
                            sx={{ mb: -0.5 }}
                        >
                            Enter your email to receive a reset link
                        </Typography>

                        {/* Email Input */}
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

                        {/* Button */}
                        <Button
                            type="submit"
                            variant="contained"
                            size="large"
                            fullWidth
                            disabled={isSubmitting}
                        >
                            Send reset link
                        </Button>

                        {/* Back to login */}
                        <Typography textAlign="center" variant="body2" color="text.secondary">
                            Remember your password?{" "}
                            <Link to="/login" style={{ color: "#0f766e", fontWeight: 700, textDecoration: "none" }}>
                                Sign in
                            </Link>
                        </Typography>

                    </Box>
                </Paper>
            </form>
        </Box>
    )
}

export default ResetPassword