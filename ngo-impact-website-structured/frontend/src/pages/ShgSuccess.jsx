import React, { useRef, useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { CheckCircle, Download, Loader2 } from "lucide-react";
import html2canvas from "html2canvas-pro";
import { jsPDF } from "jspdf";
import img from "../assets/image2/logo.jpeg";
import img2 from "../assets/image2/signature.png";

export default function ShgSuccess() {
  const location = useLocation();
  const navigate = useNavigate();
  
  const receiptRef = useRef(null);
  const [isDownloading, setIsDownloading] = useState(false);

  useEffect(() => {
    if (!location.state) {
      navigate("/");
    }
  }, [location, navigate]);

  const {
    name = "N/A",
    mobileNumber = "N/A",
    email = "N/A",
    address = "N/A",
    aadhaarNumber = "N/A",
    panNumber = "N/A",
    bankAccountNumber = "N/A",
    ifscCode = "N/A",
    bankName = "N/A",
    referredBy = "Direct",
    date = new Date().toLocaleDateString("en-GB")
  } = location.state || {};

  // Security mask for sensitive IDs on the receipt
  const maskedAadhaar = aadhaarNumber && aadhaarNumber.length >= 4 
    ? `********${aadhaarNumber.slice(-4)}` 
    : "[Aadhaar Redacted]";
    
  const maskedAccount = bankAccountNumber && bankAccountNumber.length >= 4 
    ? `********${bankAccountNumber.slice(-4)}` 
    : bankAccountNumber;

  const handleDownloadReceipt = async () => {
    setIsDownloading(true);
    const element = receiptRef.current;
    
    try {
      const canvas = await html2canvas(element, { 
        scale: 3, 
        useCORS: true,
        logging: false,
        width: 800,
        windowWidth: 800
      });
      
      const imgData = canvas.toDataURL("image/png");
      const pdf = new jsPDF("p", "mm", "a4");
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const margin = 15; 
      const printWidth = pdfWidth - (margin * 2);
      const printHeight = (canvas.height * printWidth) / canvas.width;
      
      pdf.addImage(imgData, "PNG", margin, margin, printWidth, printHeight);
      pdf.save(`SHG_Receipt_${name}_${date}.pdf`);
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
        
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Application Submitted!</h1>
        <p className="mt-2 text-sm sm:text-base text-gray-600">Your Self Help Group (SHG) application has been received successfully.</p>

        {/* ========================================== */}
        {/* 1. VISIBLE UI RECEIPT (Responsive)         */}
        {/* ========================================== */}
        <div className="mt-8 bg-gray-100 p-4 sm:p-8 rounded-xl border border-gray-200 flex justify-center">
          <div className="w-full max-w-3xl bg-white p-5 sm:p-10 font-serif border-2 sm:border-4 border-double border-green-900 text-gray-900 shadow-sm text-left">
            
            {/* Header */}
            <div className="text-center border-b-2 border-green-900 pb-4 mb-4 sm:mb-6">
              <p className="text-xs sm:text-sm font-bold">बिहार सरकार से पंजीकृत 90/2020</p>
              
              <div className="flex items-center justify-center gap-3 sm:gap-4 mt-2 mb-2">
                <img src={img} alt="Trust Logo" className="w-10 h-10 sm:w-14 sm:h-14 object-contain shrink-0" />
                <h1 className="text-2xl sm:text-4xl font-extrabold text-[#0d4a30] leading-none">
                  शशि जन कल्याण ट्रस्ट (NGO)
                </h1>
              </div>

              <p className="text-sm sm:text-lg font-semibold">दिनकर नगर, बरबीघा, शेखपुरा, बिहार 811101</p>
              <p className="text-xs sm:text-sm mt-1 break-words">Email: shashijankalyantrast012345@gmail.com | Helpline: 6203766882</p>
            </div>

            <div className="text-lg sm:text-xl font-bold text-center mb-6 underline underline-offset-4">
              एसएचजी पंजीकरण रसीद (SHG Registration Receipt)
            </div>

            <div className="flex justify-end mb-6 text-sm sm:text-lg gap-2">
              <p><strong>Date (दिनांक):</strong> {date}</p>
            </div>

            <div className="space-y-4 sm:space-y-6 text-sm sm:text-lg leading-relaxed">
              <div className="flex flex-col sm:flex-row sm:items-end border-b border-gray-400 pb-1">
                <span className="font-semibold sm:w-48">आवेदक का नाम (Name):</span>
                <span className="flex-1 sm:px-4 italic">{name}</span>
              </div>
              
              <div className="flex flex-col sm:flex-row gap-4">
                <div className="flex flex-col sm:flex-row sm:items-end border-b border-gray-400 pb-1 flex-1">
                  <span className="font-semibold sm:w-32">मो न (Mobile):</span>
                  <span className="flex-1 sm:px-2 italic">{mobileNumber}</span>
                </div>
                <div className="flex flex-col sm:flex-row sm:items-end border-b border-gray-400 pb-1 flex-1">
                  <span className="font-semibold sm:w-32">ईमेल (Email):</span>
                  <span className="flex-1 sm:px-2 italic break-all">{email}</span>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row sm:items-end border-b border-gray-400 pb-1">
                <span className="font-semibold sm:w-32">पता (Address):</span>
                <span className="flex-1 sm:px-4 italic">{address}</span>
              </div>

              <div className="flex flex-col sm:flex-row gap-4">
                <div className="flex flex-col sm:flex-row sm:items-end border-b border-gray-400 pb-1 flex-1">
                  <span className="font-semibold sm:w-40">आधार न (Aadhaar):</span>
                  <span className="flex-1 sm:px-2 italic">{maskedAadhaar}</span>
                </div>
                <div className="flex flex-col sm:flex-row sm:items-end border-b border-gray-400 pb-1 flex-1">
                  <span className="font-semibold sm:w-32">पैन न (PAN):</span>
                  <span className="flex-1 sm:px-2 italic uppercase">{panNumber}</span>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-4">
                <div className="flex flex-col sm:flex-row sm:items-end border-b border-gray-400 pb-1 flex-1">
                  <span className="font-semibold sm:w-40">बैंक का नाम (Bank):</span>
                  <span className="flex-1 sm:px-2 italic">{bankName}</span>
                </div>
                <div className="flex flex-col sm:flex-row sm:items-end border-b border-gray-400 pb-1 flex-[1.5]">
                  <span className="font-semibold sm:w-32">खाता न (A/C):</span>
                  <span className="flex-1 sm:px-2 italic">{maskedAccount}</span>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row sm:items-end border-b border-gray-400 pb-1">
                <span className="font-semibold sm:w-48">प्रेरित (Referred By):</span>
                <span className="flex-1 sm:px-4 italic">{referredBy}</span>
              </div>

              <p className="text-xs sm:text-sm text-gray-700 mt-4 font-medium">
                * यह एक इलेक्ट्रॉनिक रसीद है। दस्तावेज़ सत्यापन के बाद ही सदस्यता की पुष्टि की जाएगी।
              </p>
              
              <div className="mt-12 sm:mt-20 flex flex-col sm:flex-row items-center justify-between px-2 sm:px-10 gap-10 sm:gap-0">
                <div className="text-center flex flex-col items-center">
                  <div className="border-b border-gray-800 w-48 mb-2 text-center overflow-hidden whitespace-nowrap text-ellipsis">{name}</div>
                  <p className="font-bold">आवेदक का हस्ताक्षर</p>
                  <p className="text-sm">(Applicant Signature)</p>
                </div>
                <div className="text-center flex flex-col items-center">
                  <div className="border-b border-gray-800 w-48 mb-2 flex justify-center">
                    <img src={img2} alt="Authorized Signature" className="h-16 object-contain" />
                  </div>
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
          
          <Link to="/" className="w-full sm:w-auto rounded-xl border border-gray-300 px-8 py-3 font-bold text-gray-700 transition hover:bg-gray-50 shadow-sm">
            Back to Home
          </Link>
        </div>
      </div>

      {/* ========================================== */}
      {/* 2. HIDDEN PDF TEMPLATE (Strict Width)      */}
      {/* ========================================== */}
      <div className="fixed top-0 left-0 w-0 h-0 overflow-hidden pointer-events-none z-[-1]">
        <div 
          ref={receiptRef} 
          style={{ width: "800px", minWidth: "800px", maxWidth: "800px", padding: "40px", backgroundColor: "#ffffff", boxSizing: "border-box" }}
          className="font-serif border-4 border-double border-green-900 text-gray-900 text-left"
        >
          <div style={{ textAlign: "center", borderBottom: "2px solid #14532d", paddingBottom: "16px", marginBottom: "24px" }}>
            <p style={{ fontSize: "14px", fontWeight: "bold", margin: 0 }}>बिहार सरकार से पंजीकृत 90/2020</p>
            
            <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "16px", margin: "8px 0" }}>
              <img src={img} alt="Trust Logo" style={{ width: "56px", height: "56px", objectFit: "contain" }} />
              <h1 style={{ fontSize: "36px", fontWeight: "800", color: "#0d4a30", margin: 0 }}>शशि जन कल्याण ट्रस्ट (NGO)</h1>
            </div>

            <p style={{ fontSize: "18px", fontWeight: "600", margin: 0 }}>दिनकर नगर, बरबीघा, शेखपुरा, बिहार 811101</p>
            <p style={{ fontSize: "14px", margin: "4px 0 0 0" }}>Email: shashijankalyantrast012345@gmail.com | Helpline: 6203766882</p>
          </div>

          <div style={{ fontSize: "20px", fontWeight: "bold", textAlign: "center", marginBottom: "32px", textDecoration: "underline", textUnderlineOffset: "4px" }}>
            एसएचजी पंजीकरण रसीद (SHG Registration Receipt)
          </div>

          <div style={{ textAlign: "right", marginBottom: "24px", fontSize: "18px" }}>
            <strong>Date (दिनांक):</strong> {date}
          </div>

          <table style={{ width: "100%", fontSize: "18px", borderCollapse: "separate", borderSpacing: "0 16px" }}>
            <tbody>
              <tr>
                <td colSpan={2}>
                  <div style={{ display: "flex", alignItems: "flex-end", borderBottom: "1px solid #9ca3af", paddingBottom: "4px" }}>
                    <span style={{ fontWeight: "600", width: "200px", flexShrink: 0 }}>आवेदक का नाम (Name):</span>
                    <span style={{ flex: 1, paddingLeft: "16px", fontStyle: "italic" }}>{name}</span>
                  </div>
                </td>
              </tr>
              
              <tr>
                <td style={{ width: "50%", paddingRight: "16px" }}>
                  <div style={{ display: "flex", alignItems: "flex-end", borderBottom: "1px solid #9ca3af", paddingBottom: "4px" }}>
                    <span style={{ fontWeight: "600", width: "110px", flexShrink: 0 }}>मो न (Mobile):</span>
                    <span style={{ flex: 1, paddingLeft: "8px", fontStyle: "italic" }}>{mobileNumber}</span>
                  </div>
                </td>
                <td style={{ width: "50%", paddingLeft: "16px" }}>
                  <div style={{ display: "flex", alignItems: "flex-end", borderBottom: "1px solid #9ca3af", paddingBottom: "4px" }}>
                    <span style={{ fontWeight: "600", width: "100px", flexShrink: 0 }}>ईमेल (Email):</span>
                    <span style={{ flex: 1, paddingLeft: "8px", fontStyle: "italic" }}>{email}</span>
                  </div>
                </td>
              </tr>

              <tr>
                <td colSpan={2}>
                  <div style={{ display: "flex", alignItems: "flex-end", borderBottom: "1px solid #9ca3af", paddingBottom: "4px" }}>
                    <span style={{ fontWeight: "600", width: "120px", flexShrink: 0 }}>पता (Address):</span>
                    <span style={{ flex: 1, paddingLeft: "16px", fontStyle: "italic" }}>{address}</span>
                  </div>
                </td>
              </tr>

              <tr>
                <td style={{ width: "50%", paddingRight: "16px" }}>
                  <div style={{ display: "flex", alignItems: "flex-end", borderBottom: "1px solid #9ca3af", paddingBottom: "4px" }}>
                    <span style={{ fontWeight: "600", width: "140px", flexShrink: 0 }}>आधार न (Aadhaar):</span>
                    <span style={{ flex: 1, paddingLeft: "8px", fontStyle: "italic" }}>{maskedAadhaar}</span>
                  </div>
                </td>
                <td style={{ width: "50%", paddingLeft: "16px" }}>
                  <div style={{ display: "flex", alignItems: "flex-end", borderBottom: "1px solid #9ca3af", paddingBottom: "4px" }}>
                    <span style={{ fontWeight: "600", width: "100px", flexShrink: 0 }}>पैन न (PAN):</span>
                    <span style={{ flex: 1, paddingLeft: "8px", fontStyle: "italic", textTransform: "uppercase" }}>{panNumber}</span>
                  </div>
                </td>
              </tr>

              <tr>
                <td style={{ width: "50%", paddingRight: "16px" }}>
                  <div style={{ display: "flex", alignItems: "flex-end", borderBottom: "1px solid #9ca3af", paddingBottom: "4px" }}>
                    <span style={{ fontWeight: "600", width: "140px", flexShrink: 0 }}>बैंक का नाम (Bank):</span>
                    <span style={{ flex: 1, paddingLeft: "8px", fontStyle: "italic" }}>{bankName}</span>
                  </div>
                </td>
                <td style={{ width: "50%", paddingLeft: "16px" }}>
                  <div style={{ display: "flex", alignItems: "flex-end", borderBottom: "1px solid #9ca3af", paddingBottom: "4px" }}>
                    <span style={{ fontWeight: "600", width: "110px", flexShrink: 0 }}>खाता न (A/C):</span>
                    <span style={{ flex: 1, paddingLeft: "8px", fontStyle: "italic" }}>{maskedAccount}</span>
                  </div>
                </td>
              </tr>

              <tr>
                <td colSpan={2}>
                  <div style={{ display: "flex", alignItems: "flex-end", borderBottom: "1px solid #9ca3af", paddingBottom: "4px" }}>
                    <span style={{ fontWeight: "600", width: "160px", flexShrink: 0 }}>प्रेरित (Referred By):</span>
                    <span style={{ flex: 1, paddingLeft: "16px", fontStyle: "italic" }}>{referredBy}</span>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>

          <p style={{ fontSize: "14px", color: "#374151", marginTop: "16px", fontWeight: "500" }}>
            * यह एक इलेक्ट्रॉनिक रसीद है। दस्तावेज़ सत्यापन के बाद ही सदस्यता की पुष्टि की जाएगी।
          </p>

          <table style={{ width: "100%", marginTop: "80px", fontSize: "16px" }}>
            <tbody>
              <tr>
                <td style={{ width: "50%", textAlign: "center", verticalAlign: "bottom" }}>
                  <div style={{ width: "200px", margin: "0 auto", borderBottom: "1px solid #1f2937", paddingBottom: "8px", marginBottom: "8px", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                    {name}
                  </div>
                  <p style={{ fontWeight: "bold", margin: 0 }}>आवेदक का हस्ताक्षर</p>
                  <p style={{ fontSize: "14px", margin: 0 }}>(Applicant Signature)</p>
                </td>
                <td style={{ width: "50%", textAlign: "center", verticalAlign: "bottom" }}>
                  <div style={{ width: "200px", margin: "0 auto", borderBottom: "1px solid #1f2937", paddingBottom: "8px", marginBottom: "8px", display: "flex", justifyContent: "center" }}>
                    <img src={img2} alt="Authorized Signature" style={{ height: "64px", objectFit: "contain" }} />
                  </div>
                  <p style={{ fontWeight: "bold", margin: 0 }}>स्टाप का हस्ताक्षर</p>
                  <p style={{ fontSize: "14px", margin: 0 }}>(Authorized Signatory)</p>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </main>
  );
}