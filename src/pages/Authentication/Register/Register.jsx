import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Link, useLocation, useNavigate } from 'react-router';
import useAuth from '../../../hooks/useAuth';
import SocialLogin from '../SocialLogin/SocialLogin';
import useAxios from '../../../hooks/useAxios';
import axios from 'axios';
import Swal from 'sweetalert2';
import { FaEye, FaEyeSlash } from 'react-icons/fa';

const Register = () => {
    const { createUser, updateUserProfile } = useAuth();
    const axiosInstance = useAxios();
    const navigate = useNavigate();
    const location = useLocation();
    const from = location.state?.from || '/';

    const [profilePic, setProfilePic] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    const { register, handleSubmit, watch, formState: { errors } } = useForm();
    const passwordValue = watch('password');

    const handleImageUpload = async (e) => {
        const image = e.target.files[0];
        if (!image) return;

        const formData = new FormData();
        formData.append('image', image);

        try {
            const uploadUrl = `https://api.imgbb.com/1/upload?key=${import.meta.env.VITE_image_upload_key}`;
            const res = await axios.post(uploadUrl, formData);
            setProfilePic(res.data.data.url);
        } catch (err) {
            console.error(err);
            Swal.fire('Error', 'Failed to upload image', 'error');
        }
    };

    const onSubmit = (data) => {
        if (!profilePic) {
            Swal.fire('Error', 'Profile picture is required', 'error');
            return;
        }

        Swal.fire({
            title: "Confirm Account Creation",
            text: "Do you want to create this account?",
            icon: "question",
            showCancelButton: true,
            confirmButtonText: "Yes, Create",
            cancelButtonText: "Cancel",
        }).then((result) => {
            if (!result.isConfirmed) return;

            createUser(data.email, data.password)
                .then(async (result) => {
                    const userInfo = {
                        email: data.email,
                        displayName: data.name,
                        photoURL: profilePic,
                        role: "user",
                        created_at: new Date().toISOString(),
                        last_log_in: new Date().toISOString(),
                    };

                    await axiosInstance.post("/users", userInfo);

                    const userProfile = { displayName: data.name, photoURL: profilePic };
                    updateUserProfile(userProfile)
                        .then(() => {
                            Swal.fire({
                                title: "Success!",
                                text: "Account created successfully 🎉",
                                icon: "success",
                                timer: 2000,
                                showConfirmButton: false,
                            });
                            navigate(from, { replace: true });
                        })
                        .catch((err) => {
                            Swal.fire("Error!", err?.message || "Profile update failed", "error");
                        });
                })
                .catch((error) => {
                    Swal.fire("Error!", error?.message || "Account creation failed", "error");
                });
        });
    };

    return (
        <div className="flex justify-center items-center min-h-screen  p-4">
            <div className="card bg-base-100 w-full max-w-md shadow-2xl rounded-2xl">
                <div className="card-body">
                    <h1 className="text-4xl font-bold text-center mb-6">Create An Account</h1>
                    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                        {/* Name */}
                        <div>
                            <label className="label">Your Name</label>
                            <input
                                type="text"
                                {...register('name', {
                                    required: "Name is required",
                                    minLength: { value: 2, message: "Name must be at least 2 characters" },
                                    pattern: { value: /^[A-Za-z\s]+$/, message: "Name must contain only letters" }
                                })}
                                className="input select-primary input-bordered w-full"
                                placeholder="Your Name"
                            />
                            {errors.name && <p className="text-red-500 mt-1">{errors.name.message}</p>}
                        </div>

                        {/* Profile Picture */}
                        <div>
                            <label className="label">Profile Picture</label>
                            <input
                                type="file"
                                accept="image/*"
                                onChange={handleImageUpload}
                                className="input select-primary input-bordered w-full"
                            />
                            {profilePic && <img src={profilePic} alt="preview" className="mt-2 w-24 h-24 object-cover rounded-full" />}
                        </div>

                        {/* Email */}
                        <div>
                            <label className="label">Email</label>
                            <input
                                type="email"
                                {...register('email', {
                                    required: "Email is required",
                                    pattern: { value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/, message: "Invalid email address" }
                                })}
                                className="input select-primary input-bordered w-full"
                                placeholder="Email"
                            />
                            {errors.email && <p className="text-red-500 mt-1">{errors.email.message}</p>}
                        </div>

                        {/* Password */}
                        <div className="relative">
                            <label className="label">Password</label>
                            <input
                                type={showPassword ? 'text' : 'password'}
                                {...register('password', {
                                    required: "Password is required",
                                    minLength: { value: 8, message: "Password must be at least 8 characters" },
                                    pattern: {
                                        value: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&]).+$/,
                                        message: "Password must include uppercase, lowercase, number, and special character"
                                    }
                                })}
                                className="input select-primary input-bordered w-full"
                                placeholder="Password"
                            />
                            <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                className="absolute right-3 top-8 text-primary"
                            >
                                {showPassword ? <FaEyeSlash /> : <FaEye />}
                            </button>
                            {errors.password && <p className="text-red-500 mt-1">{errors.password.message}</p>}
                        </div>

                        {/* Confirm Password */}
                        <div className="relative">
                            <label className="label">Confirm Password</label>
                            <input
                                type={showConfirmPassword ? 'text' : 'password'}
                                {...register('confirmPassword', {
                                    required: "Confirm your password",
                                    validate: value => value === passwordValue || "Passwords do not match"
                                })}
                                className="input select-primary input-bordered w-full"
                                placeholder="Confirm Password"
                            />
                            <button
                                type="button"
                                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                className="absolute right-3 top-8 text-primary"
                            >
                                {showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
                            </button>
                            {errors.confirmPassword && <p className="text-red-500 mt-1">{errors.confirmPassword.message}</p>}
                        </div>

                        {/* Submit */}
                        <button type="submit" className="btn btn-primary w-full mt-2">Register</button>
                    </form>

                    <p className="text-center mt-4">
                        Already have an account? <Link to="/login" className="text-blue-600 hover:underline">Login</Link>
                    </p>

                    <div className="mt-4">
                        <SocialLogin />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Register;
