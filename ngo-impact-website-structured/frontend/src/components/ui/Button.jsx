import { Link } from "react-router-dom";
export default function Button({
  to,
  variant = "primary",
  children,
  className = "",
  ...props
}) {
  const c = `btn ${variant} ${className}`;
  return to ? (
    <Link to={to} className={c}>
      {children}
    </Link>
  ) : (
    <button className={c} {...props}>
      {children}
    </button>
  );
}
