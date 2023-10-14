const developmentOrigin = 'http://localhost:3000';
const productionOriginHTTPS = 'https://charsity-frontend-container.com';
const productionOriginHTTP = 'http://charsity-frontend-container.com';

let allowedOrigins;

if (process.env.NODE_ENV === 'production') {
    allowedOrigins = [productionOriginHTTPS, productionOriginHTTP];
    
} else {
    allowedOrigins = [developmentOrigin, "postman"];
}



module.exports = allowedOrigins
