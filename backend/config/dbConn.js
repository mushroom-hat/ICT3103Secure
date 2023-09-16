const mongoose = require('mongoose')

const connectDB = async() => {
    try{
        await mongoose.connect(process.env.DATABASE_URI)
    } catch (err){
        console.log(err)
        logEvents(`${err.no}: ${err.code}\t${er.syscall}\t${err.hostname}`, 'mongoErrLog.log')

    }
} 

module.exports = connectDB