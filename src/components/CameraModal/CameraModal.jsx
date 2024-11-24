// CameraModal.jsx
import React, { useEffect } from 'react';
import { Camera } from 'lucide-react';
import * as faceapi from '@vladmandic/face-api';  // Updated import

export const CameraModal = ({ 
  isOpen, 
  onClose, 
  videoRef, 
  canvasRef, 
  isCameraReady, 
  countdown,
  onPhotoTaken 
}) => {
  useEffect(() => {
    const loadModels = async () => {
      try {
        await Promise.all([
          faceapi.nets.tinyFaceDetector.loadFromUri('/models'),
          faceapi.nets.faceLandmark68Net.loadFromUri('/models'),
        ]);
      } catch (err) {
        console.error('Error loading face detection models:', err);
      }
    };
    
    if (isOpen) {
      loadModels();
    }
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-xl w-[520px] shadow-2xl">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold text-gray-900">Security Check-in Photo</h2>
          <button 
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 transition-colors"
          >
            ✕
          </button>
        </div>
        
        <div className="relative w-full aspect-video bg-black rounded-lg overflow-hidden shadow-inner">
          {!isCameraReady && (
            <div className="absolute inset-0 flex items-center justify-center">
              <Camera className="w-8 h-8 text-white animate-pulse" />
            </div>
          )}
          
          {countdown && (
            <div className="absolute inset-0 flex items-center justify-center z-10 bg-black/50 backdrop-blur-sm">
              <span className="text-7xl text-white font-bold animate-bounce">
                {countdown}
              </span>
            </div>
          )}
          
          <video
            ref={videoRef}
            autoPlay
            playsInline
            muted
            className="w-full h-full object-cover"
          />
          <canvas ref={canvasRef} className="hidden" />
        </div>
      </div>
    </div>
  );
};