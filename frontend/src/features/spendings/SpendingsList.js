import React from 'react';
import { useGetSpendingsQuery } from './spendingsApiSlice';
import Spending from './Spending';


const SpendingsList = () => {
  const {
    data: spendings,
    isLoading,
    isSuccess,
    isError,
  } = useGetSpendingsQuery(undefined, {
    pollingInterval: 60000,
    refetchOnFocus: true,
    refetchOnMountOrArgChange: true,
  });
  console.log("myspendings", spendings)
  console.log("isLoading: ", isLoading)
  console.log("isSuccess: ", isSuccess)
  console.log("isError: ", isError)
  console.log("Hello: ")



  let content;


  if (isLoading) content = <p>Loading...</p>;


  if (isError) {
    content = <p>Not Currently Available</p>;
  }


  if (isSuccess) {
    const { ids } = spendings;


    const tableContent = ids?.length ? (
      ids.map((spendingId) => <Spending key={spendingId} spendingId={spendingId} />)
    ) : null;
    //console.log("mySpending:" , spendings)

    content = (
      <table className="table table--spendings">
        <thead className="table__thead">
          <tr>
            <th scope="col" className="table__th spending__organization">Organization</th>
            <th scope="col" className="table__th spending__amount">Amount</th>
            <th scope="col" className="table__th spending__edit">Edit</th>
          </tr>
        </thead>
        <tbody>{tableContent}</tbody>
      </table>
    );
  }


  return content;
};


export default SpendingsList;
