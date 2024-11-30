const express = require('express');
const cors = require('cors');
const { 
    RekognitionClient, 
    IndexFacesCommand, 
    SearchFacesByImageCommand,
    DeleteCollectionCommand, 
    CreateCollectionCommand,
    ListFacesCommand // Add this import
  } = require('@aws-sdk/client-rekognition');
require('dotenv').config();
const path = require('path');

const app = express();

// In-memory storage for face-name mappings (replace with database in production)
const faceNameMap = new Map();

app.use(cors({
  origin: ["https://face-9g1u.onrender.com", "http://localhost:3000"],
  methods: ['GET', 'POST', 'OPTIONS'],
  allowedHeaders: ['Content-Type'],
  credentials: true
}));

app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

const rekognitionClient = new RekognitionClient({
  region: process.env.AWS_REGION || 'us-east-1',
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY
  }
});

app.use(express.static(path.join(__dirname, '../frontend/build')));

// Updated enroll face endpoint to store name
app.post('/api/enroll-face', async (req, res) => {
    try {
      const { imageData, guardId, username } = req.body;
      const imageBytes = Buffer.from(imageData.split(',')[1], 'base64');
  
      // Store guardId and username together in ExternalImageId
      const externalImageId = `${guardId}:${username}`;
  
      const command = new IndexFacesCommand({
        CollectionId: "guards-collection",
        Image: { Bytes: imageBytes },
        ExternalImageId: externalImageId,
        DetectionAttributes: ["ALL"]
      });
  
      const response = await rekognitionClient.send(command);
      console.log('Enrollment response:', JSON.stringify(response, null, 2));
      
      if (!response.FaceRecords || response.FaceRecords.length === 0) {
        throw new Error('No face detected in the image');
      }

      // Log successful enrollment
      console.log('Successfully enrolled face:', {
        faceId: response.FaceRecords[0].Face.FaceId,
        guardId,
        username,
        externalImageId
      });
  
      res.json({
        success: true,
        faceId: response.FaceRecords[0].Face.FaceId,
        guardId,
        name: username
      });
    } catch (error) {
      console.error('Enrollment error:', error);
      res.status(500).json({ error: error.message });
    }
});

app.post('/api/verify-face', async (req, res) => {
    try {
      const { imageData } = req.body;
      const imageBytes = Buffer.from(imageData.split(',')[1], 'base64');
  
      const command = new SearchFacesByImageCommand({
        CollectionId: "guards-collection",
        Image: { Bytes: imageBytes },
        FaceMatchThreshold: 80, // Lowered threshold slightly for better matching
        MaxFaces: 1
      });
  
      const response = await rekognitionClient.send(command);
      console.log('Rekognition response:', response);
      
      if (response.FaceMatches && response.FaceMatches.length > 0) {
        const match = response.FaceMatches[0];
        const externalImageId = match.Face.ExternalImageId; // This contains "guardId:username"
        console.log('Found match with externalImageId:', externalImageId);
        
        // Split the externalImageId to get guardId and username
        const [guardId, username] = externalImageId.split(':');
        
        return res.json({
          success: true,
          confidence: match.Similarity,
          matchedGuardId: guardId,
          name: username
        });
      }
  
      // If no matches found, return 404
      return res.status(404).json({ 
        success: false,
        error: 'No matching face found' 
      });
      
    } catch (error) {
      console.error('Verification error:', error);
      res.status(500).json({ error: error.message });
    }
});

app.post('/api/reset-collection', async (req, res) => {
    try {
      // First try to delete the existing collection
      try {
        await rekognitionClient.send(new DeleteCollectionCommand({
          CollectionId: "guards-collection"
        }));
        console.log('Collection deleted successfully');
      } catch (deleteError) {
        console.log('Delete collection error (might not exist):', deleteError);
      }
  
      // Wait a bit for AWS to process the deletion
      await new Promise(resolve => setTimeout(resolve, 2000));
  
      // Create new collection
      await rekognitionClient.send(new CreateCollectionCommand({
        CollectionId: "guards-collection"
      }));
  
      res.json({ success: true, message: 'Collection reset successfully' });
    } catch (error) {
      console.error('Reset collection error:', error);
      res.status(500).json({ error: error.message });
    }
});

// This should be after all your API routes
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '../frontend/build', 'index.html'));
});


const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});