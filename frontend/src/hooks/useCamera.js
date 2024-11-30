import { useState, useRef, useCallback } from 'react';

export const useCamera = () => {
  const [isCameraReady, setIsCameraReady] = useState(false);
  const [error, setError] = useState(null);
  const videoRef = useRef(null);
  const streamRef = useRef(null);

  const startCamera = useCallback(async () => {
    setError(null);
    setIsCameraReady(false); // Reset camera state

    if (!navigator.mediaDevices?.getUserMedia) {
      setError('Camera access is not supported in your browser');
      return false;
    }

    try {
      // Stop any existing stream
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(track => track.stop());
      }

      // Request camera access with explicit constraints
      const stream = await navigator.mediaDevices.getUserMedia({
        video: {
          facingMode: 'user',
          width: { ideal: 1280 },
          height: { ideal: 720 }
        },
        audio: false
      });

      // Ensure video element exists
      if (!videoRef.current) {
        throw new Error('Video element not found');
      }

      // Set up stream
      videoRef.current.srcObject = stream;
      streamRef.current = stream;

      // Wait for video to be ready
      await new Promise((resolve, reject) => {
        videoRef.current.onloadedmetadata = () => {
          videoRef.current.play()
            .then(resolve)
            .catch(reject);
        };
        videoRef.current.onerror = () => reject(new Error('Failed to load video'));
      });

      console.log('Camera started successfully');
      setIsCameraReady(true);
      return true;

    } catch (err) {
      console.error('Camera initialization error:', err);
      let errorMessage = 'Failed to initialize camera';
      
      if (err.name === 'NotAllowedError') {
        errorMessage = 'Camera access denied. Please allow camera access and try again.';
      } else if (err.name === 'NotFoundError') {
        errorMessage = 'No camera found. Please ensure your camera is connected.';
      } else if (err.name === 'NotReadableError') {
        errorMessage = 'Camera is in use by another application.';
      }

      setError(errorMessage);
      return false;
    }
  }, []);

  const stopCamera = useCallback(() => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }
    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }
    setIsCameraReady(false);
    setError(null);
  }, []);

  const captureFrame = useCallback(() => {
    if (!videoRef.current || !isCameraReady) return null;

    const canvas = document.createElement('canvas');
    canvas.width = videoRef.current.videoWidth;
    canvas.height = videoRef.current.videoHeight;
    const ctx = canvas.getContext('2d');
    ctx.drawImage(videoRef.current, 0, 0);
    return canvas.toDataURL('image/jpeg', 0.8);
  }, [isCameraReady]);

  return {
    isCameraReady,
    error,
    videoRef,
    startCamera,
    stopCamera,
    captureFrame
  };
};