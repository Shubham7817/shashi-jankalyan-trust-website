import React, { useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { CheckCircle, Heart, ArrowRight, ShieldAlert } from "lucide-react";

export default function VolunteerSuccess() {
  const location = useLocation();
  const navigate = useNavigate();
  
  // Extract the data passed from the VolunteerForm navigate() function
  const { name, transactionId, username, password } = location.state || {};

  // Security check: If someone tries to visit this URL directly without submitting the form, send them home
  useEffect(() => {
    if (!transactionId) {
      navigate("/");
    }
  }, [transactionId, navigate]);

  if (!transactionId) return null; // Prevent rendering while redirecting

  return (
    <div className="min-h-screen bg-emerald-50 flex items-center justify-center p-4 py-12">
      <div className="max-w-lg w-full bg-white rounded-3xl shadow-xl overflow-hidden border border-emerald-100 text-center transform transition-all hover:scale-[1.01]">
        
        {/* Header Section */}
        <div className="bg-[#0d4a30] p-10 text-white flex flex-col items-center">
          <div className="bg-white/20 p-3 rounded-full mb-4">
            <CheckCircle className="h-16 w-16 text-green-300" />
          </div>
          <h1 className="text-3xl font-black tracking-wide">Welcome to the Team!</h1>
          <p className="text-green-100 mt-2 font-medium">Your registration is complete.</p>
        </div>

        {/* Content Section */}
        <div className="p-8">
          <Heart className="h-12 w-12 text-rose-500 mx-auto mb-4 animate-pulse" />
          <h2 className="text-2xl font-bold text-gray-800 mb-3">
            Congratulations, {name ? name.split(" ")[0] : "Volunteer"}!
          </h2>
          <p className="text-gray-600 mb-6 leading-relaxed text-sm">
            Thank you for joining Shashi Jan Kalyan Trust. Your passion and dedication will help us make a real difference in the community.
          </p>

          {/* CREDENTIALS BOX - Displayed dynamically from backend generation */}
          {username && password && (
            <div className="mb-6 bg-blue-50/50 p-6 rounded-2xl border border-blue-100 shadow-sm relative overflow-hidden">
              <div className="absolute top-0 left-0 w-1 h-full bg-blue-500"></div>
              <div className="flex items-center gap-2 justify-center mb-3">
                <ShieldAlert className="h-5 w-5 text-blue-600" />
                <h3 className="font-bold text-blue-900 text-lg">Your Login Details</h3>
              </div>
              <p className="text-xs text-blue-700 mb-4 px-4">
                Please take a screenshot or write this down. You will need these to log in to your Volunteer Dashboard.
              </p>
              
              <div className="bg-white p-4 rounded-xl border border-blue-100 font-mono text-left space-y-3 shadow-inner">
                <div>
                  <span className="text-xs text-gray-500 uppercase tracking-wider font-bold block mb-1">Username</span>
                  <span className="text-gray-900 font-bold text-lg">{username}</span>
                </div>
                <div>
                  <span className="text-xs text-gray-500 uppercase tracking-wider font-bold block mb-1">Password</span>
                  <span className="text-gray-900 font-bold text-lg">{password}</span>
                </div>
              </div>
            </div>
          )}
          
          {/* PAYMENT REFERENCE */}
          <div className="bg-gray-50 rounded-2xl p-4 mb-8 border border-gray-200 shadow-inner">
            <p className="text-xs text-gray-500 uppercase tracking-wider font-bold mb-1">Payment Reference</p>
            <p className="font-mono font-bold text-gray-900 text-lg break-all">{transactionId}</p>
          </div>

          <button 
            onClick={() => navigate('/')} 
            className="w-full bg-[#0d4a30] hover:bg-[#0a3a25] text-white font-bold py-4 rounded-xl flex items-center justify-center gap-2 shadow-md transition-colors"
          >
            Return to Homepage <ArrowRight className="h-5 w-5" />
          </button>
        </div>
      </div>
    </div>
  );
}