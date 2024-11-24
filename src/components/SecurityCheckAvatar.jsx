// src/components/SecurityCheckAvatar/SecurityCheckAvatar.jsx
import React, { useState, useEffect, useRef } from 'react';
import { Card, CardContent } from "./Ui/Card/Card";
import { GuardAvatar } from './GuardAvatar/GuardAvatar';

const SecurityCheckAvatar = () => {
  const [guards, setGuards] = useState([
    { id: 1, photo: null, isActive: false, timeRemaining: 300, name: 'Guard 1' },
    { id: 2, photo: null, isActive: false, timeRemaining: 300, name: 'Guard 2' },
    { id: 3, photo: null, isActive: false, timeRemaining: 300, name: 'Guard 3' },
    { id: 4, photo: null, isActive: false, timeRemaining: 300, name: 'Guard 4' }
  ]);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [countdown, setCountdown] = useState(null);
  const videoRef = useRef(null);
  const streamRef = useRef(null);
  const currentGuardIdRef = useRef(null);

  const updateGuardPhoto = (guardId, photoUrl) => {
    console.log('Updating photo for guard:', guardId);
    setGuards(prevGuards => 
      prevGuards.map(guard => 
        guard.id === guardId 
          ? {
              ...guard,
              photo: photoUrl,
              isActive: true,
              timeRemaining: 300,
            }
          : guard
      )
    );
  };

  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: 'user' },
        audio: false
      });
      
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        streamRef.current = stream;
        await videoRef.current.play();
        startCountdown();
      }
    } catch (err) {
      console.error('Camera error:', err);
      handleCloseModal();
    }
  };

  const takePhoto = () => {
    if (!videoRef.current || !currentGuardIdRef.current) return;

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
      console.log('Photo captured for guard:', guardId);

      // Update immediately
      updateGuardPhoto(guardId, photoUrl);

      // Clean up
      handleCloseModal();
    } catch (error) {
      console.error('Error capturing photo:', error);
      handleCloseModal();
    }
  };

  const startCountdown = () => {
    let count = 3;
    setCountdown(count);
    
    const interval = setInterval(() => {
      count -= 1;
      if (count <= 0) {
        clearInterval(interval);
        setTimeout(() => {
          takePhoto();
        }, 500);
      }
      setCountdown(prev => prev > 0 ? prev - 1 : null);
    }, 1000);
  };

  const handleCloseModal = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }
    videoRef.current = null;
    setIsModalOpen(false);
    setCountdown(null);
  };

  const handleAvatarClick = (guardId) => {
    console.log('Avatar clicked:', guardId);
    currentGuardIdRef.current = guardId;
    setIsModalOpen(true);
    setTimeout(() => {
      startCamera();
    }, 100);
  };

  // Timer effect
  useEffect(() => {
    const timer = setInterval(() => {
      setGuards(prevGuards => 
        prevGuards.map(guard => ({
          ...guard,
          timeRemaining: guard.isActive ? 
            Math.max(0, guard.timeRemaining - 1) : 300
        }))
      );
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-gray-50">
      <Card className="w-[480px] shadow-xl">
        <CardContent className="p-8">
          <div className="grid grid-cols-2 gap-12 place-items-center">
            {guards.map(guard => (
              <GuardAvatar
                key={`guard-${guard.id}-${guard.photo ? 'withPhoto' : 'noPhoto'}`}
                guard={guard}
                onClick={() => handleAvatarClick(guard.id)}
              />
            ))}
          </div>
        </CardContent>
      </Card>

      {isModalOpen && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-xl w-[520px] shadow-2xl">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold text-gray-900">Security Check-in Photo</h2>
              <button 
                onClick={handleCloseModal}
                className="text-gray-500 hover:text-gray-700 transition-colors"
              >
                ✕
              </button>
            </div>
            
            <div className="relative w-full aspect-video bg-black rounded-lg overflow-hidden shadow-inner">
              {countdown !== null && (
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
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SecurityCheckAvatar;