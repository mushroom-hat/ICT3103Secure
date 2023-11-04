import React from "react";
import { useGetSpendingsQuery } from "./spendingsApiSlice";
import Spending from "./Spending";
import Particle from "../../components/Particle";
import { Container } from "react-bootstrap";
import NavBar from "../../components/Navbar";

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
  console.log("myspendings", spendings);
  console.log("isLoading: ", isLoading);
  console.log("isSuccess: ", isSuccess);
  console.log("isError: ", isError);
  console.log("Hello: ");

  let content;

  if (isLoading) content = <p>Loading...</p>;

  if (isError) {
    content = <p>Not Currently Available</p>;
  }

  if (isSuccess) {
    const { ids } = spendings;

    const tableContent = ids?.length
      ? ids.map((spendingId) => (
          <Spending key={spendingId} spendingId={spendingId} />
        ))
      : null;
    //console.log("mySpending:" , spendings)

    content = (
      <table className="table table--spendings">
        <thead className="table__thead">
          <tr>
            <th scope="col" className="table__th spending__organization">
              Organization
            </th>
            <th scope="col" className="table__th spending__amount">
              Amount
            </th>
            <th scope="col" className="table__th spending__edit">
              Description
            </th>
          </tr>
        </thead>
        <tbody>{tableContent}</tbody>
      </table>
    );
  }

  return (
    <Container fluid className="project-section">
      <Particle />
      <NavBar />
      <Container>
        <h1 className="project-heading">View Your Spendings</h1>
        {content}
      </Container>
    </Container>
  );
};

export default SpendingsList;
