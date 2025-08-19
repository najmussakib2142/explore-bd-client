import React from 'react';
import { useForm } from 'react-hook-form';
import { Link } from 'react-router';
import useAuth from '../../../hooks/useAuth';
import SocialLogin from '../SocialLogin/SocialLogin';

const Register = () => {

    const { register, handleSubmit, formState: { errors } } = useForm()
    const { createUser } = useAuth()

    const onSubmit = data => {
        console.log(data);
        createUser(data.email, data.password)
            .then(result => {
                console.log(result.user);
            })
            .catch(error => {
                console.error(error)
            })
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
                                className="input" placeholder="Your Name"
                            />
                            {
                                errors.name?.type === 'required' &&
                                <p className='text-red-500'>Email is Required</p>
                            }
                            {/* photo */}
                            <label className="label">Your Profile Picture</label>
                            <input type="file"
                                // onChange={handleImageUpload}
                                className="input" placeholder="Your Profile Picture"
                            />
                            {/* {
                                errors.email?.type === 'required' &&
                                <p className='text-red-500'>Email is Required</p>
                            } */}
                            {/* email */}
                            <label className="label">Email</label>
                            <input type="email" {...register('email', { required: true })}
                                className="input" placeholder="Email"
                            />
                            {
                                errors.email?.type === 'required' &&
                                <p className='text-red-500'>Email is Required</p>
                            }

                            {/* password */}
                            <label className="label">Password</label>
                            <input type="password" {...register('password', { required: true, minLength: 6 })}
                                className="input" placeholder="Password"
                            />
                            {
                                errors.password?.type === "required" &&
                                (<p className='text-red-500'>Password is required</p>)
                            }
                            {
                                errors.password?.type === "minLength" &&
                                (<p className='text-red-500'>Password must be 6 characters or longer</p>)
                            }

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