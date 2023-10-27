const developmentOrigin = 'http://localhost:3000';
const productionOrigin = 'https://wazpplabs.com';

let allowedOrigins;

if (process.env.NODE_ENV === 'production') {
    allowedOrigins = ['*'];
    
} else {
    allowedOrigins = ['*'];
}



module.exports = allowedOrigins
