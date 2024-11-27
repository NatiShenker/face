// setupAWSCollection.js
import { RekognitionClient, CreateCollectionCommand } from "@aws-sdk/client-rekognition";

const setupCollection = async () => {
  // Initialize the Rekognition client
  const rekognitionClient = new RekognitionClient({
    region: "us-east-1", // Using US East (N. Virginia)
    credentials: {
      accessKeyId: '', // Replace with your Access Key
      secretAccessKey: '' // Replace with your Secret Key
    }
  });

  try {
    // Create a face collection
    const createCollectionCommand = new CreateCollectionCommand({
      CollectionId: "guards-collection" // This will be our collection name
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

// Run the setup
setupCollection()
  .then(() => console.log("Setup complete!"))
  .catch(err => console.error("Setup failed:", err));