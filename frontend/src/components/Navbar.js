import { Link } from 'react-router-dom';

const Navbar = () => {
    return (
        <nav className="navbar">
            <ul>
                <li><Link to="/">Home</Link></li>
                <li><Link to="/viewOrganizations">View Organizations</Link></li>
                <li><Link to="/profile">User Profile</Link></li>
                <li><Link to="/writeArticle">Write Article</Link></li>
                <li><Link to="/cashflowAnalysis">Cashflow Analysis</Link></li>
                <li className="navbar__login"><Link to="/login">Employee Login</Link></li>
            </ul>
        </nav>
    );
}

export default Navbar;
