import React, { useState, useEffect } from "react";
import { ArrowLeft, Search, Calendar, FilterX } from "lucide-react";

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
        const response = await fetch(`http://localhost:8080/api/reports/user/${volunteerId}`);
        // const response = await fetch(`${import.meta.env.VITE_API_URL}/api/reports/user/${volunteerId}`);
        if (response.ok) {
          const data = await response.json();
          setReports(data);
          setFilteredReports(data); // Initially show all
        }
      } catch (error) {
        console.error("Failed to fetch reports", error);
      } finally {
        setLoading(false);
      }
    };
    fetchAllReports();
  }, []);

  // Handle Filtering
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
    return new Date(dateString).toLocaleDateString('en-GB', {
      day: '2-digit', month: 'short', year: 'numeric'
    });
  };

  if (loading) {
    return <div className="text-center py-10 text-gray-500 font-bold">Loading reports...</div>;
  }

  return (
    <div className="mx-auto max-w-7xl rounded-xl bg-white shadow-sm border border-gray-200 overflow-hidden">
      {/* Header */}
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
        {/* Filter Toolbar */}
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

        {/* Data Table */}
        <div className="overflow-x-auto rounded-lg border border-gray-200">
          <table className="w-full text-left text-sm text-gray-600">
            <thead className="bg-gray-100 text-gray-700">
              <tr>
                <th className="px-4 py-3 font-bold">Date</th>
                <th className="px-4 py-3 font-bold">Program</th>
                <th className="px-4 py-3 font-bold">Activity Type</th>
                <th className="px-4 py-3 font-bold">Hours</th>
                <th className="px-4 py-3 font-bold">Beneficiaries</th>
                {/* NEW HEADERS */}
                <th className="px-4 py-3 font-bold">Influenced</th>
                <th className="px-4 py-3 font-bold">Collected (₹)</th>
                <th className="px-4 py-3 font-bold">Evidence</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filteredReports.length > 0 ? (
                filteredReports.map((report) => (
                  <tr key={report.id} className="hover:bg-gray-50">
                    <td className="px-4 py-3 font-medium text-gray-900">{formatDate(report.activityDate)}</td>
                    <td className="px-4 py-3">{report.programName}</td>
                    <td className="px-4 py-3">{report.activityType}</td>
                    <td className="px-4 py-3">{report.totalHours || 0}</td>
                    <td className="px-4 py-3">{report.totalBeneficiaries || 0}</td>
                    
                    {/* NEW DATA CELLS */}
                    <td className="px-4 py-3">{report.influencedContributors || "-"}</td>
                    <td className="px-4 py-3 font-medium text-green-700">
                      {report.totalContributionAmount ? `₹${report.totalContributionAmount}` : "-"}
                    </td>
                    {/* NEW EVIDENCE CELL */}
                    <td className="px-4 py-3">
                      {report.evidenceFile ? (
                        <a 
                          href={`http://localhost:8080/uploads/evidence/${report.evidenceFile}`}
                          // href={`${import.meta.env.VITE_API_URL}/uploads/evidence/${report.evidenceFile}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1 rounded-md bg-blue-50 px-2 py-1 text-xs font-bold text-blue-700 hover:bg-blue-100 transition-colors"
                        >
                          View File
                        </a>
                      ) : (
                        <span className="text-xs text-gray-400 font-medium">None</span>
                      )}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="7" className="py-8 text-center text-gray-500">
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