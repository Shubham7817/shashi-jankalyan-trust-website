import useCounter from "../../hooks/useCounter";
export default function ImpactCounter({ value, label }) {
  const n = useCounter(value);
  return (
    <div className="card p-3 text-center">
      <b className="text-3xl text-green-700">{n.toLocaleString()}+</b>
      <p className="mt-2 text-gray-600">{label}</p>
    </div>
  );
}
