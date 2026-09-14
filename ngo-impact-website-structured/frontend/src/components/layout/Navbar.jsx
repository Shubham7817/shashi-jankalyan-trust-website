import { useState } from "react";
import { Menu, X } from "lucide-react";
import { Link, NavLink } from "react-router-dom";
import Button from "../ui/Button";
import logo from "../../assets/image2/logo.jpeg";
const links = [
  ["/", "Home"],
  ["/about", "About Us"],
  ["/our-work", "Our Work"],
  // ["/projects", "Projects"],
  // ["/impact", "Impact"],
  ["/gallery", "Gallery"],
  ["/get-involved", "Get Involved"],
  ["/contact", "Contact"],
  // ["/news", "News"],
];
export default function Navbar() {
  const [open, setOpen] = useState(false);
  return (
    <header className="sticky top-0 z-40 border-b bg-white/95">
      <div className="container flex h-18 items-center justify-between">
<Link
  to="/"
  className="flex items-center gap-3"
>
  {/* Logo */}
  <img
    src={logo}
    alt="Shashi Jan Kalyan Trust Logo"
    className="h-14 w-14 rounded-full object-contain"
  />

  {/* Organization Name */}
  <div className="leading-tight">
    <div className="font-serif text-xl font-bold text-green-900">
      Shashi Jan Kalyan Trust
    </div>

    <div className="mt-0.5 text-sm font-bold tracking-widest text-green-900">
      SHEIKHPURA · BIHAR
    </div>
  </div>
</Link>
        <nav className="hidden  gap-4 text-sm lg:flex">
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
        <div className="hidden lg:block">
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
      {open && (
        <nav className="grid gap-1 border-t bg-white p-4 lg:hidden">
          {links.map(([to, n]) => (
            <NavLink
              key={to}
              onClick={() => setOpen(false)}
              to={to}
              className="rounded p-3"
            >
              {n}
            </NavLink>
          ))}
          <div onClick={() => setOpen(false)} className="mt-2">
             <Button to="/donate" variant="accent">
              Donate Now
            </Button>
          </div>
        </nav>
      )}
    </header>
  );
}
