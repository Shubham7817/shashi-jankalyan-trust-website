import React, { useRef, useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { CheckCircle, Download, Loader2 } from "lucide-react";
import html2canvas from "html2canvas-pro";
import { jsPDF } from "jspdf";

export default function DonationSuccess() {
  const location = useLocation();
  const navigate = useNavigate();
  
  // Ref for the hidden PDF template
  const receiptRef = useRef(null);
  const [isDownloading, setIsDownloading] = useState(false);

  useEffect(() => {
    if (!location.state) {
      navigate("/");
    }
  }, [location, navigate]);

  const {
    amount = 0,
    gatewayTransactionId = "N/A",
    name = "Anonymous",
    email = "N/A",
    phone = "N/A",
    city = "N/A",
    state = "N/A",
    referredBy = "None",
    date = new Date().toLocaleDateString("en-GB")
  } = location.state || {};

  const handleDownloadReceipt = async () => {
    setIsDownloading(true);
    const element = receiptRef.current;
    
    try {
      // Pass strict dimensions to html2canvas to guarantee desktop formatting
      const canvas = await html2canvas(element, { 
        scale: 3, // Increased scale for crisper text resolution
        useCORS: true,
        logging: false,
        width: 800,
        windowWidth: 800
      });
      
      const imgData = canvas.toDataURL("image/png");
      
      // Create PDF and add margins so it looks like a professional document
      const pdf = new jsPDF("p", "mm", "a4");
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const margin = 15; // 15mm margin on all sides
      const printWidth = pdfWidth - (margin * 2);
      const printHeight = (canvas.height * printWidth) / canvas.width;
      
      pdf.addImage(imgData, "PNG", margin, margin, printWidth, printHeight);
      pdf.save(`Receipt_${name}_${date}_${gatewayTransactionId}.pdf`);
    } catch (error) {
      console.error("Error generating PDF:", error);
      alert("Failed to download receipt. Please try again.");
    } finally {
      setIsDownloading(false);
    }
  };

  if (!location.state) return null;

  return (
    <main className="min-h-screen bg-gray-50 py-8 sm:py-12 px-4">
      <div className="mx-auto max-w-4xl text-center bg-white p-6 sm:p-8 rounded-2xl shadow-sm border border-gray-200">
        <CheckCircle className="mx-auto text-green-600 mb-4" size={60} />
        
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Thank You for Your Support</h1>
        <p className="mt-2 text-sm sm:text-base text-gray-600">Your payment has been verified successfully.</p>

        {/* ========================================== */}
        {/* 1. VISIBLE UI RECEIPT (Fully Responsive) */}
        {/* ========================================== */}
        <div className="mt-8 bg-gray-100 p-4 sm:p-8 rounded-xl border border-gray-200 flex justify-center">
          <div className="w-full max-w-3xl bg-white p-5 sm:p-10 font-serif border-2 sm:border-4 border-double border-green-900 text-gray-900 shadow-sm text-left">
            
            {/* Header */}
            <div className="text-center border-b-2 border-green-900 pb-4 mb-4 sm:mb-6">
              <p className="text-xs sm:text-sm font-bold">बिहार सरकार से पंजीकृत 90/2020 | 80G: AAZTS4557P25PT02</p>
              <h1 className="text-2xl sm:text-4xl font-extrabold text-[#0d4a30] mt-2 mb-1">शशि जन कल्याण ट्रस्ट (NGO)</h1>
              <p className="text-sm sm:text-lg font-semibold">दिनकर नगर, बरबीघा, शेखपुरा, बिहार 811101</p>
              <p className="text-xs sm:text-sm mt-1 break-words">Email: shashijankalyantrast012345@gmail.com | Helpline: 6203766882</p>
            </div>

            <div className="text-lg sm:text-xl font-bold text-center mb-6 underline underline-offset-4">
              दान का रसीद (Donation Receipt)
            </div>

            <div className="flex flex-col sm:flex-row justify-between mb-6 text-sm sm:text-lg gap-2">
              <p><strong>Transaction ID:</strong> <span className="break-all">{gatewayTransactionId}</span></p>
              <p><strong>Date (दिनांक):</strong> {date}</p>
            </div>

            <div className="space-y-4 sm:space-y-6 text-sm sm:text-lg leading-relaxed">
              <div className="flex flex-col sm:flex-row sm:items-end border-b border-gray-400 pb-1">
                <span className="font-semibold sm:w-64">दान देने वालो का नाम (Name):</span>
                <span className="flex-1 sm:px-4 italic">{name}</span>
              </div>
              <div className="flex flex-col sm:flex-row sm:items-end border-b border-gray-400 pb-1">
                <span className="font-semibold sm:w-64">ईमेल (Email):</span>
                <span className="flex-1 sm:px-4 italic break-all">{email}</span>
              </div>
              
              <div className="flex flex-col sm:flex-row gap-4">
                <div className="flex flex-col sm:flex-row sm:items-end border-b border-gray-400 pb-1 flex-1">
                  <span className="font-semibold sm:w-32">शहर (City):</span>
                  <span className="flex-1 sm:px-2 italic">{city}</span>
                </div>
                <div className="flex flex-col sm:flex-row sm:items-end border-b border-gray-400 pb-1 flex-1">
                  <span className="font-semibold sm:w-32">राज्य (State):</span>
                  <span className="flex-1 sm:px-2 italic">{state}</span>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-4">
                <div className="flex flex-col sm:flex-row sm:items-end border-b border-gray-400 pb-1 flex-1">
                  <span className="font-semibold sm:w-40">मो न (Mobile):</span>
                  <span className="flex-1 sm:px-2 italic">{phone}</span>
                </div>
                <div className="flex flex-col sm:flex-row sm:items-end border-b border-gray-400 pb-1 flex-1">
                  <span className="font-semibold sm:w-48">प्रेरित (Referred By):</span>
                  <span className="flex-1 sm:px-2 italic">{referredBy}</span>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row sm:items-end border-b border-gray-400 pb-1">
                <span className="font-semibold sm:w-48">दान की राशी (Amount):</span>
                <span className="flex-1 sm:px-4 italic font-bold">Rs. {Number(amount).toLocaleString()}/-</span>
              </div>

              <p className="text-xs sm:text-sm text-gray-700 mt-4 font-medium">
                * दान की राशी वापस नहीं दिया जायेगा, किन्तु उसके एवज में बाल विवाह, दहेज़ प्रथा, भ्रूण हत्या पर जागरूकता अभियान चलाया जाता है।
              </p>
              {/* RESPONSIVE SIGNATURE BLOCK */}
              <div className="mt-12 sm:mt-20 flex flex-col sm:flex-row items-center justify-between px-2 sm:px-10 gap-10 sm:gap-0">
                <div className="text-center flex flex-col items-center">
                  <div className="border-b border-gray-800 w-48 mb-2 text-center overflow-hidden whitespace-nowrap text-ellipsis">{name}</div>
                  <p className="font-bold">दान दाता का हस्ताक्षर</p>
                  <p className="text-sm">(Donor Signature)</p>
                </div>
                <div className="text-center flex flex-col items-center">
                  <div className="border-b border-gray-800 w-48 mb-2">Shashi Jan Kalyan Trust</div>
                  <p className="font-bold">स्टाप का हस्ताक्षर</p>
                  <p className="text-sm">(Authorized Signatory)</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4">
          <button
            onClick={handleDownloadReceipt}
            disabled={isDownloading}
            className="w-full sm:w-auto flex items-center justify-center gap-2 rounded-xl bg-[#0d4a30] px-8 py-3 font-bold text-white transition hover:bg-green-900 disabled:opacity-70 disabled:cursor-not-allowed shadow-sm"
          >
            {isDownloading ? <Loader2 className="h-5 w-5 animate-spin" /> : <Download className="h-5 w-5" />}
            {isDownloading ? "Generating PDF..." : "Download Receipt"}
          </button>
          
          <Link
            to="/"
            className="w-full sm:w-auto rounded-xl border border-gray-300 px-8 py-3 font-bold text-gray-700 transition hover:bg-gray-50 shadow-sm"
          >
            Back to Home
          </Link>
        </div>
      </div>

      {/* ========================================== */}
      {/* 2. HIDDEN PDF TEMPLATE (Strict Width Enforced) */}
      {/* ========================================== */}
      <div className="fixed top-0 left-0 w-0 h-0 overflow-hidden pointer-events-none z-[-1]">
        <div 
          ref={receiptRef} 
          style={{ width: "800px", minWidth: "800px", maxWidth: "800px", padding: "40px", backgroundColor: "#ffffff" }}
          className="font-serif border-4 border-double border-green-900 text-gray-900 text-left"
        >
            {/* Header */}
            <div className="text-center border-b-2 border-green-900 pb-4 mb-4 sm:mb-6">
              <p className="text-xs sm:text-sm font-bold">बिहार सरकार से पंजीकृत 90/2020 | 80G: AAZTS4557P25PT02</p>
              <h1 className="text-2xl sm:text-4xl font-extrabold text-[#0d4a30] mt-2 mb-1">शशि जन कल्याण ट्रस्ट (NGO)</h1>
              <p className="text-sm sm:text-lg font-semibold">दिनकर नगर, बरबीघा, शेखपुरा, बिहार 811101</p>
              <p className="text-xs sm:text-sm mt-1 break-words">Email: shashijankalyantrast012345@gmail.com | Helpline: 6203766882</p>
            </div>

            <div className="text-lg sm:text-xl font-bold text-center mb-6 underline underline-offset-4">
              दान का रसीद (Donation Receipt)
            </div>

            <div className="flex flex-col sm:flex-row justify-between mb-6 text-sm sm:text-lg gap-2">
              <p><strong>Transaction ID:</strong> <span className="break-all">{gatewayTransactionId}</span></p>
              <p><strong>Date (दिनांक):</strong> {date}</p>
            </div>

            <div className="space-y-4 sm:space-y-6 text-sm sm:text-lg leading-relaxed">
              <div className="flex flex-col sm:flex-row sm:items-end border-b border-gray-400 pb-1">
                <span className="font-semibold sm:w-64">दान देने वालो का नाम (Name):</span>
                <span className="flex-1 sm:px-4 italic">{name}</span>
              </div>
              <div className="flex flex-col sm:flex-row sm:items-end border-b border-gray-400 pb-1">
                <span className="font-semibold sm:w-64">ईमेल (Email):</span>
                <span className="flex-1 sm:px-4 italic break-all">{email}</span>
              </div>
              
              <div className="flex flex-col sm:flex-row gap-4">
                <div className="flex flex-col sm:flex-row sm:items-end border-b border-gray-400 pb-1 flex-1">
                  <span className="font-semibold sm:w-32">शहर (City):</span>
                  <span className="flex-1 sm:px-2 italic">{city}</span>
                </div>
                <div className="flex flex-col sm:flex-row sm:items-end border-b border-gray-400 pb-1 flex-1">
                  <span className="font-semibold sm:w-32">राज्य (State):</span>
                  <span className="flex-1 sm:px-2 italic">{state}</span>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-4">
                <div className="flex flex-col sm:flex-row sm:items-end border-b border-gray-400 pb-1 flex-1">
                  <span className="font-semibold sm:w-40">मो न (Mobile):</span>
                  <span className="flex-1 sm:px-2 italic">{phone}</span>
                </div>
                <div className="flex flex-col sm:flex-row sm:items-end border-b border-gray-400 pb-1 flex-1">
                  <span className="font-semibold sm:w-48">प्रेरित (Referred By):</span>
                  <span className="flex-1 sm:px-2 italic">{referredBy}</span>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row sm:items-end border-b border-gray-400 pb-1">
                <span className="font-semibold sm:w-48">दान की राशी (Amount):</span>
                <span className="flex-1 sm:px-4 italic font-bold">Rs. {Number(amount).toLocaleString()}/-</span>
              </div>

              <p className="text-xs sm:text-sm text-gray-700 mt-4 font-medium">
                * दान की राशी वापस नहीं दिया जायेगा, किन्तु उसके एवज में बाल विवाह, दहेज़ प्रथा, भ्रूण हत्या पर जागरूकता अभियान चलाया जाता है।
              </p>
              <div className="mt-10 flex justify-between px-10">
            <div className="text-center">
              <div className="border-b border-gray-800 w-48 mb-2 text-center overflow-hidden">{name}</div>
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
      </div>
    </main>
  );
}