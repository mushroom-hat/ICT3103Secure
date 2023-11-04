const productionOrigin = 'https://wazpplabs.com';

let allowedOrigins;

if (process.env.NODE_ENV === 'production') {
    allowedOrigins = [productionOrigin];
    
} else {
    allowedOrigins = ['*'];
}



module.exports = allowedOrigins
