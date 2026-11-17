import PageHeader from "@/components/common/PageHeader";
import SectionHeading from "@/components/common/SectionHeading";
import LibraryCard from "@/components/ecosystem/LibraryCard";
import EcosystemDiagram from "@/components/ecosystem/EcosystemDiagram";
import { LIBRARIES } from "@/config/ecosystem";

export default function Ecosystem() {
  return (
    <div className="space-y-14">
      <div className="space-y-4">
        <PageHeader
          title="The URLProbe ecosystem"
          description="URLProbe is a growing ecosystem of developer-focused tools and Python libraries that make working with URLs easier, safer and more informative."
        />
        <p className="max-w-2xl text-muted-foreground">
          Each library solves one specific problem. Use any of them on their own in your projects,
          or through URLProbe Studio.
        </p>
      </div>

      <section aria-labelledby="libraries-heading">
        <SectionHeading
          id="libraries-heading"
          title="Libraries"
          description="Independent Python packages. Some are already available, others are in development."
        />
        <div className="grid gap-4 md:grid-cols-2">
          {LIBRARIES.map((library) => (
            <LibraryCard key={library.id} library={library} />
          ))}
        </div>
        <p className="mt-4 rounded-lg border border-dashed border-border px-4 py-3 text-sm text-muted-foreground">
          More libraries will join the ecosystem as they are ready.
        </p>
      </section>

      <section aria-labelledby="how-heading">
        <SectionHeading
          id="how-heading"
          title="How the ecosystem works"
          description="Libraries do the work, the API exposes it, Studio shows it."
        />
        <EcosystemDiagram />
        <p className="mt-4 text-sm text-muted-foreground">
          Not every library is connected to the API yet. Today, MetaProbe is the only one available
          through Studio.
        </p>
      </section>
    </div>
  );
}
