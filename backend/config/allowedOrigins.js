const developmentOrigin = 'http://localhost:3000';
const productionOriginHTTP = 'http://charsity-frontend-container';
const productionOriginHTTPS = 'https://charsity-frontend-container';

let allowedOrigins;

if (process.env.NODE_ENV === 'production') {
    allowedOrigins = [productionOriginHTTP, productionOriginHTTPS];
    
} else {
    allowedOrigins = [developmentOrigin, "postman"];
}



module.exports = allowedOrigins
