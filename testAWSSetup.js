const dotenv = require('dotenv');
const { RekognitionClient, ListCollectionsCommand } = require("@aws-sdk/client-rekognition");

// Load environment variables
dotenv.config();

const testAWSSetup = async () => {
  // Check if environment variables are set
  if (!process.env.REACT_APP_AWS_ACCESS_KEY_ID) {
    throw new Error('REACT_APP_AWS_ACCESS_KEY_ID is not set in environment variables');
  }
  if (!process.env.REACT_APP_AWS_SECRET_ACCESS_KEY) {
    throw new Error('REACT_APP_AWS_SECRET_ACCESS_KEY is not set in environment variables');
  }
  
  // Use environment variable for region or fallback to us-east-1
  const region = process.env.REACT_APP_AWS_REGION || 'us-east-1';
  console.log('Using AWS Region:', region);

  const rekognitionClient = new RekognitionClient({
    region: region,
    credentials: {
      accessKeyId: process.env.REACT_APP_AWS_ACCESS_KEY_ID,
      secretAccessKey: process.env.REACT_APP_AWS_SECRET_ACCESS_KEY
    }
  });

  try {
    const listCommand = new ListCollectionsCommand({});
    const response = await rekognitionClient.send(listCommand);
    console.log("Available collections:", response.CollectionIds);
    
    if (response.CollectionIds.includes("guards-collection")) {
      console.log("guards-collection exists!");
    } else {
      console.log("guards-collection not found!");
    }
    
  } catch (error) {
    console.error("AWS Connection Error:", error);
    if (error.message.includes('Region is missing')) {
      console.error("Please make sure REACT_APP_AWS_REGION is set in your .env file");
    }
    throw error;
  }
};

// Run test with better error handling
testAWSSetup()
  .then(() => console.log("AWS test complete"))
  .catch(err => {
    console.error("AWS test failed:", err.message);
    process.exit(1);
  });