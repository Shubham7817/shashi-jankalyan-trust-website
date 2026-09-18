
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
  const [serverMessage, setServerMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const countries = Country.getAllCountries();

  const states = d.country
    ? State.getStatesOfCountry(d.country)
    : [];

  const cities = d.state
    ? City.getCitiesOfState(d.country, d.state)
    : [];

  const handleChange = (e) => {
    const { name, value } = e.target;

    setD((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const submit = async (e) => {
    e.preventDefault();

    // Clear previous messages
    setServerMessage("");
    setS("");

    // Validation
    if (
      !d.name.trim() ||
      !d.email.trim() ||
      !d.phone.trim() ||
      !d.country ||
      !d.state ||
      !d.city
    ) {
      setS("error");
      setServerMessage(
        "Please complete all required fields correctly."
      );
      return;
    }

    // Email validation
    if (!/\S+@\S+\.\S+/.test(d.email)) {
      setS("error");
      setServerMessage("Please enter a valid email address.");
      return;
    }

    // Phone validation
    if (!/^[0-9+\-\s()]{7,20}$/.test(d.phone)) {
      setS("error");
      setServerMessage("Please enter a valid phone number.");
      return;
    }

    try {
      setIsLoading(true);

      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/api/volunteers/submit`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(d),
        }
      );

      let data;

      try {
        data = await response.json();
      } catch {
        data = {
          success: false,
          message: "Invalid response received from server.",
        };
      }

      if (response.ok && data.success) {
        setS("success");
        setServerMessage(
          data.message || "Volunteer registration submitted successfully."
        );

        // Clear form
        setD({
          name: "",
          email: "",
          phone: "",
          country: "",
          state: "",
          city: "",
          message: "",
        });

        // Hide success message after 4 seconds
        setTimeout(() => {
          setS("");
          setServerMessage("");
        }, 4000);
      } else {
        setS("error");
        setServerMessage(
          data.message || "Failed to submit volunteer application."
        );
      }
    } catch (error) {
      console.error("Volunteer submission failed:", error);

      setS("error");
      setServerMessage(
        "Unable to connect to the server. Please try again later."
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="overflow-hidden rounded-3xl border border-gray-200 bg-white shadow-sm">

      {/* Header */}
      {/* <div className="bg-green-800 px-7 py-6 text-white">
        <h2 className="text-2xl font-bold">
          Become a Volunteer
        </h2>

        <p className="mt-1 text-sm text-green-100">
          Join us and make a difference in your community.
        </p>
      </div> */}

      {/* Form */}
      <form
        onSubmit={submit}
        className="grid gap-5 p-7"
      >

        {/* Name */}
        <div>
          <label
            htmlFor="name"
            className="mb-2 block text-sm font-semibold text-gray-700"
          >
            Name
          </label>

          <input
            id="name"
            name="name"
            required
            type="text"
            placeholder="Enter your name"
            value={d.name}
            onChange={handleChange}
            className="w-full rounded-xl border border-gray-300 bg-white px-4 py-3 text-gray-900 outline-none transition-all placeholder:text-gray-400 focus:border-rose-600 focus:ring-2 focus:ring-rose-100"
          />
        </div>

        {/* Email */}
        <div>
          <label
            htmlFor="email"
            className="mb-2 block text-sm font-semibold text-gray-700"
          >
            Email
          </label>

          <input
            id="email"
            name="email"
            required
            type="email"
            placeholder="Enter your email"
            value={d.email}
            onChange={handleChange}
            className="w-full rounded-xl border border-gray-300 bg-white px-4 py-3 text-gray-900 outline-none transition-all placeholder:text-gray-400 focus:border-rose-600 focus:ring-2 focus:ring-rose-100"
          />
        </div>

        {/* Phone */}
        <div>
          <label
            htmlFor="phone"
            className="mb-2 block text-sm font-semibold text-gray-700"
          >
            Phone Number
          </label>

          <input
            id="phone"
            name="phone"
            required
            type="tel"
            placeholder="Enter your phone number"
            value={d.phone}
            onChange={handleChange}
            className="w-full rounded-xl border border-gray-300 bg-white px-4 py-3 text-gray-900 outline-none transition-all placeholder:text-gray-400 focus:border-rose-600 focus:ring-2 focus:ring-rose-100"
          />
        </div>

        {/* Country */}
        <div>
          <label
            htmlFor="country"
            className="mb-2 block text-sm font-semibold text-gray-700"
          >
            Country
          </label>

          <select
            id="country"
            name="country"
            required
            value={d.country}
            onChange={(e) =>
              setD({
                ...d,
                country: e.target.value,
                state: "",
                city: "",
              })
            }
            className="w-full rounded-xl border border-gray-300 bg-white px-4 py-3 text-gray-900 outline-none transition-all focus:border-rose-600 focus:ring-2 focus:ring-rose-100"
          >
            <option value="">Select Country</option>

            {countries.map((country) => (
              <option
                key={country.isoCode}
                value={country.isoCode}
              >
                {country.name}
              </option>
            ))}
          </select>
        </div>

        {/* State */}
        <div>
          <label
            htmlFor="state"
            className="mb-2 block text-sm font-semibold text-gray-700"
          >
            State
          </label>

          <select
            id="state"
            name="state"
            required
            disabled={!d.country}
            value={d.state}
            onChange={(e) =>
              setD({
                ...d,
                state: e.target.value,
                city: "",
              })
            }
            className="w-full rounded-xl border border-gray-300 bg-white px-4 py-3 text-gray-900 outline-none transition-all disabled:bg-gray-100 disabled:text-gray-400 focus:border-rose-600 focus:ring-2 focus:ring-rose-100"
          >
            <option value="">Select State</option>

            {states.map((state) => (
              <option
                key={state.isoCode}
                value={state.isoCode}
              >
                {state.name}
              </option>
            ))}
          </select>
        </div>

        {/* City */}
        <div>
          <label
            htmlFor="city"
            className="mb-2 block text-sm font-semibold text-gray-700"
          >
            City
          </label>

          <select
            id="city"
            name="city"
            required
            disabled={!d.state}
            value={d.city}
            onChange={handleChange}
            className="w-full rounded-xl border border-gray-300 bg-white px-4 py-3 text-gray-900 outline-none transition-all disabled:bg-gray-100 disabled:text-gray-400 focus:border-rose-600 focus:ring-2 focus:ring-rose-100"
          >
            <option value="">Select City</option>

            {cities.map((city) => (
              <option
                key={city.name}
                value={city.name}
              >
                {city.name}
              </option>
            ))}
          </select>
        </div>

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
            name="message"
            placeholder="Tell us why you would like to volunteer..."
            // rows={2}
            value={d.message}
            onChange={handleChange}
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
          type="submit"
          variant="accent"
          disabled={isLoading}
          className="w-full"
        >
          {isLoading ? "Submitting..." : "Become a Volunteer"}
        </Button>
      </form>
    </div>
  );
}


// ### One important thing

// I noticed that your original VolunteerForm has **no `isLoading` state**. So a user can click:

// ```text
// Become a Volunteer
// Become a Volunteer
// Become a Volunteer
// ```

// while the first request is still processing.

// The updated version prevents that:

// ```jsx
// const [isLoading, setIsLoading] = useState(false);
// ```

// and:

// ```jsx
// <Button
//   type="submit"
//   variant="accent"
//   disabled={isLoading}
// >
//   {isLoading ? "Submitting..." : "Become a Volunteer"}
// </Button>
// ```

// This makes its submission behavior match your ContactForm.

// Also, your `message` field is currently **optional** because you don't validate it. If you want it to behave exactly like your ContactForm, add:

// ```js
// !d.message.trim()
// ```

// // to the validation condition and add `required` to the textarea.

// // One more thing: because your frontend is on **Vercel** and backend is on **Render**, make sure Vercel has the same `VITE_API_URL` environment variable pointing to your Render backend, and **redeploy Vercel after changing it**. Vite environment variables are baked into the frontend at build time.
