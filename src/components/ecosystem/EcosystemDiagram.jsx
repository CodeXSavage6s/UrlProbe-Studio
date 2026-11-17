import { ArrowRight } from "lucide-react";
import { Package, Server, LayoutDashboard } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

const STEPS = [
  {
    icon: Package,
    title: "Python libraries",
    text: "Independent packages, each focused on one problem. Install and use them on their own.",
  },
  {
    icon: Server,
    title: "UrlProbe API",
    text: "A FastAPI service that exposes selected library functionality over HTTP.",
  },
  {
    icon: LayoutDashboard,
    title: "URLProbe Studio",
    text: "This interface. It calls the API and presents the results visually.",
  },
];

export default function EcosystemDiagram() {
  return (
    <div className="flex flex-col items-stretch gap-3 md:flex-row md:items-center">
      {STEPS.map((step, index) => {
        const Icon = step.icon;
        return (
          <div key={step.title} className="contents">
            <Card className="flex-1">
              <CardContent className="p-5">
                <div className="flex size-9 items-center justify-center rounded-md border border-border bg-muted text-primary">
                  <Icon className="size-4" />
                </div>
                <h3 className="mt-3 font-medium">{step.title}</h3>
                <p className="mt-1 text-sm text-muted-foreground">{step.text}</p>
              </CardContent>
            </Card>
            {index < STEPS.length - 1 && (
              <ArrowRight
                className="size-5 shrink-0 self-center rotate-90 text-muted-foreground md:rotate-0"
                aria-hidden="true"
              />
            )}
          </div>
        );
      })}
    </div>
  );
}
