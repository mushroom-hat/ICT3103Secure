const { S3Client, PutObjectCommand } = require('@aws-sdk/client-s3');
const fs = require('fs');
const path = require('path');

const BUCKET_NAME = 'charsity';
const UPLOADS_DIR = path.join(__dirname, '../logs');

async function uploadLogs(logFile) {
    try {
        // Construct the file path
        const filepath = path.join(UPLOADS_DIR, logFile);

        // Check if the file exists before reading it
        if (fs.existsSync(filepath)) {
            // Get the file extension and file name
            const filename = path.basename(filepath);
            const fileContent = fs.readFileSync(filepath);

            // File parameters
            const params = {
                Body: fileContent,
                Bucket: BUCKET_NAME,
                Key: filename,
            };

            const client = new S3Client({ region: 'ap-southeast-1' });

            const command = new PutObjectCommand(params);

            // Upload file to AWS S3
            const data = await client.send(command);
            console.log(`Successfully uploaded data to ${BUCKET_NAME}/${filename}`);
            return { message: `File uploaded successfully to Charsity S3 Bucket.` };
        } else {
            console.log(`File ${logFile} does not exist. Skipped uploading.`);
            return { message: `File does not exist.` };
        }
    } catch (error) {
        // Handle other errors
        console.error('Error uploading file to S3:', error);
        throw error;
    }
}

module.exports = uploadLogs;
