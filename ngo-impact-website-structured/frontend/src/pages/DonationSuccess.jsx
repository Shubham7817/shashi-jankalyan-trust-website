import React, { useRef, useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { CheckCircle, Download, Loader2 } from "lucide-react";
import html2canvas from "html2canvas-pro";
import {jsPDF} from "jspdf";

export default function DonationSuccess() {
  const location = useLocation();
  const navigate = useNavigate();
  const receiptRef = useRef(null);
  const [isDownloading, setIsDownloading] = useState(false);

  // Redirect to home if accessed without donation data (e.g., page refresh)
  useEffect(() => {
    if (!location.state) {
      navigate("/");
    }
  }, [location, navigate]);

  // Extract data passed from the frontend verification logic
  const {
    amount = 0,
    gatewayTransactionId = "N/A",
    name = "Anonymous",
    phone = "N/A",
    city = "N/A",
    state = "N/A",
    referredBy = "None", // Added referredBy
    date = new Date().toLocaleDateString("en-GB")
  } = location.state || {};

const handleDownloadReceipt = async () => {
    setIsDownloading(true);
    const element = receiptRef.current;
    
    try {
      // 1. Capture the HTML as an image
      const canvas = await html2canvas(element, { 
        scale: 2, 
        useCORS: true,
        logging: false 
      });
      const imgData = canvas.toDataURL("image/png");
      
      // 2. Create the PDF (Note the use of jsPDF here)
      const pdf = new jsPDF("p", "mm", "a4");
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = (canvas.height * pdfWidth) / canvas.width;
      
      pdf.addImage(imgData, "PNG", 0, 0, pdfWidth, pdfHeight);
      pdf.save(`Receipt_${gatewayTransactionId}.pdf`);
    } catch (error) {
      console.error("Error generating PDF:", error);
      alert("Failed to download receipt. Please try again.");
    } finally {
      setIsDownloading(false);
    }
  };

  if (!location.state) return null;

  return (
    <main className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="mx-auto max-w-4xl text-center bg-white p-6 sm:p-8 rounded-2xl shadow-sm border border-gray-200">
        <CheckCircle className="mx-auto text-green-600 mb-4" size={70} />
        
        <h1 className="text-3xl font-bold text-gray-900">Thank You for Your Support</h1>
        <p className="mt-2 text-gray-600">Your payment has been verified successfully.</p>

        <div className="mt-10 overflow-x-auto bg-gray-100 p-4 sm:p-8 rounded-xl border border-gray-200 flex justify-center custom-scrollbar">
          <div 
            ref={receiptRef} 
            className="w-200 min-w-200 bg-white p-10 font-serif border-4 border-double border-green-900 text-gray-900 shadow-md text-left"
          >
            {/* Header */}
            <div className="text-center border-b-2 border-green-900 pb-4 mb-6">
              <p className="text-sm font-bold">बिहार सरकार से पंजीकृत 90/2020 | 80G: AAZTS4557P25PT02 | UniqueId: BR/2020/0272012</p>
              <h1 className="text-4xl font-extrabold text-[#0d4a30] mt-2 mb-1">शशि जन कल्याण ट्रस्ट (NGO)</h1>
              <p className="text-lg font-semibold">दिनकर नगर, बरबीघा, शेखपुरा, बिहार 811101</p>
              <p className="text-sm mt-1">Email: info@shashijankalyantrust.org | Helpline: 6203766882</p>
            </div>

            {/* Receipt Body */}
            <div className="text-xl font-bold text-center mb-8 underline underline-offset-4">
              दान का रसीद (Donation Receipt)
            </div>

            <div className="flex justify-between mb-6 text-lg">
              <p><strong>Transaction ID:</strong> {gatewayTransactionId}</p>
              <p><strong>Date (दिनांक):</strong> {date}</p>
            </div>

            <div className="space-y-6 text-lg leading-loose">
              {/* Name Row */}
              <div className="flex items-end border-b border-gray-400 pb-1">
                <span className="font-semibold w-64">दान देने वालो का नाम (Name):</span>
                <span className="flex-1 px-4 italic">{name}</span>
              </div>
              
              {/* City/State Row */}
              <div className="flex gap-4">
                <div className="flex items-end border-b border-gray-400 pb-1 flex-1">
                  <span className="font-semibold w-32">शहर (City):</span>
                  <span className="flex-1 px-2 italic">{city}</span>
                </div>
                <div className="flex items-end border-b border-gray-400 pb-1 flex-1">
                  <span className="font-semibold w-32">राज्य (State):</span>
                  <span className="flex-1 px-2 italic">{state}</span>
                </div>
              </div>

              {/* Mobile and Referred By Row */}
              <div className="flex gap-4">
                <div className="flex items-end border-b border-gray-400 pb-1 flex-1">
                  <span className="font-semibold w-40">मो न (Mobile):</span>
                  <span className="flex-1 px-2 italic">{phone}</span>
                </div>
                <div className="flex items-end border-b border-gray-400 pb-1 flex-1">
                  <span className="font-semibold w-48">प्रेरित (Referred By):</span>
                  <span className="flex-1 px-2 italic">{referredBy}</span>
                </div>
              </div>

              {/* Amount Row */}
              <div className="flex items-end border-b border-gray-400 pb-1">
                <span className="font-semibold w-48">दान की राशी (Amount):</span>
                <span className="flex-1 px-4 italic font-bold">Rs. {Number(amount).toLocaleString()}/-</span>
              </div>

              <p className="text-sm text-gray-700 mt-4 font-medium">
                * दान की राशी वापस नहीं दिया जायेगा, किन्तु उसके एवज में बाल विवाह, दहेज़ प्रथा, भ्रूण हत्या पर जागरूकता अभियान चलाया जाता है।
              </p>
            </div>

            {/* Signatures */}
            <div className="mt-20 flex justify-between px-10">
              <div className="text-center">
                <div className="border-b border-gray-800 w-48 mb-2">{name}</div>
                <p className="font-bold">दान दाता का हस्ताक्षर</p>
                <p className="text-sm">(Donor Signature)</p>
              </div>
              <div className="text-center">
                <div className="border-b border-gray-800 w-48 mb-2">Shashi Jan Kalyan Trust</div>
                <p className="font-bold">स्टाप का हस्ताक्षर</p>
                <p className="text-sm">(Authorized Signatory)</p>
              </div>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4">
          <button
            onClick={handleDownloadReceipt}
            disabled={isDownloading}
            className="flex items-center gap-2 rounded-xl bg-[#0d4a30] px-8 py-3 font-bold text-white transition hover:bg-green-900 disabled:opacity-70 disabled:cursor-not-allowed shadow-sm"
          >
            {isDownloading ? <Loader2 className="h-5 w-5 animate-spin" /> : <Download className="h-5 w-5" />}
            {isDownloading ? "Generating PDF..." : "Download Receipt"}
          </button>
          
          <Link
            to="/"
            className="rounded-xl border border-gray-300 px-8 py-3 font-bold text-gray-700 transition hover:bg-gray-50 shadow-sm"
          >
            Back to Home
          </Link>
        </div>

      </div>
    </main>
  );
}