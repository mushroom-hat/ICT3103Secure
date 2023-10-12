import { Link } from 'react-router-dom';

const Navbar = () => {
    return (
		<nav class="navbar navbar-expand-lg navbar-light bg-light">
		  <a class="navbar-brand"><Link to="/">Home</Link></a>
		  <button class="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarText" aria-controls="navbarText" aria-expanded="false" aria-label="Toggle navigation">
			<span class="navbar-toggler-icon"></span>
		  </button>
		  <div class="collapse navbar-collapse" id="navbarText">
			<ul class="navbar-nav mr-auto">
			  <li class="nav-item active">
				<a class="nav-link"><Link to="/viewOrganization">View Organizations</Link></a>
			  </li>
			  <li class="nav-item">
				<a class="nav-link"><Link to="/profile">User Profile</Link></a>
			  </li>
			  <li class="nav-item">
				<a class="nav-link"><Link to="/writeArticle">Write Article</Link></a>
			  </li>
			  <li class="nav-item">
				<a class="nav-link"><Link to="/cashflowAnalysis">Cashflow Analysis</Link></a>
			  </li>
			  <li class="nav-item">
				<a class="nav-link" className="navbar__login"><Link to="/login">Employee Login</Link></a>
			  </li>

			</ul>
		  </div>
		</nav>
    );
}

export default Navbar;
