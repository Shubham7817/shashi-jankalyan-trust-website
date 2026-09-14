import { useState } from "react";
import SEO from "../components/common/SEO";
import PageHero from "../components/common/PageHero";
import Button from "../components/ui/Button";
import GalleryGrid from "../components/common/GalleryGrid";
import Lightbox from "../components/common/Lightbox";
import { gallery, categories } from "../data/gallery";
export default function Gallery() {
  const [cat, setCat] = useState("All"),
    [i, setI] = useState(null);
  const list = gallery.filter((x) => cat === "All" || x.category === cat);
  return (
    <>
      <SEO title="Gallery" description="NGO photo gallery." />
      <PageHero
        title="Gallery"
        subtitle="Community programs and participation."
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
          <GalleryGrid items={list} onOpen={setI} />
        </div>
      </section>
      {i !== null && (
        <Lightbox
          items={list}
          index={i}
          onClose={() => setI(null)}
          onPrev={() => setI((i - 1 + list.length) % list.length)}
          onNext={() => setI((i + 1) % list.length)}
        />
      )}
    </>
  );
}
