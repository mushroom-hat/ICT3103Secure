// middlewares/setDonatorRole.js
module.exports = (req, res, next) => {
    if (req.body) {
        req.body.roles = 'Donator';
    }
    next();
};
