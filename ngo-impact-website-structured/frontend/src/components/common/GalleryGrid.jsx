export default function GalleryGrid({ items, onOpen }) {
  if (!items.length)
    return <div className="card p-10 text-center">No images found.</div>;
  return (
    <div className="columns-1 gap-5 sm:columns-2 lg:columns-3">
      {items.map((x, i) => (
        <button
          key={x.id}
          onClick={() => onOpen(i)}
          className="mb-5 block w-full overflow-hidden rounded-xl"
        >
          <img
            className="w-full transition hover:scale-105"
            src={x.image}
            alt={x.alt}
          />
        </button>
      ))}
    </div>
  );
}
