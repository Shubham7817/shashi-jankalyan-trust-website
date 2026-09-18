import { useState } from "react";
import Button from "../ui/Button";
import { Mail } from "lucide-react";

export default function ContactForm() {
  const [d, setD] = useState({
    name: "",
    email: "",
    phone: "",
    subject: "",
    message: "",
  });

  const [s, setS] = useState("");
  const [serverMessage, setServerMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const submit = async (e) => {
    e.preventDefault();
    setServerMessage("");

    // Validate
    if (Object.values(d).some((x) => !x) || !/\S+@\S+\.\S+/.test(d.email)) {
      setServerMessage("Please complete all fields correctly.");
      return setS("error");
    }

    try {
      setIsLoading(true);
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/contact/submit`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(d),
      });

      const data = await response.json();

      if (response.ok && data.success) {
        setS("success");
        setServerMessage(data.message);
        
        // Clear form
        setD({ name: "", email: "", phone: "", subject: "", message: "" });

        // Hide success message after 4 seconds
        setTimeout(() => {
          setS("");
          setServerMessage("");
        }, 4000);
      } else {
        setS("error");
        setServerMessage(data.message || "Failed to send message.");
      }
    } catch (error) {
      console.error("Submission failed:", error);
      setS("error");
      setServerMessage("Unable to connect to the server.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
 <div className="overflow-hidden rounded-3xl border border-gray-200 bg-white shadow-sm">

  {/* Header */}
  <div className="flex items-center gap-3 bg-green-800 px-7 py-6 text-white">
    <Mail className="h-7 w-7 shrink-0" strokeWidth={2} />

    <h2 className="text-2xl font-bold">
      Send us a message
    </h2>
  </div>

  {/* Form Body */}
  <form
    onSubmit={submit}
    className="grid gap-5 p-7"
  >
    {/* Standard Inputs */}
    {Object.keys(d)
      .filter((k) => k !== "message")
      .map((k) => (
        <div key={k}>
          <label
            htmlFor={k}
            className="mb-2 block text-sm font-semibold text-gray-700"
          >
            {k[0].toUpperCase() + k.slice(1)}
          </label>

          <input
            id={k}
            required
            placeholder={`Enter your ${k}`}
            type={k === "email" ? "email" : "text"}
            value={d[k]}
            onChange={(e) =>
              setD({ ...d, [k]: e.target.value })
            }
            className="w-full rounded-xl border border-gray-300 bg-white px-4 py-3 text-gray-900 outline-none transition-all placeholder:text-gray-400 focus:border-rose-600 focus:ring-2 focus:ring-rose-100"
          />
        </div>
      ))}

    {/* Message */}
    <div>
      <label
        htmlFor="message"
        className="mb-2 block text-sm font-semibold text-gray-700"
      >
        Message
      </label>

      <textarea
        id="message"
        required
        placeholder="Write your message..."
        rows={5}
        value={d.message}
        onChange={(e) =>
          setD({ ...d, message: e.target.value })
        }
        className="w-full resize-none rounded-xl border border-gray-300 bg-white px-4 py-3 text-gray-900 outline-none transition-all placeholder:text-gray-400 focus:border-rose-600 focus:ring-2 focus:ring-rose-100"
      />
    </div>

    {/* Error */}
    {s === "error" && (
      <div className="rounded-xl bg-red-50 px-4 py-3">
        <p className="font-medium text-red-600">
          {serverMessage}
        </p>
      </div>
    )}

    {/* Success */}
    {s === "success" && (
      <div className="rounded-xl bg-green-50 px-4 py-3">
        <p className="font-medium text-green-700">
          {serverMessage}
        </p>
      </div>
    )}

    {/* Submit */}
    <Button
      type="submit" variant="accent"
      disabled={isLoading}
      className="w-full"
    >
      {isLoading ? "Sending..." : "Send Message"}
    </Button>
  </form>
</div>
  );
}



