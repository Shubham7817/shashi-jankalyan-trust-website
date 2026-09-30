// import { useState, useEffect } from "react";
// import { useNavigate } from "react-router-dom";
// import Button from "../ui/Button";
// import useRazorpay from "../../hooks/useRazorpay";
// import { createPaymentOrder, verifyPayment } from "../../services/paymentService";

// const amounts = [500, 1000, 2500, 5000, 10000];

// export default function DonationForm() {
//   const navigate = useNavigate();
//   const { loading, setLoading, loadRazorpay } = useRazorpay();
//   const [selectedAmt, setSelectedAmt] = useState(500);
//   const [customAmt, setCustomAmt] = useState("");
//   const [error, setError] = useState("");
  
//   const [formData, setFormData] = useState({ 
//     name: "", email: "", phone: "", referredBy: "", message: "" 
//   });
  
//   const [volunteers, setVolunteers] = useState([]);

//   // Fetch volunteers on component load
//   useEffect(() => {
//     const fetchVolunteers = async () => {
//       try {
//         // const response = await fetch(`${import.meta.env.VITE_API_URL}/api/payment/volunteers`);
//         const response = await fetch("http://localhost:8080/api/payment/volunteers");
//         if (response.ok) {
//           const data = await response.json();
//           setVolunteers(data);
//         }
//       } catch (err) {
//         console.error("Could not fetch volunteers:", err);
//       }
//     };
//     fetchVolunteers();
//   }, []);

//   const finalAmount = Number(customAmt || selectedAmt);

//   const handleChange = (e) => setFormData((p) => ({ ...p, [e.target.name]: e.target.value }));

//   const validateForm = () => {
//     if (!formData.name.trim()) return "Please enter your name.";
//     if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email.trim())) return "Valid email required.";
//     if (!/^[0-9+\-\s]{10,15}$/.test(formData.phone.trim())) return "Valid phone required.";
//     if (finalAmount < 1 || finalAmount > 500000 || !Number.isInteger(finalAmount)) return "Invalid amount.";
//     return "";
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     const validationErr = validateForm();
//     if (validationErr) return setError(validationErr);
    
//     setError("");
//     try {
//       setLoading(true);
//       if (!(await loadRazorpay())) throw new Error("Failed to load payment gateway.");

//       const order = await createPaymentOrder({ amount: finalAmount, ...formData });
//       if (!order?.success || !order?.orderId) throw new Error(order?.message || "Order creation failed.");

//       const rzp = new window.Razorpay({
//         key: import.meta.env.VITE_RAZORPAY_KEY_ID,
//         amount: order.amount,
//         currency: order.currency,
//         name: "Shashi Jan Kalyan Trust",
//         order_id: order.orderId,
//         prefill: { name: formData.name, email: formData.email, contact: formData.phone },

//         handler: async (res) => {
//           try {
//             setLoading(true);
//             const verified = await verifyPayment({
//               razorpayPaymentId: res.razorpay_payment_id,
//               razorpayOrderId: res.razorpay_order_id,
//               razorpaySignature: res.razorpay_signature,
//             });
            
//             // --- CRITICAL FIX: Pass state to the success page ---
//             if (verified?.success) {

//             let referredByName = "None";
              
//               if (formData.referredBy) {
//                 // Look through the volunteers array you already fetched
//                 const selectedVolunteer = volunteers.find(
//                   (vol) => vol.id.toString() === formData.referredBy.toString()
//                 );
                
//                 if (selectedVolunteer) {
//                   referredByName = selectedVolunteer.name; // Extract just the name
//                 }
//               }

//               navigate("/donation-success", {
//                 state: {
//                   amount: finalAmount,
//                   gatewayTransactionId: res.razorpay_payment_id,
//                   name: formData.name,
//                   email: formData.email,
//                   phone: formData.phone,
//                   // Passing default values for fields not in your current form
//                   city: formData.city, 
//                   state: formData.state,
//                   referredBy : referredByName,
//                   date: new Date().toLocaleDateString("en-GB")
//                 }
//               });
//             } else {
//               navigate("/donation-failed");
//             }
//             // ----------------------------------------------------
            
//           } catch {
//             navigate("/donation-failed");
//           } finally { setLoading(false); }
//         },
//         modal: { ondismiss: () => setLoading(false) }
//       });
//       rzp.open();
//     } catch (err) {
//       setError(err.message || "Payment error. Please try again.");
//       setLoading(false);
//     }
//   };

//   return (
//     <form onSubmit={handleSubmit} className="card p-4 sm:p-6 w-full">
//       <h2 className="text-xl sm:text-2xl font-bold">Choose your support</h2>
      
//       {/* 2 columns on mobile, 3 on slightly larger screens */}
//       <div className="mt-4 grid grid-cols-2 sm:grid-cols-3 gap-2 sm:gap-3">
//         {amounts.map((amt) => (
//           <Button type="button" key={amt} variant={selectedAmt === amt && !customAmt ? "primary" : "outline"}
//             onClick={() => { setSelectedAmt(amt); setCustomAmt(""); setError(""); }}
//             className="text-sm sm:text-base py-2 w-full"
//           >
//             ₹{amt.toLocaleString()}
//           </Button>
//         ))}
//       </div>

//       <h3 className="mt-6 text-lg sm:text-xl font-bold">Custom Amount</h3>
//       <input type="number" min="1" placeholder="Enter amount of your choice" value={customAmt}
//         onChange={(e) => { setCustomAmt(e.target.value); setSelectedAmt(null); setError(""); }}
//         className="mt-3 w-full rounded-xl border p-3 text-sm sm:text-base" />

//       <div className="mt-6 grid gap-3">
//         <input name="name" type="text" value={formData.name} onChange={handleChange} placeholder="Full Name" className="w-full rounded-xl border p-3 text-sm sm:text-base" />
//         <input name="email" type="email" value={formData.email} onChange={handleChange} placeholder="Email Address" className="w-full rounded-xl border p-3 text-sm sm:text-base" />
//         <input name="phone" type="tel" value={formData.phone} onChange={handleChange} placeholder="Phone Number" className="w-full rounded-xl border p-3 text-sm sm:text-base" />
        
//         {/* NEW: City and State side-by-side on desktop, stacked on mobile */}
//         <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
//           <input name="city" type="text" value={formData.city} onChange={handleChange} placeholder="City" className="w-full rounded-xl border p-3 text-sm sm:text-base" />
//           <input name="state" type="text" value={formData.state} onChange={handleChange} placeholder="State" className="w-full rounded-xl border p-3 text-sm sm:text-base" />
//         </div>
        
//         {/* Replaced PAN with Referred By Dropdown */}  
//         <select 
//           name="referredBy" 
//           value={formData.referredBy} 
//           onChange={handleChange} 
//           className="w-full rounded-xl border p-3 text-sm sm:text-base bg-white"
//         >
//           <option value="">Referred by (Optional)</option>
//           {volunteers.map((vol) => (
//             <option key={vol.id} value={vol.id}>
//               {vol.name} ({vol.email} | {vol.phone})
//             </option>
//           ))}
//         </select>

//         <textarea name="message" value={formData.message} onChange={handleChange} placeholder="Message (Optional)" rows="3" className="w-full rounded-xl border p-3 text-sm sm:text-base" />
//       </div>

//       <div className="mt-5 rounded-xl bg-gray-50 p-4">
//         <p className="text-sm text-gray-600">Donation Amount</p>
//         <p className="text-xl sm:text-2xl font-bold">₹{finalAmount.toLocaleString()}</p>
//       </div>

//       {error && <div className="mt-4 rounded-xl bg-red-50 p-3 text-sm sm:text-base text-red-700" role="alert">{error}</div>}

//       <Button type="submit" variant="accent" className="mt-5 w-full py-3 text-sm sm:text-base" disabled={loading}>
//         {loading ? "Preparing Secure Payment..." : "Continue to Payment"}
//       </Button>
//     </form>
//   );
// }





import React from "react";
import { Building2, QrCode } from "lucide-react";
import upiQrCode from "../../assets/image2/upi-qr-code.png"; // Ensure you have a QR code image in your assets folder

export default function DonationForm() {
  return (
    <div className="card p-6 sm:p-8 w-full bg-white rounded-2xl shadow-sm border border-gray-100">
      <div className="text-center mb-8">
        <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">Support Our Cause</h2>
        <p className="text-gray-600">Please make your generous donation directly to our trust account using the details below.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8">
        
        {/* Bank Details Section */}
        <div className="bg-gray-50 p-6 rounded-xl border border-gray-200">
          <div className="flex items-center gap-3 mb-6">
            <div className="bg-green-100 p-2 rounded-full">
              <Building2 className="w-5 h-5 text-green-700" />
            </div>
            <h3 className="font-bold text-lg text-gray-900">Bank Transfer</h3>
          </div>
          
          <div className="space-y-5 text-sm sm:text-base">
            <div>
              <p className="text-gray-500 text-xs uppercase tracking-wider font-semibold mb-1">Account Name</p>
              <p className="font-bold text-gray-900">SHASHI JAN KALYAN TRUST</p>
            </div>
            <div>
              <p className="text-gray-500 text-xs uppercase tracking-wider font-semibold mb-1">Account Number</p>
              <p className="font-bold text-gray-900 font-mono text-lg tracking-wider">00000039231137955</p>
            </div>
            <div>
              <p className="text-gray-500 text-xs uppercase tracking-wider font-semibold mb-1">IFSC Code</p>
              <p className="font-bold text-gray-900 font-mono">SBIN0002914</p>
            </div>
          </div>
        </div>

        {/* QR Code Section */}
        <div className="bg-gray-50 p-6 rounded-xl border border-gray-200 flex flex-col items-center justify-center text-center">
          <div className="flex items-center gap-3 mb-4 w-full justify-center">
            <div className="bg-green-100 p-2 rounded-full">
              <QrCode className="w-5 h-5 text-green-700" />
            </div>
            <h3 className="font-bold text-lg text-gray-900">Scan & Donate</h3>
          </div>
          
          <div className="bg-white p-2 rounded-xl shadow-sm border border-gray-200 mb-3">
            {/* REPLACE THIS DIV WITH YOUR ACTUAL QR CODE IMAGE */}
            <div className="w-40 h-40 bg-gray-100 border-2 border-dashed border-gray-300 flex items-center justify-center rounded-lg">
              {/* <span className="text-gray-400 text-sm font-medium">Add QR Image</span> */}
              
              {/* Uncomment and update this image tag once you save your QR code in the public folder */}
              <img src={upiQrCode} alt="Donate via UPI" className="w-full h-full object-contain" />
            </div>
          </div>
          <p className="text-xs text-gray-500 font-medium">Accepts all UPI apps (GPay, PhonePe, Paytm)</p>
        </div>
      </div>

      <div className="mt-8 bg-green-50 p-4 rounded-xl border border-green-200 text-center">
        <p className="text-sm text-green-800 font-medium">
          After making a payment, please take a screenshot of your transaction and share it via our helpline or email to receive your 80G tax exemption receipt.
        </p>
      </div>
    </div>
  );
}