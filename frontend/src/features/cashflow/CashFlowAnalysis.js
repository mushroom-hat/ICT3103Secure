import React, { useState } from 'react';
import Navbar from '../../components/Navbar';

const CashflowAnalysis = () => {
    const [cashflow, setCashflow] = useState({
        income: 0,
        expenses: 0,
    });

    const handleInputChange = (event) => {
        const { name, value } = event.target;
        setCashflow(prevState => ({
            ...prevState,
            [name]: parseFloat(value) || 0,
        }));
    };

    const calculateNetCashflow = () => {
        return cashflow.income - cashflow.expenses;
    };

    return (
        <div>
            <Navbar />
            <div className="cashflow-analysis">
                <h1>Cashflow Analysis</h1>
                
                <form>
                    <div className="form-group">
                        <label>Income:</label>
                        <input type="number" name="income" value={cashflow.income} onChange={handleInputChange} />
                    </div>
                    
                    <div className="form-group">
                        <label>Expenses:</label>
                        <input type="number" name="expenses" value={cashflow.expenses} onChange={handleInputChange} />
                    </div>
                </form>

                <div className="result">
                    <h2>Net Cashflow: {calculateNetCashflow()}</h2>
                </div>
            </div>
        </div>
    );
}

export default CashflowAnalysis;
