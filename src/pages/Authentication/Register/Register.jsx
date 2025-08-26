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

    const { register, handleSubmit, formState: { errors } } = useForm()
    const { createUser, updateUserProfile } = useAuth();
    const [profilePic, setProfilePic] = useState('')
    const axiosInstance = useAxios();
    const navigate = useNavigate();
    const location = useLocation();
    const from = location.state?.from || '/'
    const [showPassword, setShowPassword] = useState(false);

    const onSubmit = (data) => {
        console.log(data);

        // Confirmation before creating user
        Swal.fire({
            title: "Are you sure?",
            text: "Do you want to create this account?",
            icon: "question",
            showCancelButton: true,
            confirmButtonText: "Yes, Create",
            cancelButtonText: "Cancel",
        }).then((result) => {
            if (!result.isConfirmed) return;

            createUser(data.email, data.password)
                .then(async (result) => {
                    console.log(result.user);

                    // update user info in database
                    const userInfo = {
                        email: data.email,
                        displayName: data.name,
                        photoURL: profilePic,
                        role: "user",
                        created_at: new Date().toISOString(),
                        last_log_in: new Date().toISOString(),
                    };
                    const userRes = await axiosInstance.post("/users", userInfo);
                    console.log(userRes.data);

                    // update in firebase
                    const userProfile = {
                        displayName: data.name,
                        photoURL: profilePic
                    }
                    updateUserProfile(userProfile)
                        .then(() => {
                            console.log("profile name pic updated");

                            // Auto success message
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
                            console.log(err);
                            Swal.fire("Error!", err?.message || "Profile update failed", "error");
                        });
                })
                .catch((error) => {
                    console.error(error);
                    Swal.fire("Error!", error?.message || "Account creation failed", "error");
                });
        });
    };

    const handleImageUpload = async (e) => {
        const image = e.target.files[0];
        // console.log(image);

        const formData = new FormData();
        formData.append('image', image)

        const imagUploadUrl = `https://api.imgbb.com/1/upload?key=${import.meta.env.VITE_image_upload_key}`
        const res = await axios.post(imagUploadUrl, formData)
        // console.log(res.data.data.url);
        setProfilePic(res.data.data.url);
    }

    return (
        <div>
            <div className="card bg-base-100 w-full max-w-sm shrink-0 shadow-2xl">
                <div className="card-body">
                    <h1 className="text-5xl font-bold">Create An Account!</h1>
                    <form onSubmit={handleSubmit(onSubmit)}>
                        <fieldset className="fieldset">
                            {/* name */}
                            <label className="label">Your Name</label>
                            <input type="text" {...register('name', { required: true })}
                                className="input select-primary" placeholder="Your Name"
                            />
                            {
                                errors.name?.type === 'required' &&
                                <p className='text-red-500'>Email is Required</p>
                            }
                            {/* photo */}
                            <label className="label">Your Profile Picture</label>
                            <input type="file"
                                onChange={handleImageUpload}
                                className="input select-primary" placeholder="Your Profile Picture"
                            />
                            {/* {
                                errors.email?.type === 'required' &&
                                <p className='text-red-500'>Email is Required</p>
                            } */}
                            {/* email */}
                            <label className="label">Email</label>
                            <input type="email" {...register('email', { required: true })}
                                className="input select-primary" placeholder="Email"
                            />
                            {
                                errors.email?.type === 'required' &&
                                <p className='text-red-500'>Email is Required</p>
                            }

                            <label className="label">Password</label>
                            <div className='relative'>
                                <input
                                    name='password'
                                    {...register('password', {
                                        required: true,
                                        minLength: 6,
                                        // pattern: /^[A-Za-z]+$/i
                                    })}
                                    type={showPassword ? 'text' : "password"}
                                    className="input select-primary"
                                    placeholder="Password"
                                />
                                {
                                    errors.password?.type === "required" &&
                                    (<p className='text-red-500 pt-2'>Password is required</p>)
                                }
                                {
                                    errors.password?.type === "minLength" &&
                                    (<p className='text-red-500 pt-2'>Password must be 6 characters or longer</p>)
                                }
                                <button
                                    onClick={() => setShowPassword(!showPassword)}
                                    className='absolute btn btn-xs right-5 top-2'
                                    type='button'
                                >
                                    {showPassword ? <FaEyeSlash></FaEyeSlash> : <FaEye></FaEye>}
                                </button>
                            </div>

                            <div><a className="link link-hover">Forgot password?</a></div>
                            <button className="btn btn-primary text-black mt-4">Register</button>
                        </fieldset>
                        <p><small>Already have an account? <Link className='text-blue-600 hover:underline' to="/login">Login</Link></small></p>
                    </form>
                    <SocialLogin></SocialLogin>
                </div>
            </div>
        </div>
    );
};

export default Register;