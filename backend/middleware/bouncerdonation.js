const { check, validationResult } = require('express-validator');


const validateDonation = () => {
    return check('amount', 'Please check your donation value again.')
      .custom((value) => {
        const re = /^\d+(\.\d+)?$/; // match numbers with any number of decimal places
        if (re.test(value)) {
          return true;
        } else {
          return false;
        }
      });
  };
  

const bouncerdonation = async (req, res, next) => {
  // console.log("the validation begins");

  const donationValidation = validateDonation();


  let donationValid = false;
  let donationErrors;

  // Donation validation
  const donationReq = {...req};
  await new Promise((resolve) => {
    donationValidation(donationReq, res, () => {
      donationErrors = validationResult(donationReq);
      if (!donationErrors.isEmpty()) {
        // console.log("Donation validation errors:", donationErrors.array());
      } else {
        donationValid = true;
      }
      resolve(); // Resolve the promise
    });
  });

  if (!donationValid) {
    // Handle the case where validations fail
    return res.status(422).json({
        errors: donationErrors.array(),
    });

  }

  // If valid, continue with the next middleware
  next();

}

module.exports = bouncerdonation;
  