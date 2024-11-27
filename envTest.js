const dotenv = require('dotenv');
const path = require('path');
const fs = require('fs');

// Print current directory
console.log('Current directory:', process.cwd());

// Check if .env file exists
const envPath = path.join(process.cwd(), '.env');
console.log('.env file exists:', fs.existsSync(envPath));

// Load environment variables
const result = dotenv.config();
if (result.error) {
    console.error('Error loading .env file:', result.error);
} else {
    console.log('.env file loaded successfully');
}

// Print environment variables
console.log('\nEnvironment variables:');
console.log('REACT_APP_AWS_REGION:', process.env.REACT_APP_AWS_REGION);
console.log('REACT_APP_AWS_ACCESS_KEY_ID:', process.env.REACT_APP_AWS_ACCESS_KEY_ID ? 'Set' : 'Not set');
console.log('REACT_APP_AWS_SECRET_ACCESS_KEY:', process.env.REACT_APP_AWS_SECRET_ACCESS_KEY ? 'Set' : 'Not set');