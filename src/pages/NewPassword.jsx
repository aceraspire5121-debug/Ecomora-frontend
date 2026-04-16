import { Box, Typography, Paper, TextField, Button } from '@mui/material'
import React from 'react'
import { useForm } from 'react-hook-form'
import { useParams, Link } from 'react-router-dom'

const NewPassword = () => {
    const { token } = useParams() // params ek object hai to usse nikaloge to destructure karke nikaloge

    const {
        register,
        handleSubmit,
        watch,
        formState: { errors, isSubmitting },
    } = useForm()

    const password = watch("password")

    const submitting = async (data) => {
        console.log(data, token) // tu backend connect karega
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
                            Create new password
                        </Typography>

                        {/* Subtext */}
                        <Typography
                            variant="body2"
                            textAlign="center"
                            color="text.secondary"
                            sx={{ mb: -0.5 }}
                        >
                            Enter your new password below
                        </Typography>

                        {/* Password */}
                        <TextField
                            label="New Password"
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

                        {/* Confirm Password */}
                        <TextField
                            label="Confirm Password"
                            type="password"
                            fullWidth
                            sx={{ "& .MuiOutlinedInput-root": { borderRadius: 2 } }}
                            {...register("confirmPassword", {
                                required: "Please confirm your password",
                                validate: (value) => // value current ki value hai
                                    value === password || "Passwords do not match"
                            })}
                            error={!!errors.confirmPassword}
                            helperText={errors.confirmPassword?.message}
                        />

                        {/* Button */}
                        <Button
                            type="submit"
                            variant="contained"
                            size="large"
                            fullWidth
                            disabled={isSubmitting}
                        >
                            Reset Password
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

export default NewPassword