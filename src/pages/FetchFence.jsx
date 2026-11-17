import { Link } from "react-router-dom";
import { ShieldCheck } from "lucide-react";
import PageHeader from "@/components/common/PageHeader";
import StatusBadge from "@/components/common/StatusBadge";
import EmptyState from "@/components/common/EmptyState";
import { LIBRARIES } from "@/config/ecosystem";

export default function FetchFence() {
  const library = LIBRARIES.find((l) => l.id === "fetchfence");
  return (
    <div className="space-y-8">
      <PageHeader title="FetchFence" description={library.shortDescription}>
        <StatusBadge status={library.status} />
      </PageHeader>

      <EmptyState
        icon={ShieldCheck}
        title="FetchFence isn't available yet"
        description="The library is still in development and has no API endpoint, so there is nothing to run here. This page will become the interface for URL validation and safety checks once it is connected."
      >
        <Link to="/ecosystem" className="text-sm font-medium text-primary hover:underline">
          See how FetchFence fits into URLProbe
        </Link>
      </EmptyState>
    </div>
  );
}
