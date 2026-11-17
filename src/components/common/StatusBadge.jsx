import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

const STATUS = {
  available: { label: "Available", className: "border-success/30 bg-success/10 text-success" },
  development: { label: "In development", className: "border-warning/30 bg-warning/10 text-warning" },
  soon: { label: "Coming soon", className: "border-border bg-muted text-muted-foreground" },
};

export default function StatusBadge({ status }) {
  const { label, className } = STATUS[status] ?? STATUS.soon;
  return (
    <Badge variant="outline" className={cn("font-medium", className)}>
      {label}
    </Badge>
  );
}
