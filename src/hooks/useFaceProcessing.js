import { useState, useRef } from 'react';
import { RekognitionClient, IndexFacesCommand, SearchFacesByImageCommand } from "@aws-sdk/client-rekognition";

export const useFaceProcessing = () => {
  const [isProcessing, setIsProcessing] = useState(false);
  const processingRef = useRef(false);

  const rekognitionClient = new RekognitionClient({
    region: process.env.REACT_APP_AWS_REGION,
    credentials: {
      accessKeyId: process.env.REACT_APP_AWS_ACCESS_KEY_ID,
      secretAccessKey: process.env.REACT_APP_AWS_SECRET_ACCESS_KEY
    }
  });

  const convertBase64ToUint8Array = (base64Data) => {
    const binaryString = window.atob(base64Data.split(',')[1]);
    const bytes = new Uint8Array(binaryString.length);
    for (let i = 0; i < binaryString.length; i++) {
      bytes[i] = binaryString.charCodeAt(i);
    }
    return bytes;
  };

  const enrollFace = async (imageData, guardId) => {
    setIsProcessing(true);
    try {
      const imageBytes = convertBase64ToUint8Array(imageData);

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
      }
      throw new Error('No face detected in image');
    } catch (error) {
      console.error('Face enrollment error:', error);
      throw error;
    } finally {
      setIsProcessing(false);
    }
  };

  const verifyFace = async (imageData, guardId) => {
    setIsProcessing(true);
    try {
      const imageBytes = convertBase64ToUint8Array(imageData);

      const command = new SearchFacesByImageCommand({
        CollectionId: "guards-collection",
        Image: { Bytes: imageBytes },
        FaceMatchThreshold: 90,
        MaxFaces: 1 // Only need the best match
      });

      const response = await rekognitionClient.send(command);

      if (response.FaceMatches && response.FaceMatches.length > 0) {
        const match = response.FaceMatches[0];
        // Only return success if the matched ID exactly matches the expected guard ID
        if (match.Face.ExternalImageId === guardId.toString()) {
          return {
            success: true,
            matchedGuardId: match.Face.ExternalImageId,
            confidence: match.Similarity
          };
        }
        // If we found a match but it's not the right guard, it means they're trying to verify at the wrong position
        throw new Error('This position is assigned to a different guard');
      }
      throw new Error('No matching face found');
    } catch (error) {
      console.error('Face verification error:', error);
      throw error;
    } finally {
      setIsProcessing(false);
    }
  };

  const processFrame = async (imageData, guardId, isEnrollment = false) => {
    if (processingRef.current) return null;
    processingRef.current = true;
    
    try {
      if (isEnrollment) {
        return await enrollFace(imageData, guardId);
      } else {
        return await verifyFace(imageData, guardId);
      }
    } finally {
      processingRef.current = false;
    }
    
  };

  return {
    isProcessing,
    processFrame
  };
};