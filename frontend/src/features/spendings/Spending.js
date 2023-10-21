import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPenToSquare } from '@fortawesome/free-solid-svg-icons';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { selectSpendingById } from './spendingsApiSlice';


const Spending = ({ spendingId }) => {
  const spending = useSelector((state) => selectSpendingById(state, spendingId));
  const navigate = useNavigate();


  if (spending) {
    const handleEdit = () => navigate(`/dash/spendings/${spendingId}`);


    const cellStatus = spending.active ? '' : 'table__cell--inactive';


    return (
      <tr className="table__row spending">
        <td className={`table__cell ${cellStatus}`}>{spending.organization.username}</td>
        <td className={`table__cell ${cellStatus}`}>{spending.amount}</td>
        <td className={`table__cell ${cellStatus}`}>
          <button
            className="icon-button table__button"
            onClick={handleEdit}
          >
            <FontAwesomeIcon icon={faPenToSquare} />
          </button>
        </td>
      </tr>
    );
  } else return null;
};


export default Spending;
