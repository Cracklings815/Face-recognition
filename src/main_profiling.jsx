import React, { useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

const ProfileDisplay = () => {
  const location = useLocation();
  const navigate = useNavigate();

  // Get recognition data from location state
  const { userData, confidence, threshold } = location.state || {};

  useEffect(() => {
    const timer = setTimeout(() => {
      navigate('/');
    }, 4000);

    return () => {
      clearTimeout(timer);
    };
  }, [userData, navigate]);

  const labelClass = "block text-sm font-medium text-gray-700";
  const valueClass = "mt-1 block w-full py-2 px-3 bg-gray-50 rounded-md text-gray-900 sm:text-sm";

  const DisplayField = ({ label, value }) => (
    <div className="space-y-1">
      <span className={labelClass}>{label}</span>
      <div className={valueClass}>{value || '-'}</div>
    </div>
  );

  if (!userData) {
    return null;
  }

  return (
    <div className="max-w-7xl mx-auto p-4 space-y-6">
      {/* Basic Info Card */}
      <div className="bg-white shadow rounded-lg mb-6">
        <div className="p-6 flex items-start space-x-6">
          <div className="flex-shrink-0">
            <div className="w-32 h-32 rounded-full bg-gray-200 flex items-center justify-center">
              {userData?.regis_profile_image_path ? (
                <img 
                  src={`http://localhost:3000/${userData.regis_profile_image_path}`}
                  alt="Profile" 
                  className="w-32 h-32 rounded-full object-cover"
                />
              ) : (
                <span className="text-gray-500">No Photo</span>
              )}
            </div>
          </div>
          
          <div className="flex-1 grid grid-cols-2 gap-4">
            <div>
              <h2 className="text-2xl font-bold">
                {[
                  userData?.regis_first_name,
                  userData?.regis_middle_name,
                  userData?.regis_last_name
                ].filter(Boolean).join(' ')}
              </h2>
              <p className="text-gray-600">Occupation: {userData?.regis_occupation}</p>
              <p className="text-gray-600">Sex: {userData?.regis_sex}</p>
              <p className="text-gray-600">Gender: {userData?.regis_gender}</p>
              <p className="text-gray-600">Phone Number: {userData?.regis_phone_number}</p>
              <p className="text-gray-600">Email: {userData?.regis_email}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Personal Details */}
      <div className="bg-white shadow rounded-lg p-6">
        <h3 className="text-lg font-semibold mb-4">Personal Details</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <DisplayField 
            label="Date of Birth" 
            value={userData?.regis_date_of_birth ? new Date(userData.regis_date_of_birth).toLocaleDateString() : '-'} 
          />
          <DisplayField label="Place of Birth" value={userData?.regis_place_of_birth} />
          <DisplayField label="Nationality" value={userData?.regis_nationality} />
          <DisplayField label="Marital Status" value={userData?.regis_marital_status} />
          <DisplayField label="Religion" value={userData?.regis_religion} />
          <DisplayField label="Blood Type" value={userData?.regis_blood_type} />
          <DisplayField label="Address" value={userData?.regis_address} />
        </div>
      </div>

      {/* Family Information */}
      <div className="bg-white shadow rounded-lg p-6">
        <h3 className="text-lg font-semibold mb-4">Family Information</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Parents Information */}
          <div className="col-span-full mt-2">
            <h4 className="text-md font-semibold mb-3">Parents Information</h4>
          </div>
          <DisplayField label="Mother's Name" value={userData?.regis_mother_name} />
          <DisplayField label="Mother's Occupation" value={userData?.regis_mother_occupation} />
          <DisplayField label="Father's Name" value={userData?.regis_father_name} />
          <DisplayField label="Father's Occupation" value={userData?.regis_father_occupation} />

          {/* Siblings Information */}
          <div className="col-span-full mt-4">
            <h4 className="text-md font-semibold mb-3">Siblings Information</h4>
          </div>
          <DisplayField label="Number of Siblings" value={userData?.regis_number_of_siblings} />
          <DisplayField label="Birth Order" value={userData?.regis_birth_order} />
        </div>
      </div>

      {/* Emergency Contact */}
      <div className="bg-white shadow rounded-lg p-6">
        <h3 className="text-lg font-semibold mb-4">Emergency Contact</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <DisplayField label="Emergency Contact Name" value={userData?.emer_name} />
          <DisplayField label="Relationship" value={userData?.emer_relationship} />
          <DisplayField label="Emergency Contact Phone" value={userData?.emer_phone_number} />
        </div>
      </div>
    </div>
  );
};

export default ProfileDisplay;