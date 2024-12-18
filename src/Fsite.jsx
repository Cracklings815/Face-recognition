import React, { useState } from 'react';

const FingerprintScanner = () => {
  const [status, setStatus] = useState("Place your finger on the scanner.");

  const handleScan = () => {
    // Mock scanning process
    setStatus("Scanning...");
    setTimeout(() => {
      setStatus("Attendance marked successfully!");
    }, 2000);
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <div className="bg-white shadow-md rounded-lg p-6 w-80">
        <h1 className="text-xl font-bold mb-4 text-center">Attendance System</h1>
        <div className="flex flex-col items-center mb-4">
          <div className="w-32 h-32 border border-gray-300 rounded-full flex items-center justify-center">
            <button
              onClick={handleScan}
              className="w-full h-full bg-gray-100 text-gray-400 flex items-center justify-center hover:bg-gray-200 rounded-full"
            >
            <img
                src="/Finger icon.png" 
                alt="Fingerprint Icon"
                className="w-70 h-70"
              />
            </button>
          </div>
        </div>
        <p className="text-center text-gray-600">{status}</p>
      </div>
    </div>
  );
};

export default FingerprintScanner;
