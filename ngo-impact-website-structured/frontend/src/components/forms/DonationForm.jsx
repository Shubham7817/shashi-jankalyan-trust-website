import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Button from "../ui/Button";
import useRazorpay from "../../hooks/useRazorpay";
import { createPaymentOrder, verifyPayment } from "../../services/paymentService";

const amounts = [500, 1000, 2500, 5000, 10000];

export default function DonationForm() {
  const navigate = useNavigate();
  const { loading, setLoading, loadRazorpay } = useRazorpay();
  const [selectedAmt, setSelectedAmt] = useState(500);
  const [customAmt, setCustomAmt] = useState("");
  const [error, setError] = useState("");
  
  const [formData, setFormData] = useState({ 
    name: "", email: "", phone: "", referredBy: "", message: "" 
  });
  
  const [volunteers, setVolunteers] = useState([]);

  // Fetch volunteers on component load
  useEffect(() => {
    const fetchVolunteers = async () => {
      try {
        const response = await fetch(`${import.meta.env.VITE_API_URL}/api/payment/volunteers`);
        // const response = await fetch("http://localhost:8080/api/payment/volunteers");
        if (response.ok) {
          const data = await response.json();
          setVolunteers(data);
        }
      } catch (err) {
        console.error("Could not fetch volunteers:", err);
      }
    };
    fetchVolunteers();
  }, []);

  const finalAmount = Number(customAmt || selectedAmt);

  const handleChange = (e) => setFormData((p) => ({ ...p, [e.target.name]: e.target.value }));

  const validateForm = () => {
    if (!formData.name.trim()) return "Please enter your name.";
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email.trim())) return "Valid email required.";
    if (!/^[0-9+\-\s]{10,15}$/.test(formData.phone.trim())) return "Valid phone required.";
    if (finalAmount < 1 || finalAmount > 500000 || !Number.isInteger(finalAmount)) return "Invalid amount.";
    return "";
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const validationErr = validateForm();
    if (validationErr) return setError(validationErr);
    
    setError("");
    try {
      setLoading(true);
      if (!(await loadRazorpay())) throw new Error("Failed to load payment gateway.");

      const order = await createPaymentOrder({ amount: finalAmount, ...formData });
      if (!order?.success || !order?.orderId) throw new Error(order?.message || "Order creation failed.");

      const rzp = new window.Razorpay({
        key: import.meta.env.VITE_RAZORPAY_KEY_ID,
        amount: order.amount,
        currency: order.currency,
        name: "Shashi Jan Kalyan Trust",
        order_id: order.orderId,
        prefill: { name: formData.name, email: formData.email, contact: formData.phone },

        handler: async (res) => {
          try {
            setLoading(true);
            const verified = await verifyPayment({
              razorpayPaymentId: res.razorpay_payment_id,
              razorpayOrderId: res.razorpay_order_id,
              razorpaySignature: res.razorpay_signature,
            });
            
            // --- CRITICAL FIX: Pass state to the success page ---
            if (verified?.success) {

            let referredByName = "None";
              
              if (formData.referredBy) {
                // Look through the volunteers array you already fetched
                const selectedVolunteer = volunteers.find(
                  (vol) => vol.id.toString() === formData.referredBy.toString()
                );
                
                if (selectedVolunteer) {
                  referredByName = selectedVolunteer.name; // Extract just the name
                }
              }



              navigate("/donation-success", {
                state: {
                  amount: finalAmount,
                  gatewayTransactionId: res.razorpay_payment_id,
                  name: formData.name,
                  email: formData.email,
                  phone: formData.phone,
                  // Passing default values for fields not in your current form
                  city: formData.city, 
                  state: formData.state,
                  referredBy : referredByName,
                  date: new Date().toLocaleDateString("en-GB")
                }
              });
            } else {
              navigate("/donation-failed");
            }
            // ----------------------------------------------------
            
          } catch {
            navigate("/donation-failed");
          } finally { setLoading(false); }
        },
        modal: { ondismiss: () => setLoading(false) }
      });
      rzp.open();
    } catch (err) {
      setError(err.message || "Payment error. Please try again.");
      setLoading(false);
    }
  };

  return (
<form onSubmit={handleSubmit} className="card p-6">
      <h2 className="text-2xl font-bold">Choose your support</h2>
      
      <div className="mt-4 grid grid-cols-2 gap-3">
        {amounts.map((amt) => (
          <Button type="button" key={amt} variant={selectedAmt === amt && !customAmt ? "primary" : "outline"}
            onClick={() => { setSelectedAmt(amt); setCustomAmt(""); setError(""); }}>
            ₹{amt.toLocaleString()}
          </Button>
        ))}
      </div>

      <h3 className="mt-6 text-xl font-bold">Custom Amount</h3>
      <input type="number" min="1" placeholder="Enter amount of your choice" value={customAmt}
        onChange={(e) => { setCustomAmt(e.target.value); setSelectedAmt(null); setError(""); }}
        className="mt-3 w-full rounded-xl border p-3" />

      <div className="mt-6 grid gap-3">
        <input name="name" type="text" value={formData.name} onChange={handleChange} placeholder="Full Name" className="rounded-xl border p-3" />
        <input name="email" type="email" value={formData.email} onChange={handleChange} placeholder="Email Address" className="rounded-xl border p-3" />
        <input name="phone" type="tel" value={formData.phone} onChange={handleChange} placeholder="Phone Number" className="rounded-xl border p-3" />
        
        {/* NEW: City and State side-by-side */}
        <div className="grid grid-cols-2 gap-3">
          <input name="city" type="text" value={formData.city} onChange={handleChange} placeholder="City" className="w-full rounded-xl border p-3" />
          <input name="state" type="text" value={formData.state} onChange={handleChange} placeholder="State" className="w-full rounded-xl border p-3" />
        </div>
        
        {/* Replaced PAN with Referred By Dropdown */}  
        <select 
          name="referredBy" 
          value={formData.referredBy} 
          onChange={handleChange} 
          className="rounded-xl border p-3"
        >
          <option value="">Referred by (Optional)</option>
          {volunteers.map((vol) => (
            <option key={vol.id} value={vol.id}>
              {vol.name} ({vol.email} | {vol.phone})
            </option>
          ))}
        </select>

        <textarea name="message" value={formData.message} onChange={handleChange} placeholder="Message (Optional)" rows="3" className="rounded-xl border p-3" />
      </div>

      <div className="mt-5 rounded-xl bg-gray-50 p-4">
        <p className="text-sm text-gray-600">Donation Amount</p>
        <p className="text-2xl font-bold">₹{finalAmount.toLocaleString()}</p>
      </div>

      {error && <div className="mt-4 rounded-xl bg-red-50 p-3 text-red-700" role="alert">{error}</div>}

      <Button type="submit" variant="accent" className="mt-5 w-full" disabled={loading}>
        {loading ? "Preparing Secure Payment..." : "Continue to Payment"}
      </Button>
    </form>
  );
}