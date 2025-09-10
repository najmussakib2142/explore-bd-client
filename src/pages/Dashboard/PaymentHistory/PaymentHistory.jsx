import React from 'react';
import { useQuery } from '@tanstack/react-query';
import useAxiosSecure from '../../../hooks/useAxiosSecure';
import Loading from '../../shared/Loading/Loading';
import useAuth from '../../../hooks/useAuth';


const formatDate = (iso) => new Date(iso).toLocaleString();

const PaymentHistory = () => {
    const { user } = useAuth()
    const axiosSecure = useAxiosSecure()

    const { isPending, data: payments = [] } = useQuery({
        queryKey: ['payments', user?.email],
        queryFn: async () => {
            const res = await axiosSecure.get(`/payments?email=${user.email}`)
            return res.data
        },
        enabled: !!user?.email,
    })

    if (isPending) {
        return <Loading></Loading>
    }

    if (payments.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center py-10 bg-base-100 rounded-xl shadow-md">
                <p className="text-lg font-semibold text-gray-600 dark:text-gray-300">
                    No payment history found 💳
                </p>
                <p className="text-sm text-gray-500 mt-2">
                    Once you make a payment, it will appear here.
                </p>
            </div>
        );
    }


    return (
        <div className="overflow-x-auto shadow-md rounded-xl">
            <table className="table  w-full">
                <thead className="bg-base-100 text-base font-semibold">
                    <tr>
                        <th>#</th>
                        <th>Package ID</th>
                        <th>Amount</th>
                        <th>Transaction</th>
                        <th>Paid By</th>
                        <th>Paid At</th>
                    </tr>
                </thead>
                <tbody>
                    {payments?.length > 0 ? (
                        payments.map((p, index) => (
                            <tr key={p.transactionId}>
                                <td>{index + 1}</td>
                                {/* <td className="truncate" title={p.packageId}>
                                    {p.packageId}...
                                </td> */}
                                <td className="truncate" title={p.packageName}>
                                    {p.packageName}
                                </td>
                                <td>৳{p.amount}</td>
                                <td className="font-mono text-sm">
                                    <span title={p.transactionId}>
                                        {p.transactionId}...
                                    </span>
                                </td>
                                <td className="font-mono text-sm">
                                    <span title={p.email}>
                                        {p.email}...
                                    </span>
                                </td>
                                <td>{formatDate(p.paid_at_string)}</td>
                            </tr>
                        ))
                    ) : (
                        <tr>
                            <td colSpan="7" className="text-center text-gray-500 py-6">
                                No payment history found.
                            </td>
                        </tr>
                    )}
                </tbody>
            </table>
        </div>
    );
};

export default PaymentHistory;