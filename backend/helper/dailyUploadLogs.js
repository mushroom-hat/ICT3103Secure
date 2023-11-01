const schedule = require('node-schedule');
const uploadLogs = require('./s3Upload');

// Define the time of day you want the function to run (e.g., at midnight)
const hourlySchedule = '0 * * * *'; // Runs every hour on the hour

// Parameter to inject into the uploadFile function
const errLog = 'errLog.log';
const reqLog = 'reqLog.log';

// Create a scheduled job
const job = schedule.scheduleJob(hourlySchedule, function () {
    // Call the uploadFile function and inject the parameter
    uploadLogs(errLog);
    uploadLogs(reqLog);
});

module.exports = job; // Export the 'job' variable
