import { useSelector } from 'react-redux';
import { selectCurrentToken } from "../features/auth/authSlice";
import jwtDecode from 'jwt-decode';

const useAuth = () => {
    const token = useSelector(selectCurrentToken);
    let id = '';
    let username = '';
    let roles = '';

    if (token) {
        const decoded = jwtDecode(token);
        const { username: decodedUsername, roles: decodedRoles, id: decodedId } = decoded.UserInfo;

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
