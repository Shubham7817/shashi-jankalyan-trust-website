import React, { useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { CheckCircle, Heart, ArrowRight } from "lucide-react";
import Button from "../components/ui/Button"; // Adjust path to your Button component

export default function VolunteerSuccess() {
  const location = useLocation();
  const navigate = useNavigate();
  const { name, transactionId } = location.state || {};

  // If someone tries to access this page directly without paying, send them home
  useEffect(() => {
    if (!transactionId) {
      navigate("/");
    }
  }, [transactionId, navigate]);

  if (!transactionId) return null;

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
          <p className="text-gray-600 mb-6 leading-relaxed">
            Thank you for joining Shashi Jan Kalyan Trust. Your passion, skills, and dedication will help us make a real difference in the community. We are thrilled to have you with us.
          </p>
          
          <div className="bg-gray-50 rounded-2xl p-4 mb-8 border border-gray-200 shadow-inner">
            <p className="text-xs text-gray-500 uppercase tracking-wider font-bold mb-1">Payment Reference</p>
            <p className="font-mono font-bold text-gray-900 text-lg">{transactionId}</p>
          </div>

          <Button 
            onClick={() => navigate('/')} 
            className="w-full bg-[#0d4a30] hover:bg-green-900 text-white font-bold py-4 rounded-xl flex items-center justify-center gap-2 shadow-md transition-colors"
          >
            Return to Homepage <ArrowRight className="h-5 w-5" />
          </Button>
        </div>
      </div>
    </div>
  );
}