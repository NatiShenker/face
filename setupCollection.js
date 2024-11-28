const dotenv = require('dotenv');
const { RekognitionClient, CreateCollectionCommand } = require("@aws-sdk/client-rekognition");

dotenv.config();

const setupCollection = async () => {
  const rekognitionClient = new RekognitionClient({
    // region: process.env.REACT_APP_AWS_REGION,
    region: 'us-east-1',
    credentials: {
      accessKeyId: process.env.REACT_APP_AWS_ACCESS_KEY_ID,
      secretAccessKey: process.env.REACT_APP_AWS_SECRET_ACCESS_KEY
    }
  });

  try {
    const createCollectionCommand = new CreateCollectionCommand({
      CollectionId: "guards-collection"
    });

    const response = await rekognitionClient.send(createCollectionCommand);
    console.log("Collection created successfully:", response);
    return response;
  } catch (error) {
    if (error.name === 'ResourceAlreadyExistsException') {
      console.log("Collection already exists - ready to use!");
      return null;
    }
    console.error("Error creating collection:", error);
    throw error;
  }
};

// Run setup
setupCollection()
  .then(() => console.log("Setup complete!"))
  .catch(err => console.error("Setup failed:", err));