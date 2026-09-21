import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { ShieldCheck, LogOut, Clock } from "lucide-react";

export default function AdminDashboard() {
  const navigate = useNavigate();
  const [allReports, setAllReports] = useState([]);
  const [loading, setLoading] = useState(true);




    useEffect(() => {
    // Check the username instead of the role
    const currentUsername = sessionStorage.getItem("username");
    
    if (currentUsername !== "admin") {
      navigate("/"); // Kick them back to home if they aren't the admin
      return;
    }

    const fetchAllReports = async () => {
        try {
        const response = await fetch(`${import.meta.env.VITE_API_URL}/api/admin/reports`);
        // const response = await fetch(`http://localhost:8080/api/admin/reports`);
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
        {/* <button onClick={handleLogout} className="flex items-center gap-2 rounded-md bg-red-600 px-4 py-2 text-sm font-bold hover:bg-red-700">
          <LogOut className="h-4 w-4" /> Logout
        </button> */}
      </header>

      {/* Admin Main Content */}
      <main className="mx-auto max-w-7xl p-6 lg:p-8">
        <div className="mb-6 flex items-center gap-2">
          <Clock className="h-6 w-6 text-gray-700" />
          <h2 className="text-2xl font-bold text-gray-900">All Volunteer Submissions</h2>
        </div>

        <div className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-gray-600">
              <thead className="bg-gray-100 text-gray-700">
                <tr>
                  <th className="px-6 py-4 font-bold">Date</th>
                  <th className="px-6 py-4 font-bold">Volunteer Username</th>
                  <th className="px-6 py-4 font-bold">Activity Type</th>
                  <th className="px-6 py-4 font-bold">Location</th>
                  <th className="px-6 py-4 font-bold">Hours</th>
                  {/* <th className="px-6 py-4 font-bold">Status</th> */}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {allReports.length > 0 ? allReports.map((report) => (
                  <tr key={report.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4 font-medium text-gray-900">{formatDate(report.activityDate)}</td>
                    <td className="px-6 py-4 font-semibold text-blue-700">{report.user?.username || "Unknown"}</td>
                    <td className="px-6 py-4">{report.activityType}</td>
                    <td className="px-6 py-4">{report.activityLocation}</td>
                    <td className="px-6 py-4 font-medium">{report.totalHours}</td>
                    {/* <td className="px-6 py-4">
                      <select 
                        defaultValue={report.approvalStatus}
                        className="rounded-md border border-gray-300 px-2 py-1 text-xs font-bold focus:border-[#0d4a30] focus:ring-1 focus:ring-[#0d4a30]"
                      >
                        <option value="Under Review">Under Review</option>
                        <option value="Approved">Approve</option>
                        <option value="Needs Correction">Request Correction</option>
                      </select>
                    </td> */}
                  </tr>
                )) : (
                  <tr>
                    <td colSpan="6" className="py-8 text-center text-gray-500">No reports have been submitted yet.</td>
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