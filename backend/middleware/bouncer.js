const { check, validationResult } = require('express-validator');

// Password validation
const validatePassword = () => {
  return check('pwd', 'Password must be at least 7 characters long and contain at least one lowercase letter, one uppercase letter, one digit, and one special character.')
    .custom((value) => {
      const re = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*])/;
      if (re.test(value) && value.length >= 7) {
        return true; // Password matches both the pattern and length criteria
      } else {
        return false;
      }
    });
};


// Username validation
const validateUsername = () => {
  return check('username', 'Invalid username format')
    .matches(/^[a-zA-Z0-9_-]+$/)
    .withMessage('Username can only contain letters, numbers, hyphens, and underscores')
    .escape();
};

const bouncer = (req, res, next) => {
  console.log("the validation begins");
  
  // Password validation
  const passwordValidation = validatePassword();
  passwordValidation(req, res, () => {
    const passwordErrors = validationResult(req);

    // Username validation
    const usernameValidation = validateUsername();
    usernameValidation(req, res, () => {
      const usernameErrors = validationResult(req);

      if (!passwordErrors.isEmpty() || !usernameErrors.isEmpty()) {
        const passwordErrorsArray = passwordErrors.array().map((err) => ({ [err.param]: err.msg }));
        const usernameErrorsArray = usernameErrors.array().map((err) => ({ [err.param]: err.msg }));
        const combinedErrors = [...passwordErrorsArray, ...usernameErrorsArray];
        
        return res.status(422).json({
          errors: combinedErrors,
        });
      }

      next();
    });
  });
};

module.exports = bouncer;
