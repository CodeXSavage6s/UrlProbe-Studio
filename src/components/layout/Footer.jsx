import { Link } from "react-router-dom";
import Logo from "@/components/layout/Logo";
import { SITE } from "@/config/site";
import { LIBRARIES, RESOURCES } from "@/config/ecosystem";

const linkClass = "text-sm text-muted-foreground transition-colors hover:text-foreground";

function Column({ title, children }) {
  return (
    <div>
      <h2 className="text-sm font-medium">{title}</h2>
      <ul className="mt-3 space-y-2">{children}</ul>
    </div>
  );
}

export default function Footer() {
  // Only links that actually exist are shown.
  const resources = [
    RESOURCES.githubOrg && { label: "GitHub", href: RESOURCES.githubOrg },
    RESOURCES.docs && { label: "Documentation", href: RESOURCES.docs },
    ...LIBRARIES.filter((l) => l.pypi).map((l) => ({ label: `${l.name} on PyPI`, href: l.pypi })),
  ].filter(Boolean);

  return (
    <footer className="mt-16 border-t border-border">
      <div className="mx-auto grid w-full max-w-5xl gap-10 px-4 py-10 md:grid-cols-[1.5fr_1fr_1fr_1fr] md:px-8">
        <div className="max-w-xs">
          <div className="flex items-center gap-2">
            <Logo className="size-6" />
            <span className="font-semibold">{SITE.name}</span>
          </div>
          <p className="mt-3 text-sm text-muted-foreground">{SITE.description}</p>
        </div>

        <Column title="Tools">
          {LIBRARIES.map((library) => (
            <li key={library.id}>
              <Link to={library.toolPath} className={linkClass}>{library.name}</Link>
            </li>
          ))}
        </Column>

        <Column title="Ecosystem">
          <li><Link to="/ecosystem" className={linkClass}>About URLProbe</Link></li>
          <li><Link to="/" className={linkClass}>Overview</Link></li>
        </Column>

        {resources.length > 0 && (
          <Column title="Resources">
            {resources.map((link) => (
              <li key={link.href}>
                <a href={link.href} target="_blank" rel="noopener noreferrer" className={linkClass}>
                  {link.label}
                </a>
              </li>
            ))}
          </Column>
        )}
      </div>

      <div className="border-t border-border">
        <div className="mx-auto flex w-full max-w-5xl flex-col gap-1 px-4 py-4 text-xs text-muted-foreground sm:flex-row sm:justify-between md:px-8">
          <span>© {new Date().getFullYear()} {SITE.ecosystem}. All rights reserved.</span>
          <span>{SITE.tagline}</span>
        </div>
      </div>
    </footer>
  );
}
