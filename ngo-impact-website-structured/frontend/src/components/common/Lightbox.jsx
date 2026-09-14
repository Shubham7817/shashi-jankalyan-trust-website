import Modal from "../ui/Modal";
import Button from "../ui/Button";
export default function Lightbox({ items, index, onClose, onPrev, onNext }) {
  const x = items[index];
  return (
    <Modal onClose={onClose}>
      <img
        className="max-h-[70vh] w-full object-contain"
        src={x.image}
        alt={x.alt}
      />
      <div className="mt-4 flex justify-between">
        <Button variant="outline" onClick={onPrev}>
          Previous
        </Button>
        <Button variant="outline" onClick={onNext}>
          Next
        </Button>
      </div>
    </Modal>
  );
}
