import React, { useState } from 'react';
import { FaEye, FaEyeSlash } from 'react-icons/fa';
import { Link, useLocation, useNavigate } from 'react-router';
import { useForm } from "react-hook-form";
import Swal from 'sweetalert2';
import SocialLogin from '../SocialLogin/SocialLogin';
import useAuth from '../../../hooks/useAuth';

const Login = () => {
    const { signIn, resetPassword } = useAuth();
    const [error, setError] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const { register, handleSubmit, formState: { errors } } = useForm();
    const location = useLocation();
    const navigate = useNavigate();
    const from = location.state?.from || "/";

    // Login submit handler
    const onSubmit = async (data) => {
        setError("");
        try {
            const result = await signIn(data.email, data.password);
            const user = result.user;

            Swal.fire({
                icon: "success",
                title: `<strong>Login Successful!</strong>`,
                html: `<p style="font-size: 16px; color: #333;">Welcome back, <strong>${user.displayName || user.email}</strong>!</p>`,
                showConfirmButton: false,
                timer: 2000,
                timerProgressBar: true,
                backdrop: `
        rgba(0,0,0,0.4)
        left top
        no-repeat
    `,
                didOpen: () => {
                    // Optional: Customize progress bar color
                    const progressBar = Swal.getHtmlContainer().parentElement.querySelector('.swal2-timer-progress-bar');
                    if (progressBar) progressBar.style.background = "#1E88E5";
                },
            });

            navigate(from, { replace: true });
        } catch (err) {
            console.log(err);
            let message = "";
            switch (err.code) {
                case "auth/user-not-found":
                    message = "No account found with this email.";
                    break;
                case "auth/wrong-password":
                    message = "Password is incorrect.";
                    break;
                case "auth/invalid-credential":
                    message = "Invalid login credentials.";
                    break;
                case "auth/too-many-requests":
                    message = "Too many login attempts. Try again later.";
                    break;
                default:
                    message = "Login failed. Please try again.";
            }
            setError(message);
        }
    };

    // Forgot password handler
    const handleForgotPassword = async () => {
        const email = prompt("Please enter your registered email:");
        if (!email) return;

        try {
            await resetPassword(email);
            Swal.fire({
                icon: "success",
                title: "Reset Email Sent!",
                text: `A password reset link has been sent to ${email}`,
            });
        } catch (err) {
            Swal.fire({
                icon: "error",
                title: "Error",
                text: err.message,
            });
        }
    };

    return (
        <div className="flex justify-center items-center min-h-[80vh] px-4">
            <div className="card bg-base-100 w-full max-w-md shadow-xl rounded-2xl p-6">
                <h1 className="text-3xl font-bold text-primary text-center mb-6">
                    Login to Your Account
                </h1>

                <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
                    {/* Email */}
                    <div>
                        <label className="label font-medium">Email</label>
                        <input
                            {...register("email", { required: true })}
                            type="email"
                            placeholder="Enter your email"
                            className="input select-primary input-bordered w-full"
                        />
                        {errors.email && (
                            <p className="text-red-500 text-sm mt-1">Email is required</p>
                        )}
                    </div>

                    {/* Password */}
                    <div>
                        <label className="label font-medium">Password</label>
                        <div className="relative">
                            <input
                                {...register("password", { required: true, minLength: 6 })}
                                type={showPassword ? "text" : "password"}
                                placeholder="Enter your password"
                                className="input select-primary input-bordered w-full pr-10"
                            />
                            <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                className="absolute right-3 top-3 text-primary"
                            >
                                {showPassword ? <FaEyeSlash /> : <FaEye />}
                            </button>
                        </div>
                        {errors.password?.type === "required" && (
                            <p className="text-red-500 text-sm mt-1">Password is required</p>
                        )}
                        {errors.password?.type === "minLength" && (
                            <p className="text-red-500 text-sm mt-1">
                                Password must be 6 characters or longer
                            </p>
                        )}
                    </div>

                    {/* Forgot Password */}
                    <div>
                        <button
                            type="button"
                            onClick={handleForgotPassword}
                            className="link link-hover text-sm text-primary"
                        >
                            Forgot password?
                        </button>
                    </div>

                    {/* Server-side Error */}
                    {error && <p className="text-red-500 text-sm text-center">{error}</p>}

                    {/* Submit */}
                    <button className="btn btn-primary w-full mt-2">Sign In</button>
                </form>

                {/* Social Login */}
                <div className="mt-6">
                    <SocialLogin />
                </div>

                {/* Register Redirect */}
                <p className="text-center mt-6 text-sm">
                    Don’t have an account?{" "}
                    <Link
                        state={{ from }}
                        to="/register"
                        className="text-primary font-medium hover:underline"
                    >
                        Register
                    </Link>
                </p>
            </div>
        </div>
    );
};

export default Login;
