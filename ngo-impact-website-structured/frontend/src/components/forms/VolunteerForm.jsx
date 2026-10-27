import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Button from "../ui/Button"; // Adjust path if needed
import { Loader2, AlertCircle } from "lucide-react";
import { createClient } from "@supabase/supabase-js";
import { Country, State, City } from "country-state-city";

// Import your custom Razorpay hook and payment services
import useRazorpay from "../../hooks/useRazorpay";
import { createPaymentOrder, verifyPayment } from "../../services/paymentService";

const supabase = createClient(
  import.meta.env.VITE_SUPABASE_URL,
  import.meta.env.VITE_SUPABASE_ANON_KEY
);

const loadRazorpay = () => {
  return new Promise((resolve) => {
    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });
};

export default function VolunteerForm() {
  const navigate = useNavigate();
  const { loading, setLoading, loadRazorpay } = useRazorpay();

  const [d, setD] = useState({
    name: "", fatherName: "", dob: "", email: "", phone: "", whatsapp: "",
    ageGroup: "", country: "IN", state: "", district: "", block: "",
    panchayat: "", address: "", pincode: "", highestEducation: "",
    otherEducation: "", languagesKnown: [], otherLanguage: "",
    englishProficiency: "", hindiProficiency: "", motivation: "",
  });

  const [eduDoc, setEduDoc] = useState(null);
  const [error, setError] = useState("");
  const [serverMessage, setServerMessage] = useState("");
  
  // NEW: Real-time duplicate tracking states
  const [duplicateError, setDuplicateError] = useState("");
  const [isCheckingDuplicate, setIsCheckingDuplicate] = useState(false);

  const countries = Country.getAllCountries();
  const states = d.country ? State.getStatesOfCountry(d.country) : [];
  const districts = d.state ? City.getCitiesOfState(d.country, d.state) : [];

  const handleChange = (e) => setD((prev) => ({ ...prev, [e.target.name]: e.target.value }));

  const handleCheckboxChange = (e) => {
    const { value, checked } = e.target;
    if (checked) {
      setD((prev) => ({ ...prev, languagesKnown: [...prev.languagesKnown, value] }));
    } else {
      setD((prev) => ({ ...prev, languagesKnown: prev.languagesKnown.filter((lang) => lang !== value) }));
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        setError("Educational document must be under 5MB.");
        e.target.value = null;
        setEduDoc(null);
      } else {
        setError("");
        setEduDoc(file);
      }
    }
  };

  // NEW: Real-time Database Check Effect
  useEffect(() => {
    const checkDuplicate = async () => {
      // Only check if all three core identity fields have some input
      if (d.name.trim().length > 2 && d.email.trim() && d.phone.trim().length > 9) {
        setIsCheckingDuplicate(true);
        try {
          const checkRes = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:8080'}/api/volunteers/check`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email: d.email, name: d.name, phone: d.phone })
          });
          const checkData = await checkRes.json();
          
          if (checkData.exists) {
            setDuplicateError(checkData.message || "You have already registered.");
          } else {
            setDuplicateError(""); // Clear error if they fix the input
          }
        } catch (err) {
          console.error("Failed background duplicate check", err);
        } finally {
          setIsCheckingDuplicate(false);
        }
      } else {
        setDuplicateError("");
      }
    };

    // Delay the API call by 600ms so it doesn't trigger on every single keystroke
    const timeoutId = setTimeout(checkDuplicate, 600);
    return () => clearTimeout(timeoutId);
  }, [d.name, d.email, d.phone]);

  const uploadFileToSupabase = async (file, folder) => {
    if (!file) return null;
    const fileExt = file.name.split('.').pop();
    const fileName = `${folder}/${Date.now()}_${Math.random().toString(36).substring(7)}.${fileExt}`;
    const { error: uploadError } = await supabase.storage.from("evidence-files").upload(fileName, file);
    if (uploadError) throw uploadError;
    const { data: { publicUrl } } = supabase.storage.from("evidence-files").getPublicUrl(fileName);
    return publicUrl;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setServerMessage("");

    // Block submission entirely if a duplicate is found
    if (duplicateError) {
      return setError(duplicateError);
    }

    // 1. Local Validation
    if (!d.name.trim() || !d.email.trim() || !d.district.trim() || !d.block.trim() || !d.panchayat.trim() || !d.ageGroup || !d.highestEducation || !d.dob) {
      return setError("Please complete all required fields (marked with *).");
    }
    if (!eduDoc) {
      return setError("Please upload your Educational Qualification Document.");
    }

    try {
      setLoading(true);
      
      // 2. Final security check before payment (just in case they bypassed the auto-check)
      const checkRes = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:8080'}/api/volunteers/check`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: d.email, name: d.name, phone: d.phone })
      });
      const checkData = await checkRes.json();
      
      if (checkData.exists) {
        setError(checkData.message || "You have already registered."); 
        setLoading(false);
        return; 
      }

      // 3. Proceed with Document Upload
      setServerMessage("Uploading documents securely...");
      const educationDocUrl = await uploadFileToSupabase(eduDoc, 'volunteers');
      const payload = { ...d, educationDocUrl, languagesKnown: d.languagesKnown.join(", ") };

      // 4. Initialize Payment
      setServerMessage("Initializing payment gateway...");
      if (!(await loadRazorpay())) throw new Error("Failed to load payment gateway.");

      const order = await createPaymentOrder({ amount: 1500, name: d.name, email: d.email, phone: d.phone, type: "VolunteerRegistration" });
      if (!order?.success || !order?.orderId) throw new Error(order?.message || "Order creation failed.");

      setServerMessage("Awaiting payment...");

      // 5. Open Razorpay Popup
      const rzp = new window.Razorpay({
        key: import.meta.env.VITE_RAZORPAY_KEY_ID,
        amount: order.amount,
        currency: order.currency,
        name: "Shashi Jan Kalyan Trust",
        description: "Volunteer Registration Fee",
        order_id: order.orderId,
        prefill: { name: d.name, email: d.email, contact: d.phone },
        theme: { color: "#0d4a30" },

        handler: async (res) => {
          try {
            setLoading(true);
            setServerMessage("Verifying payment...");
            
            const verified = await verifyPayment({
              razorpayPaymentId: res.razorpay_payment_id,
              razorpayOrderId: res.razorpay_order_id,
              razorpaySignature: res.razorpay_signature,
            });
            
            if (verified?.success) {
              setServerMessage("Payment verified. Saving your application...");
              
              const dbPayload = {
                ...payload,
                paymentId: res.razorpay_payment_id,
                amountPaid: 1500,
                paymentStatus: "COMPLETED"
              };

              const dbResponse = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:8080'}/api/volunteers/submit`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(dbPayload)
              });

              if (!dbResponse.ok) throw new Error('Failed to save to database');

              navigate("/volunteer-success", {
                state: {
                  transactionId: res.razorpay_payment_id,
                  name: d.name,
                }
              });

            } else {
              navigate("/donation-failed");
            }
          } catch (err) {
            console.error(err);
            setError("Payment succeeded, but application saving failed. Contact Admin with ID: " + res.razorpay_payment_id);
            setLoading(false);
          }
        },
        modal: { ondismiss: () => { setLoading(false); setServerMessage(""); } }
      });
      
      rzp.open();
    } catch (err) {
      console.error(err);
      setError(err.message || "An error occurred. Please try again.");
      setLoading(false);
      setServerMessage("");
    }
  };

  return (
    <div className="overflow-hidden rounded-3xl border border-gray-200 bg-white shadow-sm max-w-4xl mx-auto">


      {/* NEW: Sticky Duplicate Warning */}
      {duplicateError && (
        <div className="bg-red-50 border-b border-red-200 p-4 sticky top-0 z-10 flex items-center justify-center gap-2">
          <AlertCircle className="h-5 w-5 text-red-600" />
          <p className="font-bold text-red-700">{duplicateError}</p>
        </div>
      )}

      <form onSubmit={handleSubmit} className="p-5 space-y-8">
        {error && !duplicateError && <div className="rounded-xl bg-red-50 px-4 py-3"><p className="font-medium text-red-600">{error}</p></div>}
        {serverMessage && !error && <div className="rounded-xl bg-blue-50 px-4 py-3"><p className="font-medium text-blue-700">
          {isCheckingDuplicate ? "Checking..." : serverMessage}
        </p></div>}

        {/* SECTION 1: Personal Info */}
        <div className={duplicateError ? "opacity-50 pointer-events-none transition-opacity" : "transition-opacity"}>
          <h3 className="font-bold text-lg text-gray-800 border-b pb-2 mb-4">Section 1: Personal Information</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div><label className="mb-2 block text-sm font-semibold text-gray-700">Name *</label><input name="name" required type="text" value={d.name} onChange={handleChange} className="w-full rounded-xl border border-gray-300 px-4 py-3 text-sm focus:border-green-600 outline-none" /></div>
            <div><label className="mb-2 block text-sm font-semibold text-gray-700">Father's Name *</label><input name="fatherName" required type="text" value={d.fatherName} onChange={handleChange} className="w-full rounded-xl border border-gray-300 px-4 py-3 text-sm focus:border-green-600 outline-none" /></div>
            <div><label className="mb-2 block text-sm font-semibold text-gray-700">Date of Birth *</label><input name="dob" required type="date" value={d.dob} onChange={handleChange} className="w-full rounded-xl border border-gray-300 px-4 py-3 text-sm focus:border-green-600 outline-none" /></div>
            <div><label className="mb-2 block text-sm font-semibold text-gray-700">Email *</label><input name="email" required type="email" value={d.email} onChange={handleChange} className="w-full rounded-xl border border-gray-300 px-4 py-3 text-sm focus:border-green-600 outline-none" /></div>
            <div><label className="mb-2 block text-sm font-semibold text-gray-700">Phone number *</label><input name="phone" required type="tel" value={d.phone} onChange={handleChange} className="w-full rounded-xl border border-gray-300 px-4 py-3 text-sm focus:border-green-600 outline-none" /></div>
            <div><label className="mb-2 block text-sm font-semibold text-gray-700">WhatsApp Number</label><input name="whatsapp" type="tel" value={d.whatsapp} onChange={handleChange} className="w-full rounded-xl border border-gray-300 px-4 py-3 text-sm focus:border-green-600 outline-none" /></div>
            <div>
              <label className="mb-2 block text-sm font-semibold text-gray-700">Age Group *</label>
              <select name="ageGroup" required value={d.ageGroup} onChange={handleChange} className="w-full rounded-xl border border-gray-300 px-4 py-3 text-sm focus:border-green-600 outline-none bg-white">
                <option value="">Select Age Group</option>
                <option value="Under 18">Under 18</option>
                <option value="18-24">18-24</option>
                <option value="25-34">25-34</option>
                <option value="35-44">35-44</option>
                <option value="45-54">45-54</option>
                <option value="55+">55+</option>
              </select>
            </div>
          </div>
        </div>

        {/* SECTION 2: Location & Address */}
        <div className={duplicateError ? "opacity-50 pointer-events-none" : ""}>
          <h3 className="font-bold text-lg text-gray-800 border-b pb-2 mb-4">Section 2: Location & Address</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            <div>
              <label className="mb-2 block text-sm font-semibold text-gray-700">Country *</label>
              <select name="country" required value={d.country} onChange={(e) => setD({ ...d, country: e.target.value, state: "", district: "" })} className="w-full rounded-xl border border-gray-300 px-4 py-3 text-sm focus:border-green-600 outline-none">
                <option value="">Select Country</option>
                {countries.map((c) => <option key={c.isoCode} value={c.isoCode}>{c.name}</option>)}
              </select>
            </div>
            <div>
              <label className="mb-2 block text-sm font-semibold text-gray-700">State *</label>
              <select name="state" required disabled={!d.country} value={d.state} onChange={(e) => setD({ ...d, state: e.target.value, district: "" })} className="w-full rounded-xl border border-gray-300 px-4 py-3 text-sm focus:border-green-600 outline-none disabled:bg-gray-100">
                <option value="">Select State</option>
                {states.map((s) => <option key={s.isoCode} value={s.isoCode}>{s.name}</option>)}
              </select>
            </div>
            <div>
              <label className="mb-2 block text-sm font-semibold text-gray-700">District *</label>
              <select name="district" required disabled={!d.state} value={d.district} onChange={handleChange} className="w-full rounded-xl border border-gray-300 px-4 py-3 text-sm focus:border-green-600 outline-none disabled:bg-gray-100">
                <option value="">Select District</option>
                {districts.map((c) => <option key={c.name} value={c.name}>{c.name}</option>)}
              </select>
            </div>
            <div><label className="mb-2 block text-sm font-semibold text-gray-700">Block *</label><input name="block" required type="text" value={d.block} onChange={handleChange} className="w-full rounded-xl border border-gray-300 px-4 py-3 text-sm focus:border-green-600 outline-none" /></div>
            <div><label className="mb-2 block text-sm font-semibold text-gray-700">Panchayat *</label><input name="panchayat" required type="text" value={d.panchayat} onChange={handleChange} className="w-full rounded-xl border border-gray-300 px-4 py-3 text-sm focus:border-green-600 outline-none" /></div>
            <div><label className="mb-2 block text-sm font-semibold text-gray-700">Pincode *</label><input name="pincode" required type="text" value={d.pincode} onChange={handleChange} className="w-full rounded-xl border border-gray-300 px-4 py-3 text-sm focus:border-green-600 outline-none" /></div>
            <div className="md:col-span-3"><label className="mb-2 block text-sm font-semibold text-gray-700">Full Address</label><input name="address" type="text" value={d.address} onChange={handleChange} className="w-full rounded-xl border border-gray-300 px-4 py-3 text-sm focus:border-green-600 outline-none" /></div>
          </div>
        </div>

        {/* SECTION 3: Education & Skills */}
        <div className={duplicateError ? "opacity-50 pointer-events-none" : ""}>
          <h3 className="font-bold text-lg text-gray-800 border-b pb-2 mb-4">Section 3: Educational Qualification & Skills</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-5">
            <div>
              <label className="mb-2 block text-sm font-semibold text-gray-700">Highest Education *</label>
              <select name="highestEducation" required value={d.highestEducation} onChange={handleChange} className="w-full rounded-xl border border-gray-300 px-4 py-3 text-sm focus:border-green-600 outline-none bg-white">
                <option value="">Select Qualification</option>
                <option value="10th Pass">10th Pass</option>
                <option value="12th Pass">12th Pass</option>
                <option value="Graduate">Graduate</option>
                <option value="Post Graduate">Post Graduate</option>
                <option value="Diploma">Diploma</option>
                <option value="Other">Other (Specify Below)</option>
              </select>
            </div>
            <div><label className="mb-2 block text-sm font-semibold text-gray-700">Other Qualification</label><input name="otherEducation" type="text" disabled={d.highestEducation !== "Other"} placeholder="Specify other qualification" value={d.otherEducation} onChange={handleChange} className="w-full rounded-xl border border-gray-300 px-4 py-3 text-sm focus:border-green-600 outline-none disabled:bg-gray-100" /></div>
          </div>

          <div className="mb-6 p-4 bg-gray-50 rounded-xl border border-gray-200">
            <label className="mb-2 block text-sm font-semibold text-gray-700">Upload Highest Educational Document *</label>
            <p className="text-xs text-gray-500 mb-3">PDF or image format. (Max 5MB)</p>
            <input type="file" required accept=".pdf,image/*" onChange={handleFileChange} className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:bg-[#0d4a30] file:text-white hover:file:bg-green-800 cursor-pointer" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-5">
            <div>
              <label className="mb-2 block text-sm font-semibold text-gray-700">Languages Known</label>
              <div className="space-y-2">
                {["Hindi", "English", "Bhojpuri", "Magahi", "Maithili"].map((lang) => (
                  <label key={lang} className="flex items-center gap-2 text-sm text-gray-700 cursor-pointer">
                    <input type="checkbox" value={lang} onChange={handleCheckboxChange} className="w-4 h-4 text-green-600 rounded" /> {lang}
                  </label>
                ))}
              </div>
              <input name="otherLanguage" type="text" placeholder="Other Language" value={d.otherLanguage} onChange={handleChange} className="mt-3 w-full rounded-xl border border-gray-300 px-4 py-2 text-sm focus:border-green-600 outline-none" />
            </div>
            <div className="space-y-5">
              <div>
                <label className="mb-2 block text-sm font-semibold text-gray-700">English Proficiency</label>
                <select name="englishProficiency" value={d.englishProficiency} onChange={handleChange} className="w-full rounded-xl border border-gray-300 px-4 py-3 text-sm bg-white"><option value="">Select Level</option><option value="Beginner">Beginner</option><option value="Intermediate">Intermediate</option><option value="Fluent">Fluent</option></select>
              </div>
              <div>
                <label className="mb-2 block text-sm font-semibold text-gray-700">Hindi Proficiency</label>
                <select name="hindiProficiency" value={d.hindiProficiency} onChange={handleChange} className="w-full rounded-xl border border-gray-300 px-4 py-3 text-sm bg-white"><option value="">Select Level</option><option value="Beginner">Beginner</option><option value="Intermediate">Intermediate</option><option value="Fluent">Fluent</option></select>
              </div>
            </div>
          </div>
          <div><label className="mb-2 block text-sm font-semibold text-gray-700">Why would you like to join?</label><textarea name="motivation" value={d.motivation} onChange={handleChange} rows="2" className="w-full rounded-xl border border-gray-300 px-4 py-3 text-sm resize-none" /></div>
        </div>

        {/* SECTION 4: Payment */}
        <div className=" border-t border-gray-200">
          <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-6 text-center mb-6">
            <h3 className="font-bold text-lg text-emerald-900 mb-2">Registration Contribution</h3>
            <p className="text-sm text-emerald-700 mb-4">A one-time registration fee of ₹1500 is required.</p>
            <Button 
              type="submit" 
              disabled={loading || !!duplicateError || isCheckingDuplicate} 
              className={`w-full font-bold py-4 rounded-xl text-lg flex justify-center items-center gap-2 shadow-md transition-colors ${
                duplicateError ? "bg-gray-400 cursor-not-allowed text-white" : "bg-[#0d4a30] hover:bg-green-900 text-white"
              }`}
            >
              {loading || isCheckingDuplicate ? <><Loader2 className="animate-spin h-5 w-5" /> Processing...</> : "Pay ₹1500 & Register"}
            </Button>
          </div>
        </div>
      </form>
    </div>
  );
}