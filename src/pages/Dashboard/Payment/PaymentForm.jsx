import { CardElement, useElements, useStripe } from '@stripe/react-stripe-js';
import { useQuery } from '@tanstack/react-query';
import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router';
import useAxiosSecure from '../../../hooks/useAxiosSecure';
import Loading from '../../shared/Loading/Loading';
import useAuth from '../../../hooks/useAuth';
import Swal from 'sweetalert2';
import { motion } from "framer-motion";


const PaymentForm = () => {
    const { user } = useAuth();
    const stripe = useStripe();
    const elements = useElements();
    const { bookingId } = useParams();
    const navigate = useNavigate();
    const axiosSecure = useAxiosSecure();
    const [error, setError] = useState('');

    // 1️⃣ Load booking info
    const { isPending, data: bookingInfo = {} } = useQuery({
        queryKey: ['booking', bookingId],
        queryFn: async () => {
            const res = await axiosSecure.get(`/bookings/${bookingId}`);
            return res.data;
        }
    });

    if (isPending) return <Loading />;

    const amount = bookingInfo.price;
    const amountInCents = amount * 100;

    // 2️⃣ Main payment function
    const processPayment = async () => {
        if (!stripe || !elements) return;

        const card = elements.getElement(CardElement);
        if (!card) return;

        try {
            // Create payment intent on backend
            const { data: paymentIntentData } = await axiosSecure.post('/create-payment-intent', {
                amountInCents
            });

            const clientSecret = paymentIntentData.clientSecret;

            // Confirm card payment
            const result = await stripe.confirmCardPayment(clientSecret, {
                payment_method: {
                    card,
                    billing_details: {
                        name: user.displayName,
                        email: user.email
                    },
                },
            });

            if (result.error) {
                setError(result.error.message);
            } else if (result.paymentIntent.status === 'succeeded') {
                const transactionId = result.paymentIntent.id;

                // Save payment info
                const paymentData = {
                    packageId: bookingInfo.packageId,
                    bookingId,
                    email: user.email,
                    amount,
                    transactionId,
                    paymentMethod: result.paymentIntent.payment_method_types
                };

                const paymentRes = await axiosSecure.post('/payments', paymentData);

                if (paymentRes.data.insertedId) {
                    Swal.fire({
                        title: '✅ Payment Successful',
                        html: `
                            <div class="text-left text-base space-y-2">
                                <p><strong>Package:</strong> ${bookingInfo.packageName}</p>
                                <p><strong>Amount Paid:</strong> $${amount}</p>
                                <hr class="my-2"/>
                                <p class="text-green-600 font-bold">Transaction ID:</p>
                                <p class="text-gray-600 text-sm">${transactionId}</p>
                            </div>
                        `,
                        icon: 'success',
                        confirmButtonText: 'OK',
                        confirmButtonColor: '#16a34a',
                    }).then(() => navigate('/dashboard/myBookings'));
                }
            }
        } catch (err) {
            console.error(err);
            setError('Payment failed. Please try again.');
        }
    };

    // 3️⃣ Handle confirm button click
    const handleConfirmClick = () => {
        Swal.fire({
            title: 'Are you sure?',
            text: `You are about to pay $${amount} for ${bookingInfo.packageName}.`,
            icon: 'warning',
            showCancelButton: true,
            confirmButtonText: 'Yes, Pay Now',
            cancelButtonText: 'Cancel',
            confirmButtonColor: '#1E88E5',
            cancelButtonColor: '#d33',
        }).then((result) => {
            if (result.isConfirmed) {
                processPayment();
            }
        });
    };

    return (
        <motion.div
            className="max-w-xl mx-auto bg-white dark:bg-gray-900 rounded-2xl shadow-2xl p-6 border border-gray-200 dark:border-gray-700"
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
        >
            {/* Title */}
            <motion.h2
                className="text-2xl font-bold mb-6 text-center bg-gradient-to-r from-indigo-600 to-pink-500 bg-clip-text text-transparent"
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
            >
                Booking Details
            </motion.h2>

            {/* Details Card */}
            <motion.div
                className="mb-6 p-5 rounded-xl bg-gradient-to-r from-indigo-50 to-pink-50 dark:from-gray-800 dark:to-gray-700 border border-gray-200 dark:border-gray-600 shadow-md"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.3 }}
            >
                <p className="text-gray-700 dark:text-gray-200 mb-2">
                    <span className="font-semibold">📦 Package:</span> {bookingInfo.packageName}
                </p>
                {/* <p className="text-gray-700 dark:text-gray-200 mb-2">
                    <span className="font-semibold">🧑 Tourist:</span> {bookingInfo.touristName}
                </p> */}
                <p className="text-gray-700 dark:text-gray-200 mb-2">
                    <span className="font-semibold">👥 Total Members:</span> {bookingInfo.totalMembers}
                </p>
                <p className="text-gray-700 dark:text-gray-200 mb-2">
                    <span className="font-semibold">📅 Tour Dates:</span> {bookingInfo?.tourDate?.start} → {bookingInfo?.tourDate?.end}
                </p>
                <p className="text-lg font-bold text-indigo-600 dark:text-pink-400">
                    💰 Price: ${bookingInfo.price}
                </p>
            </motion.div>

            {/* Payment Field */}
            <motion.div
                className="p-4 mb-6 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-800 shadow-sm"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.4 }}
            >
                <CardElement
                    options={{
                        style: {
                            base: {
                                fontSize: "16px",
                                color: "#f3f4f6", // text-gray-100
                                letterSpacing: "0.5px",
                                fontFamily: "Inter, sans-serif",
                                "::placeholder": {
                                    color: "#9ca3af", // gray-400
                                },
                                backgroundColor: "transparent", // Let Tailwind handle bg
                                padding: "12px",
                            },
                            invalid: {
                                color: "#f87171", // red-400
                            },
                        },
                    }}
                    className="p-3 rounded-md 
             bg-gray-50 dark:bg-gradient-to-r dark:from-gray-800 dark:to-gray-900 
             border border-gray-200 dark:border-gray-600 
             shadow-inner"                />
            </motion.div>

            {/* Pay Button */}
            <motion.button
                onClick={handleConfirmClick}
                className="w-full py-3 text-lg font-semibold rounded-xl bg-gradient-to-r from-indigo-600 to-pink-500 text-white shadow-lg hover:shadow-xl hover:scale-[1.02] transform transition-all duration-300 disabled:opacity-50"
                disabled={!stripe}
                whileTap={{ scale: 0.97 }}
                whileHover={{ scale: 1.02 }}
            >
                Confirm & Pay ${amount}
            </motion.button>

            {/* Error */}
            {error && (
                <motion.p
                    className="text-red-500 mt-4 text-center font-medium"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                >
                    {error}
                </motion.p>
            )}
        </motion.div>

    );
};

export default PaymentForm;
