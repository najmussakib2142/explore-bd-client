import { CardElement, useElements, useStripe } from '@stripe/react-stripe-js';
import { useQuery } from '@tanstack/react-query';
import React, { useState } from 'react';
import { useParams } from 'react-router';
import useAxiosSecure from '../../../hooks/useAxiosSecure';
import Loading from '../../shared/Loading/Loading';
const PaymentForm = () => {

    const stripe = useStripe();
    const elements = useElements()
    const [error, setError] = useState('')
    const { packageId } = useParams()
    // console.log(packageId);
    const axiosSecure = useAxiosSecure()

    const { isPending, data: packageInfo = {} } = useQuery({
        queryKey: ['packages', packageId],
        queryFn: async () => {
            const res = await axiosSecure.get(`/packages/${packageId}`);
            return res.data;
        }
    })

    if (isPending) {
        return <Loading></Loading>
    }

    console.log(packageInfo)
    const amount = packageInfo.price;
    const amountInCents = amount * 100;
    console.log(amountInCents);


    const handleSubmit = async (e) => {
        e.preventDefault()

        if (!stripe || !elements) {
            return
        }

        const card = elements.getElement(CardElement);

        if (!card) {
            return
        }
        const { error, paymentMethod } = await stripe.createPaymentMethod({
            type: 'card',
            card,
        });
        if (error) {
            setError(error.message)
        } else {
            setError('')
            console.log('[PaymentMethod]', paymentMethod);
        }
    }
    return (
        <div className='max-w-2/5 mx-auto '>
            <form onSubmit={handleSubmit}>
                <CardElement
                    className=" bg-base-100 p-10 rounded-2xl shadow-2xl border border-gray-200 w-full max-w-xl  mx-auto flex flex-col justify-center"
                >
                </CardElement>
                <button type='submit'
                    className="btn btn-primary text-base-100  w-full rounded-lg font-semibold tracking-wide"
                    disabled={!stripe}
                >
                    Pay ${amount}
                </button>
                {
                    error && <p className='text-red-500'>{error}</p>
                }
            </form>
        </div>
    );
};

export default PaymentForm;