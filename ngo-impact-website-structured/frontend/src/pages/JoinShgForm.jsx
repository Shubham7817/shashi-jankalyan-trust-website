import React, { useState, useEffect } from 'react';
import { createClient } from '@supabase/supabase-js';
import { useNavigate } from 'react-router-dom';

const supabase = createClient(
  import.meta.env.VITE_SUPABASE_URL,
  import.meta.env.VITE_SUPABASE_ANON_KEY
);

const loadRazorpay = () => {
  return new Promise((resolve) => {
    const script = document.createElement('script');
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });
};

export default function JoinShgForm() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ 
    name: '', mobileNumber: '', email: '', address: '', husbandName: '',
    aadhaarNumber: '', panNumber: '', bankAccountNumber: '', 
    ifscCode: '', accountHolderName: '', bankName: '', referredBy: ''
  });
  
  const [files, setFiles] = useState({ aadhaar: null, pan: null, photo: null, passbook: null });
  const [volunteers, setVolunteers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  
  // NEW STATES FOR PAYMENT LOGIC
  const [paymentAmount, setPaymentAmount] = useState("350");
  const [applicantStatus, setApplicantStatus] = useState("NEW"); // 'NEW', 'PARTIAL', 'COMPLETED'

  useEffect(() => {
    const fetchVolunteers = async () => {
      try {
        const response = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:8080'}/api/payment/volunteers`);
        if (response.ok) {
          setVolunteers(await response.json());
        }
      } catch (err) {
        console.error("Could not fetch volunteers:", err);
      }
    };
    fetchVolunteers();
  }, []);

  const handleTextChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  // CHECK STATUS WHEN EMAIL/MOBILE IS ENTERED
  const checkApplicantStatus = async () => {
    if (formData.mobileNumber.length === 10 && formData.email) {
      try {
        const res = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:8080'}/api/shg/check?mobile=${formData.mobileNumber}&email=${formData.email}`);
        if (res.ok) {
          const data = await res.json();
          if (data.paymentStatus === 'PARTIAL') {
            setApplicantStatus('PARTIAL');
            setPaymentAmount("150");
            setFormData(prev => ({ ...prev, ...data })); // Pre-fill their existing data for the receipt
            setMessage("We found your 1st installment! You only need to pay the remaining ₹150 to get your receipt.");
          } else if (data.paymentStatus === 'COMPLETED') {
            setApplicantStatus('COMPLETED');
            setMessage("You have already fully registered and paid for SHG.");
          }
        } else {
          setApplicantStatus('NEW');
          setPaymentAmount("350");
          setMessage(""); // Clear message if they are new
        }
      } catch (e) {
        console.error("Error checking status", e);
      }
    }
  };

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      if (selectedFile.size > 3 * 1024 * 1024) {
        setMessage(`The selected file for ${e.target.name} exceeds the 3 MB limit.`);
        e.target.value = ''; 
        setFiles(prev => ({ ...prev, [e.target.name]: null }));
        return;
      }
      setMessage('');
      setFiles({ ...files, [e.target.name]: selectedFile });
    }
  };

  const uploadFileToSupabase = async (file, folder) => {
    if (!file) return null;
    const fileExt = file.name.split('.').pop();
    const fileName = `${folder}/${Date.now()}_${Math.random().toString(36).substring(7)}.${fileExt}`;
    const { error } = await supabase.storage.from('shg-documents').upload(fileName, file);
    if (error) throw error;
    const { data: { publicUrl } } = supabase.storage.from('shg-documents').getPublicUrl(fileName);
    return publicUrl;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');

    // Only require files if this is a NEW application
    if (applicantStatus === 'NEW' && (!files.aadhaar || !files.photo || !files.passbook)) {
      setMessage("Error: Please ensure required images are selected and under 3 MB.");
      setLoading(false);
      return;
    }

    const res = await loadRazorpay();
    if (!res) {
      setMessage("Razorpay SDK failed to load. Are you online?");
      setLoading(false);
      return;
    }

    try {
      let aadhaarPhotoUrl = formData.aadhaarPhotoUrl;
      let panPhotoUrl = formData.panPhotoUrl;
      let selfPhotoUrl = formData.selfPhotoUrl;
      let passbookPhotoUrl = formData.passbookPhotoUrl;

      // Only upload files if it's a NEW application
      if (applicantStatus === 'NEW') {
        setMessage("Uploading documents...");
        aadhaarPhotoUrl = await uploadFileToSupabase(files.aadhaar, 'aadhaar');
        panPhotoUrl = await uploadFileToSupabase(files.pan, 'pan');
        selfPhotoUrl = await uploadFileToSupabase(files.photo, 'photos');
        passbookPhotoUrl = await uploadFileToSupabase(files.passbook, 'passbooks');
      }

      let referredByName = formData.referredBy || "None";
      if (applicantStatus === 'NEW' && formData.referredBy) {
        const selectedVolunteer = volunteers.find(vol => vol.id.toString() === formData.referredBy.toString());
        if (selectedVolunteer) referredByName = selectedVolunteer.fullName || selectedVolunteer.name;
      }

      setMessage("Initializing payment...");
      const orderResponse = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:8080'}/api/payment/create-shg-order`, {
        method: "POST",
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ amount: Number(paymentAmount) })
      });
      const orderData = await orderResponse.json();

      const options = {
        key: import.meta.env.VITE_RAZORPAY_KEY_ID, 
        amount: orderData.amount,
        currency: "INR",
        name: "Shashi Jan Kalyan Trust",
        description: paymentAmount === "350" ? "Full SHG Registration Fee" : "SHG Installment Payment",
        order_id: orderData.id,
        handler: async function (response) {
          try {
            setMessage("Payment Successful! Saving application...");
            
            const payload = {
              ...formData,
              referredBy: referredByName,
              aadhaarPhotoUrl,
              panPhotoUrl,
              selfPhotoUrl,
              passbookPhotoUrl,
              amountPaid: applicantStatus === 'PARTIAL' ? 350 : Number(paymentAmount), // Total paid is now 350 if they are completing it
              paymentStatus: (paymentAmount === "350" || applicantStatus === 'PARTIAL') ? "COMPLETED" : "PARTIAL",
              paymentId: response.razorpay_payment_id
            };

            const dbResponse = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:8080'}/api/shg/join`, {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify(payload)
            });

            if (!dbResponse.ok) throw new Error('Failed to save to database');
            
            if (paymentAmount === "350" || applicantStatus === 'PARTIAL') {
              navigate("/shg-success", { 
                state: { 
                  ...payload, 
                  gatewayTransactionId: response.razorpay_payment_id,
                  amount: 350,
                  date: new Date().toLocaleDateString("en-GB")
                } 
              });
            } else {
              alert("First installment of ₹200 received successfully! You will receive your SHG Registration Receipt only after paying the remaining ₹150.");
              navigate("/");
            }

          } catch (err) {
            console.error(err);
            setMessage("Payment succeeded, but application saving failed. Contact Admin.");
          }
        },
        prefill: {
          name: formData.name,
          email: formData.email,
          contact: formData.mobileNumber
        },
        theme: { color: "#0d4a30" }
      };

      const paymentObject = new window.Razorpay(options);
      paymentObject.on('payment.failed', function () {
        setMessage("Payment failed or cancelled. Try again.");
        setLoading(false);
      });
      paymentObject.open();

    } catch (error) {
      console.error(error);
      setMessage('An error occurred during submission. Please try again.');
      setLoading(false);
    }
  };

  if (applicantStatus === 'COMPLETED') {
    return (
      <div className="max-w-3xl mx-auto p-8 bg-white rounded-2xl shadow-sm border border-gray-100 my-10 text-center">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Already Registered</h2>
        <p className="text-gray-600 mb-6">Our records show that you have already fully paid and registered for the Self Help Group.</p>
        <button onClick={() => navigate("/")} className="bg-[#0d4a30] text-white px-6 py-2 rounded-xl font-bold">Back to Home</button>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto p-6 md:p-8 bg-white rounded-2xl shadow-sm border border-gray-100 my-10">
      <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">Join Self Help Group (SHG)</h2>
      
      {message && (
        <div className={`p-4 mb-6 rounded-lg text-sm font-bold ${message.includes('Error') || message.includes('failed') ? 'bg-red-50 text-red-700' : 'bg-blue-50 text-blue-700'}`}>
          {message}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        
        {/* SECTION 1: Personal Details */}
        <div className="space-y-4">
          <h3 className="font-bold text-lg text-gray-800 border-b pb-2">Personal Details</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">Full Name</label>
              <input type="text" name="name" required disabled={applicantStatus === 'PARTIAL'} value={formData.name} onChange={handleTextChange} className="w-full rounded-xl border p-3 text-sm focus:ring-2 focus:ring-green-600 disabled:bg-gray-100" />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">Mobile Number</label>
              <input type="tel" name="mobileNumber" required pattern="[0-9]{10}" disabled={applicantStatus === 'PARTIAL'} value={formData.mobileNumber} onChange={handleTextChange} onBlur={checkApplicantStatus} className="w-full rounded-xl border p-3 text-sm focus:ring-2 focus:ring-green-600 disabled:bg-gray-100" />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">Email Address</label>
              <input type="email" name="email" required placeholder="example@gmail.com" disabled={applicantStatus === 'PARTIAL'} value={formData.email} onChange={handleTextChange} onBlur={checkApplicantStatus} className="w-full rounded-xl border p-3 text-sm focus:ring-2 focus:ring-green-600 disabled:bg-gray-100" />
            </div>
          </div>

          {/* Only show these fields if they haven't paid the 1st installment yet */}
          {applicantStatus === 'NEW' && (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">Husband Name (Optional)</label>
                  <input type="text" required  name="husbandName" value={formData.husbandName} onChange={handleTextChange} className="w-full rounded-xl border p-3 text-sm focus:ring-2 focus:ring-green-600" />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">Address</label>
                  <input type="text" name="address" required value={formData.address} onChange={handleTextChange} className="w-full rounded-xl border p-3 text-sm focus:ring-2 focus:ring-green-600" />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">Aadhaar Number</label>
                  <input type="text" name="aadhaarNumber" required placeholder="[Aadhaar Number]" value={formData.aadhaarNumber} onChange={handleTextChange} className="w-full rounded-xl border p-3 text-sm focus:ring-2 focus:ring-green-600" />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">PAN Number</label>
                  <input type="text" name="panNumber" value={formData.panNumber} onChange={handleTextChange} className="w-full rounded-xl border p-3 text-sm focus:ring-2 focus:ring-green-600 uppercase" />
                </div>
              </div>

              {/* SECTION 2: Bank Details */}
              <div className="space-y-4 pt-2">
                <h3 className="font-bold text-lg text-gray-800 border-b pb-2">Bank Details</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1">Account Holder Name</label>
                    <input type="text" name="accountHolderName" required value={formData.accountHolderName} onChange={handleTextChange} className="w-full rounded-xl border p-3 text-sm focus:ring-2 focus:ring-green-600" />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1">Bank Name</label>
                    <input type="text" name="bankName" required value={formData.bankName} onChange={handleTextChange} className="w-full rounded-xl border p-3 text-sm focus:ring-2 focus:ring-green-600" />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1">Account Number</label>
                    <input type="text" name="bankAccountNumber" required value={formData.bankAccountNumber} onChange={handleTextChange} className="w-full rounded-xl border p-3 text-sm focus:ring-2 focus:ring-green-600" />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1">IFSC Code</label>
                    <input type="text" name="ifscCode" required value={formData.ifscCode} onChange={handleTextChange} className="w-full rounded-xl border p-3 text-sm focus:ring-2 focus:ring-green-600 uppercase" />
                  </div>
                </div>
              </div>

              {/* SECTION 3: Reference & Documents */}
              <div className="space-y-4 pt-2">
                <h3 className="font-bold text-lg text-gray-800 border-b pb-2">Reference & Documents</h3>
                
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">Referred By (Optional)</label>
                  <select name="referredBy" value={formData.referredBy} onChange={handleTextChange} className="w-full rounded-xl border p-3 text-sm focus:ring-2 focus:ring-green-600 bg-white">
                    <option value="">Select Volunteer</option>
                    {volunteers.map((vol) => (
                      <option key={vol.id} value={vol.id}>
                        {vol.fullName || vol.name} ({vol.email} | {vol.mobileNumber || vol.phone})
                      </option>
                    ))}
                  </select>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 pt-4">
                  <div className="p-3 border rounded-xl bg-gray-50/50">
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Aadhaar Photo <span className="text-xs text-red-500 font-normal">(Max 3MB)</span></label>
                    <input type="file" name="aadhaar" accept="image/*" required onChange={handleFileChange} className="w-full text-xs text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-xs file:font-semibold file:bg-green-50 file:text-green-700" />
                  </div>
                  <div className="p-3 border rounded-xl bg-gray-50/50">
                    <label className="block text-sm font-semibold text-gray-700 mb-2">PAN Photo <span className="text-xs text-red-500 font-normal">(Max 3MB)</span></label>
                    <input type="file" name="pan" accept="image/*" onChange={handleFileChange} className="w-full text-xs text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-xs file:font-semibold file:bg-green-50 file:text-green-700" />
                  </div>
                  <div className="p-3 border rounded-xl bg-gray-50/50">
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Self Photo <span className="text-xs text-red-500 font-normal">(Max 3MB)</span></label>
                    <input type="file" name="photo" accept="image/*" required onChange={handleFileChange} className="w-full text-xs text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-xs file:font-semibold file:bg-green-50 file:text-green-700" />
                  </div>
                  <div className="p-3 border rounded-xl bg-gray-50/50">
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Bank Passbook Photo <span className="text-xs text-red-500 font-normal">(Max 3MB)</span></label>
                    <input type="file" name="passbook" accept="image/*" required onChange={handleFileChange} className="w-full text-xs text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-xs file:font-semibold file:bg-green-50 file:text-green-700" />
                  </div>
                </div>
              </div>
            </>
          )}
        </div>

        {/* SECTION 4: Payment Selection */}
        <div className="space-y-4 pt-4 border-t border-gray-100">
          <h3 className="font-bold text-lg text-gray-800">Payment Plan</h3>
          <div className="flex flex-col sm:flex-row gap-4">
            {applicantStatus === 'NEW' ? (
              <>
                <label className={`flex-1 flex items-center gap-3 p-4 rounded-xl border-2 cursor-pointer transition-colors ${paymentAmount === "350" ? "border-green-600 bg-green-50" : "border-gray-200 hover:bg-gray-50"}`}>
                  <input type="radio" name="paymentAmount" value="350" checked={paymentAmount === "350"} onChange={(e) => setPaymentAmount(e.target.value)} className="w-5 h-5 text-green-600 focus:ring-green-600" />
                  <div>
                    <p className="font-bold text-gray-900">Pay Full Amount (₹350)</p>
                    <p className="text-xs text-gray-500">Get SHG receipt instantly.</p>
                  </div>
                </label>
                <label className={`flex-1 flex items-center gap-3 p-4 rounded-xl border-2 cursor-pointer transition-colors ${paymentAmount === "200" ? "border-green-600 bg-green-50" : "border-gray-200 hover:bg-gray-50"}`}>
                  <input type="radio" name="paymentAmount" value="200" checked={paymentAmount === "200"} onChange={(e) => setPaymentAmount(e.target.value)} className="w-5 h-5 text-green-600 focus:ring-green-600" />
                  <div>
                    <p className="font-bold text-gray-900">1st Installment (₹200)</p>
                    <p className="text-xs text-gray-500">Pay remaining ₹150 later to get receipt.</p>
                  </div>
                </label>
              </>
            ) : (
              <label className="flex-1 flex items-center gap-3 p-4 rounded-xl border-2 border-green-600 bg-green-50 cursor-pointer">
                <input type="radio" checked readOnly className="w-5 h-5 text-green-600" />
                <div>
                  <p className="font-bold text-gray-900">Final Installment (₹150)</p>
                  <p className="text-xs text-gray-500">Pay the remaining balance to generate your SHG receipt.</p>
                </div>
              </label>
            )}
          </div>
        </div>

        <button type="submit" disabled={loading} className="w-full mt-8 bg-[#0d4a30] text-white font-bold py-3 px-4 rounded-xl hover:bg-green-800 disabled:opacity-70 transition-colors">
          {loading ? 'Processing...' : `Pay ₹${paymentAmount} & Submit`}
        </button>
      </form>
    </div>
  );
}