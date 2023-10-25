import { useSelector } from 'react-redux';
import { selectCurrentToken } from "../features/auth/authSlice";
import jwtDecode from 'jwt-decode';

const useAuth = () => {
    const token = useSelector(selectCurrentToken);
    let id = '';
    let username = '';
    let roles = '';
    let id = '';

    if (token) {
        const decoded = jwtDecode(token);
<<<<<<< Updated upstream
        const { id: decodedId, username: decodedUsername, roles: decodedRoles } = decoded.UserInfo;

        id = decodedId;
=======
        const { username: decodedUsername, roles: decodedRoles, id: decodedId } = decoded.UserInfo;
>>>>>>> Stashed changes

        // Assuming the user has only one role, you can modify this part for multiple roles
        if (decodedRoles) {
            roles = decodedRoles;
        }

        id = decodedId;
        username = decodedUsername;
    }

    return { id, username, roles };
};

export default useAuth;
