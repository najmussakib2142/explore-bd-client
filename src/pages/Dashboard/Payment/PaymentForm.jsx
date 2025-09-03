import { CardElement, useElements, useStripe } from '@stripe/react-stripe-js';
import { useQuery } from '@tanstack/react-query';
import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router';
import useAxiosSecure from '../../../hooks/useAxiosSecure';
// import useAuth from '../../../hooks/useAuth';
import Swal from 'sweetalert2';
import { motion } from "framer-motion";
import Loading from '../../shared/Loading/Loading';
import useAuth from '../../../hooks/useAuth';

const PaymentForm = () => {
    const { user } = useAuth();
    const stripe = useStripe();
    const elements = useElements();
    const { bookingId } = useParams();
    const navigate = useNavigate();
    const axiosSecure = useAxiosSecure();
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    // Load booking info
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

    // Main payment function
    const processPayment = async () => {
        if (!stripe || !elements) return;

        const card = elements.getElement(CardElement);
        if (!card) return;

        try {
            setLoading(true);
            // 1️⃣ Create payment intent
            const { data: paymentIntentData } = await axiosSecure.post('/create-payment-intent', {
                amountInCents
            });
            const clientSecret = paymentIntentData.clientSecret;

            // 2️⃣ Confirm card payment
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
                return;
            }

            if (result.paymentIntent.status === 'succeeded') {
                const transactionId = result.paymentIntent.id;

                // 3️⃣ Patch the booking document
                const updateData = {
                    payment_status: "paid",
                    payment: {
                        transactionId,
                        method: result.paymentIntent.payment_method_types,
                        paid_at: new Date().toISOString(),
                        amount
                    },
                    booking_status: "in-review",
                };

                await axiosSecure.patch(`/bookings/${bookingId}`, updateData);

                Swal.fire({
                    title: '✅ Payment Successful',
                    html: `
                        <div class="text-left text-base space-y-2">
                            <p><strong>Package:</strong> ${bookingInfo.packageName}</p>
                            <p><strong>Amount Paid:</strong> $${amount}</p>
                            <p><strong>Transaction ID:</strong> ${transactionId}</p>
                        </div>
                    `,
                    icon: 'success',
                    confirmButtonText: 'OK',
                    confirmButtonColor: '#16a34a',
                }).then(() => navigate('/dashboard/myBookings'));
            }
        } catch (err) {
            console.error(err);
            setError('Payment failed. Please try again.');
        } finally {
            setLoading(false); // stop spinner
        }
    };

    // Confirm button click
    const handleConfirmClick = () => {
        Swal.fire({
            title: '💳 Confirm Your Payment',
            html: `
    <div style="font-size:16px; margin-top:10px;">
      You are about to pay <b style="color:#1E88E5;">$${amount}</b><br/>
      for the package <b>"${bookingInfo.packageName}"</b>.
    </div>
  `,
            icon: 'info',
            showCancelButton: true,
            confirmButtonText: 'Yes, Pay Now',
            cancelButtonText: 'Cancel',
            confirmButtonColor: '#1E88E5',
            cancelButtonColor: '#d33',
            background: '#f9f9f9',
            backdrop: `rgba(0,0,0,0.6)`,
            customClass: {
                title: 'text-xl font-bold',
                confirmButton: 'px-4 py-2',
                cancelButton: 'px-4 py-2',
            }
        }).then((result) => {
            if (result.isConfirmed) {
                processPayment();
            }
        });
    };

    return (
        <div className="relative">
            <motion.div className="max-w-xl mx-auto bg-white dark:bg-gray-900 rounded-2xl shadow-2xl p-6 border border-gray-200 dark:border-gray-700"
                initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, ease: "easeOut" }}>

                <motion.h2 className="text-2xl font-bold mb-6 text-center bg-gradient-to-r from-indigo-600 to-pink-500 bg-clip-text text-transparent"
                    initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
                    Booking Details
                </motion.h2>

                <motion.div className="mb-6 p-5 rounded-xl bg-gradient-to-r from-indigo-50 to-pink-50 dark:from-gray-800 dark:to-gray-700 border border-gray-200 dark:border-gray-600 shadow-md"
                    initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.3 }}>

                    <p className="text-gray-700 dark:text-gray-200 mb-2"><span className="font-semibold">📦 Package:</span> {bookingInfo.packageName}</p>
                    <p className="text-gray-700 dark:text-gray-200 mb-2"><span className="font-semibold">👥 Total Members:</span> {bookingInfo.members}</p>
                    <p className="text-gray-700 dark:text-gray-200 mb-2"><span className="font-semibold">📅 Tour Dates:</span> {bookingInfo?.tourDate?.start} → {bookingInfo?.tourDate?.end}</p>
                    <p className="text-lg font-bold text-indigo-600 dark:text-pink-400">💰 Price: ${bookingInfo.price}</p>
                </motion.div>

                <motion.div className="p-4 mb-6 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-800 shadow-sm"
                    initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.4 }}>
                    <CardElement
                        options={{
                            style: {
                                base: {
                                    fontSize: "16px", color: "#f3f4f6", letterSpacing: "0.5px", fontFamily: "Inter, sans-serif",
                                    "::placeholder": { color: "#9ca3af" }, padding: "12px"
                                },
                                invalid: { color: "#f87171" },
                            }
                        }}
                        className="p-3 rounded-md bg-gray-50 dark:bg-gradient-to-r dark:from-gray-800 dark:to-gray-900 border border-gray-200 dark:border-gray-600 shadow-inner" />
                </motion.div>

                <motion.button onClick={handleConfirmClick} disabled={!stripe}
                    className="w-full py-3 text-lg font-semibold rounded-xl bg-gradient-to-r from-indigo-600 to-pink-500 text-white shadow-lg hover:shadow-xl hover:scale-[1.02] transform transition-all duration-300 disabled:opacity-50"
                    whileTap={{ scale: 0.97 }} whileHover={{ scale: 1.02 }}>
                    Confirm & Pay ${amount}
                </motion.button>

                {error && <motion.p className="text-red-500 mt-4 text-center font-medium" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>{error}</motion.p>}
            </motion.div>

            {loading && (
                <div className="fixed inset-0 flex items-center justify-center bg-black/50 backdrop-blur-sm z-50">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.3 }}
                        className="bg-white dark:bg-gray-900 p-6 rounded-2xl shadow-xl flex flex-col items-center space-y-4"
                    >
                        <svg
                            className="animate-spin h-10 w-10 text-indigo-600 dark:text-pink-400"
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                        >
                            <circle
                                className="opacity-25"
                                cx="12"
                                cy="12"
                                r="10"
                                stroke="currentColor"
                                strokeWidth="4"
                            ></circle>
                            <path
                                className="opacity-75"
                                fill="currentColor"
                                d="M4 12a8 8 0 018-8v4l3.5-3.5L12 0v4a8 8 0 00-8 8h4z"
                            ></path>
                        </svg>
                        <p className="text-gray-700 dark:text-gray-200 font-medium">
                            Processing payment...
                        </p>
                    </motion.div>
                </div>
            )}

        </div>

    );
};

export default PaymentForm;
