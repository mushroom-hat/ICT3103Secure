import React from 'react';
import useAuth from '../../hooks/useAuth';
import { useGetDonationsByOrganizationQuery } from '../donations/donationsApiSlice';

const CashflowAnalysis = () => {
    const { id } = useAuth();
    const { data, isLoading, isError, error } = useGetDonationsByOrganizationQuery(id);
    const totalAmount = data?.reduce((acc, donation) => acc + donation.amount, 0) || 0;

    let content;

    if (isLoading) {
        content = <p>Loading...</p>;
    } else if (isError) {
        content = <p>Error: {error ? error.message : 'Unknown error'}</p>;
    } else {
        content = (
            <div>
                <h1>Cashflow Analysis</h1>
                <p>Total Donation Amount: ${totalAmount}</p>
            </div>
        );
    }

    return (
        <div>
            {content}
        </div>
    );
};

export default CashflowAnalysis;
