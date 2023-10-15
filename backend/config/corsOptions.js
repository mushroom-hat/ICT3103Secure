const allowedOrigins = require('./allowedOrigins');
console.log("Allowed Domains: " + allowedOrigins);
const corsOptions = {
    origin: (origin, callback) => {
        if (allowedOrigins.indexOf(origin) !== -1) {
            callback(null, true);
        } else {
            callback(new Error('Not allowed by CORS'));
        }

    },
    credentials: true, // Corrected property name
    optionsSuccessStatus: 200, // Corrected property name
};

module.exports = corsOptions;
