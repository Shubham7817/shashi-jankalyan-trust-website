export default function PageHero({ title, subtitle }) {
  return (
    <section className="bg-green-900 py-20 text-white">
      <div className="container">
        <p className="font-bold text-amber-300 text-4xl">Shashi Jan Kalyan Trust</p>
        <p className="font-semibold text-amber-300 text-4xl">शशि जन कल्याण ट्रस्ट</p>
        <h1 className="mt-2 text-4xl font-extrabold md:text-6xl">{title}</h1>
        <p className="mt-4 max-w-2xl text-lg text-green-100">{subtitle}</p>
      </div>
    </section>
  );
}
