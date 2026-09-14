import { useState } from "react";
import SEO from "../components/common/SEO";
import PageHero from "../components/common/PageHero";
import Button from "../components/ui/Button";
import Modal from "../components/ui/Modal";
import ProjectCard from "../components/common/ProjectCard";
import { projects, categories } from "../data/projects";
export default function Projects() {
  const [cat, setCat] = useState("All"),
    [s, setS] = useState(null);
  const list = projects.filter((x) => cat === "All" || x.category === cat);
  return (
    <>
      <SEO title="Projects" description="NGO projects." />
      <PageHero
        title="Projects"
        subtitle="A practical view of current and completed placeholder initiatives."
      />
      <section className="section">
        <div className="container">
          <div className="mb-6 flex flex-wrap gap-2">
            {categories.map((x) => (
              <Button
                key={x}
                variant={cat === x ? "primary" : "outline"}
                onClick={() => setCat(x)}
              >
                {x}
              </Button>
            ))}
          </div>
          {list.length ? (
            <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
              {list.map((x) => (
                <ProjectCard key={x.id} project={x} onView={setS} />
              ))}
            </div>
          ) : (
            <div className="card p-10 text-center">No projects found.</div>
          )}
        </div>
      </section>
      {s && (
        <Modal onClose={() => setS(null)}>
          <h2 className="text-2xl font-bold">{s.name}</h2>
          <p className="mt-3">{s.description}</p>
          <b>{s.impact}</b>
        </Modal>
      )}
    </>
  );
}
