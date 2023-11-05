// Middleware function to check if the user has one of the required roles
function verifyRole(requiredRoles) {
  return (req, res, next) => {
    console.log("In verifyRoles");
    // Check if req.roles exists
    if (!req.roles) {
      console.log("VerifyRole - No req.roles");
      return res.status(401).json({ message: 'Forbidden' });
    }

    // Check if the user's role matches one of the required roles
    const userRole = req.roles;

    if (!requiredRoles.includes(userRole)) {
      console.log("VerifyRole - Wrong Role");
      return res.status(403).json({ message: 'Unauthorized' });
    }

    // User has one of the required roles, proceed to the next middleware
    next();
  };
}

module.exports = verifyRole;