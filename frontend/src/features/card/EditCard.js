import { useSelector, useDispatch } from 'react-redux';
import { selectCardById, useUpdateCardMutation } from './cardApiSlice';

const CardEdit = ({ cardId }) => {
    const card = useSelector(state => selectCardById(state, cardId));
    const [updateCard, { isLoading }] = useUpdateCardMutation();

    const handleSubmit = (e) => {
        e.preventDefault();
        updateCard({ 
            id: card.id,
            cardNumber: e.target.cardNumber.value,
            cardHolderName: e.target.cardHolderName.value,
            expiryDate: e.target.expiryDate.value,
            cvc: e.target.cvc.value,
        });
    };

    if (!card) return 'Card not found';

    return (
        <form onSubmit={handleSubmit}>
            <label>
                Card Number:
                <input type="text" name="cardNumber" defaultValue={card.cardNumber} />
            </label>
            <label>
                Card Holder Name:
                <input type="text" name="cardHolderName" defaultValue={card.cardHolderName} />
            </label>
            <label>
                Expiry Date:
                <input type="text" name="expiryDate" defaultValue={card.expiryDate} />
            </label>
            <label>
                CVC:
                <input type="text" name="cvc" defaultValue={card.cvc} />
            </label>
            <button type="submit" disabled={isLoading}>Save Changes</button>
        </form>
    );
};

export default CardEdit;
