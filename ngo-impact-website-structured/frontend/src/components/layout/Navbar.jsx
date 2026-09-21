import { useState, useEffect } from "react";
import { Menu, X } from "lucide-react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import Button from "../ui/Button";
import logo from "../../assets/image2/logo.jpeg";

const links = [
  ["/", "Home"],
  ["/about", "About Us"],
  ["/our-work", "Our Work"],
  ["/gallery", "Gallery"],
  ["/get-involved", "Get Involved"],
  ["/contact", "Contact"],
];

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const [showLogin, setShowLogin] = useState(false);
  // Initialize login state based on existing sessionStorage
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    // Check if user is already logged in when the navbar mounts
    if (sessionStorage.getItem("volunteerId")) {
      setIsLoggedIn(true);
    }
  }, []);

  const handleLoginSubmit = async (e) => {
      e.preventDefault();
      const username = e.target.username.value;
      const password = e.target.password.value;

      try {
        const response = await fetch(`${import.meta.env.VITE_API_URL}/api/auth/login`, {
        // const response = await fetch(`http://localhost:8080/api/auth/login`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ username, password }),
        });

        if (response.ok) {
          const data = await response.json();
          
          // Save ID and Username to session storage
          sessionStorage.setItem("volunteerId", data.userId);
          sessionStorage.setItem("username", username); // Add this line
          
          setIsLoggedIn(true);
          setShowLogin(false);
          
          // Route based exactly on the username
          if (username === "admin") {
            navigate("/admin");
          } else {
            navigate("/dashboard");
          }
        } else {
          alert("Invalid username or password");
        }
      } catch (error) {
        console.error("Login failed", error);
      }
    };

  const handleLogout = () => {
    sessionStorage.removeItem("volunteerId");
    sessionStorage.removeItem("username"); 
    setIsLoggedIn(false);
    navigate("/"); 
  };

  return (
    <>
      <header className="sticky top-0 z-40 border-b bg-white/95">
        <div className="container flex h-18 items-center justify-between">
          <Link to="/" className="flex items-center gap-3">
            <img
              src={logo}
              alt="Shashi Jan Kalyan Trust Logo"
              className="h-14 w-14 rounded-full object-contain"
            />
            <div className="leading-tight">
              <div className="font-serif text-xl font-bold text-green-900">
                Shashi Jan Kalyan Trust
              </div>
              <div className="mt-0.5 text-sm font-bold tracking-widest text-green-900">
                SHEIKHPURA · BIHAR
              </div>
            </div>
          </Link>

          <nav className="hidden gap-4 text-sm lg:flex">
            {links.map(([to, n]) => (
              <NavLink
                key={to}
                to={to}
                className={({ isActive }) =>
                  isActive ? "font-bold text-green-700" : ""
                }
              >
                {n}
              </NavLink>
            ))}
          </nav>

          {/* Desktop Buttons */}
          <div className="hidden lg:flex items-center gap-4">
            {isLoggedIn ? (
              <button
                onClick={handleLogout}
                className="rounded-md border-2 border-red-600 px-4 py-2 text-sm font-bold text-red-600 transition-colors hover:bg-red-50"
              >
                Logout
              </button>
            ) : (
              <button
                onClick={() => setShowLogin(true)}
                className="rounded-md border-2 border-green-700 px-4 py-2 text-sm font-bold text-green-700 transition-colors hover:bg-green-50"
              >
                Login
              </button>
            )}
            <Button to="/donate" variant="accent">
              Donate Now
            </Button>
          </div>

          <button
            className="lg:hidden"
            aria-label="Toggle menu"
            onClick={() => setOpen(!open)}
          >
            {open ? <X /> : <Menu />}
          </button>
        </div>

        {/* Mobile Menu */}
        {open && (
          <nav className="grid gap-1 border-t bg-white p-4 lg:hidden">
            {links.map(([to, n]) => (
              <NavLink
                key={to}
                onClick={() => setOpen(false)}
                to={to}
                className="rounded p-3 hover:bg-gray-50"
              >
                {n}
              </NavLink>
            ))}
            <div className="mt-4 flex flex-col gap-3">
              {isLoggedIn ? (
                <button
                  onClick={() => {
                    setOpen(false);
                    handleLogout();
                  }}
                  className="w-full rounded-md border-2 border-red-600 px-4 py-2 font-bold text-red-600 hover:bg-red-50"
                >
                  Logout
                </button>
              ) : (
                <button
                  onClick={() => {
                    setOpen(false);
                    setShowLogin(true);
                  }}
                  className="w-full rounded-md border-2 border-green-700 px-4 py-2 font-bold text-green-700 hover:bg-green-50"
                >
                  Login
                </button>
              )}
              <div onClick={() => setOpen(false)}>
                <Button to="/donate" variant="accent">
                  Donate Now
                </Button>
              </div>
            </div>
          </nav>
        )}
      </header>

      {/* Login Modal Overlay */}
      {showLogin && !isLoggedIn && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm">
          <div className="w-full max-w-md rounded-xl bg-white p-6 shadow-2xl">
            <div className="mb-6 flex items-center justify-between">
              <h2 className="text-2xl font-bold text-green-900">
                Volunteer Login
              </h2>
              <button
                onClick={() => setShowLogin(false)}
                className="rounded-full p-1 text-gray-500 hover:bg-gray-100 hover:text-gray-800"
              >
                <X className="h-6 w-6" />
              </button>
            </div>

            <form onSubmit={handleLoginSubmit} className="flex flex-col gap-5">
              <div>
                <label className="mb-1.5 block text-sm font-semibold text-gray-700">
                  Username
                </label>
                <input
                  type="text"
                  name="username"
                  placeholder="Enter your username"
                  className="w-full rounded-lg border border-gray-300 p-3 text-sm focus:border-green-700 focus:outline-none focus:ring-1 focus:ring-green-700"
                  required
                />
              </div>

              <div>
                <label className="mb-1.5 block text-sm font-semibold text-gray-700">
                  Password
                </label>
                <input
                  type="password"
                  name="password"
                  placeholder="Enter your password"
                  className="w-full rounded-lg border border-gray-300 p-3 text-sm focus:border-green-700 focus:outline-none focus:ring-1 focus:ring-green-700"
                  required
                />
              </div>

              <button
                type="submit"
                className="mt-2 w-full rounded-lg bg-green-700 py-3 font-bold text-white transition-colors hover:bg-green-800"
              >
                Sign In
              </button>
            </form>
          </div>
        </div>
      )}
    </>
  );
}