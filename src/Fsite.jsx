import React, { useState } from 'react';
import { Link, useNavigate } from "react-router-dom";

const FingerprintScanner = () => {
  const [status, setStatus] = useState("Place your finger on the scanner.");
  const [isPopupVisible, setPopupVisible] = useState(false);
  const [popupMessage, setPopupMessage] = useState("");
  const [popupColor, setPopupColor] = useState("bg-gray-200");
  const [failedAttempts, setFailedAttempts] = useState(0); // Track failed attempts
  const navigate = useNavigate(); // React Router's navigation hook

  const handleScan = () => {
    setPopupMessage("Scanning...");
    setPopupColor("bg-blue-500");
    setPopupVisible(true);

    setStatus("Scanning...");
    setTimeout(() => {
      const isSuccess = Math.random() > 0.5; // Demo: Random success/failure
      if (isSuccess) {
        setPopupMessage("Login Successfully!");
        setPopupColor("bg-green-500"); // Success color
        setStatus("Login Successfully!");
        setFailedAttempts(0); // Reset failed attempts on success

        // Redirect to /success after a short delay
        setTimeout(() => {
          navigate("/success");
        }, 2000);
      } else {
        setPopupMessage("Login Failed! Try again.");
        setPopupColor("bg-red-500"); // Failure color
        setStatus("Login Failed!");
        setFailedAttempts((prev) => prev + 1); // Increment failed attempts
      }

      // Hide popup after 2 seconds
      setTimeout(() => {
        setPopupVisible(false);
      }, 2000);
    }, 2000);
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <div className="bg-white shadow-md rounded-lg p-6 w-80">
        <h1 className="text-3xl font-bold mb-10 text-center">Profiling</h1>
        <div className="flex flex-col items-center mb-4">
          <div className="w-32 h-32 border border-gray-300 rounded-full flex items-center justify-center">
            <button
              onClick={handleScan}
              className="w-full h-full bg-gray-100 text-gray-400 flex items-center justify-center hover:bg-gray-200 rounded-full"
            >
              <img
                src="/Finger icon.png" // Path to the icon in the public folder
                alt="Fingerprint Icon"
                className="w-90 h-90"
              />
            </button>
          </div>
        </div>
        <p className="text-center text-gray-600">{status}</p>
      </div>

      {/* Popup Message */}
      {isPopupVisible && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div
            className={`${popupColor} rounded-lg shadow-lg p-8 w-96 text-center text-white transition-all duration-300`}
          >
            <h2 className="text-2xl font-bold mb-2">{popupMessage}</h2>
            {popupMessage === "Scanning..." && (
              <p className="text-lg">Please wait while we process your fingerprint.</p>
            )}
          </div>
        </div>
      )}

      {/* Register Link */}
      {failedAttempts >= 3 && (
        <p className="mt-6 text-center text-sm">
          Don't have an account?{" "}
          <Link
            to="/register"
            className="text-blue-500 underline hover:text-blue-600"
          >
            Register Here
          </Link>
        </p>
      )}
    </div>
  );
};

export default FingerprintScanner;
