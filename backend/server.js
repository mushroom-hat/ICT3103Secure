
require('dotenv').config();
const express = require('express')
const helmet = require('helmet')
const app = express()
const path = require('path')
const { logger } = require('./middleware/logger') // Correct the path and use double quotes
const errorHandler = require('./middleware/errorHandler')
const cookieParser = require('cookie-parser')
const cors = require('cors')
const corsOptions = require('./config/corsOptions')
const connectDB = require('./config/dbConn')
const mongoose = require('mongoose')
const { logEvents } = require('./middleware/logger')
const credentials = require('./middleware/credentials')
const PORT = process.env.PORT || 3500

// console.log(process.env.NODE_ENV)

connectDB()
app.use(logger)
// Use Helmet middleware
app.use(
  helmet({
    xPermittedCrossDomainPolicies: false,
    xDnsPrefetchControl: false,
    xDownloadOptions: false,
    contentSecurityPolicy: {
      directives: {
        "script-src": ["'self'", "wazzpplabs.com"],
      },
    },
  })
);
app.use(credentials)
app.use(cors(corsOptions))
app.use(express.json())
app.use(cookieParser())
app.use('/', express.static(path.join(__dirname, 'public')))

app.use('/', require('./routes/root'))
app.use('/auth', require ('./routes/authRoutes'))
app.use('/users', require('./routes/userRoutes'))
app.use('/cards', require('./routes/cardRoutes'))
app.use('/articles', require('./routes/articlesRoutes'))
app.use('/donations', require('./routes/donationsRoutes'))
app.use('/spending', require('./routes/spendingRoutes'))

app.all('*', (req, res) =>{
    res.status(404)
    if(req.accepts('html')){
        res.sendFile(path.join(__dirname, 'views', '404.html'))
    }
    else if(req.accepts('json')){
        res.json({message: '404 Not Found'})
    }
    else{
        res.type('txt').send('404 Not Found')
    }
})

app.use(errorHandler)

async function startServer() {
    try {
        mongoose.connection.once('open', () => {
            // console.log('Connected to MongoDB');
        });
        
        const server = app.listen(PORT, () => {
            // console.log(`Server running on port ${PORT}`);
        });
    
        // Export the 'server' object if mongoose connection is successful
        module.exports = server;

    } catch (error) {
        mongoose.connection.on('error', err => {
            // console.log(err)
            logEvents()
        })    }
}

startServer()
// Upload logs once then upload it once daily to S3
const {job} = require('./helper/dailyUploadLogs')

if (process.env.NODE_ENV === 'production'){
    job()
}

