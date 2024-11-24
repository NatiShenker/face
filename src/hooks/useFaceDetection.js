// useFaceDetection.js
import { useState, useEffect } from 'react';
import * as faceapi from '@vladmandic/face-api';

export const useFaceDetection = () => {
  const [isModelLoaded, setIsModelLoaded] = useState(false);
  const [faceDetected, setFaceDetected] = useState(false);

  useEffect(() => {
    let mounted = true;

    const loadModels = async () => {
      try {
        // Define model path
        const MODEL_URL = '/models';
        
        // Configure face-api.js to use the correct models
        await faceapi.nets.tinyFaceDetector.loadFromUri(MODEL_URL);
        await faceapi.nets.faceLandmark68Net.loadFromUri(MODEL_URL);

        if (mounted) {
          setIsModelLoaded(true);
          console.log('Face detection models loaded successfully');
        }
      } catch (error) {
        console.error('Error loading face detection models:', error);
        if (mounted) {
          setIsModelLoaded(false);
        }
      }
    };

    loadModels();

    return () => {
      mounted = false;
    };
  }, []);

  const detectFace = async (imageElement) => {
    if (!isModelLoaded) {
      console.warn('Face detection models not loaded yet');
      return null;
    }

    try {
      const options = new faceapi.TinyFaceDetectorOptions({
        inputSize: 512,
        scoreThreshold: 0.5
      });

      const detection = await faceapi.detectSingleFace(imageElement, options);

      if (detection) {
        setFaceDetected(true);
        return detection;
      }
      
      setFaceDetected(false);
      return null;
    } catch (err) {
      console.error('Face detection error:', err);
      setFaceDetected(false);
      return null;
    }
  };

  const cropFace = (video, detection, padding = 50) => {
    if (!detection) return null;

    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');

    // Get face bounds with padding
    const box = detection.box;
    const width = box.width + padding * 2;
    const height = box.height + padding * 2;
    const x = Math.max(0, box.x - padding);
    const y = Math.max(0, box.y - padding);

    // Set canvas size to face dimensions
    canvas.width = width;
    canvas.height = height;

    // Draw only the face region
    ctx.drawImage(
      video,
      x, y, width, height,  // Source coordinates
      0, 0, width, height   // Destination coordinates
    );

    return canvas.toDataURL('image/jpeg', 0.8);
  };

  return {
    isModelLoaded,
    faceDetected,
    detectFace,
    cropFace
  };
};