import { Link, useLocation } from "react-router-dom";
import { ChevronRight } from "lucide-react";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuBadge,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
  SidebarRail,
  useSidebar,
} from "@/components/ui/sidebar";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import Logo from "@/components/layout/Logo";
import { navigation, isActivePath } from "@/config/navigation";
import { SITE } from "@/config/site";
import { API_BASE_URL } from "@/services/api";
import { useApiStatus } from "@/hooks/useApiStatus";
import { cn } from "@/lib/utils";

// One sidebar entry. If the item has `children` it becomes an expandable group
// (a library with several functions); otherwise it is a plain link.
function NavItem({ item, pathname, onNavigate }) {
  const Icon = item.icon;

  if (item.children?.length) {
    const inside = isActivePath(pathname, item.url);
    return (
      <Collapsible asChild defaultOpen={inside} className="group/collapsible">
        <SidebarMenuItem>
          <CollapsibleTrigger asChild>
            <SidebarMenuButton tooltip={item.title}>
              <Icon />
              <span>{item.title}</span>
              <ChevronRight className="ml-auto transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90" />
            </SidebarMenuButton>
          </CollapsibleTrigger>
          <CollapsibleContent>
            <SidebarMenuSub>
              {item.children.map((child) => (
                <SidebarMenuSubItem key={child.url}>
                  <SidebarMenuSubButton asChild isActive={isActivePath(pathname, child.url)}>
                    <Link to={child.url} onClick={onNavigate}>
                      <span>{child.title}</span>
                    </Link>
                  </SidebarMenuSubButton>
                </SidebarMenuSubItem>
              ))}
            </SidebarMenuSub>
          </CollapsibleContent>
        </SidebarMenuItem>
      </Collapsible>
    );
  }

  return (
    <SidebarMenuItem>
      <SidebarMenuButton
        asChild
        tooltip={item.title}
        isActive={isActivePath(pathname, item.url, item.exact)}
      >
        <Link to={item.url} onClick={onNavigate}>
          <Icon />
          <span>{item.title}</span>
        </Link>
      </SidebarMenuButton>
      {item.badge && <SidebarMenuBadge>{item.badge}</SidebarMenuBadge>}
    </SidebarMenuItem>
  );
}

const STATUS_TEXT = {
  checking: "Checking API…",
  online: "API connected",
  offline: "API unreachable",
};
const STATUS_DOT = {
  checking: "bg-muted-foreground animate-pulse",
  online: "bg-success",
  offline: "bg-destructive",
};

function ApiStatus() {
  const status = useApiStatus();
  return (
    <div
      className="flex items-center gap-2 rounded-md px-2 py-1.5 text-xs text-sidebar-foreground/80 group-data-[collapsible=icon]:justify-center"
      title={API_BASE_URL}
    >
      <span className={cn("size-2 shrink-0 rounded-full", STATUS_DOT[status])} aria-hidden="true" />
      <span className="truncate group-data-[collapsible=icon]:hidden">{STATUS_TEXT[status]}</span>
    </div>
  );
}

export default function AppSidebar(props) {
  const { pathname } = useLocation();
  const { setOpenMobile } = useSidebar();
  const closeMobile = () => setOpenMobile(false);

  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg" asChild>
              <Link to="/" onClick={closeMobile}>
                <div className="flex aspect-square size-8 items-center justify-center rounded-md border border-sidebar-border bg-sidebar-accent/50 text-sidebar-foreground">
                  <Logo className="size-5" />
                </div>
                <div className="grid flex-1 text-left leading-tight">
                  <span className="truncate font-semibold">{SITE.ecosystem}</span>
                  <span className="truncate text-xs text-muted-foreground">Studio</span>
                </div>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>

      <SidebarContent>
        {navigation.map((group) => (
          <SidebarGroup key={group.label}>
            <SidebarGroupLabel>{group.label}</SidebarGroupLabel>
            <SidebarMenu>
              {group.items.map((item) => (
                <NavItem key={item.url} item={item} pathname={pathname} onNavigate={closeMobile} />
              ))}
            </SidebarMenu>
          </SidebarGroup>
        ))}
      </SidebarContent>

      <SidebarFooter>
        <ApiStatus />
        <p className="px-2 pb-1 text-xs text-muted-foreground group-data-[collapsible=icon]:hidden">
          v{SITE.version}
        </p>
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}
