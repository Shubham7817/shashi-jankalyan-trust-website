import React, { useState, useEffect } from "react";
import { ArrowLeft, Save, Send , Loader2} from "lucide-react";

export default function WorkReportForm({ profile, onBack, onSuccess }) {
  const [formData, setFormData] = useState({
    activityDate: new Date().toISOString().split("T")[0],
    activityType: "",
    programName: "",
    objective: "",
    activityLocation: "",
    startTime: "",
    endTime: "",
    totalHours: 0,
    totalBeneficiaries: "",
    outcome: "",
    projectName: "",
    projectId: ""
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  // Auto-calculate Total Hours when times change
  useEffect(() => {
    if (formData.startTime && formData.endTime) {
      const start = new Date(`1970-01-01T${formData.startTime}`);
      const end = new Date(`1970-01-01T${formData.endTime}`);
      let diff = (end - start) / (1000 * 60 * 60); // Difference in hours
      if (diff < 0) diff += 24; // Handle overnight shifts
      setFormData((prev) => ({ ...prev, totalHours: diff.toFixed(1) }));
    }
  }, [formData.startTime, formData.endTime]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    const volunteerId = sessionStorage.getItem("volunteerId");

    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/reports/${volunteerId}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        // 2. Change this from onBack() to onSuccess()
        onSuccess(); 
      } else {
        alert("Failed to submit report. Please try again.");
      }
    } catch (error) {
      console.error("Submission error:", error);
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
                <option value="Awareness">Livelihood</option>
              </select>
            </div>
            <div>
              <label className="mb-1 block text-sm font-semibold text-gray-700">Program Name *</label>
              <input type="text" name="programName" value={formData.programName} onChange={handleChange} required placeholder="Enter activity name" className="w-full rounded-md border border-gray-300 p-2 text-sm focus:border-green-700 focus:ring-1 focus:ring-green-700" />
            </div>
          </div>
        </section>

        {/* 2. Location (Pre-filled) */}
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

        {/* 3. Work Performed */}
        <section>
          <div className="mb-4 flex items-center gap-2">
            <span className="flex h-6 w-6 items-center justify-center rounded-full bg-[#0d4a30] text-xs font-bold text-white">3</span>
            <h3 className="font-bold text-gray-900">Work Performed</h3>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="mb-1 block text-sm font-semibold text-gray-700">Start Time *</label>
              <input type="time" name="startTime" value={formData.startTime} onChange={handleChange} required className="w-full rounded-md border border-gray-300 p-2 text-sm focus:border-green-700 focus:ring-1 focus:ring-green-700" />
            </div>
            <div>
              <label className="mb-1 block text-sm font-semibold text-gray-700">End Time *</label>
              <input type="time" name="endTime" value={formData.endTime} onChange={handleChange} required className="w-full rounded-md border border-gray-300 p-2 text-sm focus:border-green-700 focus:ring-1 focus:ring-green-700" />
            </div>
            <div>
              <label className="mb-1 block text-sm font-semibold text-gray-700">Total Hours</label>
              <input type="text" readOnly value={`${formData.totalHours} hours`} className="w-full rounded-md border border-gray-200 bg-gray-100 p-2 text-sm text-gray-600 outline-none" />
            </div>
          </div>
        </section>

        {/* 4. People Reached & Outcome */}
        <section>
          <div className="mb-4 flex items-center gap-2">
            <span className="flex h-6 w-6 items-center justify-center rounded-full bg-[#0d4a30] text-xs font-bold text-white">4</span>
            <h3 className="font-bold text-gray-900">Impact & Outcome</h3>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div>
              <label className="mb-1 block text-sm font-semibold text-gray-700">Total Beneficiaries *</label>
              <input type="number" name="totalBeneficiaries" value={formData.totalBeneficiaries} onChange={handleChange} required className="w-full rounded-md border border-gray-300 p-2 text-sm focus:border-green-700 focus:ring-1 focus:ring-green-700" />
            </div>
            <div>
              <label className="mb-1 block text-sm font-semibold text-gray-700">Project / Funding</label>
              <select name="projectName" value={formData.projectName} onChange={handleChange} className="w-full rounded-md border border-gray-300 p-2 text-sm focus:border-green-700 focus:ring-1 focus:ring-green-700">
                <option value="">Select Project</option>
                <option value="Rural Education Program">Rural Education Program</option>
              </select>
            </div>
          </div>
          <div>
            <label className="mb-1 block text-sm font-semibold text-gray-700">What was achieved? *</label>
            <textarea name="outcome" value={formData.outcome} onChange={handleChange} required rows="3" placeholder="Describe the results or impact of this activity." className="w-full rounded-md border border-gray-300 p-2 text-sm focus:border-green-700 focus:ring-1 focus:ring-green-700"></textarea>
          </div>
        </section>

        {/* Footer Actions */}
{/* Footer Actions */}
        <div className="flex items-center justify-end gap-3 border-t border-gray-200 pt-6">
          <button 
            type="button" 
            onClick={onBack}
            disabled={isSubmitting}
            className="rounded-md border border-gray-300 px-4 py-2 text-sm font-bold text-gray-700 hover:bg-gray-50 disabled:opacity-50"
          >
            Cancel
          </button>
          
          <button 
            type="submit" 
            disabled={isSubmitting} 
            className="flex items-center gap-2 rounded-md bg-[#0d4a30] px-6 py-2 text-sm font-bold text-white hover:bg-[#0a3a25] disabled:cursor-not-allowed disabled:opacity-70 transition-all"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Submitting...
              </>
            ) : (
              <>
                <Send className="h-4 w-4" />
                Submit Report
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}