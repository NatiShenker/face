import React, { memo, useEffect, useCallback } from 'react';
import { Alert, AlertDescription } from "../Ui/Alert/Alert";
import { Camera, CheckCircle2, XCircle } from "lucide-react";
import { useCountdown } from '../../hooks/useCountdown';

const CameraModal = memo(({
  isOpen,
  onClose,
  videoRef,
  isCameraReady,
  isProcessing,
  error,
  mode,
  onCapturePhoto,
  verificationResult,
  children
}) => {
  const { count, runCountdown, resetCountdown } = useCountdown();

  // Start countdown when camera is ready
  useEffect(() => {
    if (isCameraReady && !isProcessing && !count) {
      // Small delay to ensure camera is fully ready
      const timer = setTimeout(() => {
        runCountdown(onCapturePhoto);
      }, 500);

      return () => clearTimeout(timer);
    }
  }, [isCameraReady, isProcessing, count, runCountdown, onCapturePhoto]);

  // Reset on close
  useEffect(() => {
    if (!isOpen) {
      resetCountdown();
    }
  }, [isOpen, resetCountdown]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg max-w-lg w-full p-6">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-medium">
            {mode === 'enrollment' ? 'Guard Enrollment' : 'Guard Verification'}
          </h3>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            ×
          </button>
        </div>

        <div className="relative aspect-video bg-gray-100 rounded-lg overflow-hidden mb-4">
          <video
            ref={videoRef}
            className={`w-full h-full object-cover ${!isCameraReady ? 'hidden' : ''}`}
            playsInline
            autoPlay
            muted
          />
          
          {!isCameraReady && !error && (
            <div className="absolute inset-0 flex items-center justify-center">
              <Camera className="w-12 h-12 text-gray-400 animate-pulse" />
              <span className="ml-2 text-gray-500">Initializing camera...</span>
            </div>
          )}
          
          {count !== null && (
            <div className="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center">
              <div className="text-white text-8xl font-bold animate-bounce">
                {count}
              </div>
            </div>
          )}
          
          {isProcessing && (
            <div className="absolute inset-0 bg-black bg-opacity-50 flex flex-col items-center justify-center">
              <div className="text-white mb-2">Processing...</div>
              <div className="w-8 h-8 border-4 border-white border-t-transparent rounded-full animate-spin"></div>
            </div>
          )}

          {verificationResult && (
            <div className={`absolute inset-0 bg-black bg-opacity-50 flex flex-col items-center justify-center ${
              verificationResult.success ? 'text-green-500' : 'text-red-500'
            }`}>
              {verificationResult.success ? (
                <>
                  <CheckCircle2 className="w-16 h-16 mb-2" />
                  <div className="text-white text-lg">Verification Successful</div>
                </>
              ) : (
                <>
                  <XCircle className="w-16 h-16 mb-2" />
                  <div className="text-white text-lg">Verification Failed</div>
                </>
              )}
              <div className="text-white text-sm mt-2">{verificationResult.message}</div>
            </div>
          )}

          {children}
        </div>

        {error && (
          <Alert variant="destructive" className="mt-4">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        <div className="mt-4 text-center text-sm text-gray-500">
          {count !== null ? (
            <span>Taking photo in {count} seconds...</span>
          ) : (
            mode === 'enrollment' ? 
              'Look directly at the camera for initial enrollment' : 
              'Please look at the camera for verification'
          )}
        </div>
      </div>
    </div>
  );
});

export default CameraModal;