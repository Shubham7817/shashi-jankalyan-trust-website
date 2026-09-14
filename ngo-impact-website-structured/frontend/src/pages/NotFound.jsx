import { Link } from "react-router-dom";
export default function NotFound() {
  return (
    <section className="section text-center">
      <h1 className="text-5xl font-bold">404</h1>
      <p className="mt-3">Page not found.</p>
      <Link to="/" className="btn primary mt-5">
        Back Home
      </Link>
    </section>
  );
}
