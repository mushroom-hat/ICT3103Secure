const { check, validationResult } = require('express-validator');

// Password validation
const validatePassword = () => {
  return check('pwd', 'Password must be at least 7 characters long and contain at least one lowercase letter, one uppercase letter, one digit, and one special character.')
    .custom((value) => {
      const re = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*])/;
      if (re.test(value) && value.length >= 7) {
        return true; 
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

const bouncersignup = async (req, res, next) => {
  console.log("the validation begins");

  const passwordValidation = validatePassword();
  const usernameValidation = validateUsername();

  let passwordValid = false;
  let usernameValid = false;
  let passwordErrors;

  // Password validation
  const passwordReq = {...req};
  await new Promise((resolve) => {
    passwordValidation(passwordReq, res, () => {
      passwordErrors = validationResult(passwordReq);
      if (!passwordErrors.isEmpty()) {
        console.log("Password validation errors:", passwordErrors.array());
      } else {
        passwordValid = true;
      }
      resolve(); // Resolve the promise
    });
  });

  // Username validation
  const usernameReq = {...req};
  usernameValidation(usernameReq, res, () => {
    
    const usernameErrors = validationResult(usernameReq);
    if (!usernameErrors.isEmpty()) {
      console.log("Username validation errors:", usernameErrors.array());
    } else {
      usernameValid = true;
    }

    if (!passwordValid && !usernameValid) {
      // Handle the case where both validations fail
      return res.status(422).json({
        errors: [...passwordErrors.array(), ...usernameErrors.array()],
      });
    } else if (!passwordValid) {
      // Handle the case where only password validation fails
      return res.status(422).json({
        errors: passwordErrors.array(),
      });
    } else if (!usernameValid) {
      // Handle the case where only username validation fails
      return res.status(422).json({
        errors: usernameErrors.array(),
      });
    }

    // If both password and username are valid, continue with the next middleware
    next();
  });
};

module.exports = bouncersignup;
