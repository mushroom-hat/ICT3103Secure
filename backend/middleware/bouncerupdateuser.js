const { check, validationResult } = require('express-validator');

// Username validation
const validateUsername = () => {
    return check('username', 'Invalid username format')
      .matches(/^[a-zA-Z0-9_-]+$/)
      .withMessage('Invalid username format.')
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

const bouncerupdateuser = async (req, res, next) => {
// console.log("the validation begins");


const usernameValidation = validateUsername();
const emailValidation = validateEmail();
const nameValidation = validateName();

let usernameValid = false;
let emailValid = false;
let nameValid = false;
let usernameErrors

// Password validation
const usernameReq = {...req};
await new Promise((resolve) => {
    usernameValidation(usernameReq, res, () => {
         usernameErrors = validationResult(usernameReq);
    if (!usernameErrors.isEmpty()) {
        // console.log("Username validation errors:", usernameErrors.array());
    } else {
        usernameValid = true;
    }
    resolve(); // Resolve the promise
    });
});
 
 // Email validation
 const emailReq = {...req};
 emailValidation(emailReq, res , () => {

   const emailErrors = validationResult(emailReq);
   if (!emailErrors.isEmpty()){
     // console.log("Email validation errors:", emailErrors.array());
   } else {
     emailValid = true;
   }
 
 // Name validation
 const nameReq = {...req};
 nameValidation(nameReq, res , () => {

   const nameErrors = validationResult(nameReq);
   if (!nameErrors.isEmpty()){
     // console.log("name validation errors:", nameErrors.array());
   } else {
     nameValid = true;
   }

   if (
     !usernameErrors.isEmpty() ||
     !emailErrors.isEmpty() ||
     !nameErrors.isEmpty()
   ) {
     // Handle the case where at least one validation fails
     const allErrors = [
       ...usernameErrors.array(),
       ...emailErrors.array(),
       ...nameErrors.array(),
     ];

     // console.log("this is the error", allErrors);
   
     return res.status(422).json({
       errors: allErrors,
     });
   }

   // If all valid, continue with the next middleware
   next();
 });
 });
};

module.exports = bouncerupdateuser;