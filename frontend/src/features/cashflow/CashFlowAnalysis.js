import React from 'react';
import useAuth from '../../hooks/useAuth';
import { useGetDonationsByOrganizationQuery } from '../donations/donationsApiSlice';
import { useGetSpendingByOrganizationQuery } from '../spendings/spendingsApiSlice'; // Replace 'path-to-getSpendingByOrganization' with the actual import path

const CashflowAnalysis = () => {
    const { id } = useAuth();
    
    const { data: donationsData, isLoading: donationsLoading, isError: donationsIsError, error: donationsError } = useGetDonationsByOrganizationQuery(id);
    const totalDonationAmount = donationsData?.reduce((acc, donation) => acc + donation.amount, 0) || 0;

    const { data: spendingData, isLoading: spendingLoading, isError: spendingIsError, error: spendingError } = useGetSpendingByOrganizationQuery(id);

    let donationErrorContent;
    let spendingErrorContent;

    console.log(spendingData);

    if (donationsIsError) {
        donationErrorContent = <p>Error in Donations: {donationsError.message || 'Unknown error'}</p>;
    }

    if (spendingIsError) {
        spendingErrorContent = <p>Error in Spending: {spendingError.message || 'Unknown error'}</p>;
    }

    // Calculate the total spending amount
    const totalSpendingAmount = spendingData?.reduce((acc, item) => acc + item.amount, 0) || 0;

    let content;

    if (donationsLoading || spendingLoading) {
        content = <p>Loading...</p>;
    } else {
        content = (
            <div>
                <h1>Cashflow Analysis</h1>
                <p>Total Donation Amount: ${totalDonationAmount}</p>
                <p>Total Spending Amount: ${totalSpendingAmount}</p>

                <h2>Spending Breakdown</h2>
                {spendingData ? (
                    <table>
                        <thead>
                            <tr>
                                <th>Category</th>
                                <th>Amount</th>
                                <th>Description</th>
                                <th>Spending Date</th>
                            </tr>
                        </thead>
                        <tbody>
                            {spendingData.map((item) => (
                                <tr key={item._id}>
                                    <td>{item.category}</td>
                                    <td>${item.amount}</td>
                                    <td>{item.description}</td>
                                    <td>{new Date(item.spendingDate).toLocaleDateString()}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                ) : <p>No spending data available.</p>}
            </div>
        );
    }

    return (
        <div>
            {donationErrorContent}
            {spendingErrorContent}
            {content}
        </div>
    );
};

export default CashflowAnalysis;
