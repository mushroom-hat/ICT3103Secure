import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPenToSquare, faTrash } from "@fortawesome/free-solid-svg-icons"
import { useNavigate } from 'react-router-dom'

import { useSelector } from 'react-redux'
import { selectAllUsers } from './usersApiSlice'


const User = ({ userId }) => {
    const { username, roles } = useSelector(state => state.auth);

    console.log("Welcome: " + username + " (" + roles + ")");

    // Hooks should always be at the top level
    const users = useSelector(selectAllUsers);
    const navigate = useNavigate();

    const user = users.find(u => u.id === userId);

    // Exit early if the user is not found
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


    const handleEdit = () => navigate(`/dash/users/${userId}/edit`);
    const handleDelete = () => navigate(`/dash/users/${userId}/delete`);
    const cellStatus = user.active ? '' : 'table__cell--inactive';

    return (
        <tr className="table__row user">
            <td className={`table__cell ${cellStatus}`}>{user.username}</td>
            <td className={`table__cell ${cellStatus}`}>{user.email}</td>
            <td className={`table__cell ${cellStatus}`}>{user.name}</td>
            <td className={`table__cell ${cellStatus}`}>{user.roles}</td>
            <td className={`table__cell ${cellStatus}`}>
                <button className="icon-button table__button" onClick={handleEdit}>
                    <FontAwesomeIcon icon={faPenToSquare} />
                </button>
            </td>
            <td className={`table__cell ${cellStatus}`}>
                <button className="icon-button table__button" onClick={handleDelete}>
                    <FontAwesomeIcon icon={faTrash} />
                </button>
            </td>
        </tr>
    );
};

export default User