import { useState, useCallback } from 'react';
import { FaceDetector, FilesetResolver } from '@mediapipe/tasks-vision';

export const useFaceDetection = () => {
  const [isDetecting, setIsDetecting] = useState(false);
  const [detectionResult, setDetectionResult] = useState(null);

  const detectFace = useCallback(async (imageData) => {
    setIsDetecting(true);
    setDetectionResult(null);

    try {
      // Using CDN URL instead of local files
      const vision = await FilesetResolver.forVisionTasks(
        "https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@latest/wasm"
      );
      
      const faceDetector = await FaceDetector.createFromOptions(vision, {
        baseOptions: {
          modelAssetPath: "https://storage.googleapis.com/mediapipe-models/face_detector/blaze_face_short_range/float16/1/blaze_face_short_range.tflite",
          delegate: "CPU"
        },
        runningMode: "IMAGE"
      });

      // Create an image element from the data URL
      const img = new Image();
      img.src = imageData;
      await new Promise((resolve, reject) => {
        img.onload = resolve;
        img.onerror = reject;
      });

      // Detect face
      const detections = await faceDetector.detect(img);
      console.log('Face detection result:', detections);

      if (detections.detections && detections.detections.length > 0) {
        setDetectionResult({ success: true, message: 'Face detected successfully!' });
      } else {
        setDetectionResult({ success: false, message: 'No face detected in image' });
      }
    } catch (error) {
      console.error('Face detection error:', error);
      setDetectionResult({ success: false, message: `Error: ${error.message}` });
    } finally {
      setIsDetecting(false);
    }
  }, []);

  return {
    isDetecting,
    detectionResult,
    detectFace
  };
};