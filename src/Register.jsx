import React, { useState } from 'react';
import { Camera, Upload, Fingerprint, Save, ArrowLeft } from 'lucide-react'; //npm install lucide-react

const Registration = () => {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    dateOfBirth: '',
    nationality: '',
    sex: '',
    gender: '',
    religion: '',
    address: '',
    phoneNumber: '',
    email: ''
  });

  const [profileImage, setProfileImage] = useState(null);
  const [rightThumbprint, setRightThumbprint] = useState(null);
  const [leftThumbprint, setLeftThumbprint] = useState(null);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleProfileImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setProfileImage(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRightThumbprint = () => {
    setRightThumbprint('/api/placeholder/150/150');
  };

  const handleLeftThumbprint = () => {
    setLeftThumbprint('/api/placeholder/150/150');
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Form submitted:', { 
      formData, 
      profileImage, 
      rightThumbprint,
      leftThumbprint 
    });
  };

  const handleBack = () => {
    window.history.back();
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-6xl mx-auto p-4">
      <div className="bg-white rounded-lg shadow-lg relative">
        <button
          type="button"
          onClick={handleBack}
          className="absolute top-6 left-6 flex items-center gap-2 text-gray-600 hover:text-gray-900"
        >
          <ArrowLeft className="w-5 h-5" />
          <span>Back</span>
        </button>

        <div className="p-6 border-b border-gray-200 flex justify-center">
          <h2 className="text-2xl font-bold">Biometric Registration Form</h2>
        </div>
        
        <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Left Column - Biometric Section */}
          <div className="space-y-8">
            <h3 className="text-lg font-semibold">Biometric Data</h3>
            
            {/* Profile Picture Section */}
            <div className="flex flex-col items-center">
              <h4 className="text-sm font-medium text-gray-700 mb-3">Profile Picture</h4>
              <div className="w-40 h-40 rounded-full bg-gray-100 mb-4 overflow-hidden flex items-center justify-center">
                {profileImage ? (
                  <img src={profileImage} alt="Profile" className="w-full h-full object-cover" />
                ) : (
                  <Camera className="w-16 h-16 text-gray-400" />
                )}
              </div>
              <div>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleProfileImageUpload}
                  className="hidden"
                  id="profile-upload"
                />
                <label
                  htmlFor="profile-upload"
                  className="flex items-center gap-2 cursor-pointer bg-blue-500 text-white px-3 py-2 rounded-md hover:bg-blue-600 text-sm"
                >
                  <Upload className="w-4 h-4" />
                  Upload Photo
                </label>
              </div>
            </div>

            {/* Right Thumbprint Section */}
            <div className="flex flex-col items-center">
              <h4 className="text-sm font-medium text-gray-700 mb-3">Right Thumbprint</h4>
              <div className="w-40 h-40 border-2 border-dashed border-gray-300 rounded-lg flex flex-col items-center justify-center mb-4">
                {rightThumbprint ? (
                  <img src={rightThumbprint} alt="Right Thumbprint" className="w-32 h-32" />
                ) : (
                  <Fingerprint className="w-16 h-16 text-gray-400" />
                )}
              </div>
              <button
                type="button"
                onClick={handleRightThumbprint}
                className="flex items-center gap-2 text-sm bg-blue-500 text-white px-3 py-2 rounded-md hover:bg-blue-600"
              >
                <Fingerprint className="w-4 h-4" />
                Capture Right Print
              </button>
            </div>

            {/* Left Thumbprint Section */}
            <div className="flex flex-col items-center">
              <h4 className="text-sm font-medium text-gray-700 mb-3">Left Thumbprint</h4>
              <div className="w-40 h-40 border-2 border-dashed border-gray-300 rounded-lg flex flex-col items-center justify-center mb-4">
                {leftThumbprint ? (
                  <img src={leftThumbprint} alt="Left Thumbprint" className="w-32 h-32" />
                ) : (
                  <Fingerprint className="w-16 h-16 text-gray-400" />
                )}
              </div>
              <button
                type="button"
                onClick={handleLeftThumbprint}
                className="flex items-center gap-2 text-sm bg-blue-500 text-white px-3 py-2 rounded-md hover:bg-blue-600"
              >
                <Fingerprint className="w-4 h-4" />
                Capture Left Print
              </button>
            </div>
          </div>

          {/* Right Column - Personal Details - Remains the same */}
          <div className="space-y-6">
            <h3 className="text-lg font-semibold">Personal Details</h3>
            <div className="grid grid-cols-2 gap-4">
              {/* Personal details inputs remain the same */}
              <div className="space-y-2">
                <label htmlFor="firstName" className="block text-sm font-medium text-gray-700">
                  First Name
                </label>
                <input
                  type="text"
                  id="firstName"
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>
              <div className="space-y-2">
                <label htmlFor="lastName" className="block text-sm font-medium text-gray-700">
                  Last Name
                </label>
                <input
                  type="text"
                  id="lastName"
                  name="lastName"
                  value={formData.lastName}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>
              <div className="space-y-2">
                <label htmlFor="dateOfBirth" className="block text-sm font-medium text-gray-700">
                  Date of Birth
                </label>
                <input
                  type="date"
                  id="dateOfBirth"
                  name="dateOfBirth"
                  value={formData.dateOfBirth}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>
              <div className="space-y-2">
                <label htmlFor="nationality" className="block text-sm font-medium text-gray-700">
                  Nationality
                </label>
                <input
                  type="text"
                  id="nationality"
                  name="nationality"
                  value={formData.nationality}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>
              <div className="space-y-2">
                <label htmlFor="sex" className="block text-sm font-medium text-gray-700">
                  Sex
                </label>
                <select
                  id="sex"
                  name="sex"
                  value={formData.sex}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                >
                  <option value="">Select Sex</option>
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                </select>
              </div>

              <div className="space-y-2">
                <label htmlFor="gender" className="block text-sm font-medium text-gray-700">
                  Gender
                </label>
                <select
                  type="text"
                  id="gender"
                  name="gender"
                  value={formData.gender}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                 >
                  <option value = "">Select Gender</option>
                  <option value = "Straight">Straight</option>
                  <option value = "Transgender">Transgender</option>
                  <option value = "Non-binary">Non-binary</option>
                  <option value = "Prefer not to say">Prefer not to say</option>
                  
                </select>
              </div>
              <div className="space-y-2">
                <label htmlFor="religion" className="block text-sm font-medium text-gray-700">
                  Religion
                </label>
                <input
                  type="text"
                  id="religion"
                  name="religion"
                  value={formData.religion}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>
              <div className="space-y-2">
                <label htmlFor="phoneNumber" className="block text-sm font-medium text-gray-700">
                  Phone Number
                </label>
                <input
                  type="tel"
                  id="phoneNumber"
                  name="phoneNumber"
                  value={formData.phoneNumber}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>
              <div className="space-y-2">
                <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                  Email
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>
              <div className="space-y-2">
                <label htmlFor="address" className="block text-sm font-medium text-gray-700">
                  Address
                </label>
                <input
                  type="text"
                  id="address"
                  name="address"
                  value={formData.address}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>
            </div>
          </div>
        </div>

        <div className="p-6 border-t border-gray-200 flex justify-end">
          <button
            type="submit"
            className="flex items-center gap-2 bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600"
          >
            <Save className="w-4 h-4" />
            Save Registration
          </button>
        </div>
      </div>
    </form>
  );
};

export default Registration;