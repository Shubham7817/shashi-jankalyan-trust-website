import React, { useState, useEffect } from "react";
import { Loader2, Eye, X, FileText, CheckCircle, MapPin, BookOpen, User } from "lucide-react";

export default function VolunteerAdminPanel() {
  const [volunteers, setVolunteers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedVol, setSelectedVol] = useState(null);

  useEffect(() => {
    fetchVolunteers();
  }, []);

  const fetchVolunteers = async () => {
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:8080'}/api/volunteers/all`);
      if (response.ok) {
        const data = await response.json();
        setVolunteers(data);
      }
    } catch (error) {
      console.error("Error fetching volunteers:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-bold text-gray-800">Volunteer Applications</h2>
        <span className="bg-green-100 text-green-800 text-sm font-bold px-3 py-1 rounded-full">
          Total: {volunteers.length}
        </span>
      </div>

      {loading ? (
        <div className="flex justify-center py-10"><Loader2 className="animate-spin h-8 w-8 text-[#0d4a30]" /></div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50 text-gray-600 text-sm border-b">
                <th className="p-4 font-semibold">Name</th>
                <th className="p-4 font-semibold">Contact</th>
                <th className="p-4 font-semibold">District</th>
                <th className="p-4 font-semibold">Payment</th>
                <th className="p-4 font-semibold">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {volunteers.map((vol) => (
                <tr key={vol.id} className="hover:bg-gray-50 transition-colors">
                  <td className="p-4">
                    <p className="font-bold text-gray-900">{vol.name}</p>
                    <p className="text-xs text-gray-500">DOB: {vol.dob}</p>
                  </td>
                  <td className="p-4 text-sm text-gray-600">
                    <p>{vol.phone}</p>
                    <p className="text-xs">{vol.email}</p>
                  </td>
                  <td className="p-4 text-sm text-gray-600">{vol.district}, {vol.state}</td>
                  <td className="p-4">
                    <span className="inline-flex items-center gap-1 bg-green-50 text-green-700 text-xs font-bold px-2 py-1 rounded-md border border-green-200">
                      <CheckCircle className="w-3 h-3" /> Paid ₹{vol.amountPaid}
                    </span>
                  </td>
                  <td className="p-4">
                    <button 
                      onClick={() => setSelectedVol(vol)}
                      className="flex items-center gap-1 text-sm bg-gray-100 hover:bg-[#0d4a30] hover:text-white text-gray-700 px-3 py-1.5 rounded-lg transition-colors font-medium"
                    >
                      <Eye className="w-4 h-4" /> View Full
                    </button>
                  </td>
                </tr>
              ))}
              {volunteers.length === 0 && (
                <tr><td colSpan="5" className="text-center p-8 text-gray-500">No volunteers registered yet.</td></tr>
              )}
            </tbody>
          </table>
        </div>
      )}

      {/* FULL PROFILE MODAL */}
      {selectedVol && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="bg-white rounded-2xl w-full max-w-3xl max-h-[90vh] overflow-y-auto shadow-2xl">
            <div className="sticky top-0 bg-[#0d4a30] px-6 py-4 flex justify-between items-center text-white z-10">
              <h3 className="text-lg font-bold">Volunteer Profile: {selectedVol.name}</h3>
              <button onClick={() => setSelectedVol(null)} className="p-1 hover:bg-green-800 rounded-full transition-colors"><X className="w-6 h-6" /></button>
            </div>
            
            <div className="p-6 space-y-8">
              {/* Personal Info */}
              <div>
                <h4 className="flex items-center gap-2 font-bold text-gray-800 border-b pb-2 mb-4"><User className="w-5 h-5 text-[#0d4a30]"/> Personal Details</h4>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4 text-sm">
                  <div><p className="text-gray-500 text-xs uppercase font-bold">Father's Name</p><p className="font-medium text-gray-900">{selectedVol.fatherName}</p></div>
                  <div><p className="text-gray-500 text-xs uppercase font-bold">Date of Birth</p><p className="font-medium text-gray-900">{selectedVol.dob}</p></div>
                  <div><p className="text-gray-500 text-xs uppercase font-bold">Age Group</p><p className="font-medium text-gray-900">{selectedVol.ageGroup}</p></div>
                  <div><p className="text-gray-500 text-xs uppercase font-bold">Email</p><p className="font-medium text-gray-900">{selectedVol.email}</p></div>
                  <div><p className="text-gray-500 text-xs uppercase font-bold">Phone</p><p className="font-medium text-gray-900">{selectedVol.phone}</p></div>
                  <div><p className="text-gray-500 text-xs uppercase font-bold">WhatsApp</p><p className="font-medium text-gray-900">{selectedVol.whatsapp || 'N/A'}</p></div>
                </div>
              </div>

              {/* Location */}
              <div>
                <h4 className="flex items-center gap-2 font-bold text-gray-800 border-b pb-2 mb-4"><MapPin className="w-5 h-5 text-[#0d4a30]"/> Location & Address</h4>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm mb-3">
                  <div><p className="text-gray-500 text-xs uppercase font-bold">State</p><p className="font-medium text-gray-900">{selectedVol.state}</p></div>
                  <div><p className="text-gray-500 text-xs uppercase font-bold">District</p><p className="font-medium text-gray-900">{selectedVol.district}</p></div>
                  <div><p className="text-gray-500 text-xs uppercase font-bold">Block</p><p className="font-medium text-gray-900">{selectedVol.block}</p></div>
                  <div><p className="text-gray-500 text-xs uppercase font-bold">Panchayat</p><p className="font-medium text-gray-900">{selectedVol.panchayat}</p></div>
                </div>
                <div className="text-sm">
                  <p className="text-gray-500 text-xs uppercase font-bold">Full Address & Pincode</p>
                  <p className="font-medium text-gray-900">{selectedVol.address || 'N/A'} - {selectedVol.pincode}</p>
                </div>
              </div>

              {/* Education & Skills */}
              <div>
                <h4 className="flex items-center gap-2 font-bold text-gray-800 border-b pb-2 mb-4"><BookOpen className="w-5 h-5 text-[#0d4a30]"/> Education & Skills</h4>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4 text-sm mb-4">
                  <div><p className="text-gray-500 text-xs uppercase font-bold">Highest Education</p><p className="font-medium text-gray-900">{selectedVol.highestEducation}</p></div>
                  <div><p className="text-gray-500 text-xs uppercase font-bold">English</p><p className="font-medium text-gray-900">{selectedVol.englishProficiency || 'N/A'}</p></div>
                  <div><p className="text-gray-500 text-xs uppercase font-bold">Hindi</p><p className="font-medium text-gray-900">{selectedVol.hindiProficiency || 'N/A'}</p></div>
                  <div className="col-span-2"><p className="text-gray-500 text-xs uppercase font-bold">Languages Known</p><p className="font-medium text-gray-900">{selectedVol.languagesKnown} {selectedVol.otherLanguage && `, ${selectedVol.otherLanguage}`}</p></div>
                </div>
                
                {selectedVol.educationDocUrl && (
                  <a href={selectedVol.educationDocUrl} target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 bg-blue-50 hover:bg-blue-100 text-blue-700 font-semibold px-4 py-2 rounded-lg border border-blue-200 transition-colors text-sm">
                    <FileText className="w-4 h-4" /> View Educational Document (PDF/Image)
                  </a>
                )}
              </div>

              {/* Motivation */}
              <div className="bg-gray-50 p-4 rounded-xl border border-gray-200">
                <p className="text-gray-500 text-xs uppercase font-bold mb-1">Motivation for joining</p>
                <p className="text-sm text-gray-800 italic">"{selectedVol.motivation || 'No message provided.'}"</p>
              </div>

              {/* Payment Receipt Info */}
              <div className="bg-emerald-50 p-4 rounded-xl border border-emerald-200 text-sm">
                <p className="text-emerald-800 font-bold mb-2">Payment Record</p>
                <p className="text-emerald-900"><strong>Txn ID:</strong> {selectedVol.paymentId}</p>
                <p className="text-emerald-900"><strong>Amount:</strong> ₹{selectedVol.amountPaid} ({selectedVol.paymentStatus})</p>
              </div>

            </div>
          </div>
        </div>
      )}
    </div>
  );
}