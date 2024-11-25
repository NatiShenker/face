import { useState, useCallback } from 'react';
import { FaceDetector, FilesetResolver } from '@mediapipe/tasks-vision';

export const useFaceDetection = () => {
  const [isDetecting, setIsDetecting] = useState(false);
  const [detectionResult, setDetectionResult] = useState(null);

  const detectFace = useCallback(async (imageData) => {
    setIsDetecting(true);
    setDetectionResult(null);

    try {
      const vision = await FilesetResolver.forVisionTasks(
        '/mediapipe/wasm',
        {
          wasmLoaderPath: '/mediapipe/wasm/vision_wasm_internal.js',
          wasmBinaryPath: '/mediapipe/wasm/vision_wasm_internal.wasm'
        }
      );
      
      const faceDetector = await FaceDetector.createFromOptions(vision, {
        baseOptions: {
          modelAssetPath: '/mediapipe/wasm/blaze_face_short_range.tflite',
          delegate: "CPU"
        },
        runningMode: "IMAGE"
      });

      // Create an image element from the data URL
      const img = new Image();
      img.src = imageData;
      await new Promise(resolve => img.onload = resolve);

      // Detect face
      const detections = await faceDetector.detect(img);

      if (detections.detections.length > 0) {
        setDetectionResult({ success: true, message: 'Face detected successfully!' });
      } else {
        setDetectionResult({ success: false, message: 'No face detected in image' });
      }
    } catch (error) {
      console.error('Face detection error:', error);
      setDetectionResult({ success: false, message: 'Error during face detection' });
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