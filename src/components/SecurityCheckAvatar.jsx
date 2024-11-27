import React, { useState, useRef, useCallback, useEffect } from 'react';
import { Card } from "./Ui/Card/Card";
import { useCamera } from '../hooks/useCamera';
import { useFaceProcessing } from '../hooks/useFaceProcessing';
import { useGuardState } from '../hooks/useGuardState';
import CameraModal from './CameraModal/CameraModal';
import GuardAvatar from './GuardAvatar/GuardAvatar';
import GuardNameModal from './GuardNameModal/GuardNameModal';
import FaceRecognitionAnimation from './FaceRecognitionAnimation/FaceRecognitionAnimation';

const SecurityCheckAvatar = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isNameModalOpen, setIsNameModalOpen] = useState(false);
  const [isEnrollmentMode, setIsEnrollmentMode] = useState(false);
  const [error, setError] = useState(null);
  const [verificationResult, setVerificationResult] = useState(null);
  
  const currentGuardIdRef = useRef(null);
  const pendingPhotoRef = useRef(null);
  const pendingFaceIdRef = useRef(null);
  
  const { guards, updateGuard, isPositionAvailable } = useGuardState();
  const { 
    isCameraReady, 
    error: cameraError, 
    videoRef, 
    startCamera, 
    stopCamera, 
    captureFrame 
  } = useCamera();
  const { isProcessing, processFrame } = useFaceProcessing();

  const handleVerificationNeeded = useCallback((guardId) => {
    const guard = guards.find(g => g.id === guardId);
    // Allow verification only for assigned guards
    if (!guard.faceId) return;

    currentGuardIdRef.current = guardId;
    setIsEnrollmentMode(false);
    setIsModalOpen(true);
    startCamera();
  }, [guards, startCamera]);

  const handleAvatarClick = useCallback((guardId) => {
    console.log('Avatar clicked:', guardId);
    const guard = guards.find(g => g.id === guardId);
    
    if (guard.isAssigned && !guard.faceId) {
      console.log('Position already assigned to another guard');
      return;
    }
    
    currentGuardIdRef.current = guardId;
    setIsEnrollmentMode(!guard.faceId);
    setIsModalOpen(true);
    
    // Wrap camera start in requestAnimationFrame for better initialization
    requestAnimationFrame(() => {
      console.log('Starting camera...');
      startCamera().then((success) => {
        console.log('Camera start result:', success);
      }).catch(err => {
        console.error('Camera start error:', err);
        setError('Failed to start camera: ' + err.message);
      });
    });
  }, [guards, startCamera]);

const handleCloseModal = useCallback(() => {
  stopCamera();
  setIsModalOpen(false);
  setError(null);
  setVerificationResult(null);
}, [stopCamera]);

const handleCapturePhoto = useCallback(async () => {
  console.log('Capturing photo...');
  if (!videoRef.current) {
    console.error('No video reference available');
    return;
  }

  try {
    // Create a canvas element
    const canvas = document.createElement('canvas');
    canvas.width = videoRef.current.videoWidth;
    canvas.height = videoRef.current.videoHeight;

    // Draw the video frame to canvas
    const ctx = canvas.getContext('2d');
    ctx.drawImage(videoRef.current, 0, 0);

    // Convert to base64
    const imageData = canvas.toDataURL('image/jpeg');
    console.log('Photo captured, processing...');

    const result = await processFrame(
      imageData,
      currentGuardIdRef.current,
      isEnrollmentMode
    );
    
    console.log('Process result:', result);
    
    if (result?.success) {
      setVerificationResult({
        success: true,
        message: isEnrollmentMode ? 
          'Enrollment successful!' : 
          'Identity verified successfully!'
      });
      
      if (isEnrollmentMode) {
        pendingPhotoRef.current = imageData;
        pendingFaceIdRef.current = result.faceId;
        setTimeout(() => {
          handleCloseModal();
          setIsNameModalOpen(true);
        }, 1500);
      } else {
        updateGuard(currentGuardIdRef.current, {
          isActive: true,
          timeRemaining: 60
        });
        setTimeout(handleCloseModal, 1500);
      }
    }
  } catch (err) {
    console.error('Photo capture error:', err);
    setError(err.message);
    setVerificationResult({
      success: false,
      message: err.message
    });
  }
}, [videoRef, processFrame, isEnrollmentMode, updateGuard, handleCloseModal]);

  const handleNameSubmit = useCallback((name) => {
    if (pendingPhotoRef.current && pendingFaceIdRef.current) {
      updateGuard(currentGuardIdRef.current, {
        name,
        photo: pendingPhotoRef.current,
        faceId: pendingFaceIdRef.current,
        isAssigned: true,
        isActive: true,
        timeRemaining: 60
      });
      
      // Clear temporary storage
      pendingPhotoRef.current = null;
      pendingFaceIdRef.current = null;
      setIsNameModalOpen(false);
    }
  }, [updateGuard]);


  return (
    <div className="fixed inset-0 flex items-center justify-center bg-gray-50">
      <Card className="w-[480px]">
        <div className="p-6">
          <div className="grid grid-cols-2 gap-8 p-4">
            {guards.map(guard => (
              <GuardAvatar
                key={guard.id}
                guard={guard}
                onClick={handleAvatarClick}
                onVerificationNeeded={handleVerificationNeeded}
              />
            ))}
          </div>
        </div>
      </Card>

      <CameraModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        videoRef={videoRef}
        isCameraReady={isCameraReady}
        isProcessing={isProcessing}
        error={error || cameraError}
        mode={isEnrollmentMode ? 'enrollment' : 'verification'}
        onCapturePhoto={handleCapturePhoto}
        verificationResult={verificationResult}
      >
        <FaceRecognitionAnimation isActive={isCameraReady && !isProcessing} />
      </CameraModal>

      <GuardNameModal
        isOpen={isNameModalOpen}
        onClose={() => setIsNameModalOpen(false)}
        onSubmit={handleNameSubmit}
      />
    </div>
  );
};

export default SecurityCheckAvatar;