import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPenToSquare } from "@fortawesome/free-solid-svg-icons"
import { useNavigate } from 'react-router-dom'

import { useSelector } from 'react-redux'
import { selectCardById } from './cardApiSlice'

const Card = ({ cardId }) => {
    const card = useSelector(state => selectCardById(state, cardId));
    const navigate = useNavigate();

    const handleEdit = () => navigate(`/dash/cards/${cardId}/edit`);

    return (
        <tr className="table__row card">
            <td className="table__cell">{card.cardNumber}</td>
            <td className="table__cell">{card.cardHolderName}</td>
            <td className="table__cell">{card.expiryDate}</td>
            <td className="table__cell">
                <button
                    className="icon-button table__button"
                    onClick={handleEdit}
                >
                    <FontAwesomeIcon icon={faPenToSquare} />
                </button>
            </td>
        </tr>
    );
};

export default Card;
