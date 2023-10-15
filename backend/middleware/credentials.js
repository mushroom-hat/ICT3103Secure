const allowedOrigins = require('../config/allowedOrigins');

const credentials = (req, res, next) => {
    const origin = req.headers.origin;
    console.log("Origin:", origin);
    if (allowedOrigins.includes(origin)) {
        res.header('Access-Control-Allow-Origin', origin); // Set the 'Access-Control-Allow-Origin' header to the request's origin if it's in allowedOrigins.
        res.header('Access-Control-Allow-Credentials', true); // set this header if origin is in allowedOrigins. This header is what CORS is looking for.
    }
    next();
}

module.exports = credentials