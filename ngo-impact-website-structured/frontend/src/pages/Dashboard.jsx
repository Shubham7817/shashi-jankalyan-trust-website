import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import WorkReportForm from "./WorkReportForm"; 
import MyReportsView from "./MyReportsView";

import {
  Menu, X, Search, Bell, ChevronDown, LayoutDashboard,
  PlusCircle, FileText, User, Folder, BookOpen, MessageSquare,
  Award, Settings, HelpCircle, MapPin, CheckCircle, Users,
  Clock, ArrowRight
} from "lucide-react";

export default function Dashboard() {
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [dashboardData, setDashboardData] = useState(null);
  const [activeView, setActiveView] = useState("overview"); 
  const [refreshKey, setRefreshKey] = useState(0);

  // Fetch data from Spring Boot Backend
  useEffect(() => {
    const volunteerId = sessionStorage.getItem("volunteerId");
    
    // Security check: If no ID in session, boot them back to home
    if (!volunteerId) {
      navigate("/");
      return;
    }

    const fetchDashboard = async () => {
      try {
        const response = await fetch(`${import.meta.env.VITE_API_URL}/api/dashboard/${volunteerId}`);
        // const response = await fetch(`http://localhost:8080/api/dashboard/${volunteerId}`);
        if (response.ok) {
          const data = await response.json();
          setDashboardData(data);
        } else {
          console.error("Failed to fetch dashboard data");
        }
      } catch (error) {
        console.error("Error connecting to backend", error);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboard();
  }, [navigate, refreshKey]);

  // Sidebar Navigation Links
  const navLinks = [
    { name: "Dashboard", icon: LayoutDashboard },
    { name: "Update Today's Work", icon: PlusCircle }
  ];

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center bg-gray-50">
        <div className="h-12 w-12 animate-spin rounded-full border-4 border-green-700 border-t-transparent"></div>
      </div>
    );
  }

  // Fallback data prevents crashes if the database is empty or the connection fails
  const data = dashboardData;
  const { profile, workSummary, recentActivity } = data;

  // Helper to format dates to "18 Sep 2026"
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-GB', {
      day: '2-digit', month: 'short', year: 'numeric'
    });
  };

  // Helper for Status Badge Colors
  const getStatusBadge = (status) => {
    switch (status) {
      case "Approved": return "bg-green-100 text-green-700";
      case "Under Review": return "bg-yellow-100 text-yellow-700";
      case "Needs Correction": return "bg-red-100 text-red-700";
      default: return "bg-gray-100 text-gray-700";
    }
  };

  return (
    <div className="flex min-h-screen bg-gray-50 font-sans">
      
      {/* 1. SIDEBAR */}
      <aside className={`fixed inset-y-0 left-0 z-50 w-64 transform bg-[#0d4a30] text-white transition-transform duration-300 ease-in-out lg:static lg:translate-x-0 ${sidebarOpen ? "translate-x-0" : "-translate-x-full"}`}>
        <div className="flex h-20 items-center justify-between px-6">
          <div className="font-serif text-xl font-bold text-white tracking-wide">
            {profile ? `Welcome, ${profile.fullName.split(' ')[0]}` : "Welcome!"}
          </div>
          <button onClick={() => setSidebarOpen(false)} className="lg:hidden">
            <X className="h-6 w-6 text-gray-300" />
          </button>
        </div>
        <nav className="mt-4 flex flex-col space-y-1 px-4">
          {navLinks.map((link) => {
            // Determine if this link should be highlighted as active
            const isActive = 
              (link.name === "Dashboard" && activeView === "overview") || 
              (link.name === "Update Today's Work" && activeView === "reportForm");

            return (
              <button
                key={link.name}
                onClick={() => {
                  if (link.name === "Update Today's Work") setActiveView("reportForm");
                  else if (link.name === "Dashboard") setActiveView("overview");
                  setSidebarOpen(false); // Close sidebar on mobile after clicking
                }}
                className={`flex items-center gap-3 rounded-lg px-4 py-3 text-sm font-medium transition-colors ${
                  isActive ? "bg-white/10 text-white" : "text-gray-300 hover:bg-white/5 hover:text-white"
                }`}
              >
                <link.icon className="h-5 w-5" />
                {link.name}
              </button>
            );
          })}
        </nav>
      </aside>

{/* Main Content Area */}
      <main className="flex-1 overflow-y-auto">
        
        {/* NEW: Mobile Header Bar (Hidden on large screens) */}
        <div className="flex items-center justify-between bg-[#0d4a30] p-4 text-white shadow-md lg:hidden">
          <div className="font-serif text-lg font-bold tracking-wide">
            {profile ? `Welcome, ${profile.fullName.split(' ')[0]}` : "Dashboard"}
          </div>
          <button 
            onClick={() => setSidebarOpen(true)} 
            className="rounded p-1 hover:bg-white/20 transition-colors"
          >
            <Menu className="h-6 w-6" />
          </button>
        </div>

        {/* 3. CONDITIONAL DASHBOARD CONTENT */}
        
        {activeView === "overview" && (
          <div className="p-6 lg:p-8 max-w-7xl mx-auto space-y-6">
            
            {/* Welcome Banner */}
            <div className="relative overflow-hidden rounded-2xl bg-emerald-50 p-6 md:p-8 shadow-sm border border-emerald-100">
              <div className="flex flex-col md:flex-row gap-6 items-start md:items-center">
                <img 
                  src={`https://ui-avatars.com/api/?name=${profile.fullName}&background=0D8ABC&color=fff&size=128`}
                  alt="Avatar" 
                  className="h-24 w-24 rounded-full border-4 border-white shadow-md"
                />
                <div className="flex-1">
                  <h1 className="text-2xl font-bold text-gray-900 mb-1">Welcome back, {profile.fullName}!</h1>
                  <p className="text-gray-600 mb-4 text-sm">Thank you for being a changemaker. Your efforts make a real difference.</p>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-2 gap-x-8 text-sm max-w-lg">
                    <div className="flex justify-between sm:justify-start sm:gap-4">Member ID: <span className="font-semibold text-gray-900">{profile.memberId}</span></div>
                    <div className="flex justify-between sm:justify-start sm:gap-4">Role: <span className="font-semibold text-gray-900">{profile.volunteerRole}</span></div>
                    <div className="flex justify-between sm:justify-start sm:gap-4">Since: <span className="font-semibold text-gray-900">{formatDate(profile.joiningDate)}</span></div>
                  </div>
                </div>
                <div className="hidden lg:block w-72 border-l border-emerald-200 pl-6 italic text-emerald-800 text-sm">
                  "Small actions, when multiplied by millions of people, can transform the world."
                  <div className="text-right mt-2 font-semibold">— Unknown</div>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              
              {/* Location Card */}
              <div className="rounded-xl bg-white p-6 shadow-sm border border-gray-100 lg:col-span-1">
                <div className="flex items-center gap-2 mb-5">
                  <div className="rounded-full bg-green-100 p-2"><MapPin className="h-5 w-5 text-green-700" /></div>
                  <h2 className="text-lg font-bold text-gray-900">Your Location</h2>
                </div>
                <div className="space-y-3 text-sm">
                  <div className="flex justify-between"><span className="text-gray-500">State</span> <span className="font-semibold text-gray-900">{profile.state}</span></div>
                  <div className="flex justify-between"><span className="text-gray-500">District</span> <span className="font-semibold text-gray-900">{profile.district}</span></div>
                  <div className="flex justify-between"><span className="text-gray-500">Block</span> <span className="font-semibold text-gray-900">{profile.block}</span></div>
                  <div className="flex justify-between"><span className="text-gray-500">Panchayat</span> <span className="font-semibold text-gray-900">{profile.panchayat}</span></div>
                </div>
              </div>

              {/* Work Summary */}
              <div className="rounded-xl bg-white p-6 shadow-sm border border-gray-100 lg:col-span-2">
                <div className="flex items-center justify-between mb-5">
                  <div className="flex items-center gap-2">
                    <div className="rounded-full bg-green-100 p-2"><LayoutDashboard className="h-5 w-5 text-green-700" /></div>
                    <h2 className="text-lg font-bold text-gray-900">Your Work Summary</h2>
                  </div>
                </div>
                
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="rounded-lg bg-green-50 p-4 text-center border border-green-100">
                    <CheckCircle className="h-6 w-6 text-green-600 mx-auto mb-2" />
                    <div className="text-2xl font-bold text-green-900">{workSummary.activitiesCompleted}</div>
                    <div className="text-xs font-medium text-green-700 uppercase mt-1">Activities<br/>Completed</div>
                  </div>
                  <div className="rounded-lg bg-blue-50 p-4 text-center border border-blue-100">
                    <Users className="h-6 w-6 text-blue-600 mx-auto mb-2" />
                    <div className="text-2xl font-bold text-blue-900">{workSummary.beneficiariesReached}</div>
                    <div className="text-xs font-medium text-blue-700 uppercase mt-1">Beneficiaries<br/>Reached</div>
                  </div>
                  <div className="rounded-lg bg-yellow-50 p-4 text-center border border-yellow-100">
                    <Clock className="h-6 w-6 text-yellow-600 mx-auto mb-2" />
                    <div className="text-2xl font-bold text-yellow-900">{workSummary.hoursContributed}</div>
                    <div className="text-xs font-medium text-yellow-700 uppercase mt-1">Hours<br/>Contributed</div>
                  </div>
                  <div className="rounded-lg bg-purple-50 p-4 text-center border border-purple-100">
                    <FileText className="h-6 w-6 text-purple-600 mx-auto mb-2" />
                    <div className="text-2xl font-bold text-purple-900">{workSummary.reportsSubmitted}</div>
                    <div className="text-xs font-medium text-purple-700 uppercase mt-1">Reports<br/>Submitted</div>
                  </div>
                </div>
              </div>

            </div>

            <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
              
              {/* Current Projects */}
              <div className="rounded-xl bg-white p-6 shadow-sm border border-gray-100">
                <div className="flex items-center gap-2 mb-5">
                  <div className="rounded-full bg-green-100 p-2"><Folder className="h-5 w-5 text-green-700" /></div>
                  <h2 className="text-lg font-bold text-gray-900">Current Projects</h2>
                </div>
                
                <div className="space-y-4">
                  <div className="flex items-start justify-between border-b border-gray-100 pb-4 last:border-0 last:pb-0">
                    <div className="space-y-3 w-full">
                      <div className="flex items-center justify-between">
                        <h3 className="font-bold text-gray-900">Rural Education Program</h3>
                        <span className="rounded bg-green-100 px-2 py-1 text-xs font-semibold text-green-800">Active</span>
                      </div>
                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div><span className="text-gray-500 block mb-1">Funding Source</span><span className="font-medium">CSR</span></div>
                        <div><span className="text-gray-500 block mb-1">Project ID</span><span className="font-medium">CSR-2026-001</span></div>
                        <div className="col-span-2"><span className="text-gray-500 mr-3">Your Role:</span><span className="font-medium">Field Volunteer</span></div>
                      </div>
                      <div className="flex justify-end">
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Recent Activity */}
              <div className="rounded-xl bg-white p-6 shadow-sm border border-gray-100">
                <div className="flex items-center justify-between mb-5">
                  <div className="flex items-center gap-2">
                    <div className="rounded-full bg-green-100 p-2"><Clock className="h-5 w-5 text-green-700" /></div>
                    <h2 className="text-lg font-bold text-gray-900">Recent Activity</h2>
                  </div>
                  <button 
                    onClick={() => setActiveView("myReports")} 
                    className="text-sm font-bold text-green-700 hover:underline"
                  >
                    View All
                  </button>
                </div>

                <div className="space-y-4 overflow-x-auto">
                  <table className="w-full text-left text-sm text-gray-600 min-w-100">
                    <tbody>
                      {recentActivity.length > 0 ? recentActivity.map((activity, idx) => (
                        <tr key={idx} className="border-b border-gray-50 last:border-0">
                          <td className="py-3 whitespace-nowrap">{formatDate(activity.activityDate)}</td>
                          <td className="py-3 font-medium text-gray-900">{activity.type}</td>
                          <td className="py-3 text-right">
                          </td>
                        </tr>
                      )) : (
                        <tr>
                          <td colSpan="3" className="py-4 text-center text-gray-500">No recent activity found.</td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>

            </div>
            
          </div>
        )}

        {activeView === "reportForm" && (
          <div className="p-6 lg:p-8 max-w-7xl mx-auto">
            <WorkReportForm 
              profile={profile} 
              onBack={() => setActiveView("overview")} 
              onSuccess={() => {
                setRefreshKey((prev) => prev + 1);
                setActiveView("overview");
              }}
            />
          </div>
        )}

        {activeView === "myReports" && (
          <div className="p-6 lg:p-8 max-w-7xl mx-auto">
            <MyReportsView 
              onBack={() => setActiveView("overview")} 
            />
          </div>
        )}

      </main>
    </div>
  );
}