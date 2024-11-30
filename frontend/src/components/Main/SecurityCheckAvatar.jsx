import React, { useState, useRef, useCallback, useEffect } from 'react';
import { useCamera } from '../../hooks/useCamera';
import { useFaceProcessing } from '../../hooks/useFaceProcessing';
import { useGuardState } from '../../hooks/useGuardState';
import CameraModal from '../CameraModal/CameraModal';
import GuardNameModal from '../GuardNameModal/GuardNameModal';
import FaceRecognitionAnimation from '../FaceRecognitionAnimation/FaceRecognitionAnimation';
import SuccessScreen from './SuccessScreen';

const SecurityCheckAvatar = () => {
  const [isModalOpen, setIsModalOpen] = useState(true);
  const [isNameModalOpen, setIsNameModalOpen] = useState(false);
  const [error, setError] = useState(null);
  const [verificationResult, setVerificationResult] = useState(null);
  const [showSuccess, setShowSuccess] = useState(false);
  
  const pendingPhotoRef = useRef(null);
  const pendingFaceIdRef = useRef(null);

  const { guards, updateGuard } = useGuardState();
  const { isCameraReady, error: cameraError, videoRef, startCamera, stopCamera } = useCamera();
  const { isProcessing, processFrame, enrollFace } = useFaceProcessing();

  useEffect(() => {
    startCamera().then(() => {
      setTimeout(() => handleCapturePhoto(), 3000);
    }).catch(err => {
      setError('Failed to start camera: ' + err.message);
    });
  }, []);

  // ... rest of the handlers remain the same ...
  const handleCloseModal = useCallback(() => {
    stopCamera();
    setIsModalOpen(false);
    setError(null);
    setVerificationResult(null);
  }, [stopCamera]);

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

          setTimeout(() => {
            handleCloseModal();
            setShowSuccess(true);
          }, 1500);
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
          setShowSuccess(true);
        }
      } catch (error) {
        setError('Failed to save user information');
      } finally {
        pendingPhotoRef.current = null;
        setIsNameModalOpen(false);
      }
    }
  }, [enrollFace, updateGuard, guards]);

  if (showSuccess) {
    return <SuccessScreen name={guards[0]?.name} />;
  }

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-gray-50">
      <div className="w-full max-w-[800px] mx-auto px-4">
        <div className="relative aspect-[4/3] w-full flex items-center justify-center">
          {/* iPad Frame - now in portrait orientation */}
          <div className="relative h-full aspect-[3/4] bg-black rounded-[38px] p-3 shadow-2xl overflow-hidden">
            {/* iPad Camera Notch */}
            <div className="absolute top-0 left-1/2 transform -translate-x-1/2 w-32 h-5 bg-black rounded-b-2xl z-10" />
            
            {/* Main Content Area */}
            <div className="bg-white h-full w-full rounded-[32px] relative">
              {/* Modals */}
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
          </div>
        </div>
      </div>
    </div>
  );
};

export default SecurityCheckAvatar;