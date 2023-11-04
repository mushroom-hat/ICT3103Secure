import React, { useState } from "react";
import Particle from "../../components/Particle";
import { Container } from "react-bootstrap";
import NavBar from "../../components/Navbar";

const CashflowAnalysis = () => {
  const [cashflow, setCashflow] = useState({
    income: 0,
    expenses: 0,
  });

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setCashflow((prevState) => ({
      ...prevState,
      [name]: parseFloat(value) || 0,
    }));
  };

  const calculateNetCashflow = () => {
    return cashflow.income - cashflow.expenses;
  };

  return (
    <Container fluid className="project-section">
      <Particle />
      <NavBar />
      <Container>
        <NavBar />
        <h1 className="project-heading">Cashflow Analysis</h1>
        <form
          style={{
            display: "grid",
            gridTemplateColumns: "auto 1fr",
            gridGap: "0.5rem",
            zIndex: 1,
            position: "relative",
            paddingTop: "0.5rem",
            paddingBottom: "0.5rem"
          }}
        >
          <div>
            <label style={{ color: "white" }}>Income:</label>
          </div>
          <div>
            <input
              type="number"
              name="income"
              value={cashflow.income}
              onChange={handleInputChange}
            />
          </div>

          <div>
            <label style={{ color: "white" }}>Expenses:</label>
          </div>
          <div>
            <input
              type="number"
              name="expenses"
              value={cashflow.expenses}
              onChange={handleInputChange}
            />
          </div>
        </form>

        <div className="result">
          <h2 style={{ color: "white "}}>Net Cashflow: {calculateNetCashflow()}</h2>
        </div>
      </Container>
    </Container>
  );
};

export default CashflowAnalysis;
