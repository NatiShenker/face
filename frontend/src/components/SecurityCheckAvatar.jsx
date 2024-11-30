import React, { useState, useRef, useCallback } from 'react';
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
  const [error, setError] = useState(null);
  const [verificationResult, setVerificationResult] = useState(null);
  
  const pendingPhotoRef = useRef(null);
  const pendingFaceIdRef = useRef(null);

  const { guards, updateGuard } = useGuardState();
  const { isCameraReady, error: cameraError, videoRef, startCamera, stopCamera } = useCamera();
  const { isProcessing, processFrame, enrollFace } = useFaceProcessing();

  const handleCloseModal = useCallback(() => {
    stopCamera();
    setIsModalOpen(false);
    setError(null);
    setVerificationResult(null);
  }, [stopCamera]);

  const handleAvatarClick = useCallback(() => {
    setIsModalOpen(true);
    setError(null);
    
    startCamera().then(() => {
      setTimeout(() => handleCapturePhoto(), 3000);
    }).catch(err => {
      setError('Failed to start camera: ' + err.message);
    });
  }, [startCamera]);

  const handleCapturePhoto = useCallback(async () => {
    if (!videoRef.current) return;
  
    try {
      const canvas = document.createElement('canvas');
      canvas.width = videoRef.current.videoWidth;
      canvas.height = videoRef.current.videoHeight;
      const ctx = canvas.getContext('2d');
      ctx.drawImage(videoRef.current, 0, 0);
      const imageData = canvas.toDataURL('image/jpeg');
  
      const result = await processFrame(imageData, guards[0]?.id);
      
      if (result.success) {
        if (result.isNewFace) {
          // New face - store photo and prompt for username
          pendingPhotoRef.current = imageData;
          setVerificationResult({
            success: true,
            message: 'New face detected! Please choose a username.',
            photo: imageData
          });
          setTimeout(() => {
            handleCloseModal();
            setIsNameModalOpen(true);
          }, 1500);
        } else {
          // Existing face - use the returned name and guard ID
          setVerificationResult({
            success: true,
            message: `Welcome back, ${result.name}!`,
            photo: imageData
          });
          
          updateGuard(result.matchedGuardId, {
            isActive: true,
            timeRemaining: 30 * 60,
            photo: imageData
          });
          setTimeout(handleCloseModal, 1500);
        }
      }
    } catch (err) {
      console.error('Photo capture error:', err);
      setError('Failed to process face');
      setVerificationResult({
        success: false,
        message: 'Failed to process face'
      });
    }
  }, [videoRef, processFrame, guards, updateGuard, handleCloseModal]);

  const handleNameSubmit = useCallback(async (name) => {
    if (pendingPhotoRef.current) {
      try {
        // Enroll face with username
        const enrollResult = await enrollFace(
          pendingPhotoRef.current, 
          guards[0].id, 
          name
        );
  
        if (enrollResult.success) {
          updateGuard(guards[0].id, {
            name,
            photo: pendingPhotoRef.current,
            faceId: enrollResult.faceId,
            isActive: true,
            timeRemaining: 30 * 60
          });
        }
      } catch (error) {
        setError('Failed to save user information');
      } finally {
        // Always clean up regardless of success or failure
        pendingPhotoRef.current = null;
        setIsNameModalOpen(false);
      }
    }
  }, [enrollFace, updateGuard, guards]);

  // Rest of your component remains the same...
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-gray-50">
      <Card className="w-[480px]">
        <div className="p-6">
          <div className="grid grid-cols-1 gap-8 p-4">
            <GuardAvatar
              guard={guards[0]}
              onClick={handleAvatarClick}
            />
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