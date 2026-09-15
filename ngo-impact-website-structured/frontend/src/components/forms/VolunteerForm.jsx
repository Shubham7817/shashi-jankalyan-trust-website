import { useState } from "react";
import Button from "../ui/Button";
import { Country, State, City } from "country-state-city";

export default function VolunteerForm() {
  const [d, setD] = useState({
    name: "",
    email: "",
    phone: "",
    country: "",
    state: "",
    city: "",
    message: "",
  });

  const [s, setS] = useState("");
  const [serverMessage, setServerMessage] = useState(""); // Captures backend messages

  const countries = Country.getAllCountries();
  const states = d.country ? State.getStatesOfCountry(d.country) : [];
  const cities = d.state ? City.getCitiesOfState(d.country, d.state) : [];

  const submit = async (e) => {
    e.preventDefault();
    setServerMessage(""); // Reset message on new submit
    
    if (
      !d.name ||
      !d.phone ||
      !d.country ||
      !d.state ||
      !d.city ||
      !/\S+@\S+\.\S+/.test(d.email)
    ) {
      setServerMessage("Please complete all required fields correctly.");
      return setS("error");
    }

    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/volunteers/submit`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(d),
      });

      // Parse the JSON response from Spring Boot
      const data = await response.json();

      if (response.ok && data.success) {
        setS("success");
        setServerMessage(data.message); // Will say "Volunteer saved successfully."
        
        setD({
          name: "", email: "", phone: "", country: "", state: "", city: "", message: "",
        });

        setTimeout(() => {
          setS("");
          setServerMessage("");
        }, 4000);
      } else {
        // If the backend returns a 409 Conflict, it triggers this block
        setS("error");
        setServerMessage(data.message || "An error occurred."); 
      }
    } catch (error) {
      console.error("Submission failed:", error);
      setS("error");
      setServerMessage("Unable to connect to the server. Please try again later.");
    }
  };

  const inputFields = [
    { id: "name", placeholder: "Name", type: "text" },
    { id: "email", placeholder: "Email", type: "email" },
    { id: "phone", placeholder: "Phone Number", type: "tel" },
  ];

  return (
    <form onSubmit={submit} className="card grid gap-3 p-6">
      {inputFields.map((field) => (
        <input
          key={field.id}
          required
          placeholder={field.placeholder}
          type={field.type}
          value={d[field.id]}
          onChange={(e) => setD({ ...d, [field.id]: e.target.value })}
          className="rounded-xl border p-3"
        />
      ))}

      <select
        required
        value={d.country}
        onChange={(e) => setD({ ...d, country: e.target.value, state: "", city: "" })}
        className="rounded-xl border p-3"
      >
        <option value="">Select Country</option>
        {countries.map((country) => (
          <option key={country.isoCode} value={country.isoCode}>
            {country.name}
          </option>
        ))}
      </select>

      <select
        required
        disabled={!d.country}
        value={d.state}
        onChange={(e) => setD({ ...d, state: e.target.value, city: "" })}
        className="rounded-xl border p-3 disabled:bg-gray-100 disabled:text-gray-400"
      >
        <option value="">Select State</option>
        {states.map((state) => (
          <option key={state.isoCode} value={state.isoCode}>
            {state.name}
          </option>
        ))}
      </select>

      <select
        required
        disabled={!d.state}
        value={d.city}
        onChange={(e) => setD({ ...d, city: e.target.value })}
        className="rounded-xl border p-3 disabled:bg-gray-100 disabled:text-gray-400"
      >
        <option value="">Select City</option>
        {cities.map((city) => (
          <option key={city.name} value={city.name}>
            {city.name}
          </option>
        ))}
      </select>

      <textarea
        placeholder="Message"
        value={d.message}
        onChange={(e) => setD({ ...d, message: e.target.value })}
        className="rounded-xl border p-3"
      />

      {s === "error" && (
        <p className="text-red-600 font-medium">
          {serverMessage}
        </p>
      )}
      {s === "success" && (
        <p className="text-green-700 font-medium">
          {serverMessage}
        </p>
      )}

      <Button type="submit" variant="accent">Become a Volunteer</Button>
    </form>
  );
}