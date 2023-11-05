import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPenToSquare, faTrash } from "@fortawesome/free-solid-svg-icons";
import DeleteCardModal from './DeleteCardModal';  // Updated name to include "Card"
import { useSelector } from 'react-redux';
import { selectAllCards } from './cardsApiSlice';
import { useState } from 'react';

const Card = ({ cardId }) => {
  // Edit Modal
  const [showCardModal, setShowCardModal] = useState(false);  // Updated state and name to include "Card"
  const handleClose = () => setShowCardModal(false);
  const handleShow = () => {
    setShowCardModal(true);
  };

  // Delete Modal
  const [showDeleteCardModal, setShowDeleteCardModal] = useState(false);  // Updated state and name to include "Card"
  const handleDeleteClose = () => setShowDeleteCardModal(false);
  const handleDeleteShow = () => {
    setShowDeleteCardModal(true);
  };

  const cards = useSelector(selectAllCards);
  const card = cards.find(c => c.id === cardId);

  if (!card) {
    return (
      <tr className="table__row card">
        <td colSpan="4">
          <div className="alert alert-warning" role="alert">
            No card found
          </div>
        </td>
      </tr>
    );
  }

  return (
    <>
        <td className="table__cell">{card.cardNumber.slice(-4)}</td>
        <td className="table__cell">{card.cardHolderName}</td>
        <td className="table__cell">{card.expiryDate}</td>
        <td className="table__cell">{card.cvc}</td>
        <td className="table__cell">
          <button className="icon-button table__button" onClick={handleDeleteShow}>
            <FontAwesomeIcon icon={faTrash} />
          </button>
        </td>
      <DeleteCardModal show={showDeleteCardModal} handleClose={handleDeleteClose} cardSelected={card} />  {/* Updated name to include "Card" */}
    </>
  );
};

export default Card;
