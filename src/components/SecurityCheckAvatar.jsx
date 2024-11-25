import React, { useState, useRef, useCallback } from 'react';
import { Card, CardContent } from "./Ui/Card/Card";
import { GuardAvatar } from './GuardAvatar/GuardAvatar';
import { CameraModal } from './CameraModal/CameraModal';
import { useFaceDetection } from '../hooks/useFaceDetection';
import { useGuardTimer } from '../hooks/useGuardTimer';

const initialGuards = [
  { id: 1, photo: null, isActive: false, timeRemaining: 60, name: 'Guard 1' },
  { id: 2, photo: null, isActive: false, timeRemaining: 60, name: 'Guard 2' },
  { id: 3, photo: null, isActive: false, timeRemaining: 60, name: 'Guard 3' },
  { id: 4, photo: null, isActive: false, timeRemaining: 60, name: 'Guard 4' }
];

const SecurityCheckAvatar = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isCameraReady, setIsCameraReady] = useState(false);
  const [countdown, setCountdown] = useState(null);
  const [processingPhoto, setProcessingPhoto] = useState(false);
  
  const videoRef = useRef(null);
  const streamRef = useRef(null);
  const currentGuardIdRef = useRef(null);

  const [guards, setGuards] = useGuardTimer(initialGuards);
  const { isDetecting, detectionResult, detectFace } = useFaceDetection();

  const updateGuardPhoto = useCallback((guardId, photoUrl) => {
    setGuards(prevGuards => 
      prevGuards.map(guard => 
        guard.id === guardId 
          ? {
              ...guard,
              photo: photoUrl,
              isActive: true,
              timeRemaining: 60, // 1 minute timer
            }
          : guard
      )
    );
  }, [setGuards]);

  const takePhoto = useCallback(async () => {
    if (!videoRef.current || !currentGuardIdRef.current) return;

    setProcessingPhoto(true);
    const video = videoRef.current;
    const guardId = currentGuardIdRef.current;

    try {
      // Create temporary canvas
      const canvas = document.createElement('canvas');
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      
      // Get context and draw current frame
      const ctx = canvas.getContext('2d');
      ctx.drawImage(video, 0, 0);
      
      // Convert to base64
      const photoUrl = canvas.toDataURL('image/jpeg', 0.8);

      // Start face detection
      await detectFace(photoUrl);

      // If face detection was successful, update the guard's photo
      if (detectionResult?.success) {
        updateGuardPhoto(guardId, photoUrl);
        setTimeout(handleCloseModal, 1500); // Give time to see success message
      }
    } catch (error) {
      console.error('Error capturing photo:', error);
      handleCloseModal();
    }
  }, [detectFace, detectionResult, updateGuardPhoto]);

  const startCountdown = useCallback(() => {
    let count = 3;
    setCountdown(count);
    
    const interval = setInterval(() => {
      count -= 1;
      if (count <= 0) {
        clearInterval(interval);
        setTimeout(() => {
          setCountdown(null);
          takePhoto();
        }, 500);
      }
      setCountdown(prev => prev > 0 ? prev - 1 : null);
    }, 1000);
  }, [takePhoto]);

  const startCamera = useCallback(async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: 'user' },
        audio: false
      });
      
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        streamRef.current = stream;
        await videoRef.current.play();
        setIsCameraReady(true);
        startCountdown();
      }
    } catch (err) {
      console.error('Camera error:', err);
      handleCloseModal();
    }
  }, [startCountdown]);

  const handleCloseModal = useCallback(() => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }
    videoRef.current = null;
    setIsModalOpen(false);
    setIsCameraReady(false);
    setCountdown(null);
    setProcessingPhoto(false);
  }, []);

  const handleAvatarClick = useCallback((guardId) => {
    currentGuardIdRef.current = guardId;
    setIsModalOpen(true);
    setTimeout(() => {
      startCamera();
    }, 100);
  }, [startCamera]);

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-gray-50">
      <Card className="w-[480px] shadow-xl">
        <CardContent className="p-6">
          <div className="grid grid-cols-2 gap-8 p-4">
            {guards.map(guard => (
              <div 
                key={`guard-${guard.id}`} 
                className="flex items-center justify-center"
              >
                <GuardAvatar
                  guard={guard}
                  onClick={() => handleAvatarClick(guard.id)}
                />
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
  
      <CameraModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        videoRef={videoRef}
        isCameraReady={isCameraReady}
        countdown={countdown}
        processingPhoto={processingPhoto}
        detectionResult={detectionResult}
        isDetecting={isDetecting}
      />
    </div>
  );
};

export default SecurityCheckAvatar;