// useCameraHandler.js
import React, { useState, useRef } from "react";


export const useCameraHandler = (onPhotoTaken) => {
    const [isCameraReady, setIsCameraReady] = useState(false);
    const [countdown, setCountdown] = useState(null);
    const videoRef = useRef(null);
    const canvasRef = useRef(null);
    const streamRef = useRef(null);
  
    const startCamera = async () => {
      setIsCameraReady(false);
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: {
            width: { ideal: 1920 },
            height: { ideal: 1080 },
            facingMode: 'user'
          },
          audio: false
        });
        
        streamRef.current = stream;
        videoRef.current.srcObject = stream;
        await videoRef.current.play();
        
        setIsCameraReady(true);
        startCountdown();
      } catch (err) {
        console.error('Camera error:', err);
        return false;
      }
      return true;
    };
  
    const startCountdown = () => {
      let count = 3;
      setCountdown(count);
      
      const countdownInterval = setInterval(() => {
        count -= 1;
        if (count <= 0) {
          clearInterval(countdownInterval);
          setTimeout(() => {
            if (onPhotoTaken && videoRef.current) {
              onPhotoTaken(videoRef.current);
            }
          }, 0);
        }
        setCountdown(count > 0 ? count : null);
      }, 1000);
    };
  
    const cleanupCamera = () => {
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(track => track.stop());
        streamRef.current = null;
      }
      setIsCameraReady(false);
      setCountdown(null);
    };
  
    return {
      isCameraReady,
      countdown,
      videoRef,
      canvasRef,
      startCamera,
      cleanupCamera
    };
  };