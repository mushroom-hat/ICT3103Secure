// Middleware function to check if the user has the required role
function verifyRole(requiredRole) {
  return (req, res, next) => {
    // Check if req.roles exists
    if (!req.roles) {
      console.log("VerifyRole - No req.roles");
      return res.status(401).json({ message: 'Forbidden' });
    }

    // Check if the user's role matches the requiredRole
    const userRole = req.roles;
    console.log ("Req roles", req.roles)
    console.log("Required role", requiredRole)

    if (userRole !== requiredRole) {
      console.log("VerifyRole - Wrong Role");
      return res.status(403).json({ message: 'Unauthorized' });
    }

    // User has the required role, proceed to the next middleware
    next();
  };
}

module.exports = verifyRole;
