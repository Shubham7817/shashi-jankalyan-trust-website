import React, { useState, useEffect } from "react";
import { ArrowLeft, Search, Calendar, FilterX, FileText, Image as ImageIcon, Pencil } from "lucide-react";

export default function MyReportsView({ onBack, onEdit }) {
  const [reports, setReports] = useState([]);
  const [filteredReports, setFilteredReports] = useState([]);
  const [loading, setLoading] = useState(true);
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

  // Helper to dynamically render specific fields based on activity type
// Helper to dynamically render specific fields based on activity type
// Helper to dynamically render specific fields based on activity type
const renderSpecificDetails = (report) => {
    const details = [];
    if (report.diseaseType) details.push(`Disease: ${report.diseaseType}`);
    if (report.loanAmount) details.push(`Loan: ₹${report.loanAmount}`);
    if (report.companyName) details.push(`Company: ${report.companyName}`);
    if (report.trainingType) details.push(`Training: ${report.trainingType}`);
    if (report.category) details.push(`Category: ${report.category}`);
    if (report.classOrGrade) details.push(`Class: ${report.classOrGrade}`);
    if (report.schoolName) details.push(`School: ${report.schoolName}`);
    if (report.amount) details.push(`Collected: ₹${report.amount}`);
    
    if (report.activityType === "SHG" && report.shgName) {
      details.push(`SHG: ${report.shgName}`);
      details.push(`Total Members: ${report.totalMembers || 0}`);
      
      try {
        if (report.additionalMembersDetails) {
          const members = JSON.parse(report.additionalMembersDetails);
          if (Array.isArray(members)) {
            members.forEach((m, idx) => {
              if (m.name) {
                let memberInfo = `M${idx + 1}: ${m.name}`;
                if (m.position) memberInfo += ` (${m.position})`; // NEW: Appends the position
                if (m.husbandName) memberInfo += ` (W/o ${m.husbandName})`;
                if (m.mobile) memberInfo += ` | Ph: ${m.mobile}`;
                if (m.address) memberInfo += ` | Add: ${m.address}`;
                
                details.push(memberInfo);
              }
            });
          }
        }
      } catch (e) {
        details.push(`Members Data: ${report.additionalMembersDetails}`);
      }
    }

    return details.length > 0 ? (
      <div className="flex flex-col gap-1 text-xs">
        {details.map((detail, idx) => (
          <span key={idx} className="bg-gray-50 px-2 py-1.5 rounded text-gray-700 font-medium border border-gray-200 leading-relaxed">
            {detail}
          </span>
        ))}
      </div>
    ) : "-";
  };

  // Helper to neatly format relatives
  const renderRelatives = (report) => {
    const relatives = [];
    if (report.fatherName) relatives.push(`F: ${report.fatherName}`);
    if (report.motherName) relatives.push(`M: ${report.motherName}`);
    if (report.husbandName) relatives.push(`H: ${report.husbandName}`);
    
    return relatives.length > 0 ? (
      <div className="flex flex-col gap-0.5 text-xs text-gray-600">
        {relatives.map((rel, idx) => <span key={idx}>{rel}</span>)}
      </div>
    ) : "-";
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
                <th className="px-4 py-3 font-bold">Activity Type</th>
                <th className="px-4 py-3 font-bold">Primary Name</th>
                <th className="px-4 py-3 font-bold">Relatives</th>
                <th className="px-4 py-3 font-bold">Contact & ID</th>
                <th className="px-4 py-3 font-bold">Demographics</th>
                {/* <th className="px-4 py-3 font-bold">Location</th> */}
                <th className="px-4 py-3 font-bold">Activity Specifics</th>
                <th className="px-4 py-3 font-bold">Payment Status</th>
                <th className="px-4 py-3 font-bold">Documents</th>
                <th className="px-4 py-3 font-bold text-center">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filteredReports.length > 0 ? (
                filteredReports.map((report) => (
                  <tr key={report.id} className="hover:bg-gray-50 align-top">
                    <td className="px-4 py-3 font-medium text-gray-900">{formatDate(report.activityDate)}</td>
                    <td className="px-4 py-3">
                      <span className="bg-emerald-50 text-emerald-700 px-2 py-1 rounded-md font-semibold border border-emerald-100">
                        {report.activityType}
                      </span>
                    </td>
                    
                    <td className="px-4 py-3 font-medium text-gray-900">{report.beneficiaryName || "-"}</td>
                    
                    <td className="px-4 py-3">{renderRelatives(report)}</td>
                    
                    <td className="px-4 py-3">
                      <div className="flex flex-col gap-0.5">
                        <span>{report.mobileNumber || "-"}</span>
                        <span className="font-mono text-xs text-gray-500">
                          {report.aadhaarNumber && report.aadhaarNumber.length >= 4 
                            ? report.aadhaarNumber
                            : (report.aadhaarNumber || "")}
                        </span>
                      </div>
                    </td>

                    <td className="px-4 py-3">
                      <div className="flex flex-col gap-0.5 text-xs">
                        {report.age && <span>Age: {report.age}</span>}
                        {report.dob && <span>DOB: {formatDate(report.dob)}</span>}
                        {!report.age && !report.dob && "-"}
                      </div>
                    </td>

                    {/* <td className="px-4 py-3">
                      <div className="flex flex-col gap-0.5 text-xs text-gray-600 truncate max-w-[150px]" title={[report.village, report.panchayat, report.block].filter(Boolean).join(", ")}>
                        {report.village && <span>V: {report.village}</span>}
                        {report.panchayat && <span>P: {report.panchayat}</span>}
                        {report.block && <span>B: {report.block}</span>}
                        {!report.village && !report.panchayat && !report.block && "-"}
                      </div>
                    </td> */}

                    {/* Dynamic column that absorbs all the specific extra fields */}
                    <td className="px-4 py-3">
                      {renderSpecificDetails(report)}
                    </td>

                    <td className="px-4 py-3">
                      {report.amount > 0 ? (
                        <div className="flex flex-col gap-1">
                          <span className={`inline-flex w-fit items-center rounded-full px-2 py-1 text-xs font-semibold ${report.paymentStatus === 'COMPLETED' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}`}>
                            Paid ₹{report.amount}
                          </span>
                          {report.paymentId && (
                            <span className="font-mono text-[10px] text-gray-500">Txn: {report.paymentId}</span>
                          )}
                        </div>
                      ) : (
                        <span className="text-xs text-gray-500 font-medium">N/A</span>
                      )}
                    </td>
                    
                    <td className="px-4 py-3 flex gap-2">
                      {report.evidenceUrl ? (
                        <a 
                          href={report.evidenceUrl} target="_blank" rel="noopener noreferrer" title="View Report Evidence"
                          className="inline-flex items-center justify-center rounded-md bg-blue-50 p-1.5 text-blue-700 hover:bg-blue-100"
                        ><FileText className="h-4 w-4" /></a>
                      ) : null}
                      
                      {report.beneficiaryPhotoUrl ? (
                        <a 
                          href={report.beneficiaryPhotoUrl} target="_blank" rel="noopener noreferrer" title="View Beneficiary Photo"
                          className="inline-flex items-center justify-center rounded-md bg-emerald-50 p-1.5 text-emerald-700 hover:bg-emerald-100"
                        ><ImageIcon className="h-4 w-4" /></a>
                      ) : null}

                      {!report.evidenceUrl && !report.beneficiaryPhotoUrl && (
                        <span className="text-xs text-gray-400 font-medium mt-1">None</span>
                      )}
                    </td>

                    <td className="px-4 py-3 text-center">
                      <button 
                        onClick={() => onEdit && onEdit(report)}
                        className="inline-flex items-center justify-center rounded-full p-2 text-blue-600 hover:bg-blue-50 hover:text-blue-800 transition-colors"
                        title="Edit Report"
                      >
                        <Pencil className="h-4 w-4" />
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="10" className="py-12 text-center text-gray-500">
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