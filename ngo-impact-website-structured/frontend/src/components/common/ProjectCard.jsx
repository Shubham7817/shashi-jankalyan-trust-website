import Button from "../ui/Button";
export default function ProjectCard({ project, onView }) {
  return (
    <article className="card overflow-hidden">
      <img
        className="h-52 w-full object-cover"
        src={project.image}
        alt={project.name}
      />
      <div className="p-6">
        <span className="text-sm text-green-700">{project.category}</span>
        <h2 className="mt-2 text-xl font-bold">{project.name}</h2>
        <p className="mt-2 text-sm">
          {project.location} • {project.status}
        </p>
        <p className="mt-3">{project.description}</p>
        <b className="mt-3 block">{project.impact}</b>
        <Button className="mt-5" onClick={() => onView(project)}>
          View Project
        </Button>
      </div>
    </article>
  );
}
