import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPenToSquare, faTrash } from "@fortawesome/free-solid-svg-icons"
import EditModal from './EditModal';  // 1. Import the EditModal component
import DeleteModal from './DeleteModal';  // 1. Import the DeleteModal component
import { useSelector } from 'react-redux'
import { selectAllUsers } from './usersApiSlice'
import { useState } from 'react'

const User = ({ userId }) => {
  // Edit Modal
  const [showModal, setShowModal] = useState(false);  // 3. State to control the modal
  const handleClose = () => setShowModal(false);
  const handleShow = () => {
    setShowModal(true);
  };

  // Delete Modal
  const [showDeleteModal, setShowDeleteModal] = useState(false);  // 3. State to control the modal
  const handleDeleteClose = () => setShowDeleteModal(false);
  const handleDeleteShow = () => {
    setShowDeleteModal(true);
  };

  const users = useSelector(selectAllUsers);
  const user = users.find(u => u.id === userId);

  if (!user) {
    return (
      <tr className="table__row user">
        <td colSpan="5">
          <div className="alert alert-warning" role="alert">
            No user found
          </div>
        </td>
      </tr>
    );
  }

  const cellStatus = user.active ? '' : 'table__cell--inactive';

  return (
    <>
      <tr className="table__row user">
        <td className={`table__cell ${cellStatus}`}>{user.username}</td>
        <td className={`table__cell ${cellStatus}`}>{user.email}</td>
        <td className={`table__cell ${cellStatus}`}>{user.name}</td>
        <td className={`table__cell ${cellStatus}`}>{user.roles}</td>
        <td className={`table__cell ${cellStatus}`}>
          <button className="icon-button table__button" onClick={handleShow}>  {/* Change onClick handler */}
            <FontAwesomeIcon icon={faPenToSquare} />
          </button>
        </td>
        <td className={`table__cell ${cellStatus}`}>
          <button className="icon-button table__button" onClick={handleDeleteShow}>
            <FontAwesomeIcon icon={faTrash} />
          </button>
        </td>
      </tr>
      <EditModal show={showModal} handleClose={handleClose} userSelected={user} />  {/* 4. Include EditModal */}
      <DeleteModal show={showDeleteModal} handleClose={handleDeleteClose} userSelected={user} />  {/* 4. Include DeleteModal */}

    </>
  );
};

export default User;
