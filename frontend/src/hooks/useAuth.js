import { useSelector } from 'react-redux';
import { selectCurrentToken } from "../features/auth/authSlice";
import jwtDecode from 'jwt-decode';

const useAuth = () => {
    const token = useSelector(selectCurrentToken);
    let username = '';
    let roles = '';

    if (token) {
        const decoded = jwtDecode(token);
        const { username: decodedUsername, roles: decodedRoles } = decoded.UserInfo;

        // Assuming the user has only one role, you can modify this part for multiple roles
        if (decodedRoles) {
            roles = decodedRoles;
        }

        username = decodedUsername;
    }

    return { username, roles };
};

export default useAuth;
