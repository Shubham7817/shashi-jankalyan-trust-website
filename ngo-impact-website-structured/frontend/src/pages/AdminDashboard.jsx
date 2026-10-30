import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { 
  ShieldCheck, LogOut, Clock, FileText, Image as ImageIcon, 
  Users, CreditCard, BookOpen, Search, Calendar, FilterX,
  Briefcase, Eye, X, CheckCircle, MapPin, User 
} from "lucide-react";

export default function AdminDashboard() {
  const navigate = useNavigate();
  const [allReports, setAllReports] = useState([]);
  const [shgData, setShgData] = useState([]);
  const [volunteerData, setVolunteerData] = useState([]); 
  const [loading, setLoading] = useState(true);
  
  const [activeTab, setActiveTab] = useState("reports");

  const [filterDate, setFilterDate] = useState("");
  const [filterName, setFilterName] = useState("");
  const [filteredReports, setFilteredReports] = useState([]);
  const [filteredShgData, setFilteredShgData] = useState([]);
  const [filteredVolunteerData, setFilteredVolunteerData] = useState([]); 

  const [selectedVol, setSelectedVol] = useState(null);

  useEffect(() => {
    const currentUsername = sessionStorage.getItem("username");
    
    if (currentUsername !== "admin") {
      navigate("/"); 
      return;
    }

    const fetchAdminData = async () => {
      try {
        const baseUrl = import.meta.env.VITE_API_URL || 'http://localhost:8080';
        
        const [reportsRes, shgRes, volRes] = await Promise.all([
          fetch(`${baseUrl}/api/admin/reports`),
          fetch(`${baseUrl}/api/shg/all`),
          fetch(`${baseUrl}/api/volunteers/all`)
        ]);

        if (reportsRes.ok) {
          const rData = await reportsRes.json();
          setAllReports(rData);
          setFilteredReports(rData); 
        }
        if (shgRes.ok) {
          const sData = await shgRes.json();
          setShgData(sData);
          setFilteredShgData(sData); 
        }
        if (volRes.ok) {
          const vData = await volRes.json();
          setVolunteerData(vData);
          setFilteredVolunteerData(vData);
        }
      } catch (error) {
        console.error("Failed to fetch admin data", error);
      } finally {
        setLoading(false);
      }
    };

    fetchAdminData();
  }, [navigate]);


const applyFilter = () => {
  const searchName = filterName.trim().toLowerCase();

  // Filter Work Reports
  setFilteredReports(
    allReports.filter((report) => {
      const matchesDate =
        !filterDate || report.activityDate === filterDate;

      const matchesName =
        !searchName ||
        [report.user?.username, report.beneficiaryName]
          .some((name) =>
            name?.toLowerCase().includes(searchName)
          );

      return matchesDate && matchesName;
    })
  );

  // Filter SHG Applications
  setFilteredShgData(
    shgData.filter((shg) => {
      const matchesDate =
        !filterDate ||
        shg.createdAt?.startsWith(filterDate);

      const matchesName =
        !searchName ||
        shg.name?.toLowerCase().includes(searchName);

      return matchesDate && matchesName;
    })
  );

  // Filter Volunteer Registrations
  setFilteredVolunteerData(
    volunteerData.filter((volunteer) => {
      const matchesDate =
        !filterDate ||
        volunteer.createdAt?.startsWith(filterDate);

      const matchesName =
        !searchName ||
        volunteer.name?.toLowerCase().includes(searchName);

      return matchesDate && matchesName;
    })
  );
};

const clearFilter = () => {
  setFilterDate("");
  setFilterName("");

  setFilteredReports(allReports);
  setFilteredShgData(shgData);
  setFilteredVolunteerData(volunteerData);
};


  const formatDate = (dateString) => {
    if (!dateString) return "-";
    return new Date(dateString).toLocaleDateString('en-GB', {
      day: '2-digit', month: 'short', year: 'numeric'
    });
  };

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
            <Clock className="h-4 w-4" /> Update Work Details
          </button>
          
          <button 
            onClick={() => setActiveTab("shg")}
            className={`flex items-center gap-2 rounded-lg px-5 py-2.5 text-sm font-bold transition-colors ${
              activeTab === "shg" 
              ? "bg-[#0d4a30] text-white shadow-sm" 
              : "bg-white text-gray-600 hover:bg-gray-100 border border-gray-200"
            }`}
          >
            <Users className="h-4 w-4" /> Join SHG Applications
          </button>

          <button 
            onClick={() => setActiveTab("volunteers")}
            className={`flex items-center gap-2 rounded-lg px-5 py-2.5 text-sm font-bold transition-colors ${
              activeTab === "volunteers" 
              ? "bg-[#0d4a30] text-white shadow-sm" 
              : "bg-white text-gray-600 hover:bg-gray-100 border border-gray-200"
            }`}
          >
            <Briefcase className="h-4 w-4" /> Volunteer Registrations
          </button>
        </div>

        {/* FILTER TOOLBAR */}
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
          
          {filterDate && (
            <button 
              onClick={clearFilter}
              className="flex items-center gap-2 rounded-md border border-red-200 bg-red-50 px-4 py-2 text-sm font-bold text-red-600 hover:bg-red-100"
            >
              <FilterX className="h-4 w-4" /> Clear
            </button>
          )}
        </div>

        {/* TABLES AREA */}
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
                    <th className="px-4 py-3 font-bold">Payment Status</th>
                    <th className="px-4 py-3 font-bold text-center">Documents</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
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
                      <td className="px-4 py-3">{renderSpecificDetails(report)}</td>
                      <td className="px-4 py-3">
                        {report.amount > 0 ? (
                          <div className="flex flex-col gap-1">
                            <span className={`inline-flex w-fit items-center rounded-full px-2 py-1 text-xs font-semibold ${report.paymentStatus === 'COMPLETED' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}`}>
                              ₹{report.amount} ({report.paymentStatus || 'PENDING'})
                            </span>
                            {report.paymentId && (
                              <span className="font-mono text-xs text-gray-500 truncate max-w-[120px]" title={report.paymentId}>
                                {report.paymentId}
                              </span>
                            )}
                          </div>
                        ) : (
                          <span className="text-xs text-gray-400 font-medium bg-gray-100 px-2 py-1 rounded-md">₹0 / Free</span>
                        )}
                      </td>
                      <td className="px-4 py-3 flex gap-2 justify-center">
                        {report.evidenceUrl && (
                          <a href={report.evidenceUrl} target="_blank" rel="noopener noreferrer" className="inline-flex rounded-md bg-blue-50 p-1.5 text-blue-700 hover:bg-blue-100"><FileText className="h-4 w-4" /></a>
                        )}
                        {report.beneficiaryPhotoUrl && (
                          <a href={report.beneficiaryPhotoUrl} target="_blank" rel="noopener noreferrer" className="inline-flex rounded-md bg-emerald-50 p-1.5 text-emerald-700 hover:bg-emerald-100"><ImageIcon className="h-4 w-4" /></a>
                        )}
                        {!report.evidenceUrl && !report.beneficiaryPhotoUrl && <span className="text-xs text-gray-400 font-medium mt-1">None</span>}
                      </td>
                    </tr>
                  )) : (
                    <tr><td colSpan="10" className="py-12 text-center text-gray-500 font-medium">No reports found for this date.</td></tr>
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
                              ? shg.aadhaarNumber 
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
                        <a href={shg.selfPhotoUrl} target="_blank" rel="noopener noreferrer" className="inline-flex items-center justify-center rounded-md bg-purple-50 p-1.5 text-purple-700 hover:bg-purple-100"><ImageIcon className="h-4 w-4" /></a>
                        <a href={shg.aadhaarPhotoUrl} target="_blank" rel="noopener noreferrer" className="inline-flex items-center justify-center rounded-md bg-orange-50 p-1.5 text-orange-700 hover:bg-orange-100"><CreditCard className="h-4 w-4" /></a>
                        <a href={shg.panPhotoUrl} target="_blank" rel="noopener noreferrer" className="inline-flex items-center justify-center rounded-md bg-yellow-50 p-1.5 text-yellow-700 hover:bg-yellow-100"><FileText className="h-4 w-4" /></a>
                        <a href={shg.passbookPhotoUrl} target="_blank" rel="noopener noreferrer" className="inline-flex items-center justify-center rounded-md bg-green-50 p-1.5 text-green-700 hover:bg-green-100"><BookOpen className="h-4 w-4" /></a>
                      </td>
                    </tr>
                  )) : (
                    <tr><td colSpan="10" className="py-12 text-center text-gray-500 font-medium">No SHG applications found for this date.</td></tr>
                  )}
                </tbody>
              </table>
            )}

            {/* VOLUNTEERS VIEW */}
            {activeTab === "volunteers" && (
              <table className="w-full text-left text-sm text-gray-600 whitespace-nowrap">
                <thead className="bg-[#0d4a30]/10 text-[#0d4a30] border-b border-[#0d4a30]/20">
                  <tr>
                    <th className="px-4 py-4 font-bold">Registered On</th>
                    <th className="px-4 py-4 font-bold">Name & DOB</th>
                    <th className="px-4 py-4 font-bold">Contact</th>
                    <th className="px-4 py-4 font-bold">Location</th>
                    <th className="px-4 py-4 font-bold">Education</th>
                    <th className="px-4 py-4 font-bold">Payment</th>
                    <th className="px-4 py-4 font-bold text-center">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {filteredVolunteerData.length > 0 ? filteredVolunteerData.map((vol) => (
                    <tr key={vol.id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-4 py-4 font-medium text-gray-900">{formatDate(vol.createdAt)}</td>
                      <td className="px-4 py-4">
                        <div className="font-bold text-gray-900">{vol.name}</div>
                        <div className="text-xs text-gray-500">{vol.dob} ({vol.ageGroup})</div>
                      </td>
                      <td className="px-4 py-4">
                        <div className="font-medium text-gray-900">{vol.phone}</div>
                        <div className="text-xs text-gray-500">{vol.email}</div>
                      </td>
                      <td className="px-4 py-4">
                        <div className="font-medium text-gray-900">{vol.district}</div>
                        <div className="text-xs text-gray-500">{vol.state}</div>
                      </td>
                      <td className="px-4 py-4 font-medium">{vol.highestEducation}</td>
                      <td className="px-4 py-4">
                        <span className="inline-flex items-center gap-1 bg-green-50 text-green-700 text-xs font-bold px-2 py-1 rounded-md border border-green-200">
                          <CheckCircle className="w-3 h-3" /> Paid ₹{vol.amountPaid}
                        </span>
                      </td>
                      <td className="px-4 py-4 text-center">
                        <button 
                          onClick={() => setSelectedVol(vol)}
                          className="inline-flex items-center gap-1 text-xs font-bold bg-[#0d4a30] text-white px-3 py-2 rounded-lg hover:bg-green-900 transition-colors"
                        >
                          <Eye className="w-4 h-4" /> View Full Profile
                        </button>
                      </td>
                    </tr>
                  )) : (
                    <tr><td colSpan="7" className="py-12 text-center text-gray-500 font-medium">No volunteer registrations found.</td></tr>
                  )}
                </tbody>
              </table>
            )}

          </div>
        </div>
      </main>

      {/* FULL VOLUNTEER PROFILE MODAL */}
      {selectedVol && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm">
          <div className="bg-white rounded-3xl w-full max-w-3xl max-h-[90vh] overflow-y-auto shadow-2xl">
            <div className="sticky top-0 bg-[#0d4a30] px-6 py-5 flex justify-between items-center text-white z-10">
              <h3 className="text-xl font-bold font-serif tracking-wide">Volunteer Profile: {selectedVol.name}</h3>
              <button onClick={() => setSelectedVol(null)} className="p-1 hover:bg-green-800 rounded-full transition-colors"><X className="w-6 h-6" /></button>
            </div>
            
            <div className="p-8 space-y-8">
              {/* Personal Info */}
              <div>
                <h4 className="flex items-center gap-2 font-bold text-gray-800 border-b pb-2 mb-4"><User className="w-5 h-5 text-[#0d4a30]"/> Personal Details</h4>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-y-6 gap-x-4 text-sm">
                  <div><p className="text-gray-500 text-xs uppercase font-bold tracking-wider mb-1">Father's Name</p><p className="font-medium text-gray-900 text-base">{selectedVol.fatherName}</p></div>
                  <div><p className="text-gray-500 text-xs uppercase font-bold tracking-wider mb-1">Date of Birth</p><p className="font-medium text-gray-900 text-base">{selectedVol.dob}</p></div>
                  <div><p className="text-gray-500 text-xs uppercase font-bold tracking-wider mb-1">Age Group</p><p className="font-medium text-gray-900 text-base">{selectedVol.ageGroup}</p></div>
                  <div><p className="text-gray-500 text-xs uppercase font-bold tracking-wider mb-1">Email</p><p className="font-medium text-gray-900 text-base">{selectedVol.email}</p></div>
                  <div><p className="text-gray-500 text-xs uppercase font-bold tracking-wider mb-1">Phone</p><p className="font-medium text-gray-900 text-base">{selectedVol.phone}</p></div>
                  <div><p className="text-gray-500 text-xs uppercase font-bold tracking-wider mb-1">WhatsApp</p><p className="font-medium text-gray-900 text-base">{selectedVol.whatsapp || 'N/A'}</p></div>
                </div>
              </div>

              {/* Location */}
              <div>
                <h4 className="flex items-center gap-2 font-bold text-gray-800 border-b pb-2 mb-4"><MapPin className="w-5 h-5 text-[#0d4a30]"/> Location & Address</h4>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-y-6 gap-x-4 text-sm mb-5">
                  <div><p className="text-gray-500 text-xs uppercase font-bold tracking-wider mb-1">State</p><p className="font-medium text-gray-900 text-base">{selectedVol.state}</p></div>
                  <div><p className="text-gray-500 text-xs uppercase font-bold tracking-wider mb-1">District</p><p className="font-medium text-gray-900 text-base">{selectedVol.district}</p></div>
                  <div><p className="text-gray-500 text-xs uppercase font-bold tracking-wider mb-1">Block</p><p className="font-medium text-gray-900 text-base">{selectedVol.block}</p></div>
                  <div><p className="text-gray-500 text-xs uppercase font-bold tracking-wider mb-1">Panchayat</p><p className="font-medium text-gray-900 text-base">{selectedVol.panchayat}</p></div>
                </div>
                <div className="text-sm bg-gray-50 p-4 rounded-xl border border-gray-100">
                  <p className="text-gray-500 text-xs uppercase font-bold tracking-wider mb-1">Full Address & Pincode</p>
                  <p className="font-medium text-gray-900">{selectedVol.address || 'N/A'} - <span className="font-bold">{selectedVol.pincode}</span></p>
                </div>
              </div>

              {/* Education & Skills */}
              <div>
                <h4 className="flex items-center gap-2 font-bold text-gray-800 border-b pb-2 mb-4"><BookOpen className="w-5 h-5 text-[#0d4a30]"/> Education & Skills</h4>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-y-6 gap-x-4 text-sm mb-6">
                  <div><p className="text-gray-500 text-xs uppercase font-bold tracking-wider mb-1">Highest Education</p><p className="font-medium text-gray-900 text-base">{selectedVol.highestEducation}</p></div>
                  <div><p className="text-gray-500 text-xs uppercase font-bold tracking-wider mb-1">English Level</p><p className="font-medium text-gray-900 text-base">{selectedVol.englishProficiency || 'N/A'}</p></div>
                  <div><p className="text-gray-500 text-xs uppercase font-bold tracking-wider mb-1">Hindi Level</p><p className="font-medium text-gray-900 text-base">{selectedVol.hindiProficiency || 'N/A'}</p></div>
                  <div className="col-span-2"><p className="text-gray-500 text-xs uppercase font-bold tracking-wider mb-1">Languages Known</p><p className="font-medium text-gray-900 text-base">{selectedVol.languagesKnown} {selectedVol.otherLanguage && `, ${selectedVol.otherLanguage}`}</p></div>
                </div>
                
                {selectedVol.educationDocUrl && (
                  <a href={selectedVol.educationDocUrl} target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 bg-[#0d4a30] hover:bg-green-900 text-white font-bold px-6 py-3 rounded-xl shadow-sm transition-colors text-sm">
                    <FileText className="w-4 h-4" /> View Educational Certificate
                  </a>
                )}
              </div>

              {/* Motivation */}
              <div>
                <h4 className="flex items-center gap-2 font-bold text-gray-800 border-b pb-2 mb-4"><Users className="w-5 h-5 text-[#0d4a30]"/> Motivation</h4>
                <div className="bg-gray-50 p-5 rounded-2xl border border-gray-200">
                  <p className="text-base text-gray-800 italic leading-relaxed">"{selectedVol.motivation || 'No specific motivation provided.'}"</p>
                </div>
              </div>

              {/* Payment Receipt Info */}
              <div className="bg-emerald-50 p-6 rounded-2xl border border-emerald-200 text-sm">
                <h4 className="text-emerald-900 font-black text-lg mb-3">Payment Record</h4>
                <div className="grid grid-cols-2 gap-4">
                  <div><p className="text-emerald-700 text-xs uppercase font-bold mb-1">Transaction ID</p><p className="font-mono font-bold text-emerald-900">{selectedVol.paymentId}</p></div>
                  <div><p className="text-emerald-700 text-xs uppercase font-bold mb-1">Amount Paid</p><p className="font-bold text-emerald-900 text-lg">₹{selectedVol.amountPaid} <span className="text-sm font-medium">({selectedVol.paymentStatus})</span></p></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}