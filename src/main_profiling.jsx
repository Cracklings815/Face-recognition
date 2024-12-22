import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const ProfileDisplay = ({ userData = {} }) => {
  const navigate = useNavigate();

  useEffect(() => {
    const timer = setTimeout(() => {
      navigate('/'); // Redirects to home or another route
    }, 3000); // 3 seconds timer

    return () => clearTimeout(timer); // Cleanup on unmount
  }, [navigate]);

  const labelClass = "block text-sm font-medium text-gray-700";
  const valueClass = "mt-1 block w-full py-2 px-3 bg-gray-50 rounded-md text-gray-900 sm:text-sm";

  const DisplayField = ({ label, value }) => (
    <div className="space-y-1">
      <span className={labelClass}>{label}</span>
      <div className={valueClass}>{value || '-'}</div>
    </div>
  );

  return (
    <div className="max-w-7xl mx-auto">
      <div className="bg-white shadow rounded-lg mb-6">
        <div className="p-6 flex items-start space-x-6">
          <div className="flex-shrink-0">
            <div className="w-32 h-32 rounded-full bg-gray-200 flex items-center justify-center">
              {userData?.profilePicture ? (
                <img 
                  src={userData.profilePicture} 
                  alt="Profile" 
                  className="w-32 h-32 rounded-full object-cover"
                />
              ) : (
                <span className="text-gray-500">Photo</span>
              )}
            </div>
          </div>
          
          <div className="flex-1 grid grid-cols-2 gap-4">
            <div>
              <h2 className="text-2xl font-bold">
                {[
                  userData?.firstName,
                  userData?.middleName,
                  userData?.lastName
                ].filter(Boolean).join(' ') || 'Name'}
              </h2>
              <p className="text-gray-600">{userData?.occupation || 'Occupation'}</p>
              <p className="text-gray-600">Sex: {userData?.sex || '-'}</p>
              <p className="text-gray-600">Gender: {userData?.gender || '-'}</p>
            </div>
            <div className="text-right">
              <p className="text-gray-600">{userData?.phoneNumber || '-'}</p>
              <p className="text-gray-600">{userData?.email || '-'}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white shadow rounded-lg p-6">
        <h3 className="text-lg font-semibold mb-4">Personal Details</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <DisplayField 
            label="Date of Birth" 
            value={userData?.dateOfBirth ? new Date(userData.dateOfBirth).toLocaleDateString() : '-'} 
          />
          <DisplayField label="Place of Birth" value={userData?.placeOfBirth} />
          <DisplayField label="Nationality" value={userData?.nationality} />
          <DisplayField label="Marital Status" value={userData?.maritalStatus} />
          <DisplayField label="Religion" value={userData?.religion} />
          <DisplayField label="Blood Type" value={userData?.bloodType} />
          <DisplayField label="Address" value={userData?.address} />
          
          <div className="col-span-full mt-4">
            <h4 className="text-md font-semibold mb-3">Emergency Contact Information</h4>
          </div>
          <DisplayField label="Emergency Contact Name" value={userData?.emergencyName} />
          <DisplayField label="Relationship" value={userData?.emergencyRelationship} />
          <DisplayField label="Emergency Contact Phone" value={userData?.emergencyPhone} />
        </div>
      </div>
    </div>
  );
};

export default ProfileDisplay;
