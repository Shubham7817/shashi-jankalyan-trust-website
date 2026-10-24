import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { ShieldCheck, LogOut, Clock, FileText, Image as ImageIcon, Users, CreditCard, BookOpen } from "lucide-react";

export default function AdminDashboard() {
  const navigate = useNavigate();
  const [allReports, setAllReports] = useState([]);
  const [shgData, setShgData] = useState([]);
  const [loading, setLoading] = useState(true);
  
  const [activeTab, setActiveTab] = useState("reports");

  useEffect(() => {
    const currentUsername = sessionStorage.getItem("username");
    
    if (currentUsername !== "admin") {
      navigate("/"); 
      return;
    }

    const fetchAdminData = async () => {
      try {
        const baseUrl = import.meta.env.VITE_API_URL || 'http://localhost:8080';
        
        const [reportsRes, shgRes] = await Promise.all([
          fetch(`${baseUrl}/api/admin/reports`),
          fetch(`${baseUrl}/api/shg/all`)
        ]);

        if (reportsRes.ok) {
          setAllReports(await reportsRes.json());
        }
        if (shgRes.ok) {
          setShgData(await shgRes.json());
        }
      } catch (error) {
        console.error("Failed to fetch admin data", error);
      } finally {
        setLoading(false);
      }
    };

    fetchAdminData();
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
    
    // Handle the parsed SHG Members JSON array
    if (report.activityType === "SHG" && report.shgName) {
      details.push(`SHG: ${report.shgName}`);
      details.push(`Total Members: ${report.totalMembers || 0}`);
      
      try {
        if (report.additionalMembersDetails) {
          const members = JSON.parse(report.additionalMembersDetails);
          if (Array.isArray(members)) {
            // Append formatted strings for each member including all 4 details
            members.forEach((m, idx) => {
              if (m.name) {
                let memberInfo = `M${idx + 1}: ${m.name}`;
                if (m.husbandName) memberInfo += ` (W/o ${m.husbandName})`;
                if (m.mobile) memberInfo += ` | Ph: ${m.mobile}`;
                if (m.address) memberInfo += ` | Add: ${m.address}`;
                
                details.push(memberInfo);
              }
            });
          }
        }
      } catch (e) {
        // Fallback if the data is old plain text
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
    return (
      <div className="flex h-screen items-center justify-center bg-gray-50">
        <div className="h-12 w-12 animate-spin rounded-full border-4 border-[#0d4a30] border-t-transparent"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="flex h-16 items-center justify-between bg-[#0d4a30] px-6 text-white shadow-md">
        <div className="flex items-center gap-3">
          <ShieldCheck className="h-6 w-6 text-green-400" />
          <h1 className="font-serif text-xl font-bold tracking-wide">Admin Portal</h1>
        </div>
      </header>

      <main className="mx-auto max-w-[95%] lg:max-w-screen-2xl p-6 lg:p-8">
        
        <div className="mb-6 flex gap-4 border-b border-gray-200 pb-4">
          <button 
            onClick={() => setActiveTab("reports")}
            className={`flex items-center gap-2 rounded-lg px-5 py-2.5 text-sm font-bold transition-colors ${
              activeTab === "reports" 
              ? "bg-[#0d4a30] text-white shadow-sm" 
              : "bg-white text-gray-600 hover:bg-gray-100 border border-gray-200"
            }`}
          >
            <Clock className="h-4 w-4" />
            Update Work Details
          </button>
          
          <button 
            onClick={() => setActiveTab("shg")}
            className={`flex items-center gap-2 rounded-lg px-5 py-2.5 text-sm font-bold transition-colors ${
              activeTab === "shg" 
              ? "bg-[#0d4a30] text-white shadow-sm" 
              : "bg-white text-gray-600 hover:bg-gray-100 border border-gray-200"
            }`}
          >
            <Users className="h-4 w-4" />
            Join SHG Applications
          </button>
        </div>

        <div className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">
          <div className="overflow-x-auto pb-2">
            
            {/* WORK REPORTS VIEW */}
            {activeTab === "reports" && (
              <table className="w-full text-left text-sm text-gray-600 whitespace-nowrap">
                <thead className="bg-gray-100 text-gray-700">
                  <tr>
                    <th className="px-4 py-3 font-bold">Activity Date</th>
                    <th className="px-4 py-3 font-bold">Volunteer</th>
                    <th className="px-4 py-3 font-bold">Activity Type</th>
                    <th className="px-4 py-3 font-bold">Primary Name</th>
                    <th className="px-4 py-3 font-bold">Relatives</th>
                    <th className="px-4 py-3 font-bold">Contact & ID</th>
                    <th className="px-4 py-3 font-bold">Demographics</th>
                    {/* <th className="px-4 py-3 font-bold">Location</th> */}
                    <th className="px-4 py-3 font-bold">Activity Specifics</th>
                    <th className="px-4 py-3 font-bold text-center">Documents</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {allReports.length > 0 ? allReports.map((report) => (
                    <tr key={report.id} className="hover:bg-gray-50 align-top">
                      <td className="px-4 py-3 font-medium text-gray-900">{formatDate(report.activityDate)}</td>
                      <td className="px-4 py-3 font-semibold text-blue-700">{report.user?.username || "Unknown"}</td>
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
                              : "----"}
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
                        <div className="flex flex-col gap-0.5 text-xs text-gray-600 truncate max-w-[150px]" title={[report.village, report.panchayat, report.block, report.address].filter(Boolean).join(", ")}>
                          {report.village && <span>V: {report.village}</span>}
                          {report.panchayat && <span>P: {report.panchayat}</span>}
                          {report.block && <span>B: {report.block}</span>}
                          {report.address && <span>A: {report.address}</span>}
                          {!report.village && !report.panchayat && !report.block && !report.address && "-"}
                        </div>
                      </td> */}

                      <td className="px-4 py-3">
                        {renderSpecificDetails(report)}
                      </td>
                      
                      <td className="px-4 py-3 flex gap-2 justify-center">
                        {report.evidenceUrl && (
                          <a href={report.evidenceUrl} target="_blank" rel="noopener noreferrer" title="View Report Evidence" className="inline-flex items-center justify-center rounded-md bg-blue-50 p-1.5 text-blue-700 hover:bg-blue-100">
                            <FileText className="h-4 w-4" />
                          </a>
                        )}
                        {report.beneficiaryPhotoUrl && (
                          <a href={report.beneficiaryPhotoUrl} target="_blank" rel="noopener noreferrer" title="View Beneficiary Photo" className="inline-flex items-center justify-center rounded-md bg-emerald-50 p-1.5 text-emerald-700 hover:bg-emerald-100">
                            <ImageIcon className="h-4 w-4" />
                          </a>
                        )}
                        {!report.evidenceUrl && !report.beneficiaryPhotoUrl && <span className="text-xs text-gray-400 font-medium mt-1">None</span>}
                      </td>
                    </tr>
                  )) : (
                    <tr>
                      <td colSpan="10" className="py-12 text-center text-gray-500 font-medium">No reports have been submitted yet.</td>
                    </tr>
                  )}
                </tbody>
              </table>
            )}

            {/* JOIN SHG VIEW */}
            {activeTab === "shg" && (
              <table className="w-full text-left text-sm text-gray-600 whitespace-nowrap">
                <thead className="bg-emerald-50 text-emerald-900 border-b border-emerald-100">
                  <tr>
                    <th className="px-4 py-4 font-bold">Applied On</th>
                    <th className="px-4 py-4 font-bold">Applicant Name</th>
                    <th className="px-4 py-4 font-bold">Husband Name</th>
                    <th className="px-4 py-4 font-bold">Mobile & Email</th>
                    <th className="px-4 py-4 font-bold">Address</th>
                    <th className="px-4 py-4 font-bold">IDs (Aadhaar / PAN)</th>
                    <th className="px-4 py-4 font-bold">Bank Details</th>
                    <th className="px-4 py-4 font-bold">Referred By</th>
                    <th className="px-4 py-4 font-bold">Payment Status</th>
                    <th className="px-4 py-4 font-bold text-center">Uploaded Docs</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {shgData.length > 0 ? shgData.map((shg) => (
                    <tr key={shg.id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-4 py-4 font-medium text-gray-900">{formatDate(shg.createdAt)}</td>
                      <td className="px-4 py-4 font-bold text-gray-900">{shg.name}</td>
                      <td className="px-4 py-4 font-medium text-gray-900">{shg.husbandName || "-"}</td>
                      <td className="px-4 py-4">
                        <div className="font-medium text-gray-900">{shg.mobileNumber}</div>
                        <div className="text-xs text-gray-500">{shg.email}</div>
                      </td>
                      <td className="px-4 py-4 truncate max-w-[200px]" title={shg.address}>{shg.address}</td>
                      <td className="px-4 py-4">
                        <div className="font-mono text-gray-900">
                           {shg.aadhaarNumber && shg.aadhaarNumber.length >= 4 
                              ? shg.aadhaarNumber
                              : "--"}
                        </div>
                        <div className="font-mono text-xs text-gray-500 uppercase">{shg.panNumber}</div>
                      </td>
                      <td className="px-4 py-4">
                        <div className="font-semibold text-gray-900" title="Account Holder">{shg.accountHolderName}</div>
                        <div className="text-xs text-gray-500" title="Bank Name">{shg.bankName}</div>
                        <div className="font-mono text-xs text-gray-600 mt-1" title="Account Number & IFSC">
                          A/c: {shg.bankAccountNumber}
                        </div>
                        <div className="text-xs text-gray-500" title="Bank Name">IFSC Code: {shg.ifscCode}</div>
                      </td>
                      <td className="px-4 py-4">
                        <span className="inline-flex items-center rounded-full bg-blue-50 px-2 py-1 text-xs font-semibold text-blue-700">
                          {shg.referredBy || "Direct"}
                        </span>
                      </td>
                      <td className="px-4 py-4">
                        <div className={`inline-flex items-center rounded-full px-2 py-1 text-xs font-semibold ${shg.paymentStatus === 'COMPLETED' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}`}>
                          {shg.paymentStatus === 'COMPLETED' ? 'Full Paid (₹350)' : 'Partial (₹200)'}
                        </div>
                      </td>
                      <td className="px-4 py-4 flex gap-2 justify-center">
                        <a href={shg.selfPhotoUrl} target="_blank" rel="noopener noreferrer" title="View Self Photo" className="inline-flex items-center justify-center rounded-md bg-purple-50 p-1.5 text-purple-700 hover:bg-purple-100">
                          <ImageIcon className="h-4 w-4" />
                        </a>
                        <a href={shg.aadhaarPhotoUrl} target="_blank" rel="noopener noreferrer" title="View Aadhaar" className="inline-flex items-center justify-center rounded-md bg-orange-50 p-1.5 text-orange-700 hover:bg-orange-100">
                          <CreditCard className="h-4 w-4" />
                        </a>
                        <a href={shg.panPhotoUrl} target="_blank" rel="noopener noreferrer" title="View PAN" className="inline-flex items-center justify-center rounded-md bg-yellow-50 p-1.5 text-yellow-700 hover:bg-yellow-100">
                          <FileText className="h-4 w-4" />
                        </a>
                        <a href={shg.passbookPhotoUrl} target="_blank" rel="noopener noreferrer" title="View Passbook" className="inline-flex items-center justify-center rounded-md bg-green-50 p-1.5 text-green-700 hover:bg-green-100">
                          <BookOpen className="h-4 w-4" />
                        </a>
                      </td>
                    </tr>
                  )) : (
                    <tr>
                      <td colSpan="10" className="py-12 text-center text-gray-500 font-medium">No SHG applications found.</td>
                    </tr>
                  )}
                </tbody>
              </table>
            )}

          </div>
        </div>
      </main>
    </div>
  );
}