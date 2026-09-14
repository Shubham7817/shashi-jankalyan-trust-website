export default function SectionTitle({ eyebrow, title, text }) {
  return (
    <div className="mb-8 max-w-3xl">
      {eyebrow && <p className="font-bold text-green-700">{eyebrow}</p>}
      <h2 className="mt-2 text-3xl  font-extrabold">{title}</h2>
      {text && <p className="mt-3 text-gray-600">{text}</p>}
    </div>
  );
}
