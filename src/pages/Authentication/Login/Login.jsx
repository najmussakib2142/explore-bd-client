import React, { useState } from 'react';
import { FaEye, FaEyeSlash } from 'react-icons/fa';
import { Link, useLocation, useNavigate } from 'react-router';
import { useForm } from "react-hook-form"
import SocialLogin from '../SocialLogin/SocialLogin';
import useAuth from '../../../hooks/useAuth';
import Swal from 'sweetalert2';
import useAxios from '../../../hooks/useAxios';
// import useAxios from '../../../hooks/useAxios';


const Login = () => {
    const { signIn } = useAuth()
    const [error, setError] = useState("")
    const [showPassword, setShowPassword] = useState(false);
    const { register, handleSubmit, formState: { errors } } = useForm()
    const location = useLocation();
    const navigate = useNavigate()
    const from = location.state?.from || '/'
    const axiosInstance = useAxios()
    console.log(location);


    const onSubmit = data => {
        console.log(data);
        signIn(data.email, data.password)
            .then(async (result) => {
                const user = result.user;
                // console.log(user);
                Swal.fire({
                    icon: "success",
                    title: "Login Successful!",
                    text: `Welcome back, ${user.displayName || user.email}`,
                    showConfirmButton: false,
                    timer: 2000
                });
                const userInfo = {
                    email: data.email,
                    last_log_in: new Date().toISOString()
                }

                const userRes = await axiosInstance.post('/users', userInfo);
                console.log(userRes.data);

                navigate(from)
            })
            .catch(error => {
                const errorCode = error.code;
                // const errorMessage = error.message;
                setError(errorCode)

            })
    }


    return (
        <div className="card bg-base-100 w-full max-w-sm shrink-0 shadow-2xl">
            <div className="card-body">
                <h1 className="text-4xl font-bold text-primary text-center">Login now!</h1>
                <form onSubmit={handleSubmit(onSubmit)}>
                    <fieldset className="fieldset">

                        {/* email */}
                        <label className="label">Email</label>
                        <input required name='email' {...register('email')} type="email" className="input select-primary" placeholder="Email" />

                        {/* password */}
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

                        {error && <p className='text-red-500 text-sm'>{error}</p>}

                        <button className="btn  mt-4">Sign In</button>

                        <SocialLogin></SocialLogin>

                        <p className='text-center pt-3'>Dont’t Have An Account ?
                            <Link className='text-blue-600 hover:underline' to="/register"> Register </Link>
                        </p>

                    </fieldset>
                </form>
            </div>
        </div>
    );
};

export default Login;