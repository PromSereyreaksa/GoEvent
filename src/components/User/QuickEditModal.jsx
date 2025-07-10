"use client";

import React, { useEffect, useState } from "react";
import { Camera, X, Save, Loader2, ExternalLink } from 'lucide-react';

export default function QuickEditModal({ isOpen, onClose, userData, onSave, loading }) {
  const [formData, setFormData] = useState({
    first_name: userData?.first_name || "",
    last_name: userData?.last_name || "",
    phone_number: userData?.phone_number || "",
  });
  
  const [errors, setErrors] = useState({});
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(userData?.profile_picture || "");

  useEffect(() => {
    if (userData) {
      setFormData({
        first_name: userData.first_name || "",
        last_name: userData.last_name || "",
        phone_number: userData.phone_number || "",
      });
      setImagePreview(userData.profile_picture || "");
    }
  }, [userData]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ""
      }));
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        setErrors(prev => ({
          ...prev,
          profile_picture: "Image size must be less than 5MB"
        }));
        return;
      }
      
      if (!file.type.startsWith('image/')) {
        setErrors(prev => ({
          ...prev,
          profile_picture: "Please select a valid image file"
        }));
        return;
      }
      
      setImageFile(file);
      
      const reader = new FileReader();
      reader.onload = (e) => {
        setImagePreview(e.target.result);
      };
      reader.readAsDataURL(file);
      
      setErrors(prev => ({
        ...prev,
        profile_picture: ""
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.first_name.trim()) {
      newErrors.first_name = "First name is required";
    }
    
    if (!formData.last_name.trim()) {
      newErrors.last_name = "Last name is required";
    }
    
    if (formData.phone_number && !/^\+?[\d\s\-()]{10,}$/.test(formData.phone_number)) {
      newErrors.phone_number = "Please enter a valid phone number";
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    const updateData = {
      first_name: formData.first_name,
      last_name: formData.last_name,
      phone_number: formData.phone_number,
      email: userData.email,
      is_vendor: userData?.is_vendor || false,
      is_partner: userData?.is_partner || false,
    };
    
    if (imageFile) {
      updateData.profile_picture = imageFile;
    }
    
    await onSave(updateData, false);
  };

  const handleClose = () => {
    setFormData({
      first_name: userData?.first_name || "",
      last_name: userData?.last_name || "",
      phone_number: userData?.phone_number || "",
    });
    setErrors({});
    setImageFile(null);
    setImagePreview(userData?.profile_picture || "");
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-3xl max-w-md w-full shadow-2xl transform transition-all">
        <div className="p-6 border-b border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold text-gray-900">Quick Edit</h2>
              <p className="text-sm text-gray-500 mt-1">Update your basic information</p>
            </div>
            <button
              onClick={handleClose}
              className="p-2 hover:bg-gray-100 rounded-full transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="p-6">
          {/* Profile Picture */}
          <div className="mb-8 text-center">
            <div className="relative inline-block">
              <div className="w-24 h-24 rounded-full overflow-hidden border-4 border-gradient-to-r from-blue-600 to-blue-400 p-1">
                <img
                  src={imagePreview || userData?.profile_picture || "/placeholder.svg?height=96&width=96"}
                  alt="Profile preview"
                  className="w-full h-full rounded-full object-cover bg-gray-100"
                />
              </div>
              <label className="absolute bottom-0 right-0 bg-gradient-to-r from-blue-600 to-blue-400 text-white p-2.5 rounded-full hover:from-blue-600 hover:to-purple-700 transition-all cursor-pointer shadow-lg">
                <Camera className="w-4 h-4" />
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="hidden"
                />
              </label>
            </div>
            {errors.profile_picture && (
              <p className="text-red-500 text-sm mt-2">{errors.profile_picture}</p>
            )}
          </div>

          {/* Name Fields */}
          <div className="grid grid-cols-2 gap-4 mb-6">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                First Name *
              </label>
              <input
                type="text"
                name="first_name"
                value={formData.first_name}
                onChange={handleInputChange}
                className={`w-full px-4 py-3 border-2 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all ${
                  errors.first_name ? 'border-red-300 bg-red-50' : 'border-gray-200 hover:border-gray-300'
                }`}
                placeholder="First name"
              />
              {errors.first_name && (
                <p className="text-red-500 text-sm mt-1">{errors.first_name}</p>
              )}
            </div>
            
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Last Name *
              </label>
              <input
                type="text"
                name="last_name"
                value={formData.last_name}
                onChange={handleInputChange}
                className={`w-full px-4 py-3 border-2 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all ${
                  errors.last_name ? 'border-red-300 bg-red-50' : 'border-gray-200 hover:border-gray-300'
                }`}
                placeholder="Last name"
              />
              {errors.last_name && (
                <p className="text-red-500 text-sm mt-1">{errors.last_name}</p>
              )}
            </div>
          </div>

          {/* Phone Number */}
          <div className="mb-6">
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Phone Number
            </label>
            <input
              type="tel"
              name="phone_number"
              value={formData.phone_number}
              onChange={handleInputChange}
              className={`w-full px-4 py-3 border-2 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all ${
                errors.phone_number ? 'border-red-300 bg-red-50' : 'border-gray-200 hover:border-gray-300'
              }`}
              placeholder="Phone number"
            />
            {errors.phone_number && (
              <p className="text-red-500 text-sm mt-1">{errors.phone_number}</p>
            )}
          </div>

          {/* Advanced Edit Link */}
          <div className="mb-6 p-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl border border-blue-100">
            <p className="text-sm text-blue-800 mb-2 font-medium">Need to change email or password?</p>
            <button
              type="button"
              onClick={() => {
                handleClose();
                window.location.href = '/settings?tab=profile';
              }}
              className="text-blue-600 hover:text-blue-700 text-sm font-semibold flex items-center gap-1 transition-colors"
            >
              Go to Advanced Settings
              <ExternalLink className="w-3 h-3" />
            </button>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3">
            <button
              type="button"
              onClick={handleClose}
              className="flex-1 px-6 py-3 border-2 border-gray-200 text-gray-700 rounded-xl hover:bg-gray-50 hover:border-gray-300 transition-all font-medium"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-1 px-6 py-3 bg-gradient-to-r from-blue-600 to-blue-400 text-white rounded-xl hover:from-blue-700 hover:to-blue-500 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 font-medium shadow-lg"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Saving...
                </>
              ) : (
                <>
                  <Save className="w-4 h-4" />
                  Save Changes
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
