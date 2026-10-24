import React, { useState } from "react";
import { ArrowLeft, Send, Loader2, Plus, Trash2 } from "lucide-react";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  import.meta.env.VITE_SUPABASE_URL,
  import.meta.env.VITE_SUPABASE_ANON_KEY
);

export default function WorkReportForm({ profile, initialData, onBack, onSuccess }) {
  const [formData, setFormData] = useState({
    activityDate: initialData?.activityDate || new Date().toISOString().split("T")[0],
    recordDate: initialData?.recordDate || new Date().toISOString().split("T")[0],
    activityType: initialData?.activityType || "",
    activityLocation: initialData?.activityLocation || "",
    
    beneficiaryName: initialData?.beneficiaryName || "",
    fatherName: initialData?.fatherName || "",
    motherName: initialData?.motherName || "",
    husbandName: initialData?.husbandName || "",
    mobileNumber: initialData?.mobileNumber || "",
    aadhaarNumber: initialData?.aadhaarNumber || "",
    age: initialData?.age || "",
    dob: initialData?.dob || "",
    category: initialData?.category || "",

    state: initialData?.state || profile?.state || "",
    district: initialData?.district || profile?.district || "",
    block: initialData?.block || profile?.block || "",
    panchayat: initialData?.panchayat || profile?.panchayat || "",
    village: initialData?.village || "",
    address: initialData?.address || "",

    diseaseType: initialData?.diseaseType || "",
    loanAmount: initialData?.loanAmount || "",
    companyName: initialData?.companyName || "",
    trainingType: initialData?.trainingType || "",
    shgName: initialData?.shgName || "",
    classOrGrade: initialData?.classOrGrade || "",
    schoolName: initialData?.schoolName || ""
  });

  const [shgMembers, setShgMembers] = useState(() => {
    if (initialData?.additionalMembersDetails) {
      try {
        return JSON.parse(initialData.additionalMembersDetails);
      } catch (e) {
        return [{ name: initialData.beneficiaryName, husbandName: initialData.husbandName, mobile: initialData.mobileNumber, address: initialData.additionalMembersDetails }];
      }
    }
    return [{ name: "", husbandName: "", mobile: "", address: "" }];
  });

  const [files, setFiles] = useState({ evidence: null, beneficiaryPhoto: null });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [fileError, setFileError] = useState("");

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleMemberChange = (index, field, value) => {
    const updatedMembers = [...shgMembers];
    updatedMembers[index][field] = value;
    setShgMembers(updatedMembers);
  };

  const addMember = () => setShgMembers([...shgMembers, { name: "", husbandName: "", mobile: "", address: "" }]);
  const removeMember = (index) => setShgMembers(shgMembers.filter((_, i) => i !== index));

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    const fieldName = e.target.name;
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
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
    const { error } = await supabase.storage.from("evidence-files").upload(fileName, file);
    if (error) throw error;
    const { data: { publicUrl } } = supabase.storage.from("evidence-files").getPublicUrl(fileName);
    return publicUrl;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    const volunteerId = sessionStorage.getItem("volunteerId");

    try {
      const evidenceUrl = files.evidence 
        ? await uploadFileToSupabase(files.evidence, 'reports') 
        : initialData?.evidenceUrl || null;
        
      const beneficiaryPhotoUrl = files.beneficiaryPhoto 
        ? await uploadFileToSupabase(files.beneficiaryPhoto, 'beneficiaries') 
        : initialData?.beneficiaryPhotoUrl || null;

      const finalReportData = { ...formData, evidenceUrl, beneficiaryPhotoUrl };

      if (formData.activityType === "SHG") {
        finalReportData.totalMembers = shgMembers.length;
        finalReportData.beneficiaryName = shgMembers[0]?.name || "";
        finalReportData.husbandName = shgMembers[0]?.husbandName || "";
        finalReportData.mobileNumber = shgMembers[0]?.mobile || "";
        finalReportData.additionalMembersDetails = JSON.stringify(shgMembers); 
      }

      const isEditing = !!initialData?.id;
      const endpoint = isEditing 
        ? `${import.meta.env.VITE_API_URL || 'http://localhost:8080'}/api/reports/edit/${initialData.id}` 
        : `${import.meta.env.VITE_API_URL || 'http://localhost:8080'}/api/reports/${volunteerId}`;

      const response = await fetch(endpoint, {
        method: isEditing ? "PUT" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(finalReportData),
      });

      if (response.ok) onSuccess(); 
      else alert("Failed to save report details. Please try again.");
    } catch (error) {
      console.error("Submission error:", error);
      alert("An unexpected error occurred during submission.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const type = formData.activityType;

  return (
    <div className="mx-auto max-w-4xl rounded-xl bg-white shadow-sm border border-gray-200">
      <div className="flex items-center gap-4 border-b border-gray-200 bg-[#0d4a30] p-4 text-white rounded-t-xl">
        <button onClick={onBack} className="rounded-full p-2 hover:bg-white/20 transition-colors">
          <ArrowLeft className="h-5 w-5" />
        </button>
        <div>
          <h2 className="text-lg font-bold">{initialData ? "Edit Work Details" : "Update Work Details"}</h2>
          <p className="text-xs text-green-100">Select an activity type to view specific fields.</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="p-6 space-y-8">
        
        <section>
          <div className="mb-4 flex items-center gap-2">
            <span className="flex h-6 w-6 items-center justify-center rounded-full bg-[#0d4a30] text-xs font-bold text-white">1</span>
            <h3 className="font-bold text-gray-900">Activity Overview</h3>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="mb-1 block text-sm font-semibold text-gray-700">Activity Type *</label>
              <select name="activityType" value={formData.activityType} onChange={handleChange} required className="w-full rounded-md border border-gray-300 p-2 text-sm focus:border-green-700 bg-gray-50">
                <option value="">Select Type</option>
                <option value="Health">Healthcare</option>
                <option value="Soil Testing">Soil Testing</option>
                <option value="Women Empowerment">Women Empowerment</option>
                <option value="Awareness">Awareness</option>
                <option value="SHG">Self-Help Group (SHG)</option>
                <option value="Education">Education</option>
              </select>
            </div>
            <div>
              <label className="mb-1 block text-sm font-semibold text-gray-700">Activity Date *</label>
              <input type="date" name="activityDate" value={formData.activityDate} onChange={handleChange} required className="w-full rounded-md border border-gray-300 p-2 text-sm focus:border-green-700" />
            </div>
            <div>
              <label className="mb-1 block text-sm font-semibold text-gray-700">Record Date *</label>
              <input type="date" name="recordDate" value={formData.recordDate} onChange={handleChange} required className="w-full rounded-md border border-gray-300 p-2 text-sm focus:border-green-700" />
            </div>
          </div>
        </section>

        <section>
          <div className="mb-4 flex items-center gap-2">
            <span className="flex h-6 w-6 items-center justify-center rounded-full bg-[#0d4a30] text-xs font-bold text-white">2</span>
            <h3 className="font-bold text-gray-900">Location</h3>
          </div>
          <div className="rounded-lg bg-green-50 p-4 mb-4 grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
            <div><span className="text-gray-500 block">State</span><span className="font-semibold">{formData.state}</span></div>
            <div><span className="text-gray-500 block">District</span><span className="font-semibold">{formData.district}</span></div>
            <div><span className="text-gray-500 block">Block</span><span className="font-semibold">{formData.block}</span></div>
            <div><span className="text-gray-500 block">Panchayat</span><span className="font-semibold">{formData.panchayat}</span></div>
          </div>
          <div>
            <label className="mb-1 block text-sm font-semibold text-gray-700">Activity Location *</label>
            <input type="text" name="activityLocation" value={formData.activityLocation} onChange={handleChange} required placeholder="e.g. Government School, XYZ" className="w-full rounded-md border border-gray-300 p-2 text-sm focus:border-green-700" />
          </div>
        </section>

        {type && (
          <section className="p-5 border border-green-200 bg-green-50/30 rounded-xl space-y-6">
            <div className="mb-2 flex items-center gap-2">
              <span className="flex h-6 w-6 items-center justify-center rounded-full bg-[#0d4a30] text-xs font-bold text-white">3</span>
              <h3 className="font-bold text-gray-900 border-b border-gray-200 pb-1 flex-1">{type} Details</h3>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              
              {type === "Health" && (
                <>
                  <div><label className="text-sm font-semibold mb-1 block">Patient Name</label><input type="text" name="beneficiaryName" value={formData.beneficiaryName} onChange={handleChange} className="w-full border border-gray-300 p-2 rounded-md" /></div>
                  <div><label className="text-sm font-semibold mb-1 block">Father Name</label><input type="text" name="fatherName" value={formData.fatherName} onChange={handleChange} className="w-full border border-gray-300 p-2 rounded-md" /></div>
                  <div><label className="text-sm font-semibold mb-1 block">Mother Name</label><input type="text" name="motherName" value={formData.motherName} onChange={handleChange} className="w-full border border-gray-300 p-2 rounded-md" /></div>
                  <div><label className="text-sm font-semibold mb-1 block">Mobile Number</label><input type="tel" name="mobileNumber" value={formData.mobileNumber} onChange={handleChange} className="w-full border border-gray-300 p-2 rounded-md" /></div>
                  <div><label className="text-sm font-semibold mb-1 block">Age</label><input type="number" name="age" value={formData.age} onChange={handleChange} className="w-full border border-gray-300 p-2 rounded-md" /></div>
                  <div><label className="text-sm font-semibold mb-1 block">Aadhaar Number</label><input type="text" name="aadhaarNumber" value={formData.aadhaarNumber} placeholder="[Aadhaar Redacted]" onChange={handleChange} className="w-full border border-gray-300 p-2 rounded-md" /></div>
                  <div><label className="text-sm font-semibold mb-1 block">DOB</label><input type="date" name="dob" value={formData.dob} onChange={handleChange} className="w-full border border-gray-300 p-2 rounded-md" /></div>
                  <div><label className="text-sm font-semibold mb-1 block">Type of Disease</label><input type="text" name="diseaseType" value={formData.diseaseType} onChange={handleChange} className="w-full border border-gray-300 p-2 rounded-md" /></div>
                  <div><label className="text-sm font-semibold mb-1 block">Loan Amount</label><input type="number" name="loanAmount" value={formData.loanAmount} onChange={handleChange} className="w-full border border-gray-300 p-2 rounded-md" /></div>
                  <div><label className="text-sm font-semibold mb-1 block">Name of Company</label><input type="text" name="companyName" value={formData.companyName} onChange={handleChange} className="w-full border border-gray-300 p-2 rounded-md" /></div>
                </>
              )}

              {type === "Soil Testing" && (
                <>
                  <div><label className="text-sm font-semibold mb-1 block">Farmer Name</label><input type="text" name="beneficiaryName" value={formData.beneficiaryName} onChange={handleChange} className="w-full border border-gray-300 p-2 rounded-md" /></div>
                  <div><label className="text-sm font-semibold mb-1 block">Father Name</label><input type="text" name="fatherName" value={formData.fatherName} onChange={handleChange} className="w-full border border-gray-300 p-2 rounded-md" /></div>
                  <div><label className="text-sm font-semibold mb-1 block">Mobile Number</label><input type="tel" name="mobileNumber" value={formData.mobileNumber} onChange={handleChange} className="w-full border border-gray-300 p-2 rounded-md" /></div>
                </>
              )}

              {type === "Women Empowerment" && (
                <>
                  <div><label className="text-sm font-semibold mb-1 block">Name</label><input type="text" name="beneficiaryName" value={formData.beneficiaryName} onChange={handleChange} className="w-full border border-gray-300 p-2 rounded-md" /></div>
                  <div><label className="text-sm font-semibold mb-1 block">Father Name</label><input type="text" name="fatherName" value={formData.fatherName} onChange={handleChange} className="w-full border border-gray-300 p-2 rounded-md" /></div>
                  <div><label className="text-sm font-semibold mb-1 block">Mother Name</label><input type="text" name="motherName" value={formData.motherName} onChange={handleChange} className="w-full border border-gray-300 p-2 rounded-md" /></div>
                  <div><label className="text-sm font-semibold mb-1 block">Aadhaar Number</label><input type="text" name="aadhaarNumber" value={formData.aadhaarNumber} placeholder="[Aadhaar Redacted]" onChange={handleChange} className="w-full border border-gray-300 p-2 rounded-md" /></div>
                  <div><label className="text-sm font-semibold mb-1 block">DOB</label><input type="date" name="dob" value={formData.dob} onChange={handleChange} className="w-full border border-gray-300 p-2 rounded-md" /></div>
                  <div><label className="text-sm font-semibold mb-1 block">Age</label><input type="number" name="age" value={formData.age} onChange={handleChange} className="w-full border border-gray-300 p-2 rounded-md" /></div>
                  <div><label className="text-sm font-semibold mb-1 block">Type of Training</label><input type="text" name="trainingType" value={formData.trainingType} onChange={handleChange} className="w-full border border-gray-300 p-2 rounded-md" /></div>
                </>
              )}

              {type === "Awareness" && (
                <>
                  <div><label className="text-sm font-semibold mb-1 block">Name</label><input type="text" name="beneficiaryName" value={formData.beneficiaryName} onChange={handleChange} className="w-full border border-gray-300 p-2 rounded-md" /></div>
                  <div><label className="text-sm font-semibold mb-1 block">Father Name</label><input type="text" name="fatherName" value={formData.fatherName} onChange={handleChange} className="w-full border border-gray-300 p-2 rounded-md" /></div>
                  <div><label className="text-sm font-semibold mb-1 block">Mother Name</label><input type="text" name="motherName" value={formData.motherName} onChange={handleChange} className="w-full border border-gray-300 p-2 rounded-md" /></div>
                  <div><label className="text-sm font-semibold mb-1 block">Mobile Number</label><input type="tel" name="mobileNumber" value={formData.mobileNumber} onChange={handleChange} className="w-full border border-gray-300 p-2 rounded-md" /></div>
                  <div><label className="text-sm font-semibold mb-1 block">Aadhaar Number</label><input type="text" name="aadhaarNumber" value={formData.aadhaarNumber} placeholder="[Aadhaar Redacted]" onChange={handleChange} className="w-full border border-gray-300 p-2 rounded-md" /></div>
                  <div><label className="text-sm font-semibold mb-1 block">Category</label>
                    <select name="category" value={formData.category} onChange={handleChange} className="w-full border border-gray-300 p-2 rounded-md bg-white">
                      <option value="">Select Category</option>
                      <option value="SC">SC</option><option value="ST">ST</option>
                      <option value="OBC">OBC</option><option value="EBC">EBC</option>
                      <option value="General">General</option>
                    </select>
                  </div>
                  <div><label className="text-sm font-semibold mb-1 block">Village</label><input type="text" name="village" value={formData.village} onChange={handleChange} className="w-full border border-gray-300 p-2 rounded-md" /></div>
                </>
              )}

              {type === "Education" && (
                <>
                  <div><label className="text-sm font-semibold mb-1 block">Student Name</label><input type="text" name="beneficiaryName" value={formData.beneficiaryName} onChange={handleChange} className="w-full border border-gray-300 p-2 rounded-md" /></div>
                  <div><label className="text-sm font-semibold mb-1 block">Father Name</label><input type="text" name="fatherName" value={formData.fatherName} onChange={handleChange} className="w-full border border-gray-300 p-2 rounded-md" /></div>
                  <div><label className="text-sm font-semibold mb-1 block">Mother Name</label><input type="text" name="motherName" value={formData.motherName} onChange={handleChange} className="w-full border border-gray-300 p-2 rounded-md" /></div>
                  <div><label className="text-sm font-semibold mb-1 block">Class / Grade</label><input type="text" name="classOrGrade" value={formData.classOrGrade} onChange={handleChange} className="w-full border border-gray-300 p-2 rounded-md" /></div>
                  <div><label className="text-sm font-semibold mb-1 block">School Name</label><input type="text" name="schoolName" value={formData.schoolName} onChange={handleChange} className="w-full border border-gray-300 p-2 rounded-md" /></div>
                  <div><label className="text-sm font-semibold mb-1 block">Mobile Number</label><input type="tel" name="mobileNumber" value={formData.mobileNumber} onChange={handleChange} className="w-full border border-gray-300 p-2 rounded-md" /></div>
                  <div><label className="text-sm font-semibold mb-1 block">Age</label><input type="number" name="age" value={formData.age} onChange={handleChange} className="w-full border border-gray-300 p-2 rounded-md" /></div>
                  <div><label className="text-sm font-semibold mb-1 block">DOB</label><input type="date" name="dob" value={formData.dob} onChange={handleChange} className="w-full border border-gray-300 p-2 rounded-md" /></div>
                </>
              )}

              {/* DYNAMIC SHG SECTION */}
              {type === "SHG" && (
                <div className="md:col-span-3 space-y-4">
                  <div className="md:w-1/3">
                    <label className="text-sm font-semibold mb-1 block">Name of SHG Group</label>
                    <input type="text" name="shgName" required value={formData.shgName} onChange={handleChange} className="w-full border border-gray-300 p-2 rounded-md" />
                  </div>
                  
                  <div className="flex items-center justify-between mt-4 border-b border-green-200 pb-2">
                    <h4 className="font-bold text-gray-800">Group Members ({shgMembers.length})</h4>
                    <button type="button" onClick={addMember} className="flex items-center gap-1 text-xs bg-green-600 text-white px-3 py-1.5 rounded-md font-bold hover:bg-green-700 transition-colors">
                      <Plus className="h-3 w-3" /> Add Member
                    </button>
                  </div>

                  <div className="space-y-3">
                    {shgMembers.map((member, index) => (
                      <div key={index} className="p-4 border border-gray-200 rounded-lg bg-white relative shadow-sm">
                        {index > 0 && (
                          <button type="button" onClick={() => removeMember(index)} className="absolute top-3 right-3 text-red-500 hover:text-red-700 hover:bg-red-50 p-1 rounded-md transition-colors" title="Remove Member">
                            <Trash2 className="h-4 w-4" />
                          </button>
                        )}
                        <p className="text-xs font-bold text-emerald-700 mb-3 uppercase tracking-wider">
                          Member {index + 1} {index === 0 ? " (Primary Leader)" : ""}
                        </p>
                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3">
                          <div>
                            <label className="text-xs font-semibold text-gray-500 mb-1 block">Member's Name</label>
                            <input type="text" required value={member.name} onChange={(e) => handleMemberChange(index, "name", e.target.value)} className="w-full border border-gray-300 p-2 text-sm rounded-md" />
                          </div>
                          <div>
                            <label className="text-xs font-semibold text-gray-500 mb-1 block">Husband Name</label>
                            <input type="text" value={member.husbandName} onChange={(e) => handleMemberChange(index, "husbandName", e.target.value)} className="w-full border border-gray-300 p-2 text-sm rounded-md" />
                          </div>
                          <div>
                            <label className="text-xs font-semibold text-gray-500 mb-1 block">Mobile Number</label>
                            <input type="tel" value={member.mobile} onChange={(e) => handleMemberChange(index, "mobile", e.target.value)} className="w-full border border-gray-300 p-2 text-sm rounded-md" />
                          </div>
                          <div>
                            <label className="text-xs font-semibold text-gray-500 mb-1 block">Address</label>
                            <input type="text" value={member.address} onChange={(e) => handleMemberChange(index, "address", e.target.value)} className="w-full border border-gray-300 p-2 text-sm rounded-md" />
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
            
            {["Women Empowerment", "Awareness", "SHG"].includes(type) && (
              <div className="pt-4 border-t border-gray-300">
                <label className="text-sm font-semibold block mb-1">Beneficiary/Group Photo <span className="text-xs text-red-500">(Max 5MB)</span></label>
                <input type="file" name="beneficiaryPhoto" accept="image/*" onChange={handleFileChange} className="w-full text-xs text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:bg-green-100 file:text-green-700 hover:file:bg-green-200" />
                {initialData?.beneficiaryPhotoUrl && <p className="text-xs text-green-700 mt-1">A photo is already attached. Upload a new one to replace it.</p>}
              </div>
            )}
          </section>
        )}

        <section>
          <div className="mb-4 flex items-center gap-2">
            <span className="flex h-6 w-6 items-center justify-center rounded-full bg-[#0d4a30] text-xs font-bold text-white">{type ? "4" : "3"}</span>
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
            {initialData?.evidenceUrl && !fileError && (
              <p className="mt-1 text-xs text-green-700">A document is already attached. Upload a new one to replace it.</p>
            )}
            {fileError ? (
              <p className="mt-1 text-xs font-bold text-red-600">{fileError}</p>
            ) : (
              <p className="mt-1 text-xs text-gray-500">Max size: 5MB. Formats: JPG, PNG, PDF.</p>
            )}
          </div>
        </section>

        <div className="flex items-center justify-end gap-3 border-t border-gray-200 pt-6">
          <button type="button" onClick={onBack} disabled={isSubmitting} className="rounded-md border px-4 py-2 text-sm font-bold text-gray-700 hover:bg-gray-50 disabled:opacity-50">Cancel</button>
          <button type="submit" disabled={isSubmitting || !type} className="flex items-center gap-2 rounded-md bg-[#0d4a30] px-6 py-2 text-sm font-bold text-white hover:bg-[#0a3a25] disabled:opacity-50">
            {isSubmitting ? <><Loader2 className="h-4 w-4 animate-spin" /> {initialData ? "Saving..." : "Submitting..."}</> : <><Send className="h-4 w-4" /> {initialData ? "Save Changes" : "Submit Report"}</>}
          </button>
        </div>
      </form>
    </div>
  );
}