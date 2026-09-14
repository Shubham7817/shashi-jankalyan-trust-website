export default function TestimonialCard({ item }) {
  return (
    <article className="card p-6">
      <img
        className="h-16 w-16 rounded-full object-cover"
        src={item.image}
        alt={item.name}
      />
      <p className="mt-4">“{item.story}”</p>
      <b className="mt-4 block">{item.name}</b>
      <small>{item.location}</small>
    </article>
  );
}
