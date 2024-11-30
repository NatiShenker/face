import { useState, useRef } from 'react';

export const useFaceProcessing = () => {
  const [isProcessing, setIsProcessing] = useState(false);
  const processingRef = useRef(false);

  const enrollFace = async (imageData, guardId, username) => {
    try {
      const response = await fetch('/api/enroll-face', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          imageData,
          guardId,
          username
        })
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || 'Failed to enroll face');
      }

      return data;
    } catch (error) {
      console.error('Enroll face error:', error);
      throw error;
    }
  };

  const processFrame = async (imageData, guardId) => {
    if (processingRef.current) return null;
    processingRef.current = true;
    setIsProcessing(true);
    
    try {
      const verifyResponse = await fetch('/api/verify-face', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ imageData })
      });

      const verifyData = await verifyResponse.json();
      console.log('Verification response:', verifyData);

      // If verification is successful (face found)
      if (verifyResponse.ok) {
        return {
          success: true,
          isNewFace: false,
          matchedGuardId: verifyData.matchedGuardId,
          name: verifyData.name
        };
      }

      // If no match found (404), treat as new face
      if (verifyResponse.status === 404) {
        return {
          success: true,
          isNewFace: true
        };
      }

      throw new Error(verifyData.error || 'Verification failed');
    } catch (error) {
      console.error('Process frame error:', error);
      throw error;
    } finally {
      processingRef.current = false;
      setIsProcessing(false);
    }
  };

  return { isProcessing, processFrame, enrollFace };
};