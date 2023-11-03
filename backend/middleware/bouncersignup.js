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

// Email validation
const validateEmail = () => {
  return check('email', 'Invalid email address')
    .isEmail()
    .withMessage('Invalid email address format.')
    .normalizeEmail();
};

// Name validation
const validateName = () => {
  return check('name', 'Invalid name')
    .matches(/^[a-zA-Z\s]+$/)
    .withMessage('Name should contain only letters and spaces.')
    .trim() // Remove leading and trailing whitespace
    .escape(); // Escape HTML entities
};

const bouncersignup = async (req, res, next) => {
  console.log("the validation begins");

  const passwordValidation = validatePassword();
  const usernameValidation = validateUsername();
  const emailValidation = validateEmail();
  const nameValidation = validateName();

  let passwordValid = false;
  let usernameValid = false;
  let emailValid = false;
  let nameValid = false;
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
  
  // Email validation
  const emailReq = {...req};
  emailValidation(emailReq, res , () => {

    const emailErrors = validationResult(emailReq);
    if (!emailErrors.isEmpty()){
      console.log("Email validation errors:", emailErrors.array());
    } else {
      emailValid = true;
    }
  
  // Name validation
  const nameReq = {...req};
  nameValidation(nameReq, res , () => {

    const nameErrors = validationResult(nameReq);
    if (!nameErrors.isEmpty()){
      console.log("name validation errors:", nameErrors.array());
    } else {
      nameValid = true;
    }

    if (
      !passwordErrors.isEmpty() ||
      !usernameErrors.isEmpty() ||
      !emailErrors.isEmpty() ||
      !nameErrors.isEmpty()
    ) {
      // Handle the case where at least one validation fails
      const allErrors = [
        ...passwordErrors.array(),
        ...usernameErrors.array(),
        ...emailErrors.array(),
        ...nameErrors.array(),
      ];
    
      return res.status(422).json({
        errors: allErrors,
      });
    }

    // If all valid, continue with the next middleware
    next();
  });
  });
  });
};

module.exports = bouncersignup;
