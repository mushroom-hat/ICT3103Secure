import { useSelector } from 'react-redux';
import { selectCurrentToken } from "../features/auth/authSlice";
import jwtDecode from 'jwt-decode';

const useAuth = () => {
    const token = useSelector(selectCurrentToken);
    let id = '';
    let username = '';
    let role = '';

    if (token) {
        const decoded = jwtDecode(token);
        const { id:decodedId, username: decodedUsername, roles: decodedRoles } = decoded.UserInfo;

        // Assuming the user has only one role, you can modify this part for multiple roles
        if (decodedRoles && decodedRoles.length > 0) {
            role = decodedRoles[0];
        }

        username = decodedUsername;
        id = decodedId;
    }

    return { id, username, role };
};

export default useAuth;
