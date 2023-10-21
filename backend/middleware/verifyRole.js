const jwt = require('jsonwebtoken');

// Middleware function to check if the user has the required role
function verifyRole(allowedRole) {
  return (req, res, next) => {
    // Get the JWT token from the request headers or wherever it's stored
    const token = req.headers.authorization || req.headers.Authorization;

    // Check if the token exists
    if (!token) {
      return res.status(401).json({ message: 'Forbidden' });
    }

    // Verify and decode the JWT token using the secret key from environment variable
    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, decodedToken) => {
      if (err) {
        return res.status(401).json({ message: 'Forbidden' });
      }

      // Check if the user's role matches the allowedRole
      const userRole = decodedToken.roles;
      if (userRole !== allowedRole) {
        return res.status(403).json({ message: 'Unauthorized' });
      }

      // User has the required role, proceed to the next middleware
      next();
    });
  };
}

module.exports = verifyRole;
