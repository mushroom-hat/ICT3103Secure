import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPenToSquare } from '@fortawesome/free-solid-svg-icons';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { selectSpendingById } from './spendingsApiSlice';


const Spending = ({ spendingId }) => {
  const spending = useSelector((state) => selectSpendingById(state, spendingId));
  const navigate = useNavigate();
  console.log("spendingform spending org", spending.organization)

  if (spending) {


    const cellStatus = spending.active ? '' : 'table__cell--inactive';


    return (
      <tr className="table__row spending">
        <td className={`table__cell ${cellStatus}`}>{spending.organization}</td>       
        <td className={`table__cell ${cellStatus}`}>{spending.amount}</td>
        <td className={`table__cell ${cellStatus}`}>{spending.description}</td>

      </tr>
    );
  } else return null;
};


export default Spending;
