import React, { useState, useEffect } from "react";
import { ArrowLeft, Search, Calendar, FilterX, FileText, Image as ImageIcon } from "lucide-react";

export default function MyReportsView({ onBack }) {
  const [reports, setReports] = useState([]);
  const [filteredReports, setFilteredReports] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // Filter States
  const [filterDate, setFilterDate] = useState("");

  useEffect(() => {
    const fetchAllReports = async () => {
      const volunteerId = sessionStorage.getItem("volunteerId");
      try {
        const response = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:8080'}/api/reports/user/${volunteerId}`);
        if (response.ok) {
          const data = await response.json();
          setReports(data);
          setFilteredReports(data); 
        }
      } catch (error) {
        console.error("Failed to fetch reports", error);
      } finally {
        setLoading(false);
      }
    };
    fetchAllReports();
  }, []);

  const applyFilter = () => {
    if (!filterDate) {
      setFilteredReports(reports);
      return;
    }
    const filtered = reports.filter(report => report.activityDate === filterDate);
    setFilteredReports(filtered);
  };

  const clearFilter = () => {
    setFilterDate("");
    setFilteredReports(reports);
  };

  const formatDate = (dateString) => {
    if (!dateString) return "-";
    return new Date(dateString).toLocaleDateString('en-GB', {
      day: '2-digit', month: 'short', year: 'numeric'
    });
  };

  if (loading) {
    return <div className="text-center py-10 text-gray-500 font-bold">Loading reports...</div>;
  }

  return (
    <div className="mx-auto max-w-7xl rounded-xl bg-white shadow-sm border border-gray-200 overflow-hidden">
      <div className="flex items-center gap-4 border-b border-gray-200 bg-[#0d4a30] p-4 text-white">
        <button onClick={onBack} className="rounded-full p-2 hover:bg-white/20 transition-colors">
          <ArrowLeft className="h-5 w-5" />
        </button>
        <div>
          <h2 className="text-lg font-bold">My Submitted Reports</h2>
          <p className="text-xs text-green-100">View and filter your complete activity history.</p>
        </div>
      </div>

      <div className="p-6">
        <div className="mb-6 flex flex-wrap items-end gap-4 rounded-lg bg-gray-50 p-4 border border-gray-200">
          <div>
            <label className="mb-1 block text-sm font-semibold text-gray-700">Filter by Date</label>
            <div className="relative">
              <Calendar className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
              <input 
                type="date" 
                value={filterDate}
                onChange={(e) => setFilterDate(e.target.value)}
                className="w-48 rounded-md border border-gray-300 py-2 pl-10 pr-3 text-sm focus:border-green-700 focus:outline-none focus:ring-1 focus:ring-green-700" 
              />
            </div>
          </div>
          
          <button 
            onClick={applyFilter}
            className="flex items-center gap-2 rounded-md bg-green-700 px-4 py-2 text-sm font-bold text-white hover:bg-green-800"
          >
            <Search className="h-4 w-4" /> Apply Filter
          </button>
          
          {filterDate && (
            <button 
              onClick={clearFilter}
              className="flex items-center gap-2 rounded-md border border-red-200 bg-red-50 px-4 py-2 text-sm font-bold text-red-600 hover:bg-red-100"
            >
              <FilterX className="h-4 w-4" /> Clear
            </button>
          )}
        </div>

        <div className="overflow-x-auto rounded-lg border border-gray-200 pb-2">
          <table className="w-full text-left text-sm text-gray-600 whitespace-nowrap">
            <thead className="bg-gray-100 text-gray-700">
              <tr>
                <th className="px-4 py-3 font-bold">Activity Date</th>
                <th className="px-4 py-3 font-bold">Program</th>
                <th className="px-4 py-3 font-bold">Beneficiary Name</th>
                <th className="px-4 py-3 font-bold">Parent Name</th>
                <th className="px-4 py-3 font-bold">Contributor</th>
                <th className="px-4 py-3 font-bold">Amount (₹)</th>
                <th className="px-4 py-3 font-bold">Mobile</th>
                <th className="px-4 py-3 font-bold">Aadhaar</th>
                <th className="px-4 py-3 font-bold">Age & Category</th>
                <th className="px-4 py-3 font-bold">DOB</th>
                <th className="px-4 py-3 font-bold">Record Date</th>
                <th className="px-4 py-3 font-bold">Address</th>
                <th className="px-4 py-3 font-bold">Documents</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filteredReports.length > 0 ? (
                filteredReports.map((report) => (
                  <tr key={report.id} className="hover:bg-gray-50">
                    <td className="px-4 py-3 font-medium text-gray-900">{formatDate(report.activityDate)}</td>
                    <td className="px-4 py-3 truncate max-w-[150px]" title={report.programName}>{report.programName}</td>
                    
                    <td className="px-4 py-3 font-medium text-gray-900">{report.beneficiaryName || "-"}</td>
                    <td className="px-4 py-3">{report.parentName || "-"}</td>
                    <td className="px-4 py-3">{report.contributorName || "-"}</td>
                    
                    <td className="px-4 py-3 font-bold text-green-700">
                      {report.amount ? `₹${report.amount}` : "-"}
                    </td>
                    
                    <td className="px-4 py-3">{report.mobileNumber || "-"}</td>
                    <td className="px-4 py-3 font-mono">
                      {report.aadhaarNumber && report.aadhaarNumber.length >= 4 
                        ? `********${report.aadhaarNumber.slice(-4)}` 
                        : (report.aadhaarNumber || "-")}
                    </td>
                    
                    <td className="px-4 py-3">
                      {report.age ? `${report.age}y` : "-"} {report.category ? `/ ${report.category}` : ""}
                    </td>
                    
                    <td className="px-4 py-3">{formatDate(report.dob)}</td>
                    <td className="px-4 py-3">{formatDate(report.recordDate)}</td>
                    <td className="px-4 py-3 truncate max-w-[150px]" title={report.address}>{report.address || "-"}</td>
                    
                    <td className="px-4 py-3 flex gap-2">
                      {report.evidenceUrl ? (
                        <a 
                          href={report.evidenceUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          title="View Report Evidence"
                          className="inline-flex items-center justify-center rounded-md bg-blue-50 p-1.5 text-blue-700 hover:bg-blue-100"
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
                          className="inline-flex items-center justify-center rounded-md bg-emerald-50 p-1.5 text-emerald-700 hover:bg-emerald-100"
                        >
                          <ImageIcon className="h-4 w-4" />
                        </a>
                      ) : null}

                      {!report.evidenceUrl && !report.beneficiaryPhotoUrl && (
                        <span className="text-xs text-gray-400 font-medium">None</span>
                      )}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="13" className="py-8 text-center text-gray-500">
                    No reports found for the selected date.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}