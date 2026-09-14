import Button from "../ui/Button";
export default function Hero() {
  return (
    <section
      className=" bg-cover bg-center p-4 text-white"
      style={{
        backgroundImage:
          "linear-gradient(90deg,rgba(10,40,24,.85),rgba(10,40,24,.35)),url(https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?auto=format&fit=crop&w=1800&q=85)",
      }}
    >
      <div className="container flex  items-center">
        <div className="max-w-3xl">
          <h1 className="text-5xl font-extrabold md:text-7xl">
            Together, We Can Create a Better Tomorrow
          </h1>
          <p className="mt-5 text-xl">
            Working with communities to create meaningful and sustainable
            change.
          </p>
          <div className="text-black flex gap-3">
            <Button className="mt-8"  to="/donate" variant="accent">
              Donate Now
            </Button>
            <Button className="mt-8 " to="/get-involved" variant="accent">
              Join Our Mission
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
