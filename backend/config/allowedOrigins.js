const developmentOrigin = 'http://localhost:3000';
const productionOrigin = 'charsity-frontend-container';

let allowedOrigins;

if (process.env.NODE_ENV === 'production') {
    allowedOrigins = [productionOrigin];
    
} else {
    allowedOrigins = [developmentOrigin, "postman"];
}



module.exports = allowedOrigins
