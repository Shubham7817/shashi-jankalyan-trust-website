import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { ShieldCheck, LogOut, Clock, FileText, Image as ImageIcon } from "lucide-react";

export default function AdminDashboard() {
  const navigate = useNavigate();
  const [allReports, setAllReports] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const currentUsername = sessionStorage.getItem("username");
    
    if (currentUsername !== "admin") {
      navigate("/"); 
      return;
    }

    const fetchAllReports = async () => {
      try {
        const response = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:8080'}/api/admin/reports`);
        if (response.ok) {
          const data = await response.json();
          setAllReports(data);
        }
      } catch (error) {
        console.error("Failed to fetch admin reports", error);
      } finally {
        setLoading(false);
      }
    };

    fetchAllReports();
  }, [navigate]);

  const handleLogout = () => {
    sessionStorage.clear();
    navigate("/");
  };

  const formatDate = (dateString) => {
    if (!dateString) return "-";
    return new Date(dateString).toLocaleDateString('en-GB', {
      day: '2-digit', month: 'short', year: 'numeric'
    });
  };

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center bg-gray-50">
        <div className="h-12 w-12 animate-spin rounded-full border-4 border-[#0d4a30] border-t-transparent"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Admin Header */}
      <header className="flex h-16 items-center justify-between bg-[#0d4a30] px-6 text-white shadow-md">
        <div className="flex items-center gap-3">
          <ShieldCheck className="h-6 w-6 text-green-400" />
          <h1 className="font-serif text-xl font-bold tracking-wide">Admin Portal</h1>
        </div>
        <button 
          onClick={handleLogout}
          className="flex items-center gap-2 rounded-md bg-green-800 px-4 py-2 text-sm font-medium hover:bg-green-900 transition-colors"
        >
          <LogOut className="h-4 w-4" />
          Logout
        </button>
      </header>

      {/* Admin Main Content */}
      <main className="mx-auto max-w-[95%] lg:max-w-screen-2xl p-6 lg:p-8">
        <div className="mb-6 flex items-center gap-2">
          <Clock className="h-6 w-6 text-gray-700" />
          <h2 className="text-2xl font-bold text-gray-900">All Volunteer Submissions</h2>
        </div>

        <div className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">
          <div className="overflow-x-auto pb-2">
            <table className="w-full text-left text-sm text-gray-600 whitespace-nowrap">
              <thead className="bg-gray-100 text-gray-700">
                <tr>
                  <th className="px-4 py-4 font-bold">Date</th>
                  <th className="px-4 py-4 font-bold">Volunteer</th>
                  <th className="px-4 py-4 font-bold">Activity Type</th>
                  <th className="px-4 py-4 font-bold">Program Name</th>
                  <th className="px-4 py-4 font-bold">Beneficiary Name</th>
                  <th className="px-4 py-4 font-bold">Parent Name</th>
                  <th className="px-4 py-4 font-bold">Contributor</th>
                  <th className="px-4 py-4 font-bold">Amount (₹)</th>
                  <th className="px-4 py-4 font-bold">Mobile</th>
                  <th className="px-4 py-4 font-bold">Aadhaar</th>
                  <th className="px-4 py-4 font-bold">Age & Category</th>
                  <th className="px-4 py-4 font-bold">DOB</th>
                  <th className="px-4 py-4 font-bold">Record Date</th>
                  <th className="px-4 py-4 font-bold">Address</th>
                  <th className="px-4 py-4 font-bold">Documents</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {allReports.length > 0 ? allReports.map((report) => (
                  <tr key={report.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-4 py-4 font-medium text-gray-900">{formatDate(report.activityDate)}</td>
                    <td className="px-4 py-4 font-semibold text-blue-700">{report.user?.username || "Unknown"}</td>
                    <td className="px-4 py-4">{report.activityType}</td>
                    <td className="px-4 py-4 truncate max-w-[150px]" title={report.programName}>{report.programName}</td>
                    
                    <td className="px-4 py-4 font-medium text-gray-900">{report.beneficiaryName || "-"}</td>
                    <td className="px-4 py-4">{report.parentName || "-"}</td>
                    <td className="px-4 py-4">{report.contributorName || "-"}</td>
                    
                    <td className="px-4 py-4 font-bold text-green-700">
                      {report.amount ? `₹${report.amount}` : "-"}
                    </td>
                    
                    <td className="px-4 py-4">{report.mobileNumber || "-"}</td>
                    <td className="px-4 py-4 font-mono">
                      {/* UI Masking for security */}
                      {report.aadhaarNumber && report.aadhaarNumber.length >= 4 
                        ? `********${report.aadhaarNumber.slice(-4)}` 
                        : (report.aadhaarNumber || "-")}
                    </td>
                    
                    <td className="px-4 py-4">
                      {report.age ? `${report.age}y` : "-"} {report.category ? `/ ${report.category}` : ""}
                    </td>
                    
                    <td className="px-4 py-4">{formatDate(report.dob)}</td>
                    <td className="px-4 py-4">{formatDate(report.recordDate)}</td>
                    <td className="px-4 py-4 truncate max-w-[150px]" title={report.address}>{report.address || "-"}</td>
                    
                    <td className="px-4 py-4 flex gap-2">
                      {report.evidenceUrl ? (
                        <a 
                          href={report.evidenceUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          title="View Report Evidence"
                          className="inline-flex items-center justify-center rounded-md bg-blue-50 p-1.5 text-blue-700 hover:bg-blue-100 transition-colors"
                        >
                          <FileText className="h-4 w-4" />
                        </a>
                      ) : null}
                      
                      {report.beneficiaryPhotoUrl ? (
                        <a 
                          href={report.beneficiaryPhotoUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          title="View Beneficiary Photo"
                          className="inline-flex items-center justify-center rounded-md bg-emerald-50 p-1.5 text-emerald-700 hover:bg-emerald-100 transition-colors"
                        >
                          <ImageIcon className="h-4 w-4" />
                        </a>
                      ) : null}

                      {!report.evidenceUrl && !report.beneficiaryPhotoUrl && (
                        <span className="text-xs text-gray-400 font-medium">None</span>
                      )}
                    </td>
                  </tr>
                )) : (
                  <tr>
                    {/* Updated colSpan to 15 to match the new column count */}
                    <td colSpan="15" className="py-12 text-center text-gray-500 font-medium">
                      No reports have been submitted yet.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </main>
    </div>
  );
}