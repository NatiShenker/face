// src/hooks/useAWSRecognition.js
import { useState, useCallback } from 'react';
import { RekognitionClient, IndexFacesCommand, SearchFacesByImageCommand } from "@aws-sdk/client-rekognition";

export const useAWSRecognition = () => {
  const [isProcessing, setIsProcessing] = useState(false);
  const [recognitionResult, setRecognitionResult] = useState(null);

  const rekognitionClient = new RekognitionClient({
    region: process.env.REACT_APP_AWS_REGION,
    credentials: {
      accessKeyId: process.env.REACT_APP_AWS_ACCESS_KEY_ID,
      secretAccessKey: process.env.REACT_APP_AWS_SECRET_ACCESS_KEY
    }
  });

  // Function to enroll a new face (for initial guard setup)
  const enrollFace = useCallback(async (imageData, guardId) => {
    setIsProcessing(true);
    try {
      // Convert base64 image to binary
      const imageBytes = Buffer.from(imageData.replace(/^data:image\/\w+;base64,/, ""), 'base64');

      const command = new IndexFacesCommand({
        CollectionId: "guards-collection",
        Image: { Bytes: imageBytes },
        ExternalImageId: guardId.toString(),
        DetectionAttributes: ["ALL"]
      });

      const response = await rekognitionClient.send(command);

      if (response.FaceRecords && response.FaceRecords.length > 0) {
        return {
          success: true,
          faceId: response.FaceRecords[0].Face.FaceId
        };
      } else {
        throw new Error('No face detected in image');
      }
    } catch (error) {
      console.error('Face enrollment error:', error);
      throw error;
    } finally {
      setIsProcessing(false);
    }
  }, []);

  // Function to recognize a face (for guard verification)
  const recognizeFace = useCallback(async (imageData) => {
    setIsProcessing(true);
    try {
      const imageBytes = Buffer.from(imageData.replace(/^data:image\/\w+;base64,/, ""), 'base64');

      const command = new SearchFacesByImageCommand({
        CollectionId: "guards-collection",
        Image: { Bytes: imageBytes },
        FaceMatchThreshold: 90,
        MaxFaces: 1
      });

      const response = await rekognitionClient.send(command);

      if (response.FaceMatches && response.FaceMatches.length > 0) {
        const match = response.FaceMatches[0];
        return {
          success: true,
          matchedGuardId: match.Face.ExternalImageId,
          confidence: match.Similarity
        };
      } else {
        throw new Error('No matching face found');
      }
    } catch (error) {
      console.error('Face recognition error:', error);
      throw error;
    } finally {
      setIsProcessing(false);
    }
  }, []);

  return {
    isProcessing,
    recognitionResult,
    enrollFace,
    recognizeFace
  };
};