import React, { useState } from 'react';
import { FaEye, FaEyeSlash } from 'react-icons/fa';
import { Link, useLocation, useNavigate } from 'react-router';
import { useForm } from "react-hook-form";
import SocialLogin from '../SocialLogin/SocialLogin';
import useAuth from '../../../hooks/useAuth';
import Swal from 'sweetalert2';
import useAxios from '../../../hooks/useAxios';

const Login = () => {
    const { signIn } = useAuth();
    const [error, setError] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const { register, handleSubmit, formState: { errors } } = useForm();
    const location = useLocation();
    const navigate = useNavigate();
    const from = location.state?.from || "/";
    const axiosInstance = useAxios();

    const onSubmit = async (data) => {
        try {
            const result = await signIn(data.email, data.password);
            const user = result.user;

            Swal.fire({
                icon: "success",
                title: "Login Successful!",
                text: `Welcome back, ${user.displayName || user.email}`,
                showConfirmButton: false,
                timer: 2000,
            });

            const userInfo = {
                email: data.email,
                last_log_in: new Date().toISOString(),
            };

            await axiosInstance.post("/users", userInfo);
            navigate(from, { replace: true });
        } catch (err) {
            let message = "";
            switch (err.code) {
                case "auth/user-not-found":
                    message = "No account found with this email.";
                    break;
                case "auth/wrong-password":
                    message = "Password is incorrect.";
                    break;
                case "auth/invalid-credential":
                    message = "Invalid login credentials. Please try again.";
                    break;
                case "auth/too-many-requests":
                    message = "Too many attempts. Please try again later.";
                    break;
                default:
                    message = "Login failed. Please try again.";
            }
            setError(message);
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
                                className="absolute right-3 top-3 text-gray-500 hover:text-primary"
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
                    <div className="text-right">
                        <a className="link link-hover text-sm text-primary">
                            Forgot password?
                        </a>
                    </div>

                    {/* Error Message */}
                    {error && <p className="text-red-500 text-sm text-center">{error}</p>}

                    {/* Submit Button */}
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







// import React, { useState } from 'react';
// import { FaEye, FaEyeSlash } from 'react-icons/fa';
// import { Link, useLocation, useNavigate } from 'react-router';
// import { useForm } from "react-hook-form"
// import SocialLogin from '../SocialLogin/SocialLogin';
// import useAuth from '../../../hooks/useAuth';
// import Swal from 'sweetalert2';
// import useAxios from '../../../hooks/useAxios';
// // import useAxios from '../../../hooks/useAxios';


// const Login = () => {
//     const { signIn } = useAuth()
//     const [error, setError] = useState("")
//     const [showPassword, setShowPassword] = useState(false);
//     const { register, handleSubmit, formState: { errors } } = useForm()
//     const location = useLocation();
//     const navigate = useNavigate()
//     const from = location.state?.from || '/'
//     const axiosInstance = useAxios()
//     console.log(location);


//     const onSubmit = data => {
//         console.log(data);
//         signIn(data.email, data.password)
//             .then(async (result) => {
//                 const user = result.user;
//                 // console.log(user);
//                 Swal.fire({
//                     icon: "success",
//                     title: "Login Successful!",
//                     text: `Welcome back, ${user.displayName || user.email}`,
//                     showConfirmButton: false,
//                     timer: 2000
//                 });
//                 const userInfo = {
//                     email: data.email,
//                     last_log_in: new Date().toISOString()
//                 }

//                 const userRes = await axiosInstance.post('/users', userInfo);
//                 console.log(userRes.data);

//                 navigate(from, { replace: true })
//             })
//             .catch(error => {
//                 const errorCode = error.code;
//                 // const errorMessage = error.message;
//                 setError(errorCode)

//             })
//     }


//     return (
//         <div className="card bg-base-100 w-full max-w-sm shrink-0 shadow-2xl">
//             <div className="card-body">
//                 <h1 className="text-4xl font-bold text-primary text-center">Login now!</h1>
//                 <form onSubmit={handleSubmit(onSubmit)}>
//                     <fieldset className="fieldset">

//                         {/* email */}
//                         <label className="label">Email</label>
//                         <input required name='email' {...register('email')} type="email" className="input select-primary" placeholder="Email" />

//                         {/* password */}
//                         <label className="label">Password</label>
//                         <div className='relative'>
//                             <input
//                                 name='password'
//                                 {...register('password', {
//                                     required: true,
//                                     minLength: 6,
//                                     // pattern: /^[A-Za-z]+$/i
//                                 })}
//                                 type={showPassword ? 'text' : "password"}
//                                 className="input select-primary"
//                                 placeholder="Password"
//                             />
//                             {
//                                 errors.password?.type === "required" &&
//                                 (<p className='text-red-500 pt-2'>Password is required</p>)
//                             }
//                             {
//                                 errors.password?.type === "minLength" &&
//                                 (<p className='text-red-500 pt-2'>Password must be 6 characters or longer</p>)
//                             }
//                             <button
//                                 onClick={() => setShowPassword(!showPassword)}
//                                 className='absolute btn btn-xs right-5 top-2'
//                                 type='button'
//                             >
//                                 {showPassword ? <FaEyeSlash></FaEyeSlash> : <FaEye></FaEye>}
//                             </button>
//                         </div>

//                         <div><a className="link link-hover">Forgot password?</a></div>

//                         {error && <p className='text-red-500 text-sm'>{error}</p>}

//                         <button className="btn  mt-4">Sign In</button>

//                         <SocialLogin></SocialLogin>

//                         <p className='text-center pt-3'>Dont’t Have An Account ?
//                             <Link state={{ from }} className='text-blue-600 hover:underline' to="/register"> Register </Link>
//                         </p>

//                     </fieldset>
//                 </form>
//             </div>
//         </div>
//     );
// };

// export default Login;