import { Fragment } from "react";
import { Outlet, useLocation } from "react-router-dom";
import { ChevronRight } from "lucide-react";
import { SidebarInset, SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { Separator } from "@/components/ui/separator";
import AppSidebar from "@/components/layout/AppSidebar";
import Footer from "@/components/layout/Footer";
import { getBreadcrumbs } from "@/config/navigation";

function Breadcrumbs() {
  const { pathname } = useLocation();
  const crumbs = getBreadcrumbs(pathname);
  return (
    <nav aria-label="Breadcrumb" className="flex min-w-0 items-center gap-1.5 text-sm">
      {crumbs.map((crumb, index) => {
        const last = index === crumbs.length - 1;
        return (
          <Fragment key={crumb}>
            {index > 0 && <ChevronRight className="size-3.5 shrink-0 text-muted-foreground" />}
            <span
              className={last ? "truncate font-medium" : "hidden text-muted-foreground sm:inline"}
              aria-current={last ? "page" : undefined}
            >
              {crumb}
            </span>
          </Fragment>
        );
      })}
    </nav>
  );
}

// The frame around every page. SidebarProvider holds the open/closed state,
// <Outlet /> is where the router renders the current page.
export default function AppLayout() {
  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset className="min-w-0">
        <header className="sticky top-0 z-10 flex h-14 shrink-0 items-center gap-2 border-b border-border bg-background/80 px-4 backdrop-blur">
          <SidebarTrigger className="-ml-1" />
          <Separator orientation="vertical" className="mr-1 h-4" />
          <Breadcrumbs />
        </header>

        <div className="flex-1">
          <div className="mx-auto w-full max-w-5xl px-4 py-8 md:px-8 md:py-12">
            <Outlet />
          </div>
        </div>

        <Footer />
      </SidebarInset>
    </SidebarProvider>
  );
}
