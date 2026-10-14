import React, { useState } from "react";
import { ArrowLeft, Send, Loader2 } from "lucide-react";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  import.meta.env.VITE_SUPABASE_URL,
  import.meta.env.VITE_SUPABASE_ANON_KEY
);

export default function WorkReportForm({ profile, onBack, onSuccess }) {
  const [formData, setFormData] = useState({
    activityDate: new Date().toISOString().split("T")[0],
    activityType: "",
    programName: "",
    activityLocation: "",
    totalBeneficiaries: "",
    outcome: "",
    projectName: "",
    
    // NEW FUNDRAISING FIELDS
    contributorName: "",
    beneficiaryName: "",
    parentName: "",
    address: "",
    mobileNumber: "",
    aadhaarNumber: "",
    age: "",
    category: "",
    amount: "",
    dob: "",
    recordDate: new Date().toISOString().split("T")[0]
  });

  const [files, setFiles] = useState({ evidence: null, beneficiaryPhoto: null });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [fileError, setFileError] = useState("");

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    const fieldName = e.target.name;
    
    if (file) {
      const maxSizeInBytes = 5 * 1024 * 1024; // 5MB limit
      
      if (file.size > maxSizeInBytes) {
        setFileError(`File size for ${fieldName} exceeds the 5MB limit.`);
        e.target.value = null; 
        setFiles(prev => ({ ...prev, [fieldName]: null }));
      } else {
        setFileError("");
        setFiles(prev => ({ ...prev, [fieldName]: file }));
      }
    }
  };

  const uploadFileToSupabase = async (file, folder) => {
    if (!file) return null;
    const fileExt = file.name.split('.').pop();
    const fileName = `${folder}/${Date.now()}_${Math.random().toString(36).substring(7)}.${fileExt}`;
    
    const { data, error } = await supabase.storage
      .from("evidence-files") // Using your existing bucket
      .upload(fileName, file);

    if (error) throw error;
    
    const { data: { publicUrl } } = supabase.storage
      .from("evidence-files")
      .getPublicUrl(fileName);
      
    return publicUrl;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    const volunteerId = sessionStorage.getItem("volunteerId");

    try {
      // Upload files if they exist
      const evidenceUrl = await uploadFileToSupabase(files.evidence, 'reports');
      const beneficiaryPhotoUrl = await uploadFileToSupabase(files.beneficiaryPhoto, 'beneficiaries');

      const finalReportData = {
        ...formData,
        evidenceUrl,
        beneficiaryPhotoUrl
      };

      const response = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:8080'}/api/reports/${volunteerId}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(finalReportData),
      });

      if (response.ok) {
        onSuccess(); 
      } else {
        alert("Failed to submit report details. Please try again.");
      }
    } catch (error) {
      console.error("Submission error:", error);
      alert("An unexpected error occurred during submission.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="mx-auto max-w-4xl rounded-xl bg-white shadow-sm border border-gray-200">
      <div className="flex items-center gap-4 border-b border-gray-200 bg-[#0d4a30] p-4 text-white rounded-t-xl">
        <button onClick={onBack} className="rounded-full p-2 hover:bg-white/20">
          <ArrowLeft className="h-5 w-5" />
        </button>
        <div>
          <h2 className="text-lg font-bold">Update Today's Work</h2>
          <p className="text-xs text-green-100">Share the details of your work. Your report helps us track impact.</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="p-6 space-y-8">
        
        {/* 1. Activity Details */}
        <section>
          <div className="mb-4 flex items-center gap-2">
            <span className="flex h-6 w-6 items-center justify-center rounded-full bg-[#0d4a30] text-xs font-bold text-white">1</span>
            <h3 className="font-bold text-gray-900">Activity Details</h3>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="mb-1 block text-sm font-semibold text-gray-700">Date *</label>
              <input type="date" name="activityDate" value={formData.activityDate} onChange={handleChange} required className="w-full rounded-md border border-gray-300 p-2 text-sm focus:border-green-700 focus:ring-1 focus:ring-green-700" />
            </div>
            <div>
              <label className="mb-1 block text-sm font-semibold text-gray-700">Activity Type *</label>
              <select name="activityType" value={formData.activityType} onChange={handleChange} required className="w-full rounded-md border border-gray-300 p-2 text-sm focus:border-green-700 focus:ring-1 focus:ring-green-700">
                <option value="">Select Type</option>
                <option value="Education">Education</option>
                <option value="Health">Health</option>
                <option value="Awareness">Awareness</option>
                <option value="Livelihood">Livelihood</option>
                <option value="Women Empowerment">Women Empowerment</option>
                <option value="SHG">Self-Help Group(SHG)</option>
              </select>
            </div>
            <div>
              <label className="mb-1 block text-sm font-semibold text-gray-700">Program Name *</label>
              <input type="text" name="programName" value={formData.programName} onChange={handleChange} required placeholder="Enter activity name" className="w-full rounded-md border border-gray-300 p-2 text-sm focus:border-green-700 focus:ring-1 focus:ring-green-700" />
            </div>
          </div>
        </section>

        {/* 2. Location */}
        <section>
          <div className="mb-4 flex items-center gap-2">
            <span className="flex h-6 w-6 items-center justify-center rounded-full bg-[#0d4a30] text-xs font-bold text-white">2</span>
            <h3 className="font-bold text-gray-900">Location</h3>
          </div>
          <div className="rounded-lg bg-green-50 p-4 mb-4 grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
            <div><span className="text-gray-500 block">State</span><span className="font-semibold">{profile?.state}</span></div>
            <div><span className="text-gray-500 block">District</span><span className="font-semibold">{profile?.district}</span></div>
            <div><span className="text-gray-500 block">Block</span><span className="font-semibold">{profile?.block}</span></div>
            <div><span className="text-gray-500 block">Panchayat</span><span className="font-semibold">{profile?.panchayat}</span></div>
          </div>
          <div>
            <label className="mb-1 block text-sm font-semibold text-gray-700">Activity Location *</label>
            <input type="text" name="activityLocation" value={formData.activityLocation} onChange={handleChange} required placeholder="e.g. Government School, XYZ" className="w-full rounded-md border border-gray-300 p-2 text-sm focus:border-green-700 focus:ring-1 focus:ring-green-700" />
          </div>
        </section>

        {/* 3. Impact & Outcome */}
        <section>
          <div className="mb-4 flex items-center gap-2">
            <span className="flex h-6 w-6 items-center justify-center rounded-full bg-[#0d4a30] text-xs font-bold text-white">3</span>
            <h3 className="font-bold text-gray-900">Impact & Outcome</h3>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div>
              <label className="mb-1 block text-sm font-semibold text-gray-700">Total Beneficiaries *</label>
              <input type="number" name="totalBeneficiaries" value={formData.totalBeneficiaries} onChange={handleChange} required className="w-full rounded-md border border-gray-300 p-2 text-sm focus:border-green-700 focus:ring-1 focus:ring-green-700" />
            </div>
            <div>
              <label className="mb-1 block text-sm font-semibold text-gray-700">Project / Funding</label>
              <input type="text" name="projectName" value={formData.projectName} onChange={handleChange} placeholder="Enter project name" className="w-full rounded-md border border-gray-300 p-2 text-sm focus:border-green-700 focus:ring-1 focus:ring-green-700" />
            </div>
          </div>
          <div>
            <label className="mb-1 block text-sm font-semibold text-gray-700">What was achieved? *</label>
            <textarea name="outcome" value={formData.outcome} onChange={handleChange} required rows="3" placeholder="Describe the results or impact of this activity." className="w-full rounded-md border border-gray-300 p-2 text-sm focus:border-green-700 focus:ring-1 focus:ring-green-700"></textarea>
          </div>
        </section>

        {/* 4. Fundraising & Influence */}
        <section>
          <div className="mb-4 flex items-center gap-2">
            <span className="flex h-6 w-6 items-center justify-center rounded-full bg-[#0d4a30] text-xs font-bold text-white">4</span>
            <h3 className="font-bold text-gray-900">Fundraising & Influence</h3>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 border border-gray-200 rounded-xl p-4 bg-gray-50/50">
            <div>
              <label className="mb-1 block text-sm font-semibold text-gray-700">Contributor Name</label>
              <input type="text" name="contributorName" value={formData.contributorName} onChange={handleChange} className="w-full rounded-md border border-gray-300 p-2 text-sm focus:border-green-700 focus:ring-1 focus:ring-green-700" />
            </div>
            <div>
              <label className="mb-1 block text-sm font-semibold text-gray-700">Beneficiary Name</label>
              <input type="text" name="beneficiaryName" value={formData.beneficiaryName} onChange={handleChange} className="w-full rounded-md border border-gray-300 p-2 text-sm focus:border-green-700 focus:ring-1 focus:ring-green-700" />
            </div>
            <div>
              <label className="mb-1 block text-sm font-semibold text-gray-700">Father/Mother Name</label>
              <input type="text" name="parentName" value={formData.parentName} onChange={handleChange} className="w-full rounded-md border border-gray-300 p-2 text-sm focus:border-green-700 focus:ring-1 focus:ring-green-700" />
            </div>
            
            <div className="md:col-span-2">
              <label className="mb-1 block text-sm font-semibold text-gray-700">Address</label>
              <input type="text" name="address" value={formData.address} onChange={handleChange} className="w-full rounded-md border border-gray-300 p-2 text-sm focus:border-green-700 focus:ring-1 focus:ring-green-700" />
            </div>
            <div>
              <label className="mb-1 block text-sm font-semibold text-gray-700">Mobile Number</label>
              <input type="tel" name="mobileNumber" value={formData.mobileNumber} onChange={handleChange} className="w-full rounded-md border border-gray-300 p-2 text-sm focus:border-green-700 focus:ring-1 focus:ring-green-700" />
            </div>

            <div>
              <label className="mb-1 block text-sm font-semibold text-gray-700">Aadhaar Number</label>
              <input type="text" name="aadhaarNumber" placeholder="[Aadhaar Redacted]" value={formData.aadhaarNumber} onChange={handleChange} className="w-full rounded-md border border-gray-300 p-2 text-sm focus:border-green-700 focus:ring-1 focus:ring-green-700" />
            </div>
            <div>
              <label className="mb-1 block text-sm font-semibold text-gray-700">Age</label>
              <input type="number" name="age" value={formData.age} onChange={handleChange} className="w-full rounded-md border border-gray-300 p-2 text-sm focus:border-green-700 focus:ring-1 focus:ring-green-700" />
            </div>
            <div>
              <label className="mb-1 block text-sm font-semibold text-gray-700">Category</label>
              <select name="category" value={formData.category} onChange={handleChange} className="w-full rounded-md border border-gray-300 p-2 text-sm focus:border-green-700 focus:ring-1 focus:ring-green-700">
                <option value="">Select Category</option>
                <option value="General">General</option>
                <option value="OBC">OBC</option>
                <option value="SC">SC</option>
                <option value="ST">ST</option>
                <option value="Other">Other</option>
              </select>
            </div>

            <div>
              <label className="mb-1 block text-sm font-semibold text-gray-700">Amount (₹)</label>
              <input type="number" name="amount" value={formData.amount} onChange={handleChange} className="w-full rounded-md border border-gray-300 p-2 text-sm focus:border-green-700 focus:ring-1 focus:ring-green-700" />
            </div>
            <div>
              <label className="mb-1 block text-sm font-semibold text-gray-700">Date of Birth</label>
              <input type="date" name="dob" value={formData.dob} onChange={handleChange} className="w-full rounded-md border border-gray-300 p-2 text-sm focus:border-green-700 focus:ring-1 focus:ring-green-700" />
            </div>
            <div>
              <label className="mb-1 block text-sm font-semibold text-gray-700">Record Date</label>
              <input type="date" name="recordDate" value={formData.recordDate} onChange={handleChange} className="w-full rounded-md border border-gray-300 p-2 text-sm focus:border-green-700 focus:ring-1 focus:ring-green-700" />
            </div>

            <div className="md:col-span-3">
              <label className="mb-1 block text-sm font-semibold text-gray-700">Beneficiary Photo</label>
              <input type="file" name="beneficiaryPhoto" accept="image/*" onChange={handleFileChange} className="w-full rounded-md border bg-white p-2 text-sm text-gray-600 focus:outline-none focus:ring-1 file:mr-4 file:cursor-pointer file:rounded-md file:border-0 file:bg-green-50 file:px-4 file:py-2 file:text-sm file:font-semibold file:text-green-700 hover:file:bg-green-100" />
            </div>
          </div>
        </section>

        {/* 5. Evidence */}
        <section>
          <div className="mb-4 flex items-center gap-2">
            <span className="flex h-6 w-6 items-center justify-center rounded-full bg-[#0d4a30] text-xs font-bold text-white">5</span>
            <h3 className="font-bold text-gray-900">Evidence Document (Optional)</h3>
          </div>
          <div>
            <label className="mb-1 block text-sm font-semibold text-gray-700">Upload Report Photo or PDF</label>
            <input 
              type="file" 
              name="evidence"
              accept=".jpg,.jpeg,.png,.pdf"
              onChange={handleFileChange}
              className={`w-full rounded-md border bg-gray-50 p-2 text-sm text-gray-600 focus:outline-none focus:ring-1 file:mr-4 file:cursor-pointer file:rounded-md file:border-0 file:bg-[#0d4a30] file:px-4 file:py-2 file:text-sm file:font-semibold file:text-white hover:file:bg-[#0a3a25] ${
                fileError 
                  ? "border-red-500 focus:border-red-500 focus:ring-red-500" 
                  : "border-gray-300 focus:border-green-700 focus:ring-green-700"
              }`} 
            />
            {fileError ? (
              <p className="mt-1 text-xs font-bold text-red-600">{fileError}</p>
            ) : (
              <p className="mt-1 text-xs text-gray-500">Max size: 5MB. Formats: JPG, PNG, PDF.</p>
            )}
          </div>
        </section>

        {/* Footer Actions */}
        <div className="flex items-center justify-end gap-3 border-t border-gray-200 pt-6">
          <button type="button" onClick={onBack} disabled={isSubmitting} className="rounded-md border border-gray-300 px-4 py-2 text-sm font-bold text-gray-700 hover:bg-gray-50 disabled:opacity-50">
            Cancel
          </button>
          <button type="submit" disabled={isSubmitting} className="flex items-center gap-2 rounded-md bg-[#0d4a30] px-6 py-2 text-sm font-bold text-white hover:bg-[#0a3a25] disabled:cursor-not-allowed disabled:opacity-70 transition-all">
            {isSubmitting ? (
              <><Loader2 className="h-4 w-4 animate-spin" /> Submitting...</>
            ) : (
              <><Send className="h-4 w-4" /> Submit Report</>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}