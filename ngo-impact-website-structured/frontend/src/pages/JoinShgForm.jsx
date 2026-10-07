import React, { useState } from 'react';
import { createClient } from '@supabase/supabase-js';

// Initialize Supabase client
const supabase = createClient(
  import.meta.env.VITE_SUPABASE_URL,
  import.meta.env.VITE_SUPABASE_ANON_KEY
);

export default function JoinShgForm() {
  const [formData, setFormData] = useState({ name: '', address: '', mobileNumber: '' });
  const [files, setFiles] = useState({ aadhaar: null, pan: null, photo: null });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  const handleTextChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    
    if (selectedFile) {
      // 3 MB in bytes
      const maxSize = 3 * 1024 * 1024; 
      
      if (selectedFile.size > maxSize) {
        // Show error and reset this specific file input
        setMessage(`The selected file for ${e.target.name} exceeds the 3 MB limit. Please choose a smaller image.`);
        e.target.value = ''; // Clears the file input field
        
        // Remove from state if they previously had a valid file but just tried an invalid one
        setFiles(prev => ({ ...prev, [e.target.name]: null }));
        return;
      }

      // Clear any previous size error messages if the new file is valid
      setMessage('');
      setFiles({ ...files, [e.target.name]: selectedFile });
    }
  };

  const uploadFileToSupabase = async (file, folder) => {
    if (!file) return null;
    const fileExt = file.name.split('.').pop();
    const fileName = `${folder}/${Date.now()}_${Math.random().toString(36).substring(7)}.${fileExt}`;
    
    const { data, error } = await supabase.storage
      .from('shg-documents')
      .upload(fileName, file);

    if (error) throw error;
    
    // Get public URL
    const { data: { publicUrl } } = supabase.storage
      .from('shg-documents')
      .getPublicUrl(fileName);
      
    return publicUrl;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');

    // Extra safety check before submission
    if (!files.aadhaar || !files.pan || !files.photo) {
      setMessage("Error: Please ensure all three images are selected and under 3 MB.");
      setLoading(false);
      return;
    }

    try {
      // 1. Upload images to Supabase
      const aadhaarPhotoUrl = await uploadFileToSupabase(files.aadhaar, 'aadhaar');
      const panPhotoUrl = await uploadFileToSupabase(files.pan, 'pan');
      const selfPhotoUrl = await uploadFileToSupabase(files.photo, 'photos');

      // 2. Send Data to Spring Boot Backend
      const payload = {
        ...formData,
        aadhaarPhotoUrl,
        panPhotoUrl,
        selfPhotoUrl
      };

      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/shg/join`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      if (!response.ok) throw new Error('Failed to submit application');
      
      setMessage('Successfully submitted SHG application!');
      setFormData({ name: '', address: '', mobileNumber: '' });
      setFiles({ aadhaar: null, pan: null, photo: null });
      e.target.reset();

    } catch (error) {
      console.error(error);
      setMessage('Error submitting form. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-6 md:p-8 bg-white rounded-2xl shadow-sm border border-gray-100 my-10">
      <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">Join Self Help Group (SHG)</h2>
      
      {message && (
        <div className={`p-4 mb-6 rounded-lg text-sm font-bold ${message.includes('Error') || message.includes('exceeds') ? 'bg-red-50 text-red-700' : 'bg-green-50 text-green-700'}`}>
          {message}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-5">
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-1">Full Name</label>
          <input type="text" name="name" required value={formData.name} onChange={handleTextChange} className="w-full rounded-xl border p-3 text-sm focus:ring-2 focus:ring-green-600" />
        </div>

        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-1">Mobile Number</label>
          <input type="tel" name="mobileNumber" required pattern="[0-9]{10}" value={formData.mobileNumber} onChange={handleTextChange} className="w-full rounded-xl border p-3 text-sm focus:ring-2 focus:ring-green-600" />
        </div>

        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-1">Address</label>
          <textarea name="address" required rows="3" value={formData.address} onChange={handleTextChange} className="w-full rounded-xl border p-3 text-sm focus:ring-2 focus:ring-green-600"></textarea>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 border-t border-gray-100 pt-5">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">
              Aadhaar Card <span className="text-xs text-red-500 font-normal">(Max 3MB)</span>
            </label>
            <input type="file" name="aadhaar" accept="image/*" required onChange={handleFileChange} className="w-full text-xs text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-xs file:font-semibold file:bg-green-50 file:text-green-700 hover:file:bg-green-100" />
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">
              PAN Card <span className="text-xs text-red-500 font-normal">(Max 3MB)</span>
            </label>
            <input type="file" name="pan" accept="image/*" required onChange={handleFileChange} className="w-full text-xs text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-xs file:font-semibold file:bg-green-50 file:text-green-700 hover:file:bg-green-100" />
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">
              Self Photo <span className="text-xs text-red-500 font-normal">(Max 3MB)</span>
            </label>
            <input type="file" name="photo" accept="image/*" required onChange={handleFileChange} className="w-full text-xs text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-xs file:font-semibold file:bg-green-50 file:text-green-700 hover:file:bg-green-100" />
          </div>
        </div>

        <button type="submit" disabled={loading} className="w-full mt-6 bg-[#0d4a30] text-white font-bold py-3 px-4 rounded-xl hover:bg-green-800 disabled:opacity-70 transition-colors">
          {loading ? 'Uploading & Submitting...' : 'Submit Application'}
        </button>
      </form>
    </div>
  );
}