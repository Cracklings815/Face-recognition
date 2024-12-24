// need to add openCV with python + django if possible for face recognition
import React, { useState, useRef, useEffect } from 'react';
import { Camera } from "lucide-react";

const FaceRecognition = ({ onSuccess }) => {
  const videoRef = useRef(null);
  const [status, setStatus] = useState("Position your face in the frame");
  const [isPopupVisible, setPopupVisible] = useState(false);
  const [popupMessage, setPopupMessage] = useState("");
  const [popupColor, setPopupColor] = useState("bg-gray-200");
  const [failedAttempts, setFailedAttempts] = useState(3);
  const [isScanning, setIsScanning] = useState(false);
  const [cameraError, setCameraError] = useState(false);

  useEffect(() => {
    startCamera();
    // Cleanup function to stop camera when component unmounts
    return () => {
      if (videoRef.current && videoRef.current.srcObject) {
        const tracks = videoRef.current.srcObject.getTracks();
        tracks.forEach(track => track.stop());
      }
    };
  }, []);

  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: {
          facingMode: "user",
          width: { ideal: 1280 },
          height: { ideal: 720 }
        }
      });
      
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
      setCameraError(false);
    } catch (err) {
      console.error("Error accessing camera:", err);
      setCameraError(true);
      setStatus("Camera access denied. Please enable camera permissions.");
    }
  };

  const handleScan = () => {
    if (cameraError) return;
    
    setIsScanning(true);
    setPopupMessage("Scanning...");
    setPopupColor("bg-blue-500");
    setPopupVisible(true);
    setStatus("Scanning...");

    setTimeout(() => {
      const isSuccess = Math.random() > 0.5; // Demo: Random success/failure
      if (isSuccess) {
        setPopupMessage("Login Successful!");
        setPopupColor("bg-green-500");
        setStatus("Login Successful!");
        setFailedAttempts(0);

        setTimeout(() => {
          if (onSuccess) onSuccess();
        }, 2000);
      } else {
        setPopupMessage("Face not recognized! Try again.");
        setPopupColor("bg-red-500");
        setStatus("Authentication Failed!");
        setFailedAttempts((prev) => prev + 1);
      }

      setIsScanning(false);
      setTimeout(() => {
        setPopupVisible(false);
      }, 2000);
    }, 2000);
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <div className="bg-white shadow-md rounded-lg p-6 w-96">
        <h1 className="text-3xl font-bold mb-10 text-center">Face Recognition</h1>
        <div className="flex flex-col items-center mb-4">
          <div className="w-64 h-64 border-4 border-gray-300 rounded-lg overflow-hidden relative">
            <video
              ref={videoRef}
              autoPlay
              playsInline
              muted
              className="w-full h-full object-cover"
            />
            {cameraError && (
              <div className="absolute inset-0 flex items-center justify-center bg-gray-100">
                <Camera size={64} className="text-gray-400" />
                <p className="text-sm text-gray-500 mt-4">Camera access required</p>
              </div>
            )}
            {!cameraError && (
              <button
                onClick={handleScan}
                disabled={isScanning}
                className={`absolute bottom-4 left-1/2 transform -translate-x-1/2 px-4 py-2 rounded-full
                  ${isScanning ? 'bg-blue-500' : 'bg-green-500'} 
                  text-white font-semibold shadow-lg
                  ${isScanning ? 'cursor-not-allowed' : 'hover:bg-green-600'}`}
              >
                {isScanning ? 'Scanning...' : 'Verify Face'}
              </button>
            )}
          </div>
        </div>
        <p className="text-center text-gray-600 mt-4">{status}</p>
      </div>

      {/* Popup Message
      {isPopupVisible && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div
            className={`${popupColor} rounded-lg shadow-lg p-8 w-96 text-center text-white transition-all duration-300`}
          >
            <h2 className="text-2xl font-bold mb-2">{popupMessage}</h2>
            {popupMessage === "Scanning..." && (
              <p className="text-lg">Please keep your face steady while we verify your identity.</p>
            )}
          </div>
        </div>
      )} */}
      

      {/* Register Message */}
      {failedAttempts >= 3 && (
        <div className="mt-6 text-center text-sm">
          <p className="text-gray-600 mb-2">Having trouble logging in?</p>
          <button
            onClick={() => window.location.href = '/register'}
            className="text-blue-500 underline hover:text-blue-600"
          >
            Register New Face ID
          </button>
        </div>
      )}
    </div>
  );
};

export default FaceRecognition;