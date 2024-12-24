import React, { useState, useRef, useEffect } from 'react';
import { Camera } from "lucide-react";
import * as faceapi from '@vladmandic/face-api';

const FaceRecognition = ({ onSuccess }) => {
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const [status, setStatus] = useState("Initializing face detection...");
  const [isPopupVisible, setPopupVisible] = useState(false);
  const [popupMessage, setPopupMessage] = useState("");
  const [popupColor, setPopupColor] = useState("bg-gray-200");
  const [cameraError, setCameraError] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [debugInfo, setDebugInfo] = useState("");

  useEffect(() => {
    let detectionInterval;

    const loadModels = async () => {
      try {
        setStatus("Loading face recognition models...");
        setDebugInfo("Starting model loading...");
        
        const modelPath = `${window.location.origin}/models`;
        console.log('Model path:', modelPath);
        
        // Updated model files for @vladmandic/face-api
        const modelFiles = [
          'tiny_face_detector_model-weights_manifest.json',
          'face_landmark_68_model-weights_manifest.json',
          'face_recognition_model-weights_manifest.json'
        ];
    
        // Check if model files are accessible
        for (const file of modelFiles) {
          const response = await fetch(`${modelPath}/${file}`, { method: 'HEAD' });
          if (!response.ok) {
            throw new Error(`Model file ${file} not found or inaccessible`);
          }
          setDebugInfo(prev => `${prev}\nVerified ${file} is accessible`);
        }
    
        // Load models with new API
        try {
          await faceapi.nets.tinyFaceDetector.loadFromUri(modelPath);
          setDebugInfo(prev => `${prev}\nTiny Face Detector model loaded`);
    
          await faceapi.nets.faceLandmark68Net.loadFromUri(modelPath);
          setDebugInfo(prev => `${prev}\nFace landmark model loaded`);
    
          await faceapi.nets.faceRecognitionNet.loadFromUri(modelPath);
          setDebugInfo(prev => `${prev}\nFace recognition model loaded`);
          
        } catch (modelError) {
          console.error('Model loading error:', modelError);
          setDebugInfo(prev => `${prev}\nModel loading error: ${modelError.message}`);
          throw modelError;
        }
    
        setStatus("Models loaded successfully");
        setDebugInfo(prev => `${prev}\nAll models loaded successfully`);
        await startVideo();
        
      } catch (err) {
        console.error("Error loading models:", err);
        setStatus(`Error loading models: ${err.message}`);
        setDebugInfo(prev => `${prev}\nFatal error: ${err.message}`);
      }
    };

    const startVideo = async () => {
      try {
        setDebugInfo(prev => `${prev}\nRequesting camera access...`);
        const stream = await navigator.mediaDevices.getUserMedia({
          video: {
            facingMode: "user",
            width: { ideal: 1280 },
            height: { ideal: 720 }
          }
        });
        
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          videoRef.current.addEventListener('play', startFaceDetection);
          setDebugInfo(prev => `${prev}\nCamera stream started`);
        }
        setCameraError(false);
        setStatus("Face detection active");
      } catch (err) {
        console.error("Error accessing camera:", err);
        setCameraError(true);
        setStatus("Camera access denied. Please enable camera permissions.");
        setDebugInfo(prev => `${prev}\nCamera error: ${err.message}`);
      }
    };

    const startFaceDetection = async () => {
      if (!videoRef.current) return;

      const canvas = canvasRef.current;
      const displaySize = { 
        width: videoRef.current.videoWidth, 
        height: videoRef.current.videoHeight 
      };
      faceapi.matchDimensions(canvas, displaySize);

      detectionInterval = setInterval(async () => {
        if (isProcessing || !videoRef.current || !canvasRef.current) return;

        try {
          setIsProcessing(true);
          
          // Use TinyFaceDetector instead of MTCNN
          const detections = await faceapi
            .detectAllFaces(videoRef.current, new faceapi.TinyFaceDetectorOptions())
            .withFaceLandmarks()
            .withFaceDescriptors();

          if (detections.length > 0) {
            const resizedDetections = faceapi.resizeResults(detections, displaySize);
            canvas.getContext('2d').clearRect(0, 0, canvas.width, canvas.height);
            
            // Updated drawing utilities
            faceapi.draw.drawDetections(canvas, resizedDetections);
            faceapi.draw.drawFaceLandmarks(canvas, resizedDetections);

            const faceDescriptor = detections[0].descriptor;

            const response = await fetch('http://localhost:3000/api/recognize', {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({ 
                faceDescriptor: Array.from(faceDescriptor) 
              }),
            });

            const result = await response.json();
            if (result.recognized) {
              setPopupMessage("Face recognized!");
              setPopupColor("bg-green-500");
              setPopupVisible(true);
              clearInterval(detectionInterval);
              if (onSuccess) {
                setTimeout(() => onSuccess(result.userData), 1000);
              }
            }
          }
        } catch (error) {
          console.error("Error in face detection:", error);
          setDebugInfo(prev => `${prev}\nDetection error: ${error.message}`);
        } finally {
          setIsProcessing(false);
        }
      }, 1000);
    };

    loadModels();

    return () => {
      if (detectionInterval) {
        clearInterval(detectionInterval);
      }
      if (videoRef.current && videoRef.current.srcObject) {
        const tracks = videoRef.current.srcObject.getTracks();
        tracks.forEach(track => track.stop());
      }
    };
  }, [onSuccess, isProcessing]);

  // Rest of the component remains the same
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
            <canvas
              ref={canvasRef}
              className="absolute top-0 left-0 w-full h-full"
            />
            {cameraError && (
              <div className="absolute inset-0 flex items-center justify-center bg-gray-100">
                <Camera size={64} className="text-gray-400" />
                <p className="text-sm text-gray-500 mt-4">Camera access required</p>
              </div>
            )}
          </div>
        </div>
        <p className="text-center text-gray-600 mt-4">{status}</p>
        <pre className="mt-4 p-2 bg-gray-100 rounded text-xs overflow-auto max-h-40">
          {debugInfo}
        </pre>
      </div>

      {isPopupVisible && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className={`${popupColor} rounded-lg shadow-lg p-8 w-96 text-center text-white transition-all duration-300`}>
            <h2 className="text-2xl font-bold mb-2">{popupMessage}</h2>
          </div>
        </div>
      )}
    </div>
  );
};

export default FaceRecognition;