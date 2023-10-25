import { useState, useEffect } from "react";
import { useUpdateCardMutation, useDeleteCardMutation } from "./cardsApiSlice";
import { useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSave, faTrashCan } from "@fortawesome/free-solid-svg-icons";
import useAuth from "../../hooks/useAuth";

const CARD_NUMBER_REGEX = /^[0-9]{16}$/;
const CARD_HOLDER_NAME_REGEX = /^[A-z ]{3,}$/;
const EXPIRY_DATE_REGEX = /^(0[1-9]|1[0-2])\/\d{2}$/;
const CVC_REGEX = /^[0-9]{3}$/;

const EditCardForm = ({ card }) => {
  const [updateCard, {
    isLoading,
    isSuccess,
    isError,
    error,
  }] = useUpdateCardMutation();

  const [deleteCard, {
    isSuccess: isDelSuccess,
    isError: isDelError,
    error: delerror,
  }] = useDeleteCardMutation();

  const navigate = useNavigate();

  const [cardNumber, setCardNumber] = useState(card.cardNumber);
  const [validCardNumber, setValidCardNumber] = useState(false);
  const [cardHolderName, setCardHolderName] = useState(card.cardHolderName);
  const [validCardHolderName, setValidCardHolderName] = useState(false);
  const [expiryDate, setExpiryDate] = useState(card.expiryDate);
  const [validExpiryDate, setValidExpiryDate] = useState(false);
  const [cvc, setCVC] = useState(card.cvc);
  const [validCVC, setValidCVC] = useState(false);
  const { userId } = useAuth();

  useEffect(() => {
    setValidCardNumber(CARD_NUMBER_REGEX.test(cardNumber));
  }, [cardNumber]);

  useEffect(() => {
    setValidCardHolderName(CARD_HOLDER_NAME_REGEX.test(cardHolderName));
  }, [cardHolderName]);

  useEffect(() => {
    setValidExpiryDate(EXPIRY_DATE_REGEX.test(expiryDate));
  }, [expiryDate]);

  useEffect(() => {
    setValidCVC(CVC_REGEX.test(cvc));
  }, [cvc]);

  useEffect(() => {
    if (isSuccess || isDelSuccess) {
      setCardNumber("");
      setCardHolderName("");
      setExpiryDate("");
      setCVC("");
      navigate("/dash/cards");
    }
  }, [isSuccess, isDelSuccess, navigate]);

  const onCardNumberChanged = (e) => setCardNumber(e.target.value);
  const onCardHolderNameChanged = (e) => setCardHolderName(e.target.value);
  const onExpiryDateChanged = (e) => setExpiryDate(e.target.value);
  const onCVCChanged = (e) => setCVC(e.target.value);

  const onSaveCardClicked = async () => {
    await updateCard({
      id: card._id,
      cardNumber,
      cardHolderName,
      expiryDate,
      cvc,
    });
  };

  const onDeleteCardClicked = async () => {
    await deleteCard({ id: card._id });
  };

  const canSave =
    [validCardNumber, validCardHolderName, validExpiryDate, validCVC].every(
      Boolean
    ) && !isLoading;

  const errClass = isError || isDelError ? "errmsg" : "offscreen";
  const validCardNumberClass = !validCardNumber ? "form__input--incomplete" : "";
  const validCardHolderNameClass = !validCardHolderName
    ? "form__input--incomplete"
    : "";
  const validExpiryDateClass = !validExpiryDate
    ? "form__input--incomplete"
    : "";
  const validCVCClass = !validCVC ? "form__input--incomplete" : "";

  const errContent = error?.data?.message || delerror?.data?.message || "";

  return (
    <>
      <p className={errClass}>{errContent}</p>

      <form className="form" onSubmit={(e) => e.preventDefault()}>
        <div className="form__title-row">
          <h2>Edit Card</h2>
          <div className="form__action-buttons">
            <button
              className="icon-button"
              title="Save"
              onClick={onSaveCardClicked}
              disabled={!canSave}
            >
              <FontAwesomeIcon icon={faSave} />
            </button>
            <button
              className="icon-button"
              title="Delete"
              onClick={onDeleteCardClicked}
            >
              <FontAwesomeIcon icon={faTrashCan} />
            </button>
          </div>
        </div>
        <label className="form__label" htmlFor="cardNumber">
          Card Number:
        </label>
        <input
          className={`form__input ${validCardNumberClass}`}
          id="cardNumber"
          name="cardNumber"
          type="text"
          autoComplete="off"
          value={cardNumber}
          onChange={onCardNumberChanged}
        />

        <label className="form__label" htmlFor="cardHolderName">
          Cardholder Name:
        </label>
        <input
          className={`form__input ${validCardHolderNameClass}`}
          id="cardHolderName"
          name="cardHolderName"
          type="text"
          autoComplete="off"
          value={cardHolderName}
          onChange={onCardHolderNameChanged}
        />

        <label className="form__label" htmlFor="expiryDate">
          Expiry Date (MM/YY):
        </label>
        <input
          className={`form__input ${validExpiryDateClass}`}
          id="expiryDate"
          name="expiryDate"
          type="text"
          autoComplete="off"
          value={expiryDate}
          onChange={onExpiryDateChanged}
        />

        <label className="form__label" htmlFor="cvc">
          CVC:
        </label>
        <input
          className={`form__input ${validCVCClass}`}
          id="cvc"
          name="cvc"
          type="text"
          autoComplete="off"
          value={cvc}
          onChange={onCVCChanged}
        />
      </form>
    </>
  );
};

export default EditCardForm;
