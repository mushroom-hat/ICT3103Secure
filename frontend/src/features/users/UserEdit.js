// UserEdit.js
import { useSelector, useDispatch } from 'react-redux';
import { selectUserById, useUpdateUserMutation } from './usersApiSlice';

const UserEdit = ({ userId }) => {
    const user = useSelector(state => selectUserById(state, userId));
    const [updateUser, { isLoading, isError, error }] = useUpdateUserMutation();

    const handleSubmit = (e) => {
        e.preventDefault();
        updateUser({ 
            id: user._id,
            username: e.target.username.value,
            // Add other fields here
        });
    };

    if (!user) return 'User not found';

    return (
        <form onSubmit={handleSubmit}>
            <label>
                Username:
                <input type="text" name="username" defaultValue={user.username} />
            </label>
            {/* You can add other input fields here for other user properties */}
            <button type="submit" disabled={isLoading}>Save Changes</button>
        </form>
    );
};

export default UserEdit;
