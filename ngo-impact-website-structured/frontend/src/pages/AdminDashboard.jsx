import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { 
  ShieldCheck, LogOut, Clock, FileText, Image as ImageIcon, 
  Users, CreditCard, BookOpen, Search, Calendar, FilterX 
} from "lucide-react";

export default function AdminDashboard() {
  const navigate = useNavigate();
  const [allReports, setAllReports] = useState([]);
  const [shgData, setShgData] = useState([]);
  const [volunteerData, setVolunteerData] = useState([]);
  const [loading, setLoading] = useState(true);
  
  const [activeTab, setActiveTab] = useState("reports");
  // NEW: Filter States
  const [filterDate, setFilterDate] = useState("");
  const [filterName, setFilterName] = useState("");
  const [filteredReports, setFilteredReports] = useState([]);
  const [filteredShgData, setFilteredShgData] = useState([]);
  const [filteredVolunteerData, setFilteredVolunteerData] = useState([]);

  useEffect(() => {
    const currentUsername = sessionStorage.getItem("username");
    
    if (currentUsername !== "admin") {
      navigate("/"); 
      return;
    }

    const fetchAdminData = async () => {
      try {
        const baseUrl = import.meta.env.VITE_API_URL || 'http://localhost:8080';
        
        const [reportsRes, shgRes, volunteerRes] = await Promise.all([
          fetch(`${baseUrl}/api/admin/reports`),
          fetch(`${baseUrl}/api/shg/all`),
          fetch(`${baseUrl}/api/volunteers/all`),
        ]);

        if (reportsRes.ok) {
          const rData = await reportsRes.json();
          setAllReports(rData);
          setFilteredReports(rData); // Initialize filtered state
        }
        if (shgRes.ok) {
          const sData = await shgRes.json();
          setShgData(sData);
          setFilteredShgData(sData); // Initialize filtered state
        }
        if (volunteerRes.ok) {
          const vData = await volunteerRes.json();
          const records = Array.isArray(vData) ? vData : [];
          setVolunteerData(records);
          setFilteredVolunteerData(records);
        } else {
          console.error(
            "Failed to fetch volunteer registrations:",
            volunteerRes.status,
            await volunteerRes.text()
          );
        }
      } catch (error) {
        console.error("Failed to fetch admin data", error);
      } finally {
        setLoading(false);
      }
    };

    fetchAdminData();
  }, [navigate]);

  // Filter by date, name, or both. An empty filter matches every record.
  const applyFilter = () => {
    const searchName = filterName.trim().toLowerCase();
    const matchesDate = (value) => {
      if (!filterDate) return true;
      if (!value) return false;
      // Works with YYYY-MM-DD and ISO LocalDateTime strings.
      return String(value).slice(0, 10) === filterDate;
    };
    const matchesName = (...values) => {
      if (!searchName) return true;
      return values.some((value) =>
        String(value ?? "").toLowerCase().includes(searchName)
      );
    };

    setFilteredReports(
      allReports.filter((report) =>
        matchesDate(report.activityDate) &&
        matchesName(report.user?.username)
      )
    );

    setFilteredShgData(
      shgData.filter((shg) =>
        matchesDate(shg.createdAt ?? shg.created_at) &&
        matchesName(shg.name, shg.applicantName)
      )
    );

    setFilteredVolunteerData(
      volunteerData.filter((volunteer) =>
        matchesDate(volunteer.createdAt ?? volunteer.created_at) &&
        matchesName(volunteer.name)
      )
    );
  };

  const clearFilter = () => {
    setFilterDate("");
    setFilterName("");
    setFilteredReports(allReports);
    setFilteredShgData(shgData);
    setFilteredVolunteerData(volunteerData);
  };

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
        
        {/* TABS */}
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
          <button 
            onClick={() => setActiveTab("volunteer")}
            className={`flex items-center gap-2 rounded-lg px-5 py-2.5 text-sm font-bold transition-colors ${
              activeTab === "volunteer" 
              ? "bg-[#0d4a30] text-white shadow-sm" 
              : "bg-white text-gray-600 hover:bg-gray-100 border border-gray-200"
            }`}
          >
            <Users className="h-4 w-4" />
            Volunteer Registrations
          </button>
          {/* <button className="border border-gray-300 px-4 py-2 rounded-lg font-medium">Volunteer Registrations</button> */}
        </div>

        {/* NEW: FILTER TOOLBAR */}
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
          
          <div>
            <label className="mb-1 block text-sm font-semibold text-gray-700">
              Search by Name
            </label>
            <input
              type="text"
              value={filterName}
              onChange={(e) => setFilterName(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") applyFilter();
              }}
              placeholder="Enter a name..."
              className="w-56 rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-green-700 focus:outline-none focus:ring-1 focus:ring-green-700"
            />
          </div>

          <button 
            onClick={applyFilter}
            className="flex items-center gap-2 rounded-md bg-[#0d4a30] px-4 py-2 text-sm font-bold text-white hover:bg-[#0a3a25]"
          >
            <Search className="h-4 w-4" /> Apply Filter
          </button>
          
          {(filterDate || filterName) && (
            <button 
              onClick={clearFilter}
              className="flex items-center gap-2 rounded-md border border-red-200 bg-red-50 px-4 py-2 text-sm font-bold text-red-600 hover:bg-red-100"
            >
              <FilterX className="h-4 w-4" /> Clear
            </button>
          )}
        </div>

        {/* TABLES */}
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
                    <th className="px-4 py-3 font-bold">Location</th>
                    <th className="px-4 py-3 font-bold">Activity Specifics</th>
                    <th className="px-4 py-3 font-bold text-center">Documents</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {/* CHANGED FROM allReports TO filteredReports */}
                  {filteredReports.length > 0 ? filteredReports.map((report) => (
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
                              : "[Aadhaar Number]"}
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

                      <td className="px-4 py-3">
                        <div className="flex flex-col gap-0.5 text-xs text-gray-600 truncate max-w-[150px]" title={[report.village, report.panchayat, report.block, report.address].filter(Boolean).join(", ")}>
                          {report.village && <span>V: {report.village}</span>}
                          {report.panchayat && <span>P: {report.panchayat}</span>}
                          {report.block && <span>B: {report.block}</span>}
                          {report.address && <span>A: {report.address}</span>}
                          {!report.village && !report.panchayat && !report.block && !report.address && "-"}
                        </div>
                      </td>

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
                      <td colSpan="10" className="py-12 text-center text-gray-500 font-medium">No reports found for this date.</td>
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
                  {/* CHANGED FROM shgData TO filteredShgData */}
                  {filteredShgData.length > 0 ? filteredShgData.map((shg) => (
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
                              ?shg.aadhaarNumber 
                              : "[Aadhaar Number]"}
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
                      <td colSpan="10" className="py-12 text-center text-gray-500 font-medium">No SHG applications found for this date.</td>
                    </tr>
                  )}
                </tbody>
              </table>
            )}
            
            
            {/* VOLUNTEER REGISTRATIONS VIEW */}
            {activeTab === "volunteer" && (
              <table className="w-full text-left text-sm text-gray-600 whitespace-nowrap">
                <thead className="bg-emerald-50 text-emerald-900 border-b border-emerald-100">
                  <tr>
                    <th className="px-4 py-4 font-bold">Registered On</th>
                    <th className="px-4 py-4 font-bold">Volunteer Name</th>
                    <th className="px-4 py-4 font-bold">Father's Name</th>
                    <th className="px-4 py-4 font-bold">Contact Details</th>
                    <th className="px-4 py-4 font-bold">Date of Birth / Age</th>
                    <th className="px-4 py-4 font-bold">Address</th>
                    <th className="px-4 py-4 font-bold">Education</th>
                    <th className="px-4 py-4 font-bold">Languages</th>
                    <th className="px-4 py-4 font-bold">Payment</th>
                    <th className="px-4 py-4 font-bold">Motivation</th>
                  </tr>
                </thead>

                <tbody className="divide-y divide-gray-200">
                  {filteredVolunteerData.length > 0 ? (
                    filteredVolunteerData.map((volunteer) => (
                      <tr
                        key={volunteer.id}
                        className="hover:bg-gray-50 align-top"
                      >
                        <td className="px-4 py-4 font-medium text-gray-900">
                          {formatDate(volunteer.createdAt)}
                        </td>

                        <td className="px-4 py-4 font-bold text-gray-900">
                          {volunteer.name || "-"}
                        </td>

                        <td className="px-4 py-4">
                          {volunteer.fatherName || "-"}
                        </td>

                        <td className="px-4 py-4">
                          <div>{volunteer.phone || "-"}</div>
                          <div className="text-xs text-gray-500">
                            {volunteer.email || "-"}
                          </div>
                          <div className="text-xs text-gray-500">
                            WhatsApp: {volunteer.whatsapp || "-"}
                          </div>
                        </td>

                        <td className="px-4 py-4">
                          <div>DOB: {volunteer.dob || "-"}</div>
                          <div className="text-xs text-gray-500">
                            Age group: {volunteer.ageGroup || "-"}
                          </div>
                        </td>

                        <td className="px-4 py-4 whitespace-normal min-w-48">
                          <div>{volunteer.address || "-"}</div>
                          <div className="text-xs text-gray-500">
                            {[volunteer.block, volunteer.panchayat,
                              volunteer.district, volunteer.state,
                              volunteer.pincode]
                              .filter(Boolean)
                              .join(", ")}
                          </div>
                          <div className="text-xs text-gray-500">
                            {volunteer.country || ""}
                          </div>
                        </td>

                        <td className="px-4 py-4">
                          <div>{volunteer.highestEducation || "-"}</div>
                          {volunteer.otherEducation && (
                            <div className="text-xs text-gray-500">
                              {volunteer.otherEducation}
                            </div>
                          )}
                          {volunteer.educationDocUrl && (
                            <a
                              href={volunteer.educationDocUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-blue-600 hover:underline"
                            >
                              View document
                            </a>
                          )}
                        </td>

                        <td className="px-4 py-4">
                          <div>{volunteer.languagesKnown || "-"}</div>
                          {volunteer.otherLanguage && (
                            <div className="text-xs text-gray-500">
                              Other: {volunteer.otherLanguage}
                            </div>
                          )}
                          <div className="text-xs text-gray-500">
                            English: {volunteer.englishProficiency || "-"}
                          </div>
                          <div className="text-xs text-gray-500">
                            Hindi: {volunteer.hindiProficiency || "-"}
                          </div>
                        </td>

                        <td className="px-4 py-4">
                          <div>{volunteer.paymentStatus || "Pending"}</div>
                          <div className="text-xs text-gray-500">
                            Amount: ₹{volunteer.amountPaid ?? 0}
                          </div>
                          {volunteer.paymentId && (
                            <div className="text-xs text-gray-500">
                              ID: {volunteer.paymentId}
                            </div>
                          )}
                        </td>

                        <td className="px-4 py-4 whitespace-normal min-w-48">
                          {volunteer.motivation || "-"}
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td
                        colSpan={10}
                        className="py-12 text-center text-gray-500 font-medium"
                      >
                        No volunteer registrations found for this date.
                      </td>
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