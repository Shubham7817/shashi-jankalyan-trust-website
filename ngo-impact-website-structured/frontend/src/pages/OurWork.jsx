import { useState } from "react";
import SEO from "../components/common/SEO";
import PageHero from "../components/common/PageHero";
import Button from "../components/ui/Button";
import Modal from "../components/ui/Modal";
import { focusAreas } from "../data/focusAreas";
import { useNavigate } from "react-router-dom";



export default function OurWork() {
  const navigate = useNavigate();
  const [s, setS] = useState(null);
  return (
    <>
      <SEO title="Our Work" description="NGO focus areas." />
      <PageHero
        title="Women's Skill Development"
        subtitle="Five connected focus areas designed around community priorities."
      />
      <section className="section">
        <div className="container grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          {focusAreas.map((x) => (
            <div className="card overflow-hidden" key={x.title}>
              <img
                className="h-48 w-full object-cover"
                src={x.image}
                alt={x.title}
              />
              <div className="p-5">
                <x.Icon />
                <h2 className="mt-3 text-xl font-bold">{x.title}</h2>
                <p>{x.description}</p>
                <ul className="mt-3 list-disc pl-5">
                  {x.points.map((p) => (
                    <li key={p}>{p}</li>
                  ))}
                </ul>
                <Button className="mt-4" onClick={() => navigate(x.path)}>
                  Learn More
                </Button>
              </div>
            </div>
          ))}
        </div>
      </section>
      {s && (
        <Modal onClose={() => setS(null)}>
          <h2 className="text-2xl font-bold">{s.title}</h2>
          <p className="mt-3">{s.description}</p>
        </Modal>
      )}
    </>
  );
}
