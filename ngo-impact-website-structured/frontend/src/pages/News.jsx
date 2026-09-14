import { useState } from "react";
import SEO from "../components/common/SEO";
import PageHero from "../components/common/PageHero";
import Button from "../components/ui/Button";
import Modal from "../components/ui/Modal";
import { news } from "../data/news";
export default function News() {
  const [s, setS] = useState(null);
  return (
    <>
      <SEO title="News" description="Latest news and events." />
      <PageHero
        title="News & Events"
        subtitle="Latest activities, events and announcements."
      />
      <section className="section">
        <div className="container grid gap-5 md:grid-cols-3">
          {news.map((x) => (
            <article className="card overflow-hidden" key={x.id}>
              <img
                className="h-48 w-full object-cover"
                src={x.image}
                alt={x.title}
              />
              <div className="p-5">
                <small>
                  {x.category} • {x.date}
                </small>
                <h2 className="mt-2 font-bold">{x.title}</h2>
                <p className="mt-3">{x.description}</p>
                <Button className="mt-4" onClick={() => setS(x)}>
                  Read More
                </Button>
              </div>
            </article>
          ))}
        </div>
      </section>
      {s && (
        <Modal onClose={() => setS(null)}>
          <h2 className="text-2xl font-bold">{s.title}</h2>
          <p className="mt-3">{s.description}</p>
          <p className="mt-3">
            [PLACEHOLDER] Full article content can be added later.
          </p>
        </Modal>
      )}
    </>
  );
}
